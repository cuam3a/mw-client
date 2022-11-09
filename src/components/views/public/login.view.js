import React, { useState, useContext, useEffect } from 'react';
import { Grid, Paper, Typography, Slide, Button } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import LoginService from '../../../application/services/login.service';
import { AppContext } from '../../../application/provider';

const Login = () =>{
    var classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ state, setState ] = useContext(AppContext);

    const handleRegister = () => {
        history.push("/registro");
    }

    const handleChangePassword = () => {
        history.push("/cambiar-constrasena");
    }

    const handleSignin = async () => {
        let res = await LoginService.login({ email: email, password: password });
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
            setState({...state, user: res.user, isLogin: true })
            if(res.user.idUserType === 1){
                history.push("/admin/dashboard");
            }else{
                history.push("/usuario/dashboard");
            } 
        }
    }

    return (
            <Paper elevation={10} className={classes.paperStyle}>
                <Grid align='center'>
                    <img className={classes.logo} src='/images/logo.png'  alt="Logo"/>
                    <Typography variant="h3" className={classes.marginForm}> Iniciar Sesión</Typography>
                </Grid>
                <Grid container  style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Grid xs={12} item style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Controls.Input label='Usuario' onChange={(item) => setEmail(item.target.value)} />
                    </Grid>
                    <Grid xs={12} item style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Controls.Input label='Contraseña' type='password' onChange={(item) => setPassword(item.target.value)} />
                    </Grid>
                    <Grid xs={12} item style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Button color='primary' variant="contained" className={classes.btnstyle} onClick={() => handleSignin()} fullWidth>Entrar</Button>
                    </Grid>
                    <Grid xs={12} item style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Typography >
                            <Button color="primary" onClick={() => handleChangePassword() }>Recuperar contraseña ?</Button>
                        </Typography>
                        <Typography > No tienes cuenta ?
                            <Button color="primary" onClick={() => handleRegister() }>Registro</Button>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
    )
}

export default Login;