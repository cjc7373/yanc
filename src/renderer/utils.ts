export function * cycle (arr: Array<any>) {
    while (true) {
        for (const i of arr) {
            yield i
        }
    }
}
