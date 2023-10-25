import { Box, Container, Tab, Tabs } from '@mui/material';
import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { fetchOrderBookThunk } from 'src/redux/slices/order';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AccountGeneral from 'src/sections/@dashboard/user/account/AccountGeneral';
import AccountNotifications from 'src/sections/@dashboard/user/account/AccountNotifications';
import AccountSocialLinks from 'src/sections/@dashboard/user/account/AccountSocialLinks';
import AccountBilling from 'src/sections/@dashboard/user/account/billing/AccountBilling';
import BorrowBook from 'src/sections/@dashboard/user/account/borrowBook/BorrowBook';
import CheckoutConfirm from 'src/sections/@dashboard/user/account/borrowBook/CheckoutConfirm';
import { OrderBook } from 'src/utils/types';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../_mock/arrays';

export default function AccountPage() {
  const  {email} = useParams();
  const { themeStretch } = useSettingsContext();
  const [showFormConfirm,setShowFormConfirm] = useState(false);
  
  const orderAVAILABLE = useSelector((state)=> state.orderBook.orderBooks.find((or=> or.user.email === email && or.status === "AVAILABLE")));
  const [ orderUpdate,setOrderUpdate] = useState<OrderBook| undefined>(undefined)
  const [currentTab, setCurrentTab] = useState('general');
  const orderItems= useSelector((state)=> state.orderItem.orderItems.filter(ot => ot.order.user.email === email && ot.status !== "PENDING"));


  useMemo(()=>{
    if(orderAVAILABLE){
      setOrderUpdate(orderAVAILABLE)
      setShowFormConfirm(true)
    }
  },[orderAVAILABLE]);

  const TABS = [
    {
      value: 'general',
      label: 'General',
      icon: <Iconify icon="ic:round-account-box" />,
      component:  <AccountGeneral />,
    },
    {
      value: 'billing',
      label: 'Billing',
      icon: <Iconify icon="ic:round-receipt" />,
      component: (
        <AccountBilling
          cards={_userPayment}
          orderItems={orderItems}
          invoices={_userInvoices}
        />
      ),
    },

    {
      value: 'brrowBook',
      label: 'BrrowBook',
      icon: <Iconify icon="ic:round-receipt" />,
      component: orderUpdate ? <CheckoutConfirm order={orderUpdate}  setOrderUpdate={setOrderUpdate}/> :<BorrowBook setOrderUpdate={setOrderUpdate} setShowFormConfirm={setShowFormConfirm} />,
    },
  ];
  return (
    <>
      <Helmet>
        <title> User: Account Settings | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: 'Account Settings' },
          ]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  )
}
