import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useDispatch, useSelector } from "react-redux";
// import { CountertopsSharp } from '@mui/icons-material';


const KamoChart = (props) => {
    const monthDashboardData = useSelector((state) => state.monthDashboardData);
    const [monthArr, setMonthArr] = useState([]);
    const [countArr, setCountArr] = useState([]);

    const [basicData, setBasicData] = useState({
        labels: [],
        datasets: [
            {
                label: '',
                backgroundColor: '#42A5F5',
                data: []
            }
        ]
    });


    useEffect(() => {
        let tempmonthArr = []
        let tempcountArr = []
        monthDashboardData && monthDashboardData.length > 0 && monthDashboardData.map((item) => {
            return (
                tempmonthArr.push(item.month),
                tempcountArr.push(item.count),
                console.log(tempcountArr, tempmonthArr, "arr")

            ),
                setMonthArr(tempmonthArr),
                setCountArr(tempcountArr)
        })

    }, [monthDashboardData])

    useEffect(() => {
        setBasicData({ labels: monthArr && monthArr.length > 0 && monthArr.map( e => e.toUpperCase() ), datasets: [{  label: 'No. Of Survivor',
        backgroundColor: '#42A5F5',data: countArr && countArr.length > 0 && countArr }] })

    }, [monthArr, countArr])

    console.log(basicData, "basice")
    const getLightTheme = () => {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        return {
            basicOptions
        }
    }

    const { basicOptions } = getLightTheme();

    return (
        <Chart type="bar" data={basicData} options={basicOptions} />
    )
}
export default KamoChart