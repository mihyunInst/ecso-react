import LoginForm from './components/LoginForm';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <LoginForm />
      </Router>
    </AuthProvider>
  );
}

