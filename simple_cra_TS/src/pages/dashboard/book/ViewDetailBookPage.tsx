import { Container } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { useSettingsContext } from 'src/components/settings';
import { useSelector } from 'src/redux/store';
import { PATH_DASHBOARD } from 'src/routes/paths';
import BookDetail from 'src/sections/@dashboard/book/detail/BookDetail';

export default function ViewDetailBookPage() {
    const { themeStretch } = useSettingsContext();
  
  return (
    <>
    <Helmet>
      <title> Invoice: View | Minimal UI</title>
    </Helmet>

    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Invoice Details"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          {
            name: 'Book',
            href: PATH_DASHBOARD.book.list,
          },
          { name: `Details` },
        ]}
      />

      <BookDetail/>
    </Container>
  </>
  )
}
