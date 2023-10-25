import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config';
//
import {
  Page404,
  PageOne,
  PageTwo,
  PageSix,
  PageFour,
  PageFive,
  LoginPage,
  PageThree,
  RegisterPage,
  BlogPostsPage,
  BlogNewPostPage,
  BookListsPage,
  GeneralAppPage,
  ResetPasswordPage,
  NewPasswordPage,
  CategoryPage,
  BookPostPage,
  BookEditPage,
  ListAllUserPage,
  AccountPage,
  NewAccount,
  OrderGetAllPage,
  OrderNewPage,
  OrderDetailPage,
} from './elements';
import BlogPostPage from 'src/pages/dashboard/BlogPostPage';
import ViewDetailBookPage from 'src/pages/dashboard/book/ViewDetailBookPage';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'savePassword/:token', element: <NewPasswordPage /> },
          ],
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        { path: 'two', element: <PageTwo /> },
        { path: 'three', element: <PageThree /> },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/four" replace />, index: true },
            { path: 'four', element: <PageFour /> },
            { path: 'list', element: <ListAllUserPage /> },
            { path: 'new', element: <NewAccount /> },
            { path: ':email/account', element: <AccountPage /> },
            { path: 'five', element: <PageFive /> },
            { path: 'six', element: <PageSix /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPostsPage /> },
            { path: 'post/:title', element: <BlogPostPage /> },
            { path: 'new', element: <BlogNewPostPage /> },
          ],
        },

        {
          path: 'book',
          children: [
            { element: <Navigate to="/dashboard/book/lists" replace />, index: true },
            { path: 'lists', element: <BookListsPage /> },
            { path: 'create', element: <BookPostPage /> },
            { path: 'edit/:id', element: <BookEditPage /> },
            { path: 'view/:id', element: <ViewDetailBookPage /> },
          ],
        },
        {
          path: 'order',
          children: [
            { element: <Navigate to="/dashboard/order/lists" replace />, index: true },
            { path: 'lists', element: <OrderGetAllPage /> },
            { path: 'new', element: <OrderNewPage /> },
            { path: 'view/:id', element: <OrderDetailPage /> },
          ],
        },
        {
          path: 'category',
          element: <CategoryPage />
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
