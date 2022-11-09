import React, { useState, useContext, useEffect } from 'react';
import { Grid, Paper, Typography, Slide, Box, Button, AppBar, Tabs, Tab } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views';
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory, useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
import UserService from '../../../application/services/admin.users.service';
import { AppContext } from '../../../application/provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSync, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'

const headerList = [
    { id: '#', numeric: false, disablePadding: true, label: '#', index: true },
    { id: 'numberOrder', numeric: true, disablePadding: false, label: 'NUMERO ORDEN', index: false },
    { id: 'amount', numeric: true, disablePadding: false, label: 'TOTAL', index: false },
    { id: 'description', numeric: true, disablePadding: false, label: 'DESCRIPCIÓN', index: false },
    { id: 'authorization', numeric: true, disablePadding: false, label: 'AUTORIZACIÓN', index: false },
    { id: 'bankName', numeric: true, disablePadding: false, label: 'BANCO', index: false },
    { id: 'createdAt', numeric: true, disablePadding: false, label: 'FECHA', index: false },
];

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const UserEdit = () => {
    var classes = useStyles();
    let history = useHistory();
    let params = useParams();
    let { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});
    const [value, setValue] = useState(0);
    const [password, setPassword] = useState({ password: "", newPassword: "" });
    const [plans, setPlans] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const check = async () => {
        let res = await UserService.getUserById(params.id);
        if (res.success) {
            setData(res.user);
            res.plans.push({ id: 0, name: 'GRATUITO' });
            setPlans(res.plans);
        }
        if (res.tokenError) {
            history.push("/entrar");
        }
    }

    useEffect(() => {
        check();
    }, []);

    const handleInputChange = e => {
        const { name, value } = e.target
        setData(() => ({
            ...data,
            [name]: value
        }))
        validateProfile({ [name]: value })
    }

    //CHANGE PERSONAL INFORMATION
    const validateProfile = (fieldValues = data) => {
        let temp = { ...errors }

        if ('name' in fieldValues && fieldValues.name != "" && fieldValues.name)
            temp.name = (fieldValues.name && (/^[a-zA-Z\s]*$/g).test(fieldValues.name) && fieldValues.name.length <= 30) ? "" : "Solo letras, maximo 30 caracteres."
        if ('lastName' in fieldValues && fieldValues.lastName != "" && fieldValues.lastName)
            temp.lastName = (fieldValues.lastName && (/^[a-zA-Z\s]*$/g).test(fieldValues.lastName) && fieldValues.lastName.length <= 30) ? "" : "Solo letras, maximo 30 caracteres."
        if ('cellNumber' in fieldValues && fieldValues.cellNumber != "" && fieldValues.cellNumber)
            temp.cellNumber = isNaN(fieldValues.cellNumber) ? "Formato incorrecto solo numeros" : ((fieldValues.cellNumber && fieldValues.cellNumber.length === 10) ? "" : "Numero celular a 10 digitos.")
        if ('creditCardName' in fieldValues && fieldValues.creditCardName != "" && fieldValues.creditCardName)
            temp.creditCardName = ((/^[a-zA-Z\s]*$/g).test(fieldValues.creditCardName) && fieldValues.creditCardName.length <= 30) ? "" : "Solo letras, maximo 30 caracteres."
        if ('creditCard' in fieldValues && fieldValues.creditCardName != "" && fieldValues.creditCardName)
            temp.creditCard = (window.OpenPay.card.validateCardNumber(fieldValues.creditCard)) ? "" : "Tarjeta invalida."
        if ('creditCardExpirationMonth' in fieldValues && data.creditCardExpirationYear !== "" && fieldValues.creditCardExpirationYear)
            temp.creditCardExpirationMonth = (window.OpenPay.card.validateExpiry(fieldValues.creditCardExpirationMonth, data.creditCardExpirationYear)) ? "" : "Invalida."
        if ('creditCardExpirationYear' in fieldValues && data.creditCardExpirationMonth !== "" && fieldValues.creditCardExpirationMonth)
            temp.creditCardExpirationYear = (window.OpenPay.card.validateExpiry(data.creditCardExpirationMonth, fieldValues.creditCardExpirationYear)) ? "" : "Invalida."
        if ('ccv' in fieldValues)
            temp.ccv = (window.OpenPay.card.validateCVC(fieldValues.ccv)) ? "" : "Codigo CCV invalido."
        setErrors({
            ...temp
        })
        if (fieldValues === data)
            return Object.values(temp).every(x => x === "")
    }

    const handleChangeProfile = async (e) => {
        e.preventDefault()
        if (validateProfile(data)) {
            let res = await UserService.setUserById(data);
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
                enqueueSnackbar("Actualización información correctamente", {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
                setPassword({ password: "", newPassword: "" })
            }
        }
    }

    return (
        <div style={{ marginTop: "30px" }}>
            <Paper className={classes.paperView}>
                <div className={classes.root}>
                    <AppBar position="static" color="warning">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Perfil" />
                            <Tab label="Pagos" />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} >
                            <Grid container>
                                <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Grid item lg={4} className={classes.input} style={{ paddingTop: '30px' }}>
                                        <Controls.Input
                                            name=""
                                            label="Email"
                                            type="text"
                                            value={data.email}
                                            readonly={true}
                                        />
                                    </Grid>
                                    <Grid item lg={2} className={classes.input} style={{ paddingTop: '30px' }}>
                                        <Controls.Select
                                            value={data.mailActive ?? "P"}
                                            name="mailActive"
                                            label="Verificacion Correo"
                                            onChange={handleInputChange}
                                            options={[{ id: "Y", name: "ACTIVO" }, { id: "P", name: "PENDIENTE" }]}
                                        />
                                    </Grid>
                                    <Grid container sm={12} lg={6}>

                                    </Grid>
                                    <Grid item xs={12} lg={12} className={classes.input} style={{ borderTop: '1px solid #EEEEEE', paddingTop: '10px' }}>
                                        <Typography component="p">Datos Personales</Typography>
                                    </Grid>
                                    <Grid item lg={3} className={classes.input}>
                                        <Controls.Input
                                            name="name"
                                            label="Nombre(s)"
                                            type="text"
                                            value={data.name}
                                            onChange={handleInputChange}
                                            error={errors.name}
                                        />
                                    </Grid>
                                    <Grid item lg={3} className={classes.input}>
                                        <Controls.Input
                                            name="lastName"
                                            label="Apellido(s)"
                                            type="text"
                                            value={data.lastName}
                                            onChange={handleInputChange}
                                            error={errors.lastName}
                                        />
                                    </Grid>
                                    <Grid item lg={2} className={classes.input}>
                                        <Controls.Input
                                            name="cellNumber"
                                            label="Celular"
                                            type="text"
                                            value={data.cellNumber}
                                            onChange={handleInputChange}
                                            error={errors.cellNumber}
                                        />
                                    </Grid>
                                    <Grid item lg={2} className={classes.input}>
                                        <Controls.Input
                                            name="phoneNumber"
                                            label="Telefono"
                                            type="text"
                                            value={data.phoneNumber}
                                            onChange={handleInputChange}
                                            error={errors.phoneNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={12} className={classes.input} style={{ borderTop: '1px solid #EEEEEE', paddingTop: '10px' }}>
                                        <Typography component="p">Datos OpenPay</Typography>
                                    </Grid>
                                    <Grid item lg={3} className={classes.input}>
                                        <Controls.Input
                                            name="idCustomerOpenPay"
                                            label="ID Cliente"
                                            type="text"
                                            value={data.idCustomerOpenPay}
                                            onChange={handleInputChange}
                                            error={errors.idCustomerOpenPay}
                                        />
                                    </Grid>
                                    <Grid item lg={3} className={classes.input}>
                                        <Controls.Input
                                            name="idSubscriptionOpenPay"
                                            label="ID Suscripcion"
                                            type="text"
                                            value={data.idSubscriptionOpenPay}
                                            onChange={handleInputChange}
                                            error={errors.idSubscriptionOpenPay}
                                        />
                                    </Grid>
                                    <Grid item lg={4} className={classes.input}>
                                    </Grid>
                                    <Grid item xs={12} lg={12} className={classes.input} style={{ borderTop: '1px solid #EEEEEE', paddingTop: '10px' }}>
                                        <Typography component="p">Datos Tarjeta</Typography>
                                    </Grid>
                                    <Grid item lg={4} className={classes.input}>
                                        <Controls.Input
                                            name="creditCardName"
                                            label="Nombre Titular"
                                            type="text"
                                            data-openpay-card="holder_name"
                                            value={data.creditCardName}
                                            onChange={handleInputChange}
                                            error={errors.creditCardName}
                                        />
                                    </Grid>
                                    <Grid item lg={4} className={classes.input}>
                                        <Controls.Input
                                            name="creditCard"
                                            label="Tarjeta"
                                            type="text"
                                            data-openpay-card="card_number"
                                            value={data.creditCard}
                                            onChange={handleInputChange}
                                            error={errors.creditCard}
                                        />
                                    </Grid>
                                    <Grid item lg={1} className={classes.input}>
                                        <Controls.Input
                                            name="creditCardExpirationMonth"
                                            label="Mes"
                                            type="text"
                                            data-openpay-card="expiration_month"
                                            value={data.creditCardExpirationMonth}
                                            onChange={handleInputChange}
                                            error={errors.creditCardExpirationMonth}
                                        />
                                    </Grid>
                                    <Grid item lg={1} className={classes.input}>
                                        <Controls.Input
                                            name="creditCardExpirationYear"
                                            label="Año"
                                            type="text"
                                            data-openpay-card="expiration_year"
                                            value={data.creditCardExpirationYear}
                                            onChange={handleInputChange}
                                            error={errors.creditCardExpirationYear}
                                        />
                                    </Grid>
                                    <Grid item lg={1} className={classes.input}>
                                        <Controls.Input
                                            name="ccv"
                                            label="CCV"
                                            type="password"
                                            data-openpay-card="cvv2"
                                            value={data.ccv}
                                            onChange={handleInputChange}
                                            error={errors.ccv}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={12} className={classes.input} style={{ borderTop: '1px solid #EEEEEE', paddingTop: '10px' }}>
                                        <Typography component="p">Plan</Typography>
                                    </Grid>
                                    <Grid item lg={3} className={classes.input}>
                                        <Controls.Select
                                            value={data.idPlan ?? 0}
                                            name="idPlan"
                                            label="Plan"
                                            onChange={handleInputChange}
                                            options={plans}
                                        />
                                    </Grid>
                                    <Grid item lg={2} className={classes.input}>
                                        <Controls.Input
                                            name="downAt"
                                            label="Fecha Vencimiento"
                                            type="date"
                                            value={moment(data.downAt).format("YYYY-MM-DD")}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item lg={3} className={classes.input}>
                                    </Grid>
                                    <Grid item lg={2} className={classes.input}>
                                        <Typography component="h4">Expira en {(data.days)} días</Typography>
                                    </Grid>
                                    <Grid item lg={3} className={classes.input}></Grid>
                                    <Grid item xs={12} lg={1} className={classes.input}>
                                        <Button size="small" variant="contained" fullWidth color='primary' onClick={handleChangeProfile}><FontAwesomeIcon icon={faSave} /> <Typography className={classes.textProfile}>ACTUALIZAR</Typography></Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1} >
                            <Grid container>
                                <Grid item xs={12} style={{ marginTop: "10px" }}>
                                    <Controls.DataTable rows={data.payments}
                                        header={headerList}
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </SwipeableViews>
                </div>

            </Paper>
        </div>
    )
}

export default UserEdit;