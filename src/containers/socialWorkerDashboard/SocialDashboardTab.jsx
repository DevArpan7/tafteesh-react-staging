import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import SocialWorkerVC from './SocialWorkerVC';
import SocialWorkerRehab from './SocialWorkerRehab';
import SocialWorkerPC from './SocialWorkerPC';

const SocialDashboardTab = (props) => {
    console.log(props, "props");
    const {loader, countData, pcArray, vcArray } = props;
    const [showVcArray, setShowVcArray] = useState([]);
    const [showPcArray, setShowPcArray] = useState([]);


    console.log(showVcArray,"showVcArray");
    const showVcArr = () => {
        setShowVcArray(vcArray && vcArray)
    }

    const showPcArr = () => {
        setShowPcArray(pcArray && pcArray)
    }


    useEffect(()=>{
        setShowVcArray(vcArray && vcArray)
    },[vcArray])


    return (
        <>
            <Tabs>
                <TabList className="row">
                    <Tab onClick={() => showVcArr()} className="col-md-4 socialworker_tab_menu">
                        <div className="totla_profile_box white_box_shadow">
                            <div className="totla_profile_box_top">
                                <span>{countData && countData.totalcountvc && countData.totalcountvc}</span>
                                <h3>Victim Compensation </h3>
                            </div>
                            <div className="totla_profile_box_bottom">
                                <ul>
                                    <li>At SA  <span>{countData && countData.totalcountvcsa && countData.totalcountvcsa}</span></li>
                                    <li>At DA  <span>{countData && countData.totalcountvcda && countData.totalcountvcda}</span></li>
                                </ul>
                            </div>
                        </div>
                    </Tab>
                    <Tab onClick={() => showPcArr()} className="col-md-4 socialworker_tab_menu">
                        <div className="totla_profile_box white_box_shadow">
                            <div className="totla_profile_box_top">
                                <span>{countData && countData.totalcountpc && countData.totalcountpc}</span>
                                <h3>Procedural Correction </h3>
                            </div>
                            <div className="totla_profile_box_bottom">
                                <ul>
                                    <li>At SA  <span>{countData && countData.totalcountpcsa && countData.totalcountpcsa}</span></li>
                                    <li>At DA  <span>{countData && countData.totalcountpcda && countData.totalcountpcda}</span></li>
                                </ul>
                            </div>
                        </div>
                    </Tab>
                    {/* <Tab className="col-md-4 socialworker_tab_menu">
                    <div className="totla_profile_box white_box_shadow">
                            <div className="totla_profile_box_top">
                                <span>200</span>
                                <h3>Rehabilitation </h3>
                            </div>
                            <div className="totla_profile_box_bottom">
                            <ul>
                                <li>At source  <span>98</span></li>
                                <li>At Destination  <span>100</span></li>
                            </ul>
                        </div>
                    </div>
                </Tab> */}
                </TabList>

                <TabPanel>
                    <SocialWorkerVC {...props}  loader={loader} showVcArray={showVcArray} />
                </TabPanel>
                <TabPanel>
                    <SocialWorkerPC {...props}  loader={loader} showPcArray={showPcArray} />
                </TabPanel>
                <TabPanel>
                    <SocialWorkerRehab />
                </TabPanel>
            </Tabs>
        </>
    )
}

export default SocialDashboardTab