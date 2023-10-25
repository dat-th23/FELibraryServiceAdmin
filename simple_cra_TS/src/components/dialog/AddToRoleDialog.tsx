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
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import { RHFSelect } from '../hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSelector } from 'src/redux/store';
import { addRoles as addRolesAPI } from 'src/utils/axios';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  email: string;
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

const  ROLE_CHECK_OBJ ={
  1: {
    id:  1,
    name: 'USER'
  },
  2: {
    id:2,
    name:'MEMBER'
  },
  3:{
    id: 3,
    name: 'LIBRARIAN',
  },
  4:{
    id: 4 ,
    name:'ADMIN'
  }
}

export default function AddToRoleDialog({email,onSaveRole, onClose, ...other }: Props) {
    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const [value, setValue] = useState(ROLE_OPTIONS[0])
    var user = useSelector(state=> state.users.users.find(u =>  u.email ===email));
    useMemo(()=>{
      if(email.length >0){
        for(let r = 0 ; r < user?.roles.length! ; r++){
            ROLE_OPTIONS = ROLE_OPTIONS.filter(role=>role.name !== user?.roles[r].name )
        }
        setValue(ROLE_OPTIONS[0])
      }
     
    },[email])

 
   
    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
      setOpenPopover(event.currentTarget);
    };
  
    const handleClosePopover = () => {
      setOpenPopover(null);
    };

    const  handleAddRole=async ()=>{
      
      try {
        await  addRolesAPI({email, roleName: value.name});
        onClose()
      } catch (err) {
        console.log(err);
      }
    }
  
    return (
      <>
        <Dialog maxWidth="xs" onClose={onClose} {...other}>
          <DialogTitle> Add Role</DialogTitle>
  
          <DialogContent sx={{ overflow: 'unset' }}>
            <Stack spacing={3}>
            <TextField
              fullWidth
              select
              label="Role"
              value={value.id}
              
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 260,
                    },
                  },
                },
              }}
              sx={{
                maxWidth: { sm: 240 },
                textTransform: 'capitalize',
              }}
            >
              {ROLE_OPTIONS.map((option,index) => (
                <MenuItem
                  key={index}
                  value={option?.id}
                  onClick={()=>setValue(option)}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                    '&:first-of-type': { mt: 0 },
                    '&:last-of-type': { mb: 0 },
                  }}
                >
                  {option.name}
              </MenuItem>
          ))}
      </TextField>
            </Stack>
          </DialogContent>
  
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
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
    );
}
