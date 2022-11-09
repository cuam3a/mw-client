import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Slide, Tooltip, Divider, Fab, FormControlLabel, Switch, Accordion, AccordionSummary, AccordionDetails, Button, Popover, TextareaAutosize } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory, useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
import UserService from '../../../application/services/user.miwhats.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faLink, faPalette, faFont, faTint, faPhone, faInfo } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebookMessenger, faYoutube, faGoogle, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { isMobile } from "react-device-detect";
import _ from "lodash";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const arrayButtons = [
    { idButtonType: 1, name: 'Llamada', label: "Telefono", icon: <FontAwesomeIcon icon={faPhone} />, type: "button" },
    { idButtonType: 2, name: 'WhatsApp', label: "Celular WhatsApp (incluir lada)", icon: <FontAwesomeIcon icon={faWhatsapp} />, type: "button" },
    { idButtonType: 3, name: 'Facebook Messenger', label: "Id Facebook", icon: <FontAwesomeIcon icon={faFacebookMessenger} />, type: "button" },
    { idButtonType: 4, name: 'Catalogo WhatsApp', label: "Link Catalogo WhatsApp", icon: <FontAwesomeIcon icon={faWhatsapp} />, type: "button" },
    { idButtonType: 5, name: 'Video', label: "URL Video", icon: <FontAwesomeIcon icon={faYoutube} />, type: "video" },
    { idButtonType: 6, name: 'Facebook', label: "Link Facebook", icon: <FontAwesomeIcon icon={faFacebook} />, type: "link" },
    { idButtonType: 7, name: 'Instagram', label: "Link Instagram", icon: <FontAwesomeIcon icon={faInstagram} />, type: "link" },
]

const arrayScript = [
    { idScriptType: 1, name: 'Google Analytics', label: "Id Google Analytics", icon: <FontAwesomeIcon icon={faGoogle} /> },
    { idScriptType: 2, name: 'Facebook Pixel', label: "Id Facebook", icon: <FontAwesomeIcon icon={faFacebook} /> }
]

