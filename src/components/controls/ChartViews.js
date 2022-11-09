import React, { useEffect, useState } from 'react'
import { TextField, InputAdornment } from '@material-ui/core';
import { Line, Bar } from 'react-chartjs-3';
import UserDashboardService from '../../application/services/user.dashboard.service'
import _ from "lodash";
import moment from 'moment'
import Global from '../../application/services/global.service'

let Data = {};
export default function ChartViews(props) {
    const { data, dateStart, dateEnd, btnSearch, title="", h=25, print=false } = props;
    const [dataChart, setDataChart] = useState([])
    useEffect(() => {
        const check = async() => {
            // let res = await UserDashboardService.getViews(idMiwhats);
            // if (res.success) {
                
                let startDate = new Date(dateStart);
                let endDate = new Date(dateEnd);
                if(btnSearch == "week"){
                    startDate = new Date(moment().startOf('week').isoWeekday(1).format('YYYY-MM-DD'))
                    endDate = new Date(moment().format('YYYY-MM-DD'))
                }
                if(btnSearch == "month"){
                    startDate = new Date(moment().startOf('month').format('YYYY-MM-DD'))
                    endDate = new Date(moment().endOf('month').format('YYYY-MM-DD'))
                }
                if(btnSearch == "year"){
                    startDate = new Date(moment().startOf('year').format('YYYY-MM-DD'))
                    endDate = new Date(moment().endOf('year').format('YYYY-MM-DD'))
                }
                startDate.setDate(startDate.getDate() + 1);
                endDate.setDate(endDate.getDate() + 1);
                let arrDates = [];
                if(btnSearch == 'year'){
                    arrDates = getMonthsArray(startDate, endDate)
                }
                else
                {
                    arrDates = getDaysArray(startDate, endDate)
                }

                let arrType = _.uniq(_.map(data, 'type'));
                let datasets = []
                let color = 0;
                _.forEach(arrType, (item) => {
                    let arrButton = _.filter(data, (i) => { return i.type === item});
                    const clicks = _(arrDates).keyBy('date').merge(_.keyBy(arrButton, 'date')).values().value();
                    _.forEach(clicks, (item) => {
                        if(!item.view || item.view == null){
                            item.view = 0;
                        }
                    })
                    datasets.push({
                        label: item,
                        data: _.map(clicks, 'view'),
                        //fill: false,
                        backgroundColor: Global.getColor(color),
                        tension: 0.1
                    })
                    color++;
                })
                
                Data = {
                    labels: _.map(arrDates, 'date'),
                    datasets: datasets
                }
                setDataChart(Data);
            //}
        }
        check();
    }, [data]);
  
    var getDaysArray = function(start, end) {
        for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
            arr.push({ date: formatDate(dt)});
        }
        return arr;
    };

    var getMonthsArray = function(start, end) {
        for(var arr=[],dt=new Date(start); dt<=end; dt.setMonth(dt.getMonth()+1)){
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
    
        if(btnSearch == 'year'){
            return [month, year].join('-');
        }
        else
        {
            return [day, month, year].join('-');
        }
    }

    const options = {
        title: {
            display: true,
            text: title,
            fontSize: (print ? 8 : 12)
        },
        legend: {
            labels: {
                fontSize: (print ? 8 : 12)
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontSize: (print ? 8 : 12)
                }
            }],
            xAxes: [{
                ticks: {
                    fontSize: (print ? 8 : 12)
                }
            }]
        }
    };

    return (
        <Bar data={dataChart} width={100} height={h} options={options}/>
    )
}