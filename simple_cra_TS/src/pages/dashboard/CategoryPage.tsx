import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form'
import FormProvider from 'src/components/hook-form/FormProvider'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../components/scrollbar';
import { _invoices } from '../../_mock/arrays';
import {
  Card,
  Table,
  Stack,
  TableBody,
  Grid,
  TableContainer,
} from '@mui/material';
import {
  useTable,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
import { ListCategoryRow } from 'src/sections/@dashboard/category';
import { createCategory, getCategorys, updateCategorys } from 'src/utils/axios';
import { Category, FetchCategory } from 'src/utils/types';
const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Client', align: 'left' },
  { id: 'category_id', label: 'id', align: 'left' },
  { id: 'category_name', label: 'Name', align: 'left' },
  { id: '' }
];
export default function CategoryPage() {

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onChangeDense,
    onChangeRowsPerPage,
    onChangePage,
    onSort,
  } = useTable({ defaultOrderBy: 'createDate' });
  const [tableData, setTableData] = useState<FetchCategory[]>([]);
  const [objUpdate,setObjUpdate] = useState<FetchCategory>();
  const [changeForm,setChangeForm] = useState(true);
  
  useEffect(()=>{
    const fetchData = async()=>{
      try {
        const res = await getCategorys();
        setTableData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData();
  },[setTableData]);


  const NewBlogSchema = Yup.object().shape({
    name: Yup.string().required('First name required'),
  });

  const methods = useForm<Category>({
    resolver: yupResolver(NewBlogSchema)
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  
const handleEditRow = (data: FetchCategory) => {
  setObjUpdate(data);
  setChangeForm(false);
};


const handleDeleteRow = (id: number) => {


};

  const onSubmit = async (data: Category) => {
    try {
      if(objUpdate==undefined){
        await createCategory(data);
      }else{
        await updateCategorys({categoryId:objUpdate.categoryId, name: data.name })
      }
        window.location.reload();
     
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Grid container  spacing={2}>
          <Grid item xs={12}md={4}>
          <CustomBreadcrumbs
            heading={changeForm ?"Create Category":"Update Category (" + objUpdate?.name +")" }
            links={[
              {
                name: 'Dashboard',
                href: PATH_DASHBOARD.root,
              },
              {
                name: 'Category',
                href: PATH_DASHBOARD.category.list,
              },
            ]}
          />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                  <div>
                    <RHFTextField
                    name="name"
                    label="Category Name"
                    fullWidth
                    multiline
                    />
                  </div>
                </Stack>
                <div style={{margin: '10px 0'}}>
                  <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    
                  >
                    {changeForm ? "Post": "Update" }
                  
                </LoadingButton>
                </div>
                
            </Card>
          </FormProvider>
           
          </Grid>
          <Grid item xs={12}md={8}>
            <CustomBreadcrumbs
              heading="List Category"
              links={[
                {
                  name: 'Dashboard',
                  href: PATH_DASHBOARD.root,
                },
                {
                  name: 'Category',
                  href: PATH_DASHBOARD.category.list,
                },
              ]}
            />
            <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                    <Table  sx={{ minWidth: 800 }}>
                        <TableHeadCustom
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={tableData.length}
                        numSelected={selected.length}
                        onSort={onSort}
                        />
                          <TableBody>
                            {tableData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row : FetchCategory) => (
                                <ListCategoryRow
                                    key={row.categoryId}
                                    row={row}
                                    selected={selected.includes(row.name)}
                                    onSelectRow={() => onSelectRow(row.name)}
                                    onEditRow={() => handleEditRow(row)}
                                    onDeleteRow={() => handleDeleteRow(row.categoryId)}
                                />
                                ))}

                            
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>
            <TablePaginationCustom
                count={tableData.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
            />
            </Card>
          </Grid>
         
      </Grid>
    </>
  )
}



