import request from "./request";

export const loginApi = (data) => {
    return request.post('/login', data)
}