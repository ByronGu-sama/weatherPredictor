import {ElNotification} from "element-plus";

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
    let timer:any = null;
    if(data.length>0){
        let i:number = 0
        ElNotification({
            title:data[i].title,
            message:data[i].content,
            type:data[i].type,
            duration:gap
        })
        i++;
        timer = setInterval(() => {
            if (i !== data.length){
                ElNotification({
                    title:data[i].title,
                    message:data[i].content,
                    type:data[i].type,
                    duration:gap
                })
                i++;
            }else
                clearInterval(timer)
        },gap+50)
    }
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
        switch (true){
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
        return '暂无数据'
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
                return '较潮湿'
            default:
                return '特别潮湿'
        }
    }else{
        return '偏潮'
    }
}

/*
* @Author:ByronGu
* @Date:2023/10/14
* @param t 温度 ˚C
* @param v 风速（m/s）
* @param rh 相对湿度（%）
* @Description  体感温度计算公式
*/
const calcApparentTemperature = (t:number,v:number,rh:number) => {
    return 1.07 * t + 0.2 * (rh / 100 * 6.105 * Math.exp(17.27 * t / (237.7 + t))) - 0.65 * v - 2.7
}

/*
* @Author:ByronGu
* @Date:2023/10/14
* @param
* @Description 根据湿度和气温返回相应的提示语
*/
const handleTipsAboutT_and_H = (t:number | string,h:number | string) => {
    if((typeof t == 'number' || 'string') && (typeof h == 'number' || 'string')){
        t = typeof t == 'number' ?t:parseFloat(t)
        h = typeof h == 'number' ?t:parseInt(h)
    }else{
        return '类型错误'
    }
    if(h > 60){
        switch (true){
            case t > 30:
                return '天气闷热难耐'
            case t > 25:
                return '潮湿使人感觉更热'
            case t > 20:
                return '潮湿使人感觉更凉快'
            case t > 10:
                return '潮湿使人感觉更冷'
            default:
                return '湿冷空气来临'
        }
    }else if(h < 30){
        if(t < 15){
            return '空气干燥，注意静电哦'
        }else{
            return '空气干燥'
        }
    }else{
        switch (true){
            case t > 30:
                return '高温天气谨防中暑哦'
            case t > 25:
                return '天气温热，适合放松哦'
            case t > 20:
                return '温度宜人，多出门亲近大自然吧'
            case t > 10:
                return '气温较低，注意别感冒哦'
            default:
                return '天气寒冷，记得多添一件衣服'
        }
    }
}

const require = (imgPath:string) => {
    try {
        const handlePath:string = imgPath.replace('@', '..');
        return new URL(handlePath, import.meta.url).href;
    } catch (error) {
        console.warn(error);
    }
}

export default {
    pushNotification,
    processWeek,
    determineVisibility,
    determineHumidity,
    calcApparentTemperature,
    handleTipsAboutT_and_H,
    require,
}