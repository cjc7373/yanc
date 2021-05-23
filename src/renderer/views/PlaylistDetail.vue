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
                    <td>{{ formattedTime(track.dt / 1000) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<!-- This new syntax is experimental. See RFC: https://github.com/vuejs/rfcs/pull/227 -->
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/ipcRenderer'
import { useStore } from 'vuex'
import { Track } from '@/store/index'
import { formattedTime } from '@/utils'



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
    loading.value = true
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
</script>

<style lang="scss">
tr {
    cursor: pointer;
}
</style>
