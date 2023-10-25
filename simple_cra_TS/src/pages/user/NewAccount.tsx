import { Container } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import AccountGeneral from 'src/sections/@dashboard/user/account/AccountGeneral'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
export default function NewAccount() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
       <Helmet>
          <title> User: New Acount</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
            heading="New Account"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'User', href: PATH_DASHBOARD.user.list },
              { name: 'New Account' },
            ]}
          />
        
        <AccountGeneral />
      </Container>
    </>
  )
}
