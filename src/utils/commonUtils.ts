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

export default {
    pushNotification,
    calcPreviousDays,
}