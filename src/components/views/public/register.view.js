import React, { useState } from 'react';
import { Grid, Paper, Typography, Button, Slide } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import LoginService from '../../../application/services/login.service';

const Register = () =>{
    var classes = useStyles();
    let history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const initialValues = {
        email: '',
        password: '',
        password2: '',
        cellNumber: ''
    }

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Correo incorrecto."
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length > 7 ? "" : "Contraseña minimo 8 caracteres."
        if ('password2' in fieldValues)
            temp.password2 = fieldValues.password2 === values.password ? "" : "Contraseña incorrecta."
        if ('cellNumber' in fieldValues)
            temp.cellNumber = isNaN(fieldValues.cellNumber) ? "Formato incorrecto solo numeros" : (fieldValues.cellNumber.length === 10 ? "" : "Numero celular a 10 digitos.")
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
            let res = await LoginService.register(values);
            if(res.error){
                enqueueSnackbar(typeof res.error === 'object' ? "Error con servidor" : res.error, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
            }
            if(res.success){
                console.log(res.message)
                enqueueSnackbar("Registro correctamente", {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
                history.push({
                    pathname: '/registro-completo',
                    state: { email: values.email }
                });
            }
        }
    }

    return (
        <Grid>
            <Paper elevation={10} className={classes.paperStyle}>
                <Grid align='center'>
                    <img className={classes.logo} src='./images/logo.png'  alt="Logo"/>
                    <Typography variant="h3"> Registrar</Typography>
                </Grid>
                <Grid container style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Controls.Input
                            name="email"
                            label="Correo"
                            type="text"
                            value={values.email}
                            onChange={handleInputChange}
                            error={errors.email}
                        />
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
                    <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Controls.Input
                            name="cellNumber"
                            label="Celular"
                            type="text"
                            value={values.cellNumber}
                            onChange={handleInputChange}
                            error={errors.cellNumber}
                        />
                    </Grid>
                    <Grid xs={12} className={ classes.textCenter } style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Typography>Periodo de prueba de 14 días</Typography>
                    </Grid>
                    
                    <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Button color='primary' variant="contained" className={classes.btnstyle} fullWidth onClick={(e) => handleSubmit(e)}>Registrar</Button>
                    </Grid>
                    <Grid xs={12} style={{ marginTop:"5px", fontSize:'8px'}}>
                        <Button color='inherit' variant="contained" className={classes.btnstyle} fullWidth onClick={() => handleReturn()}>Regresar</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}

export default Register;