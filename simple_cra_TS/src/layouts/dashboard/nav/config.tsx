// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  blog: icon('ic_blog'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'App', path: PATH_DASHBOARD.one, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        children: [
          { title: 'List', path: PATH_DASHBOARD.user.list },
          { title: 'New Account', path: PATH_DASHBOARD.user.newAccount },
        ],
      },
      {
        title: 'book',
        path: PATH_DASHBOARD.book.list,
        children: [
          { title: 'lists', path: PATH_DASHBOARD.book.list },
          { title: 'create', path: PATH_DASHBOARD.book.post },
        ],
      },
      {
        title: 'order',
        path: PATH_DASHBOARD.order.root,
        children: [
          { title: 'List', path: PATH_DASHBOARD.order.list },
          { title: 'New Order', path: PATH_DASHBOARD.order.newOrder },
        ],
      },
      {
        title: 'category',
        path: PATH_DASHBOARD.category.list,
       
      },
    ],
  },
];

export default navConfig;
