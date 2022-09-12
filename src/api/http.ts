import type { ApiResponsePromise } from "@/types/common";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application-json/x-www-form-urlencoded;charset=utf-8",
  },
});

request.interceptors.request.use(
  (config) => {
    const store = useUserStore();
    config.headers.authorization = store.authorization;
    return config;
  },
  (error) => {
    ElMessage.error("请求发送失败！");
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (res) => {
    if (res.status !== 200 || res.data?.code !== 200) {
      const errMsg = res.data?.msg || "请求出错！";
      ElMessage.error(errMsg);
      return Promise.reject(errMsg);
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    ElMessage.error("请求出错！");
    return Promise.reject(error);
  }
);

export function get(
  path: string,
  params?: { [index: string]: string }
): ApiResponsePromise<any> {
  let targetPath = path;
  if (params) {
    targetPath += "?";
    const first = true;
    for (const k in params) {
      if (!first) {
        targetPath = targetPath + "&";
      }
      targetPath = targetPath + k + "=" + params[k];
    }
  }
  return request({
    method: "get",
    url: targetPath,
  }) as any;
}

export function post(path: string, params: any): ApiResponsePromise<any> {
  return request({
    method: "post",
    url: path,
    data: params,
  }) as any;
}
