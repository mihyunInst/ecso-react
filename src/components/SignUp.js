import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ecsoApi from '../api/ecsoApi';

const SignUp = () => {
  const navigate = useNavigate();  // useNavigate 훅 사용

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userPw: '',
    confirmPw: '',
    userPhone: '',
    classTerm: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      setVerificationSent(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 이메일 인증요청
  const handleEmailSubmit = async () => {

    try {

      if (!email) {
        setErrors({ email: '이메일을 입력해주세요' });
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setErrors({ email: '올바른 이메일 형식이 아닙니다' });
        return;
      }

      setErrors({}); // 이전 에러메세지 지우기
      setIsLoading(true); // 로딩 시작

      // 서버에 이메일 인증번호 발송 요청
      const response = await ecsoApi.post("/auth/sendVerification", { userEmail: email });

      //console.log(response);

      if (response.data.length == 0) {
        setVerificationSent(false);
        setIsTimerRunning(false);

        if (window.confirm("이미 가입된 이메일입니다. 로그인 하시겠습니까?")) {
          navigate("/");
        }
      } else {
        // 타이머 시작 (이메일로 발송된 번호 인증 타이머)
        setVerificationSent(true);
        setTimer(30); // 5분
        setIsTimerRunning(true);
      }

    } catch (error) {
      // 에러 발생 시 UI 되돌리기
      setVerificationSent(false);
      setIsTimerRunning(false);
      setErrors({ email: '인증번호 발송에 실패했습니다.' });

    } finally {
      setIsLoading(false); // 로딩 종료
    }

  };

  // 인증번호 확인 요청
  const handleVerificationSubmit = async () => {
    if (!verificationCode) {
      setErrors({ verification: '인증번호를 입력해주세요' });
      return;
    }

    const response = await ecsoApi.post("/auth/checkEmailAuthKey", { verificationCode: verificationCode });

    if (response.data == 1) {
      setIsTimerRunning(false);
      setStep(3);
      setErrors({});

    } else {
      alert("인증번호가 유효하지 않습니다");
    }

  };

  // 상태 변경 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 회원가입 유효성 검사
  const validateFinalForm = () => {
    const newErrors = {};

    if (!formData.userName) {
      console.log("?");
      newErrors.userName = '이름을 입력해주세요';
    }

    if (!formData.userPw) {
      newErrors.userPw = '비밀번호를 입력해주세요';
    } else if (formData.userPw.length < 8 &&
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,13}$/.test(formData.userPw)) {
      newErrors.userPw = '비밀번호는 영대소문자, 숫자, 특수문자 필수 포함 8-20자 이어야 합니다';
    }

    if (!formData.confirmPw) {
      newErrors.confirmPw = '비밀번호 확인을 입력해주세요';
    } else if (formData.userPw !== formData.confirmPw) {
      newErrors.confirmPw = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.userPhone) {
      newErrors.userPhone = '휴대폰 번호를 입력해주세요';
    } else if (!/^[0-9]{10,11}$/.test(formData.userPhone.replace(/-/g, ''))) {
      newErrors.userPhone = '올바른 휴대폰 번호를 입력해주세요';
    }

    if (!formData.classTerm) {
      newErrors.classTerm = '기수를 입력해주세요';
    } else if (!/^\d{2}E\d{2}$/.test(formData.classTerm)) {
      newErrors.classTerm = '올바른 기수 형식이 아닙니다 (예: 24E01)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 요청
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (validateFinalForm()) {
      // TODO: 서버에 최종 회원가입 요청
      //console.log('회원가입 성공:', { userEmail: email, ...formData });

      const response = await ecsoApi.post("/auth/signUp", { userEmail: email, ...formData });

      if (response.data == 1) {
        alert("회원가입 성공");
        //window.location.href = '/';

      } 
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* 로딩 스피너 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">회원가입</h2>
          {step === 1 && (
            <p className="mt-2 text-center text-sm text-gray-600">이메일 인증이 필요합니다</p>
          )}
        </div>

        {step === 1 && (
          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
              <div className="mt-1 flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="example@email.com"
                />
                <button
                  onClick={handleEmailSubmit}
                  disabled={verificationSent && isTimerRunning}
                  className="flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                >
                  {verificationSent ? '재발송' : '인증번호 발송'}
                </button>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {verificationSent && (
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                    인증번호
                  </label>
                  <span className="text-sm text-gray-500">
                    남은 시간: {formatTime(timer)}
                  </span>
                </div>
                <div className="mt-1 flex gap-2">
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="인증번호 6자리"
                  />
                  <button
                    onClick={handleVerificationSubmit}
                    className="flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    확인
                  </button>
                </div>
                {errors.verification && (
                  <p className="mt-1 text-sm text-red-600">{errors.verification}</p>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleFinalSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  이름
                </label>
                <input
                  id="name"
                  name="userName"
                  type="text"
                  value={formData.userName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="홍길동"
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="userPw"
                    type={showPassword ? "text" : "password"}
                    value={formData.userPw}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="영대소문자, 숫자, 특수문자 필수 포함 8-13자"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.userPw && (
                  <p className="mt-1 text-sm text-red-600">{errors.userPw}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPw"
                  type="password"
                  value={formData.confirmPw}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
                {errors.confirmPw && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPw}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  휴대폰 번호
                </label>
                <input
                  id="phone"
                  name="userPhone"
                  type="tel"
                  value={formData.userPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="'-' 기호 생략"
                />
                {errors.userPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.userPhone}</p>
                )}
              </div>

              <div>
                <label htmlFor="classCode" className="block text-sm font-medium text-gray-700">
                  기수 (예: 24E01)
                </label>
                <input
                  id="classCode"
                  name="classTerm"
                  type="text"
                  value={formData.classTerm}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="24E01"
                />
                {errors.classTerm && (
                  <p className="mt-1 text-sm text-red-600">{errors.classTerm}</p>
                )}
              </div>
            </div>

            {errors.submit && (
              <p className="text-sm text-red-600 text-center">{errors.submit}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                가입하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;