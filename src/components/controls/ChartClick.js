import React, { useEffect, useState } from 'react'
import { TextField, CircularProgress } from '@material-ui/core';
import { Line, Bar } from 'react-chartjs-3';
import UserDashboardService from '../../application/services/user.dashboard.service'
import _ from "lodash";

let Data = {};
let Options = {
    maintainAspectRatio: false,
    layout: {
        padding: {
            left: 10,
            right: 20,
            top: 5,
            bottom: 10
        }
    },
    scales: {
        xAxes: [{
            gridLines: {
                color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
                display: false
            }
        }],
        yAxes: [{
            gridLines: {
                color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
                display: false
            }   
        }]
    },
    legend: {
        display: false
    },
    tooltips: {
        displayColors: false
    }
}
export default function ChartClick(props) {
    const { idMiwhats, data } = props;
    const [views, setViews] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const check = async() => {
            let res = await UserDashboardService.getClicks(idMiwhats);
            if (res.success) {
                let lastDate = new Date();
                lastDate.setDate(lastDate.getDate() - 20);
                let arrDates = getDaysArray(lastDate, new Date())
                let arrType = _.uniq(_.map(data, 'name'));
                let datasets = []
                _.forEach(arrType, (item) => {
                    let arrButton = _.filter(data, (i) => { return i.name === item});
                    const clicks = _(arrDates).keyBy('date').merge(_.keyBy(arrButton, 'date')).values().value();
                    _.forEach(clicks, (item) => {
                        if(!item.view){
                            item.view = 0;
                        }
                    })
                    datasets.push({
                        label: item,
                        data: _.map(clicks, 'view')
                    })
                })
                Data = {
                    labels: _.map(arrDates, 'date'),
                    datasets: datasets
                }
                setViews(data ?? []);
                setIsLoading(false)
            }
            else{
                setIsLoading(false)
            }
        }
        check();
    }, [data]);
  
    var getDaysArray = function(start, end) {
        for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
            arr.push({ date: formatDate(dt)});
        }
        return arr;
    };

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
    }

    return (
        <>
        {
            (isLoading)
            ?
            <CircularProgress />
            :
            <Line data={Data} width={90} height={80} />
        }
        </>
        // <Line
        //     data={Data}
        //     options={Options}
        // />
    )
}