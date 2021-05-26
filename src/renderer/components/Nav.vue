<template>
    <div id="nav">
        <div class="list-group">
            <router-link to="/">
                <button
                    class="list-group-item list-group-item-action"
                >
                    <i class="bi bi-search" />
                    <span>搜索</span>
                </button>
            </router-link> 
            <router-link to="/about">
                <button
                    class="list-group-item list-group-item-action"
                >
                    <i class="bi bi-search" />
                    <span>私人 FM</span>
                </button>
            </router-link>

            <button
                v-for="playlist in playlists"
                :key="playlist.id"
                class="list-group-item list-group-item-action"
                @click="handleRoute(playlist)"
            >
                <i class="bi bi-music-note-list" />
                <span class="playlist-name">{{ playlist.name }}</span>
            </button>
        </div>

        <NavBottom />
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
$navWidth: 250px;

#nav {
    display: flex;
    flex-direction: column;

    min-width: $navWidth;
    width: $navWidth;
    // flex-grow: 2;

    .list-group {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        
    }

    .playlist-name {
        text-overflow: ellipsis;
        // white-space: nowrap;
    }

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
