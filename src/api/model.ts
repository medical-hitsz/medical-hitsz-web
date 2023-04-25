import type { ApiResponsePromise } from "@/types/common";
import type { Model } from "@/types/service";
import { get, post } from "@/api/http";

const apiGroup = "/api/v1/model";

export default {
  getModelList(): ApiResponsePromise<Model[]> {
    return get(apiGroup + "/get-model-list");
  },
  create(modelName: string): ApiResponsePromise<Model> {
    return post(apiGroup + "/create", { modelName });
  },
};
