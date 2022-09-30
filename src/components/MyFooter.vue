<script setup lang="ts">
import { BeianUrl } from "@/constants/url";
</script>

<template>
  <footer class="my-footer">
    <div class="my-footer-title">
      <router-link to="/">智能诊疗会话系统</router-link>
    </div>
    <div class="my-footer-text">
      <a href="https://beian.miit.gov.cn" target="_blank">
        粤ICP备 2022117057号-1
      </a>
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502009416"
        target="_blank"
      >
        <img :src="BeianUrl" class="my-footer-text-icon" />
        <span>粤公网安备 44030502009416号</span>
      </a>
    </div>
    <div class="my-footer-text">
      <a href="mailto:1731019653@qq.com" target="_blank">意见反馈</a>
      <a href="mailto:1731019653@qq.com" target="_blank">关于我们</a>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.my-footer {
  width: 100%;
  color: var(--my-gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  border-top: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow: 0px -1px 3px 1px rgba(0, 0, 0, 0.09);
  padding: 20px 0;
  > * {
    margin: 5px 0;
  }
  a {
    color: var(--my-gray);
    text-decoration: none;
    margin: 0 5px;
    &:hover {
      color: var(--el-color-primary);
    }
  }
  .my-footer-title {
    font-size: 15px;
  }
  .my-footer-text {
    line-height: 15px;
    font-size: 12px;
    .my-footer-text-icon {
      height: 13px;
      margin-right: 2px;
      vertical-align: middle;
    }
  }
}
</style>
