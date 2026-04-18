import request from "./request";

export const getStudentListApi = (params) => {
  return request.get('/students', { params });
};

export const addStudentApi = (data) => {
  return request.post('./students', data);
};

export const updateStudentApi = (data) => {
  return request.put('/students', data);
};

export const deleteStudentApi = (id) => {
  return request.delete(`/students/${id}`);
};

export const getStudentByIdApi = (id) => {
  return request.get(`/students/${id}`);
};

export const violationStudentApi = (id, score) => {
  return request.put(`/students/violation/${id}/${score}`);
};
