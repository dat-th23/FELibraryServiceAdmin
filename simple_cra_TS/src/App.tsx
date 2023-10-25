// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';
// components
import SnackbarProvider from './components/snackbar';
import { ThemeSettings } from './components/settings';
import { MotionLazyContainer } from './components/animate';
import { useDispatch } from './redux/store';
import { useEffect } from 'react';
import { fetchBookThunk } from './redux/slices/book';
import { fetchCategoriesThunk } from './redux/slices/category';
import { fetchUserThunk } from './redux/slices/user';
import { fetchOrderBookThunk } from './redux/slices/order';
import { FetchOrderItemThunk } from './redux/slices/orderItem';

// ----------------------------------------------------------------------

export default function App() {
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch()
  if(accessToken != null){
    dispatch(fetchBookThunk());
    dispatch(fetchCategoriesThunk());
    dispatch(fetchUserThunk());
    dispatch(fetchOrderBookThunk());
    dispatch(FetchOrderItemThunk())
  }

  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <ThemeLocalization>
            <SnackbarProvider>
              <Router />
            </SnackbarProvider>
          </ThemeLocalization>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
