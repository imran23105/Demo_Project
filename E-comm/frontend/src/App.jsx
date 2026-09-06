import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { selectIsAuthenticated } from './redux/slices/authSlice';
import useCart from './hooks/useCart';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { fetchCart } = useCart();

  // Sync cart from server when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  return <AppRoutes />;
}

export default App;
