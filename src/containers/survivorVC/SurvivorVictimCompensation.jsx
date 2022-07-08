import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCardExtra } from "../../components";

import { Link } from "react-router-dom";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import moment from "moment";
import {
  getLawyersList,
  getSurvivorDetails,
  getCourtList,
  getSurvivalVcList,
  getAuthorityTypeList,
  getAuthorityList,
  getVcEscalationList,
  getAuthorityByAuthorityType,
  getVcEscalation2List,
  getChangeLog
} from "../../redux/action";
import alertImg from "../../assets/img/alertPopupimg.png";
import DataTableVcFilter from "./DataTableVcFilter";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";
import { jsPDF } from "jspdf";
import "jspdf-autotable";


const SurvivorVictimCompensation = (props) => {
  // console.log(props, "props");
  const [modalVCShow, setModalVCShow] = useState(false);
  const [modalVCEscalationFShow, setModalVCEscalationFShow] = useState(false);
  const dispatch = useDispatch();
  const lawyersList = useSelector((state) => state.lawyersList);
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const authorityTypeList = useSelector((state) => state.authorityTypeList);
  const authorityList = useSelector((state) => state.authorityList);
  const vcEscalationList = useSelector((state) => state.vcEscalationList);
  const survivalVcList = useSelector((state) => state.survivalVcList);
  const vcEscalation2List = useSelector((state) => state.vcEscalation2List);

  const authorityListByAuthType = useSelector(
    (state) => state.authorityListByAuthType
  );
  const [escalSelectedData, setEscalSelectedData] = useState({});
  const [paramFlag, setParamFlag] = useState("");
  const [escalActiveClass, setEscalActiveClass] = useState(false);
  const [addVcEscalationData, setAddVcEscalationData] = useState({});
  const [addVcEscalation2Data, setAddVcEscalation2Data] = useState({});

  const [fileSelect, setFileSelect] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const [addVcData, setAddVcData] = useState({});
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [selectedData, setSelectedData] = useState({});
  const [activeClass, setActiveClass] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [modalVCEscalation2FShow, setModalVCEscalation2FShow] = useState(false);
  // const handleCloseAlert = () => setShowAlert(false);
  //   const handleShow = () => setShowAlert(true);
  const [open, setOpen] = useState(false);
  const [appliedAtId, setAppliedAtId] = useState("");
const [escalActive2Class,setEscalActive2Class] = useState(false)
const [escalSelected2Data,setEscalSelected2Data] = useState({})

const deletedById= localStorage.getItem("userId");
const deletedByRef = localStorage.getItem("role");

const [validated, setValidated] = useState(false);
const [validatedEscal1,setValidatedEscal1] = useState(false)
const [validatedEscal2,setValidatedEscal2] = useState(false)
const [alertFlag,setAlertFlag] = useState('')
const [alertMessage,setAlertMessage]= useState('')

const [erorMessage, setErorMessage] = useState("");
const[esclFlag,setEsclFlag] = useState("")
const [errText,setErrText] = useState('');

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setTimeout(() => {
    setIsLoading(false);
  }, 1000);
}, [survivalVcList]);

const handleShow = () => {
  console.log("select")
  setShowAlert(true);
}

