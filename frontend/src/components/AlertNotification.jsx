import React from 'react'
import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import {closeAlertMessage} from './../store/actions/alertAction'



export default function AlertNotification() {
    const dispatch = useDispatch();
    const alertContent = useSelector((state)=>state.alert.alertMessageContent);
    const show = useSelector((state)=>state.alert.showAlertMessage)
    const close = () => {
        dispatch(closeAlertMessage());
    }

    return (
      <Snackbar
      anchorOrigin={{vertical:"bottom",horizontal:"center"}}
      open={show}
      onClose={close}
      autoHideDuration={10000}
      
      >
        <Alert severity='info'>{alertContent}</Alert>
      </Snackbar>
    )
}

