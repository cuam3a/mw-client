import React, { useState, useEffect, useContext } from 'react';
import { Grid, Paper, Typography, Slide, Button, Card, Checkbox } from '@mui/material';
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import UserProfileService from '../../../application/services/user.profile.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";
import moment from 'moment';

const Cancel = () => {
    let classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [state] = useContext(AppContext);

    useEffect(() => {
        let arrData = []
        let count = 1;
        _.forEach(state.user.miWhats, (item) => {
            let obj = {}
            obj.id = item.id;
            obj.name = item.name;
            obj.domain = item.domain;
            obj.url = item.url;
            obj.check = (count < 3 ? true : false);
            count++;
            arrData.push(obj)
        })
        setData(arrData);
    }, [state]);

    const handleCheck = (id) => {
        let check = _.find(data, (item) => { return item.id == id });
        if (!check.check) {
            let countCheck = _.filter(data, (item) => { return item.check == true });
            if (countCheck.length < 2) {
                check.check = true;
                setData([...data]);
            }
        }
        else {
            check.check = false;
            setData([...data]);
        }
    }

    const handleCancel = async (e) => {
        e.preventDefault()
        let miwhats = _.filter(data, (item) => { return item.check == true; });
        let res = await UserProfileService.setCancelPlan(miwhats);
        if (res.error) {
            enqueueSnackbar(typeof res.error === 'object' ? "Error con servidor" : res.error, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                TransitionComponent: Slide,
            });
        }
        if (res.success) {
            enqueueSnackbar("Se ancelo suscripción correctamente", {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                TransitionComponent: Slide,
            });
            history.push("/usuario/perfil");
        }
    }

    return (
        <div style={{ marginTop: "30px" }}>
            <Paper className={classes.paperView}>
                <Grid container style={{ display: 'flex', justifyContent: 'center', heigth: '60vh' }}>
                    <Grid item lg={12} style={{ paddingTop: '30px', textAlign: 'center' }}>
                        <Typography component="p" variant='h4'>Cancelar Plan: {state.user.plan}</Typography>
                        <Typography component="p" variant='h6' style={{ marginTop: 20 }}>¿Quieres finalizar con tu suscripción?</Typography>
                    </Grid>
                    <Grid container lg={12} style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', verticalAlign: 'center', marginBottom: 20 }}>
                        <Grid item lg={3}>
                        </Grid>
                        <Grid item lg={6} style={{ paddingTop: '30px' }}>
                            <Typography component="p">Si cancelar la suscripción, cambiar su cuenta a GRATUITA</Typography>
                            <Typography component="p">Continuaras teniendo acceso a tus links de MiWhats hasta el {moment(state.user.downAt).format('DD-MM-YYYY')}</Typography>
                            <Typography component="p" style={{ marginLeft: 25 }}>-Solo puede tener 2 links MiWhats.</Typography>
                            <Typography component="p" style={{ marginLeft: 25 }}>-El nombre cambiara a uno generico.</Typography>
                            <Typography component="p" style={{ marginLeft: 25 }}>-Seleccionar los links MiWhats, que quedaran en tu cuenta (maximo 2).</Typography>
                        </Grid>
                        <Grid item lg={3}>
                        </Grid>
                        {
                            data.map((item, index) => {
                                return (
                                    <Grid container lg={12} style={{ paddingTop: '10px', display: 'flex', flexWrap: 'wrap', flexDirection: 'row', verticalAlign: 'center' }} key={index}>
                                        <Grid item lg={3}>
                                        </Grid>
                                        <Grid item lg={1}>
                                            <Checkbox size="small" checked={item.check} color="primary" onChange={() => handleCheck(item.id)} />
                                        </Grid>
                                        <Grid item lg={2}>
                                            {item.name}
                                        </Grid>
                                        <Grid item lg={3}>
                                            {item.domain}{item.url}
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                        <Grid item lg={5}>
                        </Grid>
                        <Grid item lg={2} style={{ paddingTop: '30px' }}>
                            <Button size="small" variant="contained" fullWidth color='secondary' onClick={handleCancel}><Typography>CANCELAR</Typography></Button>
                        </Grid>
                        <Grid item lg={5}>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default Cancel;