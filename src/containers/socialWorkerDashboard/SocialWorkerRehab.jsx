import React from 'react';
import feedbackProfile from "../../assets/img/feedbackProfile.png";

const SocialWorkerRehab = () => {
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
                                <tr>
                                    <td>BJ-003</td>
                                    <td>Regina Khatoon</td>
                                    <td>Feb 4 2022</td>
                                    <td width="12%"><a href="/#">View</a></td>
                                </tr>
                                <tr>
                                    <td>BJ-003</td>
                                    <td>Regina Khatoon</td>
                                    <td>Feb 4 2022</td>
                                    <td width="12%"><a href="/#">View</a></td>
                                </tr>
                                <tr>
                                    <td>BJ-003</td>
                                    <td>Regina Khatoon</td>
                                    <td>Feb 4 2022</td>
                                    <td width="12%"><a href="/#">View</a></td>
                                </tr>
                                <tr>
                                    <td>BJ-003</td>
                                    <td>Regina Khatoon</td>
                                    <td>Feb 4 2022</td>
                                    <td width="12%"><a href="/#">View</a></td>
                                </tr>
                                <tr>
                                    <td>BJ-003</td>
                                    <td>Regina Khatoon</td>
                                    <td>Feb 4 2022</td>
                                    <td width="12%"><a href="/#">View</a></td>
                                </tr>
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

export default SocialWorkerRehab