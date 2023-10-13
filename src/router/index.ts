import {createRouter,createWebHashHistory} from "vue-router";

const routes = [
    {
        path:'/',
        name:'天气',
        component:() => import("../components/home.vue")
    },
    {
        path:'/test',
        name:'test',
        component:() => import("../components/test/test.vue")
    },
    {
        path:'/weatherChart',
        name:'风云图',
        component:() => import("../components/bigDataChart/weatherChart.vue")
    },{
        path:'/:catchAll(.*)',
        name:'404 Not Found',
        component:() => import("../components/notFound/notFound.vue")
    }
]

const router = new createRouter({
    history:createWebHashHistory(),
    routes
})

export default router