import React, { useEffect, useState } from 'react';
import feedbackProfile from "../../assets/img/feedbackProfile.png";
import moment from 'moment';
import { NavLink, useHistory } from "react-router-dom";

const SocialWorkerPC = (props) => {
    const { showPcArray ,loader} = props;
    console.log(props, showPcArray, "showPcArray");
    const history = useHistory();

    const goToView=(survivorId)=>{
        console.log(survivorId,"survivorId")
        props.history.push({ pathname: "/profile-details", state: survivorId })
    }


    return (
        <>
            <div className="row">
                <div className="col-lg-8">
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

                                        loader && loader=== true ?
                                            <tr>
                                                <td colSpan={8} className='text-center'>
                                                    <div class="spinner-border bigSpinner text-info"></div>
                                                </td>
                                            </tr>
                                            :
                                        showPcArray && showPcArray.length > 0 ? showPcArray.map((data) => {
                                            return (
                                                <tr>
                                                    <td>{data.survivor && data.survivor.survivor_id && data.survivor.survivor_id}</td>
                                                    <td>{data.survivor && data.survivor.survivor_name && data.survivor.survivor_name}</td>
                                                    <td>{data.updatedAt && moment(data.updatedAt).format("DD-MMM-YYYY")}</td>
                                                    <td width="12%"><a onClick={()=> goToView(data.survivor.survivor_id)}>View Details</a></td>
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

                <div className="col-lg-4">
                    <div className="tafteesh_feedback_box white_box_shadow_20">
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
        </>
    )
}

export default SocialWorkerPC