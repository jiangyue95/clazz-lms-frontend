import request from './request';

export const getEmpListApi = () => {
    return request.get('/emps/list');
};

export const getEmpPageListApi = (params) => {
  return request.get('/emps', {params});
};

export const addEmpApi = (data) => {
  return request.post('/emps', data);
};

export const deleteEmpApi = (ids) => {
  return request.delete('/emps', {params: {ids: ids.join(',')}});
};

export const getEmpByIdApi = (id) => {
  return request.get(`/emps/${id}`);
};

export const updateEmpApi = (data) => {
  return request.put('/emps', data);
}
