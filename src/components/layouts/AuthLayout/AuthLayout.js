
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import logo from 'assets/images/logo.svg';
import './AuthLayout.scss';

const AuthLayout = ({ title, children }) => {
  const mode = useTheme().palette.mode;

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid container item xs={12} className={`auth-image-grid ${mode}-mode`} justifyContent="flex-end">
        <Box sx={{ position: 'absolute', top: '2%', left: '2%' }}>
          <img src={logo} alt="Logo" style={{ width: 150 }}/>
        </Box>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Card className="auth-content-card">
            {title && <CardHeader title={title}/>}
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
