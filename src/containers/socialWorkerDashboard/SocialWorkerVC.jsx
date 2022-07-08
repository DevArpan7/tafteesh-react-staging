import React, { useEffect, useState } from 'react';
import feedbackProfile from "../../assets/img/feedbackProfile.png";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import { NavLink, useHistory } from "react-router-dom";
import {findAncestor,gotoSurvivorDetails} from "../../utils/helper";



const SocialWorkerVC = (props) => {
    const { showVcArray ,loader} = props;
    console.log(props, showVcArray, "showVcArray");
    const history = useHistory();

const goToView=(e,survivorId)=>{
    console.log(survivorId,"survivorId")
    gotoSurvivorDetails(e,survivorId,history)
    // props.history.push({ pathname: "/profile-details", state: survivorId })
}



    return (
        <>
            <div className="row">
                <div className="col-lg-7 col-xl-8">
                    <div className="survivor_list_box survivors_table_wrap white_box_shadow_20 mb30">
                        <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th>Survivor ID</th>
                                        <th>Survivor name</th>
                                        <th colSpan="2">Last update Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        loader && loader === true ?
                                            <tr>
                                                <td colSpan={8} className='text-center'>
                                                    <div class="spinner-border bigSpinner text-info"></div>
                                                </td>
                                            </tr>
                                            :
                                            showVcArray && showVcArray.length > 0 ? showVcArray.map((data) => {
                                                return (
                                                    <tr>
                                                        <td>{data.survivor && data.survivor.survivor_id && data.survivor.survivor_id}</td>
                                                        <td>{data.survivor && data.survivor.survivor_name && data.survivor.survivor_name}</td>
                                                        <td>{data.updatedAt && moment(data.updatedAt).format("DD-MMM-YYYY")}</td>
                                                        <td width="12%"><a onClick={(e)=> goToView(e,data.survivor && data.survivor._id)}>View Details</a></td>
                                                    </tr>
                                                )
                                            }) :
                                                <tr>
                                                    <td className="text-center" colSpan={4}>
                                                        <b>NO Data Found !!</b>
                                                    </td>
                                                </tr>
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5 col-xl-4">
                    <div className="tafteesh_feedback_box white_box_shadow_20 mb30">
                        <h3>Feedback from Tafteesh</h3>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <   p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="vc_case_history mb30">
                <h3 className="white_box_title">Case History: (VC)</h3>
                <div className="white_box_shadow_20">
                    <b>Dynamic Graph</b><br /><br />
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis praesentium impedit modi earum atque eos unde, nisi accusamus doloribus ipsa distinctio nobis a voluptas facere excepturi autem ullam esse harum!
                </div>
            </div>
            <div className="vc_case_history">
                <h3 className="white_box_title">Synopsis </h3>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="white_box_shadow_20 mb30">
                            <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th>Name of District/state</th>
                                        <th className="text-end">Number of Case</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Alipurduar</td>
                                        <td className="text-end">10</td>
                                    </tr>
                                    <tr>
                                        <td>Bankura</td>
                                        <td className="text-end">22</td>
                                    </tr>
                                    <tr>
                                        <td>Hooghly</td>
                                        <td className="text-end">5</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="white_box_shadow_20 mb30">
                            <b>Dynamic Graph</b><br /><br />
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis praesentium impedit modi earum atque eos unde, nisi accusamus doloribus ipsa distinctio nobis a voluptas facere excepturi autem ullam esse harum!
                        </div>
                    </div>
                </div>
            </div>
            <div className="vc_summary">
                <Tabs>
                    <TabList className="vc_summary_tab_menu">
                        <Tab>
                            SA
                        </Tab>
                        <Tab>
                            DA
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <div className="white_box_shadow_20 vc_summary_tab_text">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td>VC applied</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC order received</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC lowest awarded amount</td>
                                        <td>18,00,00</td>
                                    </tr>
                                    <tr>
                                        <td>VC highest awarded amount</td>
                                        <td>3,000,00</td>
                                    </tr>
                                    <tr>
                                        <td>VC average awarded amount</td>
                                        <td>18,00,00</td>
                                    </tr>
                                    <tr>
                                        <td>VC appealed</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC appeal concluded</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC appeal result</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC concluded</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC money received in bank account</td>
                                        <td>18,00,00</td>
                                    </tr>
                                    <tr>
                                        <td>Time spent btw application and conclusion</td>
                                        <td>6 Month</td>
                                    </tr>
                                    <tr>
                                        <td>Time spent btw application and received in bank</td>
                                        <td>6 Month</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="white_box_shadow_20 vc_summary_tab_text">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td>VC applied</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC order received</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC lowest awarded amount</td>
                                        <td>18,00,00</td>
                                    </tr>
                                    <tr>
                                        <td>VC highest awarded amount</td>
                                        <td>3,000,00</td>
                                    </tr>
                                    <tr>
                                        <td>VC average awarded amount</td>
                                        <td>18,00,00</td>
                                    </tr>
                                    <tr>
                                        <td>VC appealed</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC appeal concluded</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC appeal result</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC concluded</td>
                                        <td>18</td>
                                    </tr>
                                    <tr>
                                        <td>VC money received in bank account</td>
                                        <td>18,00,00</td>
                                    </tr>
                                    <tr>
                                        <td>Time spent btw application and conclusion</td>
                                        <td>6 Month</td>
                                    </tr>
                                    <tr>
                                        <td>Time spent btw application and received in bank</td>
                                        <td>6 Month</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </>
    )
}

export default SocialWorkerVC