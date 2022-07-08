import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";
import profileImage from "../../assets/img/UploadtoCloud.png";
import attachmentImage from "../../assets/img/attachmentIcon.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import { NavLink, useHistory } from "react-router-dom";
import moment from "moment";
import DatePicker from "../../components/DatePicker"
import {
  getSurvivorDetails,
  getStateList,
  getDistrictList,
  getBlockList,
  getShgList,
  getPoliceStationList,
  getCollectivesList,
} from "../../redux/action";

import { Autocomplete, TextField } from "@mui/material";

const AddSurvivorsForm = (props) => {
  const [loader, setLoader] = useState(true);
  const [resultLoad, setResultLoad] = useState(false)
  const [validated, setValidated] = useState(false);
  const [survivorData, setSurvivorData] = useState({});
  const userId = localStorage.getItem("userId");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/survival-profile";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  const organizationId = localStorage.getItem('organizationId')
  const history = useHistory();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const stateList = useSelector((state) => state.stateList);
  const districtList = useSelector((state) => state.districtList);
  const blockList = useSelector((state) => state.blockList);
  const shgList = useSelector((state) => state.shgList);
  const collectivesList = useSelector((state) => state.collectivesList);
  const policeStationList = useSelector((state) => state.policeStationList);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [fileSelect, setFileSelect] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [document, setDocument] = useState('');
  const [updateMessage, setUpdateMessage] = useState("");
  const [contentDocs, setContentDocs] = useState({})
  const [errors, setErrors] = useState({});
  const [messagType, setMessagType] = useState('')
  const[customError, setCustomError]=useState({name:"",message:""})


  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
    // initFilters1();
  }, [survivorDetails]);
  //console.log(survivorData,"survivorData");
  useEffect(() => {
    dispatch(getStateList());
    dispatch(getShgList());
    dispatch(getPoliceStationList());
    dispatch(getCollectivesList());
  }, []);

  //console.log(shgList, "shgList");

  const getDistListByState = (e) => {
    setSurvivorData({
      ...survivorData,
      [e.target.name]: e.target.value,
    });
    if (!errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      })
    }
    dispatch(getDistrictList(e.target.value));

  }
  //console.log(survivorDetails,"survivorDetails");
  useEffect(() => {
    setSurvivorData(survivorDetails);
  }, [survivorDetails]);


  // useEffect(() => {
  //   dispatch(getSurvivorDetails(props && props.survivorId))
  // }, [props]);


  useEffect(() => {
    //console.log(survivorDetails,"survivorDetails");
    if (survivorDetails && survivorDetails._id) {
      setSurvivorData(survivorDetails);
      dispatch(getBlockList(survivorDetails && survivorDetails.state && survivorDetails.state._id, survivorDetails.district && survivorDetails.district._id));
      dispatch(getDistrictList(survivorDetails && survivorDetails.state && survivorDetails.state._id));
    }
  }, [survivorDetails])

  const getBlockListByDist = (e) => {
    setSurvivorData({
      ...survivorData,
      [e.target.name]: e.target.value,
    });
    if (!errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      })
    }
    dispatch(getBlockList(survivorData.state, e.target.value));
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValidated(false)
    setSurvivorData({})
    setOpen(false);
    

  };

  const onCancelBtn = () => {
    // to="/survivors" 
    setValidated(false)
    setSurvivorData({});
    history.goBack();

  }
  console.log(survivorData, "survivorData");

  const handleFileInput = (e, flag) => {
    //console.log(e, e.target.files[0],flag);
    let data = e.target.files[0];
    if (flag === "picture") {
      setFileSelect(e.target.files[0]);
    } else {
      setDocument(e.target.files[0])
    }
    storeFile(data, flag);
  };

  //////// store file onchange function //////

  const storeFile = (file, flag) => {
    //console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        //console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response
          if (flag === "picture") {
            setPictureData(data.data)
          }
          else {
            setContentDocs(data.data);
          }
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  };


  // const onChangeFunction=(e)=>{

  //   setSurvivorData({
  //     ...survivorData,
  //     [e.target.name]: e.target.value
  //   })
  //   if(!!errors[e.target.name]){
  //     setErrors({
  //       ...errors,
  //       [e.target.name]: null
  //     })
  //   }

  // }

  const onHandleChange = (e) => {
    // //console.log(e, e.target.name);
    setSurvivorData({
      ...survivorData,
      [e.target.name]: e.target.value
    })
    // if (!errors[e.target.name]) {
    //   setErrors({
    //     ...errors,
    //     [e.target.name]: null
    //   })
    // }
  };

  
