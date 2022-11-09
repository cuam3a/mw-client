import React, { useState, useEffect, useContext } from 'react';
import { Grid, Paper, Typography, Slide, Button, Divider, RadioGroup, FormControlLabel, Radio, Box, Alert, AlertTitle } from '@mui/material';
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory, useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
import UserService from '../../../application/services/user.plans.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";
import Global from "../../../application/services/global.service"

const PlansPayload = () => {
    let classes = useStyles();
    let history = useHistory();
    let params = useParams();
    let { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState({ plan: {}, creditCard: null });
    const [type, setType] = useState("1");
    const [newData, setNewData] = useState({
        deviceSessionId: 0,
        idPlan: 0,
        useCard: false,
        name: '',
        creditCard: '',
        month: '',
        year: '',
        ccv: ''
    });
    const [errors, setErrors] = useState({});
    const [state, setState] = useContext(AppContext);
    const [btnState, setBtnState] = useState(false)

    useEffect(() => {
        const check = async () => {
            let res = await UserService.getPlan(params.id);
            if (res.success) {
                setData({ plan: res.plan, creditCard: null });
            }
            if (res.tokenError) {
                history.push("/entrar");
            }
        }
        check();
    }, []);

    const validate = async (fieldValues = newData) => {
        let temp = { ...errors }

        if ('name' in fieldValues)
            temp.name = ((/^[a-zA-Z\s]*$/g).test(fieldValues.name) && fieldValues.name.length <= 30) ? "" : "Solo letras, maximo 30 caracteres."
        if ('creditCard' in fieldValues)
            temp.creditCard = (window.OpenPay.card.validateCardNumber(fieldValues.creditCard)) ? "" : "Tarjeta invalida."
        if ('month' in fieldValues && newData.year !== "" && newData.year)
            temp.month = (window.OpenPay.card.validateExpiry(fieldValues.month, newData.year) && fieldValues.month.length <= 2) ? "" : "Invalida 2 digitos."
        if ('year' in fieldValues && newData.month !== "" && newData.month)
            temp.year = (window.OpenPay.card.validateExpiry(newData.month, fieldValues.year) && fieldValues.year.length <= 2) ? "" : "Invalida 2 digitos."
        if ('ccv' in fieldValues)
            temp.ccv = (window.OpenPay.card.validateCVC(fieldValues.ccv)) ? "" : "Codigo CCV invalido."
        setErrors({
            ...temp
        })
        if (fieldValues === newData)
            return Object.values(temp).every(x => x === "")
    }

    const handleInputChange = e => {
        const { name, value } = e.target
        setNewData(() => ({
            ...newData,
            [name]: value
        }))
        validate({ [name]: value })
    }

    const handlePay = async (e) => {
        setBtnState(true);
        //e.preventDefault()
        enqueueSnackbar("Procesando...", {
            variant: 'info',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
            TransitionComponent: Slide,
        });

        let valido = false;
        if (type === "0") {
            newData.useCard = true;
            valido = true;
        } else {
            newData.useCard = false;
            if (await validate(newData)) {
                valido = true;
            }
        }
        //console.log(valido);
        if (valido) {
            newData.idPlan = data.plan.id;
            window.OpenPay.setId('msanffd7gse2b9ye0lul');
            window.OpenPay.setApiKey('sk_1401f4620fba400b9395ec3d4c706f3b');
            //window.OpenPay.setId('mr6wpejiefa0xpbqyprw');
            //window.OpenPay.setApiKey('sk_aeee4cb780da440abe672c5e8513f02f');
            //window.OpenPay.setSandboxMode(true);
            newData.deviceSessionId = window.OpenPay.deviceData.setup("formOpenpay");

            let res = await UserService.setPayload(newData);
            console.log(res);
            if (res.success) {
                closeSnackbar();
                enqueueSnackbar(res.message, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
                setState(() => ({ ...state, update: true }))
                history.push("/usuario/dashboard");
            }
            else {
                closeSnackbar();
                //console.log(res.message)
                enqueueSnackbar(typeof res.error === 'object' ? "Error con servidor" : res.error, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
                setBtnState(false);
            }
        }
        else {
            closeSnackbar();
            setBtnState(false);
        }
    }

    return (
        <div style={{ marginTop: "30px" }}>
            <Paper className={classes.paperView}>
                <Grid container style={{}}>
                    <Box style={{ flexGrow: 1 }}>
                        <Typography variant='h3' style={{ flexGrow: 1 }} className={[classes.title, classes.textBold]}> Pago de plan</Typography>
                    </Box>
                    <Grid container style={{ display: 'flex', justifyContent: 'space-between', height: '50vh', padding: 10 }}>
                        <Grid item lg={8} sm={12}>
                            <Typography>Datos de Tarjeta</Typography>
                            <RadioGroup aria-label="tarjeta" value={type} onChange={(e) => setType(e.target.value)}>
                                {(state.user.creditCard !== null)
                                    ? <FormControlLabel value="0" control={<Radio />} label={"Usar tarjeta " + state.user.creditCard} />
                                    : <div></div>
                                }
                                <FormControlLabel value="1" control={<Radio />} label="Otra tarjeta" />
                            </RadioGroup>
                            {
                                (type === "1")
                                    ? (
                                        <form id="processCard" name="processCard">
                                            <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Grid item lg={6} className={classes.input}>
                                                    <Controls.Input
                                                        name="name"
                                                        label="Nombre del titular"
                                                        type="text"
                                                        data-openpay-card="holder_name"
                                                        onChange={handleInputChange}
                                                        value={newData.name}
                                                        error={errors.name}
                                                    />
                                                </Grid>
                                                <Grid item lg={4} className={classes.input}></Grid>
                                                <Grid item lg={4} className={classes.input}>
                                                    <Controls.Input
                                                        name="creditCard"
                                                        label="Numero de tarjeta"
                                                        type="text"
                                                        data-openpay-card="card_number"
                                                        onChange={handleInputChange}
                                                        value={newData.creditCard}
                                                        error={errors.creditCard}
                                                    />
                                                </Grid>
                                                <Grid item lg={2} className={classes.input}>
                                                    <Controls.Input
                                                        name="month"
                                                        label="Mes (MM)"
                                                        type="text"
                                                        data-openpay-card="expiration_month"
                                                        onChange={handleInputChange}
                                                        value={newData.month}
                                                        error={errors.month}
                                                    />
                                                </Grid>
                                                <Grid item lg={2} className={classes.input}>
                                                    <Controls.Input
                                                        name="year"
                                                        label="Año (AA)"
                                                        type="text"
                                                        data-openpay-card="expiration_year"
                                                        onChange={handleInputChange}
                                                        value={newData.year}
                                                        error={errors.year}
                                                    />
                                                </Grid>
                                                <Grid item lg={2} className={classes.input}>
                                                    <Controls.Input
                                                        name="ccv"
                                                        label="CCV"
                                                        type="text"
                                                        data-openpay-card="cvv2"
                                                        onChange={handleInputChange}
                                                        value={newData.ccv}
                                                        error={errors.ccv}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </form>
                                    )
                                    : <div></div>
                            }
                            <Box></Box>
                        </Grid>
                        <Grid item lg={4} sm={12} style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', alignItems: 'center', alignContent: 'space-around' }}>
                            <Typography className={classes.textBold}>{data.plan.name}</Typography>
                            <Typography className={classes.textBold}>TOTAL: {Global.getFormatCurrency(data.plan.cost)}</Typography>
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <Alert severity="info">
                                <AlertTitle>Información</AlertTitle>
                                    Al contratar este plan, se realizaran cargos automaticos cada mes, por el costo total del plan seleccionado, a la tarjeta con la que se esta relaizando la contratacion, esta información puede actualizarse en su perfil
                            </Alert>
                        </Grid>
                    </Grid>
                    <Grid container style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                        <Grid item lg={7} sm={12}>
                            <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Grid item lg={11} className={classes.openPay}>
                                    <img className={classes.logoTipoOpenPay} src='/images/tipoopenpay.png' alt="Logo" />
                                    <img className={classes.logoOpenPay} src='/images/openpay.png' alt="Logo" />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={1} sm={12}></Grid>
                        <Grid item lg={4} sm={12}>
                            <Button size="small" variant="contained" fullWidth color='primary' onClick={handlePay} disabled={btnState}>PAGAR</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default PlansPayload;