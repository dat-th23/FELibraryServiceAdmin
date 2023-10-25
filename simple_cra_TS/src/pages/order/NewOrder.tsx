import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import NewOrderForm from '../../sections/@dashboard/order/form';

// ----------------------------------------------------------------------
function NewOrder() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Invoices: Create a new invoice | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new invoice"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Order',
              href: PATH_DASHBOARD.order.list,
            },
            {
              name: 'New Order',
            },
          ]}
        />

        <NewOrderForm />
      </Container>
    </>
  )
}

export default NewOrder