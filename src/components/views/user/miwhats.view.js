import React, { useState, useContext, useEffect } from 'react';
import { Grid, Paper, Typography, Fab, Slide, Box, Tooltip, Divider } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import { useHistory } from "react-router-dom";
import Controls from "../../controls";
import { useSnackbar } from 'notistack';
import UserService from '../../../application/services/user.miwhats.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert'

const headerList = [
    { id: '#', numeric: false, disablePadding: true, label: '#', index: true },
    { id: 'name', numeric: true, disablePadding: false, label: 'NOMBRE', index: false },
    { id: 'URL', numeric: true, disablePadding: false, label: 'URL', index: false, url: true },
    { id: 'idState', numeric: true, disablePadding: false, label: '', index: false, state: true },
    { id: 'accion', numeric: true, disablePadding: false, label: '', accion: true, index: false, edit: true, delete: true  },
];

const MiWhats = () =>{
    let classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar } = useSnackbar();
    const [ data, setData ] = useState({ miwhats: [] });
    const [ state, setState ] = useContext(AppContext);

    useEffect(() => {
        const check = async() => {
            let res = await UserService.getListMiWhats();
            if (res.success) {
                const path = window.location.href.replace("/usuario/miwhats", "")
                //_.forEach(res.miwhats, (item) => { item.URL = path + "/" + item.URL })
                _.forEach(res.miwhats, (item) => { item.URL = item.domain + item.URL })
                setData({ miwhats: res.miwhats, domain: res.domain });
            }
            if(res.tokenError){
                setState({...state, update: true })
                history.push("/entrar");
            }
        }
        check();
    }, []);

    const handleState = async(id) => {
        const listArray = data.miwhats.map(async(item, j) => {
            if (item.id === id) {
                let newState = "";
                if (item.idState === 1) {
                    newState = "N";
                } else {
                    newState = "Y";
                }
                let res = await UserService.setStateMiWhats(id, newState);
                if (res.success) {
                    if (newState === "N") {
                        item.idState = 2;
                        enqueueSnackbar("MiWhats inactivo", {
                            variant: 'success',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'center'
                            },
                            TransitionComponent: Slide,
                        });
                    } else {
                        item.idState = 1;
                        enqueueSnackbar("MiWhats activo", {
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
        await Promise.all(listArray).then((res) => setData({ miwhats: res }));
    }

    const handleAdd = () =>{
        if(data.miwhats.length < state.user.numberMiWhats){
            history.push("/usuario/miwhats/agregar");
        }else{
            enqueueSnackbar("Limite maximo de MiWhats", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                TransitionComponent: Slide,
            });
        }
    }

    const preHandleDelete = (id) => {
        swal({
            title: "Eliminar MiWhats?",
            text: "Una vez eliminado no se podra recuperar!",
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
        history.push("/usuario/miwhats/editar/" + id);
    }

    const handleDelete = async(id) => {
        let res = await UserService.deleteMiWhats(id);
        if (res.success) {
            const listArray = [...data.miwhats];
            const listArray2 = _.remove(listArray, (item) => { return item.id !== id; })
            setData({ ...data, miwhats: listArray2})
        }
    }

    return (
        <div style={{ marginTop: "30px"}}>
            <Paper className={classes.paperView}>
                <Grid container>
                    <Box style={{ flexGrow: 1 }}>
                        <Typography variant='h3' style={{ flexGrow: 1 }} className={[ classes.title, classes.textBold ]}> Lista de MiWhats</Typography>
                    </Box> 
                    <Box>
                        <Typography variant='p' className={ [classes.title, classes.textRight] }> MiWhats utilizados {data.miwhats.length} de {state.user.numberMiWhats}</Typography>
                    </Box>
                    <Grid item lg={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid item xs = { 12 } style={{ marginTop: "10px" }}>
                        <Controls.DataTable rows = { data.miwhats }
                            header = { headerList }
                            handleState = { handleState }
                            handleEdit = { (id) => handleEdit(id) }
                            handleDelete = { preHandleDelete }
                        /> 
                    </Grid>
                    <Tooltip title="Agregar Miwhats" aria-label="Agregar Miwhats">
                        <Fab className={ classes.fab} color="secondary" aria-label="add" onClick={() => handleAdd() } >
                            <FontAwesomeIcon icon={faPlus}/>
                        </Fab>
                    </Tooltip>
                </Grid> 
            </Paper>
        </div>
    )
}

export default MiWhats;