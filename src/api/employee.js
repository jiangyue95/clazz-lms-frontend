import request from './request';

export const getEmpListApi = () => {
    return request.get('/emps/list')
}