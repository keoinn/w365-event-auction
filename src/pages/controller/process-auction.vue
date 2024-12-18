<route lang="yaml">
meta:
  layout: dashboard_template
</route>

<template>
  <v-container max-width="600">
    <v-row>
      <v-col cols="12">
        <v-card class="">
          <v-card-title>
            <h2>拍賣流程控制 - Page: {{ auctionItem.p_order }}</h2>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                  class="pt-0"
                >
                  <v-text-field
                    v-model="auctionItem.pa_id"
                    label="系統編號"
                    readonly
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                  class="pt-0"
                >
                  <v-text-field
                    v-model="auctionItem.p_sn"
                    label="拍賣品編號"
                    readonly
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                  class="pt-0"
                >
                  <v-text-field
                    v-model="auctionItem.p_name"
                    label="拍賣品名稱"
                    readonly
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                  class="pt-0"
                >
                  <v-text-field
                    v-maska="options"
                    :model-value="auctionItem.start_price"
                    label="起標價"
                    readonly
                  />
                </v-col>
              </v-row>

              <v-row
                align="center"
                justify="center"
                style="border: 1px solid red; border-radius: 10px; background-color: lightpink"
              >
                <v-col
                  cols="3"
                  md="3"
                  sm="3"
                  class="pt-0 text-center"
                >
                  <span class="font-weight-bold text-h6">得標價</span>
                </v-col>
                <v-col
                  cols="6"
                  md="6"
                  sm="6"
                >
                  <v-text-field
                    v-maska="options"
                    :model-value="auctionItem.get_price"
                    center-affix
                    readonly
                  />
                </v-col>
                <v-col
                  cols="3"
                  md="3"
                  sm="3"
                  class="pt-0"
                >
                  <v-btn
                    icon="mdi-plus"
                    @click="handleAddSellPrice"
                  />
                </v-col>
              </v-row>

              <v-row
                class="mt-5"
                align="center"
                justify="center"
                style="border: 1px solid blue; border-radius: 10px; background-color: lightskyblue"
              >
                <v-col
                  cols="3"
                  md="3"
                  sm="3"
                  class="pt-0 text-center"
                >
                  <span class="font-weight-bold text-h6">直接喊價</span>
                </v-col>
                <v-col
                  cols="6"
                  md="6"
                  sm="6"
                >
                  <v-text-field
                    v-model="setSellPrice"
                    v-maska="options"
                  />
                </v-col>
                <v-col
                  cols="3"
                  md="3"
                  sm="3"
                  class="pt-0 text-center"
                >
                  <v-btn
                    color="primary"
                    size="large"
                    text="喊價"
                    @click="handleSetSellPrice"
                  />
                </v-col>
              </v-row>

              <v-row
                class="mt-5"
                align="center"
                justify="center"
                style="border: 1px solid green; border-radius: 10px; background-color: lightgreen"
              >
                <v-col
                  cols="3"
                  md="3"
                  sm="3"
                  class="pt-0 text-center"
                >
                  <span class="font-weight-bold text-h6">得標者</span>
                </v-col>
                <v-col
                  cols="6"
                  md="6"
                  sm="6"
                >
                  <v-text-field v-model="auctionItem.bidder" />
                </v-col>

                <v-col
                  cols="3"
                  md="3"
                  sm="3"
                  class="pt-0 text-center"
                >
                  <v-btn
                    color="primary"
                    size="large"
                    text="確定得標"
                    @click="handleFinalBidder"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn
              size="large"
              text="上一件拍賣品"
              style="background-color: green; color: white"
              @click="handlePrevAuction"
            />
            <v-spacer />
            <v-btn
              size="large"
              text="下一件拍賣品"
              style="background-color: red; color: white"
              @click="handleNextAuction"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { vMaska } from 'maska/vue'
import { onKeyStroke } from "@vueuse/core";
import {
  getAuction,
  addAuctionPrice,
  setAuctionPrice,
  changeAuction
} from '@/plugins/utils/requests/api/products'

const options = {
  mask: '9,99# 元',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true }
  },
  reversed: true
}
const setSellPrice = ref(0)

const auctionItem = ref({
  pa_id: '',
  sell_price: '',
  author: '',
  ct: '',
  dt: '',
  get_price: '',
  p_name: '',
  p_order: '',
  p_owner: '',
  p_sn: '',
  production_desc: '',
  production_img: '',
  soldout_time: '',
  source: '',
  start_price: '',
  ut: ''
})

onMounted(async () => {
  await asyncAuctionInfo()

  document.body.style.overflow = 'hidden'

  onKeyStroke("PageUp", () => { 
    console.log("PageUp Key is pressed");
  });
  onKeyStroke("PageDown", () => {
    console.log("PageDown Key is pressed");
    handleAddSellPrice()
  });
})

const asyncAuctionInfo = async () => {
  const res = await getAuction()
  auctionItem.value = res.data.result
  if (auctionItem.value.get_price === null) {
    auctionItem.value.get_price = auctionItem.value.start_price
  }
  setSellPrice.value = res.data.result.get_price
  console.log(auctionItem.value)
}

// 加價
const handleAddSellPrice = async () => {
  const res = await addAuctionPrice(auctionItem.value.pa_id)
  console.log(res)
  console.log(res.data)
  await asyncAuctionInfo()
}

// 設定喊價
const handleSetSellPrice = async () => {
  const res = await setAuctionPrice(auctionItem.value.pa_id, setSellPrice.value)
  console.log(res)
  console.log(res.data)
  await asyncAuctionInfo()
}

// 確定得標
const handleFinalBidder = () => {
  console.log('handleFinalBidder')
}

// 上一件拍賣品
const handlePrevAuction = async () => {
  const res = await changeAuction('prev')
  console.log(res)
  console.log(res.data)
  await asyncAuctionInfo()
}

// 下一件拍賣品
const handleNextAuction = async () => {
  const res = await changeAuction('next')
  console.log(res)
  console.log(res.data)
  await asyncAuctionInfo()
}
</script>

<style>
/* https://github.com/vuetifyjs/vuetify/issues/1197 */
html {
  overflow-y: hidden;
}
</style>
