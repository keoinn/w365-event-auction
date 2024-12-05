<template>
  <v-container
    class="fill-height ma-0 pa-0"
    :style="{ backgroundImage: `url(${background_image})`, backgroundSize: 'cover' }"
    fluid
  >
    <v-container max-height="100%" max-width="85%">
      <v-row justify="center" align="center">
        <v-col cols="5">
          <v-row>
            <v-col cols="12" align="center">
              <h1>{{ title }}</h1>
            </v-col>
          </v-row>

          <!-- 作者 -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                class="detailed-input"
                :model-value="author"
                readonly
              >
                <template #label>
                  <span class="detailed-label">作者</span>
                </template>
              </v-text-field>
            </v-col>

            <!-- 來源 -->
            <v-col cols="6">
              <v-text-field
                class="detailed-input"
                :model-value="source"
                readonly
              >
                <template #label>
                  <span class="detailed-label">來源</span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-maska="options"
                class="detailed-input"
                :model-value="start_price"
                readonly
              >
                <template #label>
                  <span class="detailed-label">起標價</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                class="detailed-input"
                :model-value="bidder"
                readonly
              >
                <template #label>
                  <span class="detailed-label">得標人</span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-maska="options"
                class="auction-input"
                :model-value="current_price"
                readonly
              >
                <template #label>
                  <span class="detailed-label">競拍價格</span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-carousel
            show-arrows="hover"
            max-height="400"
            hide-delimiters
            cycle
            :interval="3000"
          >
            <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" />
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import background_image from '@/assets/images/auction-background.jpg'
import { ref } from 'vue'
import { vMaska } from "maska/vue"

const options = { 
    mask: '9,99# 元',
    tokens: {
      9: { pattern: /[0-9]/, repeated: true },
    },
    reversed: true
  };

const title = ref('斜倚倦容《40F 金色美人》')
const author = ref('梁奕焚')
const source = ref('洛德藝術')
const start_price = ref(250000)
const bidder = ref('商品競拍中')
const current_price = ref(1250000)
const items = ref([
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
  },
  {
    src: 'https://e365.synet-app.com//img/upload/product/371_20230810164258.png'
  }
])
</script>

<style lang="scss">
.detailed-input {
  .detailed-label {
    color: #fff !important;
    font-size: 20px;
    font-weight: bold;
    text-decoration: underline;
  }
  .v-field__input {
    color: #fff !important;
    // padding-left: 100px !important;
    text-align: center;
    padding-top: 30px;
    font-size: 20px;
    font-weight: bold;
  }
}

.auction-input {
  .detailed-label {
    color: #fff !important;
    font-size: 30px;
    font-weight: bold;
    text-decoration: underline;
  }
  .v-field__input {
    color: yellow !important;
    font-size: 60px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
