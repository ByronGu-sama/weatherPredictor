import {createRouter,createWebHashHistory} from "vue-router";

const routes = [
    {
        path:'/',
        name:'天气',
        component:() => import("../components/home.vue")
    },{
        path:'/tips',
        name:'help',
        component:() => import("../components/tips/tipsPage.vue")
    },{
        path:'/:catchAll(.*)',
        name:'404 Not Found',
        component:() => import("../components/notFound/notFound.vue")
    }
]

const router = new (createRouter as any)({
    history:createWebHashHistory(),
    routes
})

export default router