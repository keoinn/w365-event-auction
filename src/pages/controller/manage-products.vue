<script setup>
import { ref, onMounted } from 'vue'
import { uploadExcel, getProducts } from '@/plugins/utils/requests/api/products.js'
import ProductDataTable from '@/components/manager/ProductDataTable.vue'
import TodoNoteCard from '@/components/TodoNoteCard.vue'
const uploadFile = ref(null)
const productDataTableRef = ref(null)

const handleUploadFile = async () => {
  console.log(uploadFile.value)

  const formData = new FormData()
  formData.append('excel', uploadFile.value)

  const response = await uploadExcel(formData)
  console.log(response)
  productDataTableRef.value.refresh()

  //   uploadFile.value = null
}

onMounted(async () => {
  const response = await getProducts()
  console.log(response.data)
})
</script>

<template>
  <v-container max-width="1200">
    <!-- TODO -->
    <v-row>
      <v-col cols="6">
        <TodoNoteCard
          :content="[
            '1. 編輯拍賣資料，更新圖已未實現 -> 未測試',
            '2. 賣出鎖定未實現'
          ]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title> <h2>拍賣品管理</h2> </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="8">
                <v-file-input
                  label="匯入拍賣品資料Excel"
                  v-model="uploadFile"
                />
              </v-col>
              <v-col cols="4">
                <v-btn
                  size="large"
                  color="primary"
                  @click="handleUploadFile"
                >
                  確定匯入
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="">
          <v-card-title> <h2>拍賣品管理</h2> </v-card-title>
          <v-card-text>
            <!-- Insert table here -->
            <ProductDataTable ref="productDataTableRef" />
            <!-- <DraggableDataTable /> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  layout: dashboard_template
</route>
