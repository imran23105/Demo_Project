import LoginForm from '../components/auth/LoginForm';

const Login = () => (
  <div className="min-h-[85vh] bg-[#F3F3EE] flex items-center justify-center px-4 py-12">
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-black/5 p-8 sm:p-10 w-full max-w-md">
      <LoginForm />
    </div>
  </div>
);

export default Login;
