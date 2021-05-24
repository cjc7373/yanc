import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Search.vue'
import PlaylistDetail from '@/views/PlaylistDetail.vue'
import Settings from '@/views/Settings.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/PersonalFM.vue')
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
    },
    {
        path: '/playlists/:id',
        name: 'Playlist',
        component: PlaylistDetail
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
