// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAppStore = defineStore('app', () => {
  const adminLoginStatus = ref(false)
  const userLoginStatus = ref(false)

  // 紀錄登入狀態
  const setLoginStatus = (role = 'user', status = false) => {
    if(role === 'admin'){
      adminLoginStatus.value = status
    }
    if(role === 'user'){
      userLoginStatus.value = status
    }
  }

  return {
    adminLoginStatus,
    userLoginStatus,
    setLoginStatus,

  }
}, {
  persist: true
})