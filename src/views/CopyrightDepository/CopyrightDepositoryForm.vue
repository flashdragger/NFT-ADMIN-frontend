<template>
  <page-container :title="backRoute()">
    <a-card>
      <a-steps :items="stepItems" :current="currentStep"></a-steps>
      <div class="mt-4 ">
        <UploadWork :modelData="modelData" v-if="currentStep === 0" @nextStep="nextStep" />
        <FillAuthor :modelData="modelData" v-if="currentStep === 1" @nextStep="nextStep" @prev-step="prevStep" />
        <CompleteInfo :modelData="modelData" v-if="currentStep === 2" @nextStep="nextStep" @prev-step="prevStep" />
        <SubmitCertificate :modelData="modelData" v-if="currentStep === 3" @prev-step="prevStep" />
      </div>
    </a-card>
  </page-container>
</template>
<script lang="ts" setup>
import { backRoute } from "@/components/backRoute"
import { UploadWork, FillAuthor, CompleteInfo, SubmitCertificate } from "./components"
const stepItems = [
  {
    title: "上传作品"
  },
  {
    title: "填写著作人"
  },
  {
    title: "完善信息"
  },
  {
    title: "提交相关证明"
  }
]
const router = useRouter()
const modelData = ref<any>({})


const currentStep = ref<number>(0)


function nextStep(data: any) {
  currentStep.value += 1
  Object.assign(modelData, data)
}

function prevStep() {
  currentStep.value -= 1
}
</script>