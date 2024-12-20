<!-- https://github.com/vuetifyjs/vuetify/discussions/19160#discussioncomment-10235933 -->
<!-- https://bonze.tw/vue3-parent-call-child-method/ -->
<template>
  <v-dialog
    v-model="dialog"
    max-width="900px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">編輯拍賣品資料</span>
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
                v-model="editedItem.pa_id"
                readonly
                label="系統序號"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.p_sn"
                label="商品編號"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
              sm="12"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.p_name"
                label="商品名稱"
                style="color: blueviolet"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.author"
                label="作者"
                style="color: blueviolet"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.source"
                label="拍賣品來源"
                style="color: blueviolet"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.start_price"
                label="起標價"
                type="number"
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
                v-model="editedItem.sell_price"
                label="得標價"
                type="number"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.p_owner"
                label="得標者"
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
                v-model="editedItem.soldout_time"
                label="確認得標時間"
                readonly
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            align-content="center"
            class="pt-0"
            style="border: 1px solid grey; border-radius: 10px;"
          >
            <v-col
              v-for="(imgset, counter) in editedItem.production_img"
              :key="counter"
              cols="4"
            >
              <ImageUploader
                :imgurl="editedItem.production_img[counter]"
                @update:imgurl="(url) => (editedItem.production_img[counter] = url)"
              />
            </v-col>
            <v-col cols="4">
              <v-container
                v-if="editedItem.production_img.length < 6"
                class="add-image-container"
              >
                <v-row>
                  <v-col
                    align="center"
                    align-self="center"
                  >
                    <v-btn
                      border="thin success"
                      color="success"
                      prepend-icon="mdi-plus"
                      text="新增圖片"
                      class="me-2 text-none"
                      flat
                      @click="handelAddImages"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          text="取消"
          @click="handelDialogClose"
        />
        <v-btn
          color="primary"
          variant="text"
          text="更新"
          @click="handelSaveEditItem"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-data-table-server
    v-model:options="options"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    no-data-text="尚未有任何資料"
    items-per-page-text="每頁顯示"
    loading-text="資料載入中..."
    page-text=" {0} 到 {1} 筆資料, 總共 {2} 筆"
    item-value="name"
    @update:options="loadItems"
  >
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template #item.p_order="{ item }">
      <v-chip color="green">
        {{ item.p_order }}
      </v-chip>
      &nbsp;|&nbsp;

      <v-btn
        size="small"
        icon="mdi-arrow-up-bold"
        @click="handelChangeOrder(item, 'up')"
      />

      <v-btn
        size="small"
        icon="mdi-arrow-down-bold"
        @click="handelChangeOrder(item, 'down')"
      />
    </template>
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template #item.action="{ item }">
      <v-icon
        class="me-2"
        size="small"
        icon="mdi-pencil"
        @click="handelEditItem(item.pa_id)"
      />
    </template>
  </v-data-table-server>
</template>

<script setup>
import { ref } from 'vue'
import { getProducts, changeOrder, getProduct, saveProduct } from '@/plugins/utils/requests/api/products.js'
import ImageUploader from '@/components/manager/ImageUploader.vue'

const search = ref('')
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)

const dialog = ref(false)
const emptyItem = ref({
  pa_id: '',
  p_sn: '',
  p_name: '',
  author: '',
  source: '',
  start_price: '',
  sell_price: '',
  p_owner: '',
  soldout_time: '',
  production_img: []
})
const editedItem = ref(emptyItem.value)

const headers = ref([
  { title: '系統序號', key: 'pa_id', align: 'start', sortable: true },
  { title: '商品編號', key: 'p_sn', align: 'start', sortable: false },
  { title: '拍賣品名稱', key: 'p_name', align: 'center' },
  { title: '拍賣順序', key: 'p_order', align: 'center' },
  { title: '動作', key: 'action', align: 'center' }
])

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: []
})

const refresh = async () => {
  await loadItems(options.value)
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  const { data } = await getProducts()
  serverItems.value = data.result.item
  totalItems.value = data.result.total
  loading.value = false
}

// 編輯拍賣品資料按鈕
const handelEditItem = async (item_id) => {
  const res = await getProduct(item_id)
  editedItem.value = res.data.result
  dialog.value = true
}

// 新增圖片
const handelAddImages = () => {
  editedItem.value.production_img.push('')
}

// 改變拍賣順序
const handelChangeOrder = async (item, direction) => {
  await changeOrder(item.pa_id, direction)
  await refresh()
}

// 關閉編輯拍賣品資料對話框 -> 取消
const handelDialogClose = () => {
  dialog.value = false
  editedItem.value = Object.assign({}, emptyItem.value)
}

// 更新拍賣品資料 -> 儲存
const handelSaveEditItem = async () => {
  await saveProduct(editedItem.value)
  dialog.value = false
  await refresh()
}
// 導出 refresh 方法
defineExpose({
  refresh
})
</script>
