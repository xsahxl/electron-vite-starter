import request from '@renderer/utils/request';

export const getUserInfo = request({
  url: '/api/customer/info',
});