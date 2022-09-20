<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import {
  filterNumberString,
  phoneNumberFormat,
  msgCodeFormat,
} from "@/utils/common";
import { ElMessage } from "element-plus";
import userLoginApi from "@/api/user-login";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

enum MsgCodeStatus {
  Init = "Init",
  Load = "Load",
  Count = "Count",
}

const formRef = ref();
const countCanvasRef = ref();

const userStore = useUserStore();
const router = useRouter();

const form = reactive({
  tel: "",
  msgCode: "",
});
const loading = ref(false);

const msgCodeTime = ref(0);
const msgCodeStatus = ref(MsgCodeStatus.Init);
const msgCodeCanSend = computed(() => {
  return (
    phoneNumberFormat(form.tel) && msgCodeStatus.value === MsgCodeStatus.Init
  );
});
const formCanSubmit = computed(() => {
  return phoneNumberFormat(form.tel) && msgCodeFormat(form.msgCode);
});
const msgCodeInterval: { value: NodeJS.Timeout | null } = ref(null);
const msgTimerStart = () => {
  msgCodeStatus.value = MsgCodeStatus.Count;
  msgCodeTime.value = 60;
  const endTime = new Date().valueOf() + 60 * 1000;
  msgCodeInterval.value = setInterval(() => {
    const sub = endTime - new Date().valueOf();
    if (sub > 0) {
      msgCodeTime.value = Math.ceil(sub / 1000);
    } else {
      clearInterval(Number(msgCodeInterval.value));
      msgCodeTime.value = 0;
      msgCodeStatus.value = MsgCodeStatus.Init;
    }
  }, 100);
};
const drawCountCanvas = (count: number) => {
  if (!countCanvasRef.value || msgCodeStatus.value !== MsgCodeStatus.Count) {
    return;
  }
  const ctx: CanvasRenderingContext2D = countCanvasRef.value.getContext("2d");
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio = 1;
  const ratio = devicePixelRatio / backingStoreRatio;
  countCanvasRef.value.height = 28 * ratio;
  countCanvasRef.value.width = 28 * ratio;
  ctx.scale(ratio, ratio);
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 28, 28);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#e0e0e0";
  ctx.arc(14, 14, 11, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.strokeStyle = "#409eff";
  ctx.arc(
    14,
    14,
    11,
    -Math.PI / 2,
    -Math.PI / 2 + (2 * Math.PI * count) / 60,
    false
  );
  ctx.stroke();
};
watch(msgCodeTime, (val) => {
  nextTick(() => drawCountCanvas(val));
});
const handleSendMsgCode = async () => {
  if (!msgCodeCanSend.value) {
    return;
  }
  msgCodeStatus.value = MsgCodeStatus.Load;
  userLoginApi
    .sendMsgCode({ tel: form.tel })
    .then(() => {
      ElMessage.success("验证码已发送！");
      msgTimerStart();
    })
    .catch(() => {
      msgCodeStatus.value = MsgCodeStatus.Init;
    });
};

const phoneNumberValidator = (
  _: never,
  value: string,
  callback: (err?: Error) => void
) => {
  if (!value) {
    callback(new Error("请输入手机号!"));
  } else if (!phoneNumberFormat(value)) {
    callback(new Error("请输入正确的手机号!"));
  } else {
    callback();
  }
};
const msgcodeValidator = (
  _: never,
  value: string,
  callback: (err?: Error) => void
) => {
  if (!value) {
    callback(new Error("请输入短信验证码!"));
  } else if (!msgCodeFormat(value)) {
    callback(new Error("请输入正确的短信验证码!"));
  } else {
    callback();
  }
};

const rules = reactive({
  tel: [{ required: true, validator: phoneNumberValidator, trigger: "blur" }],
  msgCode: [{ required: true, validator: msgcodeValidator, trigger: "blur" }],
});

const inputFocus = reactive({
  tel: false,
  msgCode: false,
});
const handleFocus = (prop: "tel" | "msgCode", focus: boolean) => {
  inputFocus[prop] = focus;
  if (formRef.value?.clearValidate) {
    formRef.value.clearValidate([prop]);
  }
};
const labelTransfer = computed(() => {
  return {
    tel: form.tel || inputFocus.tel,
    msgCode: form.msgCode || inputFocus.msgCode,
  };
});

const handleTelInput = (value: string) => {
  form.tel = filterNumberString(value, 11);
  if (formRef.value?.clearValidate) {
    formRef.value.clearValidate(["tel"]);
  }
};
const handleMsgCodeInput = (value: string) => {
  form.msgCode = filterNumberString(value, 6);
  if (formRef.value?.clearValidate) {
    formRef.value?.clearValidate(["msgCode"]);
  }
};
const handleSubmit = async () => {
  await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return;
    }
    loading.value = true;
    userLoginApi
      .login(form)
      .then((res) => {
        const { data } = res;
        userStore.login(data.user, data.authorization);
        router.replace("/");
      })
      .catch()
      .finally(() => {
        loading.value = false;
      });
  });
};
</script>

