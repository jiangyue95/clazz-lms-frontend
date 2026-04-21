import request from './request';

export const getEmpJobDataApi = () => {
  return request.get('/report/empJobData');
};

export const getEmpGenderDataApi = () => {
  return request.get('/report/empGenderData');
};

export const getStudentCountDataApi = () => {
  return request.get('./report/studentCountData');
};

export const getStudentDegreeDataApi = () => {
  return request.get('./report/studentDegreeData');
};
