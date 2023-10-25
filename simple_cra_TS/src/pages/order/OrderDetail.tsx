import { Container } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { useSettingsContext } from 'src/components/settings'
import { useSelector } from 'src/redux/store'
import { PATH_DASHBOARD } from 'src/routes/paths'
import DetailOrderForm from 'src/sections/@dashboard/order/detail'

function OrderDetail() {

  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Invoices: Create a new invoice | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Order Detail"
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

        <DetailOrderForm/>
        </Container>
    </>
  )
}

export default OrderDetail