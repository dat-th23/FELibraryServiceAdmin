import {
    Box,
    Card,
    Grid,
    Table,
    Divider,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    Typography,
    TableContainer,
    Tabs,
    Tab,
  } from '@mui/material';
import React,{useState} from 'react'
import { useParams } from 'react-router';
import Label from 'src/components/label/Label';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSelector } from 'src/redux/store';
import Image from '../../../../components/image';
import Markdown from 'src/components/markdown';
import ListBookBorrowItem from '../list/ListBookBorrowItem';

export default function BookDetail() {
    const {id} = useParams();
    const books = useSelector(state=>state.books.books);
    const bookDetail =  books.find((book)=> parseInt(book.id) === parseInt(id!));
    const [currentTab, setCurrentTab] = useState('orderIem');
    const TABS = [
      {
        value: 'orderIem',
        label: 'Borrow Item',
        component:  <ListBookBorrowItem/>,
      },
      {
        value: 'billing',
        label: 'Billing',
        component: <>Billing</>,
      },
      
    ];

  return (
    <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            
            <Image disabledEffect alt="logo" src={bookDetail?.thumbnail === null ? '/logo/logo_full.svg' : bookDetail?.thumbnail} sx={{ maxWidth: 300 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>

            <Typography variant="body2">Title: {bookDetail?.title}</Typography>
            <Typography variant="body2">Price: {bookDetail?.borrowPrice}VND</Typography>
            <Typography variant="body2">Borrow Price: {bookDetail?.price}VND</Typography>

            <Typography variant="body2">Author : {bookDetail?.author}</Typography>
            <Typography variant="body2">Detail : {bookDetail?.detail}</Typography>
            <Typography variant="body2">Publisher : {bookDetail?.publisher}</Typography>
            <Typography variant="body2">Category : {bookDetail?.category.name}</Typography>
             <Markdown children={bookDetail?.subject!} /> 
          </Grid>
        </Grid>
        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label}  value={tab.value} />
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
      </Card>
  )
}
