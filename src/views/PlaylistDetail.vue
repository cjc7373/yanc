<template>
    <div>
        <div class="spinner-border" role="status" v-if="loading">
            <span class="visually-hidden">Loading...</span>
        </div>

        <div v-else class="list-group">
            <button type="button" class="list-group-item list-group-item-action" v-for="track in playlist.tracks" :key="track.id"
            @dblclick="changeTrack(track)">{{ track.name }}</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/ipcRenderer'
import { useStore } from 'vuex'

export default defineComponent({
    setup () {
        const loading = ref(true)
        const route = useRoute()
        const store = useStore()

        const playlist = computed(() => store.state.currentPlaylist)

        watch(() => route.params, async toParams => {
            const id = toParams.id
            const res = await api.playlist_detail({ id: id })
            store.commit('updateCurrentPlaylist', res.body.playlist)
            loading.value = false
        })

        const changeTrack = (track: any) => {
            store.commit('updateCurrentTrack', track)
        }

        return {
            loading, playlist, changeTrack
        }
    }
})
</script>

<style lang="scss">

</style>
