import {createRouter,createWebHashHistory} from "vue-router";

const routes = [
    {
        path:'/',
        name:'天气',
        component:() => import("../components/home.vue")
    }
]

const router = new createRouter({
    history:createWebHashHistory(),
    routes
})

export default router