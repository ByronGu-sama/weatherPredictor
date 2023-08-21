const GEOAPI:string = 'https://geoapi.qweather.com'
const API:string = 'https://api.qweather.com'
export default<any>{
    LOCATION_FUZZY_SEARCH:GEOAPI+'/v2/city/lookup?',               //城市名称模糊搜索
    GET_NOW_WEATHER:API+'/v7/weather/now?',                        //获取实时天气
    GET_WEATHER_PREDICTOR_7D:API+'/v7/weather/7d?',                //未来七天 天气预报
    GET_WEATHER_PREDICTOR_10D:API+'/v7/weather/10d?',              //未来十五天 天气预报
    GET_WEATHER_PREDICTOR_24H:API+'/v7/weather/24h?',              //未来24小时天气预报
    GET_UVI_24H:API+'/v7/indices/1d?',                             //未来24小时uvi
}
