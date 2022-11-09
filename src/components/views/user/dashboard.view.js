import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Grid, Paper, Typography, Box, Modal, Button, CircularProgress, Card, CardContent  } from '@material-ui/core';
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import LoginService from '../../../application/services/login.service';
import { AppContext } from '../../../application/provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faChartBar, faHandPointer, faEye, faSearch, faChartPie } from '@fortawesome/free-solid-svg-icons';
import UserDashboardService from '../../../application/services/user.dashboard.service'
import _ from 'lodash'
import moment from 'moment'
import html2canvas from "html2canvas";
import jsPdf from "jspdf";

const Dashboard = () =>{
    var classes = useStyles();
    let history = useHistory();
    let { enqueueSnackbar } = useSnackbar();
    const [ state, setState ] = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dateStart, setDateStart] = useState(moment().format("YYYY-MM-DD"));
    const [dateEnd, setDateEnd] = useState(moment().format("YYYY-MM-DD"));
    const [dataCharts, setDataCharts] = useState({ data:[], btnSearch: 'filter' });
    const [click, setClick] = useState(0);
    const [view, setView] = useState(0);

    const handleClose = () => {
        setOpen(false);
    };

    const handleGoPlan = () => {
        history.push("/usuario/planes");
    };

    useEffect(() => {
        const check = async () => {
            setState({...state, loader: true })
            const email = JSON.parse(localStorage.getItem('email'));
            let res = await LoginService.checkToken(email);
            console.log("DASH " + JSON.stringify(res))
            if(res.success){
                if(res.user.miWhats.length === 0){
                    history.push("/usuario/miwhats/");
                }
                else{
                    setState({...state, user: res.user, isLogin: true, update: false, loader: false, miWhats: res.user.miWhats[0] })
                    setIsLoading(false)
                }
            }
            if(res.tokenError){
                setState({...state, update: true })
                history.push("/entrar");
                setIsLoading(false)
            }
        }
        check();
    }, []);

    useEffect(() => {
        getDataChart();
    }, [state.miWhats]);

    const handleInputChange = event => {
        const innerText = state.user.miWhats.find(item => item.id === event.target.value).name;
        let miWhats={id: event.target.value, name: innerText }
        setState({...state, miWhats: miWhats  })
        handleFilter('filter')
    }

    const handleFilter = (type) => {
        //setBtnSearch(type);
        getDataChart(type);
    }

    const getDataChart = async(type) => {
        let dateS = new Date(dateStart);
        let dateE = new Date(dateEnd);
        if(type == "week"){
            dateS = moment().startOf('week').isoWeekday(1).format('YYYY-MM-DD')
            dateE = moment().format('YYYY-MM-DD')
        }
        if(type == "month"){
            dateS = new Date(moment().startOf('month').format('YYYY-MM-DD'))
            dateE = new Date(moment().endOf('month').format('YYYY-MM-DD'))
        }
        if(type == "year"){
            dateS = new Date(moment().startOf('year').format('YYYY-MM-DD'))
            dateE = new Date(moment().endOf('year').format('YYYY-MM-DD'))
        }
        let res = await UserDashboardService.getClicks(state.miWhats?.id ?? 0,dateS,dateE,type);
        if (res.success) {
            let arrClick = _.filter(res.data.views, (i) => { return i.type === "CLICK"});
            setClick(_.sumBy(arrClick, (item) => { return item.view }))
            let arrView = _.filter(res.data.views, (i) => { return i.type === "VISITA"});
            setView(_.sumBy(arrView, (item) => { return item.view }))
            setDataCharts({ ...dataCharts, data: res.data, btnSearch: type })
        }
    }

    let handleExport = useCallback(()=>{
        document.getElementById("print").style.visibility = "visible";
        const domElement = document.getElementById("print");
        html2canvas(domElement, {
            onclone: document => {
                //document.getElementById("print").style.visibility = "hidden";
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPdf();
            pdf.addImage(imgData, "JPEG", 10, 10);
            pdf.save(`${new Date().toISOString()}.pdf`);
        });
        document.getElementById("print").style.visibility = "hidden";
    },[])

    return (
        <div style={{ marginTop: "30px"}}>
            {
                (isLoading) 
                ? 
                    <Paper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: '30px' }}>
                        <CircularProgress /> 
                    </Paper>
                :
                <Paper className={classes.paperView}>
                    <Box style={{ flexGrow: 1 }}>
                        <Grid container>
                            <Grid item lg={2} sm={12}  style={{ marginTop: '10px', padding: 10}}>
                                <Controls.Select
                                    value={state.miWhats?.id ?? 0}
                                    name="miwhats"
                                    label="MiWhats"
                                    size="small"
                                    onChange={handleInputChange}
                                    options={(state?.user?.miWhats ?? [])}
                                />
                                <Card className={classes.root} style={{ marginTop: 20}}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <FontAwesomeIcon icon={faHandPointer} size='2x'/>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography component="p" variant='caption' align='center'>{click}</Typography>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <Typography component="p" variant='caption' align='center'>TOTAL CLICKS</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <Card className={classes.root} style={{ marginTop: 20}}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <FontAwesomeIcon icon={faEye} size='2x'/>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography component="p" variant='caption' align='center'>{view}</Typography>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <Typography component="p" variant='caption' align='center'>TOTAL VISITAS</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <Card className={classes.root} style={{ marginTop: 20}}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <FontAwesomeIcon icon={faChartPie} size='2x'/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography component="p" variant='caption' align='center'>{(view > 0) ? ((click*100)/view).toFixed(0) : 0} %</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography component="p" variant='caption' align='center'>INTERACCÓN</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item lg={10} sm={12} style={{ marginTop: '10px', padding: 10}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <Controls.Input
                                                name=""
                                                label="Fecha Inicio"
                                                type="date"
                                                size="small"
                                                value={dateStart}
                                                onChange={(e) => setDateStart(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controls.Input
                                                name=""
                                                label="Fecha Fin"
                                                type="date"
                                                size="small"
                                                value={dateEnd}
                                                onChange={(e) => setDateEnd(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Button size="small" variant={dataCharts.btnSearch == 'filter' ? "contained" : "outlined" } fullWidth color='primary' onClick={() => handleFilter("filter")} style={{ height: 30 }}><FontAwesomeIcon icon={faSearch} /> <Typography className={ classes.textProfile }></Typography></Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button size="small" variant={dataCharts.btnSearch == 'week' ? "contained" : "outlined" } fullWidth color='primary' onClick={() => handleFilter("week")} style={{ height: 30 }}><Typography className={ classes.textProfile }>ULTIMA SEMANA</Typography></Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button size="small" variant={dataCharts.btnSearch == 'month' ? "contained" : "outlined" } fullWidth color='primary' onClick={() => handleFilter("month")} style={{ height: 30 }}><Typography className={ classes.textProfile }>MES ACTUAL</Typography></Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button size="small" variant={dataCharts.btnSearch == 'year' ? "contained" : "outlined" }fullWidth color='primary' onClick={() => handleFilter("year")} style={{ height: 30 }}><Typography className={ classes.textProfile }>AÑO ACTUAL</Typography></Button>
                                    </Grid>
                                    <Grid item xs={1}>
                                    <Button size="small" variant="contained" fullWidth color='primary' onClick={handleExport} style={{ height: 30 }}><Typography className={ classes.textProfile }>EXPORTAR</Typography></Button>
                                    </Grid>
                                </Grid>
                                <CardContent style={{ height: 200 }}>
                                    <Controls.ChartViews data={dataCharts.data.views} dateStart={dateStart} dateEnd={dateEnd} btnSearch={dataCharts.btnSearch} title="VISITA, CLICKS POR FECHA"/>
                                </CardContent>
                            </Grid>
                            <Grid item lg={2} sm={12}  style={{ marginTop: '10px', padding: 10}}>
                                <Card className={classes.root} style={{ marginTop: 20}}>
                                    <CardContent>
                                        <Typography component="p" variant='caption' align='center'>TU ACTIVIDAD LOS ULTIMOS 7 DIAS A.....</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item lg={1} sm={12}  style={{ marginTop: '10px', padding: 10}}>
                                
                            </Grid>
                            <Grid item lg={3} sm={12}  style={{ marginTop: '10px', padding: 10}}>
                                <CardContent style={{ width: 500, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Controls.ChartDoughnut data={dataCharts.data.origin}  title="VISITA POR ORIGEN"/>
                                </CardContent>
                            </Grid>
                            <Grid item lg={1} sm={12}  style={{ marginTop: '10px', padding: 10}}>
                                
                            </Grid>
                            <Grid item lg={3} sm={12}  style={{ marginTop: '10px', padding: 10, borderWidth: 2, borderColor: '#FF3D00' }}>
                                <CardContent style={{ width: 500, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Controls.ChartDoughnut data={dataCharts.data.country} title="VISITA POR PAIS"/>
                                </CardContent>
                            </Grid>
                        </Grid> 
                    </Box>
                </Paper>
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Grid container style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className={ classes.paperModal }>
                    <Grid item xs={12} lg={12} className={ classes.input } style={{ borderBottom: '1px solid #EEEEEE', paddingTop: '10px'}}>
                        <Typography component="p">PERIODO DE PRUEBA</Typography>
                    </Grid>
                    <Grid item xs={12} lg={12} className={[ classes.input, classes.textCenter ]} style={{ paddingTop: '10px'}}>
                        <Typography component="p">COMPRA UN PLAN AHORA !! </Typography>
                    </Grid>
                    <Grid item xs={3} lg={3}></Grid>
                    <Grid item xs={12} lg={6} className={[ classes.input, classes.textCenter ]} style={{ paddingTop: '10px'}}>
                        <Button size="small" variant="contained" fullWidth color='primary' onClick={handleGoPlan}><FontAwesomeIcon icon={faShoppingCart} /> <Typography className={ classes.textProfile }>COMPRAR PLAN</Typography></Button>
                    </Grid>
                </Grid>
            </Modal>
            {/* FORMATO EXPORTAR DASH */}
            <div id="print" style={{ zIndex: -1, position: 'absolute', top: 20, visibility: 'hidden'}}>
                <div style={{ width: '570px', height: '60px', flexWrap: 'wrap', flexDirection: 'row', display: 'flex' }}>
                    <div style={{ width: '40%', marginTop: '20px' }}>
                        <Controls.Select
                            value={state.miWhats?.id ?? 0}
                            name="miwhats"
                            label="MiWhats"
                            size="small"
                            options={(state?.user?.miWhats ?? [])}
                        />
                    </div>
                </div>
                <div style={{ width: '570px', height: '60px', flexWrap: 'wrap', flexDirection: 'row', display: 'flex' }}>
                    <div style={{ width: '32%', display: 'flex', marginTop: '20px', height: '50px', border: '1px solid #C7C8D3' }}>
                        <div style={{ width: '40px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}><FontAwesomeIcon icon={faChartBar} size='1x'/></div>
                        <div style={{ width: '60px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}>{click}</div>
                        <div style={{ width: '100px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}>TOTAL CLICKS</div>
                    </div>
                    <div style={{ width: '33%', display: 'flex', marginTop: '20px', height: '50px', border: '1px solid #C7C8D3', marginInline: '1%' }}>
                        <div style={{ width: '40px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}><FontAwesomeIcon icon={faEye} size='1x'/></div>
                        <div style={{ width: '60px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}>{view}</div>
                        <div style={{ width: '100px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}>TOTAL VISITAS</div>
                    </div>
                    <div style={{ width: '32%', display: 'flex', marginTop: '20px', height: '50px', border: '1px solid #C7C8D3' }}>
                        <div style={{ width: '40px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}><FontAwesomeIcon icon={faChartPie} size='1x'/></div>
                        <div style={{ width: '60px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}>{(view > 0) ? ((click*100)/view).toFixed(0) : 0} %</div>
                        <div style={{ width: '100px', fontSize: 10, textAlign: 'center', paddingTop: '15px' }}>INTERACCÓN</div>
                    </div>
                </div>
                <div style={{ width: '570px', height: '320px', marginTop: '20px' }}>
                    <Controls.ChartViews data={dataCharts.data.views} dateStart={dateStart} dateEnd={dateEnd} btnSearch={dataCharts.btnSearch} title="VISITA, CLICKS POR FECHA" h={50} print={true} />
                </div>
                <div style={{ width: '570px', height: '300px', flexWrap: 'wrap', flexDirection: 'row', display: 'flex' }}>
                    <div style={{ width: '50%', display: 'flex', marginTop: '10px' }}>
                        <Controls.ChartDoughnut data={dataCharts.data.origin}  title="VISITA POR ORIGEN" print={true}/>
                    </div>
                    <div style={{ width: '50%', display: 'flex', marginTop: '10px' }}>
                        <Controls.ChartDoughnut data={dataCharts.data.country} title="VISITA POR PAIS" print={true}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;