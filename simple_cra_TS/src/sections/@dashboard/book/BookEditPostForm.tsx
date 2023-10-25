import * as Yup from 'yup';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button,  Typography, MenuItem, InputAdornment, Divider } from '@mui/material';
//components
import { useSnackbar } from '../../../components/snackbar';
import axios from 'axios';
import { CustomFile } from '../../../components/upload';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFSelect,
} from '../../../components/hook-form';
import { useDispatch, useSelector } from 'src/redux/store';
//

import {createBookThunk, fetchBookThunk} from 'src/redux/slices/book';
import { getBookById, putBook } from 'src/utils/axios';
import { FetchBooks, FetchCategory } from 'src/utils/types';


// ----------------------------------------------------------------------
export type FormValuesProps = {
    id: number,
    title: string,
    subject: string,
    publisher: string,
    language: string,
    thumbnail: string|null,
    detail: string,
    author: string,
    amount: number,
    price: number,
    status: string;
    borrowPrice: number,
    categoryId: number,
  };
  

export default function BookEditPostForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryId,setCategoryId] = useState(0);
    const {id} = useParams();
    
    const NewBlogSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
       
      });

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(NewBlogSchema),
        
      });
    const {
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting, isValid },
      } = methods;
  
    useEffect(()=>{
        const fetchData =async ()=>{
            try {
                if(id != null){
                    const res = await getBookById(parseInt(id)); //getBookById(parseInt(id!))
                    setValue('id',parseInt(id))
                    setValue('title',res.data.title)
                    setValue('author',res.data.author)
                    setValue('publisher',res.data.publisher)
                    setValue('subject',res.data.subject)
                    setValue('thumbnail',res.data.thumbnail)
                    setValue('language',res.data.language)
                    setValue('status',res.data.status );
                    setValue('detail',res.data.detail);
                    setValue('amount',res.data.amount);
                    setValue('categoryId',res.data.category.categoryId);
                    setCategoryId(res.data.category.categoryId)
                    setValue('price',res.data.price);
                    setValue('borrowPrice',res.data.borrowPrice);

                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    },[id]);

   
   

    const categories =  useSelector(state =>state.categories.categories);
  
    const [openPreview, setOpenPreview] = useState(false);
  
    const handleOpenPreview = () => {
      setOpenPreview(true);
    };
  
    const onSubmit = async (data: FormValuesProps) => {
      try {

        const res = await putBook(data);
        console.log(res);
        
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDrop = useCallback(
      async  (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const  formData = new FormData();

        formData.append('file',file);
        formData.append('upload_preset',"weokfkxo");

        const res =  await axios.post('https://api.cloudinary.com/v1_1/hoanganhauth0901/image/upload',formData);
        
        if (file) {
          setValue('thumbnail', res.data.url);
        }
      },
      [setValue]
    );
  
    const handleRemoveFile = () => {
      setValue('thumbnail', null);
    };

    const handleSetValueCategory = (e: number) => {
        setCategoryId(e);
        setValue('categoryId',e);
    };

    return (
        <>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField name="title"    InputLabelProps={{ shrink: true }} label="Post Title" />
                  <RHFTextField name="detail"  InputLabelProps={{ shrink: true }} label="Detail " />
                  <Stack spacing={1}>
                    <Typography variant="subtitle2"  sx={{ color: 'text.secondary' }}>
                      Subject
                    </Typography>
    
                    <RHFEditor simple name="subject" />
                  </Stack>
    
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Thumbnail
                    </Typography>
    
                    <RHFUpload
                      name="thumbnail"
                      maxSize={3145728}
                      onDrop={handleDrop}
                      onDelete={handleRemoveFile}
                    />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
    
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField  size="small" name="publisher"  InputLabelProps={{ shrink: true }} label="Publisher" />
                  <RHFTextField  name="author" label="Author"  InputLabelProps={{ shrink: true }}/>
                  <RHFTextField  name="language" label="Language"  InputLabelProps={{ shrink: true }} />
                  <RHFSelect name="categoryId" label="Category" value={categoryId} onChange={(e)=>handleSetValueCategory(parseInt(e.target.value))}>
                    {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                            </option>
                    ))}
                    </RHFSelect>
                 
                  <RHFTextField
                    size="small"
                    type="number"
                    name="amount"
                    label="Amount"
                    placeholder="0"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <RHFTextField
                    size="small"
                    type="number"
                    name="price"
                    label="Price"
                    placeholder="0"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <RHFTextField
                    size="small"
                    type="number"
                    name="borrowPrice"
                    label="borrowPrice"
                    placeholder="0"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>
              </Card>
    
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={handleOpenPreview}
                >
                  Preview
                </Button>
    
                <LoadingButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  Post
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
    
        </FormProvider>
      </>
      )
}
