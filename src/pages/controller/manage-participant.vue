<script setup>
import { ref } from 'vue'
import ParticipantDataTable from '@/components/manager/ParticipantDataTable.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const participantDataTableRef = ref(null)
const searchTerm = ref('')

const refreshData = () => {
  participantDataTableRef.value.refresh()
}

const addNewParticipant = () => {
  participantDataTableRef.value.addNewParticipant()
}
</script>

<template>
  <v-container
    v-show="appStore.userLoginStatus"
    max-width="1200"
  >
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="2">
                <h2 class="table">
                  參與者管理
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
              <v-col cols="2">
                <v-btn
                  color="primary"
                  text="新增參與者"
                  @click="addNewParticipant"
                />
              </v-col>
            </v-row>
            <!-- <span class="">參與者管理</span> -->
            <v-spacer />
          </v-card-title>
          <v-card-text>
            <!-- Insert table here -->
            <ParticipantDataTable
              ref="participantDataTableRef"
              :search-term="searchTerm"
            />
            <!-- <DraggableDataTable /> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
