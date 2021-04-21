<template>
    <div id="bar">
        <img alt="avatar" :src="track ? track.al.picUrl : '@/assets/logo.png'" />
        <button type="button" class="btn btn-primary">
            <i class="bi bi-skip-start"></i>
        </button>
        <button type="button" class="btn btn-primary">
            <i class="bi bi-play"></i>
        </button>
        <button type="button" class="btn btn-primary">
            <i class="bi bi-skip-end"></i>
        </button>

        <input type="range" class="form-range" id="customRange1">
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    setup (props) {
        const store = useStore()

        const track = computed(() => store.state.currentTrack)

        return {
            track
        }
    }
})
</script>

<style lang="scss">
    body {
        margin-bottom: 80px !important; /* Margin bottom by footer height */
    }
    #bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        text-align: start;
        background-color: white;
        display: flex;

        button {
            border-radius: 50%;
        }

        i {
            font-size: 1.5rem;
        }

        .bi-play {
            font-size: 2rem;
        }
    }
</style>
