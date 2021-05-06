<template>
    <div>
        <div
            v-if="loading"
            class="spinner-border"
            role="status"
        >
            <span class="visually-hidden">Loading...</span>
        </div>

        <table
            v-else
            class="table table-striped table-hover"
        >
            <tbody>
                <tr
                    v-for="(track, index) in playlist.tracks"
                    :key="track.id"
                    @dblclick="changeTrack(track)"
                >
                    <th scope="row">
                        {{ index }}
                    </th>
                    <td>{{ track.name }}</td>
                    <td>{{ track.ar.map((item) => item.name).join('/') }}</td>
                    <td>{{ track.al.name }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/ipcRenderer'
import { useStore } from 'vuex'
import { Track } from '@/store/index'

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

        const changeTrack = async (track: Track) => {
            store.commit('updateTrackList', playlist.value.tracks.map((item: any) => {
                return {
                    name: item.name,
                    id: item.id,
                    albumName: item.al.name,
                    albumPicUrl: item.al.picUrl,
                    artist: item.ar
                }
            }))
            store.commit('updateTriggerTrack', track)
        }

        return {
            loading, playlist, changeTrack
        }
    }
})
</script>

<style lang="scss">
tr {
    cursor: pointer;
}
</style>
