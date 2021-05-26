export function * cycle<T> (arr: T[]): Generator<T, any, unknown> { // FIXME: the type hint is inaccurate
    while (true) {
        for (const i of arr) {
            yield i
        }
    }
}

export function formattedTime(sec: number): string {
    const m = Math.floor(sec / 60)
    const mm = m > 9 ? `${m}` : `0${m}`
    const s = Math.floor(sec % 60)
    const ss = s > 9 ? `${s}` : `0${s}`
    return `${mm}:${ss}`
}

import { defineComponent } from 'vue'

export function message(content: string): void {
    console.log(1)
}
