import {ElNotification} from "element-plus";

interface notification{
    title:string,     
    content:string,
    type:string
}
//通知推送
const pushNotification = (data:notification[],gap:number):void => {
    let timer:any = null
    if(data.length>0){
        let i:number = 0
        ElNotification({
            title:data[i].title,
            message:data[i].content,
            type:data[i].type,
            duration:gap
        })
        i++
        timer = setInterval(() => {
            if (i !== data.length){
                ElNotification({
                    title:data[i].title,
                    message:data[i].content,
                    type:data[i].type,
                    duration:gap
                })
                i++
            }else
                clearInterval(timer)
        },gap+50)
    }
}

export default {
    pushNotification,

}