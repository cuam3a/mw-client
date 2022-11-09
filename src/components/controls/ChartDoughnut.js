import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-3';
import _ from "lodash";
import Global from '../../application/services/global.service'

let Data = {};
export default function ChartDoughnut(props) {
    const { data, title="", print=false } = props;
    const [dataChart, setDataChart] = useState([])
    useEffect(() => {
        const check = async() => {
           
                let labels = [];
                let count = [];
                let backgroundColor = [];
                let borderColor = [];
                let color = 0;
                _.forEach(data, (item) => {
                    labels.push(item.label)
                    count.push(item.view)
                    backgroundColor.push(Global.getColor(color))
                    borderColor.push(Global.getColor(color))
                    color++;
                })
                Data = {
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
            display: true,
            position: "bottom",
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