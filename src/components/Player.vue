<template>
    <div id="player" :hidden="!shown" v-if="!loading">
        <p v-for="(line, index) in parsedLrc.lyric" :key="index">
            {{ line.content }}
        </p>
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
        // copy from https://github.com/sl1673495/vue-netease-music/blob/master/src/utils/lrcparse.js
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

#player {
    position: fixed;
    bottom: $barHeight;
    left: 0;
    width: 100%;
    height: 90%;
    background-color: white;
    overflow-y: scroll;
}
</style>
