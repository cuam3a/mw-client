import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Slide, Box, Divider, Tooltip, Button } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import UsersService from '../../../application/services/admin.users.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert'
import SearchBar from "material-ui-search-bar";
import { saveAs } from "file-saver";
//import XlsxPopulate from "xlsx-populate";

const headerList = [
    { id: '#', numeric: false, disablePadding: true, label: '#', index: true },
    { id: 'name', numeric: false, disablePadding: false, label: 'NOMBRE', index: false },
    { id: 'email', numeric: false, disablePadding: false, label: 'CORREO', index: false },
    { id: 'plan', numeric: false, disablePadding: false, label: 'PLAN', index: false },
    { id: 'status', numeric: false, disablePadding: false, label: 'ESTADO PLAN', index: false },
    { id: 'downAt', numeric: false, disablePadding: false, label: 'VENCIMIENTO', index: false },
    { id: 'idState', numeric: true, disablePadding: false, label: '', state: true, index: false },
    { id: '', numeric: true, disablePadding: false, label: '', accion: true, index: false, edit: true, delete: true }
];

const filterState = [
    { id: 0, name: 'TODO' },
    { id: 1, name: 'ACTIVO' },
    { id: 2, name: 'INACTIVO' },
    { id: 3, name: 'ELIMINADO' }
]

const filterStatus = [
    { id: 'TODO', name: 'TODO' },
    { id: 'VIGENTE', name: 'VIGENTE' },
    { id: 'VENCIDO', name: 'VENCIDO' }
]

