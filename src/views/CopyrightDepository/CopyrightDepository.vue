<template>
  <page-container :title="title">
    <a-card>
      <a-typography>
        <a-typography-title :level="4" class="text-center">版权声明</a-typography-title>
        <a-typography-paragraph>
          一、本网站所有原创作品，其版权属于本网站所有。其他媒体、网站或个人转载使用时不得进行商业性的原版原式的转载，也不得歪曲和篡改本网站所发布的内容。如转载须注明文章来源。
          <br />

          二、本网站转载其它媒体作品的目的在于传递更多信息，并不代表本网站赞同其观点和对其真实性负责；其他媒体、网站或个人转载使用时必须保留本站注明的文章来源，并自负法律责任。
          <br />
          三、被本网站授权使用的单位，不应超越授权范围。
          <br />
          四、本网站提供的资料如与相关纸质文本不符，以纸质文本为准。
          <br />
          五、如因作品内容、版权和其它问题需要同本网站联系的，请在本网站发布该作品后的30日内进行。
        </a-typography-paragraph>
      </a-typography>

      <div class="flex justify-center mt-4">
        <a-button type="primary" @click="edit" size="large">
          版权存证
        </a-button>
      </div>
    </a-card>
  </page-container>
</template>
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { title } = route.meta

function edit() {
  router.push({ path: "/CopyrightDepository/form" })
}
</script>
