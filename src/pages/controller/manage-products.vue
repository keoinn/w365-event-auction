<script setup>
import { ref, onMounted } from 'vue'
import { uploadExcel, getProducts } from '@/plugins/utils/requests/api/products.js'
import ProductDataTable from '@/components/manager/ProductDataTable.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import { useAppStore } from '@/stores/app'
import { handleBackendMsg } from '@/plugins/utils/alert'

const appStore = useAppStore()

const uploadFile = ref(null)
const productDataTableRef = ref(null)
const searchTerm = ref('')
const handleUploadFile = async () => {
  console.log(uploadFile.value)

  const formData = new FormData()
  formData.append('excel', uploadFile.value)

  const res = await uploadExcel(formData)
  productDataTableRef.value.refresh()
  console.log(res)
  handleBackendMsg(res.data.status, res.data.msg, true)
  uploadFile.value = null
}

const refreshData = () => {
  productDataTableRef.value.refresh()
}
onMounted(async () => {
  await getProducts()
})
</script>

<template>
  <v-container
    v-show="appStore.adminLoginStatus"
    max-width="1200"
  >
    <v-row>
      <v-col cols="12">
        <v-card class="">
          <v-card-title>
            <v-row>
              <v-col cols="2">
                <h2 class="table">
                  拍賣品管理
                  <v-icon
                    icon="mdi-refresh-circle"
                    size="32"
                    class="table-utils"
                    @click="refreshData"
                  />
                </h2>
              </v-col>
              <v-spacer />
              <v-col cols="4">
                <v-text-field
                  v-model="searchTerm"
                  label="搜尋"
                  class="table-search"
                  density="compact"
                />
              </v-col>
            </v-row>
            <!-- <span class="">參與者管理</span> -->
            <v-spacer />
          </v-card-title>
          <v-card-text>
            <!-- Insert table here -->
            <ProductDataTable
              ref="productDataTableRef"
              :search-term="searchTerm"
            />
            <!-- <DraggableDataTable /> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <h4>拍賣品匯入</h4>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6">
              <v-file-input
                v-model="uploadFile"
                label="匯入拍賣品資料Excel"
              >
                <template #details>
                  <a
                    href="https://liff.synet-app.com/download/template/import/auction_products.xlsx"
                    target="_blank"
                    download
                  >
                    範例檔案
                  </a>
                </template>
              </v-file-input>
            </v-col>
            <v-col cols="3">
              <v-btn
                size="large"
                color="primary"
                @click="handleUploadFile"
              >
                確定匯入
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>
          <h4>拍賣結果下載</h4>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="3">
              <v-btn
                size="large"
                color="primary"
                href="https://liff.synet-app.com/api/utilite/auction/result/excel"
                text="下載拍賣結果"
              >
                下載拍賣結果
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
  <!-- 登入對話框 -->
  <LoginDialog :disabled-auth="false" />
</template>
<style scoped lang="scss">
.table-utils {
  color: green;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    color: rgba(25, 118, 210, 1);
  }
}
</style>

<style>
html {
  overflow-y: visible !important;
}
</style>

<route lang="yaml">
meta:
  layout: dashboard_template
</route>
