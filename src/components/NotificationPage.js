import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function NotificationPage(props) {
  const {message,handleClose,open,type} = props;
  // console.log(props,"notification")
  const [state, setState] = React.useState({
    vertical: 'top',
    horizontal: 'right',
  });

  const { vertical, horizontal } = state;


  return (
    <div>
      {/* <Snackbar
      autoHideDuration={1000} 
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={message && message}
        key={vertical + horizontal}
        style={{ background:"#2e7d32" }}
      /> */}
            <Snackbar open={open}  anchorOrigin={{ vertical, horizontal }}  key={vertical + horizontal} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message && message}
        </Alert>
      </Snackbar>

    </div>
  );
}