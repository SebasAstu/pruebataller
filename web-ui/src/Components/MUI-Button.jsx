import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';

export default function MButtons() {
    return (
        <Stack spacing={2} direction="row">
            <Button variant="contained" sx={{ 
                borderRadius: 40, 
                background: "#5CD4E2",
                color: "#023859", 
                boxShadow: 3,
                fontWeight: 'bold',
                }}>Confirmar
                </Button>
        </Stack>
    );
  }
  export function MButtonsSec() {
    return (
        <Stack spacing={2} direction="row">
            <Button variant="contained" sx={{ 
                borderRadius: 40, 
                background: "#E0E0E0",
                color: "#023859", 
                boxShadow: 3,
                fontWeight: 'bold',
                }}>Cancelar</Button>
        </Stack>
    );
  }