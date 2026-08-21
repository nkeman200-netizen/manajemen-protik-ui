import api from './axios';

export const fetcher = (url) => api.get(url).then((res) => res.data.data);

export const paginatedFetcher = (url) => api.get(url).then((res) => res.data);
