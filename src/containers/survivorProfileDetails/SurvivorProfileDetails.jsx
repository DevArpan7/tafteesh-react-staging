import React, { useState, useEffect } from 'react';
import { Topbar } from '../../components';
import user from '../../assets/img/user.jpg';
import "./survivorprofiledetails.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import queryString from "query-string";

import {
    getSurvivorDetails, getSurvivalDocList, getRescueList, getFirList, getChargeSheetList, getInvestigationList,
    getParticipationList, getShelterHomeList, getNextPlanList, getSurvivalVcList, getSurvivorPcList, getSurvaivalLoanList,
    getSurvivalIncomeList, getSurvivaLGrantList, getCitList
} from '../../redux/action';
import moment from "moment";
import axios from "axios";
import { Button } from 'bootstrap';

const SurvivorProfileDetails = (props) => {
  const [loader, setLoader] = useState(true);
  const survivorActionDetails = useSelector((state) => state.survivorActionDetails);
    const survivorDetails = useSelector((state) => state.survivorDetails);
    // const rescueList = useSelector((state) => state.rescueList);
    const survivalDocList = useSelector((state) => state.survivalDocList);
    const firList = useSelector((state) => state.firList);
    const chargeSheetList = useSelector((state) => state.chargeSheetList);
    const investigationList = useSelector((state) => state.investigationList);
    const participationList = useSelector((state) => state.participationList);
    const shelterHomeList = useSelector((state) => state.shelterHomeList);
    const nextPlanList = useSelector((state) => state.nextPlanList);
    const survivalVcList = useSelector((state) => state.survivalVcList);
    const survivorPcList = useSelector((state) => state.survivorPcList);
    const survivalLoanList = useSelector((state) => state.survivalLoanList);
    const incomeList = useSelector((state) => state.incomeList);
    const survivalGrantList = useSelector((state) => state.survivalGrantList);
    const citList = useSelector((state) => state.citList);

    // console.log(survivorActionDetails, "survivorActionDetails")

    console.log(props, "social worker");
    const { data } = props.location;
    const dispatch = useDispatch();
    const history = useHistory();
    const [userDetails, setUserDetails] = useState({});


    const api = "https://tafteesh-staging-node.herokuapp.com/api";
    const token = localStorage.getItem("accessToken");
    let axiosConfig = {
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    };

    let url = props.location.search;
    let getId = queryString.parse(url, { parseNumbers: true });

    console.log(getId,"getId")
  
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, [survivorDetails]);

    useEffect(() => {

        if(getId.survivorId){
        dispatch(getSurvivorDetails(getId.survivorId))
        // dispatch(getSurvivalDocList(getId.survivorId))
        // dispatch(getRescueList(getId.survivorId))
        dispatch(getFirList(getId.survivorId))
        dispatch(getChargeSheetList(getId.survivorId))
        dispatch(getInvestigationList(getId.survivorId))
        dispatch(getParticipationList(getId.survivorId))
        dispatch(getShelterHomeList(getId.survivorId))
        dispatch(getNextPlanList(getId.survivorId))
        // dispatch(getSurvivalVcList(getId.survivorId))
        // dispatch(getSurvivorPcList(getId.survivorId))
        // dispatch(getSurvaivalLoanList(getId.survivorId))
        dispatch(getSurvivalIncomeList(getId.survivorId))
        dispatch(getSurvivaLGrantList(getId.survivorId))
        // dispatch(getCitList(getId.survivorId))
        }
    }, [getId.survivorId])

    // useEffect(() => {
    //     console.log(survivalGrantList, "survivalGrantList");
    // }, [survivalGrantList])


    //// go to document ////
    const gotoDocument = () => {

        props.history.push({ pathname: "/survivor-document", state: getId.survivorId })
    }


    const gotRescue = () => {

        props.history.push({ pathname: "/survivor-rescue", state: getId.survivorId })
    }

    const gotVc = () => {

        props.history.push({ pathname: "/survivor-vc", state: getId.survivorId })
    }


    const goToFir = () => {

        props.history.push({ pathname: "/survivor-fir", state: getId.survivorId })
    }

    const gotoParticipationPage = () => {

        props.history.push({ pathname: "/survivor-participation", state: getId.survivorId });

    }

    const gotChargeSheet = () => {

        props.history.push({ pathname: "/survivor-chargesheet", state: getId.survivorId })
    }


    const gotoInvestigation = () => {

        props.history.push({ pathname: "/survivor-investigation", state: getId.survivorId })
    }


    const gotoShelterHome = () => {

        props.history.push({ pathname: "/survivor-shelter-home", state: getId.survivorId })
    }


    const gotoNextPaln = () => {

        props.history.push({ pathname: "/survivor-next-plan", state: getId.survivorId })
    }

    const gotoPc = () => {

        props.history.push({ pathname: "/survivor-pc", state: getId.survivorId })
    }

    const gotoSurvivorLoan = () => {

        props.history.push({ pathname: "/survivor-loan", state: getId.survivorId })
    }

    const gotoSurvivorIncome = () => {

        props.history.push({ pathname: "/survivor-income", state: getId.survivorId })
    }


    const gotoSurvivorGrant = () => {

        props.history.push({ pathname: "/survivor-grant", state: getId.survivorId })
    }


    const gotoSurvivorCIT = () => {

        props.history.push({ pathname: "/survivor-cit", state: getId.survivorId })
    }


    return (
        <>
       
            <Topbar />
            {loader && loader === true ?
            <div class="spinner-border bigSpinner text-info"></div>
        :
            <main className="main_body">
                <div className="bodyright">
                    <div className="row justify-content-between mb30">
                        <div className="col-auto">
                            <h2 className="page_title mb-md-0">Profile Details of {survivorDetails && survivorDetails.survivor_name &&survivorDetails.survivor_name} ({survivorDetails && survivorDetails.survivor_id && survivorDetails.survivor_id})</h2>
                        </div>
                        <div className="col-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb topbreadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/dashboard">Dashboard</a>
                                    </li>
                                    <li className="breadcrumb-item"><a href="/survivors">Survivors</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Profile Details</li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="white_box_shadow_20 single_profile_box mb30">
                        <div className="single_profile_box_top">
                            <div className="single_profile_box_top_left">
                                <img
                                    // src={profileImage}
                                    src={
                                        survivorDetails && survivorDetails.picture ?
                                            'https://tafteesh-staging-node.herokuapp.com/' + userDetails.picture
                                            : user
                                    }
                                    alt="" />
                            </div>
                            <div className="single_profile_box_top_right">
                                <h3>{survivorDetails && survivorDetails.survivor_name && survivorDetails.survivor_name}</h3>
                                <ul>
                                    {survivorDetails && survivorDetails.phone_no &&
                                        <li>
                                            <strong>Phone No:</strong>{survivorDetails && survivorDetails.phone_no && survivorDetails.phone_no}
                                        </li>
                                    }
                                    {survivorDetails &&survivorDetails.survivor_id &&
                                        <li>
                                            <strong>Organization ID:</strong>{survivorDetails &&survivorDetails.survivor_id && survivorDetails.survivor_id}
                                        </li>
                                    }
                                    <li>
                                    {survivorDetails && survivorDetails.state && survivorDetails.state.name &&
                                        <strong>Address:</strong>
                                    }
                                        {" "}
                                            <span>
                                                {survivorDetails && survivorDetails.state && "State:"}   {" "}{survivorDetails && survivorDetails.state && survivorDetails.state.name && survivorDetails.state.name}
                                            </span>
                                            <span>
                                                {survivorDetails && survivorDetails.district && "Dist:"}  {" "} {survivorDetails && survivorDetails.district && survivorDetails.district.name && survivorDetails.district.name}
                                            </span>
                                            <span>
                                                {survivorDetails &&survivorDetails.block && "Block:"}  {" "} {survivorDetails && survivorDetails.block && survivorDetails.block.name && survivorDetails.block.name}
                                            </span>
                                            <span>
                                                {survivorDetails && survivorDetails.pincode && "Pincode:"} {" "} {survivorDetails && survivorDetails.pincode && survivorDetails.pincode}
                                            </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* <div className="single_profile_box_bottom">
                        <div className="row justify-content-between align-items-end">
                            <div className="col-auto">
                                <div className='fileupload_button'>
                                    <label>Consent Form</label>
                                    <div className='fileupload_buttoninner'>
                                        <input type="file" />
                                        <span>Upload file</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto">
                                <button className='btn addbtn shadow-0'>Download</button>
                            </div>
                        </div>
                    </div> */}
                    </div>

                    <div className="single_profile_basic_details mb30">
                        <h2 className="white_box_title">Basic Details</h2>
                        {loader && loader === true ?
            <div class="spinner-border bigSpinner text-info"></div>
        :
                        <div className="white_box_shadow">
                            <div className="survivor_card_bar">
                                <ul>
                                    <li>
                                        <h6 className="mb-2">Survivor ID</h6>
                                        <h5 className="mb-0">{survivorDetails && survivorDetails.survivor_id && survivorDetails.survivor_id}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Name</h6>
                                        <h5>{survivorDetails && survivorDetails.survivor_name && survivorDetails.survivor_name} </h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Gender</h6>
                                        <h5>{survivorDetails && survivorDetails.gender && survivorDetails.gender} </h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Date of Trafficking</h6>
                                        <h5>{survivorDetails &&  survivorDetails.date_of_trafficking && moment(survivorDetails.date_of_trafficking).format("DD-MMM-YYYY")} </h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Rescue?</h6>
                                        <h5>{survivorActionDetails&& survivorActionDetails.rescue
                                        && survivorActionDetails.rescue.exist === true ? "Yes" : "No"}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Procedural Correction </h6>
                                        <h5>{survivorActionDetails && survivorActionDetails.pc && survivorActionDetails.pc.exist === true ? "Yes" : "No"}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Victim Compensation</h6>
                                        <h5>{survivorActionDetails && survivorActionDetails.vc && survivorActionDetails.vc.exist === true  ? "Yes" : "No"}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">CIT</h6>
                                        <h5>{survivorActionDetails && survivorActionDetails.cit && survivorActionDetails.cit.exist === true ? "Yes" : "No"}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Leadership</h6>
                                        <h5>NA</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Financial Inclusion</h6>
                                        <h5>{incomeList && incomeList.data && incomeList.data.length > 0 && "Yes" || survivalLoanList && survivalLoanList.data && survivalLoanList.data.length > 0 ? "Yes" : "No"}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Status of Tafteesh</h6>
                                        <h5>{survivorDetails && survivorDetails.status_in_tafteesh && survivorDetails.status_in_tafteesh} </h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Place of rescue</h6>
                                        <h5>{survivorActionDetails && survivorActionDetails.rescue && survivorActionDetails.rescue.place_of_rescue}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Months since the survivor got trafficked at SA</h6>
                                        <h5>{survivorActionDetails && survivorActionDetails.trafficking && survivorActionDetails.trafficking.sinceMonth && survivorActionDetails.trafficking.sinceMonth}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Months between when trafficked and when case concluded at SA</h6>
                                        <h5>NA</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Months since the survivor rescued</h6>
                                        <h5>{survivorActionDetails && survivorActionDetails.rescue && survivorActionDetails.rescue.sinceMonth  && survivorActionDetails.rescue.sinceMonth}</h5>
                                    </li>
                                    <li>
                                        <h6 className="mb-2">Months between when rescued and when case concluded at DA</h6>
                                        <h5>NA</h5>
                                    </li>
                                </ul>
                            </div>
                        </div>
}
                    </div>
                                        

                    <div className="white_box_shadow_20 survivors_details_table_wrap survivors_table_wrap">
                        <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td>Surivor Docoments</td>
                                        <td>
                                            {survivorActionDetails && survivorActionDetails.document && survivorActionDetails.document.exist === true ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td width="10%">
                                            {survivorActionDetails && survivorActionDetails.document && survivorActionDetails.document.exist === true ?
                                                <button onClick={() => gotoDocument()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoDocument()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Rescue</td>
                                        <td>
                                            {survivorActionDetails && survivorActionDetails.rescue
                                        && survivorActionDetails.rescue.exist=== true ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {survivorActionDetails && survivorActionDetails.rescue
                                        && survivorActionDetails.rescue.exist=== true ?
                                                <button onClick={() => gotRescue()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotRescue()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>FIR</td>
                                        <td>
                                            {firList && firList.data && firList.data.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {firList && firList.data && firList.data.length > 0 ?
                                                <button onClick={() => goToFir()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => goToFir()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Chargesheet</td>
                                        <td>
                                            {chargeSheetList && chargeSheetList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {chargeSheetList && chargeSheetList.length > 0 ?
                                                <button onClick={() => gotChargeSheet()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotChargeSheet()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Investigation</td>
                                        <td>
                                            {investigationList && investigationList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {investigationList && investigationList.length > 0 ?
                                                <button onClick={() => gotoInvestigation()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoInvestigation()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Participation</td>
                                        <td>
                                            {participationList && participationList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {participationList && participationList.length > 0 ?
                                                <button onClick={() => gotoParticipationPage()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoParticipationPage()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Shelter home</td>
                                        <td>
                                            {shelterHomeList && shelterHomeList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {shelterHomeList && shelterHomeList.length > 0 ?
                                                <button onClick={() => gotoShelterHome()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoShelterHome()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Next Plan/Action </td>
                                        <td>
                                            {nextPlanList && nextPlanList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {nextPlanList && nextPlanList.length > 0 ?
                                                <button onClick={() => gotoNextPaln()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoNextPaln()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Victim Compensation</td>
                                        <td>
                                            {survivalVcList && survivalVcList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {survivalVcList && survivalVcList.length > 0 ?
                                                <button onClick={() => gotVc()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotVc()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Procedural Correction</td>
                                        <td>
                                            {survivorPcList && survivorPcList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {survivorPcList && survivorPcList.length > 0 ?
                                                <button onClick={() => gotoPc()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoPc()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Loan</td>
                                        <td>
                                            {survivalLoanList && survivalLoanList.data && survivalLoanList.data.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {survivalLoanList && survivalLoanList.data && survivalLoanList.data.length > 0 ?
                                                <button onClick={() => gotoSurvivorLoan()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoSurvivorLoan()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Income</td>
                                        <td>
                                            {incomeList && incomeList.data && incomeList.data.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {incomeList && incomeList.data && incomeList.data.length > 0 ?
                                                <button onClick={() => gotoSurvivorIncome()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoSurvivorIncome()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Grant</td>
                                        <td>
                                            {survivalGrantList && survivalGrantList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {survivalGrantList && survivalGrantList.length > 0 ?
                                                <button onClick={() => gotoSurvivorGrant()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoSurvivorGrant()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>CIT</td>
                                        <td>
                                            {citList && citList.length > 0 ?
                                                <div className="availabletext">
                                                    <i className="far fa-check-circle"></i>
                                                    <span>Available</span>
                                                </div>
                                                :
                                                <div className="unavailabletext">
                                                    <i className="far fa-times-circle"></i>
                                                    <span>Unavailable</span>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {citList && citList.length > 0 ?
                                                <button onClick={() => gotoSurvivorCIT()} className="profiledetailsview">View</button>
                                                :
                                                <button onClick={() => gotoSurvivorCIT()} className="profiledetailsadd">Add Now</button>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
}
        </>
    )
}

export default SurvivorProfileDetails