<template>
    <Header id="header" />
    <div id="content">
        <NavBar />
        <router-view id="router-view" />
    </div>
    <player-bar />
</template>

<script lang="ts">
import PlayerBar from '@/components/PlayerBar.vue' // @ is an alias to /src
import NavBar from '@/components/Nav.vue'
import Header from '@/components/Header.vue'
import api from '@/ipcRenderer'
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    components: {
        PlayerBar,
        NavBar,
        Header
    },
    setup () {
        const store = useStore()

        onMounted(async () => {
            const account = await api.user_account()
            if (account.status === 200) {
                store.commit('login') // TODO: move this to login method
                store.commit('updateProfile', account.body.profile)
                console.log('profile: ', account.body.profile)
            }
            await api.user_subcount()
        })
    }
})
</script>

<style lang="scss">
body {
    overflow: hidden;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    height: 100vh;
}

#content {
    display: flex;
    flex-grow: 1;
    min-height: 0; // haven't digged into this yet.. see: https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size

    #router-view {
        overflow-y: scroll;
        height: 100%;
        flex-grow: 1;
    }

    // #navbar {
    //     height: 100%;
    // }
}
</style>
