<script setup>
import { ref, watch, watchEffect } from 'vue'
import { uploadImage } from '@/plugins/utils/requests/api/products.js'

// 組件接收資料
const props = defineProps({
  imgurl: {
    type: String,
    default: ''
  }
})

// 組建傳出資料的方法
const emit = defineEmits(['update:imgurl', 'update:removeImage'])

const ImageUrl = ref('')
const ImageFile = ref(null)
const showProcessBar = ref(false)
const showUploadField = ref(true)

// 監聽事件
watch(ImageUrl, (newVal) => {
  if (newVal !== '') {
    showProcessBar.value = false
    showUploadField.value = false
  }
  emit('update:imgurl', newVal)
})

ImageUrl.value = props.imgurl

// 圖片上傳
const doUpload = async () => {
  showUploadField.value = false
  showProcessBar.value = true
  const formData = new FormData()
  formData.append('image', ImageFile.value)

  const res = await uploadImage(formData).catch(() => {
    /* Error Handle */
    showUploadField.value = true
    showProcessBar.value = false
    // TODO: alert
  })

  showProcessBar.value = false
  ImageUrl.value = res.data.result.url
}

// 移除圖片
const removeImage = () => {
  ImageUrl.value = ''
  showUploadField.value = true
}
</script>

<template>
  <v-container
    class="images-previews"
    :style="{ 'background-image': 'url(' + ImageUrl + ')' }"
  >
    <v-row>
      <!-- 刪除按鈕 -->
      <v-col
        v-if="ImageUrl !== ''"
        align="center"
        align-self="end"
      >
        <v-btn
          icon="mdi-close"
          size="small"
          @click="removeImage"
        />
      </v-col>

      <!-- 進度條 -->
      <v-col
        v-if="showProcessBar"
        align="center"
        align-self="center"
      >
        <v-progress-circular
          color="primary"
          indeterminate
        />
      </v-col>

      <!-- 上傳介面 -->
      <v-col
        v-if="showUploadField"
        align="center"
        align-self="center"
      >
        <v-file-input
          v-model="ImageFile"
          prepend-icon="mdi-camera"
          hide-input
          @update:model-value="doUpload"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.images-previews {
  display: flex;
  background-color: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4));
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  height: 250px;
  min-width: 100px;
  min-height: 100px;
  max-width: 250px;
  border-style: dashed;
  border-radius: 5px;
}
</style>
