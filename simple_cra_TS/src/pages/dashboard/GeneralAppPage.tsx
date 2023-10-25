import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async';
//@MUI
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';

// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from '../../_mock/arrays';
import { useSettingsContext } from 'src/components/settings';
import { AppAreaInstalled, AppCurrentDownload, AppNewInvoice, AppWidgetSummary } from 'src/sections/@dashboard/general/app';
import { useSelector } from 'src/redux/store';
import { OrderUserMAX } from 'src/utils/types';
export default function GeneralAppPage() {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const [userOrderMax,setUserOrderMax] = useState<OrderUserMAX[]>([]);
  const [objOrderById,setObjOrderById] = useState<any>({});
  const [objUserById,setObjUserById] = useState<any>({});
  const userLenth = useSelector(state=> state.users.users);
  const orderLenth = useSelector(state=> state.orderBook.orderBooks);
  const  bookLenth = useSelector(state=> state.books.books);
  const [chart_v1, setChart_v1] = useState({"PENDING" : 0, "AVAILABLE": 0,  "ALL":orderLenth.length, "PROCESSING" : 0, "COMPLETED" : 0});

  useMemo(()=>{

    for(var  i =  0 ; i<userLenth.length;i++ ){
      objUserById[userLenth[i].email+""] = {email:userLenth[i].email, avatar: userLenth[i].avatar,username:userLenth[i].avatar, price: 0 , brrowPrice: 0, totalOrder: 0,depositPrice:0 }
    }


    for(var i = 0  ; i < orderLenth.length; i++){
      if(objUserById[orderLenth[i].user.email+""] !== null ){
        objUserById[orderLenth[i].user.email+""].price += (orderLenth[i].totalDeposit + orderLenth[i].totalRent);
        objUserById[orderLenth[i].user.email+""].brrowPrice += orderLenth[i].totalRent;
        objUserById[orderLenth[i].user.email+""].depositPrice += orderLenth[i].totalDeposit;
        objUserById[orderLenth[i].user.email+""].totalOrder += 1;
      } 
      switch(orderLenth[i].status){
        case "PENDING" : 
          chart_v1.PENDING += 1;
          break;
        case "AVAILABLE" : 
          chart_v1.AVAILABLE += 1;
          break;
        case "PROCESSING" : 
          chart_v1.PROCESSING += 1;
          break;
        case "COMPLETED" : 
          chart_v1.COMPLETED += 1;
          break;
        }
    }

    for(var  key in objUserById){
      userOrderMax.push(objUserById[key]);
      
    }


    for (let i = 0; i < userOrderMax.length - 1; i++) {
      let idmax = i;
      for (let j = i + 1; j < userOrderMax.length; j++) {
        if (userOrderMax[j].price > userOrderMax[idmax].price) idmax = j;
      }
  
      // swap
      let t = userOrderMax[i];
      userOrderMax[i] = userOrderMax[idmax];
      userOrderMax[idmax] = t;
    }
  },[]);

  return (
    <>
      <Helmet>
        <title> General: App | Minimal UI</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
              <AppWidgetSummary
                title="Total Users"
                percent={2.6}
                total={userLenth.length}
                chart={{
                  colors: [theme.palette.primary.main],
                  series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                }}
              />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Order"
              percent={0.2}
              total={orderLenth.length}
              chart={{
                colors: [theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Books"
              percent={-0.1}
              total={bookLenth.length}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Order"
              chart={{
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.error.main,
                  theme.palette.warning.main,
                ],
                series: [
                  { label: 'Pending', value: chart_v1.PENDING },
                  { label: 'Completed', value: chart_v1.COMPLETED },
                  { label: 'Processing', value: chart_v1.PROCESSING },
                  { label: 'Available', value: chart_v1.AVAILABLE },
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppNewInvoice
              title="User Price  Max"
              tableData={userOrderMax}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'price', label: 'Price' },
                { id: 'deposit', label: 'Deposit' },
                { id: 'borrowPrice', label: 'Borrow' },
                { id: '' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
      

    </>
  )
}
