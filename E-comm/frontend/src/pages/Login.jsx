import LoginForm from '../components/auth/LoginForm';

const Login = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <LoginForm />
    </div>
  </div>
);

export default Login;
