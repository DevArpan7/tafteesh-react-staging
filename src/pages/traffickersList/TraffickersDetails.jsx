import React,{useState,useEffect} from 'react';
import { KamoTopbar } from '../../components';
import istockphoto from '../../assets/img/istockphoto.jpg';
import "./traffickersdetails.css";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

const TraffickersDetails = (props) => {

    const dispatch = useDispatch();
    let url = props.location.search;
    let getId = queryString.parse(url, { parseNumbers: true });
    console.log(getId,"getId")
    const [traffickerData, setTraffickerDetail] = useState({});
    const api = "https://tafteesh-staging-node.herokuapp.com/api";
    const token = localStorage.getItem("accessToken");
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    };
    useEffect(()=>{
        getUserDetails(getId.id);
    }, [getId.id]);
    const getUserDetails = (id) => {
        console.log("User id", id);
        axios
        .get(api + "/trafficker-profile/detail/"+ id, axiosConfig)
            .then((response) => {
              console.log("user detail response", response);
              if (response.data && response.data.error === false) {
                const { data } = response;
                setTraffickerDetail(data.data);
              }
            })
            .catch((error) => {
              console.log(error, "user details error");
            });
    };
console.log(traffickerData,"traffickerData");

  return (
    <>
        <KamoTopbar />
        <main className="main_body">
            <div className="bodyright">
                <div className="row justify-content-between mb30">
                    <div className="col-auto">
                        <h2 className="page_title mb-md-0">Profile Details of {traffickerData && traffickerData.trafficker_name}</h2>
                    </div>
                    <div className="col-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb topbreadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item"><a href="/traffickers-list">Traffickers</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Profile Details</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="white_box_shadow_20 single_profile_box mb30">
                    <div className="single_profile_box_top">
                        <div className="single_profile_box_top_left">
                            <img src={traffickerData && traffickerData.image ? traffickerData.image :istockphoto} alt="" />
                        </div>
                        <div className="single_profile_box_top_right">
                            <h3>{traffickerData && traffickerData.trafficker_name}</h3>
                            <ul>
                                <li>
                                    <strong>Gender:</strong>{traffickerData && traffickerData.gender}
                                </li>
                                <li>
                                    <strong>Age:</strong>{traffickerData && traffickerData.age}
                                </li>
                                <li>
                                    <strong>Trafficked To:</strong>{traffickerData && traffickerData.trafficked_to}
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* <div className="single_profile_box_bottom">
                        <div className="row justify-content-end align-items-end">
                            <div className="col-auto">
                                <button className='btn addbtn shadow-0'>Download</button>
                            </div>
                        </div>
                    </div> */}
                </div>
                
                <div className="single_profile_basic_details mb30">
                    <h2 className="white_box_title">Basic Details</h2>
                    <div className="white_box_shadow">
                        <div className="survivor_card_bar">
                            <ul>
                                <li>
                                    <h6 className="mb-2">Please select Relationship with survivour (if any)</h6>
                                    <h5 className="mb-0">{traffickerData && traffickerData.relation_with_survivor && traffickerData.relation_with_survivor}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Residential address (SA)</h6>
                                    <h5>{traffickerData && traffickerData.residential_address_source && traffickerData.residential_address_source}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Residential address (DA)</h6>
                                    <h5>{traffickerData && traffickerData.residential_address_destination && traffickerData.residential_address_destination}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Identification Mark </h6>
                                    <h5>{traffickerData && traffickerData.identification_mark && traffickerData.identification_mark}</h5>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {traffickerData && traffickerData.destination &&
                <div className="single_profile_basic_details mb30">
                    <h2 className="white_box_title">Destination</h2>
                    <div className="white_box_shadow">
                        <div className="survivor_card_bar destination_card_bar">
                            <ul>
                                <li>
                                    <h6 className="mb-2">Name of Police station FIR was filed (DA)</h6>
                                    <h5 className="mb-0">{traffickerData && traffickerData.destination && traffickerData.destination.police_station_state_fir_filed&& traffickerData.destination.police_station_state_fir_filed}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">District of police station FIR was filed (DA)</h6>
                                    <h5>{traffickerData && traffickerData.destination && traffickerData.destination.police_station_district_fir_filed&& traffickerData.destination.police_station_district_fir_filed}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">State of Police station FIR was filed (DA)</h6>
                                    <h5>{traffickerData && traffickerData.destination && traffickerData.destination.police_station_state_fir_filed&& traffickerData.destination.police_station_state_fir_filed}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">FIR number filed at the destination</h6>
                                    <h5>{traffickerData && traffickerData.destination && traffickerData.destination.fir_number_destination&& traffickerData.destination.fir_number_destination}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">GD number filed at the destination</h6>
                                    <h5>{traffickerData && traffickerData.destination && traffickerData.destination.gd_number_destination&& traffickerData.destination.gd_number_destination}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">The year FIR was filed (DA)</h6>
                                    <h5>{traffickerData && traffickerData.destination && traffickerData.destination.year_of_fir&& traffickerData.destination.year_of_fir}</h5>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
}
                {traffickerData && traffickerData.sourceArea &&
                <div className="single_profile_basic_details mb30">
                    <h2 className="white_box_title">Source Area</h2>
                    <div className="white_box_shadow">
                        <div className="survivor_card_bar destination_card_bar">
                            <ul>
                                <li>
                                    <h6 className="mb-2">Name of Police station FIR was filed (SA)</h6>
                                    <h5 className="mb-0">{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.police_station_name_fir_filed&& traffickerData.sourceArea.police_station_name_fir_filed}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">District of police station FIR was filed (SA)</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.police_station_district_fir_filed&& traffickerData.sourceArea.police_station_district_fir_filed}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">State of Police station FIR was filed (SA)</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.police_station_state_fir_filed&& traffickerData.sourceArea.police_station_state_fir_filed}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">FIR number filed at the source</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.fir_number_destination&& traffickerData.sourceArea.fir_number_destination}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">The year FIR was filed (SA)</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.year_of_fir&& traffickerData.sourceArea.year_of_fir}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">GD number filed at the source </h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.gd_number_destination&& traffickerData.sourceArea.gd_number_destination}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Status of prosecution</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.status_of_prosecution&& traffickerData.sourceArea.status_of_prosecution}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Name of Survivor</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.survivor&& traffickerData.sourceArea.survivor.survivor_name}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Address of survivor (Block)</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.block_of_survivor&& traffickerData.sourceArea.block_of_survivor}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Address of survivor (District)</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.district_of_survivor&& traffickerData.sourceArea.district_of_survivor}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Name of NGO following up (Organizational ID)</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.ngo_following_up && traffickerData.sourceArea.ngo_following_up.name}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Name of social worker following up</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.social_worker_following_up&& traffickerData.sourceArea.social_worker_following_up.fname +" "+  traffickerData.sourceArea.social_worker_following_up.lname }</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Repeat offender</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.repeated_offender&& traffickerData.sourceArea.repeated_offender}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Name of other survivors</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.other_survivor&& traffickerData.sourceArea.other_survivor.survivor_name}</h5>
                                </li>
                                <li>
                                    <h6 className="mb-2">Any memo about this trafficker</h6>
                                    <h5>{traffickerData && traffickerData.sourceArea && traffickerData.sourceArea.memo_about_trafficker && traffickerData.sourceArea.memo_about_trafficker}</h5>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
}
            </div>
        </main>
    </>
  )
}

export default TraffickersDetails