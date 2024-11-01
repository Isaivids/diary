import axios from 'axios';

const apiCall = axios.create({
    baseURL: `/api`,
});

apiCall.interceptors.request.use(config => {
    const token = sessionStorage.getItem('idToken') ?? ''
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export { apiCall };