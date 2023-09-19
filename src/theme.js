import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#ff570c',
    },
    secondary: {
      main: '#323643',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#dc3545',
    },
    info: {
      main: '#17a2b8',
    },
    success: {
      main: '#08c257',
    },
    background: {
      default: '#ffffff',
      paper: '#f7f7f7',
    },
    custom: {
      gray: '#606470',
      lightGray: '#f7f7f7',
    },
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'gray',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      }
    }
  },
});

export default theme;
