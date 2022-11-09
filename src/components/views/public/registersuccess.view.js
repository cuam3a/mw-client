import React from 'react';
import { Grid, Paper, Typography, Box, Button } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import { Redirect, useHistory, useLocation } from "react-router-dom";

const RegisterSuccess = () =>{
    var classes = useStyles();
    let history = useHistory();
    const location = useLocation();
    
    const handleReturn = () => {
        history.push("/entrar");
    }

    return (
        ((location?.state?.email ?? null) == null)
        ?<Redirect to="/entrar"/> 
        :<Grid>
            <Paper elevation={10} className={classes.paperStyle}>
                <Grid align='center'>
                    <img className={classes.logo} src='/images/logo.png'  alt="Logo"/>
                    <Typography variant="h3"> Registrar</Typography>
                </Grid>
                <Grid container style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                        <Typography variant="h6">
                            <Box fontWeight="fontWeightBold" m={1}>
                                Bienvenido
                            </Box>
                        </Typography>
                        <Typography variant="h6">
                            Registro correctamente, se ha enviado un correo de verificacion a la siguiente direccion:
                            <Box fontWeight="fontWeightBold" m={2}>
                                {location?.state?.email ?? ""}
                            </Box>
                        </Typography>
                    </Grid>
                    
                    <Grid xs={12} style={{ marginTop:"5px", fontSize:'8px'}}>
                        <Button color='inherit' variant="contained" className={classes.btnstyle} fullWidth onClick={() => handleReturn()}>Regresar</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}

export default RegisterSuccess;