const handleCloseAlert = () =>{ 
  setAlertMessage('')
  setAlertFlag('')
  setShowAlert(false);
}

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onSelectRow = (item) => {
    console.log(item, "iteeeeem");
    setSelectedData(item);
    setActiveClass(true);

    if(item && item.escalation  && item.escalation === true && item.totalEscalation ===0){
      setAlertFlag("add");
      setAlertMessage("Escalation marked YES, Would you like add ?")
      handleShow()
    }
    else{
      setShowAlert(false);
    }
  };

  console.log(vcEscalation2List, "vcEscalation2List");

  const onGotoAddVc = () => {
    setModalVCShow(true);
    setSelectedData({});
  };

  const onGotoEditVc = (e) => {
    setParamFlag(e);
    setModalVCShow(true);
    setAddVcData(selectedData);
    setParamFlag(e);
  };

  const onCancel = () => {
    setModalVCShow(false);
    setAddVcData({});
    // setActiveClass(false);
    setPictureData({});
    setSelectedData({});
    setParamFlag("");
  };

  const changeLogFunc=(flag)=>{
    dispatch(getChangeLog(flag,deletedById))
    props.history.push("/change-log")
  }

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one VC");
    } else {
      setShowAlert(true);
    }
  };
  //////// delete function call //////////
  const onDeleteChangeEscalFunc = (flag) => {
    setEsclFlag(flag)
    if (escalSelectedData && !escalSelectedData._id) {
      alert("Please select one VC escalation");
    } else {
      setShowAlert(true);
    }
  };
  const onDeleteFunction = () => {
    
  let body ={
    deleted_by : deletedById && deletedById,
    deleted_by_ref: deletedByRef && deletedByRef
  }
    if(esclFlag==="escal"){
      axios
      .patch(api + "/vc-escalation/delete/" + escalSelectedData._id,body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        setEscalSelectedData({})
        if (response.data && response.data.error === false) {
          const { data } = response;
          setEsclFlag("");
          dispatch(getVcEscalation2List(selectedData && selectedData._id,escalSelectedData && escalSelectedData._id))
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
    } else{
    axios
      .patch(api + "/survival-vc/delete/" + selectedData._id,body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({})
          dispatch(getSurvivalVcList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
    }
  };


  const onVcEscalationCancel = () => {
    setModalVCEscalationFShow(false);
    setAddVcEscalationData({});
    setEscalSelectedData({});
    setEscalActiveClass(false);
    setParamFlag("");
  };

  const onSelectVcEscal = (data) => {
    console.log(data, "data");
    setEscalSelectedData(data);
    setEscalActiveClass(true);
    dispatch(getVcEscalation2List(data && data.survivor_vc, data._id));
    if(data && data.escalation === true){
      setAlertFlag("alert");
      setAlertMessage("Need to Add Escalation 2 for this VC")
      handleShow()
    }
    else{
      setShowAlert(false);
    }
  };

  
  
  //// for escalation 1 ///////////
  const onAddVcEscalation = (e) => {
    console.log(e, "eeeeeeeeee");
    if (selectedData && !selectedData._id) {
      alert("Please Select one VC to add Escalation !!");
    } else if (selectedData && selectedData.status === "Conculded") {
      // alert("You are not allowed to add Escalation for this VC!!");
      setAlertFlag("concluded");
      setAlertMessage("Can not Add Escalation 2 for Concluded VC Escalation")
      handleShow()
    }
     else {
      handleCloseAlert()
      setModalVCEscalationFShow(true);
      setAddVcEscalationData({
        lawyer: selectedData && selectedData.lawyer && selectedData.lawyer._id,
        source: selectedData && selectedData.source 
      });
      setEscalActiveClass(false);
    }
  };
  //// for escalation 1 ///////////
  const oneditVcEscalation = (e) => {
    setParamFlag(e);

    if (!escalSelectedData._id) {
      alert("Please select one escalation !!");
    } else if (escalSelectedData.status === "Conculded") {
      // alert("You are not allowed to edit this Escalation !!");
      setAlertFlag("concluded");
      setAlertMessage("Can not Add Escalation for Concluded VC")
      handleShow()
    } else {
      setModalVCEscalationFShow(true);
      setAddVcEscalationData(escalSelectedData);
    }
  };
  //// for escalation 2 ///////////
  const onSelectVcEscal2 = (data) => {
    console.log(data, "data");
    setEscalSelected2Data(data);
    setEscalActive2Class(true);
  };

  const onAddVcEscalation2 = (e) => {
    console.log(e, "eeeeeeeeee");
    if (escalSelectedData && !escalSelectedData._id) {
      alert("Please Select one Escalation to add Escalation 2 !!");
    } else if (escalSelectedData && escalSelectedData.status === "Conculded") {
      alert("You are not allowed to add Escalation 2 for this Escalation!!");
    } else {
      setModalVCEscalation2FShow(true);
      setAddVcEscalation2Data({
        lawyer: escalSelectedData && escalSelectedData.lawyer && escalSelectedData.lawyer,
        source: escalSelectedData && escalSelectedData.source 
      });
      setEscalActiveClass(false);
    }
  };

  console.log(addVcEscalationData,"setAddVcEscalationData");

  //// for escalation 2 ///////////

  const onVcEscalation2Cancel = () => {
    setModalVCEscalation2FShow(false);
    setAddVcEscalation2Data({})
  };

  useEffect(() => {
    dispatch(getLawyersList());
    dispatch(getCourtList());
    dispatch(getSurvivorDetails(props.location.state));
    dispatch(getSurvivalVcList(props.location.state));
    dispatch(getAuthorityTypeList());
    dispatch(getAuthorityList());
  }, [props]);

  ////////////// get vc eacalation list by vc ////////////////////

  ////// to split "_" and make camel case function ////////
  function capitalize(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  }

  useEffect(() => {
    dispatch(getVcEscalationList(selectedData && selectedData._id));
  }, [selectedData]);

  //   useEffect(() => {
  //     console.log(vcEscalationList, "selectedData");

  //     if (
  //       selectedData &&
  //       selectedData.status !== "Conculded" && vcEscalationList &&
  //       vcEscalationList.length === []
  //     ) {
  //       setShowAlert(true);
  //     } else {
  //       setShowAlert(false);
  //     }
  //   }, [selectedData]);
  //   console.log(showAlert, "showAlert");

  ///////////// set authority value by autority type in authoruty field /////////////////

  useEffect(() => {
    if (selectedData && selectedData.applied_at) {
      setAppliedAtId(selectedData && selectedData.applied_at._id);
    } else if (addVcData && addVcData.applied_at) {
      setAppliedAtId(addVcData && addVcData.applied_at);
    }
  }, [addVcData]);

  useEffect(() => {
    dispatch(getAuthorityByAuthorityType(appliedAtId));
  }, [appliedAtId]);

  useEffect(() => {
    if(addVcEscalationData && addVcEscalationData.escalated_at && addVcEscalationData.escalated_at._id){

      dispatch(getAuthorityByAuthorityType(addVcEscalationData.escalated_at._id));
    }

   else if (addVcEscalationData && addVcEscalationData.escalated_at) {
      dispatch(getAuthorityByAuthorityType(addVcEscalationData.escalated_at));
    }
  }, [addVcEscalationData.escalated_at]);
  ////////////// set deaful value in video confrencig field for  Vc ////////

  useEffect(() => {
    if (addVcData && addVcData.source === "sa") {
      setAddVcData({
        ...addVcData,
        video_conferencing: false,
      });
    }
  }, [addVcData && addVcData.source]);

  /////////////// for  VC escalation /////
  useEffect(() => {
    if (addVcEscalationData && addVcEscalationData.source === "sa") {
      setAddVcEscalationData({
        ...addVcEscalationData,
        video_conferencing: false,
      });
    }
  }, [addVcEscalationData && addVcEscalationData.source]);

  //////////// set DIFFERENCE BETWEEN AMOUNT CLAIMED AND REWARDED(₹): for VC /////

  useEffect(() => {
    let firstAmount = addVcData.amount_claimed;
    let awardedAmout = addVcData.amount_awarded;
    let finalAmount = Math.abs(firstAmount - awardedAmout);
    setAddVcData({
      ...addVcData,
      difference_between_amount_claim_reward: finalAmount,
    });
  }, [addVcData.amount_claimed && addVcData.amount_awarded]);

  /////////// for VC escalation //////
  useEffect(() => {
    let firstAmount = addVcEscalationData.amount_claimed;
    let awardedAmout = addVcEscalationData.amount_awarded;
    let finalAmount = Math.abs(firstAmount - awardedAmout);
    setAddVcEscalationData({
      ...addVcEscalationData,
      difference_between_amount_claim_reward: finalAmount,
    });
  }, [
    addVcEscalationData.amount_claimed && addVcEscalationData.amount_awarded,
  ]);


  useEffect(() => {
    let firstAmount = addVcEscalation2Data.amount_claimed;
    let awardedAmout = addVcEscalation2Data.amount_awarded;
    let finalAmount = Math.abs(firstAmount - awardedAmout);
    setAddVcEscalation2Data({
      ...addVcEscalation2Data,
      difference_between_amount_claim_reward: finalAmount,
    });
  }, [
    addVcEscalation2Data.amount_claimed && addVcEscalation2Data.amount_awarded,
  ]);

  useEffect(() => {
    if( addVcData.amount_received_in_bank > addVcData.amount_awarded){

      setErrText("Please enter correct Amount");
    }
    else{
      setErrText("");
    }
    console.log(addVcData, "addVcData");
  }, [addVcData.amount_received_in_bank]);



  useEffect(()=>{

    if( addVcEscalationData.amount_received_in_bank > addVcEscalationData.amount_awarded){

      setErrText("Please enter correct Amount");
    }
    else{
      setErrText("");
    }
    
  },[addVcEscalationData.amount_received_in_bank])

  useEffect(()=>{

    if( addVcEscalation2Data.amount_received_in_bank > addVcEscalation2Data.amount_awarded){

      setErrText("Please enter correct Amount");
    }
    else{
      setErrText("");
    }
    
  },[addVcEscalation2Data.amount_received_in_bank])


  /////////////////////file upload function/////////////////////////
  const handleFileInput = (e) => {
    console.log(e, e.target.files[0]);
    let data = e.target.files[0];

    setFileSelect(e.target.files[0]);
    storeFile(data);
  };

  const storeFile = (file) => {
    console.log(file, "file");
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response;
          console.log(data, "dataaa");
          setAddVcData({
            ...addVcData,
            vc_application:
              "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
          });
          setAddVcEscalationData({
            ...addVcEscalationData,
            vc_application:
              "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
          });
          setPictureData(data.data.filePath);
          console.log(pictureData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   console.log(addVcData, "addVcData");

//   function currencyFormat(num) {
//     return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
//  }
 const currencyFormat = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);


  const handleSubmit = (event) => {
    console.log(event,"habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if(addVcData && addVcData._id){
        addVcFunc(event);
      }else{
      event.preventDefault();
      event.stopPropagation();
    } 
  }else{
      addVcFunc(event);
    }
    setValidated(true);

  }

  ///////////// add vc api call function /////////

  const addVcFunc = (e) => {
    e.preventDefault();
    // console.warn(pictureData, profile);
    var body = {
      ...addVcData,
      survivor: props.location.state,
    };
   var updateData={
    ...addVcData,
    survivor: props.location.state,
    user_id: deletedById && deletedById,

    }
    console.log("body", body);
    if (addVcData && addVcData._id) {
      axios
        .patch(api + "/survival-vc/update/" + addVcData._id, updateData, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setValidated(false)
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivalVcList(props.location.state));
            setModalVCShow(false);
            setAddVcData({});
            // setActiveClass(false);
            setAddVcEscalationData({});
            // setSelectedData({});
            setParamFlag("");
          }
        })
        .catch((error) => {
          console.log(error, "fir add error");
        });
    } else {
      axios
        .post(api + "/survival-vc/create", body, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setValidated(false)
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            dispatch(getSurvivalVcList(props.location.state));
            setModalVCShow(false);
            setAddVcData({});
            setPictureData({});
            // setActiveClass(false);
            setAddVcEscalationData({});
            // setSelectedData({});
            setParamFlag("");
          }
        })
        .catch((error) => {
          console.log(error);
          // setUpdateMessage(error && error.message)
        });
    }
  };

  console.log(selectedData, "selectedData");

  
  const handleSubmitEscal1 = (event) => {
    console.log(event,"habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if(addVcEscalationData && addVcEscalationData._id){
        addVcEscalationFunc(event);
      }else{
      event.preventDefault();
      event.stopPropagation();
    }
    }
     else{
      addVcEscalationFunc(event);
    }
    setValidatedEscal1(true);

  }
  
  ////////////// API CALL FUCTION FOR ADD AND UPDATE VC ESCALATION ////////
  const addVcEscalationFunc = (e) => {
    e.preventDefault();
    // console.warn(pictureData, profile);
    var updateData = {
      ...addVcEscalationData,  
      "flag": true,
      survivor: props.location.state,
      survivor_vc: selectedData && selectedData._id,
      user_id: deletedById && deletedById
    };
    var addData = {
      ...addVcEscalationData,  
      "flag": true,
      survivor: props.location.state,
      survivor_vc: selectedData && selectedData._id,
    };
    if (addVcEscalationData && addVcEscalationData._id) {
      axios
        .patch(
          api + "/vc-escalation/update/" + addVcEscalationData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setValidatedEscal1(false)
          dispatch(getVcEscalationList(selectedData && selectedData._id));
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivalVcList(props.location.state));

            setModalVCEscalationFShow(false);
            // setAddVcData({});
            // setActiveClass(false);
            setAddVcEscalationData({});
            // setEscalActiveClass(false);
            // setEscalSelectedData({});
            setParamFlag("");
          }
        })
        .catch((error) => {
          console.log(error, "fir add error");
        });
    } else {
      axios
        .post(api + "/vc-escalation/create", addData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          setValidatedEscal1(false)
          dispatch(getVcEscalationList(selectedData && selectedData._id));
          if (res && res.data && res.data.error === false) {
            const { data } = res;
            dispatch(getSurvivalVcList(props.location.state));

            setModalVCEscalationFShow(false);
            // setAddVcData({});
            setPictureData({});
            // setActiveClass(false);
            setAddVcEscalationData({});
            // setEscalActiveClass(false);
            // setEscalSelectedData({});
            setParamFlag("");
          }
        })
        .catch((error) => {
          console.log(error);
          // setUpdateMessage(error && error.message)
        });
    }
  };

