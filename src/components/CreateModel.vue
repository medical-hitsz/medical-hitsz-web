<script setup lang="ts">
import { computed, reactive } from "vue";
import modelApi from "@/api/model";
import type { Model } from "@/types/service";
import { ElMessageBox } from "element-plus";

const modelList = reactive<Model[]>([]);

const tableData = computed(() => {
  return modelList.map((v: Model) => {
    return { runningStatusText: v.runningStatus ? "运行中" : "未运行", ...v };
  });
});

const getModelList = async () => {
  try {
    const res = await modelApi.getModelList();
    const _modelList = res.data || [];
    modelList.splice(0);
    modelList.push(..._modelList);
  } catch {
    return;
  }
};

const createModel = async (modelName: string) => {
  try {
    console.log(modelName);
    const res = await modelApi.create(modelName);
    getModelList();
    const model = res.data;
    ElMessageBox.alert(
      `<div>你模型id为<span style="color:red;font-weight:bold;"> ${model.modelId} </span></div>
      <div>你申请的模型16位秘钥为：</div>
      <div style="color:red;font-weight:bold;font-size:20px;margin:10px 0;">${model.modelSecret}</div>
      <div>关闭窗口后无法再次获取，请妥善保存!<div>`,
      "模型秘钥",
      {
        confirmButtonText: "确认关闭",
        dangerouslyUseHTMLString: true,
      }
    );
  } catch {
    return;
  }
};

const handleCreateModel = async () => {
  try {
    const { value } = await ElMessageBox.prompt(
      '<span style="color:red">***目前仅对管理员开放***</span>',
      "新建模型",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (val: string) => {
          return val ? true : "模型名称不能为空！";
        },
        inputErrorMessage: "模型名称不能为空！",
        inputPlaceholder: "请输入模型名称",
        dangerouslyUseHTMLString: true,
      }
    );
    createModel(value);
  } catch {
    return;
  }
};

getModelList();
</script>

<template>
  <div class="create-model">
    <div class="create-model-head">
      <div class="create-model-title">模型一览</div>
      <el-button
        @click="handleCreateModel"
        type="primary"
        class="chat-room-list-create"
      >
        新建模型
      </el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="modelId" label="模型号" width="70" />
      <el-table-column prop="modelName" label="模型名称" />
      <el-table-column prop="runningStatusText" label="运行状态" width="90" />
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.create-model {
  margin: 20px;
  .create-model-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .create-model-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--my-gray-dark-1);
      height: 50px;
      line-height: 50px;
    }
    margin-bottom: 15px;
  }
}
</style>
