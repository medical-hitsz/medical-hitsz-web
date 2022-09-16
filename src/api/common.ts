import type { ApiResponsePromise } from "@/types/common";
import type { CosConfig, CosSecret } from "@/types/service";
import { get } from "@/utils/http";

const apiGroup = "/api/v1/common";

export default {
  cosTempSecret(): ApiResponsePromise<CosSecret> {
    return get(apiGroup + "/cos-temp-secret");
  },
  cosConfig(): ApiResponsePromise<CosConfig> {
    return get(apiGroup + "/cos-config");
  },
};
