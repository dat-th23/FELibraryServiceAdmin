// @mui
import { Box, Grid, Card, Button, Typography, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'src/redux/store';
import { ReportOrderbyUserId } from 'src/utils/axios';
import { FetchOrderItem, ReportOrderbyUserIdType } from 'src/utils/types';
// @types
import {
  IUserAccountBillingCreditCard,
  IUserAccountBillingAddress,
  IUserAccountBillingInvoice,
} from '../../../../../@types/user';
//
import AccountBillingBook from './AccountBillingBook';
import AccountBillingBookHistory from './AccountBillingBookHistory';

// ----------------------------------------------------------------------

type Props = {
  cards: IUserAccountBillingCreditCard[];
  invoices: IUserAccountBillingInvoice[];
  orderItems: FetchOrderItem[];
};

export default function AccountBilling({ cards, orderItems, invoices }: Props) {
  const [dataReport,setReport] = useState<ReportOrderbyUserIdType[]>([]);
  const {email} = useParams();
  const user = useSelector(state=> state.users.users.find(u=> u.email ===email));
  useMemo(()=>{
    const fetchData = async ()=>{
      try{  
        if(user!== undefined){
          const data = await ReportOrderbyUserId(user?.id);
          setReport(data.data)
        }
      }catch(ex){
  
      }
    }
    fetchData()
  },[])

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <AccountBillingBook orderItems={orderItems} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <AccountBillingBookHistory dataReport={dataReport} />
      </Grid>
    </Grid>
  );
}
