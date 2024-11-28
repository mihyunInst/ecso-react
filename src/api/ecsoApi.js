import axios from 'axios';

const ecsoApi = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true  // 쿠키 포함 설정 (요청이던 응답이던 다 써야함)
});


// 응답 인터셉터
ecsoApi.interceptors.response.use(
  (response) => {
    console.log('응답 성공:', response);
    return response;
  }, // 정상 응답은 그대로 통과
  async (error) => {  // 에러 응답 처리
    const originalRequest = error.config;

    // access token 만료로 인한 401 에러이고, 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("액세스 토큰 만료!");
      try {
        const refreshResponse = await axios.post(
          'http://localhost/auth/refresh', {},{ withCredentials: true }
        );
        
        if (refreshResponse.status === 200) {
          return ecsoApi(originalRequest);
        }
        
      } catch (refreshError) {
        // refresh token도 만료된 경우
        console.log("리프레시 토큰 에러:", refreshError);
        alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
        sessionStorage.clear(); // 세션스토리지에 저장된 로그인회원 정보도 삭제
        window.location.href = '/';  // 로그인 페이지로 이동
        return Promise.reject(refreshError);
      }
    }
    // 다른 에러는 그대로 반환
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
