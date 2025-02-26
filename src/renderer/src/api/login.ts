import request from '@renderer/utils/request';

export const sendCode = request({
  url: '/api/sms/send_code',
});

export const login = request({
  url: '/api/customer/phone_login',
  method: 'post',
});