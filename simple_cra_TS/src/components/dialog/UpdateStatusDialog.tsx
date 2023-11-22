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
import { addRoles as addRolesAPI, updateStatus } from 'src/utils/axios';
import axios from 'axios';
import order from 'src/redux/slices/order';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
    onClose: VoidFunction;
    onSaveRole: VoidFunction;
    onUpdate: any;
    orderId: string
}

let STATUS_OPTIONS = [
    {
        id: 1,
        name: 'PENDING'
    },
    {
        id: 2,
        name: 'AVAILABLE'
    }, {
        id: 3,
        name: 'PROCESSING',

    }, {
        id: 4,
        name: 'COMPLETED'
    }
];

export default function UpdateStatusDialog({ onSaveRole, onClose, onUpdate, orderId, ...other }: Props) {
    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const [value, setValue] = useState('')

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleUpdateStatus = () => {
        console.log(value)
        updateOrderStatus(orderId, value)
        onUpdate(value,orderId);
        onClose();
    }

    const updateOrderStatus = async (id: string, value: string) => {
        const data = {
            status: value
        }
        const response = await updateStatus(data, id)
        return response
    }

    return (
        <>
            <Dialog maxWidth="xs" onClose={onClose} {...other}>
                <DialogTitle> Update status</DialogTitle>

                <DialogContent sx={{ overflow: 'unset' }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            select
                            label="Status"
                            value={value}

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
                            {STATUS_OPTIONS.map((option, index) => (
                                <MenuItem
                                    key={index}
                                    value={option?.name}
                                    onClick={() => setValue(option.name)}
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

                    <Button variant="contained" onClick={handleUpdateStatus}>
                        Update
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
