<template>
    <div id="header">
        <button
            type="button"
            class="btn"
        >
            <i class="bi bi-arrow-left" />
        </button>
        <h1>
            Yet Another Netease Cloudmusic
        </h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup () {
        return {}
    }
})
</script>

<style lang="scss">
#header {
    background-color: #35b9f7;
    width: 100%;
    height: 60px;

    display: flex;
}
</style>
