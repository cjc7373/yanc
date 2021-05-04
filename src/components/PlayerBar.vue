<template>
    <Player :track="track" :shown="playerShown" :playControl="playControl" />

    <div id="bar">
        <div class="cover" @click="playerShown = !playerShown">
            <img alt="albumPic" :src="albumPic" />
            <i class="bi bi-fullscreen-exit" v-if="playerShown"></i>
            <i class="bi bi-fullscreen" v-else></i>
        </div>

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
            <input type="range" class="form-range" :value="playControl.timeElapsed / playControl.timeTotal"
            max="1" min="0" step="0.002" @input="handleSeekMousedown" @mouseup="handleSeekMouseup">
        </div>

        <button class="btn">
            <i class="bi bi-folder-plus"></i>
        </button>

        <button @click="handleLoopModeSwitch" class="btn">
            <i class="bi bi-shuffle" v-if="currentLoopMode == 'shuffle'"></i>
            <i class="bi bi-arrow-repeat" v-if="currentLoopMode == 'repeat'"></i>
            <i class="bi bi-bootstrap-reboot" v-if="currentLoopMode == 'repeat-one'"></i>
            <!-- missing repeat and repeat one -->
        </button>

        <MDBPopover v-model="volumePopover" dismissible>
            <template #reference>
            <a
                class="btn"
                tabindex="0"
                @click="volumePopover = !volumePopover"
                >
                <i class="bi bi-volume-up"></i>
            </a>
            </template>
            <template #body>
                <input type="range" class="form-range" max="1" min="0" step="0.01" v-model="volume">
            </template>
        </MDBPopover>

        <button class="btn">
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
import { cycle } from '@/utils'
// import Popover from '@/components/bootstrap/Popover.vue'
import { MDBPopover } from 'mdb-vue-ui-kit'
import Player from '@/components/Player.vue'

