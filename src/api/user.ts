import type { ApiResponsePromise } from "@/types/common";
import type { User } from "@/types/user";
import { get, post } from "@/api/http";

const apiGroup = "/api/v1/user";

export default {
  updateUserInfo(params: {
    nickname?: string;
    avatar?: string;
  }): ApiResponsePromise<User> {
    return post(apiGroup + "/update-user-info", params);
  },
  autoLogin(): ApiResponsePromise<{ user: User; authorization: string }> {
    return get(apiGroup + "/auto-login");
  },
};
