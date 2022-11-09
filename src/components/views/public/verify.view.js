import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Button } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import { useHistory, useParams } from "react-router-dom";
import LoginService from '../../../application/services/login.service';

const VerifyMail = (props) =>{
    let classes = useStyles();
    let history = useHistory();
    let params = useParams();
    let [verify, setVerify] = useState(false)
    
    useEffect(() => {
        const check = async () => {
          let res = await LoginService.verifyMail(params.email, params.idmail);
          if(res.success){
            setVerify(true)
          }
        }
        check();
    }, []);

    const handleReturn = () => {
        history.push("/entrar");
    }

    return (
        <Grid>
            <Paper elevation={10} className={classes.paperStyle}>
                <Grid align='center'>
                    <img className={classes.logo} src='/images/logo.png'  alt="Logo"/>
                    <Typography variant="h3"> Verificar Cuenta</Typography>
                </Grid>
                <Grid container style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    {
                        (verify)
                        ?(<Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                            <Typography variant="h6">
                                <Box fontWeight="fontWeightBold" m={1}>
                                    Bienvenido
                                </Box>
                            </Typography>
                            <Typography variant="h6">
                                <Box fontWeight="fontWeightBold" m={2}>
                                    Cuenta {params.email} verificada correctamente, ya puedes ingresar.
                                </Box>
                            </Typography>
                        </Grid>)
                        :(<Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                            <Typography variant="h6">
                                <Box fontWeight="fontWeightBold" m={1}>
                                    Ups
                                </Box>
                            </Typography>
                            <Typography variant="h6">
                                <Box fontWeight="fontWeightBold" m={2}>
                                    Hubo un error al verificar su cuenta.
                                </Box>
                            </Typography>
                        </Grid>)
                    }
                    <Grid xs={12} style={{ marginTop:"5px", fontSize:'8px'}}>
                        <Button color='inherit' variant="contained" className={classes.btnstyle} fullWidth onClick={() => handleReturn()}>Regresar</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}

export default VerifyMail;