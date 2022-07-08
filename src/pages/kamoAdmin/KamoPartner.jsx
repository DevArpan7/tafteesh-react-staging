import React, { useState, useEffect } from 'react';
import KamoChart from './KamoBarChart';
import KamoPieChart from './KamoPieChart';
import { useDispatch, useSelector } from "react-redux";


const KamoPartner = (props) => {
    const stateDashboardData = useSelector((state) => state.stateDashboardData);



    return (
        <>
            <div className="row mb-4">
                <div className="col-lg-8">
                    <div className="white_box_shadow_20">
                        <KamoChart />
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="white_box_shadow_20">
                        <KamoPieChart />
                    </div>
                </div>
            </div>
            <div className="white_box_shadow_20 survivors_table_wrap survivors_table_wrap_gap position-relative">
                <table className="table table-borderless mb-0">
                    <thead>
                        <tr>
                            <th width="40%">State</th>
                            <th width="20%">No Of Survivor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stateDashboardData && stateDashboardData.length > 0 && stateDashboardData.map((item) => {
                            return (
                                <tr>
                                    <td>{item && item.stateDetail && item.stateDetail.length>0  ? item.stateDetail[0].name : "NA"}</td>
                                    <td>{item && item.count}</td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
            </div>
        </>
    )
}

export default KamoPartner