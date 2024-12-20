<template>
  <v-footer
    height="40"
    app
  >
    <a
      title="參與者管理"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
      @click="$router.push('/controller/manage-participant')"
    >
      <v-icon
        icon="mdi-account"
        size="24"
      />
    </a>

    <a
      title="商品管理"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
      @click="$router.push('/controller/manage-products')"
    >
      <v-icon
        icon="mdi-treasure-chest"
        size="24"
      />
    </a>

    <a
      title="拍賣控制台"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
      @click="$router.push('/controller/process-auction')"
    >
      <v-icon
        icon="mdi-gavel"
        size="24"
      />
    </a>

    <a
      title="主拍賣畫面"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
      @click="$router.push('/')"
    >
      <v-icon
        icon="mdi-projector-screen"
        size="24"
      />
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px"
    >
      &copy; 2016-{{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">灝元商務科技 | keoinn</span>
      —
      <a
        class="text-decoration-none on-surface"
        href="#"
        rel="noopener noreferrer"
        target="_blank"
      >
        MIT License
      </a>
    </div>
  </v-footer>
</template>

<script setup></script>

<style scoped lang="sass">
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
