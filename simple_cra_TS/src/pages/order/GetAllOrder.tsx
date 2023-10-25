import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import sumBy from 'lodash/sumBy';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
// @mui
import { useTheme } from '@mui/material/styles';
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, useTable } from 'src/components/table';
import { _invoices } from 'src/_mock/arrays';
import { IInvoice } from 'src/@types/invoice';
import { fTimestamp } from 'src/utils/formatTime';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import Label from 'src/components/label/Label';
import { InvoiceTableRow, InvoiceTableToolbar } from 'src/sections/@dashboard/invoice/list';
import { OrderTableRow, OrderTableToolbar } from 'src/sections/@dashboard/order/list';
import { useSelector } from 'src/redux/store';
import { OrderBook } from 'src/utils/types';
import OrderAnalytic from 'src/sections/@dashboard/order/OrderAnalytic';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'all',
  'full stack development',
  'backend development',
  'ui design',
  'ui/ux design',
  'front end development',
];

const TABLE_HEAD = [
  { id: 'User', label: 'user', align: 'left' },
  { id: 'createDate', label: 'CreatedAt', align: 'left' },
  { id: 'updatedAt', label: 'UpdatedAt', align: 'left' },
  { id: 'price', label: 'Amount', align: 'center', width: 140 },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

export default  function GetAllOrder() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();
  const _dataOrder = useSelector((state)=>state.orderBook.orderBooks);
  const navigate = useNavigate();

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
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState<OrderBook[]>(_dataOrder);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterStatus !== 'all' ||
    filterName !== '' ||
    filterService !== 'all' ||
    (!!filterStartDate && !!filterEndDate);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = (status: string) =>
    tableData.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status: string) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalPrice'
    );

  const getPercentByStatus = (status: string) =>
    (getLengthByStatus(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: tableData.length },
    { value: 'PENDING', label: 'Pending', color: 'success', count: getLengthByStatus('PENDING') },
    { value: 'AVAILABLE', label: 'Available', color: 'warning', count: getLengthByStatus('AVAILABLE') },
    { value: 'PROCESSING', label: 'Processing', color: 'error', count: getLengthByStatus('PROCESSING') },
    { value: 'COMPLETED', label: 'Completed', color: 'default', count: getLengthByStatus('COMPLETED') },
  ] as const;

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

  const handleFilterService = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterService(event.target.value);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = tableData.filter((row) => row.orderId !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  
  const handleViewRow = (id: string) => {
   navigate(PATH_DASHBOARD.order.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterService('all');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  return (
    <>
      <Helmet>
        <title> Invoice: List | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Order List"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Order',
              href: PATH_DASHBOARD.order.root,
            },
            {
              name: 'List',
            },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.order.newOrder}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Order
            </Button>
          }
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                <OrderAnalytic
                  title="Total"
                  total={tableData.length}
                  percent={100}
                  price={sumBy(tableData, 'totalPrice')}
                  icon="ic:round-receipt"
                  color={theme.palette.info.main}
                />

                <OrderAnalytic
                  title="Pending"
                  total={getLengthByStatus('PENDING')}
                  percent={getPercentByStatus('PENDING')}
                  price={getTotalPriceByStatus('PENDING')}
                  icon="eva:checkmark-circle-2-fill"
                  color={theme.palette.success.main}
                />

                <OrderAnalytic
                  title="Available"
                  total={getLengthByStatus('AVAILABLE')}
                  percent={getPercentByStatus('AVAILABLE')}
                  price={getTotalPriceByStatus('AVAILABLE')}
                  icon="eva:clock-fill"
                  color={theme.palette.warning.main}
                />

                <OrderAnalytic
                  title="Processing"
                  total={getLengthByStatus('PROCESSING')}
                  percent={getPercentByStatus('PROCESSING')}
                  price={getTotalPriceByStatus('PROCESSING')}
                  icon="eva:bell-fill"
                  color={theme.palette.error.main}
                />

                <OrderAnalytic
                  title="Completed"
                  total={getLengthByStatus('COMPLETED')}
                  percent={getPercentByStatus('COMPLETED')}
                  price={getTotalPriceByStatus('COMPLETED')}
                  icon="eva:file-fill"
                  color={theme.palette.text.secondary}
                />
              </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <Tabs
              value={filterStatus}
              onChange={handleFilterStatus}
              sx={{
                px: 2,
                bgcolor: 'background.neutral',
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label color={tab.color} sx={{ mr: 1 }}>
                      {tab.count}
                    </Label>
                  }
                />
              ))}
            </Tabs>
            <Divider />
              <OrderTableToolbar
                isFiltered={isFiltered}
                filterName={filterName}
                filterService={filterService}
                filterEndDate={filterEndDate}
                onFilterName={handleFilterName}
                optionsService={SERVICE_OPTIONS}
                onResetFilter={handleResetFilter}
                filterStartDate={filterStartDate}
                onFilterService={handleFilterService}
                onFilterStartDate={(newValue) => {
                  setFilterStartDate(newValue);
                }}
                onFilterEndDate={(newValue) => {
                  setFilterEndDate(newValue);
                }}
              />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.orderId)
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
                      tableData.map((row) => row.orderId)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <OrderTableRow
                        key={row.orderId}
                        row={row}
                        selected={selected.includes(row.orderId)}
                        onSelectRow={() => onSelectRow(row.orderId)}
                        onViewRow={() => handleViewRow(row.orderId)}
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
    </>
  )
}




function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}: {
  inputData: OrderBook[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterService: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (data) =>
        data.user.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        data.user.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((data) => data.status === filterStatus);
  }

  // if (filterService !== 'all') {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((c) => c.service === filterService)
  //   );
  // }

  if (filterStartDate && filterEndDate) {
    inputData = inputData.filter(
      (data) =>
        fTimestamp(data.createdAt!) >= fTimestamp(filterStartDate) &&
        fTimestamp(data.createdAt!) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
