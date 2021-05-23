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
- [ ] save current track and trackList when exiting
- 通知弹窗 (需要自己实现) 调用方式类似 [antdesign](https://2x.antdv.com/components/message-cn)
- 播放列表
- 是否在 vuex 上做个中间层把所有数据缓存呢
- 进度条已播放部分的颜色
- 如何在组件里使用 BS 的 Scss 变量?

## Issues
- [ ] vue dev tool 下载失败 据上游 [issue](https://github.com/MarshallOfSound/electron-devtools-installer/issues/77) 这应该是 electron.net 的问题
- [ ] MediaSession API lacks the control of volume

## Special Thanks
Special thanks to [electron-netease-cloud-music](https://github.com/Rocket1184/electron-netease-cloud-music), I've referred to this project a lot during development. 

## Credits
- [Glee](https://github.com/nondanee/Glee)
- [YesPlayMusic](https://github.com/qier222/YesPlayMusic)
- [vue-netease-music](https://github.com/sl1673495/vue-netease-music)
