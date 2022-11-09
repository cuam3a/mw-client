import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import ReportsService from '../../../application/services/admin.reports.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";

const ReportPayment = () =>{
    let classes = useStyles();
    let history = useHistory();
    const [data, setData] = useState({ payment:[] });

    useEffect(() => {
        const check = async() => {
            let res = await ReportsService.getReportPayments();
            if (res.success) {
                setData({...data, payments: res.payments });
            }
            if(res.tokenError){
                history.push("/entrar");
            }
        }
        check();
    }, []);

    return (
        <div style={{ marginTop: "30px"}}>
            <Paper className={classes.paperView}>
                <Grid container>
                </Grid> 
            </Paper>
        </div>
    )
}

export default ReportPayment;