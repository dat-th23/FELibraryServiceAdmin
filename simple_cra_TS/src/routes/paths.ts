// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  register: '/register',
  resetPassword: '/reset-password',
  newPassword:  '/new-password',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  one: path(ROOTS_DASHBOARD, '/app'),
  two: path(ROOTS_DASHBOARD, '/two'),
  three: path(ROOTS_DASHBOARD, '/three'),
  user: {
    list: path(ROOTS_DASHBOARD, '/user/list'),
    root: path(ROOTS_DASHBOARD, '/user'),
    newAccount : path(ROOTS_DASHBOARD, '/user/new'),
    account: (email: string) => path(ROOTS_DASHBOARD, `/user/${email}/account`),
    four: path(ROOTS_DASHBOARD, '/user/four'),
    five: path(ROOTS_DASHBOARD, '/user/five'),
    six: path(ROOTS_DASHBOARD, '/user/six'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title: string) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
  book:{
    list: path(ROOTS_DASHBOARD, '/book'),
    post: path(ROOTS_DASHBOARD, '/book/create'),
    edit: (id: number) => path(ROOTS_DASHBOARD, `/book/edit/${id}`),
    view: (id: number) => path(ROOTS_DASHBOARD, `/book/view/${id}`),
  },
  order:{
    list: path(ROOTS_DASHBOARD, '/order/lists'),
    root: path(ROOTS_DASHBOARD, '/order'),
    newOrder:  path(ROOTS_DASHBOARD, '/order/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/order/view/${id}`),
  },
  category:{
    list: path(ROOTS_DASHBOARD, '/category'),
  }
};
