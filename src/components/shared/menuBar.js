import * as React from 'react';
import { Link } from "react-router-dom";
import { Container, Box } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuOpen from '@mui/icons-material/MenuOpen';


const MenuApp = () => {

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const pages = [
    {
      text: 'Inicio',
      url: '/'
    },
    {
      text: 'Ingresos',
      url: '/ingresos-historial'
    },
    {
      text: 'Gastos',
      url: '/gastos-historial'
    },
    {
      text: 'Presupuesto',
      url: '/presupuestos-historial'
    },
    {
      text: 'Prestamos',
      url: '/prestamos-historial'
    },
    {
      text: 'Deudas',
      url: '/deudas-historial'
    },
    {
      text: 'Metas',
      url: '#'
    }
  ]

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, backgroundColor:'#606470', p: 3, height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem key={0} disablePadding>
          <ListItemButton>
            <ListItemText primary={'MENU'} sx={{ textAlign: 'center', color: '#FFFFFF' }} />
          </ListItemButton>
        </ListItem>
        <Divider sx={{borderColor: '#FFFFFF'}} />
        {pages.map((value, index) => (
          <ListItem key={value.text} disablePadding sx={{ display:'flex', justifyContent:'center' }}>
            <Link to={value.url} style={{ textDecoration:'none'}}>
            <ListItemButton>
                  <ListItemText primary={value.text} style={{ color: '#FF570C', fontWeight: 'bold' }}/>
            </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Container>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)} color="secondary" size="large" aria-label="MENU">
            <MenuOpen />
          </IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </Container>
  )
}

export default MenuApp
