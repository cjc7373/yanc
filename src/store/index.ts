import { createStore } from 'vuex'

export class Track {
    id = 0;
    name = '';
    albumName = '';
    albumPicUrl = '';
    artist: Array<any> = [];
    song: any;
}

const store = createStore({
    state: {
        isLogin: false,
        profile: undefined,
        currentPlaylist: null, // now displaying playlist
        triggerTrack: new Track(),
        noise: 0, // for update current track
        currentTrack: new Track(),
        trackList: Array<Track>(), // now playing tracks
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
            state.noise++
        },
        updateCurrentTrackUrl (state, song: string) {
            console.log('committing track song: ', song)
            state.currentTrack.song = song
        },
        updateTrackList (state, trackList: Array<Track>) {
            state.trackList = trackList
        }
    },
    actions: {
    },
    modules: {
    }
})

export default store