///// age of now
 const calculate_age = (dob1) => {
    var today = new Date();
    var birthDate = new Date(dob1);  // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age_now--;
    }
    console.log(age_now);
    setSurvivorData({
      ...survivorData,
      age_now: age_now
    })
    return age_now;
  }

  useEffect(()=>{
    console.log(survivorData,"survivorData");
    calculate_age(survivorData.date_of_birth)

  },[survivorData && survivorData.date_of_birth])

////////// age when trafficking ////
  const calculateTraffickedage = (date) => {
    var today = new Date(date);
    var birthDate = new Date(survivorData.date_of_birth);  // create a date object directly from `dob1` argument
    var age_when_trafficked = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
      age_when_trafficked--;
    }
    console.log(age_when_trafficked);
    setSurvivorData({
      ...survivorData,
      age_when_trafficked: age_when_trafficked
    })
    return age_when_trafficked;
  }

  useEffect(()=>{
    console.log(survivorData,"survivorData");
    calculateTraffickedage(survivorData.date_of_trafficking)

  },[survivorData && survivorData.date_of_trafficking])


  const handleSubmit = (event) => {
    console.log(event, "habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    console.log(form.checkValidity(), "frorm")
    if (form.checkValidity() === false) {

      if (survivorData && survivorData._id) {
    // setValidated(false);
        addSurvivorFunc(event);

      } else {
        event.preventDefault();
        event.stopPropagation();
      }

    } else {
      // event.preventDefault();  

//       if(survivorData && survivorData.phone_no && survivorData.phone_no.length <1000000000){
//           setCustomError({name:"phone_no", message: "Phone no. is invalied"})
        
//         }
//         else if(survivorData && survivorData.alternate_contact_No && survivorData.alternate_contact_No.length < 1000000000){
//           setCustomError({name:"alternate_contact_No", message: "Phone no. is invalied"})
        
//         }
//         else if(survivorData && survivorData.pincode && survivorData.pincode.length < 7 ){

//           setCustomError({name:"pincode", message: "Pincode. is invalied"})
//         }
//         else{
//           setCustomError({name:"", message: ""})
// console.log("dsdss")
      addSurvivorFunc(event);
        // }
     
    }
    setValidated(true);
   
// if(survivorData && !survivorData.survivor_name){

//   setCustomError({name:"survivor_name", message: "Please enter Survivor name"})
// }else if(survivorData && !survivorData.gender){
//   setCustomError({name:"gender", message: "Please select Gender"})

// }else if(survivorData && !survivorData.marital_status){
//   setCustomError({name:"marital_status", message: "Please select Merital Status"})
// }else if(survivorData && !survivorData.village_name){
//   setCustomError({name:"village_name", message: "Please enter Village Name"})
// }else if(survivorData && !survivorData.state){
//   setCustomError({name:"state", message: "Please select State"})
// }else if(survivorData && !survivorData.district){
//   setCustomError({name:"district", message: "Please select District"})
// }
// else if(survivorData && !survivorData.block){
//   setCustomError({name:"block", message: "Please select Block"})
// }else if(survivorData && !survivorData.panchayat_name){
//   setCustomError({name:"panchayat_name", message: "Please select Panchayat Name"})
// }else if(survivorData && !survivorData.date_of_birth){
//   setCustomError({name:"date_of_birth", message: "Please select Date of Birth"})
// }else if(survivorData && !survivorData.date_of_trafficking){
//   setCustomError({name:"date_of_trafficking", message: "Please select Date of Trafficking"})
// }
// else if(survivorData && !survivorData.police_station){
//   setCustomError({name:"police_station", message: "Please select Police Station"})
// }else if(survivorData && !survivorData.status_in_tafteesh){
//   setCustomError({name:"status_in_tafteesh", message: "Please select Status in Tafteesh"})
// } else if(survivorData && !survivorData.notes_for_status_change){
//   setCustomError({name:"notes_for_status_change", message: "Please enter Notes for Status Change"})
// }else if(survivorData && survivorData.phone_no && survivorData.phone_no.length <1000000000){
//   setCustomError({name:"phone_no", message: "Phone no. is invalied"})

// }
// else{
//         event.preventDefault();

//   addSurvivorFunc(event);
//   }
}
 
// useEffect(()=>{
//   if(survivorData && survivorData.phone_no && survivorData.phone_no.length == 1000000000){
//     setCustomError({name:"", message: ""})
  
//   }
// },[survivorData])

  const addSurvivorFunc = (event) => {
    console.log(event,"event")
    event.preventDefault();
    const tempData = {
      ...survivorData,
      "organization": organizationId,
      "user_id": userId
      // "picture": `https://tafteesh-staging-node.herokuapp.com/${pictureData && pictureData.filePath}`,
      // "consent_form" :  `https://tafteesh-staging-node.herokuapp.com/${contentDocs && contentDocs.filePath}`
    }
    var body = tempData;
    console.log(survivorData,"body")
    if (tempData.survivor_name) {

      if (props && props.survivorId) {
        setResultLoad(true)
        axios
          .patch(api + "/update/" + props.survivorId, body, axiosConfig)
          .then((res) => {
            console.log(res);
            setResultLoad(false)
            handleClick();
            setUpdateMessage(res && res.data.message);
            setMessagType("success")

            setValidated(false)
           
            const { data } = res;

            if (res && res.data && res.data.error == false) {
              setSurvivorData({});
              dispatch({ type: "SURVIVOR_DETAILS", data: {} })
              dispatch({ type: "SHG_LIST", data: [] })
              //console.log(data, res);
              dispatch({ type: "SURVIVOR_LIST", data: data });
              // history.goBack();
               history.push('/survivors');
            }
            else{
              
              handleClick();
              setUpdateMessage(data.data.message)
              setMessagType("error")
            }
          })
          .catch((error) => {
            //console.log(error);
            setResultLoad(false)
            handleClick();
            setUpdateMessage(error.message)
            setMessagType("error")
          });

      }
      else {
        setResultLoad(true)
        axios
          .post(api + "/create", body, axiosConfig)
          .then((res) => {
// console.log(res,"res")
           
            setUpdateMessage(res && res.data.message);
            setResultLoad(false)
            const { data } = res;

            if (res && res.data && res.data.error == false) {
              handleClick();
              setValidated(false)
              setMessagType("success")
              dispatch({ type: "SURVIVOR_LIST", data: data });
              // setSurvivorData({});
              // dispatch({ type: "SURVIVOR_DETAILS", data: {} })
              // history.goBack();
              history.push("/survivors")
            }
            else{
              handleClick();
              setUpdateMessage(data.data.message)
              setMessagType("error")
            }
          })
          .catch((error) => {
            handleClick();
            setUpdateMessage(error.message)
            setMessagType("error")
            setResultLoad(false)

            //console.log(error);
          });
      }
    }

  };

  return (
    <>
      {loader && loader === true ?
        <tr>
          <td align="center">
            <div class="spinner-border bigSpinner text-info"></div>
          </td>
        </tr>
        :
        <Form 
        noValidate validated={validated}
         onSubmit={handleSubmit}
        >
          <NotificationPage
            handleClose={handleClose}
            open={open}
            type={messagType}
            message={updateMessage}
          />
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Personal Details 
              <i className="fal fa-user-circle"></i>
            </h3>
            <Row>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom01"
              >
                <Form.Label>Name <span className="requiredStar">*</span></Form.Label>
                <Form.Control
                  required
                  // isInvalid={!errors.survivor_name}
                  type="text"
                  name="survivor_name"
                  placeholder=""
                  onChange={onHandleChange}
                  defaultValue={survivorData && survivorData.survivor_name && survivorData.survivor_name}
                />
                {/* <Form.Control.Feedback type="invalid">
                  Please enter Survivor Name.
                </Form.Control.Feedback> */}
                {customError && customError.name ==="survivor_name"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="gender"
              >
                <Form.Label>Gender <span className="requiredStar">*</span></Form.Label>
            
                <Form.Select required onChange={onHandleChange} name="gender"
                  value={survivorData && survivorData.gender && survivorData.gender} >
                  <option hidden="true" value={""}>Open this select menu</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="transgender">Transgender</option>

                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                  Please select gender.
                </Form.Control.Feedback> */}
                {customError && customError.name ==="gender"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                type="text"
                controlId="validationCustom03">
                <Form.Label>Marital Status <span className="requiredStar">*</span></Form.Label>
                <Form.Select
                  required
                  onChange={onHandleChange}
                  name="marital_status" value={survivorData && survivorData.marital_status && survivorData.marital_status} >
                  <option value={""} hidden={true} >Open this select menu</option>
                  <option value="married">Married</option>
                  <option value="single">Single</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>

                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                  Marital Status is a required field.
                </Form.Control.Feedback> */}
                {customError && customError.name ==="marital_status"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom04">
                <Form.Label>No. Children</Form.Label>
                <Form.Control defaultValue={survivorData && survivorData.no_of_children && survivorData.no_of_children}
                  onChange={onHandleChange}
                  type="number"
                  placeholder=""
                  name="no_of_children"
                  min={0}

                />
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom03">
                <Form.Label>No. of family members living together</Form.Label>
                <Form.Control

                  type="number"
                  name="no_of_family_member"
                  defaultValue={survivorData && survivorData.no_of_family_member && survivorData.no_of_family_member}
                  placeholder=""
                  min={0}
                  onChange={onHandleChange}
                />
                {/* <Form.Control.Feedback type="invalid">
                Please enter no. of family members living together
              </Form.Control.Feedback> */}
              </Form.Group>
            </Row>
          </div>
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Contact Info
              <i class="fal fa-mobile-android"></i>
            </h3>
            <Row>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom04">
                <Form.Label>Phone No</Form.Label>
                <Form.Control
                  onChange={onHandleChange}
                  defaultValue={survivorData && survivorData.phone_no && survivorData.phone_no}
                  type="text"
                  placeholder=""
                  name="phone_no"
                  maxLength={10}
                />
                {customError && customError.name ==="phone_no"&& <p style={{color: "red", fontSize:12}}>{customError.message}</p>}
              </Form.Group>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom04">
                <Form.Label>Alternate contact number</Form.Label>
                <Form.Control
                  maxLength={10}
                  onChange={onHandleChange}
                  type="text"
                  placeholder=""
                  defaultValue={survivorData && survivorData.alternate_contact_No && survivorData.alternate_contact_No}
                  name="alternate_contact_No"
                />
                 {customError && customError.name ==="phone_no"&& <p style={{color: "red", fontSize:12}}>{customError.message}</p>}
              </Form.Group>
            </Row>
          </div>
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Address
              <i class="fal fa-map-marker-alt"></i>
            </h3>
            <Row>
              <Form.Group
                className="form-group"
                as={Col}
                md="6"
                controlId="validationCustom04">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  onChange={onHandleChange}
                  type="text"
                  placeholder=""
                  name="address_Line1"
                  defaultValue={survivorData && survivorData.address_Line1 && survivorData.address_Line1}
                />
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>State <span className="requiredStar">*</span></Form.Label>
                <Form.Select
                  required
                  // isInvalid={survivorData && !survivorData.state && !errors.sate}
                  onChange={getDistListByState}
                  name="state"
                  aria-label="Default select example"
                  value={survivorData && survivorData.state && survivorData.state._id} >
                  <option hidden="true" value=''>Open this select menu</option>

                  {stateList &&
                    stateList.length > 0 &&
                    stateList.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                  Please select State
                </Form.Control.Feedback> */}
                {customError && customError.name ==="state"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>District <span className="requiredStar">*</span></Form.Label>
                <Form.Select
                  // isInvalid={!!errors.district}
                  required
                  onChange={getBlockListByDist}
                  name="district"
                  value={survivorData && survivorData.district && survivorData.district._id}
                  aria-label="Default select example">
                  <option hidden="true" value={""}>Open this select menu</option>
                  {districtList &&
                    districtList.length > 0 &&
                    districtList.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}


                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                  Please select District
                </Form.Control.Feedback> */}
                {customError && customError.name ==="district"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Block <span className="requiredStar">*</span></Form.Label>
                <Form.Select
                  // isInvalid={!!errors.block}
                  required
                  onChange={onHandleChange}
                  name="block"
                  value={survivorData && survivorData.block && survivorData.block._id}
                  aria-label="Default select example">
                  <option hidden="true" value={""}>Open this select menu</option>
                  {blockList &&
                    blockList.length > 0 &&
                    blockList.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}

                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                  Please select Block
                </Form.Control.Feedback> */}
                {customError && customError.name ==="block"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Village <span className="requiredStar">*</span></Form.Label>
                <Form.Control
                  required
                  onChange={onHandleChange}
                  name="village_name"
                  type="text"
                  placeholder=""
                  defaultValue={survivorData && survivorData.village_name && survivorData.village_name}
                />
                {/* <Form.Control.Feedback type="invalid">
                  Please enter village name
                </Form.Control.Feedback> */}
                {customError && customError.name ==="village_name"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Panchayat <span className="requiredStar">*</span></Form.Label>
                <Form.Select
                  required
                  onChange={onHandleChange}
                  name="panchayat_name"
                  value={survivorData && survivorData.panchayat_name && survivorData.panchayat_name}
                  aria-label="Default select example">
                  <option hidden={true} value={""}>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                  Please select Panchayat
                </Form.Control.Feedback> */}
                {customError && customError.name ==="panchayat_name"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  defaultValue={survivorData && survivorData.pincode && survivorData.pincode}
                  onChange={onHandleChange}
                  name="pincode"
                  type="text"
                  placeholder=""
                  min={0}
                  maxLength={7}
                />
              </Form.Group>
            </Row>
          </div>
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Age
              <i class="fal fa-calendar-alt"></i>
            </h3>
            <Row>
              <Form.Group className="form-group" as={Col} md="6" >
                <Form.Label>Date of Birth <span className="requiredStar">*</span></Form.Label>
                <DatePicker datePickerChange={onHandleChange} name="date_of_birth" flag={"survivor"}
                  message={" Please enter date of birth."} data={survivorData && survivorData.date_of_birth} />
                {customError && customError.name ==="date_of_birth"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}

              </Form.Group>

              {/* <Form.Group className="form-group" as={Col} md="6" controlId="dob">
            {/* <Form.Group>
              <Form.Label> Date</Form.Label>
              <DatePicker/>
            </Form.Group> */}
              {/*<Form.Group className="form-group" as={Col} md="6" controlId="dob">
              <Form.Label>Date of Birth <span className="requiredStar">*</span> </Form.Label>
              <Form.Control
              required
                // onChange={onHandleChange}
                value={survivorData && survivorData.date_of_birth && moment(survivorData.date_of_birth).format("YYYY-MM-DD")}
                type="date"
                // disabled={true}
                name="date_of_birth"
                placeholder="Date of Birth"
              />
              <Form.Control.Feedback type="invalid">
                Please enter Date of Birth
              </Form.Control.Feedback>
            </Form.Group> */}
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Age Now </Form.Label>
                <Form.Control
                  defaultValue={survivorData && survivorData.age_now && survivorData.age_now}
                  // onChange={onHandleChange}
                  disabled={true}
                  type="number"
                  placeholder=""
                  name="age_now"

                />
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6" controlId="dot">
                <Form.Label>Date of Trafficking <span className="requiredStar">*</span></Form.Label>
                <DatePicker
                  
                  message={" Please enter date of Trafficking."}
                  name="date_of_trafficking"
                  datePickerChange={onHandleChange}
                  data={survivorData && survivorData.date_of_trafficking}
                />
                {customError && customError.name ==="date_of_trafficking"&& <p style={{color: "red", fontSize:12}}>{customError.message}</p>}
                {/* <Form.Control
              required
                onChange={onHandleChange}
                value={survivorData && survivorData.date_of_trafficking && moment(survivorData.date_of_trafficking).format("YYYY-MM-DD")}
                type="date"
                name="date_of_trafficking"
                placeholder="Date of Birth"
              />
              <Form.Control.Feedback type="invalid">
                Please enter date of Trafficking.
              </Form.Control.Feedback> */}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6" controlId="doj">
                <Form.Label>Age When Trafficked </Form.Label>
                <Form.Control
                  // defaultValue={survivorData && survivorData.age_when_trafficked && survivorData.age_when_trafficked}
                  value={survivorData && survivorData.age_when_trafficked}
                  disabled={true}
                  // onChange={onHandleChange}
                  type="number"
                  placeholder=""
                  name="age_when_trafficked"
                />
              </Form.Group>
            </Row>
          </div>
            {/* <Form.Group
            className="form-group"
            as={Col}
            md="6"
            controlId="formFileSm">
            <Form.Label>Upload Photo</Form.Label>
            <div className="profileUpload fileUpload">
              <Form.Control  onChange={(e) => handleFileInput(e,"picture")} name="picture" type="file" />
              <img src={fileSelect ? URL.createObjectURL(fileSelect): profileImage} alt="" />
              <div className="profileUploadText fileUploadText">
                {!fileSelect && 
                <div className="profileUploadTextInner">
                  Upload Photo
                  <span>Choose a file</span>
                </div>
                }
              </div>
            </div>
          </Form.Group>
          <Form.Group
            className="form-group"
            as={Col}
            md="6"
            controlId="formFileSm">
            <Form.Label>Consent Form</Form.Label>
            <div className="attachmentUpload fileUpload">
              <Form.Control type="file" name='consent_form'  onChange={(e) => handleFileInput(e)}/>
              <img src={document ? URL.createObjectURL(document) : attachmentImage} alt="" />
              {!document &&
              <div className="attachmentUploadText fileUploadText">
                <div className="profileUploadTextInner">Attach a file</div>
              </div>
}
            </div>
          </Form.Group> */}
            {/* <Form.Group className="form-group" as={Col} md="6">
            <Form.Label>Age Now </Form.Label>
            <Form.Control
              onChange={onHandleChange}
              type="text"
              placeholder=""
              name="age_now"
            />
          </Form.Group> */}
          <div className="white_box_shadow_20 survivorsFormCard mb-4">
            <h3 className="survivorsFormCardHeading">
              Legal Info
              <i class="fal fa-gavel"></i>
            </h3>
            <Row>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Police Station <span className="requiredStar">*</span></Form.Label>
                <Form.Select
                  isInvalid={!!errors.police_station}
                  required
                  onChange={onHandleChange}
                  value={survivorData && survivorData.police_station && survivorData.police_station}
                  name="police_station"
                  aria-label="Default select example">
                  <option hidden="true" value={""}>Open this select menu</option>

                  {policeStationList &&
                    policeStationList.length > 0 &&
                    policeStationList.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                  Please select Police Station
                </Form.Control.Feedback> */}
                {customError && customError.name ==="police_station"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>SHG</Form.Label>
                <Form.Select
                  onChange={onHandleChange}
                  name="shg"
                  value={survivorData && survivorData.shg && survivorData.shg}
                  aria-label="Default select example">
                  {shgList && shgList.data &&
                    shgList.data.length > 0 &&
                    shgList.data.map((data) => {
                      return <option value={data._id}>{data.name.toUpperCase()}</option>;
                    })}
                  <option hidden={true} value={""}>Open this select menu</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Collectives</Form.Label>
                <Form.Select
                  onChange={onHandleChange}
                  name="collectives" value={survivorData && survivorData.collectives && survivorData.collectives}
                  aria-label="Default select example">
                  <option hidden={true}>Open this select menu</option>
                  {collectivesList && collectivesList.data &&
                    collectivesList.data.length > 0 &&
                    collectivesList.data.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Status in tafteesh <span className="requiredStar">*</span></Form.Label>

                <Form.Select
                  isInvalid={!!errors.police_station}
                  required
                  onChange={onHandleChange}
                  name="status_in_tafteesh"
                  value={survivorData && survivorData.status_in_tafteesh && survivorData.status_in_tafteesh}
                  aria-label="Default select example">
                  <option hidden="true" value={""}>Open this select menu</option>
                  <option value="active">Active</option>
                  <option value="dropped-out">Dropped out</option>
                  <option value="tentative">Tentative</option>
                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                  Please select Status in tafteesh
                </Form.Control.Feedback> */}
                {customError && customError.name ==="status_in_tafteesh"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}
              </Form.Group>
              <Form.Group className="form-group" as={Col} md="6">
                <Form.Label>Notes for status change in tafteesh <span className="requiredStar">*</span></Form.Label>
                <Form.Control
                  required
                  defaultValue={survivorData && survivorData.notes_for_status_change && survivorData.notes_for_status_change}
                  onChange={onHandleChange}
                  type="text"
                  placeholder=""
                  name="notes_for_status_change"
                />
                {/* <Form.Control.Feedback type="invalid">
                  Please enter Notes for status change in tafteesh
                </Form.Control.Feedback> */}
                {customError && customError.name ==="notes_for_status_change"&& <p style={{color: "red", fontSize:12}}> {customError.message}</p>}
              </Form.Group>
            </Row>
          </div>


          <Row className="justify-content-between">
            <Form.Group as={Col} xs="auto">
              <button onClick={onCancelBtn} className="text-uppercase cancle_btn">
                Cancel
              </button>
            </Form.Group>
            <Form.Group as={Col} xs="auto">
              <Button
                disabled={resultLoad === true ? true : false}
                // disabled={ survivorData && !survivorData.survivor_name ? true:
                // !survivorData.gender ? true : !survivorData.marital_status ? true : 
                // !survivorData.village_name ? true: !survivorData.state ? true :
                //  !survivorData.district ? true : !survivorData.panchayat_name ? true :
                //   !survivorData.block ? true: !survivorData.police_station ? true :
                //    !survivorData.status_in_tafteesh ? true : !survivorData.notes_for_status_change ? true : false}
                // onClick={(e)=>handleSubmit(e)}
                className="submit_btn text-uppercase" type="submit">
                Submit
              </Button>
            </Form.Group>
          </Row>
        </Form>
      }
    </>
  );
};

export default AddSurvivorsForm;
