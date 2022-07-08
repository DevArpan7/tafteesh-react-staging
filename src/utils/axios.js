import axios from 'axios';
const token = (localStorage.getItem('accessToken'));
const headers1 = {
    'Content-Type': 'application/json;charset=UTF-8',
    "Authorization": `Bearer ${token}`
}
const headers2 = {
    'Content-Type': 'application/json;charset=UTF-8',
}

let axiosConfig = {
    headers: token ? headers1 : headers2
}
const instance = axios.create({
    baseURL: 'https://tafteesh-staging-node.herokuapp.com/api/',
    axiosConfig
});

export default instance;