import axios from 'axios';

const ecsoApi = axios.create({
  baseURL: 'http://localhost',
  credentials: 'include',
  withCredentials: true  // 쿠키 포함 설정 (요청이던 응답이던 다 써야함)
});

// 응답 인터셉터
ecsoApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료로 인한 401 에러 && 재시도하지 않은 요청
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 요청
        await axios.post('/auth/refresh', {}, {
          withCredentials: true
        });

        // 원래 요청 재시도
        return ecsoApi(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default ecsoApi;

// 쿠키 helper 함수
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const encodedValue = parts.pop().split(';').shift();
    // URL 디코딩
    return decodeURIComponent(encodedValue);
  }
  return null;
};