const MiWhatsEdit = () => {
    var classes = useStyles();
    let history = useHistory();
    let params = useParams();
    let { enqueueSnackbar } = useSnackbar();
    const [view, setView] = useState((isMobile ? "Mobil" : "WEB"));
    const [data, setData] = useState({
        name: '',
        url: '',
        title: '',
        text: '',
        fontColor: '',
        backgroundColor: '',
        buttons: [],
        scripts: []
    });
    const [errors, setErrors] = useState({});
    const [colorBtn, setColorBtn] = useState({ active: false, fontColor: '#000000', buttonColor: '#FFFFFF' })
    const isFile = input => 'File' in window && input instanceof File;

    useEffect(() => {
        const check = async () => {
            let res = await UserService.getMiWhats(params.id);
            if (res.success) {
                setData(res.miwhats);
            }
        }
        check();
    }, []);

    const handleInputChange = e => {
        const { name, value } = e.target

        if (e.target.name === "backgroundImage" && isFile(value)) {
            const myNewFile = new File([value], ('background.' + value.type.replace("image/", "")), { type: value.type });
            setData({
                ...data,
                [name]: myNewFile,
                previewBackgroundImage: URL.createObjectURL(myNewFile),
            })
        } else if (e.target.name === "logo" && isFile(value)) {
            const myNewFile = new File([value], ('logo.' + value.type.replace("image/", "")), { type: value.type });
            setData({
                ...data,
                [name]: myNewFile,
                previewLogo: URL.createObjectURL(myNewFile),
            })

        } else {
            setData(() => ({
                ...data,
                [name]: value
            }))
        }
        validate({ [name]: value })
    }

    const handleInputChangeButton = async (e, type) => {
        const { name, value } = e.target;
        let buttonArray = _.find(data.buttons, { idButtonType: type.idButtonType });
        if (buttonArray) {
            if (buttonArray[name] !== undefined) {
                buttonArray[name] = value;
            } else {
                Object.assign(buttonArray, { [name]: value, type: type.type });
            }

            setData({
                ...data
            })
        } else {
            const newButton = {
                idButtonType: type.idButtonType,
                idState: "1",
                name: type.name,
                type: type.type,
                fontColor: (colorBtn.active ? colorBtn.fontColor : '#000000'),
                buttonColor: (colorBtn.active ? colorBtn.buttonColor : '#FFFFFF'),
                [name]: value
            }
            setData({
                ...data,
                buttons: [...data.buttons, newButton]
            })
        }
    }

    const handleInputChangeScripts = async (e, type) => {
        const { name, value } = e.target;

        let scriptArray = _.find(data.scripts, { idScriptType: type.idScriptType });
        if (scriptArray) {
            if (scriptArray[name] !== undefined) {
                scriptArray[name] = value;
            } else {
                Object.assign(scriptArray, { [name]: value, type: type.type });
            }

            setData({
                ...data
            })
        } else {
            const newButton = {
                idScriptType: type.idScriptType,
                idState: "1",
                name: type.name,
                type: type.type,
                [name]: value
            }
            setData({
                ...data,
                scripts: [...data.scripts, newButton]
            })
        }
    }

    const handleGlobalBtnColor = (e, type) => {
        const { value } = e.target;
        let arrBtn = _.filter(data.buttons, (item) => { return (item.type === 'button' || item.type === 'extra' || item.type === 'link') });
        if (type === "fontColor") {
            _.forEach(arrBtn, (item) => {
                item.fontColor = value;
            })
            setColorBtn({ ...colorBtn, fontColor: value });
        }
        if (type === "buttonColor") {
            _.forEach(arrBtn, (item) => {
                item.buttonColor = value;
            })
            setColorBtn({ ...colorBtn, buttonColor: value });
        }
        setData({
            ...data, buttons: [...data.buttons]
        })
    }

    const handleActiveButton = (e, type) => {
        if (e.target.checked) {
            e.target.value = "1";
        } else {
            e.target.value = "2";
        }
        handleInputChangeButton(e, type);
    }

    const handleActiveScript = (e, type) => {
        if (e.target.checked) {
            e.target.value = "1";
        } else {
            e.target.value = "2";
        }
        handleInputChangeScripts(e, type);
    }

    const validate = async (fieldValues = data) => {
        let temp = { ...errors }

        if ('name' in fieldValues)
            temp.name = (fieldValues.name !== "" && fieldValues.name !== null) ? "" : "Colocar nombre."

        setErrors({
            ...temp
        })
        if (fieldValues === data)
            return Object.values(temp).every(x => x === "")
    }

    const handleSave = async () => {
        if (await validate(data)) {
            let res = await UserService.editMiWhats(data);
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
                enqueueSnackbar("Editado correctamente", {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    TransitionComponent: Slide,
                });
                history.push('/admin/miwhats');
            }
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleVideInfo = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseVideInfo = () => {
        setAnchorEl(null);
    };

    const handleURLVideo = (e) => {
        const { value, type } = e.target;
        const index = value.indexOf('src="');
        if (index >= 0) {
            let text = value.substring(index + 5, value.length);
            const indexEnd = text.indexOf('"');
            if (indexEnd >= 0) {
                const url = value.substring(index + 5, (indexEnd + index + 5));
                let buttonArray = _.find(data.buttons, { idButtonType: 5 });
                if (buttonArray) {
                    buttonArray.contact = url;
                    setData({
                        ...data
                    })
                }
            }
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div style={{ marginTop: "30px" }}>
            <Paper className={classes.paperView}>
                <Grid container>
                    <Grid item xs={12} lg={12} style={{ flexGrow: 1 }}>
                        <Typography variant='h4' className={[classes.title, classes.textBold]}> Editar MiWhats</Typography>
                        <Divider variant="middle" />
                    </Grid>

                    <Grid item sm={12} lg={6} style={{ marginBlock: "10px", paddingInline: "15px", overflow: 'auto', maxHeight: "450px", display: 'flex', flexWrap: 'wrap' }}>
                        <Grid xs={12} className={classes.input}>
                            <Controls.Input
                                name="name"
                                label="Nombre"
                                type="text"
                                value={data.name}
                                onChange={handleInputChange}
                                error={errors.name}
                                readOnly={true}
                            />
                        </Grid>
                        <Grid xs={12} className={classes.input}>
                            <Controls.Input
                                name="URL"
                                label="URL"
                                type="text"
                                value={data.URL}
                                onChange={handleInputChange}
                                error={errors.URL}
                                start={<div><FontAwesomeIcon icon={faLink} style={{ marginRight: '5px' }} /><Typography component="span" style={{ fontStyle: "italic", color: "#C4C4C4" }}>{data.domain}</Typography></div>}
                                readOnly={true}
                            />
                        </Grid>
                        <Grid xs={12} className={classes.inputFile}>
                            <Controls.FileInput
                                value={data.logo}
                                name="logo"
                                label="logo"
                                onChange={handleInputChange} />
                            {
                                (data.previewLogo)
                                    ? <img src={data.previewLogo} alt="logo" height="150" />
                                    : <div></div>
                            }
                        </Grid>
                        <Grid xs={12} className={classes.input}>
                            <Controls.Input
                                name="backgroundColor"
                                label="Color Fondo"
                                type="color"
                                value={data.backgroundColor}
                                onChange={handleInputChange}
                                error={errors.backgroundColor}
                                start={<div><FontAwesomeIcon icon={faPalette} style={{ marginRight: '5px' }} /></div>}
                            />
                        </Grid>
                        <Grid xs={12} className={classes.inputFile}>
                            <Controls.FileInput
                                value={data.backgroundImage}
                                name="backgroundImage"
                                label="Fondo"
                                onChange={handleInputChange} />
                            {
                                (data.previewBackgroundImage)
                                    ? <img src={data.previewBackgroundImage} alt="Imagen Fondo" height="200" />
                                    : <div></div>
                            }
                        </Grid>
                        <Grid xs={12} className={classes.input}>
                            <Controls.Input
                                name="title"
                                label="Titulo"
                                type="text"
                                value={data.title}
                                onChange={handleInputChange}
                                error={errors.title}
                                start={<div><FontAwesomeIcon icon={faFont} style={{ marginRight: '5px' }} /></div>}
                            />
                        </Grid>
                        <Grid xs={12} className={classes.input}>
                            <Controls.Input
                                name="text"
                                label="Texto"
                                type="text"
                                multiline={true}
                                value={data.text}
                                onChange={handleInputChange}
                                error={errors.text}
                                start={<div><FontAwesomeIcon icon={faFont} style={{ marginRight: '5px' }} /></div>}
                            />
                        </Grid>
                        <Grid xs={12} className={classes.input}>
                            <Controls.Input
                                name="fontColor"
                                label="Color Texto"
                                type="color"
                                value={data.fontColor}
                                onChange={handleInputChange}
                                error={errors.fontColor}
                                start={<div><FontAwesomeIcon icon={faTint} style={{ marginRight: '5px' }} /></div>}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '10px' }}></Grid>
                        <Grid item xs={2}>
                            <Typography style={{ fontSize: '16px', fontWeight: "bold" }}>Botones</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControlLabel
                                value="top"
                                label="Color Botones Global"
                                control={<Switch color="primary" size="small" checked={(colorBtn.active ? true : false)} onChange={() => setColorBtn({ ...colorBtn, active: !colorBtn.active })} />}
                            />
                        </Grid>
                        {
                            (colorBtn.active)
                                ?
                                <>
                                    <Grid item xs={3}>
                                        <Controls.Input
                                            label="Color Texto"
                                            type="color"
                                            value={(colorBtn.fontColor ?? "")}
                                            onChange={(e) => handleGlobalBtnColor(e, 'fontColor')}
                                            start={<div><FontAwesomeIcon icon={faTint} style={{ marginRight: '5px' }} /></div>}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Controls.Input
                                            name="buttonColor"
                                            label="Color Fondo"
                                            type="color"
                                            value={(colorBtn.buttonColor ?? "")}
                                            onChange={(e) => handleGlobalBtnColor(e, 'buttonColor')}
                                            start={<div><FontAwesomeIcon icon={faPalette} style={{ marginRight: '5px' }} /></div>}
                                        />
                                    </Grid>
                                </>
                                :
                                <></>
                        }
                        <Divider variant="middle" />
                        {
                            arrayButtons.map((item, i) => {
                                const buttonExist = _.find(data.buttons, ['idButtonType', item.idButtonType])
                                //alert(JSON.stringify(buttonExist))
                                return (

                                    <>
                                        <Grid container xs={12} style={{ marginBlock: "15px", marginInline: "5px", display: 'flex', flexWrap: 'wrap' }} key={i}>
                                            <Grid item xs={10}>
                                                <Typography gutterBottom variant="caption" style={{ fontSize: '15px', fontWeight: "bold" }}>
                                                    {item.icon}
                                                </Typography>
                                                <Typography gutterBottom variant="caption" style={{ fontSize: '15px', fontWeight: "bold", marginLeft: "10px" }}>
                                                    {item.name}
                                                </Typography>

                                            </Grid>
                                            <Grid item xs={2}>
                                                <FormControlLabel
                                                    value="top"
                                                    label="Activo"
                                                    control={<Switch color="primary" size="small" name="idState" checked={(buttonExist) ? ((buttonExist.idState.toString() === "1" ? true : false)) : false} onChange={(e) => handleActiveButton(e, { idButtonType: item.idButtonType, name: item.name, type: item.type })} />}
                                                />
                                            </Grid>

                                            {
                                                (buttonExist && buttonExist.idState.toString() === "1" && (item.type === "button" || item.type === "extra" || item.type === "link"))
                                                    ?
                                                    (
                                                        <>
                                                            <Grid container alignItems="center" style={{ marginBlock: "15px" }}>
                                                                {(item.type == "extra")
                                                                    ?
                                                                    <>
                                                                        <Grid item xs={4} >
                                                                            <Controls.Input
                                                                                name="name"
                                                                                label={item.name}
                                                                                type="text"
                                                                                value={(buttonExist) ? buttonExist.name : ""}
                                                                                onChange={(e) => handleInputChangeButton(e, { idButtonType: item.idButtonType, name: item.name, type: item.type })}
                                                                                error={errors.name}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={8} >
                                                                            <Controls.Input
                                                                                name="contact"
                                                                                label={item.label}
                                                                                type="text"
                                                                                value={(buttonExist) ? buttonExist.contact : ""}
                                                                                onChange={(e) => handleInputChangeButton(e, { idButtonType: item.idButtonType, name: item.name, type: item.type })}
                                                                                error={errors.name}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                    :
                                                                    <Grid item xs={12} >
                                                                        <Controls.Input
                                                                            name="contact"
                                                                            label={item.label}
                                                                            type="text"
                                                                            value={(buttonExist) ? buttonExist.contact : ""}
                                                                            onChange={(e) => handleInputChangeButton(e, { idButtonType: item.idButtonType, name: item.name, type: item.type })}
                                                                            error={errors.name}
                                                                            start={
                                                                                item.idButtonType == 2
                                                                                    ?
                                                                                    <div style={{ maxWidth: '80%' }}>
                                                                                        <FontAwesomeIcon icon={faLink} style={{ marginRight: '5px' }} />
                                                                                        <Controls.Select
                                                                                            value={item.lada ?? "52"}
                                                                                            name="lada"
                                                                                            label=""
                                                                                            size="small"
                                                                                            onChange={(e) => handleInputChangeButton(e, { idButtonType: item.idButtonType, name: item.name, type: item.type })}
                                                                                            options={[{ id: "52", name: "MEX +52" }, { id: "1", name: "USA +1" }]}
                                                                                        />
                                                                                    </div>
                                                                                    : <></>
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                }
                                                            </Grid>
                                                            {
                                                                (!colorBtn.active)
                                                                    ?
                                                                    <Grid container alignItems="center" style={{ marginBlock: "10px" }}>
                                                                        <Grid item xs>
                                                                            <Controls.Input
                                                                                name="fontColor"
                                                                                label="Color Texto"
                                                                                type="color"
                                                                                value={(buttonExist) ? buttonExist.fontColor : ""}
                                                                                onChange={(e) => handleInputChangeButton(e, { idButtonType: item.idButtonType, name: item.name, type: item.type })}
                                                                                error={errors.fontColor}
                                                                                start={<div><FontAwesomeIcon icon={faTint} style={{ marginRight: '5px' }} /></div>}
                                                                            />
                                                                        </Grid>
                                                                        {(item.type !== "link")
                                                                            ?
                                                                            <Grid item xs>
                                                                                <Controls.Input
                                                                                    name="buttonColor"
                                                                                    label="Color Fondo"
                                                                                    type="color"
                                                                                    value={(buttonExist) ? buttonExist.buttonColor : ""}
                                                                                    onChange={(e) => handleInputChangeButton(e, { idButtonType: item.idButtonType, name: item.name, type: item.type })}
                                                                                    error={errors.buttonColor}
                                                                                    start={<div><FontAwesomeIcon icon={faPalette} style={{ marginRight: '5px' }} /></div>}
                                                                                />
                                                                            </Grid>
                                                                            : <></>
                                                                        }
                                                                    </Grid>
                                                                    :
                                                                    <></>
                                                            }
                                                        </>
                                                    )
                                                    : (
                                                        (buttonExist && buttonExist.idState.toString() === "1" && item.type === "video")
                                                            ?
                                                            (
                                                                <>
                                                                    <Grid container alignItems="center" style={{ marginBlock: "10px" }}>
                                                                        <Grid item xs>
                                                                            <Tooltip title="Click en el boton de la derecha para agregar el video">
                                                                                <Controls.Input
                                                                                    name="contact"
                                                                                    label={item.label}
                                                                                    type="text"
                                                                                    value={(buttonExist) ? buttonExist.contact : ""}
                                                                                    onChange={(e) => handleInputChangeButton(e, { idButtonType: item.idButtonType, name: item.name, type: item.type })}
                                                                                    error={errors.name}
                                                                                />
                                                                            </Tooltip>
                                                                        </Grid>
                                                                        <Button aria-describedby={id} variant="contained" color="primary" onClick={handleVideInfo} style={{ borderRadius: 8, marginLeft: 3 }}>
                                                                            <FontAwesomeIcon icon={faInfo} />
                                                                        </Button>
                                                                        <Popover
                                                                            id={id}
                                                                            open={open}
                                                                            anchorEl={anchorEl}
                                                                            onClose={handleCloseVideInfo}
                                                                            anchorOrigin={{
                                                                                vertical: 'bottom',
                                                                                horizontal: 'center',
                                                                            }}
                                                                            transformOrigin={{
                                                                                vertical: 'top',
                                                                                horizontal: 'center',
                                                                            }}
                                                                        >
                                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'justify' }}>
                                                                                <span style={{ marginTop: 3, fontWeight: 'bold', marginLeft: 3 }}>Instrucción:</span>
                                                                                <span style={{ marginLeft: 3 }}>1. Posicionate sobre el vídeo clic secundario.</span>
                                                                                <span style={{ marginLeft: 3 }}>2. Copia código embebido o de insercion.</span>
                                                                                <span style={{ marginBottom: 3, marginLeft: 3 }}>3. Pegarlo en el cuadro blanco.</span>
                                                                                <TextareaAutosize aria-label="minimum height" rowsMin={10} style={{ width: '400px' }} onChange={handleURLVideo} />
                                                                            </div>
                                                                        </Popover>
                                                                    </Grid>
                                                                </>
                                                            )
                                                            : <div></div>
                                                    )
                                            }
                                        </Grid>
                                        <Divider variant="middle" />

                                    </>
                                )
                            })
                        }
                        <Grid xs={12}>
                            <Accordion style={{ border: "0.5px solid #CECECE", marginTop: "10px", marginBottom: "10px" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1c-content"
                                    id="panel1c-header"
                                >
                                    <Typography style={{ fontSize: '12px', fontWeight: "bold" }}>Opciones Avanzadas</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid item xs={12} style={{ fontSize: '8px' }}>
                                        {
                                            arrayScript.map((item, i) => {
                                                const scriptExist = _.find(data.scripts, ['idScriptType', item.idScriptType])
                                                return (
                                                    <div key={i}>
                                                        <Grid container alignItems="center" style={{ marginBlock: "10px" }}>
                                                            <Grid item xs>
                                                                <Typography gutterBottom variant="caption" style={{ fontSize: '15px', fontWeight: "bold" }}>
                                                                    {item.icon}
                                                                </Typography>
                                                                <Typography gutterBottom variant="caption" style={{ fontSize: '15px', fontWeight: "bold", marginLeft: "10px" }}>
                                                                    {item.name}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <FormControlLabel
                                                                    value="top"
                                                                    label="Activo"
                                                                    control={<Switch color="primary" size="small" name="idState" checked={(scriptExist) ? ((scriptExist.idState === "1" ? true : false)) : false} onChange={(e) => handleActiveScript(e, { idScriptType: item.idScriptType, name: item.name, type: item.type })} />}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        {
                                                            (scriptExist && scriptExist.idState.toString() === "1")
                                                                ?
                                                                (
                                                                    <div>
                                                                        <Grid container alignItems="center" style={{ marginBlock: "10px" }}>
                                                                            <Grid item xs>
                                                                                <Controls.Input
                                                                                    name="contact"
                                                                                    label={item.label}
                                                                                    type="text"
                                                                                    value={(scriptExist) ? scriptExist.contact : ""}
                                                                                    onChange={(e) => handleInputChangeScripts(e, { idScriptType: item.idScriptType, name: item.name, type: item.type })}
                                                                                    error={errors.name}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </div>
                                                                )
                                                                : <div></div>
                                                        }
                                                        <Divider variant="middle" />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>


                    <Grid item sm={12} lg={6} style={{ marginBlock: "10px", paddingInline: "15px", overflow: 'auto', maxHeight: "450px" }}>
                        <Grid item lg={12} style={{ paddingTop: "10px", textAlign: "center" }}>
                            {
                                !isMobile
                                    ? <Button size="small" style={{ marginRight: "5px", width: "120px" }} variant="contained" color="primary" onClick={() => setView("WEB")}>Vista WEB</Button>
                                    : <div></div>
                            }
                            <Button size="small" style={{ width: "120px" }} variant="contained" color="primary" onClick={() => setView("Mobil")}>Vista Mobil</Button>
                        </Grid>
                        <Grid item xs={12} style={{ margin: "10px" }}>
                            <Controls.TemplateMiwhats data={data} view={view} />
                        </Grid>
                    </Grid>
                    <Tooltip title="Editar Miwhats" aria-label="Editar Miwhats">
                        <Fab className={classes.fab} color="secondary" aria-label="edit" onClick={() => handleSave()} >
                            <FontAwesomeIcon icon={faSave} />
                        </Fab>
                    </Tooltip>
                </Grid>
            </Paper>
        </div>
    )
}


export default MiWhatsEdit;