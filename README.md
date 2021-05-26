# yanc - Yet Another Netease Cloudmusic
Using Vue 3 + Vite + Electron.
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

## TODO
- save current track and trackList when exiting
- 通知弹窗 (需要自己实现) 调用方式类似 [antdesign](https://2x.antdv.com/components/message-cn)
- 播放列表
- 是否在 vuex 上做个中间层把所有数据缓存呢
- 进度条已播放部分的颜色
- 如何在组件里使用 BS 的 Scss 变量?
- 把三个 vite.config.js 合并, 把 dist 文件夹移到项目根目录
- cache, downloader, musicServer
- 歌单中歌曲的增删
- 歌单的增删
- 私人 FM

## Issues
- electron-devtools-installer 安装 vue-dev-tools 失败, 根据[此 issue](https://github.com/MarshallOfSound/electron-devtools-installer/issues/187), 是 rollup 和 semver 不兼容导致的
  目前手动注释了 electron-devtools-installer 中判断兼容性的部分
- bootstrap 目前会导致一堆 warning 见: https://github.com/twbs/bootstrap/issues/34051
- MediaSession API lacks the control of volume

## Dev doc
缓存:
音乐包含元数据和资源, 资源包括歌曲封面, 歌曲, MV 等.

## Special Thanks
Special thanks to [electron-netease-cloud-music](https://github.com/Rocket1184/electron-netease-cloud-music), I've referred to this project a lot during development. 

## Credits
- [Glee](https://github.com/nondanee/Glee)
- [YesPlayMusic](https://github.com/qier222/YesPlayMusic)
- [vue-netease-music](https://github.com/sl1673495/vue-netease-music)
