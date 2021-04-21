<template>
    <div id="bar">
        <img alt="albumPic" :src="albumPic" />
        <!-- FIXME: the height is 1~2 px larger than width -->
        <button type="button" class="btn btn-primary m-1">
            <i class="bi bi-skip-start"></i>
        </button>

        <button type="button" class="btn btn-primary fs-2 m-1" @click="togglePlayPause">
            <i class="bi bi-play" v-if="!playControl.playing"></i>
            <i class="bi bi-pause" v-else></i>
        </button>

        <button type="button" class="btn btn-primary m-1">
            <i class="bi bi-skip-end"></i>
        </button>

        <div id="progressBar">
            <span id="name">{{ track.name }}</span>
            <span id="artist">{{ artist }}</span>
            <span id="playTime"></span>
            <input type="range" class="form-range" id="customRange1">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { Howl } from 'howler'

export default defineComponent({
    setup (props) {
        const store = useStore()

        const track = computed(() => store.state.currentTrack)
        const albumPic = computed(() => track.value ? track.value.al.picUrl : '@/assets/logo.png')
        const artist = computed(() => track.value.ar.map((item: any) => item.name).join(', '))

        const formattedTime = (ms: number) => {
            const t = ms / 1000
            const m = Math.floor(t / 60)
            const mm = m > 9 ? `${m}` : `0${m}`
            const s = Math.floor(t % 60)
            const ss = s > 9 ? `${s}` : `0${s}`
            return `${mm}:${ss}`
        }

        interface PlayControl {
            sound: Howl;
            playing: boolean;
            timeElapsed: number;
            timeTotal: number;
        }

        const playControl: PlayControl = reactive({
            playing: false,
            timeElapsed: 0,
            timeTotal: 0,
            sound: undefined
        })

        watch(track, newTrack => {
            console.log('current track is: ', newTrack)
            console.log('current song is: ', newTrack.song)
            // this object will not be garbage collected.. so we need to pause manually
            if (playControl.sound) {
                playControl.sound.stop()
            }
            playControl.sound = new Howl({
                src: [newTrack.song.url],
                // Partial stream is not possible in Web Audio API
                // See: https://github.com/goldfire/howler.js/issues/1180
                // and: https://github.com/VikeLabs/lecshare/issues/38
                html5: true
            })
            playControl.playing = true
            playControl.sound.play()
        })

        const togglePlayPause = () => {
            if (playControl.playing) playControl.sound.pause()
            else playControl.sound.play()

            playControl.playing = !playControl.playing
        }

        return {
            track, albumPic, artist, formattedTime, playControl, togglePlayPause
        }
    }
})
</script>

<style lang="scss">
    $barHeight: 60px;

    body {
        margin-bottom: 80px !important; /* Margin bottom by footer height */
    }
    #bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: $barHeight;
        // text-align: start;
        background-color: white;
        display: flex;
        align-items: center;

        button {
            border-radius: 50%;
        }
    }

    img {
        width: $barHeight;
        height: $barHeight;
    }

    #progressBar {
        display: flex;
    }
</style>
