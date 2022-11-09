import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Slide, Tooltip, Divider, Fab, FormControlLabel, Switch, Accordion, AccordionSummary, AccordionDetails, Button } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory, useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
import PlansService from '../../../application/services/admin.plans.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faLink, faPalette, faFont, faTint, faPhone } from '@fortawesome/free-solid-svg-icons';
import _ from "lodash";

const PlanEdit = () =>{
    var classes = useStyles();
    let history = useHistory();
    let params = useParams();
    let { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState({
        name: '',
        numberMiWhats: 1,
        cost: 0,
        days: 30,
        image: ''
    });
    const [errors, setErrors] = useState({});
    const isFile = input => 'File' in window && input instanceof File;

    useEffect(() => {
        const check = async() => {
            let res = await PlansService.getPlan(params.id);
            //alert(JSON.stringify(res))
            if (res.success) {
                setData(res.plan);
            }
        }
        check();
    }, []);

    const handleInputChange = e => {
        const { name, value } = e.target

        if(e.target.name === "image" && isFile(value)){
            const myNewFile = new File([value], ('image.' + value.type.replace("image/","")), {type: value.type});
            setData({
                ...data,
                [name]: myNewFile,
                previewImage: URL.createObjectURL(myNewFile),
            })
        }else{
            setData(() => ({
                ...data,
                [name]: value
            }))
        }
        validate({ [name]: value })
    }
    
    const validate = async(fieldValues = data) => {
        let temp = { ...errors }
        
        if ('name' in fieldValues)
            temp.name = (fieldValues.name !== "") ? "" : "Colocar nombre."
        if ('numberMiWhats' in fieldValues)
            temp.numberMiWhats = (parseInt(fieldValues.numberMiWhats) > 0 && fieldValues.numberMiWhats !== "") ? "" : "mayor de 0."
        if ('cost' in fieldValues)
            temp.cost = (parseInt(fieldValues.cost) > 0 && fieldValues.cost !== "") ? "" : "mayor de 0."

        setErrors({
            ...temp
        })
        if (fieldValues === data)
            return Object.values(temp).every(x => x === "")
    }

    const validateURL = async(url) => {
        let res = await PlansService.getValidateURL(url);
        if (res.success) {
            return false;
        }else{
            return true;
        }
    }

    const handleSave =async (e) =>{
        e.preventDefault();
        if (await validate(data)){
            let res = await PlansService.editPlan(data);
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
                enqueueSnackbar("Registro correctamente", {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
                history.push('/admin/planes');
            }
        }
    }

    return (
        <div style={{ marginTop: "30px"}}>
            <Paper className={classes.paperView}>
                <Grid container>
                    <Grid item xs={12} lg={12} style={{ flexGrow: 1 }}>
                        <Typography variant='h4' className={[ classes.title, classes.textBold ]}> Agregar Plan</Typography>
                        <Divider variant="middle" />
                    </Grid>
                    
                    <Grid container sm={12} lg={12} style={{ marginBlock:"10px", paddingInline:"15px", overflow: 'auto', maxHeight: "450px" }}>
                        <Grid xs={4} className={ classes.input }>
                            <Controls.Input
                                name="name"
                                label="Nombre"
                                type="text"
                                value={data.name}
                                onChange={handleInputChange}
                                error={errors.name}
                            />
                        </Grid>
                        <Grid xs={2} className={ classes.input }>
                            <Controls.Input
                                name="numberMiWhats"
                                label="# de MyWhats"
                                type="number"
                                value={data.numberMiWhats}
                                onChange={handleInputChange}
                                error={errors.numberMiWhats}
                            />
                        </Grid>
                        <Grid xs={2} className={ classes.input }>
                            <Controls.Input
                                name="cost"
                                label="Precio"
                                type="number"
                                value={data.cost}
                                onChange={handleInputChange}
                                error={errors.cost}
                            />
                        </Grid>
                        <Grid xs={3} className={ classes.inputFile }>
                            <Controls.FileInput 
                                value={data.image}
                                name="image"
                                label="Plan"
                                onChange={handleInputChange}/>
                            {
                                (data.previewImage)
                                ?<img src={data.previewImage} alt="imagen" height="150" />
                                :<div></div>
                            }
                        </Grid>
                    </Grid>
            
                   
                    <Tooltip title="Guardar Plan" aria-label="Guardar Plan">
                        <Fab className={ classes.fab} color="secondary" aria-label="add" onClick={(e) => handleSave(e) } >
                            <FontAwesomeIcon icon={faSave}/>
                        </Fab>
                    </Tooltip>
                </Grid> 
            </Paper>
        </div>
    )
}

export default PlanEdit;