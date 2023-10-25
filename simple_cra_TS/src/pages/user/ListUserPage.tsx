
import React, { useEffect, useMemo, useState,useCallback } from 'react'
import { Helmet } from 'react-helmet-async';
import { IUserAccountGeneral } from 'src/@types/user';
import { useSettingsContext } from 'src/components/settings';
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, useTable } from 'src/components/table';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ConfirmDialog from 'src/components/confirm-dialog';
import { _userList } from 'src/_mock/arrays';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Grid,
} from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { UserTableRow, UserTableToolbar } from 'src/sections/@dashboard/user/list';
import { RootState, useDispatch,useSelector } from 'src/redux/store';
import { useAuthContext } from 'src/auth/useAuthContext';
import { Role, User } from 'src/utils/types';
import { AddToRoleDialog } from 'src/components/dialog';
import LoadMoneyDialog from 'src/components/dialog/LoadMoneyDialog';
import {listUsers} from 'src/utils/axios'
import { fetchUserThunk, getAllUser } from 'src/redux/slices/user';
const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = [
{
  id:  0,
  name: 'all'
},
{
  id:  1,
  name: 'USER'
},
{
  id:2,
  name:'MEMBER'
},{
  id: 3,
  name: 'LIBRARIAN',

},{
  id: 4 ,
  name:'ADMIN'
}
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'company', label: 'Address', align: 'left' },
  { id: 'money', label: 'Money', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];
export default function ListUserPage() {
  const dispatch = useDispatch();
  const {user} = useAuthContext();
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
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const [open,setOpen] = useState(false);// open form add role
  const [openMoney,setOpenMoney] = useState(false);// open form load money
  const [userUpdateMoney,setUserUpdateMoney] = useState<User>()

  const navigate = useNavigate();

  const [tableData, setTableData] = useState<User[]>([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState<Role>({
    id: 0,
    name: "all"
  });

  const [userIdRole ,setUserIdRole] = useState<string>("");

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  useCallback(()=>{
    async function fetchData(){
      try {
        const res = await listUsers();
        setTableData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  },[tableData])


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterRole,
    filterName
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterRole.name !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterRole({id: parseInt(event.target.value),name: "" });
  };

  const handleDeleteRow = (id: number) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selected: string[]) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row?.email));
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

  const handleEditRow = (id: number) => {
    //navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const  handleViewRow = (email: string)=>{
    navigate(PATH_DASHBOARD.user.account(email));
  }

  
  const handleShowFormAddRole = (email: string)=>{
    setUserIdRole(email);
    setOpen(true)
  }

  const handleCloseFormAddRole = ()=>{
    
    setOpen(false)
  }

  const handleShowFormLoadMoney = (data: User)=>{
    setUserUpdateMoney(data)
    setOpenMoney(true);
  }
  const handleCloseFormLoadMoney = ()=>{
    setOpenMoney(false);
  }

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole({id: 0,name:'all'});
    setFilterStatus('all');
  };

  const handleReload = ()=>{
    window.location.reload();
  }

  return (
    <>
    <Helmet>
      <title> User: List | Minimal UI</title>
    </Helmet>

    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="User List"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'User', href: PATH_DASHBOARD.user.root },
          { name: 'List' },
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
                to={PATH_DASHBOARD.user.newAccount}
                component={RouterLink}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                >
              New User
            </Button>
          </Grid>
        }
      />

      <Card>
        <Divider />

        <UserTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          filterRole={filterRole}
          optionsRole={ROLE_OPTIONS}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
          onResetFilter={handleResetFilter}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                tableData.map((row) => row.email)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={handleOpenConfirm}>
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Tooltip>
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
                    tableData.map((row) => row.email)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.email)}
                      onSelectRow={() => onSelectRow(row.email)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewDetail={() => handleViewRow(row.email)}
                      onShowFormAddRole={() => handleShowFormAddRole(row.email)}
                      handleShowFormLoadMoney={() => handleShowFormLoadMoney(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                />

                <TableNoData isNotFound={isNotFound} />
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

    <AddToRoleDialog 
      open={open} 
      onClose={handleCloseFormAddRole} 
      onSaveRole={handleCloseFormAddRole}
      email={userIdRole}
    />
    <LoadMoneyDialog 
      open={openMoney} 
      onClose={handleCloseFormLoadMoney} 
      onSaveRole={handleCloseFormLoadMoney}
      user={userUpdateMoney}
    />


  </>
  )
}

function applyFilter({
  inputData,
  comparator,
  filterRole,
  filterName,
}: {
  inputData: User[];
  comparator: (a: any, b: any) => number;
  filterRole: Role,
  filterName: string
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterRole.id !== 0) {
    inputData = inputData.filter((user) => user.roles.find((role) =>role.id === filterRole.id));
  }

  
 

  return inputData;
}