const onescalation2DateHandel =(e)=>{
  setAddVcEscalation2Data({
    ...addVcEscalation2Data,
    [e.target.name]: e.target.value,
  })
}

  const handleSubmitEscal2 = (event) => {
    console.log(event,"habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else{
      addVcEscalation2Func(event);
    }
    setValidatedEscal2(true);

  }
  ////////////// API CALL FUCTION FOR ADD AND UPDATE VC ESCALATION ////////
  const addVcEscalation2Func = (e) => {
    e.preventDefault();
    var body = {
      ...addVcEscalation2Data,
      "flag": false,
      survivor: props.location.state,
      survivor_vc: selectedData && selectedData._id,
      survivor_vc_escalation: escalSelectedData && escalSelectedData._id,
    };
    console.log("body", body);

    axios
      .post(api + "/vc-escalation/create", body, axiosConfig)
      .then((res) => {
        console.log(res);
        handleClick();
        setUpdateMessage(res && res.data.message);
        setValidatedEscal2(false);
        dispatch(getVcEscalationList(selectedData && selectedData._id));
        if (res && res.data && res.data.error === false) {
          const { data } = res;
          dispatch(getSurvivalVcList(props.location.state));
          setAddVcEscalation2Data({});
          setModalVCEscalation2FShow(false);
          setAddVcData({});
          setPictureData({});
          // setActiveClass(false);
          // setAddVcEscalationData({});
          // setEscalActiveClass(false);
          // setEscalSelectedData({});
          setParamFlag("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //////////////// for csv function ////

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };
  console.log(survivalVcList,'survivalVc')

  const exportToCsv = (e) => {
    console.log(e, "e");
    e.preventDefault();
    let headers = [
      "Id,AmountAwarded,AmountClaimed,AmountReceivedInBank,Amount Received at Bank Date,ApplicationNumber,AppliedAt,Applied Date,Authority,DateOfOrder,Difference Betwwen aount claim and reward,Escalation,Lawyer,Reason For Escalation,Result,Source,Status,Survivor,Total Escalation,Unique Id,VideoConferencing,Created At",
    ];
    let exportData=[];
    {survivalVcList.map((x)=>{
      exportData.push({_id:x._id,
        AmountAwarded:x.amount_awarded,
        AmountClaimed:x.amount_claimed,
        AmountReceivedInBank:x.amount_received_in_bank,
        amount_received_in_bank_date:moment(x.amount_received_in_bank_date).format('DD-MMM-YYYY'),
        application_number:x.application_number,
        applied_at:x.applied_at.name,
        applied_date:moment(x.applied_date).format('DD-MMM-YYYY'),
        authority:x.authority,
        date_of_order : moment(x.date_of_order).format('DD-MMM-YYYY'),
        difference_between_amount_claim_reward:x.difference_between_amount_claim_reward,
        escalation:x.escalation,
        lawyer:x.lawyer.name,
        reason_for_escalation:x.reason_for_escalation,
        result:x.result,
        source:x.source,
        status:x.status,
        survivor:x.survivor,
        totalEscalation:x.totalEscalation,
        uniqueid:x.unique_id,
        videoCon:x.video_conferencing,
        createdAt:moment(x.createdAt).format('DD-MMM-YYYY')})
    })}
    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        _id,
        AmountAwarded,
        AmountClaimed,
        AmountReceivedInBank,
        amount_received_in_bank_date,
        application_number,
        applied_at,
        applied_date,
        authority,
        date_of_order,
        difference_between_amount_claim_reward,
        escalation,
        lawyer,
        reason_for_escalation,
        result,
        source,
        status,
        survivor,
        totalEscalation,
        uniqueid,
        videoCon,
        createdAt
      } = user;
      acc.push(
        [
                 _id,
        AmountAwarded,
        AmountClaimed,
        AmountReceivedInBank,
        amount_received_in_bank_date,
        application_number,
        applied_at,
        applied_date,
        authority,
        date_of_order,
        difference_between_amount_claim_reward,
        escalation,
        lawyer,
        reason_for_escalation,
        result,
        source,
        status,
        survivor,
        totalEscalation,
        uniqueid,
        videoCon,
        createdAt
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "survivalVcList.csv",
      fileType: "text/csv",
    });
  };

  const applicationDateHandel =(e)=>{
    setAddVcData({
      ...addVcData,
      [e.target.name]: e.target.value,
    })
  }

  const dateOfOrderHandel = (e) =>{
    setAddVcData({
      ...addVcData,
      [e.target.name]: e.target.value,
    })
  }

  const amountReceivedHandler = (e)=>{
    setAddVcData({
      ...addVcData,
      [e.target.name]: e.target.value,
    })
  }

  const escalaApplicationDateHandel =(e)=>{
    setAddVcEscalationData({
      ...addVcEscalationData,
      [e.target.name]: e.target.value,
    })
  }
  const escalDateFirstHandel =(e)=>{
    setAddVcEscalationData({
      ...addVcEscalationData,
      [e.target.name]: e.target.value,
    })
  }

  const escalAmountReceivedDateHandel = (e)=>{
    setAddVcEscalationData({
      ...addVcEscalationData,
      [e.target.name]: e.target.value,
    })
  }


////////////// for PDF ////////////

const downloadPdf = () => {
  const doc = new jsPDF({
    orientation: "landscape",
  });

  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text("SURVIVOR DETAILS", 22, 10);

  //  // add content
  doc.setFontSize(10);
  doc.text("SURVIVOR NAME:", 22, 20);
  doc.text(survivorDetails?.survivor_name, 60, 20);
  doc.text("SURVIVOR ID", 22, 40);
  doc.text(survivorDetails?.survivor_id, 60, 40);

  doc.setFontSize(20);
  doc.text("SURVIVOR VICTIM COMPENSATION LIST", 22, 60);
  doc.setFontSize(10);
  const survivorColumns = [
    "SOURCE",
    "APPLIED DATE",
    "APPLIED AT",
    "VC STATUS",
    "FIRST AWARDED",
    "AWARDED DATE",
    "AMOUNT CLAIMED",
    "AMOUNT RECIEVD IN BANK",
    "RECIEVED BANK DATE",
    "ORDER DATE",
    "AMOUNT DIFFERENCE",
    "IS ESCALATION",
    "ESCALATION REASON",
    "RESULT",
    "IS VIDEO",
    "ESCALATION COUNT",
    "LAWYER",
    "CREATED AT",
  ];
  const name = "survivor-vc-list" + new Date().toISOString() + ".pdf";
  let goalsRows = [];
  survivalVcList?.forEach((item) => {
    const temp = [
      item.source.toUpperCase(),
      moment(item.applied_date).format("DD-MMM-YYYY"),
      item.status,
      item.amount_awarded,
      moment(item.amount_received_in_bank_date).format("DD-MMM-YYYY"),
      item.amount_claimed,
      item.amount_received_in_bank,
      moment(item.date_of_order).format("DD-MMM-YYYY"),
      item.difference_between_amount_claim_reward,
      item.escalation,
      item.reason_for_escalation,
      item.result,
      item.video_conferencing,
      item.totalEscalation,
      item.lawyer?.name,
      moment(item.createdAt).format("DD-MMM-YYYY"),
    ];
    goalsRows.push(temp);
  });
  doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22,
   });
  doc.save(name);
};


  return (
    <>
      <Topbar />
      <main className="main_body">
        <NotificationPage
          handleClose={handleClose}
          open={open}
          message={updateMessage}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Victim Compensation</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>VC</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topProcedural Correctioncartbar topcartbar white_box_shadow">
            <SurvivorTopCardExtra survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            <div className="vieweditdelete">
              <Dropdown className="me-1">
                <Dropdown.Toggle variant="border" className="shadow-0">
                  Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportToCsv}>
                    Download CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={downloadPdf}>
                    Download PDF
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={(e) => onAddVcEscalation(e)}
                  >
                    Add Escalation
                  </Dropdown.Item>
                  <Dropdown.Item onClick={()=>changeLogFunc("vc")}>Change Log</Dropdown.Item>

                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add"
              >
                <span onClick={() => onGotoAddVc()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => onGotoEditVc("edit")}>
                  <i className="fal fa-pencil"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "delete_btn" }}
                title="Delete"
              >
                <span onClick={() => onDeleteChangeFunc()}>
                  <i className="fal fa-trash-alt"></i>
                </span>
              </MDBTooltip>
            </div>
            <div className="table-responsive big-mobile-responsive">
              <DataTableVcFilter
                survivalVcList={
                  survivalVcList && survivalVcList.length > 0 && survivalVcList
                }
                survivorName={
                  survivorDetails &&
                  survivorDetails.survivor_name &&
                  survivorDetails.survivor_name
                }
                isLoading={isLoading}
                onSelectRow={onSelectRow}
              />
             
            </div>
          </div>
          {vcEscalationList && vcEscalationList.length > 0 && (
            <>
              <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
                <div className="vieweditdelete">
                  <MDBTooltip
                    tag="button"
                    wrapperProps={{ className: "add_btn view_btn" }}
                    title="Add Escalation 2"
                  >
                    <span onClick={() => onAddVcEscalation2()}>
                      <i className="fal fa-plus-circle"></i>
                    </span>
                  </MDBTooltip>
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "edit_btn" }}
                    title="Edit"
                  >
                    <span onClick={() => oneditVcEscalation("edit")}>
                      <i className="fal fa-pencil"></i>
                    </span>
                  </MDBTooltip>
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "delete_btn" }}
                    title="Delete"
                  >
                   <span onClick={() => onDeleteChangeEscalFunc("escal")}>
                  <i className="fal fa-trash-alt"></i>
                </span>
                  </MDBTooltip>
                </div>

                <h4 className="mb-4 small_heading">Escalation Of {selectedData && selectedData.unique_id}</h4>
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                      <th width="16.66%">Id</th>
                        <th width="16.66%">Source</th>
                        <th width="16.66%">Applied date</th>
                        <th width="16.66%">application number</th>
                        <th width="16.66%">Amount claimed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vcEscalationList && vcEscalationList.length > 0 ? (
                        vcEscalationList.map((item) => {
                          return (
                            <tr
                              className={[
                                item._id === escalSelectedData._id &&
                                  escalActiveClass === true &&
                                  "current",
                              ]}
                              onClick={() => onSelectVcEscal(item)}
                            >
                               <td>
                                {item &&
                                  item.unique_id &&
                                  item.unique_id}
                              </td>
                              <td>
                                {item &&
                                  item.source &&
                                  item.source.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.applied_date &&
                                  moment(item.applied_date).format("DD-MMM-YYYY")}
                              </td>
                              <td>
                                {item &&
                                  item.application_number &&
                                  item.application_number}
                              </td>
                              <td>
                                {/* {item.amount_claimed && "INR"}{" "} */}
                                {item &&
                                  item.amount_claimed &&
                                  currencyFormat(item.amount_claimed)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td>No Data Found !!!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {vcEscalation2List && vcEscalation2List.length > 0 && (
            <>
              <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
                <h4 className="mb-4 small_heading">Escalation 2 Of {escalSelectedData && escalSelectedData.unique_id}</h4>
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="16.66%">Source</th>
                        <th width="16.66%">Applied date</th>
                        <th width="16.66%">application number</th>
                        <th width="16.66%">Amount claimed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vcEscalation2List && vcEscalation2List.length > 0 ? (
                        vcEscalation2List.map((item) => {
                          return (
                            <tr
                              className={[
                                item._id === escalSelected2Data._id &&
                                escalActive2Class === true &&
                                  "current",
                              ]}
                              onClick={() => onSelectVcEscal2(item)}
                            >
                              <td>
                                {item &&
                                  item.source &&
                                  item.source.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.applied_date &&
                                  moment(item.applied_date).format("DD-MMM-YYYY")}
                              </td>
                              <td>
                                {item &&
                                  item.application_number &&
                                  item.application_number}
                              </td>
                              <td>
                                {/* {item.amount_claimed && "INR"}{" "} */}
                                {item &&
                                  item.amount_claimed &&
                                  currencyFormat(item.amount_claimed)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td>No Data Found !!!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalVCShow}
        onHide={setModalVCShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {paramFlag === "edit"
              ? "Update Victim Compensation"
              : "Add Victim Compensation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
              <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="status"
                    value={addVcData && addVcData.status && addVcData.status}
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"Applied"}>Applied</option>
                    <option value={"Awarded"}>Awarded</option>
                    <option value={"Rejected"}>Rejected</option>
                    <option value={"Eacalated"}>Escalated</option>
                    <option value={"Conculded"}>Concluded</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Status
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    value={addVcData && addVcData.source && addVcData.source}
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="source"
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Source
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Lawyer <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="lawyer"
                    value={addVcData && addVcData.lawyer && addVcData.lawyer._id}
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {lawyersList &&
                      lawyersList.length > 0 &&
                      lawyersList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Lawyer
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Applied At <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="applied_at"
                    value={
                      addVcData &&
                      addVcData.applied_at &&
                      addVcData.applied_at._id
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {authorityTypeList &&
                      authorityTypeList.length > 0 &&
                      authorityTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && capitalize(item.name)}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select  Applied At
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Authority <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="authority"
                    value={addVcData && addVcData.authority}
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {authorityListByAuthType &&
                      authorityListByAuthType.length > 0 &&
                      authorityListByAuthType.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {" "}
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select  Authority
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application Date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    required
                    name="applied_date"
                    datePickerChange={applicationDateHandel}
                    data={addVcData && addVcData.applied_date}
                    message={"Please select Application Date"}
                  />
                  {/* <Form.Control
                  required
                    type="date"
                    name="applied_date"
                    value={
                      addVcData &&
                      addVcData.applied_date &&
                      moment(addVcData.applied_date).format("YYYY-MM-DD")
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="PC Started Date"
                  />
                  <Form.Control.Feedback type="invalid">
              Please select  Application Date 
            </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    name="application_number"
                    defaultValue={
                      addVcData &&
                      addVcData.application_number &&
                      addVcData.application_number
                    }
                    type="text"
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
              Please enter  Application Number 
            </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Video Conferncing</Form.Label>
                  <Form.Select
                    disabled={
                      addVcData && addVcData.source === "source" ? true : false
                    }
                    value={
                      addVcData &&
                      addVcData.video_conferencing &&
                      addVcData.video_conferencing
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="video_conferencing"
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount Claimed <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      required
                      name="amount_claimed"
                      defaultValue={
                        addVcData &&
                        addVcData.amount_claimed &&
                        addVcData.amount_claimed
                      }
                      type="number"
                      onChange={(e) =>
                        setAddVcData({
                          ...addVcData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </InputGroup>                  
                  <Form.Control.Feedback type="invalid">
                    Please enter Amount Claimed
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Amount Awarded</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      defaultValue={
                        addVcData &&
                        addVcData.amount_awarded &&
                        addVcData.amount_awarded
                      }
                      onChange={(e) =>
                        setAddVcData({
                          ...addVcData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="amount_awarded"
                    />
                  </InputGroup> 
                  
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>VC Application</Form.Label>
                  <Form.Control
                    onChange={handleFileInput}
                    type="file"
                    name="file"
                    size="lg"
                    // value={addVcData && addVcData.vc_application && addVcData.vc_application.split('/').pop()}
                  />
                  {/* <img
                                        src={
                                            fileSelect
                                            && URL.createObjectURL(fileSelect)

                                        }
                                        alt=""
                                    /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of Order</Form.Label>
                  <DatePicker 
                    name="date_of_order"
                    data={ addVcData && addVcData.date_of_order }
                    datePickerChange={dateOfOrderHandel}
                  />
                  {/* <Form.Control
                    type="date"
                    value={
                      addVcData &&
                      addVcData.date_of_order &&
                      moment(addVcData.date_of_order).format("YYYY-MM-DD")
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="date_of_order"
                    placeholder="PC Started Date"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="result"
                    defaultValue={
                      addVcData && addVcData.result && addVcData.result
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="awarded">Awarded</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Result
            </Form.Control.Feedback>
                </Form.Group>
               
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Amount received in bank A/C</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                    type="number"
                    defaultValue={
                      addVcData &&
                      addVcData.amount_received_in_bank &&
                      addVcData.amount_received_in_bank
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="amount_received_in_bank"
                  />
                  </InputGroup> 
                  
 <p style={{color: "red", fontSize: 12}}>
            {errText && errText}
            </p>

                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label> Amount recevied in bank date </Form.Label>
                  <DatePicker 
                    name="amount_received_in_bank_date"
                    data={addVcData && addVcData.amount_received_in_bank_date}
                    datePickerChange={amountReceivedHandler}
                  />
                  {/* <Form.Control
                    name="amount_received_in_bank_date"
                    value={
                      addVcData &&
                      addVcData.amount_received_in_bank_date &&
                      moment(addVcData.amount_received_in_bank_date).format(
                        "YYYY-MM-DD"
                      )
                    }
                    type="date"
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Difference Between Amount Claimed And Rewarded(₹):
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      name="difference_between_amount_claim_reward"
                      value={
                        addVcData && addVcData.amount_awarded
                          ? addVcData.difference_between_amount_claim_reward
                          : addVcData.amount_awarded !== "" && null
                      }
                      type="number"
                      disabled={true}
                    />
                  </InputGroup>
                  
                </Form.Group>

              
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation</Form.Label>
                  <Form.Select
                    name="escalation"
                    value={
                      addVcData && addVcData.escalation && addVcData.escalation
                    }
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reason for escalation (For Yes as well as No)
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    name="reason_for_escalation"
                    defaultValue={
                      addVcData &&
                      addVcData.reason_for_escalation &&
                      addVcData.reason_for_escalation
                    }
                    type="text"
                    onChange={(e) =>
                      setAddVcData({
                        ...addVcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
              Please enter Reason for escalation (For Yes as well as No)
            </Form.Control.Feedback>
                </Form.Group>
              
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    // disabled={
                    //   addVcData && !addVcData.source
                    //     ? true
                    //     : !addVcData.lawyer
                    //     ? true
                    //     : !addVcData.applied_at
                    //     ? true
                    //     : !addVcData.authority
                    //     ? true
                    //     : !addVcData.applied_date
                    //     ? true
                    //     : !addVcData.application_number
                    //     ? true
                    //     : !addVcData.amount_claimed
                    //     ? true
                    //     : !addVcData.result
                    //     ? true
                    //     : !addVcData.reason_for_escalation
                    //     ? true
                    //     : !addVcData.status
                    //     ? true
                    //     : false
                    // }
                    // onClick={(e) => addVcFunc(e)}
                    className="submit_btn shadow-0"
                  >
                    Submit
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="addFormModal"
        show={modalVCEscalationFShow}
        onHide={setModalVCEscalationFShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {paramFlag === "edit" ? "Update Escalation" : "Add Escalation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validatedEscal1} onSubmit={handleSubmitEscal1}>
              <Row>
              <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    required
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.status &&
                      addVcEscalationData.status
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"Applied"}>Applied</option>
                    <option value={"Awarded"}>Awarded</option>
                    <option value={"Rejected"}>Rejected</option>
                    <option value={"Eacalated"}>Escalated</option>
                    <option value={"Conculded"}>Conculded</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Status
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                  Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="source"
                    required
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.source
                      
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Source
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Lawyer <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="lawyer"
                    required
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.lawyer &&
                      addVcEscalationData.lawyer
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {lawyersList &&
                      lawyersList.length > 0 &&
                      lawyersList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Lawyer
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalated At <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="escalated_at"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.escalated_at &&
                      addVcEscalationData.escalated_at._id
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {authorityTypeList &&
                      authorityTypeList.length > 0 &&
                      authorityTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && capitalize(item.name)}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select  Escalated At
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Authority <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="authority"
                    value={addVcEscalationData && addVcEscalationData.authority}
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {authorityListByAuthType &&
                      authorityListByAuthType.length > 0 &&
                      authorityListByAuthType.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {" "}
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Authority
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    name="applied_date"
                    required
                    data={addVcEscalationData && addVcEscalationData.applied_date}
                    message={"Please enter Application date"}
                    datePickerChange={escalaApplicationDateHandel}
                  />
                  {/* <Form.Control
                  required
                    type="date"
                    name="applied_date"
                    placeholder="Applied date"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.applied_date &&
                      moment(addVcEscalationData.applied_date).format(
                        "YYYY-MM-DD"
                      )
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
              Please enter Application date
            </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    type="text"
                    name="application_number"
                    defaultValue={
                      addVcEscalationData &&
                      addVcEscalationData.application_number &&
                      addVcEscalationData.application_number
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
              Please enter  Application number
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Video Conferncing</Form.Label>
                  <Form.Select
                    name="video_conferencing"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.video_conferencing &&
                      addVcEscalationData.video_conferencing
                    }
                    disabled={
                      addVcEscalationData && addVcEscalationData.source === "sa"
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount Claimed <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      required
                      name="amount_claimed"
                      defaultValue={
                        addVcEscalationData &&
                        addVcEscalationData.amount_claimed &&
                        addVcEscalationData.amount_claimed
                      }
                      onChange={(e) =>
                        setAddVcEscalationData({
                          ...addVcEscalationData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                    <Form.Control.Feedback type="invalid">
              Please enter Amount Claimed
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Amount Awarded </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="amount_awarded"
                      defaultValue={
                        addVcEscalationData &&
                        addVcEscalationData.amount_awarded &&
                        addVcEscalationData.amount_awarded
                      }
                      onChange={(e) =>
                        setAddVcEscalationData({
                          ...addVcEscalationData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </InputGroup>                  
                </Form.Group>
               
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>VC application</Form.Label>
                  <Form.Control
                    type="file"
                    
                    name="file"
                    size="lg"
                    onChange={handleFileInput}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of first order</Form.Label>
                  <DatePicker 
                    name="date_of_order"
                    datePickerChange={escalDateFirstHandel}
                    data={addVcEscalationData &&
                      addVcEscalationData.date_of_order}
                  />
                  {/* <Form.Control
                    type="date"
                    name="date_of_order"
                    placeholder="Date of first order"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.date_of_order &&
                      moment(addVcEscalationData.date_of_order).format(
                        "YYYY-MM-DD"
                      )
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  /> */}
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="result"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.result &&
                      addVcEscalationData.result
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please Select</option>
                    <option value="awarded">Awarded</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Result 
            </Form.Control.Feedback>
                </Form.Group>
              
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Amount received in bank A/C</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="amount_received_in_bank"
                      defaultValue={
                        addVcEscalationData &&
                        addVcEscalationData.amount_received_in_bank &&
                      addVcEscalationData.amount_received_in_bank
                      }
                      onChange={(e) =>
                        setAddVcEscalationData({
                          ...addVcEscalationData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                  
                   <p style={{color: "red", fontSize: 12}}>
            {errText && errText}
            </p>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Amount received in Bank Date</Form.Label>
                  <DatePicker 
                    name="amount_received_in_bank_date"
                    datePickerChange={escalAmountReceivedDateHandel}
                    data={addVcEscalationData &&
                      addVcEscalationData.amount_received_in_bank_date &&
                      addVcEscalationData.amount_received_in_bank_date}
                  />
                  {/* <Form.Control
                    type="date"
                    name="amount_received_in_bank_date"
                    defaultValue={
                      addVcEscalationData &&
                      addVcEscalationData.amount_received_in_bank_date &&
                      addVcEscalationData.amount_received_in_bank_date
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Date of first order"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Difference between amount claimed and rewarded
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      // type="text"
                      name="difference_between_amount_claim_reward"
                      value={
                        addVcEscalationData && addVcEscalationData.amount_awarded
                          ? addVcEscalationData.difference_between_amount_claim_reward
                          : addVcEscalationData.amount_awarded !== "" && null
                      }
                      type="number"
                      disabled={true}
                    />
                  </InputGroup>
                  
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation</Form.Label>
                  <Form.Select
                    name="escalation"
                    value={
                      addVcEscalationData &&
                      addVcEscalationData.escalation &&
                      addVcEscalationData.escalation
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reason For escalation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    type="text"
                    name="reason_for_escalation"
                    defaultValue={
                      addVcEscalationData &&
                      addVcEscalationData.reason_for_escalation &&
                      addVcEscalationData.reason_for_escalation
                    }
                    onChange={(e) =>
                      setAddVcEscalationData({
                        ...addVcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                    <Form.Control.Feedback type="invalid">
              Please enter Reason for escalation (For Yes as well as No)
            </Form.Control.Feedback>
                </Form.Group>
              
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => onVcEscalationCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    // disabled={
                    //   addVcEscalationData && !addVcEscalationData.source
                    //     ? true
                    //     : !addVcEscalationData.lawyer
                    //     ? true
                    //     : !addVcEscalationData.escalated_at
                    //     ? true
                    //     : !addVcEscalationData.authority
                    //     ? true
                    //     : !addVcEscalationData.applied_date
                    //     ? true
                    //     : !addVcEscalationData.application_number
                    //     ? true
                    //     : !addVcEscalationData.amount_claimed
                    //     ? true
                    //     : !addVcEscalationData.result
                    //     ? true
                    //     : !addVcEscalationData.reason_for_escalation
                    //     ? true
                    //     : !addVcEscalationData.status
                    //     ? true
                    //     : false
                    // }
                    // onClick={(e) => addVcEscalationFunc(e)}
                    className="submit_btn shadow-0"
                  >
                    Submit
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {/* {showAlert == true && (
        <Modal
          show={showAlert}
          onHide={handleCloseAlert}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="alertTextBox">
              <div className="alertTextBoxImg">
                <img src={alertImg} alt="" />
              </div>
              <h4>Please select a Survivor to Edit</h4>
              <Button variant="secondary" onClick={handleCloseAlert}>
                Close
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )} */}
      <Modal
        className="addFormModal"
        show={modalVCEscalation2FShow}
        onHide={setModalVCEscalation2FShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Escalation 2
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validatedEscal2} onSubmit={handleSubmitEscal2}>
              <Row>
              <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    required
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.status &&
                      addVcEscalation2Data.status
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"Applied"}>Applied</option>
                    <option value={"Awarded"}>Awarded</option>
                    <option value={"Rejected"}>Rejected</option>
                    <option value={"Eacalated"}>Escalated</option>
                    <option value={"Conculded"}>Conculded</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Result 
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                  Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="source"
                    required
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.source &&
                      addVcEscalation2Data.source
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Source 
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Lawyer <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="lawyer"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.lawyer &&
                      addVcEscalation2Data.lawyer
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value hidden={true}>Please select</option>
                    {lawyersList &&
                      lawyersList.length > 0 &&
                      lawyersList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Lawyer 
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalated At <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="escalated_at"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.escalated_at &&
                      addVcEscalation2Data.escalated_at._id
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {authorityTypeList &&
                      authorityTypeList.length > 0 &&
                      authorityTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && capitalize(item.name)}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select  Escalated At  
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Authority <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="authority"
                    value={
                      addVcEscalation2Data && addVcEscalation2Data.authority
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {authorityListByAuthType &&
                      authorityListByAuthType.length > 0 &&
                      authorityListByAuthType.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {" "}
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Authority
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <Form.Control
                  required
                    type="date"
                    name="applied_date"
                    placeholder="Applied date"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.applied_date &&
                      moment(addVcEscalation2Data.applied_date).format(
                        "YYYY-MM-DD"
                      )
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  /> */}

<DatePicker 
                    required
                    name="applied_date"
                    datePickerChange={onescalation2DateHandel}
                    data={addVcEscalation2Data && addVcEscalation2Data.applied_date}
                    message={"Please select Application Date"}
                  />
                   <Form.Control.Feedback type="invalid">
              Please select Application date 
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    type="text"
                    name="application_number"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.application_number &&
                      addVcEscalation2Data.application_number
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
              Please enter Application number 
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Video Conferncing</Form.Label>
                  <Form.Select
                    name="video_conferencing"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.video_conferencing === "true" ? true: false
                    }
                    disabled={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.source === "sa"
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount Claimed <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    type="number"
                    name="amount_claimed"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.amount_claimed &&
                      addVcEscalation2Data.amount_claimed
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
              Please enter Amount Claimed
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Amount Awarded </Form.Label>
                  <Form.Control
                    type="number"
                    name="amount_awarded"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.amount_awarded &&
                       addVcEscalation2Data.amount_awarded
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Form.Group>
               
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>VC application</Form.Label>
                  <Form.Control
                    type="file"
                    // required
                    name="file"
                    size="lg"
                    onChange={handleFileInput}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of first order</Form.Label>
                  {/* <Form.Control
                    type="date"
                    name="date_of_order"
                    placeholder="Date of first order"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.date_of_order &&
                      moment(addVcEscalation2Data.date_of_order).format(
                        "YYYY-MM-DD"
                      )
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />  */}

                <DatePicker 
                    name="date_of_order"
                    datePickerChange={onescalation2DateHandel}
                    data={addVcEscalation2Data && addVcEscalation2Data.date_of_order}
                  />
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="result"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.result &&
                      addVcEscalation2Data.result
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please Select</option>
                    <option value="awarded">Awarded</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Result
            </Form.Control.Feedback>
                </Form.Group>
               
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Amount received in bank A/C</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount_received_in_bank"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.amount_received_in_bank &&
                  addVcEscalation2Data.amount_received_in_bank
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <p style={{color: "red", fontSize: 12}}>
            {errText && errText}
            </p>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Amount received in Bank Date</Form.Label>
                  {/* <Form.Control
                    type="date"
                    name="amount_received_in_bank_date"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.amount_received_in_bank_date &&
                      addVcEscalation2Data.amount_received_in_bank_date
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Date of first order"
                  /> */}
                   <DatePicker 
                    name="amount_received_in_bank_date"
                    datePickerChange={onescalation2DateHandel}
                    data={addVcEscalation2Data && addVcEscalation2Data.amount_received_in_bank_date}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Difference between amount claimed and rewarded
                  </Form.Label>
                  <Form.Control
                    // type="text"
                    name="difference_between_amount_claim_reward"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.amount_awarded
                        ? addVcEscalation2Data.difference_between_amount_claim_reward
                        :addVcEscalation2Data.amount_awarded !== "" && null
                    }
                    type="number"
                    disabled={true}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation</Form.Label>
                  <Form.Select
                    name="escalation"
                    value={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.escalation &&
                      addVcEscalation2Data.escalation
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reason For escalation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    type="text"
                    name="reason_for_escalation"
                    defaultValue={
                      addVcEscalation2Data &&
                      addVcEscalation2Data.reason_for_escalation &&
                      addVcEscalation2Data.reason_for_escalation
                    }
                    onChange={(e) =>
                      setAddVcEscalation2Data({
                        ...addVcEscalation2Data,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
              Please enter Reason For escalation
            </Form.Control.Feedback>
                </Form.Group>
               
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => onVcEscalation2Cancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                   
                    className="submit_btn shadow-0"
                  >
                    Submit
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {/* {showAlert == true && (
        <Modal
          show={showAlert}
          onHide={handleCloseAlert}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="alertTextBox">
              <div className="alertTextBoxImg">
                <img src={alertImg} alt="" />
              </div>
              <h4>Please select a Survivor to Edit</h4>
              <Button variant="secondary" onClick={handleCloseAlert}>
                Close
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )} */}
            {showAlert === true && (
        <AlertComponent
        alertFlag={alertFlag}alertMessage={alertMessage} 
        goToAddEscal={onAddVcEscalation}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default SurvivorVictimCompensation;

{
  /* <Modal className="addFormModal" show={modalVCEscalationSShow} onHide={setModalVCEscalationSShow} size="lg" aria-labelledby="reason-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Escalation 2
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="site_form_wraper">
                    <Form>
                        <Row>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Source</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option>DA</option>
                                    <option>SA</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Lawyer</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Escalated At</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option>SLSA</option>
                                    <option>DLSA</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Authority</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Applied date</Form.Label>
                                <Form.Control type="date" name="applieddate" placeholder="Applied date" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Application number</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Amount Claimed </Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Video Conferncing</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>VC application</Form.Label>
                                <Form.Control
                                    type="file"
                                    required
                                    name="file"
                                    size="lg"
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Date of first oder</Form.Label>
                                <Form.Control type="date" name="dob" placeholder="Date of first oder" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Result</Form.Label>
                                <Form.Select>
                                    <option hidde={true}>Please Select</option>
                                    <option>Awarded</option>
                                    <option>Rejected</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Amount Awarded </Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Amount received in bank A/C</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Amount received in Bank Date</Form.Label>
                                <Form.Control type="date" name="dob" placeholder="Date of first oder" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Difference between amount claimed and rewarded</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Escalation</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Reason For escalation</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>status</Form.Label>
                                <Form.Select>
                                    <option hidden={true}>Please select</option>
                                    <option value={"Applied"}>Applied</option>
                                    <option value={"Awarded"}>Awarded</option>
                                    <option value={"Rejected"}>Rejected</option>
                                    <option value={"Eacalated"}>Eacalated</option>
                                    <option value={"Conculded"}>Conculded</option>
                                </Form.Select>
                            </Form.Group>                            
                        </Row>
                        <Row className="justify-content-between">
                            <Form.Group as={Col} md="auto">
                                <MDBBtn type="button" className="shadow-0 cancle_btn" color='danger' onClick={() => setModalVCEscalationSShow(false)}>Cancel</MDBBtn>
                            </Form.Group>
                            <Form.Group as={Col} md="auto">
                                <Button type="submit" className="submit_btn shadow-0">Submit</Button>
                            </Form.Group>
                        </Row>
                    </Form>
                </div>
            </Modal.Body>
        </Modal> */
}
