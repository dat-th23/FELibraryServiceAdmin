import sum from 'lodash/sum';
import { useCallback, useEffect, useState } from 'react';
// form
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Divider, Typography, InputAdornment, MenuItem } from '@mui/material';
// utils
import { fNumber, fCurrency } from '../../../../utils/formatNumber';
// @types
import { IInvoiceItem } from '../../../../@types/invoice';
// components
import Iconify from '../../../../components/iconify';
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';
import OrderAddBookDialog from './OrderAddBookDialog';
import { useSelector } from 'src/redux/store';
import { AddOrderItem_V1, FetchBooks, FetchOrderItem } from 'src/utils/types';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function OrderNewBook() {
    const { control, setValue, watch, resetField } = useFormContext();
    const { enqueueSnackbar } = useSnackbar();
    const dataBook = useSelector(state=> state.books.books);
    var startedDate = new  Date(Date.now()).getTime();
    const [showFormAddBook,setShowFormAddBook] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [indexFields,setIndexFields ] = useState<number | null>(null);
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'books',
    });
  
    const values = watch();
    const { books } = values;
    const totalOnRow = values.books.map((item: AddOrderItem_V1) => item.quantity *(item.price+ item.borrowPrice*7));
    const totalRentRow = values.books.map((item: AddOrderItem_V1)=> item.quantity *item.borrowPrice*7);
    const totalDepositRow = values.books.map((item: AddOrderItem_V1)=> item.quantity *item.price);
    const totalPrice = sum(totalOnRow);
  
    useEffect(() => {
      setValue('totalPrice', totalPrice);
      setValue('totalRent', sum(totalRentRow));
      setValue('totalDeposit', sum(totalDepositRow));
    }, [setValue, totalPrice]);
  
    const handleAdd = () => {
      append({ 
        title: '', 
        borrowPrice: 0, 
        quantity: 1, 
        price: 0,
        total: 0 ,
        status:  "PENDING",
        borrowedAt:  '', 
        returnedAt: '',
        bookId: null
      });
    };
  
    const handleRemove = (index: number) => {
      remove(index);
    };

    const handleAddBook = (data:  FetchBooks | null, index: number)=>{
      for(var key in books){
        if(data?.id === books[key].bookId){
          enqueueSnackbar('The book is already in the cart!',{variant:'error'});
          return ;
        }
      }
      setValue(`books[${index}].price`, data?.price);
      setValue(`books[${index}].title`, data?.title);
      setValue(`books[${index}].quantity`, 1);
      setValue(`books[${index}].status`, "PENDING");
      setValue(`books[${index}].bookId`, data?.id);
      setValue(`books[${index}].borrowedAt`,  new  Date(startedDate).toISOString());
      setValue(`books[${index}].returnedAt`, new  Date(startedDate + 7*24*3600*1000).toISOString());
      setValue(`books[${index}].borrowPrice`, data?.borrowPrice);
    }
  
  
    const handleChangeQuantity = useCallback(
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const bookCheck = dataBook.find(data => parseInt(data.id) === parseInt(books[index].bookId));
        setValue(`books[${index}].quantity`, Number(event.target.value));
        if(bookCheck!== undefined){
          if(books[index].quantity > bookCheck?.amount){
            enqueueSnackbar('The number of books exceeds the limit compared to the library!',{variant:'error'});
            setValue(`books[${index}].quantity`, Number(bookCheck?.amount));
            return;
          }
        }
        setValue(`books[${index}].total`,(books[index].borrowPrice + books[index].price)* books[index].quantity);
      },
      [setValue, values.books]
    );
  
    const showFormAddBookDialog = ()=>{
      setShowFormAddBook(true);
    }

    const handleOpenTo = (index: number) => {
      setIndexFields(index)
      setOpenTo(true);
    };

    const handleCloseTo = () => {
      setOpenTo(false);
    };

  
    return (
      <>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            Details:
          </Typography>
    
          <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
            {fields.map((item, index) => (
              <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <RHFTextField
                    size="small"
                    name={`books[${index}].title`}
                    disabled={true}
                    label="Title"
                    InputLabelProps={{ shrink: true }}
                  />
    
                  <RHFTextField
                    size="small"
                    type="number"
                    name={`books[${index}].price`}
                    label="Price"
                    disabled={true}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ maxWidth: { md: 150 } }}
                  />

                  <RHFTextField
                    size="small"
                    type="number"
                    disabled={true}
                    name={`books[${index}].borrowPrice`}
                    label="BorrowPrice"
                    placeholder="0"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                    sx={{ maxWidth: { md: 150 } }}
                  />
                  
                  <RHFTextField
                    size="small"
                    type="number"
                    name={`books[${index}].quantity`}
                    label="Quantity"
                    placeholder="0"
                    onChange={(event) => handleChangeQuantity(event, index)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ maxWidth: { md: 96 } }}
                  />
    
                  <RHFTextField
                    disabled
                    size="small"
                    name={`books[${index}].total`}
                    label="Total"
                    placeholder="0"
                    value={fNumber(totalOnRow[index])}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                    sx={{ maxWidth: { md: 150 } }}
                  />
                </Stack>
                
                <Stack direction="row"  >
                  <Button
                    size="small"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={()=>handleOpenTo(index)}
                    sx={{ flexShrink: 0 }}
                  >
                    Add Book
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
    
          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
    
          <Stack
            spacing={2}
            direction={{ xs: 'column-reverse', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Button
              size="small"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleAdd}
              sx={{ flexShrink: 0 }}
            >
              Add Item
            </Button>
          </Stack>
    
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="flex-end">
              <Typography>TotalRent :</Typography>
              <Typography
                sx={{ textAlign: 'right', width: 120, ...(values.discount && { color: 'error.main' }) }}
              >
                {fCurrency(values.totalRent)}
              </Typography>
            </Stack>
    
            <Stack direction="row" justifyContent="flex-end">
              <Typography>TotalDeposit :</Typography>
              <Typography sx={{ textAlign: 'right', width: 120 }}>
                {fCurrency(values.totalDeposit)}
              </Typography>
            </Stack>
    
            <Stack direction="row" justifyContent="flex-end">
              <Typography variant="h6">Total price :</Typography>
              <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
                {fCurrency(totalPrice)}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <OrderAddBookDialog
          index={indexFields}
          open={openTo}
          onClose={handleCloseTo}
          selected={(selectedId: string) => books?.id === selectedId}
          onSelect={(book,index) => handleAddBook(book,index)}
          userOptions={dataBook}
        />
      </>
    );
}

