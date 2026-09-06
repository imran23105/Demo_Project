import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { selectUser, selectIsAuthenticated, selectIsAdmin, selectToken, setCredentials, logout as logoutAction } from '../redux/slices/authSlice';
import { authApi } from '../services/authApi';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  const login = async (credentials) => {
    try {
      const { data } = await authApi.login(credentials);
      dispatch(setCredentials(data.data));
      toast.success(`Welcome back, ${data.data.user.name}!`);
      return data.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authApi.register(userData);
      dispatch(setCredentials(data.data));
      toast.success('Account created successfully!');
      return data.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    dispatch(logoutAction());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return { user, token, isAuthenticated, isAdmin, login, register, logout };
};

export default useAuth;
