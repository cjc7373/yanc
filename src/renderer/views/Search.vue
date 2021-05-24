<template>
    <div class="m-2">
        <input
            id="searchBox"
            class="form-control"
            placeholder="搜索音乐"
        >
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

export default defineComponent({
    components: {
        HelloWorld
    },
    setup() {
        return
    }
})
</script>
