<template>
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>

        <ul class="list-group">
            <li class="list-group-item" v-for="track in playlist" :key="track.id">{{ track.name }}</li>
        </ul>

        <NavBottom></NavBottom>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, reactive } from 'vue'
import api from '@/ipcRenderer'
import { Modal } from 'bootstrap'
import NavBottom from '@/components/NavBottom.vue'
import { useStore } from 'vuex'

export default defineComponent({
    components: {
        NavBottom
    },
    setup (props) {
        const store = useStore()

        const profile = computed(() => store.state.profile)

        const playlist = ref() // is this really reactive?

        watch(profile, async (oldValue, newValue) => {
            if (profile.value) {
                const res = await api.user_playlist({ uid: profile.value.userId })
                playlist.value = res.body.playlist
            }
        })

        return {
            playlist
        }
    }
})
</script>

<style lang="scss" scoped>
#nav {
    display: flex;
    flex-direction: column;

    width: 200px;

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
