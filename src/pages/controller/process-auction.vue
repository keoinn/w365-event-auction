<script setup>
import { ref, onMounted, watch } from 'vue'
import { vMaska } from 'maska/vue'
import { onKeyStroke } from '@vueuse/core'
import { handleAlert, handleBackendMsg } from '@/plugins/utils/alert'
import {
  getAuction,
  addAuctionPrice,
  setAuctionPrice,
  changeAuction,
  setFinalBidder
} from '@/plugins/utils/requests/api/products'

import LoginDialog from '@/components/LoginDialog.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 強制修正資料
const dialog = ref(false)
const forcePrice = ref(0)
const forceBidder = ref('')
const forceToPage = ref('')

// 快速加價按鈕
const quickAdd10Price = ref(0)
const quickAdd1Price = ref(0)
const quickMinus10Price = ref(0)
const quickMinus1Price = ref(0)

const options = {
  mask: '9,99# 元',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true }
  },
  reversed: true
}
const setSellPrice = ref(0)
const finalBidder = ref('')

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
  onKeyStroke('PageUp', () => {
    console.log('PageUp Key is pressed')
  })
  onKeyStroke('PageDown', () => {
    if (auctionItem.value.p_owner === null) {
      handleAddSellPrice()
    } else {
      handleAlert({
        auction: 'error',
        text: '控制筆觸發加價，但已經有人得標。'
      })
    }
  })
})

watch(() => auctionItem.value.get_price, () => {
  quickAdd10Price.value = "+" + getPriceMathLog(false)
  quickAdd1Price.value = "+" + getPriceMathLog(true)
  quickMinus10Price.value = "-" + getPriceMathLog(false)
  quickMinus1Price.value = "-" + getPriceMathLog(true)
})

const asyncAuctionInfo = async () => {
  const res = await getAuction()
  auctionItem.value = res.data.result
  handleBackendMsg(res.data.status, res.data.msg)
  if (auctionItem.value.get_price === null) {
    auctionItem.value.get_price = auctionItem.value.start_price
  }

  if (auctionItem.value.p_owner !== null) {
    finalBidder.value = auctionItem.value.p_owner_str
  } else {
    finalBidder.value = ''
  }
  setSellPrice.value = res.data.result.get_price
}

// 加價
const handleAddSellPrice = async () => {
  const res = await addAuctionPrice(auctionItem.value.pa_id)
  handleBackendMsg(res.data.status, res.data.msg)
  await asyncAuctionInfo()
}

// 設定喊價
const handleSetSellPrice = async () => {
  const res = await setAuctionPrice(auctionItem.value.pa_id, setSellPrice.value)
  await asyncAuctionInfo()
  handleBackendMsg(res.data.status, res.data.msg, true)
}

// 確定得標
const handleFinalBidder = async () => {
  const res = await setFinalBidder(auctionItem.value.pa_id, finalBidder.value)
  await asyncAuctionInfo()
  handleBackendMsg(res.data.status, res.data.msg)
}

// 更換拍賣品
const handleChangeAuction = async (direction) => {
  const res = await changeAuction(direction)
  handleBackendMsg(res.data.status, res.data.msg, true)
  await asyncAuctionInfo()
}

// 強制修正視窗
const handelForceItem = async () => {
  dialog.value = true
  forcePrice.value = auctionItem.value.get_price
  forceBidder.value = auctionItem.value.p_owner_str
  forceToPage.value = auctionItem.value.p_order
}

// 強制修正價格
const handleForcePrice = async () => {
  const res = await setAuctionPrice(auctionItem.value.pa_id, forcePrice.value, true)
  await asyncAuctionInfo()
  handleBackendMsg(res.data.status, res.data.msg, true)

  forcePrice.value = 0
  forceBidder.value = ''
  forceToPage.value = ''
  dialog.value = false
}

// 強制修正得標者
const handleForceBidder = async () => {
  const res = await setFinalBidder(auctionItem.value.pa_id, forceBidder.value, true)
  await asyncAuctionInfo()
  handleBackendMsg(res.data.status, res.data.msg, true)

  forcePrice.value = 0
  forceBidder.value = ''
  forceToPage.value = ''
  dialog.value = false
}

// 快速轉跳頁面
const handleForceJump = async () => {
  const res = await changeAuction('jump', forceToPage.value)
  await asyncAuctionInfo()
  handleBackendMsg(res.data.status, res.data.msg, true)

  console.log(forceToPage.value)

  forcePrice.value = 0
  forceBidder.value = ''
  forceToPage.value = ''
  dialog.value = false
}

// quick add price
const getPriceMathLog = (shift = false) => {
  let basePrice
  if (auctionItem.value.get_price === null) {
    basePrice = auctionItem.value.start_price
  } else {
    basePrice = auctionItem.value.get_price
  }

  if(shift){
    return Math.pow(10, Math.floor(Math.log10(basePrice)) -1)
  } else {
    return Math.pow(10, Math.floor(Math.log10(basePrice)))
  }
}