export default defineComponent({
    components: {
        MDBPopover,
        Player
    },
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
            sound: any;
            playing: boolean;
            timeElapsed: number;
            timeTotal: number;
            timer?: any;
        }

        const playControl: PlayControl = reactive({
            playing: false,
            timeElapsed: 0,
            timeTotal: 0.0001,
            sound: undefined,
            timer: undefined
        })

        const volumePopover = ref(false)
        const volume = ref(1)

        watch(volume, (newVolume) => {
            playControl.sound.volume(newVolume)
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

        const stop = () => {
            playControl.sound.stop()
            playControl.timeElapsed = 0
            clearInterval(playControl.timer)
            playControl.playing = false
        }

        const getTrackUrl = async (id: number) => {
            const res = await api.song_url({ id: id, br: 320000 }) // FIXME: currently using fixed br to reduce bandwidth
            const song = JSON.parse(new TextDecoder().decode(res.body)).data[0]
            console.log('the current song is ', song)
            return song.url
        }

        const trackList = computed<Track[]>(() => store.state.trackList)
        const reorderedTrackList: Track[] = reactive([])
        const currentPosition = ref(0)

        type LoopMode = 'repeat' | 'repeat-one' | 'shuffle'
        const loopModeGenerator = cycle(['repeat', 'repeat-one', 'shuffle'])
        const currentLoopMode = ref<LoopMode>(loopModeGenerator.next().value)

        const track = computed(() => reorderedTrackList.length ? reorderedTrackList[currentPosition.value] : new Track())
        const albumPic = computed(() => track.value ? track.value.albumPicUrl : '@/assets/logo.png')
        const artist = computed(() => track.value.artist.map((item: any) => item.name).join('/'))

        const playCurrentPosition = async () => {
            // this object will not be garbage collected.. so we need to pause manually.. FIXME: why?
            if (playControl.sound) {
                stop()
            }
            playControl.sound = new Howl({
                src: [await getTrackUrl(reorderedTrackList[currentPosition.value].id)],
                // Partial stream is not possible in Web Audio API
                // See: https://github.com/goldfire/howler.js/issues/1180
                // and: https://github.com/VikeLabs/lecshare/issues/38
                html5: true,
                volume: volume.value
            })

            playControl.sound.on('load', () => {
                playControl.timeTotal = playControl.sound.duration()
            })

            playControl.sound.on('end', async () => {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                await playNext()
            })

            play()
        }

        // FIXME: 切歌太快会同时放两首歌
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

        const reorderTrackList = (loopMode: LoopMode, currentTrack: Track) => {
            currentTrack = Object.assign({}, currentTrack) // copy the object

            const getCurrentTrackIndex = (trackList: Array<Track>) => {
                let currentTrackIndex = 0
                trackList.forEach((item: Track, index: number) => {
                    if (item.id === currentTrack.id) {
                        currentTrackIndex = index
                    }
                })
                return currentTrackIndex
            }

            reorderedTrackList.splice(0, reorderedTrackList.length) // clear array
            switch (loopMode) {
                case 'repeat':
                    for (const item of trackList.value) {
                        reorderedTrackList.push(item)
                    }
                    currentPosition.value = getCurrentTrackIndex(trackList.value) // make sure current track is the first to play
                    currentLoopMode.value = 'repeat'
                    break
                case 'repeat-one':
                    reorderedTrackList.push(trackList.value[getCurrentTrackIndex(trackList.value)])
                    currentPosition.value = 0
                    currentLoopMode.value = 'repeat-one'
                    break
                case 'shuffle':
                    for (const item of trackList.value) {
                        reorderedTrackList.push(item)
                    }

                    // Fisher-Yates shuffle algorithm
                    for (let i = reorderedTrackList.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

                        // swap elements array[i] and array[j]
                        [reorderedTrackList[i], reorderedTrackList[j]] = [reorderedTrackList[j], reorderedTrackList[i]]
                    }

                    // console.log(currentTrack)
                    currentPosition.value = getCurrentTrackIndex(reorderedTrackList)
                    currentLoopMode.value = 'shuffle'
                    break
            }
        }

        watch(computed(() => store.state.noise), async () => {
            console.log('the trigger track is: ', store.state.triggerTrack)

            reorderTrackList(currentLoopMode.value, store.state.triggerTrack)
            await playCurrentPosition()
        })

        const handleLoopModeSwitch = () => {
            const nextLoopMode: LoopMode = loopModeGenerator.next().value
            reorderTrackList(nextLoopMode, track.value)
        }

        const togglePlayPause = () => {
            if (playControl.playing) {
                pause()
            } else {
                play()
            }
        }

        const handleSeekMousedown = (event: any) => {
            pause()
            const percent: number = event.target.value
            playControl.timeElapsed = playControl.timeTotal * percent
            playControl.sound.seek(playControl.timeElapsed)
        }

        const handleSeekMouseup = () => {
            play()
        }

        const playerShown = ref(false)

        return {
            track,
            albumPic,
            artist,
            formattedTime,
            playControl,
            togglePlayPause,
            handleSeekMousedown,
            handleSeekMouseup,
            trackList,
            reorderedTrackList,
            playNext,
            playPrevious,
            currentLoopMode,
            handleLoopModeSwitch,
            volumePopover,
            volume,
            playerShown
        }
    }
})
</script>

<style lang="scss">
    $barHeight: 60px;

    #bar {
        width: 100%;
        height: $barHeight;
        // text-align: start;
        background-color: white;
        display: flex;
        align-items: center;

        .btn {
            border-radius: 50%;
        }
    }

    .cover {
        cursor: pointer;
        position: relative;
        img {
            width: $barHeight;
            height: $barHeight;
        }
        i {
            top: 8px;
            left: 14px;
            opacity: 0;
            position: absolute;
            font-size: 2rem;
        }
        &:hover {
            img {
                opacity: 0.65;
            }
            i {
                opacity: 1;
            }
        }
        &:active {
            img {
                opacity: 0.3;
            }
        }
    }

    #progressBar {
        flex-grow: 1;

        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
</style>
