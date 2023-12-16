<template>
  <page-container :title="title">
    <a-card class=" text-main">
      <div class="px-8 py-10">
        <div class="hot-topic">
          <nav class="w-full">
            <ul class="flex w-full overflow-auto">
              <li class="relative">
                <button>
                  <span class="text-2xl font-semibold">
                    今日热门
                  </span>
                </button>
              </li>
            </ul>
          </nav>
          <div class="divider"></div>

          <div class="flex justify-between w-full mt-4 space-x-24 overflow-auto">
            <div v-for="index in [1, 2]" :key="index" class="flex flex-col flex-1">
              <div class="flex px-2 py-1 sub-title">
                <div class="w-[60%]">
                  <span>系列</span>
                </div>
                <div class="w-[20%] text-right">
                  <span>地板价</span>
                </div>
                <div class="w-[20%] text-right">
                  <span>交易量</span>
                </div>
              </div>
              <div class="relative w-full">
                <div v-for="(item, i) in hotTopics.slice((index - 1) * 5, index * 5)">
                  <a class="flex px-2 py-3 transition-colors">
                    <div class="w-[60%] flex items-center relative">
                      <div class="mr-[9px] label w-[23px]">
                        <span>{{ i + 1 + ((index - 1) * 5) }}</span>
                      </div>
                      <div class="flex items-center">
                        <div class="relative overflow-hidden w-[72px] h-[72px] rounded-xl image">
                          <img :src="`/images/topics/${i + 1 + ((index - 1) * 5)}.avif`">
                        </div>
                        <div class="flex pl-6">
                          <div class="max-w-[296px]">
                            <span class="w-full text-base font-semibold black whitespace-nowrap overflow-ellipsis ">
                              {{ item.label }}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div class="w-[20%] flex items-center justify-end">
                      <span class="text-base font-semibold black">
                        {{ item.price }}
                      </span>
                    </div>
                    <div class="w-[20%] flex items-center justify-end">
                      <span class="text-base font-semibold black">
                        {{ item.count }}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="mt-12">
          <div class="text-2xl font-semibold"></div>
        </div> -->
      </div>
    </a-card>
  </page-container>
</template>
<script setup lang="ts">
import { hotTopics } from "./data"
const route = useRoute()
const { title } = route.meta
</script>

<style lang="less" scoped>
nav {
  ul {
    margin-bottom: 0;
  }

  button {
    display: flex;
    padding: 0px 0px 16px;
    cursor: pointer;
    overflow: unset;

    &::after {
      transition: background-color 0.25s ease-in-out 0s;
      background-color: rgb(4, 17, 29);
      bottom: 0%;
      content: "";
      display: block;
      height: 2px;
      left: 0px;
      position: absolute;
      width: 100%;
    }
  }
}

.divider {
  border-width: 0.5px;
  border-style: solid;
  border-color: rgba(229, 232, 235, 0.5);
  margin: unset;
}

.sub-title {
  span {
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
    color: rgb(100, 109, 117);
  }
}

.label {
  span {
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    color: rgb(100, 109, 117);
  }
}

.image {
  &::after {
    display: block;
    content: "";
    position: absolute;
    inset: 0px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
}

.black {
  color: rgb(4, 17, 29);
}

a {
  background-color: white;


  &:hover {
    background-color: rgba(229, 232, 235, 0.2);
  }
}
</style>