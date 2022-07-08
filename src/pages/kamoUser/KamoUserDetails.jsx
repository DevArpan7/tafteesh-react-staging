import React, { useEffect, useState } from 'react';
import { KamoTopbar } from '../../components';
import user from '../../assets/img/user.jpg';
import axios from 'axios';
import queryString from "query-string";
// import "./survivorprofiledetails.css";
// import { Link } from "react-router-dom";

const KamoUserDetails = (props) => {
    console.log(props, "dfdff");
    let url = props.location.search;
    let getId = queryString.parse(url, { parseNumbers: true });
    let userId = getId ? getId.id : "";
    console.log(getId,"getId");


    const [userData, setUserDetail] = useState({});
    const api = "https://kamo-api.herokuapp.com/api";
    const token = localStorage.getItem("accessToken");
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    };
    /**
     * Api call for user detail
     */
    useEffect(()=>{
        getUserDetails();
    }, [userId]);
    const getUserDetails = (id) => {
        console.log("User id", id);
        axios
        .get(api + "/user/detail/"+ userId, axiosConfig)
            .then((response) => {
              console.log("user detail response", response);
              if (response.data && response.data.error === false) {
                const { data } = response;
                setUserDetail(data.data);
              }
            })
            .catch((error) => {
              console.log(error, "user details error");
            });
    };

    return (
        <>
            <KamoTopbar />
            <main className="main_body">
                <div className="bodyright">
                    <div className="row justify-content-between mb30">
                        <div className="col-auto">
                            <h2 className="page_title mb-md-0">Profile Details of {userData && userData.fname} ({userData && userData.username})</h2>
                        </div>
                        <div className="col-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb topbreadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/dashboard">Dashboard</a>
                                    </li>
                                    <li className="breadcrumb-item"><a href="/user-list">Users</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Profile Details</li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="white_box_shadow_20 single_profile_box mb30">
                        <div className="single_profile_box_top">
                            <div className="single_profile_box_top_left">
                                <img src={userData && userData.image? userData.image: user} alt="" />
                            </div>
                            <div className="single_profile_box_top_right">
                                <h3>{userData && userData.fname} {userData && userData.lname}</h3> <h5>({userData && userData.is_verified ? 'Verified' : 'Not Verified'})</h5>
                                <ul>
                                    <li>
                                        <strong>Username:</strong>{userData && userData.username}
                                    </li>
                                    <li>
                                        <strong>Organization:</strong>{userData && userData.organization && userData.organization.name}
                                    </li>
                                    <li>
                                        <strong>Phone No:</strong>{userData && userData.mobile}
                                    </li>                                
                                    <li>
                                        <strong>Email:</strong>{userData && userData.email}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="single_profile_box_bottom">
                            <div className="row justify-content-end align-items-end">
                                {/* <div className="col-auto">
                                    <div className='fileupload_button'>
                                        <label>Consent Form</label>
                                        <div className='fileupload_buttoninner'>
                                            <input type="file" />
                                            <span>Upload file</span>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-auto">
                                    {/* <button className='btn addbtn shadow-0'>Download</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="single_profile_basic_details mb30">
                        <h2 className="white_box_title">Details</h2>
                        <div className="white_box_shadow">
                            <div className="survivor_card_bar">
                                <ul>
                                    <li>
                                        <h6 className="mb-2">Role</h6>
                                        <h5 className="mb-0">{userData && userData.role && userData.role.name}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Gender</h6>
                                        <h5 className="mb-0">{userData && userData.gender}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">State</h6>
                                        <h5 className="mb-0">{userData && userData.state && userData.state.name}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">District</h6>
                                        <h5 className="mb-0">{userData && userData.district && userData.district.name}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Block</h6>
                                        <h5 className="mb-0">{userData && userData.block && userData.block.name}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Pin</h6>
                                        <h5 className="mb-0">{userData && userData.pin}</h5>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </main>
        </>
    )
}

export default KamoUserDetails