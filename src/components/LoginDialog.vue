<script setup>
/**
 * LoginDialog 組件
 * 
 * 此組件用於用戶登錄，提供事件 ID 和密碼輸入欄位。
 * 
 * Props:
 * - disabledAuth (Boolean): 控制對話框的可見性，默認為 false。
 * 
 * 反應式變量:
 * - event_sn (String): 事件 ID，預設為 'h16ub9tnon'。
 * - password (String): 用戶輸入的密碼。
 * - isDialogVisible (Boolean): 控制對話框的顯示狀態。
 * 
 * 監聽器:
 * - 監聽 disabledAuth 屬性的變化，根據其值更新對話框的可見性。
 * 
 * 方法:
 * - checkPassword(): 驗證用戶輸入的密碼，使用 SHA-256 加密進行比對。
 * 
 * 事件:
 * - getAuthStatus: 當用戶登錄成功或失敗時發出事件。
 */

import { ref, watch, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'

const appStore = useAppStore()
const route = useRoute()
const event_sn = ref('h16ub9tnon')
const password = ref('')

const isDialogVisible = computed(()=>{
  if(route.path === '/controller/manage-products' || route.path === '/controller/process-auction'){
    return !appStore.adminLoginStatus
  } else if(route.path === '/controller/manage-participant'){
    return !appStore.userLoginStatus
  }
  else{
    return false
  }
})


const props = defineProps({
  disabledAuth: {
    type: Boolean,
    default: false
  }
})

watch(()=>props.disabledAuth, ()=>{
  isDialogVisible.value = !props.disabledAuth
})


const checkPassword = async () => {

  // 密碼加密: SHA-256, hashHex 為結果
  const res = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password.value)
  );
  const hashArray = Array.from(new Uint8Array(res));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if(event_sn.value === 'h16ub9tnon'){ 
    if(
        route.path === '/controller/manage-products' || 
        route.path === '/controller/process-auction'
    ){
        if(hashHex === '9d49d019f3a9e08b8bfeca58bd6a965127f79a657420a6041401e10c68a79a20'){
            appStore.setLoginStatus('admin', true)
        }else{
            appStore.setLoginStatus('admin', false)
        }
    } 
    else if(route.path === '/controller/manage-participant'){
        if(hashHex === 'b1326f76a3952384b0912d06dc1e270910da6f4c86c4ec941443f5a959044b6d'){
            appStore.setLoginStatus('user', true)
        }else{
            appStore.setLoginStatus('user', false)
        }
    }
  }else{
    appStore.setLoginStatus('admin', false)
    appStore.setLoginStatus('user', false)
  }
}

</script>

<template>
  <div
    class="pa-4 text-center"
  >
    <v-dialog
      v-model="isDialogVisible"
      max-width="320"
      persistent
    >
      <v-card
        prepend-icon="mdi-account"
        title="登入活動"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="event_sn"
                label="Event ID"
                type="text"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            text="開始"
            variant="tonal"
            @click="checkPassword()"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

