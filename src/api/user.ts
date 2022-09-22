import type { ApiResponsePromise } from "@/types/common";
import type { User } from "@/types/service";
import { get, post } from "@/api/http";

const apiGroup = "/api/v1/user";

export default {
  autoLogin(): ApiResponsePromise<{ user: User; authorization: string }> {
    return get(apiGroup + "/auto-login");
  },
  updateUserInfo(params: {
    nickname?: string;
    avatar?: string;
  }): ApiResponsePromise<User> {
    return post(apiGroup + "/update-user-info", params);
  },
  getUserInfo(): ApiResponsePromise<User> {
    return get(apiGroup + "/get-user-info");
  },
};
