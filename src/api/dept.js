import request from './request';

export const getDeptListApi = () => {
  return request.get('/depts');
};

export const deleteDeptApi = (id) => {
  return request.delete(`/depts/${id}`);
};

export const addDeptApi = (data) => {
  return request.post('/depts', data);
};

export const getDeptByIdApi = (id) => {
  return request.get(`/depts/${id}`);
};

export const updateDeptApi = (data) => {
  return request.put('/depts', data);
};
