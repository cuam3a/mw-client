import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Slide, Button, Card, CardContent, CardActions } from '@mui/material';
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import UserService from '../../../application/services/user.plans.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";

const Plans = () =>{
    let classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar } = useSnackbar();
    return (
        <div style={{ marginTop: "30px"}}>
            <Paper className={classes.paperView}>
                Reportes
            </Paper>
        </div>
    )
}

export default Plans;