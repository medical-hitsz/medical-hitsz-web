import type { ApiResponsePromise } from "@/types/common";
import type { User } from "@/types/user";
import { post } from "@/api/http";

const apiGroup = "/api/v1/user-login";

export default {
  sendMsgCode(params: { tel: string }): ApiResponsePromise<null> {
    return post(apiGroup + "/send-msg-code", params);
  },
  login(params: {
    tel: string;
    msgCode: string;
  }): ApiResponsePromise<{ user: User; authorization: string }> {
    return post(apiGroup + "/login", params);
  },
};
