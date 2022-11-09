import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, Slide } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import { useHistory, useParams } from "react-router-dom";
import Controls from "../../controls";
import { useSnackbar } from 'notistack';
import LoginService from '../../../application/services/login.service';

const ChangePasswordSuccess = (props) =>{
    let classes = useStyles();
    let history = useHistory();
    let params = useParams();
    let { enqueueSnackbar } = useSnackbar();
    const [values, setValues] = useState({ password:"", password2:"" })
    const [errors, setErrors] = useState({});
    
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length > 7 ? "" : "Contraseña minimo 8 caracteres."
        if ('password2' in fieldValues)
            temp.password2 = fieldValues.password2 === values.password ? "" : "Contraseña incorrecta."
        
        setErrors({
            ...temp
        })
        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        validate({ [name]: value })
    }

    const handleReturn = () => {
        history.push("/entrar");
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validate(values)){
            let res = await LoginService.setChangePassword(values.password,params.email, params.idmail);
            if(res.success){
                enqueueSnackbar("Cambio de contraseña correctamente", {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
                history.push("/entrar");
            }
            if(res.error){
                enqueueSnackbar(res.error, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
            }
        }
    }

    return (
        <Grid>
            <Paper elevation={10} className={classes.paperStyle}>
                <Grid align='center'>
                    <img className={classes.logo} src='/images/logo.png'  alt="Logo"/>
                    <Typography variant="h3"> Cambiar Contraseña</Typography>
                </Grid>
                <Grid container style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Typography variant="h6">
                            <Box m={1}>
                                Ingresar su nueva contraseña
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Controls.Input
                            name="password"
                            label="Contraseña"
                            type="password"
                            value={values.password}
                            onChange={handleInputChange}
                            error={errors.password}
                        />
                    </Grid>
                    <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Controls.Input
                            name="password2"
                            label="Verificar Contraseña"
                            type="password"
                            value={values.password2}
                            onChange={handleInputChange}
                            error={errors.password2}
                        />
                    </Grid>
                    <Grid xs={12} style={{ marginTop:"30px", fontSize:'8px'}}>
                        <Button color='primary' variant="contained" className={classes.btnstyle} fullWidth onClick={(e) => handleSubmit(e)}>Cambiar</Button>
                    </Grid>
                    <Grid xs={12} style={{ marginTop:"5px", fontSize:'8px'}}>
                        <Button color='inherit' variant="contained" className={classes.btnstyle} fullWidth onClick={() => handleReturn()}>Regresar</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}

export default ChangePasswordSuccess;