const handleQuickAddPrice = async (direction, price) => {
  let currentPrice = setSellPrice.value.replace(/,/g, '')
  currentPrice = parseInt(currentPrice.replace(/ 元/g, ''))

  if (direction == '+') {
    setSellPrice.value = currentPrice + price
  } else {
    if(currentPrice <= price){
      setSellPrice.value = 0
    } else {
      setSellPrice.value = currentPrice - price
    }
  }
}
</script>

<template>
  <v-container
    v-show="appStore.adminLoginStatus"
    max-width="600"
  >
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
                  <span class="font-weight-bold text-h6">目前價格</span>
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
                    v-if="auctionItem.p_owner === null"
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
                    v-if="auctionItem.p_owner === null"
                    color="primary"
                    size="large"
                    text="喊價"
                    @click="handleSetSellPrice"
                  />
                </v-col>
                <v-col
                  v-if="auctionItem.p_owner === null"
                  cols="12"
                  class="pt-0 text-center"
                >
                  <v-btn
                    style="background-color: green; color: white"
                    size="small"
                    :text="quickMinus10Price"
                    @click="handleQuickAddPrice('-', getPriceMathLog(false))"
                  />
                  &nbsp;
                  <v-btn
                    style="background-color: green; color: white"
                    size="small"
                    :text="quickMinus1Price"
                    @click="handleQuickAddPrice('-', getPriceMathLog(true))"
                  />
                  &nbsp;
                  <v-btn
                    style="background-color: red; color: white"
                    size="small"
                    :text="quickAdd1Price"
                    @click="handleQuickAddPrice('+', getPriceMathLog(true))"
                  />
                  &nbsp;
                  <v-btn
                    style="background-color: red; color: white"
                    size="small"
                    :text="quickAdd10Price"
                    @click="handleQuickAddPrice('+', getPriceMathLog(false))"
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
                  <v-text-field
                    v-model="finalBidder"
                  />
                </v-col>

                <v-col
                  cols="3"
                  md="3"
                  sm="3"
                  class="pt-0 text-center"
                >
                  <v-btn
                    v-if="auctionItem.p_owner === null"
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
              @click="handleChangeAuction('prev')"
            />
            <v-spacer />
            <v-btn
              size="large"
              text="強制修正"
              style="background-color: orange; color: white"
              @click="handelForceItem"
            />
            <v-spacer />
            <v-btn
              size="large"
              text="下一件拍賣品"
              style="background-color: red; color: white"
              @click="handleChangeAuction('next')"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog
      v-model="dialog"
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <h2>強制修正內容 - Page: {{ auctionItem.p_order }}</h2>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row
              class="mt-5"
              align="center"
              justify="center"
              style="border: 1px solid orange; border-radius: 10px; background-color: lightorange"
            >
              <v-col
                cols="3"
                md="3"
                sm="3"
              >
                <span class="font-weight-bold text-h6">修正目前價格</span>
              </v-col>
              <v-col
                cols="6"
                md="6"
                sm="6"
              >
                <v-text-field
                  v-model="forcePrice"
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
                  text="修改價格"
                  @click="handleForcePrice"
                />
              </v-col>
            </v-row>

            <v-row
              class="mt-5"
              align="center"
              justify="center"
              style="border: 1px solid orange; border-radius: 10px; background-color: lightorange"
            >
              <v-col
                cols="3"
                md="3"
                sm="3"
              >
                <span class="font-weight-bold text-h6">修正得標者</span>
              </v-col>
              <v-col
                cols="6"
                md="6"
                sm="6"
              >
                <v-text-field
                  v-model="forceBidder"
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
                  text="修改得標者"
                  @click="handleForceBidder"
                />
              </v-col>
            </v-row>

            <v-row
              class="mt-5"
              align="center"
              justify="center"
              style="border: 1px solid orange; border-radius: 10px; background-color: lightorange"
            >
              <v-col
                cols="3"
                md="3"
                sm="3"
              >
                <span class="font-weight-bold text-h6">轉跳至其他拍賣品</span>
              </v-col>
              <v-col
                cols="6"
                md="6"
                sm="6"
              >
                <v-text-field
                  v-model="forceToPage"
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
                  text="轉跳"
                  @click="handleForceJump"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            text="關閉"
            @click="dialog = false"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- 登入對話框 -->
  <LoginDialog :disabled-auth="false" />
</template>

<style>
/* DOCME: https://github.com/vuetifyjs/vuetify/issues/1197 */
html {
  overflow-y: hidden !important;
}
</style>

<route lang="yaml">
meta:
  layout: dashboard_template
</route>
