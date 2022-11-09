import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Slide, Box, Divider, Tooltip, Fab } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import PlansService from '../../../application/services/admin.plans.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert'

const headerList = [
    { id: '#', numeric: false, disablePadding: true, label: '#', index: true },
    { id: 'name', numeric: true, disablePadding: false, label: 'NOMBRE', index: false },
    { id: 'numberMiWhats', numeric: true, disablePadding: false, label: '# MiWhats', index: false },
    { id: 'cost', numeric: true, disablePadding: false, label: 'TOTAL', index: false},
    { id: 'idPlanOpenPay', numeric: true, disablePadding: false, label: 'ID OPENPAY', index: false},
    { id: 'idState', numeric: true, disablePadding: false, label: '', state: true, index: false },
    { id: '', numeric: true, disablePadding: false, label: '', accion: true, index: false, edit: false, delete: true }
];

const Plans = () =>{
    let classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState({plans:[]});

    useEffect(() => {
        const check = async() => {
            let res = await PlansService.getAllPlans();
            if (res.success) {
                setData({plans: res.plans });
            }
            if(res.tokenError){
                history.push("/entrar");
            }
        }
        check();
    }, []);

    const handleState = async(id) => {
        enqueueSnackbar("Procesando...", {
            variant: 'info',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Slide,
        });
        const listArray = data.plans.map(async(item, j) => {
            if (item.id === id) {
                let newState = "";
                if (item.idState === 1) {
                    newState = "N";
                } else {
                    newState = "Y";
                }
                let res = await PlansService.setStatePlan(id, newState);
                if (res.success) {
                    closeSnackbar();
                    if (newState === "N") {
                        item.idState = 2;
                        enqueueSnackbar("Plan inactivo", {
                            variant: 'success',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'center'
                            },
                            TransitionComponent: Slide,
                        });
                    } else {
                        item.idState = 1;
                        enqueueSnackbar("Plan activo", {
                            variant: 'success',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'center'
                            },
                            TransitionComponent: Slide,
                        });
                    }
                }
            }
            return item;
        });
        await Promise.all(listArray).then((res) => setData({ plans: res }));
    }

    const handleAdd = () =>{
            history.push("/admin/planes/agregar");
    }

    const preHandleDelete = (id) => {
        swal({
            title: "Eliminar Plan?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((value) => {
            if (value) {
                handleDelete(id)
            }
          });
    }

    const handleEdit = (id) =>{
        history.push("/admin/planes/editar/" + id);
    }

    const handleDelete = async(id) => {
        enqueueSnackbar("Procesando...", {
            variant: 'info',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Slide,
        });
        let res = await PlansService.deletePlan(id);
        if (res.success) {
            closeSnackbar();
            const listArray = [...data.plans];
            const listArray2 = _.remove(listArray, (item) => { return item.id !== id; })
            setData({ ...data, plans: listArray2})
        }
    }

    return (
        <div style={{ marginTop: "30px"}}>
            <Paper className={classes.paperView}>
            <Grid container>
                    <Box style={{ flexGrow: 1 }}>
                        <Typography variant='h3' style={{ flexGrow: 1 }} className={[ classes.title, classes.textBold ]}> Lista de Planes</Typography>
                    </Box> 
                    <Grid item lg={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid item xs = { 12 } style={{ marginTop: "10px"}}>
                        <Controls.DataTable rows = { data.plans }
                            header = { headerList }
                            handleState = { handleState }
                            handleEdit = { (id) => handleEdit(id) }
                            handleDelete = { preHandleDelete }
                        /> 
                    </Grid>
                    <Tooltip title="Agregar Plan" aria-label="Agregar Plan">
                        <Fab className={ classes.fab} color="secondary" aria-label="add" onClick={() => handleAdd() } >
                            <FontAwesomeIcon icon={faPlus}/>
                        </Fab>
                    </Tooltip>
                </Grid> 
            </Paper>
        </div>
    )
}

export default Plans;