import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, Slide } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import { useHistory } from "react-router-dom";
import Controls from "../../controls";
import { useSnackbar } from 'notistack';
import LoginService from '../../../application/services/login.service';

const ChangePassword = (props) =>{
    let classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState("")
    const [send, setSend] = useState(false)
    
    const handleReturn = () => {
        history.push("/entrar");
    }

    const handleSubmit = async () => {
        let res = await LoginService.getChangePassword(email);
          if(res.success){
            setSend(true);
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

    return (
        <Grid>
            <Paper elevation={10} className={classes.paperStyle}>
                <Grid align='center'>
                    <img className={classes.logo} src='/images/logo.png'  alt="Logo"/>
                    <Typography variant="h3"> Cambiar Contraseña</Typography>
                </Grid>
                {
                    (!send)
                    ?(
                        <Grid container style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                            <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                                <Typography variant="h6">
                                    <Box m={1}>
                                        Ingresar su correo para cambiar contraseña
                                    </Box>
                                </Typography>
                            </Grid>
                            <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                                <Controls.Input
                                    name="email"
                                    label="Correo"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid xs={12} style={{ marginTop:"30px", fontSize:'8px'}}>
                                <Button color='primary' variant="contained" className={classes.btnstyle} fullWidth onClick={(e) => handleSubmit(e)}>Enviar</Button>
                            </Grid>
                            <Grid xs={12} style={{ marginTop:"5px", fontSize:'8px'}}>
                                <Button color='inherit' variant="contained" className={classes.btnstyle} fullWidth onClick={() => handleReturn()}>Regresar</Button>
                            </Grid>
                        </Grid>
                    )
                    :(
                        <Grid container style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                            <Grid xs={12} style={{ marginTop:"10px", fontSize:'8px'}}>
                                <Typography variant="h6">
                                    <Box m={1}>
                                        Se envio un correo a {email}, para cambiar la contrseña
                                    </Box>
                                </Typography>
                            </Grid>
                            
                            <Grid xs={12} style={{ marginTop:"25px", fontSize:'8px'}}>
                                <Button color='inherit' variant="contained" className={classes.btnstyle} fullWidth onClick={() => handleReturn()}>Regresar</Button>
                            </Grid>
                        </Grid>
                    )
                }
                
            </Paper>
        </Grid>
    )
}

export default ChangePassword;