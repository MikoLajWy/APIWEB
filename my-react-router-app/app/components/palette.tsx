import { createTheme } from '@mui/material/styles';


const cstheme = createTheme({
  palette: {
    primary: {
      light: '#D4D7D9',
      main: '#344955',
      dark: '#23343e',
      contrastText: '#000',
    },
    secondary: {
      light: '#fff',
      main: '#F9AA33',
      dark: '#edf0f2',
      contrastText: '#000',
    },
    
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#D4D7D9",
          color: '#000',
        }
      }
    }
  }
});

export default cstheme