<script setup>
import background_image from '@/assets/images/auction-background.jpg'
import { ref, onMounted, watch } from 'vue'
import { vMaska } from 'maska/vue'
import { getAuction } from '@/plugins/utils/requests/api/products'
import { useRoute } from 'vue-router'

const route = useRoute()

const empty_auction_item = {
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
}

const auctionItem = ref(empty_auction_item)

const options = {
  mask: '9,99# 元',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true }
  },
  reversed: true
}

const showBidderStr = ref('')
const sync_timer = ref(null)
const items = ref([])
onMounted(async () => {
  await getAuctionInfo()
  sync_timer.value = setInterval(() => {
    if (route.path !== '/') {
      clearInterval(sync_timer.value)
    }
    getAuctionInfo()
  }, 500)
  items.value = auctionItem.value.production_img.map((item) => {
    return {
      src: item
    }
  })
})

watch(
  () => auctionItem.value.pa_id,
  () => {
    items.value = auctionItem.value.production_img.map((item) => {
      return {
        src: item
      }
    })
  }
)

const getAuctionInfo = async () => {
  const res = await getAuction()
  auctionItem.value = res.data.result
  if (auctionItem.value.get_price === null) {
    auctionItem.value.get_price = auctionItem.value.start_price
  }

  showBidder()
}

const showBidder = () => {
  if (auctionItem.value.p_owner) {
    showBidderStr.value = auctionItem.value.p_owner_str
  } else {
    showBidderStr.value = '商品競拍中'
  }
}
</script>
<template>
  <!-- DOCME:https://javokhirbekkhaydarov.medium.com/preloading-images-in-vue-js-67a91b8710a7 -->
  <v-container
    class="fill-height ma-0 pa-0"
    :style="{ backgroundImage: `url(${background_image})`, backgroundSize: 'cover' }"
    fluid
  >
    <v-container
      max-height="100%"
      max-width="85%"
    >
      <v-row
        justify="center"
        align="center"
      >
        <v-col cols="5">
          <v-row>
            <v-col
              cols="12"
              align="center"
            >
              <h1 class="product-title">
                {{ auctionItem.p_name }}
              </h1>
            </v-col>
          </v-row>
          <!-- 
          <v-row>
            <v-col cols="6">
              <v-text-field
                class="detailed-input"
                :model-value="auctionItem.author"
                readonly
              >
                <template #label>
                  <span class="detailed-label">作者</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                class="detailed-input"
                :model-value="auctionItem.source"
                readonly
              >
                <template #label>
                  <span class="detailed-label">來源</span>
                </template>
              </v-text-field>
            </v-col>
          </v-row> -->

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-maska="options"
                class="detailed-input"
                :model-value="auctionItem.start_price"
                readonly
              >
                <template #label>
                  <span class="detailed-label">起標價</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="showBidderStr"
                class="detailed-input"
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
                :model-value="auctionItem.get_price"
                readonly
              >
                <template #label>
                  <span class="detailed-label">競拍價格</span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="note-row">
            <v-col
              cols="12"
              align="center"
            >
              <span class="company-name"> 灝元商務科技 </span>
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
            <v-carousel-item
              v-for="(item, i) in items"
              :key="i"
              :src="item.src"
            />
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style lang="scss">
.note-row {
  margin-top: -35px !important;
}
.company-name {
  color: orangered !important;
  font-size: 20px;
  font-weight: bold;
}

.product-title {
  color: #fff !important;
  font-size: 50px;
  font-weight: bold;
}

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
