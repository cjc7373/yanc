import { createStore } from 'vuex'

export default createStore({
    state: {
        isLogin: false,
        profile: null,
        currentPlaylist: null, // now displaying playlist
        currentTrack: {
            name: null,
            ar: [{
                name: null
            }],
            al: {
                picUrl: null
            },
            song: {}
        },
        trackList: null // now playing tracks
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
            console.log('committing track: ', track)
            state.currentTrack = track
        },
        updateCurrentTrackUrl (state, song: string) {
            console.log('committing track song: ', song)
            state.currentTrack.song = song
        }
    },
    actions: {
    },
    modules: {
    }
})
