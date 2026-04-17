import request from "./request";

export const getClazzListApi = (params) => {
    return request.get('/clazzs', { params })
}

export const addClazzApi = (data) => {
    return request.post('/clazzs', data)
}

export const updateClazzApi = (data) => {
    return request.put('/clazzs', data)
}

export const deleteClazzApi = (id) => {
    return request.delete(`/clazzs/${id}`)
}

export const getClazzByIdApi = (id) => {
    return request.get(`/clazzs/${id}`)
}