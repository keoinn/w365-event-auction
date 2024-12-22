<template>
  <v-footer
    class="transparent-bg"
    height="40"
    app
    style="background: rgb(109, 80, 85)"
  >
    <a
      title="全螢幕"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
      @click="handleFullScreen"
    >
      <v-icon
        icon="mdi-fullscreen"
        size="16"
      />
    </a>

    <a
      title="商品管理"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
      @click="$router.replace('/controller/manage-products')"
    >
      <v-icon
        icon="mdi-magnify"
        size="16"
      />
    </a>
  </v-footer>
</template>

<script setup>
import { ref } from 'vue'

const isFullScreen = ref(false)

const handleFullScreen = () => {
  let element = document.documentElement

  if (isFullScreen.value) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  } else {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  }
  isFullScreen.value = !isFullScreen.value
}
</script>

<style scoped lang="sass">
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
