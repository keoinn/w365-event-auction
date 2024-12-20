<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
  //
</script>

<style>
/* DOCME: https://stackoverflow.com/questions/46985687/changing-the-overlay-background-color-of-sweet-alert-2 */
.swal2-container.swal2-backdrop-show, .swal2-container.swal2-noanimation {
    background: transparent !important;
}
.swal2-container {
  z-index: 2400 !important;
}
</style>
