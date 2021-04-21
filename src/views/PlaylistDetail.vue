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
import { defineComponent, ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/ipcRenderer'
import { useStore } from 'vuex'

export default defineComponent({
    setup () {
        const loading = ref(true)
        const route = useRoute()
        const store = useStore()

        const playlist = computed(() => store.state.currentPlaylist)

        const getPlaylist = async (id: string) => {
            const res = await api.playlist_detail({ id: id })
            store.commit('updateCurrentPlaylist', res.body.playlist)
            loading.value = false
        }

        onMounted(() => getPlaylist(route.params.id as string))

        watch(() => route.params, async toParams => {
            await getPlaylist(toParams.id as string)
        })

        const changeTrack = async (track: any) => {
            const res = await api.song_url({ id: track.id, br: 320000 }) // FIXME: currently using fixed br to reduce bandwidth
            store.commit('updateCurrentTrack', track)
            store.commit('updateCurrentTrackUrl', JSON.parse(new TextDecoder().decode(res.body)).data[0])
        }

        return {
            loading, playlist, changeTrack
        }
    }
})
</script>

<style lang="scss">

</style>
