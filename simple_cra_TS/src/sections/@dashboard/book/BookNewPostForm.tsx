import * as Yup from 'yup';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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


// ----------------------------------------------------------------------

export type FormValuesProps = {
  title: string;
  author: string;
  subject: string;
  publisher: string; // nhà xuất bản
  thumbnail: string | null;
  categoryId: number;
  language: string;
  detail: string;
  amount: number;
  price: number;
  borrowPrice: number;
};


export default function BookNewPostForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const categories =  useSelector(state =>state.categories.categories);
  
    const [openPreview, setOpenPreview] = useState(false);
    const [category,setCategory] = useState(1);

    const NewBlogSchema = Yup.object().shape({
      title: Yup.string().required('Title is required'),
     
    });
  
  
    const methods = useForm<FormValuesProps>({
      resolver: yupResolver(NewBlogSchema)
    });
  
    const {
      setValue,
      handleSubmit,
      formState: { isSubmitting, isValid },
    } = methods;

  
    const handleOpenPreview = () => {
      setOpenPreview(true);
    };
  
    const onSubmit = async (data: FormValuesProps) => {
      try {
        dispatch(createBookThunk(data));
        navigate('/dashboard/book/lists');
       
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
    const handleCategoryId = (id: number)=>{
      setValue('categoryId', id);
    }
    const handleFilterService = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCategory(parseInt(event.target.value));
    };

  return (
    <>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Post Title" />
              <RHFTextField name="detail" label="Detail " />
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
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
              <RHFTextField  name="publisher" label="Publisher" />
              <RHFTextField  name="author" label="Author" />
              <RHFTextField  name="language" label="Language" />
              <RHFSelect
                name="categoryName"
                size="small"
                label="Category"
                InputLabelProps={{ shrink: true }}
                value={category}
                onChange={handleFilterService}
                SelectProps={{
                  native: false,
                  MenuProps: {
                    PaperProps: {
                      sx: { maxHeight: 220 },
                    },
                  },
                  sx: { textTransform: 'capitalize' },
                }}
                fullWidth
              >
                {categories.map((option) => (
                  <MenuItem
                    key={option.categoryId}
                    value={option.categoryId}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                      '&:first-of-type': { mt: 0 },
                      '&:last-of-type': { mb: 0 },
                    }}
                    onClick={()=> handleCategoryId(option.categoryId)}
                  >
                    {option.name}
                  </MenuItem>
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
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
