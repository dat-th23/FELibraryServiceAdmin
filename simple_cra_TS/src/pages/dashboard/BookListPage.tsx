import { Helmet } from 'react-helmet-async';
import {useEffect, useMemo, useState} from 'react'; 
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// utils
import { fTimestamp } from '../../utils/formatTime';
// _mock_
import { _invoices } from '../../_mock/arrays';
//@mui
import { useTheme } from '@mui/material/styles';
// @types
import { IInvoice } from '../../@types/invoice';
import Iconify from '../../components/iconify';
import {
    Tab,
    Tabs,
    Card,
    Table,
    Stack,
    Button,
    Tooltip,
    Divider,
    TableBody,
    Container,
    IconButton,
    TableContainer,
    Grid,
  } from '@mui/material';
// components
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

import { useSettingsContext } from '../../components/settings';
import Scrollbar from '../../components/scrollbar';
import {
    useTable,
    getComparator,
    TableHeadCustom,
    TableSelectedAction,
    TableEmptyRows,
    emptyRows,
    TableNoData,
    TablePaginationCustom
  } from '../../components/table';

import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/invoice/list';
import { dispatch, useDispatch, useSelector } from 'src/redux/store';
import { fetchBookThunk } from 'src/redux/slices/book';
import { FetchBooks } from 'src/utils/types';
import { BookTableToolbar } from 'src/sections/@dashboard/book/list';
import BookTableRow from 'src/sections/@dashboard/book/list/BookTableRow';
  const TABLE_HEAD = [
    { id: 'invoiceNumber', label: 'Client', align: 'left' },
    { id: 'title', label: 'Title', align: 'left' },
    { id: 'author', label: 'Author', align: 'left' },
    { id: 'createdAt', label: 'CreatedAt', align: 'center', width: 140 },
    { id: 'price', label: 'Price', align: 'center', width: 140 },
    { id: 'status', label: 'Status', align: 'left' },
    { id: '' },
  ];
export default function BookListPage() {
  
    const theme = useTheme();
    const navigate = useNavigate();
    const bookData = useSelector(state=> state.books.books);
    const categoriesOption = useSelector(state=> state.categories.categories);
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage
      } = useTable({ defaultOrderBy: 'createDate' });
      const { themeStretch } = useSettingsContext();
      const [tableData, setTableData] = useState(bookData);
      const [filterTitle, setFilterTitle] = useState('');
      
      const [openConfirm, setOpenConfirm] = useState(false);
    
      const [filterStatus, setFilterStatus] = useState('all');
    
      const [filterCategory, setFilterCategory] = useState('');
      
    
      const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
    
      const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
    
      const denseHeight = dense ? 56 : 76;

      const dataFiltered = applyFilter({
        inputData: tableData,
        filterCategory,
        comparator: getComparator(order, orderBy),
        filterTitle
      });

   


    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
      };
    const handleDeleteRows = (selected: string[]) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
        if (selected.length === dataInPage.length) {
        setPage(page - 1);
        } else if (selected.length === dataFiltered.length) {
        setPage(0);
        } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selected.length) / rowsPerPage) - 1;
        setPage(newPage);
        }
    }
    };

    const getLengthByStatus = (status: string) =>
      tableData.filter((item) => item.status === status).length;

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleEditRow = (id: string) => {
       navigate(PATH_DASHBOARD.book.edit(parseInt(id)));
    };

    const handleViewRow = (id: string) => {
      navigate(PATH_DASHBOARD.book.view(parseInt(id)));
    };
    
    const isFiltered = filterTitle !== '' 

    const handleDeleteRow = (id: string) => {
        const deleteRow = tableData.filter((row) => row.id !== id);
        setSelected([]);
        setTableData(deleteRow);
        if (page > 0) {
          if (dataInPage.length < 2) {
            setPage(page - 1);
          }
        }
      };
      const handleFilterTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setFilterTitle(event.target.value);
      };
      const handleResetFilter = () => {
        setFilterTitle('');
        setFilterStatus('all');
        setFilterCategory('');
      };
      const handleFilterService = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setFilterCategory(event.target.value);
      };
      const handleReload  = ()=>{
        window.location.reload();
      }
  return (
    <>
      <Helmet>
        <title> Invoice: List | Minimal UI</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Book Lists"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'List',
            },
          ]}
          action={
            <Grid container spacing={3}>
              <Button
                style={{"marginRight": "10px" }}
                variant="contained"
                onClick={handleReload}
                >
                  Reload
            </Button>
            <Button
                to={PATH_DASHBOARD.book.post}
                component={RouterLink}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                >
              New Book
            </Button>
          </Grid>
          }
        />
        <Card>
            <BookTableToolbar
            isFiltered={isFiltered}
            filterTitle={filterTitle}
            filterCategory={filterCategory}
            onFilterTitle={handleFilterTitle}
            optionsCategory={categoriesOption}
            onResetFilter={handleResetFilter}
            onFilterCategory={handleFilterService}
           
          />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                    onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                    )
                }
                action={
                    <Stack direction="row">
                    <Tooltip title="Sent">
                        <IconButton color="primary">
                        <Iconify icon="ic:round-send" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Download">
                        <IconButton color="primary">
                        <Iconify icon="eva:download-outline" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Print">
                        <IconButton color="primary">
                        <Iconify icon="eva:printer-fill" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton color="primary" onClick={handleOpenConfirm}>
                        <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                    </Tooltip>
                    </Stack>
                }
                />
                <Scrollbar>
                    <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                      <TableHeadCustom
                          order={order}
                          orderBy={orderBy}
                          headLabel={TABLE_HEAD}
                          rowCount={tableData.length}
                          numSelected={selected.length}
                          onSort={onSort}
                          onSelectAllRows={(checked) =>
                              onSelectAllRows(
                              checked,
                              tableData.map((row) => row.id)
                              )
                          }
                        />
                         <TableBody>
                            {dataFiltered
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                <BookTableRow
                                    key={row.id}
                                    row={row}
                                    selected={selected.includes(row.id)}
                                    onSelectRow={() => onSelectRow(row.id)}
                                    onViewRow={() => handleViewRow(row.id)}
                                    onEditRow={() => handleEditRow(row.id)}
                                    onDeleteRow={() => handleDeleteRow(row.id)}
                                />
                                ))}

                            <TableEmptyRows
                                height={denseHeight}
                                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                            />

                            {/* <TableNoData isNotFound={isNotFound} /> */}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>
            <TablePaginationCustom
                count={dataFiltered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
            />
           
        </Card>
      </Container>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({
    inputData,
    filterCategory,
    comparator,
    filterTitle,
  }: {
    inputData: FetchBooks[];
    filterCategory: string;
    comparator: (a: any, b: any) => number;
    filterTitle: string;
  }) {

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);
    inputData = stabilizedThis.map((el) => el[0]);
    if (filterTitle) {
      inputData = inputData.filter(
        (book) =>
        book.title.toLowerCase().indexOf(filterTitle.toLowerCase()) !== -1
      );
    }
    if(filterCategory.length >0){
      inputData = inputData.filter(book=> book.category.name.toLowerCase().indexOf(filterCategory.toLowerCase())>=0)
    }
   
    return inputData;
  }
  