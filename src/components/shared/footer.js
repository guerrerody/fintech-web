import { Box } from "@mui/material";
import Copyright from "../Copyright";

const Footer = () => {
  return (
    <footer style={{ marginTop: '1rem', height: '7rem', backgroundColor: '#606470'}} className="grey page-footer footer-copyright">
      <Box style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Copyright /></Box>
    </footer>
  )
}

export default Footer;
