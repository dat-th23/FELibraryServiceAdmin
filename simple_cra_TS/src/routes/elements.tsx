import { Suspense, lazy, ElementType, useEffect } from 'react';
import { fetchBookThunk } from 'src/redux/slices/book';
import { useDispatch } from 'src/redux/store';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));
export const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPasswordPage')));

export const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
export const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));
export const PageThree = Loadable(lazy(() => import('../pages/PageThree')));
export const PageFour = Loadable(lazy(() => import('../pages/PageFour')));
export const PageFive = Loadable(lazy(() => import('../pages/PageFive')));
export const PageSix = Loadable(lazy(() => import('../pages/PageSix')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));

// DASHBOARD: BLOG
export const BlogPostsPage = Loadable(lazy(() => import('../pages/dashboard/BlogPostsPage')));
export const BlogPostPage = Loadable(lazy(() => import('../pages/dashboard/BlogPostPage')));
export const BlogNewPostPage = Loadable(lazy(() => import('../pages/dashboard/BlogNewPostPage')));

//DASHBOARD: BOOK
export const BookListsPage = Loadable(lazy(() => import('../pages/dashboard/BookListPage')));
export const BookPostPage = Loadable(lazy(() => import('../pages/dashboard/book/BookPostPage')));
export const BookEditPage = Loadable(lazy(() => import('../pages/dashboard/book/BookEditPage')));


// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(lazy(() => import('../pages/dashboard/GeneralAppPage')));

//Category
export const CategoryPage = Loadable(lazy(() => import('../pages/dashboard/CategoryPage')));

//Order
export const OrderGetAllPage =  Loadable(lazy(() => import('../pages/order/GetAllOrder')));
export const OrderNewPage =  Loadable(lazy(() => import('../pages/order/NewOrder')));
export const OrderDetailPage =  Loadable(lazy(() => import('../pages/order/OrderDetail')));

//Users
export const ListAllUserPage = Loadable(lazy(() => import('../pages/user/ListUserPage')));
export const AccountPage = Loadable(lazy(() => import('../pages/user/AccountPage')));
export const NewAccount = Loadable(lazy(() => import('../pages/user/NewAccount')));
