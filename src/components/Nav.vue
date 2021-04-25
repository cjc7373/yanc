<template>
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>

        <div class="list-group">
            <button class="list-group-item list-group-item-action" v-for="playlist in playlists" :key="playlist.id"
                @click="handleRoute(playlist)">
                <i class="bi bi-music-note-list"></i>
                {{ playlist.name }}
            </button>
        </div>

        <NavBottom></NavBottom>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import api from '@/ipcRenderer'
import NavBottom from '@/components/NavBottom.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
    components: {
        NavBottom
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()

        const profile = computed(() => store.state.profile)

        const playlists = ref() // is this really reactive?

        watch(profile, async (oldValue, newValue) => {
            if (profile.value) {
                const res = await api.user_playlist({ uid: profile.value.userId })
                playlists.value = res.body.playlist
            }
        })

        const handleRoute = (playlist: any) => {
            router.push({ name: 'Playlist', params: { id: playlist.id } })
        }

        return {
            playlists, handleRoute
        }
    }
})
</script>

<style lang="scss">
$navWidth: 200px;

#nav {
    display: flex;
    flex-direction: column;

    position: fixed;
    left: 0;
    height: 100vh;
    margin-bottom: 60px + 50px;
    overflow-y: scroll;

    width: $navWidth;

    border: solid;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
