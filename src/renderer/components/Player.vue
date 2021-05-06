<template>
    <img
        v-if="!loading"
        id="background"
        alt="background"
        :src="track.albumPicUrl"
        :hidden="!shown"
    >
    <div
        v-if="!loading"
        id="player"
        :hidden="!shown"
    >
        <div id="left" />
        <div
            id="right"
            ref="right"
            @scroll="handleScroll"
        >
            <p
                v-for="(line, index) in parsedLrc.lyric"
                :key="index"
                :class="{'current-line': currentLine === index}"
            >
                {{ line.content }}
                <br v-if="line.translation">
                {{ line.translation }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { Track } from '@/store'
import { defineComponent, ref, watch } from 'vue'
import api from '@/ipcRenderer'

export default defineComponent({
    props: {
        shown: Boolean,
        track: {
            // type: Track, // This is not related with typescript, only vue's custom validation?
            required: true
        },
        playControl: {
            required: true
        }
    },
    setup (props) {
        interface Lyric {
            time: number;
            content: string;
            translation?: string;
        }
        // copied from https://github.com/sl1673495/vue-netease-music/blob/master/src/utils/lrcparse.js
        const parseLyric = (lrc: string) => {
            const lyrics = lrc.split('\n')
            const lrcArray: Array<Lyric> = []
            for (let i = 0; i < lyrics.length; i++) {
                const lyric = lyrics[i]
                const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g
                const timeRegExpArr = lyric.match(timeReg)
                if (!timeRegExpArr) continue
                const content = lyric.replace(timeReg, '')
                for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
                    const t = timeRegExpArr[k]
                    const min = Number(String(t.match(/\[\d*/i)).slice(1))
                    const sec = Number(String(t.match(/:\d*/i)).slice(1))
                    const time = min * 60 + sec
                    if (content !== '') {
                        lrcArray.push({ time: time, content })
                    }
                }
            }
            return lrcArray
        }

        const lyricParse = (lrc: any) => {
            const lyric = parseLyric(lrc.lrc?.lyric || '')
            const tlyric = parseLyric(lrc.tlyric?.lyric || '')

            if (!lyric.length) {
                lyric.push({ time: 0, content: '暂无歌词' })
            } else {
                lyric.sort((f, s) => f.time < s.time ? 0 : 1)
                lyric.map(item => {
                    const translation = tlyric.find(i => i.time === item.time)
                    if (translation) {
                        item.translation = translation.content
                    }
                })
            }

            return {
                lyric: lyric,
                lyricuser: lrc.lyricUser,
                transuser: lrc.transUser
            }
        }

        const parsedLrc = ref()
        const loading = ref(true)
        const currentLine = ref(0)
        const right = ref()

        watch((): any => props.track, async (track: Track) => {
            const lrc = await api.lyric({ id: track.id })
            parsedLrc.value = lyricParse(lrc.body)
            currentLine.value = 0
            loading.value = false
        })

        watch(() => props.playControl.timeElapsed, time => {
            if (!parsedLrc.value.lyric.length) return
            // console.log(parsedLrc.value.lyric)
            // console.log(currentLine.value)
            const l = parsedLrc.value.lyric.length
            while (l > currentLine.value + 1 && time > parsedLrc.value.lyric[currentLine.value + 1].time) {
                currentLine.value++
            }
            while (currentLine.value > 0 && time < parsedLrc.value.lyric[currentLine.value].time) {
                currentLine.value--
            }
            // console.log(right.value.children[currentLine.value])
            // FIXME: 在滚动完成后零点几秒又有一次向上几个像素的滚动
            right.value.children[currentLine.value].scrollIntoView({ block: 'center', behavior: 'smooth' })
        })

        const handleScroll = (event) => {
            // console.log(event)
        }

        return { parsedLrc, loading, currentLine, right, handleScroll }
    }
})
</script>

<style lang="scss">
$barHeight: 60px;

#background {
    width: 100%;
    position: fixed;
    bottom: $barHeight;
}

#player {
    position: fixed;
    bottom: $barHeight;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(255, 255, 255, 0.5);
    backdrop-filter: blur(20px);
    // opacity: 0.7;

    display: flex;

    #left {
        width: 50%;
    }

    #right {
        overflow-y: scroll;
        height: 50%;
        width: 50%;
        margin-top: 20%;

        // scroll-behavior: smooth;

        p {
            color: black;
        }

        .current-line {
            text-shadow: 1px 1px 2px white;
            font-size: 1.2rem;
        }
    }
}
</style>
