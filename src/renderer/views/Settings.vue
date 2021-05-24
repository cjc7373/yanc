<template>
    <div>
        <h1>这里是设置</h1>
        <button
            v-if="store.state.isLogin"
            type="button"
            class="btn btn-primary"
            @click="logout"
        >
            注销
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { reloadApp } from '@/ipcRenderer'
import { useStore } from 'vuex'

export default defineComponent({
    setup () {
        const store = useStore()

        const logout = () => {
            localStorage.removeItem('cookie')
            reloadApp()
        }
        return { logout, store }
    }
})
</script>
