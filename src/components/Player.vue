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
            type: Track,
            required: true
        }
    },
    setup (props) {
        // copy from https://github.com/sl1673495/vue-netease-music/blob/master/src/utils/lrcparse.js
        const parseLyric = (lrc: string) => {
            const lyrics = lrc.split('\n')
            const lrcObj = []
            for (let i = 0; i < lyrics.length; i++) {
                const lyric = decodeURIComponent(lyrics[i])
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
                        lrcObj.push({ time: time, content })
                    }
                }
            }
            return lrcObj
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

        watch(() => props.track, async (track) => {
            const lrc = await api.lyric({ id: track.id })
            parsedLrc.value = lyricParse(lrc.body)
            loading.value = false
            console.log(parseLyric)
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
    z-index: 100;
    width: 100%;
    background-color: white;
    overflow-x: scroll;
}
</style>
