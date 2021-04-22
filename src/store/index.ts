import { createStore, StoreOptions } from 'vuex'

export class Track {
    id = 0;
    name = '';
    albumName = '';
    albumPicUrl = '';
    artist: Array<any> = [];
}

const store = createStore({
    state: {
        isLogin: false,
        profile: undefined,
        currentPlaylist: null, // now displaying playlist
        triggerTrack: new Track(),
        currentTrack: new Track(),
        trackList: Array<Track>(), // now playing tracks
        currentTrackIndex: 0
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
        updateTriggerTrack (state, track) {
            state.triggerTrack = track
        },
        updateCurrentTrackUrl (state, song: string) {
            console.log('committing track song: ', song)
            state.currentTrack.song = song
        },
        updateTrackList (state, trackList: Array<Track>) {
            state.trackList = trackList
        },
        updateCurrentTrackIndex (state, index) {
            state.currentTrackIndex = index
        }
    },
    actions: {
    },
    modules: {
    }
})

export default store
