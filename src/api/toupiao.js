import http from "@/utils/request";

// 发送验证码
export function sendVerifyCode(data) {
  return http.post(`commonApi/sendVerifyCode`, data);
}
// 校验验证码/isite/commonApi/codeVerify
export function codeVerify(data) {
  return http.post(`commonApi/codeVerify`,data);
}

//查询投票列表/isite/vote/options
export function options(data) {
  return http.post(`vote/options?`, data);
}
//投票/isite/vote/vote
export function vote(data) {
  return http.post(`vote/vote`, data);
}
