<template>
    <NavBar />
    <router-view />
    <PlayerBar />
</template>

<script lang="ts">
import PlayerBar from '@/components/PlayerBar.vue' // @ is an alias to /src
import NavBar from '@/components/Nav.vue'

export default {
    components: {
        PlayerBar,
        NavBar
    }
}
</script>

<style lang="scss">
#app {
    display: flex;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
