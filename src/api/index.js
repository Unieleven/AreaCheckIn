import http from '@/utils/request';

// 查询分论坛签到
export function getAreaList(params) {
    return http.get(`checkIns/queryCheckInSites?eventId=${params.eventId}&access_token=${params.accessToken}`, {
    });
}
// 生成核销二维码
export function getQrcodeInfo(params) {
    return http.get(`events/wj/verifyEnd/event/${params.eventId}/question/${params.surveyId}?access_token=${params.accessToken}`, {
    });
}
// 打卡签到接口
export function getClock(data) {
    return http.post(`checkIns/validateRegisterStatusAndCheckInByOpenId?access_token=${data.accessToken}`, 
        data
    );
}
// 核销二维码
export function hexiao(data) {
    return http.post('checkIns/app/attendees/getBward/byCode',
        data
    )
}
// 查询核销状态接口
export function QrcodeStatus(params){
    return http.get(`checkIns/queryPrizeStatus?eventId=${params.eventId}&questionId=${params.surveyId}&access_token=${params.accessToken}`)
}
// 发送验证码
export function getCode(data){
    return http.post('/commonApi/sendVerifyCode',
        data
    )
}
// 登录
export function login(data){
    return http.post('/memberWeb/phoneLogin',
        data
    )
}
// 获取实名认证信息
export function realCard(data) {
    return http.get('/memberWeb/baseInfo',
      data,
    )
  }
//   注销账号
export function account(data) {
    return http.get('/memberWeb/cancel',
      data,
    )
  }
// 进行实名认证
export function certificate(data){
    return http.post('/memberWeb/certificate',
    data
)
}
