import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Modal, Button, Card, CardContent, CircularProgress } from '@material-ui/core'
import useStyles from "../../../application/theme/styles";
import Controls from "../../controls";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import Service from '../../../application/services/admin.dashboard.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Doughnut, Bar, Line } from 'react-chartjs-3';
import Global from '../../../application/services/global.service';
import _ from 'lodash';
import moment from 'moment'

const ChartDoughnut = (props) => {
    const { data, title = "", print = false, labels = true } = props;
    const [dataChart, setDataChart] = useState([])
    useEffect(() => {
        const check = async () => {

            let labels = [];
            let count = [];
            let backgroundColor = [];
            let borderColor = [];
            let color = 0;
            _.forEach(data, (item) => {
                labels.push(item.label)
                count.push(item.value)
                backgroundColor.push(Global.getColor(color))
                borderColor.push(Global.getColor(color))
                color++;
            })
            let Data = {
                labels: labels,
                datasets: [
                    {
                        data: count,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor
                    }
                ]
            }
            setDataChart(Data);
        }
        check();
    }, [data]);

    const options = {
        legend: {
            display: labels,
            position: "right",
            labels: {
                fontSize: (print ? 8 : 12)
            }
        },
        title: {
            display: true,
            text: title,
            fontSize: (print ? 8 : 12)
        }
    };

    return (
        <Doughnut options={options} data={dataChart} />
    )
}

const ChartBars = (props) => {
    const { data, title = "", print = false } = props;
    const [dataChart, setDataChart] = useState([])
    useEffect(() => {
        const check = async () => {
            let Data = {
                labels: data.labels,
                datasets: data.datasets
            }
            setDataChart(Data);
        }
        check();
    }, [data]);

    const options = {
        legend: {
            display: true,
            position: "top",
            labels: {
                fontSize: (print ? 8 : 12)
            }
        },
        title: {
            display: true,
            text: title,
            fontSize: (print ? 8 : 12)
        },
        scales: {
            x: {
                ticks: {
                    stepSize: 5
                }
            },
            yAxes: [{
                stacked: true,
                ticks: {
                    beginAtZero: true,
                },
                type: 'linear',
            }],
            xAxes: [{
                stacked: true,
                gridLines: {
                    display: false,
                }
            }],

        }
    };

    return (
        <Bar options={options} data={dataChart} />
    )
}

const ChartLine = (props) => {
    const { data, title = "", print = false } = props;
    const [dataChart, setDataChart] = useState([])
    useEffect(() => {
        const check = async () => {
            let Data = {
                labels: data.labels,
                datasets: data.datasets
            }
            setDataChart(Data);
        }
        check();
    }, [data]);

    const options = {
        legend: {
            display: true,
            position: "top",
            labels: {
                fontSize: (print ? 8 : 12)
            }
        },
        title: {
            display: true,
            text: title,
            fontSize: (print ? 8 : 12)
        },
    };

    return (
        <Line options={options} data={dataChart} />
    )
}

const Dashboard = () => {
    var classes = useStyles();
    let history = useHistory();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(true);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

    useEffect(() => {
        check();
    }, [])

    const check = async () => {
        let res = await Service.getAdminDashboard(date);
        if (res.success) {
            setData(res.data);
            setLoading(false);
        }
    }

    const handleFilter = () => {
        setLoading(true);
        check();
    }

    return (
        <div style={{ marginTop: "30px" }}>
            {
                (loading)
                    ?
                    <Paper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: '30px' }}>
                        <CircularProgress />
                    </Paper>
                    :
                    <Paper className={classes.paperView}>
                        <Box style={{ flexGrow: 1 }}>
                            <Grid container>
                                <Grid item lg={12} sm={12} style={{ marginTop: '10px', padding: 10 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={2}>
                                            <Controls.Input
                                                name=""
                                                label="Fecha"
                                                type="date"
                                                size="small"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button size="small" variant="contained" fullWidth color='primary' onClick={handleFilter} style={{ height: 30 }}><FontAwesomeIcon icon={faSearch} /> <Typography className={classes.textProfile}></Typography></Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={2} style={{ justifyContent: 'center', flexWrap: 'wrap', display: 'flex', width: '100%' }}>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '90%' }}>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center' style={{ fontWeight: 'bold' }}>{data.userTotal}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center'>CUENTAS TOTALES</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '90%' }}>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center' style={{ fontWeight: 'bold' }}>{data.userTrial}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center'>CUENTAS GRATUITAS</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={4} style={{ justifyContent: 'center', flexWrap: 'wrap', display: 'flex', width: '100%' }}>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '98%' }}>
                                        <CardContent>
                                            <ChartDoughnut data={Global.getArrayChartDoughnut(data.plans, "name", "total")} title="Ingresos mes cuentas premium" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={4} style={{ justifyContent: 'center', flexWrap: 'wrap', display: 'flex', width: '100%' }}>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '98%' }}>
                                        <CardContent>
                                            <ChartDoughnut data={Global.getArrayChartDoughnut(data.plans, "name", "count")} title="Cuentas activas por plan" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={2} style={{ justifyContent: 'center', flexWrap: 'wrap', display: 'flex', width: '100%' }}>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '90%' }}>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center' style={{ fontWeight: 'bold' }}>{data.newUserPorcent} %</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center'>CRECIMIENTO EN CUENTAS VS MES ANTERIOR</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '90%' }}>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center' style={{ fontWeight: 'bold' }}>{data.newUser}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center'>CUENTAS NUEVAS</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={2} style={{ justifyContent: 'center', flexWrap: 'wrap', display: 'flex', width: '100%' }}>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '90%' }}>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center' style={{ fontWeight: 'bold' }}>{data.userPremium}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center'>CUENTAS PREMIUM</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '90%' }}>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center' style={{ fontWeight: 'bold' }}>{data.userPremiumPorcent} %</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography component="p" variant='caption' align='center'>CUENTAS PREMIUM</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={4} style={{ justifyContent: 'center', flexWrap: 'wrap', display: 'flex', width: '100%' }}>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '98%', height: '300px' }}>
                                        <CardContent>
                                            <ChartBars data={data.premiumUsers} title="Cuentas premium" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={4} style={{ justifyContent: 'center', flexWrap: 'wrap', display: 'flex', width: '100%' }}>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '98%', height: '300px' }}>
                                        <CardContent>
                                            <ChartLine data={data.monthUsers} title="Nuevos usuarios por mes" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={2} style={{ justifyContent: 'center', flexWrap: 'wrap', display: 'flex', width: '100%' }}>
                                    <Card className={classes.root} style={{ marginBlock: 10, width: '98%', height: '300px' }}>
                                        <CardContent>
                                            <ChartDoughnut data={Global.getArrayChartDoughnut(data.usersGoals, "name", "total")} title="Meta mensual de usuarios" labels={false} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
            }
        </div>
    )
}

export default Dashboard;