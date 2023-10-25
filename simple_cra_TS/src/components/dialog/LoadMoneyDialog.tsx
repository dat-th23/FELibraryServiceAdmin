import { useEffect, useMemo, useState } from 'react';
// @mui
import {
  Stack,
  Button,
  Dialog,
  TextField,
  IconButton,
  DialogTitle,
  DialogProps,
  DialogActions,
  DialogContent,
  InputAdornment,
  MenuItem,
} from '@mui/material';
// components
import Iconify from '../iconify';
import MenuPopover from '../menu-popover';
import { RHFSelect } from '../hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSelector } from 'src/redux/store';
import { addRoles as addRolesAPI, updateUserMoneyAPI } from 'src/utils/axios';
import { User } from 'src/utils/types';
import { fCurrency } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  user: User | undefined;
  onClose: VoidFunction;
  onSaveRole: VoidFunction;
}

let ROLE_OPTIONS = [
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
export default function LoadMoneyDialog({user,onSaveRole, onClose, ...other }: Props) {
    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const [value, setValue] = useState<number>(0);

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
      setOpenPopover(event.currentTarget);
    };
  
    const handleClosePopover = () => {
      setOpenPopover(null);
    };

    const  handleAddRole=async ()=>{
      try {
        if(user!== undefined){
          await updateUserMoneyAPI({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.name,
            avatar: user.avatar,
            address: user.address,
            status: user.status,
            roles: user.roles,
            virtualWallet: value,
            password: user.password,
          })
        }
        
        onClose()
        window.location.reload()
      } catch (err) {
        console.log(err);
      }
    }
  return (
    <>
    <Dialog maxWidth="xs" onClose={onClose} {...other}>
      <DialogTitle> Load money</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <Stack spacing={3}>
          <TextField type="number"onChange={(e)=>setValue(parseInt(e.target.value))} value={value}  fullWidth label="Price on load  money" />
          <span>{fCurrency(value)}</span>
        </Stack>
       
      </DialogContent>

      <DialogActions>
        <Button color="inherit"  variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleAddRole}>
          Add
        </Button>
      </DialogActions>
    </Dialog>

    <MenuPopover
      open={openPopover}
      onClose={handleClosePopover}
      arrow="bottom-center"
      sx={{ maxWidth: 200, typography: 'body2', textAlign: 'center' }}
    >
      Three-digit number on the back of your VISA card
    </MenuPopover>
  </>
  )
}
