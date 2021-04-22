<template>
    <div id="bar">
        <img alt="albumPic" :src="albumPic" />
        <!-- FIXME: the height is 1~2 px larger than width -->
        <button type="button" class="btn btn-primary m-1" @click="playPrevious">
            <i class="bi bi-skip-start"></i>
        </button>

        <button type="button" class="btn btn-primary fs-2 m-1" @click="togglePlayPause">
            <i class="bi bi-play" v-if="!playControl.playing"></i>
            <i class="bi bi-pause" v-else></i>
        </button>

        <button type="button" class="btn btn-primary m-1" @click="playNext">
            <i class="bi bi-skip-end"></i>
        </button>

        <div id="progressBar">
            <span>
                <span id="name">{{ track.name }} - </span>
                <span id="artist">{{ artist }}</span>
            </span>
            <span id="playTime">{{ formattedTime(playControl.timeElapsed) }} / {{ formattedTime(playControl.timeTotal) }}</span>
            <input type="range" class="form-range" id="customRange1" :value="playControl.timeElapsed / playControl.timeTotal"
            max="1" min="0" step="0.002" @change="handleSeek">
        </div>

        <button>
            <i class="bi bi-folder-plus"></i>
        </button>

        <button>
            <i class="bi bi-shuffle"></i>
            <!-- missing repeat and repeat one -->
        </button>

        <button>
            <i class="bi bi-volume-up"></i>
        </button>

        <button>
            <i class="bi bi-list-ul"></i>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { Howl } from 'howler'
import api from '@/ipcRenderer'
import { Track } from '@/store/index'

export default defineComponent({
    setup () {
        const store = useStore()

        const formattedTime = (t: number) => {
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
            timer?: number;
        }

        const playControl: PlayControl = reactive({
            playing: false,
            timeElapsed: 0,
            timeTotal: 0.0001,
            sound: undefined,
            timer: undefined
        })

        const play = () => {
            playControl.sound.play()
            playControl.timer = setInterval(() => {
                playControl.timeElapsed = Number(playControl.sound.seek())
                // console.log(playControl.sound.seek())
            }, 1000)
            playControl.playing = true
        }

        const pause = () => {
            playControl.sound.pause()
            clearInterval(playControl.timer)
            playControl.playing = false
        }

        const getTrackUrl = async (id: number) => {
            const res = await api.song_url({ id: id, br: 320000 }) // FIXME: currently using fixed br to reduce bandwidth
            const song = JSON.parse(new TextDecoder().decode(res.body)).data[0]
            return song.url
        }

        const trackList = computed(() => store.state.trackList)
        const reorderedTrackList: Array<Track> = reactive([])
        const currentPosition = ref(0)
        const loopMode = ref('repeat')

        const track = computed(() => reorderedTrackList.length ? reorderedTrackList[currentPosition.value] : new Track())
        const albumPic = computed(() => track.value ? track.value.albumPicUrl : '@/assets/logo.png')
        const artist = computed(() => track.value.artist.map((item: any) => item.name).join('/'))

        const playCurrentPosition = async () => {
            // this object will not be garbage collected.. so we need to pause manually
            if (playControl.sound) {
                playControl.sound.stop()
            }
            playControl.sound = new Howl({
                src: [await getTrackUrl(reorderedTrackList[currentPosition.value].id)],
                // Partial stream is not possible in Web Audio API
                // See: https://github.com/goldfire/howler.js/issues/1180
                // and: https://github.com/VikeLabs/lecshare/issues/38
                html5: true
            })

            playControl.sound.on('load', () => {
                playControl.timeTotal = playControl.sound.duration()
            })

            playControl.sound.on('end', async () => {
                await playNext()
            })

            play()
        }

        const playNext = async () => {
            currentPosition.value++
            if (currentPosition.value >= reorderedTrackList.length) {
                currentPosition.value = 0
            }

            await playCurrentPosition()
        }

        const playPrevious = async () => {
            currentPosition.value--
            if (currentPosition.value < 0) {
                currentPosition.value = reorderedTrackList.length - 1
            }

            await playCurrentPosition()
        }

        watch(computed(() => store.state.triggerTrack), async track => {
            console.log('the trigger track is: ', track)

            let currentTrackIndex = 0
            reorderedTrackList.splice(0, reorderedTrackList.length) // clear array
            console.log(track)
            trackList.value.forEach((item: Track, index: number) => {
                reorderedTrackList.push(item)
                if (item.id === track.id) {
                    currentTrackIndex = index
                }
            })
            reorderedTrackList.push(...reorderedTrackList.splice(0, currentTrackIndex))

            currentPosition.value = -1
            await playNext()
        })

        const togglePlayPause = () => {
            if (playControl.playing) {
                pause()
            } else {
                play()
            }
        }

        const handleSeek = (event: any) => {
            const percent: number = event.target.value
            playControl.sound.seek(playControl.timeTotal * percent)
            play()
        }

        return {
            track,
            albumPic,
            artist,
            formattedTime,
            playControl,
            togglePlayPause,
            handleSeek,
            trackList,
            reorderedTrackList,
            playNext,
            playPrevious
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
        flex-grow: 1;

        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
</style>