<template>
  <el-form
    class="common-view login-view"
    ref="formRef"
    :model="form"
    :rules="rules"
    size="large"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
  >
    <div class="common-title">登录</div>
    <el-form-item prop="tel" class="form-item">
      <div
        class="form-label"
        :class="{ 'form-label-transfer': labelTransfer.tel }"
      >
        手机号
      </div>
      <el-input
        class="form-input"
        :modelValue="form.tel"
        @input="handleTelInput"
        @focus="handleFocus('tel', true)"
        @blur="handleFocus('tel', false)"
      />
    </el-form-item>
    <el-form-item prop="msgCode" class="form-item">
      <div
        class="form-label"
        :class="{ 'form-label-transfer': labelTransfer.msgCode }"
      >
        短信验证码
      </div>
      <div
        class="msg-icon-container"
        :class="{ 'msg-icon-container-allowed': msgCodeCanSend }"
        @click="handleSendMsgCode"
      >
        <el-icon v-if="msgCodeStatus === MsgCodeStatus.Init" class="msg-icon">
          <Promotion />
        </el-icon>
        <el-icon
          v-if="msgCodeStatus === MsgCodeStatus.Load"
          class="msg-icon is-loading"
        >
          <Loading />
        </el-icon>
        <div class="clock" v-if="msgCodeStatus === MsgCodeStatus.Count">
          <canvas
            width="28"
            height="28"
            class="clock-canvas"
            ref="countCanvasRef"
          />
          <div class="clock-count">{{ msgCodeTime }}</div>
        </div>
      </div>
      <el-input
        class="form-input"
        :modelValue="form.msgCode"
        @input="handleMsgCodeInput"
        @focus="handleFocus('msgCode', true)"
        @blur="handleFocus('msgCode', false)"
        @keyup.enter="handleSubmit"
      />
    </el-form-item>
    <el-button
      class="login-submit"
      :class="{ 'login-submit-allowed': formCanSubmit }"
      type="primary"
      plain
      @click="handleSubmit"
    >
      <span class="login-submit-text">提交</span>
    </el-button>
  </el-form>
</template>

<style lang="scss" scoped>
.login-view {
  width: 250px;
  .form-item {
    position: relative;
    $length: 28px;
    .form-label {
      position: absolute;
      left: 15px;
      top: 32px;
      font-size: 15px;
      transition: 0.5s;
      color: #aaabba;
      line-height: 15px;
      user-select: none;
    }
    .form-label-transfer {
      left: 0;
      font-size: 12px;
      top: 0;
      color: var(--el-color-primary);
      line-height: 12px;
    }
    .msg-icon-container {
      position: absolute;
      z-index: 100;
      width: $length;
      height: $length;
      right: 7px;
      top: 26px;
      cursor: not-allowed;
      border-radius: 5px;
      transition: 0.3s;
      color: #aaabba;
      .msg-icon {
        margin: 2px;
        font-size: 24px;
        line-height: 24px;
        transition: 0.3s;
      }
      .is-loading {
        color: var(--el-color-primary);
      }
    }
    .msg-icon-container-allowed {
      cursor: pointer;
      color: var(--el-color-primary);
      transition: 0.3s;
      @mixin opacity-change() {
        0% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.5;
        }
      }
      @keyframes opacity-change {
        @include opacity-change();
      }
      @-webkit-keyframes opacity-change {
        @include opacity-change();
      }
      @-moz-keyframes opacity-change {
        @include opacity-change();
      }
      @-o-keyframes opacity-change {
        @include opacity-change();
      }
      $opacity-change: opacity-change 1s ease-in-out infinite;
      animation: $opacity-change;
      -webkit-animation: $opacity-change;
      -moz-animation: $opacity-change;
      -o-animation: $opacity-change;
      &:hover {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
        -webkit-animation: none;
      }
    }
    .clock {
      width: $length;
      height: $length;
      position: relative;
      .clock-canvas {
        width: $length;
        height: $length;
      }
      .clock-count {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: var(--el-color-primary);
      }
    }
    .form-input {
      margin-top: 20px;
      :deep(.el-input__wrapper) {
        background-color: transparent;
      }
      :deep(.el-input__inner) {
        letter-spacing: 1px;
        font-size: 15px;
      }
    }
  }
  .login-submit {
    width: 100px;
    transition: 0.2s;
    margin-top: 20px;
    .login-submit-text {
      letter-spacing: 2px;
      transition: 0.2s;
    }
  }
}
</style>
