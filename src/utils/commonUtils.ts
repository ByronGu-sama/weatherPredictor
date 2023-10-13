import {ElMessage, ElNotification} from "element-plus";


/*
* @Author:ByronGu
* @Date:2023/09/17
* @param data 消息列表
* @param gap 推送间隔时间 默认在此基础上+50ms
* @Description 推送消息
*/
interface notification{
    title:string,
    content:string,
    type:any
}
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

/*
* @Author:ByronGu
* @Date:2023/09/17
* @param number 倒推多少天 限制1-10天
* @Description 在今天的日期基础上往回倒推number天
* @return 日期字符串列表 yyyyMMdd
*/
const calcPreviousDays = (number:number) => {
    if(number < 1 || number >10){
        ElMessage({
            message:'非法参数',
            type:'error'
        })
        return
    }
    const ONE_DAY_STAMP:number = 24 * 60 * 60 * 1000
    let daysList:string[] = []
    let now:Date = new Date()
    let timestamp:number = now.getTime()
    for(let i:number = 1; i<=number; i++){
        let temp:Date = new Date(timestamp - i * ONE_DAY_STAMP)
        console.log(temp)
        let tempMonth:number = temp.getMonth()+1
        let month:string = tempMonth<10?'0'+tempMonth:tempMonth+''
        let day:string = temp.getDate()<10?'0'+temp.getDate():temp.getDate()+''
        let present:string = temp.getFullYear()+month+day
        daysList.push(present)
    }
    return daysList
}

/*
* @Author:ByronGu
* @Date:2023/10/13
* @param val 日期
* @Description 根据日期返回周数
*/
const processWeek = (val:string) => {
    let week:number = new Date(val).getDay()
    switch (week){
        case 1:
            return '周一'
        case 2:
            return '周二'
        case 3:
            return '周三'
        case 4:
            return '周四'
        case 5:
            return '周五'
        case 6:
            return '周六'
        case 0:
            return '周日'
    }
}

/*
* @Author:ByronGu
* @Date:2023/10/13
* @param vis 能见度
* @Description 归类能见度
*/
const determineVisibility = (vis:any) => {
    vis = parseInt(vis)
    if(vis){
        switch (vis){
            case vis < 1:
                return '能见度几乎为零'
            case vis < 10:
                return '能见度差'
            case vis < 15:
                return '能见度较差'
            case vis < 20:
                return '能见度一般'
            case vis < 25:
                return '能见度好'
            default:
                return '能见度极好'
        }
    }else{
        return '能见度好'
    }
}

/*
* @Author:ByronGu
* @Date:2023/10/13
* @param humidity 当前湿度
* @Description 根据湿度返回分类等级
*/
const determineHumidity = (humidity:any) => {
    if(humidity){
        humidity = parseInt(humidity)
        switch (true){
            case humidity < 10:
                return '特别干燥'
            case humidity < 20:
                return '较干燥'
            case humidity < 30:
                return '干燥'
            case humidity < 40:
                return '舒适干燥'
            case humidity < 50:
                return '轻微潮湿'
            case humidity < 60:
                return '偏潮'
            case humidity < 70:
                return '潮湿'
            case humidity < 80:
                return '较湿润'
            default:
                return '特别湿润'
        }
    }else{
        return '偏潮'
    }
}
export default {
    pushNotification,
    calcPreviousDays,
    processWeek,
    determineVisibility,
    determineHumidity,

}