import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Slide, Box, Divider, Tooltip, Fab } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import MiwhatsService from '../../../application/services/admin.miwhats.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert'
import SearchBar from "material-ui-search-bar";

const headerList = [
    { id: '#', numeric: false, disablePadding: true, label: '#', index: true },
    { id: 'name', numeric: false, disablePadding: false, label: 'NOMBRE', index: false },
    { id: 'URL', numeric: false, disablePadding: false, label: 'URL', index: false, url: true },
    { id: 'user.email', numeric: false, disablePadding: false, label: 'USUARIO', index: false, url: false },
    { id: 'idState', numeric: true, disablePadding: false, label: '', index: false, state: true },
    { id: 'accion', numeric: true, disablePadding: false, label: '', accion: true, index: false, edit: true, delete: true  },
];

const filterState = [
    { id: 0, name: 'TODO'},
    { id: 1, name: 'ACTIVO'},
    { id: 2, name: 'INACTIVO'},
    { id: 3, name: 'ELIMINADO'}
]

const MiWhats = () =>{
    let classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState({miwhats:[], filter:[], filterState: 0, filterStatus: 'TODO' });
    const [searched, setSearched] = useState("");

    useEffect(() => {
        const check = async() => {
            let res = await MiwhatsService.getAllMiWhats();
            if (res.success) {
                //const path = window.location.href.replace("/admin/miwhats", "")
                _.forEach(res.miwhats, (item) => { item.URL = item.domain + item.URL })
                setData({...data, miwhats: res.miwhats, filter: res.miwhats });
                //setDataFilter([...res.users])
            }
            if(res.tokenError){
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
                let res = await MiwhatsService.setStateMiWhats(id, newState);
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
        await Promise.all(listArray).then((res) => setData({...data, miwhats: res }));
    }

    const handleEdit = (id) =>{
        history.push("/admin/miwhats/editar/" + id);
    }

    const preHandleDelete = (id) => {
        swal({
            title: "Eliminar MiWhats?",
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
        let res = await MiwhatsService.deleteMiWhats(id);
        if (res.success) {
            closeSnackbar();
            enqueueSnackbar("MiWhats eliminado correctamente", {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                TransitionComponent: Slide,
            });
            const listArray = [...data.miwhats];
            _.forEach(listArray, (item) => { if(item.id === id){ item.idState = 3; }});
            setData({ ...data, miwhats: listArray, filter: listArray})
        }
    }

    const handleReactive = async(id) => {
        enqueueSnackbar("Procesando...", {
            variant: 'info',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Slide,
        });
        let res = await MiwhatsService.reactiveMiWhats(id);
        if (res.success) {
            closeSnackbar();
            enqueueSnackbar("MiWhats activado correctamente", {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                TransitionComponent: Slide,
            });
            const listArray = [...data.miwhats];
            _.forEach(listArray, (item) => { if(item.id === id){ item.idState = 1; }});
            setData({ ...data, miwhats: listArray, filter: listArray})
        }
    }

    const requestSearch = (searchedVal) => {
        const filteredRows = data.miwhats.filter((row) => {
            if(row.name != null && row['users.email'] != null && row.URL != null){
                return row.name.toLowerCase().includes(searchedVal.toLowerCase()) || row['users.email'].toLowerCase().includes(searchedVal.toLowerCase()) || row.URL.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if(row.name != null && row['users.email'] != null){
                return row.name.toLowerCase().includes(searchedVal.toLowerCase()) || row['users.email'].toLowerCase().includes(searchedVal.toLowerCase());
            }
            if(row.name != null && row.URL != null){
                return row.name.toLowerCase().includes(searchedVal.toLowerCase()) || row.URL.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if(row.URL != null && row['users.email']  != null){
                return row.URL.toLowerCase().includes(searchedVal.toLowerCase()) || row['users.email'].toLowerCase().includes(searchedVal.toLowerCase());
            }
            if(row.name != null){
                return row.name.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if(row.URL != null){
                return row.URL.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if(row['users.email'] != null){
                return row['users.email'].toLowerCase().includes(searchedVal.toLowerCase());
            }
            return [];
        });
        setData({...data, filter: filteredRows });
        //setDataFilter(filteredRows);
    };
    
    const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
    };

    const handleFilterStateChange = (e) => {
        const value = e.target.value;
        const filteredRows = data.miwhats.filter((row) => {
            if(value === 0){
                return row;
            }else{
                return row.idState === value;
            }
        });
        setData({...data, filter: filteredRows, filterState: value });
    }

    return (
        <div style={{ marginTop: "30px"}}>
            <Paper className={classes.paperView}>
            <Grid container>
                    <Box style={{ flexGrow: 1 }}>
                        <Typography variant='h3' style={{ flexGrow: 1 }} className={[ classes.title, classes.textBold ]}> Lista de MiWhats</Typography>
                    </Box> 
                    <Grid item lg={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid item xs = { 12 } style={{ marginTop: "10px"}}>
                        <Grid container>
                            <Grid item sm={2} style={{ marginTop: '10px', paddingInline: '5px'}}>
                                <Controls.Select
                                    label="Estado"
                                    value={data.filterState}
                                    onChange={handleFilterStateChange}
                                    options={filterState}
                                    size='small'
                                />
                            </Grid>
                            <Grid item sm={2} style={{ marginTop: '10px', paddingInline: '5px'}}>
                            </Grid>
                            <Grid item sm={2}></Grid>
                            <Grid item sm={2}></Grid>
                            <Grid item sm={4} style={{ marginBlock: '10px'}}>
                                <SearchBar
                                    value={searched}
                                    onChange={(searchVal) => requestSearch(searchVal)}
                                    onCancelSearch={() => cancelSearch()}
                                    placeholder="Buscar"
                                />
                            </Grid>
                        </Grid>
                        <Controls.DataTable rows = { data.filter }
                            header = { headerList }
                            handleState = { handleState }
                            handleEdit = { (id) => handleEdit(id) }
                            handleDelete = { preHandleDelete }
                            handleReactive = { handleReactive }
                        /> 
                    </Grid>
                </Grid> 
            </Paper>
        </div>
    )
}

export default MiWhats;