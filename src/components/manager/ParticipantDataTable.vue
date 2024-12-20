<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  getParticipants,
  getParticipant,
  saveParticipant
} from '@/plugins/utils/requests/api/participant.js'
import ImageUploader from '@/components/manager/ImageUploader.vue'
import { handleBackendMsg } from '@/plugins/utils/alert'

const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const search = ref('')

const dialog = ref(false)

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: []
})

const emptyItem = ref({
  ap_id: '',
  auction_num: '',
  ct: '',
  dt: '',
  group: '',
  has_namecard: '',
  is_member: '',
  nickname: '',
  pa_name: '',
  pa_namecard: [],
  pa_phone: '',
  ut: '',
  has_namecard_trans: '',
  is_member_trans: ''
})
const editedItem = ref(emptyItem.value)

const headers = ref([
  { title: '序號', key: 'ap_id', align: 'center', sortable: true  },
  { title: '社名', key: 'group', align: 'center', sortable: false },
  { title: '姓名', key: 'pa_name', align: 'center', sortable: false },
  { title: 'Nickname', key: 'nickname', align: 'center', sortable: false },
  { title: '手機', key: 'pa_phone', align: 'center', sortable: false },
  { title: '號碼牌', key: 'auction_num', align: 'center', sortable: true },
  { title: '動作', key: 'action', align: 'center', sortable: false, }
])

const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  }
})

watch(() => props.searchTerm, (newVal) => {
  search.value = newVal
})

onMounted(async () => {
  await loadItems(options.value)
})

const loadItems = async (options) => {
  loading.value = true
  const res = await getParticipants(options)
  serverItems.value = res.data.result.item
  totalItems.value = res.data.result.total
  loading.value = false
}

// 號碼牌顯示文字
const parserAuctionNum = (item) => {
  if (item.auction_num === '' || item.auction_num === null) {
    return '未分配'
  } else {
    return (parseInt(item.auction_num) + 1000).toString().slice(1, 4)
  }
}

// 號碼牌顏色
const parserAuctionNumColor = (item) => {
  return item.auction_num ? 'green' : 'red'
}

// 顯示編輯參與者資料
const handelEditItem = async (item_id) => {
  const res = await getParticipant(item_id)
  editedItem.value = res.data.result
  editedItem.value.is_member = res.data.result.is_member == '0' ? false : true
  editedItem.value.has_namecard = res.data.result.has_namecard == '0' ? false : true
  dialog.value = true
}

const handelDialogClose = () => {
  dialog.value = false
  editedItem.value = emptyItem.value
}

const handelSaveEditItem = async () => {
  editedItem.value.is_member_trans = editedItem.value.is_member ? '1' : '0'
  editedItem.value.has_namecard_trans = editedItem.value.has_namecard ? '1' : '0'
  const res = await saveParticipant(editedItem.value)
  handleBackendMsg(res.data.status, res.data.msg, true)
  if (res.data.status === true) {
    await refresh()
    dialog.value = false
    editedItem.value = emptyItem.value
  } else {
    dialog.value = true
  }
}

const handelAddImages = () => {
  editedItem.value.pa_namecard.push('')
}

const refresh = async () => {
  await loadItems(options.value)
  console.log('refresh')
}

const addNewParticipant = () => {
  dialog.value = true
  editedItem.value = emptyItem.value
  editedItem.value.ap_id = 'New'
}

// 導出 refresh 方法
defineExpose({
  refresh,
  addNewParticipant
})
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="900px"
  >
    <v-card>
      <v-card-title>
        <h2>編輯參與者資料</h2>
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
                v-model="editedItem.ap_id"
                readonly
                label="序號"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.auction_num"
                label="號碼牌"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.pa_name"
                label="姓名"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.nickname"
                label="Nickname"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.group"
                label="社名"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-text-field
                v-model="editedItem.pa_phone"
                label="手機"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="6"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-checkbox
                v-model="editedItem.has_namecard"
                label="是否留名片"
              />
            </v-col>
            <v-col
              cols="6"
              md="6"
              sm="6"
              class="pt-0"
            >
              <v-checkbox
                v-model="editedItem.is_member"
                label="是否為社員"
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            align-content="center"
            class="pt-0"
          >
            <v-col cols="12">
              <h3>名片</h3>
            </v-col>
          </v-row>
          <v-row
            align="center"
            align-content="center"
            class="pt-0"
            style="border: 1px solid grey; border-radius: 10px"
          >
            <v-col
              v-for="(imgset, counter) in editedItem.pa_namecard"
              :key="counter"
              cols="4"
            >
              <ImageUploader
                :imgurl="editedItem.pa_namecard[counter]"
                backend="namecard"
                @update:imgurl="(url) => (editedItem.pa_namecard[counter] = url)"
              />
            </v-col>
            <v-col cols="4">
              <v-container
                v-if="editedItem.pa_namecard.length < 1"
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
          :text="editedItem.ap_id === 'New' ? '新增' : '更新'"
          @click="handelSaveEditItem"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-data-table
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
    <template #item.nickname="{ item }">
      <v-chip
        v-if="item.nickname === '' || item.nickname === null"
        color="red"
      >
        未登錄
      </v-chip>
      <div v-else>
        {{ item.nickname }}
      </div>
    </template>

    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template #item.auction_num="{ item }">
      <v-chip :color="parserAuctionNumColor(item)">
        {{ parserAuctionNum(item) }}
      </v-chip>
    </template>

    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template #item.group="{ item }">
      <v-chip
        v-if="item.group === '' || item.group === null"
        color="red"
      >
        未登錄
      </v-chip>
      <div v-else>
        {{ item.group }}
      </div>
    </template>

    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template #item.action="{ item }">
      <v-icon
        class="me-2"
        size="small"
        icon="mdi-pencil"
        @click="handelEditItem(item.ap_id)"
      />
    </template>
  </v-data-table>
</template>
