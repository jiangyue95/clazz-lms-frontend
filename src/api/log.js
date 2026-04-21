import request from './request';

export const getLogPageApi = (params) => {
  return request.get('/log/page', {params});
};
