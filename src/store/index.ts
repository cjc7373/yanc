import { createStore } from 'vuex'

export default createStore({
    state: {
        isLogin: false,
        profile: null
    },
    mutations: {
        login (state) {
            state.isLogin = true
        },
        logout (state) {
            state.isLogin = false
        },
        updateProfile (state, profile) {
            state.profile = profile
        }
    },
    actions: {
    },
    modules: {
    }
})
