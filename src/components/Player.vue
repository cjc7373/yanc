<template>
    <img id="background" alt="background" :src="track.albumPicUrl" :hidden="!shown" v-if="!loading"/>
    <div id="player" :hidden="!shown" v-if="!loading">
        <div id="left"></div>
        <div id="right">
            <p v-for="(line, index) in parsedLrc.lyric" :key="index">
                {{ line.content }}
                <span v-if="parsedLrc.tlyric">
                    <br> {{ parsedLrc.tlyric[index] }}
                </span>
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
        }
    },
    setup (props) {
        interface Lyric {
            time: number;
            content: string;
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
            return {
                lyric: parseLyric(lrc.lrc.lyric || ''),
                tlyric: parseLyric(lrc.tlyric.lyric || ''),
                lyricuser: lrc.lyricUser,
                transuser: lrc.transUser
            }
        }

        const parsedLrc = ref()
        const loading = ref(true)

        watch(() => props.track, async (track: any) => {
            const lrc = await api.lyric({ id: track.id })
            parsedLrc.value = lyricParse(lrc.body)
            loading.value = false
        })

        return { parsedLrc, loading }
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

        p {
            color: black;
        }
    }
}
</style>
