<template>
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>

        <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
        >
            登录
        </button>

        <!-- Modal -->
        <div
            class="modal fade"
            ref="loginModal"
            id="loginModal"
            tabindex="-1"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            登录
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">用户名</label>
                            <input type="text" class="form-control" id="exampleInputEmail1" v-model="username" required>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">密码</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" v-model="password" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        <button type="button" class="btn btn-primary" @click="login">
                            登录
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import api from '@/ipcRenderer'
import { Modal } from 'bootstrap'

export default defineComponent({
    setup (props) {
        const username = ref(localStorage.getItem('username') ?? '')
        const password = ref(localStorage.getItem('password') ?? '')

        const loginModal = ref()
        const loginModalBS = ref()

        onMounted(() => {
            loginModalBS.value = new Modal(loginModal.value)
        })

        const login = async () => {
            localStorage.setItem('username', username.value)
            localStorage.setItem('password', password.value)
            loginModalBS.value.hide()
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const res = await api.login({ email: username.value, password: password.value })
            const loginStatus = await api.login_status()
            console.log(loginStatus)
        }

        return {
            username, password, login, loginModal
        }
    }
})
</script>

<style lang="scss" scoped>
#nav {
    display: flex;
    flex-direction: column;

    padding: 30px;
    border: solid;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
