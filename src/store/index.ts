import { createStore } from 'vuex'

export default createStore({
    state: {
        isLogin: false,
        profile: null,
        currentPlaylist: null,
        currentTrack: null
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
        },
        updateCurrentPlaylist (state, playlist) {
            state.currentPlaylist = playlist
        },
        updateCurrentTrack (state, track) {
            console.log('committing: ', track)
            state.currentTrack = track
        }
    },
    actions: {
    },
    modules: {
    }
})
