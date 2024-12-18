<template v-if="todoList">
  <v-card
    v-if="!todoList"
    color="primary"
    variant="tonal"
    class="mx-auto"
  >
    <v-card-item>
      <div>
        <div class="text-h6 mb-1">
          {{ title }}
        </div>
        <div
          v-for="msg in content"
          :key="msg"
          class="text-caption"
        >
          {{ msg }}
        </div>
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn
        text="隱藏"
        @click="todoList = true"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
const todoList = ref(false)
defineProps({
  title: {
    type: String,
    default: () => 'TODO'
  },
  content: {
    type: Array,
    default: () => null
  }
})
</script>
