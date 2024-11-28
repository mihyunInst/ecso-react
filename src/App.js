import LoginForm from './components/LoginForm';
import SignUp from './components/SignUp';
import MainForm from './components/MainForm';  // MainForm import
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MyPage from './components/MyPage';

const HomeRoute = () => {
  const { user } = useAuth();

  // user 있으면 MainForm, 없으면 LoginForm 반환
  return user ? <MainForm /> : <LoginForm />;
};

// App 컴포넌트를 Provider 밖으로 분리
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/myPage" element={<MyPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

