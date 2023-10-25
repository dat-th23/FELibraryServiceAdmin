import { useMemo, useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  CardProps,
  CardHeader,
  IconButton,
  TableContainer,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import MenuPopover from '../../../../components/menu-popover';
import { TableHeadCustom } from '../../../../components/table';
import { OrderUserMAX } from 'src/utils/types';

// ----------------------------------------------------------------------

type RowProps = {
  id: string;
  category: string;
  price: number;
  status: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: OrderUserMAX[];
  tableLabels: any;
}

export default function AppNewInvoice({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {

  useMemo(()=>{
    tableData = tableData.slice(0,5);
  },[])


  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row,index) => (
                <AppNewInvoiceRow key={row.email} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type AppNewInvoiceRowProps = {
  row: OrderUserMAX;
};

function AppNewInvoiceRow({ row }: AppNewInvoiceRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleDownload = () => {
    handleClosePopover();
    console.log('DOWNLOAD', row.email);
  };

  const handlePrint = () => {
    handleClosePopover();
    console.log('PRINT', row.email);
  };

  const handleShare = () => {
    handleClosePopover();
    console.log('SHARE', row.email);
  };

  const handleDelete = () => {
    handleClosePopover();
    console.log('DELETE', row.email);
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.email}</TableCell>

        <TableCell>{fCurrency(row.price)}</TableCell>

        <TableCell>{fCurrency(row.depositPrice)}</TableCell>

        <TableCell>
        {fCurrency(row.brrowPrice)}
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
       
      </MenuPopover>
    </>
  );
}
