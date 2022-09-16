<script setup lang="ts">
import { computed, ref } from "vue";
import COS from "cos-js-sdk-v5";
import commonApi from "@/api/common";
import {
  ElMessage,
  type UploadRawFile,
  type UploadRequestOptions,
} from "element-plus";
import { nanoid } from "nanoid";
import { getFormat } from "@/utils/common";
import type { CosConfig } from "@/types/service";

const props = defineProps<{
  modelValue: string;
  size?: number;
}>();
const emit = defineEmits(["update:modelValue"]);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
const size = computed(() => props.size || 80);

const loading = ref(false);
const cosConfig = ref<CosConfig>({
  directory: "",
  bucket: "",
  region: "",
});

commonApi
  .cosConfig()
  .then((res) => {
    cosConfig.value = res.data;
  })
  .catch();

const cos = new COS({
  getAuthorization: function (_, callback) {
    commonApi.cosTempSecret().then((res) => {
      const secret = res.data;
      const { credentials } = secret;
      const callbackParams = {
        TmpSecretId: credentials.TmpSecretId,
        TmpSecretKey: credentials.TmpSecretKey,
        SecurityToken: credentials.Token,
        StartTime: secret.startTime,
        ExpiredTime: secret.expiredTime,
      };
      callback(callbackParams);
    });
  },
});

const beforeAvatarUpload = (file: UploadRawFile) => {
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    ElMessage.error("上传头像图片大小不能超过 5MB!");
  }
  return isLt2M;
};

const upload = (res: UploadRequestOptions) => {
  loading.value = true;
  if (res.file) {
    cos.putObject(
      {
        Bucket: cosConfig.value.bucket, // 存储桶
        Region: cosConfig.value.region, // 存储桶所在地域，必须字段
        Key: cosConfig.value.directory + nanoid() + getFormat(res.file.name), // 文件名
        StorageClass: "STANDARD", // 上传模式，标准模式
        Body: res.file, // 上传文件对象
      },
      (_, data) => {
        if (data.statusCode === 200) {
          const urlImg = `https://${data.Location}`;
          value.value = urlImg;
          loading.value = false;
        }
      }
    );
  } else {
    ElMessage.error("未找到文件！");
  }
};
</script>

<template>
  <el-upload
    v-loading="loading"
    action="#"
    class="avatar-upload"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="upload"
    accept="image/*"
  >
    <el-avatar :size="size" :src="value" />
    <div class="avatar-upload-mask">
      <el-icon :size="size / 2">
        <Upload />
      </el-icon>
    </div>
  </el-upload>
</template>

<style lang="scss" scoped>
.avatar-upload {
  :deep(.el-upload) {
    position: relative;
    .avatar-upload-mask {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      line-height: 100%;
      border-radius: 50%;
      opacity: 0;
      color: var(--my-white);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:hover {
      .avatar-upload-mask {
        background-color: rgba($color: black, $alpha: 0.5);
        opacity: 0.8;
      }
    }
  }
}
</style>
