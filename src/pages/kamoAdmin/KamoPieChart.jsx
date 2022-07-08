import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Chart } from 'primereact/chart';

const KamoPieChart = () => {

    const ageDashboardData = useSelector((state) => state.ageDashboardData);
    const [ageArr, setMonthArr] = useState([]);
    const [countArr, setCountArr] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],

                backgroundColor: [
                    "#42A5F5",
                    "#66BB6A",
                    "#FFA726"
                ],
                hoverBackgroundColor: [
                    "#64B5F6",
                    "#81C784",
                    "#FFB74D"
                ]
            }
        ]
    });


    useEffect(() => {
        let tempmonthArr = []
        let tempcountArr = []
        ageDashboardData && ageDashboardData.length > 0 && ageDashboardData.map((item) => {
            return (
                tempmonthArr.push(item && item.age),
                tempcountArr.push(item && item.count),
                console.log(tempcountArr, tempmonthArr, "arr")

            ),
                setMonthArr(tempmonthArr),
                setCountArr(tempcountArr)
        })

    }, [ageDashboardData])

    console.log(ageArr, countArr, "arr");
    useEffect(() => {
        setChartData({
            labels: ageArr && ageArr.length > 0 && ageArr, datasets: [{
                data: countArr && countArr.length > 0 && countArr, backgroundColor: [
                    "#42A5F5",
                    "#66BB6A",
                    "#FFA726",
                    "#eb81a2"
                ],
                hoverBackgroundColor: [
                    "#64B5F6",
                    "#81C784",
                    "#FFB74D",
                    "#eb81a2"
                ]
            }]
        })
    }, [ageArr, countArr])



    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    });

    return (
        <Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative', width: '100%' }} />
    )
}

export default KamoPieChart