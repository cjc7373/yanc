<template>
    <div id="navBottom">
        <img
            alt="avatar"
            :src="avatar"
        >

        <div
            v-if="!isLogin"
            id="login_div"
        >
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
                id="loginModal"
                ref="loginModal"
                class="modal fade"
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
                            />
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label
                                    for="exampleInputEmail1"
                                    class="form-label"
                                >用户名</label>
                                <input
                                    id="exampleInputEmail1"
                                    v-model="username"
                                    type="text"
                                    class="form-control"
                                    required
                                >
                            </div>
                            <div class="mb-3">
                                <label
                                    for="exampleInputPassword1"
                                    class="form-label"
                                >密码</label>
                                <input
                                    id="exampleInputPassword1"
                                    v-model="password"
                                    type="password"
                                    class="form-control"
                                    required
                                >
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
                            <button
                                type="button"
                                class="btn btn-primary"
                                @click="login"
                            >
                                登录
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            {{ profile.nickname }}
        </div>

        <i class="bi bi-gear" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import api from '@/ipcRenderer'
import { Modal } from 'bootstrap'
import { useStore } from 'vuex'

export default defineComponent({
    setup () {
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

            await api.login({ email: username.value, password: password.value })

            const account = await api.user_account()
            if (account.status === 200) {
                store.commit('login') // TODO: move this to login method
                store.commit('updateProfile', account.body.profile)
                console.log('profile: ', account.body.profile)
            }
        }

        const store = useStore()
        const isLogin = computed(() => store.state.isLogin)
        const profile = computed(() => store.state.profile)
        const avatar = computed(() => {
            if (isLogin.value) {
                return profile.value.avatarUrl // FIXME: why need .value?
            } else {
                return '../assets/logo.png'
            }
        })

        return {
            username, password, login, loginModal, isLogin, avatar, profile
        }
    }
})
</script>

<style lang="scss" scoped>
$height: 50px;
$navWidth: 200px;

#navBottom {
    background-color: white;
    width: $navWidth;

    height: $height;
    display: flex;
    flex-direction: row;
}

img {
    width: $height;
    height: $height;
}

i {
    font-size: 1.5rem;
}
</style>
