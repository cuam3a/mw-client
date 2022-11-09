import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button, Card, CardContent } from '@mui/material';
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import UserService from '../../../application/services/user.plans.service';
import { AppContext } from '../../../application/provider';
import _ from "lodash";

const Plans = () =>{
    let classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState([]);

    useEffect(() => {
        const check = async() => {
            let res = await UserService.getListPlans();
            if (res.success) {
                _.forEach(res.plans, (item) => { item.image = res.domain + "/" + item.image })
                setData(res.plans);
            }
            if(res.tokenError){
                history.push("/entrar");
            }
        }
        check();
    }, []);

    const handleBuy = (id) => {
        history.push("/usuario/planes/comprar/" + id);
    }

    return (
        <div style={{ marginTop: "30px"}}>
            <Paper className={classes.paperView}>
                <Grid container style={{display: 'flex', justifyContent: 'center', heigth: '60vh' }}>
                    {data.map((plan) => (
                        <Card class={classes.textCenter} style={{ marginBlock: '50px', marginInline: "10px", display: 'flex', justifyContent: 'space-around', border: '1px solid' }}>
                            <CardContent>
                                <img src={plan.image} style={{ height: '120px'}} alt={plan.className}/>
                                <Typography variant="h6" className={classes.pos} style={{ textTransform: 'uppercase', marginTop: '10px', fontWeight: 'bold' }} color="textSecondary">
                                    {plan.name}
                                </Typography>
                                <Typography variant="body2" component="p" style={{marginBlock: '10px'}}>
                                    Maximo de {plan.numberMiWhats} MiWhats
                                </Typography>
                                <Typography variant="body2" component="p" style={{marginBlock: '20px', fontWeight: 'bold'}}>
                                    $ {plan.cost} al mes
                                </Typography>
                                <Button size="small" variant="contained" fullWidth color='primary' onClick={() => handleBuy(plan.id)}>Comprar</Button>
                            </CardContent>
                        </Card>
                    ))}
                </Grid> 
            </Paper>
        </div>
    )
}

export default Plans;