const Users = () => {
    let classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState({ original: [], filter: [], filterState: 0, filterStatus: 'TODO' });
    const [searched, setSearched] = useState("");

    useEffect(() => {
        const check = async () => {
            let res = await UsersService.getAllUsers();
            if (res.success) {
                setData({ ...data, users: res.users, filter: res.users });
                //setDataFilter([...res.users])
            }
            if (res.tokenError) {
                history.push("/entrar");
            }
        }
        check();
    }, []);

    const handleState = async (id) => {
        enqueueSnackbar("Procesando...", {
            variant: 'info',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Slide,
        });
        const listArray = data.users.map(async (item, j) => {
            if (item.id === id) {
                let newState = "";
                if (item.idState === 1) {
                    newState = "N";
                } else {
                    newState = "Y";
                }
                let res = await UsersService.setStateUser(id, newState);
                if (res.success) {
                    closeSnackbar();
                    if (newState === "N") {
                        item.idState = 2;
                        enqueueSnackbar("Usuario inactivo", {
                            variant: 'success',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'center'
                            },
                            TransitionComponent: Slide,
                        });
                    } else {
                        item.idState = 1;
                        enqueueSnackbar("Usuario activo", {
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
        await Promise.all(listArray).then((res) => setData({ ...data, users: res }));
    }

    const preHandleDelete = (id) => {
        swal({
            title: "Eliminar Usuario?",
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

    const handleDelete = async (id) => {
        enqueueSnackbar("Procesando...", {
            variant: 'info',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Slide,
        });
        let res = await UsersService.deleteUser(id);
        if (res.success) {
            closeSnackbar();
            enqueueSnackbar("Usuario eliminado correctamente", {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                TransitionComponent: Slide,
            });
            const listArray = [...data.users];
            _.forEach(listArray, (item) => { if (item.id === id) { item.idState = 3; } });
            setData({ ...data, users: listArray, filter: listArray })
        }
    }

    const handleReactive = async (id) => {
        enqueueSnackbar("Procesando...", {
            variant: 'info',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Slide,
        });
        let res = await UsersService.reactiveUser(id);
        if (res.success) {
            closeSnackbar();
            enqueueSnackbar("Usuario activado correctamente", {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                TransitionComponent: Slide,
            });
            const listArray = [...data.users];
            _.forEach(listArray, (item) => { if (item.id === id) { item.idState = 1; } });
            setData({ ...data, users: listArray, filter: listArray })
        }
    }

    const requestSearch = (searchedVal) => {
        const filteredRows = data.users.filter((row) => {
            if (row.name != null && row.email != null && row.plan != null) {
                return row.name.toLowerCase().includes(searchedVal.toLowerCase()) || row.email.toLowerCase().includes(searchedVal.toLowerCase()) || row.plan.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if (row.name != null && row.email != null) {
                return row.name.toLowerCase().includes(searchedVal.toLowerCase()) || row.email.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if (row.name != null && row.plan != null) {
                return row.name.toLowerCase().includes(searchedVal.toLowerCase()) || row.plan.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if (row.email != null && row.plan != null) {
                return row.email.toLowerCase().includes(searchedVal.toLowerCase()) || row.plan.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if (row.name != null) {
                return row.name.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if (row.email != null) {
                return row.email.toLowerCase().includes(searchedVal.toLowerCase());
            }
            if (row.plan != null) {
                return row.plan.toLowerCase().includes(searchedVal.toLowerCase());
            }
            return [];
        });
        setData({ ...data, filter: filteredRows });
        //setDataFilter(filteredRows);
    };

    const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
    };

    const handleFilterStateChange = (e) => {
        const value = e.target.value;
        const filteredRows = data.users.filter((row) => {
            if (value === 0) {
                return row;
            } else {
                return row.idState === value;
            }
        });
        setData({ ...data, filter: filteredRows, filterState: value });
    }

    const handleFilterStatusChange = (e) => {
        const value = e.target.value;
        const filteredRows = data.users.filter((row) => {
            if (value === "TODO") {
                return row;
            } else {
                return row.status === value;
            }
        });
        setData({ ...data, filter: filteredRows, filterStatus: value });
    }

    const handleEdit = (id) => {
        history.push("/admin/usuarios/editar/" + id);
    }

    const getSheetData = (dataa, header) => {
        var fields = Object.keys(dataa[0]);
        var sheetData = dataa.map(function (row) {
            return header.map(function (fieldName) {
                return row[fieldName] ? row[fieldName] : "";
            });
        });
        sheetData.unshift(header);
        return sheetData;
    }

    const handleExport = async () => {
        let data = [];
        let res = await UsersService.getExportUsers();
        if (res.success) {
            var dataa = res.users;
            let header = ["id", "Correo", "Nombre", "Celular", "Estado", "Plan", "FechaVencimiento", "IdClienteOP", "IdSubscripcionOP", "FechaCreacion"];

        //     XlsxPopulate.fromBlankAsync().then(async (workbook) => {
        //         const sheet1 = workbook.sheet(0);
        //         const sheetData = getSheetData(dataa, header);
        //         const totalColumns = sheetData[0].length;

        //         sheet1.cell("A1").value(sheetData);
        //         const range = sheet1.usedRange();
        //         const endColumn = String.fromCharCode(64 + totalColumns);
        //         sheet1.row(1).style("bold", true);
        //         sheet1.range("A1:" + endColumn + "1").style("fill", "BFBFBF");
        //         range.style("border", true);
        //         return workbook.outputAsync().then((res) => {
        //             saveAs(res, "UsuariosMiWhats.xlsx");
        //         });
        //     });
        }
        if (res.tokenError) {
            history.push("/entrar");
        }
    }

    return (
        <div style={{ marginTop: "30px" }}>
            <Paper className={classes.paperView}>
                <Grid container>
                    <Box style={{ flexGrow: 1 }}>
                        <Typography variant='h3' style={{ flexGrow: 1 }} className={[classes.title, classes.textBold]}> Lista de Usuarios</Typography>
                    </Box>
                    <Grid item lg={12}>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "10px" }}>
                        <Grid container>
                            <Grid item sm={2} style={{ marginTop: '10px', paddingInline: '5px' }}>
                                <Controls.Select
                                    label="Estado Usuario"
                                    value={data.filterState}
                                    onChange={handleFilterStateChange}
                                    options={filterState}
                                    size="small"
                                />
                            </Grid>
                            <Grid item sm={2} style={{ marginTop: '10px', paddingInline: '5px' }}>
                                <Controls.Select
                                    label="Estado Plan"
                                    value={data.filterStatus}
                                    onChange={handleFilterStatusChange}
                                    options={filterStatus}
                                    size="small"
                                />
                            </Grid>
                            <Grid item sm={3}></Grid>
                            <Grid item sm={4} style={{ marginBlock: '10px' }}>
                                <SearchBar
                                    value={searched}
                                    onChange={(searchVal) => requestSearch(searchVal)}
                                    onCancelSearch={() => cancelSearch()}
                                    placeholder="Buscar"
                                />
                            </Grid>
                            <Grid item sm={1} style={{ marginTop: '10px', paddingInline: '5px' }}>
                                <Button variant="contained" size="small" color="primary" onClick={handleExport}>
                                    Exportar
                                </Button>
                            </Grid>
                        </Grid>
                        <Controls.DataTable rows={data.filter}
                            header={headerList}
                            handleState={handleState}
                            handleEdit={(id) => handleEdit(id)}
                            handleDelete={preHandleDelete}
                            handleReactive={handleReactive}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default Users;