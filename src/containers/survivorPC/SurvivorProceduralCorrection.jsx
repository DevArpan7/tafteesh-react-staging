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
import { Button, Form, Row, Col } from "react-bootstrap";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import {
  getSurvivalDocList,
  getFirList,
  getInvestigationList,
  getChargeSheetList,
  getSurvivorPcList,
  getSurvivorDetails,
  getPcEscalationList,
  getPcWhyList,
  getPcCurrentStatusList,
  getPcResultofProsecutionList,
  getPcDocumentTypeList,
  getPcEscalatedTypeList,
  getPcEscalationReasonList,
  getCourtList,
  getSurvivorLawyersList,
  getChangeLog
} from "../../redux/action";
import moment from "moment";
import DataTablePcFilter from "./DataTablePcFilter";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";


const SurvivorProceduralCorrection = (props) => {
  const [modalPCShow, setModalPCShow] = useState(false);
  const [modalPCEscalationShow, setModalPCEscalationShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivorPcList = useSelector((state) => state.survivorPcList);
  const [addPcData, setAddPcData] = useState({});
  const [addPcEscalationData, setAddPcEscalationData] = useState({});
  const pcWhyList = useSelector((state) => state.pcWhyList);
  const pcCurrentStatusList = useSelector((state) => state.pcCurrentStatusList);
  const pcResultofProsecutionList = useSelector(
    (state) => state.pcResultofProsecutionList
  );
  const pcDocumentTypeList = useSelector((state) => state.pcDocumentTypeList);
  const pcEscalatedTypeList = useSelector((state) => state.pcEscalatedTypeList);
  const pcEscalationReasonList = useSelector(
    (state) => state.pcEscalationReasonList
  );
  const pcEscalationList = useSelector((state) => state.pcEscalationList);
  const survivalDocList = useSelector((state) => state.survivalDocList);
  const firList = useSelector((state) => state.firList);
  const investigationList = useSelector((state) => state.investigationList);
  const chargeSheetList = useSelector((state) => state.chargeSheetList);

  const courtList = useSelector((state) => state.courtList);
  const [pcEscSelected, setPcEscalSelected] = useState({});
  const [activePcEscalClass, setActivePcEscalClass] = useState(false);
  const [modalInactiveShow, setmodalInactiveShow] = useState(false);
  const [docId, setDocId] = useState("");
  const [reason, setReason] = useState({});
  const survivorLawyersList = useSelector((state) => state.survivorLawyersList);
  const[esclFlag,setEsclFlag] = useState("")
  const [validated, setValidated] = useState(false);
  const [validatedEscal1,setValidatedEscal1] = useState(false)
  const [alertFlag,setAlertFlag] = useState('')
const [alertMessage,setAlertMessage]= useState('')

  const deletedById= localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [messagType, setMessagType] = useState('')
  
  
  console.log(survivorLawyersList,"survivorLawyersList")
  const handleShow = () => {
    console.log("select")
    setShowAlert(true);
  }
  
  const handleCloseAlert = () =>{ 
    setAlertMessage('')
    setAlertFlag('')
    setShowAlert(false);
  }
  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorPcList(props.location.state));
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getSurvivalDocList(props.location.state));
      dispatch(getFirList(props.location.state));
      dispatch(getInvestigationList(props.location.state));
      dispatch(getChargeSheetList(props.location.state));
      dispatch(getSurvivorLawyersList(props.location.state));
    }
    dispatch(getPcWhyList());
    dispatch(getPcCurrentStatusList());
    dispatch(getPcResultofProsecutionList());
    dispatch(getPcDocumentTypeList());
    dispatch(getPcEscalatedTypeList());
    dispatch(getPcEscalationReasonList());
    dispatch(getCourtList());
  }, [props]);
  const [pictureData, setPictureData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://kamo-api.herokuapp.com/api";
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
// const handleCloseAlert = () => setShowAlert(false);
const [erorMessage, setErorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
console.log(survivorPcList,'pcccccccccccccccccccc')
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivorPcList]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onSelectRow = (item) => {
    console.log(item, "item");
    // if (item._id && item.escalation_required && item.escalation_required === true) {

    //     alert("PC Escalation is True But Escalation is not added yet, Please add Escalation !!!")
    // }
    setSelectedData(item);
    setActiveClass(true);
    if(item && item.escalation_required && item.escalation_required === true){
      setAlertFlag("add");
      setAlertMessage("Escalation marked YES, Would you like add ?")
      handleShow()
    }
    else{
      setShowAlert(false);
    }
  };
  const onGotoAddPc = () => {
    setModalPCShow(true);
    setSelectedData({});
    setAddPcData({});
  };

  const onGotoEditPc = () => {
    if (!selectedData._id) {
      alert("Please a PC to edit");
    } else {
      setModalPCShow(true);
      setAddPcData(selectedData);
    }
  };

  const onCancel = () => {
    setModalPCShow(false);
    setAddPcData({});
    setActiveClass(false);
    setPictureData({});
  };

  const onSelectedPcEscal = (item) => {
    setPcEscalSelected(item);
    setActivePcEscalClass(true);
  };




  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one PC");
    } else {
      setShowAlert(true);
    }
  };

   //////// delete function call //////////
   const onDeleteChangeEscalFunc = (flag) => {
    
    setEsclFlag(flag)
    if (pcEscSelected && !pcEscSelected._id) {
      alert("Please select one PC escalation");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    let body ={
      deleted_by : deletedById && deletedById,
      deleted_by_ref: deletedByRef && deletedByRef
    }
    // addPcEscalationData
    if(esclFlag==="escal"){
      axios
      .patch(api + "/pc-escalation/delete/" + pcEscSelected._id,body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        setPcEscalSelected({})
        if (response.data && response.data.error === false) {
          const { data } = response;
          setEsclFlag("");
          dispatch(getPcEscalationList(selectedData && selectedData._id));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
    } else{
    axios
      .patch(api + "/survival-pc/delete/" + selectedData._id,body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({})
          dispatch(getSurvivorPcList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
    }
  };

  console.log(addPcEscalationData, "addPcEscalationData");
  const onGotoAddPcEscalation = () => {
    if (selectedData && selectedData._id) {
      setShowAlert(false)
      setModalPCEscalationShow(true);
      setAddPcEscalationData({
        ...addPcEscalationData,
        source: selectedData && selectedData.source,
        pc_started_date: selectedData && selectedData.started_date,
        current_status:
          selectedData &&
          selectedData.current_status &&
          selectedData.current_status._id,
      });
      // setAddPcEscalationData({});
    } else {
      alert("Please select One PC to add Escalation !!");
      
    }
  };

  // useEffect(() => {
  //   setAddPcEscalationData({
  //     ...addPcEscalationData,
  //    "sa": selectedData && selectedData.sa,
  //    "pc_started_date":  selectedData && selectedData.started_date,
  //    "current_status":selectedData && selectedData.current_status &&
  //    selectedData.current_status._id
  //   });
  // }, [selectedData&& selectedData]);

  const onGotoEditPcEscalation = () => {
    if (pcEscSelected && !pcEscSelected._id) {
      alert("Please select One Escalation to edit");
    } else {
      setModalPCEscalationShow(true);
      setAddPcEscalationData(pcEscSelected);
    }
  };

  const onVcEscalationCancel = () => {
    setModalPCEscalationShow(false);
    setAddPcEscalationData({});
  };


  const changeLogFunc=()=>{
    let type= "pcescalation"
    dispatch(getChangeLog(type,deletedById))
    props.history.push("/change-log")
  }

  useEffect(() => {
    dispatch(getPcEscalationList(selectedData && selectedData._id));
  }, [selectedData && selectedData._id]);

  useEffect(() => {
    //console.log(addPcData, "addPcData");
  }, [addPcData]);

  /////////////////////file upload function/////////////////////////
  const handleFileInput = (e) => {
    //console.log(e, e.target.files[0]);
    let data = e.target.files[0];

    // setFileSelect(e.target.files[0]);
    storeFile(data);
  };

  const storeFile = (file) => {
    //console.log(file, "file");
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        "https://kamo-api.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
       
          
        console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response;
          //console.log(data, "dataaa");
          setAddPcData({
            ...addPcData,
            document_url:
              "https://kamo-api.herokuapp.com/" + data.data.filePath,
          });
          setAddPcEscalationData({
            ...addPcEscalationData,
            document_url:
              "https://kamo-api.herokuapp.com/" + data.data.filePath,
          });
          setPictureData(data.data.filePath);
          //console.log(pictureData);
          
        }
        else{
          setUpdateMessage(response.data.data.message)
          setMessagType("error")  
        }
      })
      .catch((err) => {
        console.log(err,"err")
        handleClick();
            setUpdateMessage(err.data.message)
            setMessagType("error")  
              });
  };
console.log(addPcData,"url")

  const handleSubmit = (event) => {
    console.log(event,"habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {

      if(addPcData && addPcData._id){
        setValidated(false);
        addPcFunc(event);
      }else{
      event.preventDefault();
      event.stopPropagation();
    }
   } else{
      addPcFunc(event);
    }
    setValidated(true);

  }

  ///////////// add pc api call function /////////

  const addPcFunc = (e) => {
    e.preventDefault();

    let updateData= {
      "user_id" : deletedById && deletedById,
      ...addPcData,
      "survivor": props.location && props.location.state

  }
  let addData ={
      ...addPcData,
      "survivor": props.location && props.location.state
  }
    
    console.log("body", addPcData);
    if (addPcData && addPcData._id) {
      axios
        .patch(api + "/survival-pc/update/" + addPcData._id, updateData, axiosConfig)
        .then((response) => {
          //console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setValidated(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivorPcList(props.location.state));
            setModalPCShow(false);
            setAddPcData({});
            // setActiveClass(false);
            // setAddPcEscalationData({})
          }
        })
        .catch((error) => {
          //console.log(error, "fir add error");
        });
    } else {
      axios
        .post(api + "/survival-pc/create", addData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setValidated(false);
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            dispatch(getSurvivorPcList(props.location.state));
            setModalPCShow(false);
            setAddPcData({});
            setPictureData({});
            // setActiveClass(false);
            setAddPcEscalationData({});
          }
        })
        .catch((error) => {
          //console.log(error);
          // setUpdateMessage(error && error.message)
        });
    }
  };


  const handleSubmitescal = (event) => {
    console.log(event,"habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else{
      addPcEscalationFunc(event);
    }
    setValidatedEscal1(true);

  }
  ////////////// API CALL FUCTION FOR ADD AND UPDATE PC ESCALATION ////////
  const addPcEscalationFunc = (e) => {
    e.preventDefault();
    // console.warn(pictureData, profile);
    var body = {
      ...addPcEscalationData,
      survivor: props.location.state,
      survivor_pc: selectedData && selectedData._id,
    };
    //console.log("body", body);
    if (addPcEscalationData && addPcEscalationData._id) {
      axios
        .patch(
          api + "/pc-escalation/update/" + addPcEscalationData._id,
          body,
          axiosConfig
        )
        .then((response) => {
          //console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setValidatedEscal1(false)
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivorPcList(props.location.state));
            dispatch(getPcEscalationList(selectedData && selectedData._id));
            setModalPCEscalationShow(false);
            setAddPcData({});
            // setActiveClass(false);
            setAddPcEscalationData({});
          }
        })
        .catch((error) => {
          //console.log(error, "fir add error");
        });
    } else {
      axios
        .post(api + "/pc-escalation/create", body, axiosConfig)
        .then((res) => {
          //console.log(res);
          handleClick();
          dispatch(getPcEscalationList(selectedData && selectedData._id));
          setValidatedEscal1(false)
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            dispatch(getSurvivorPcList(props.location.state));
            setModalPCEscalationShow(false);
            setAddPcData({});
            setPictureData({});
            // setActiveClass(false);
            setAddPcEscalationData({});
          }
        })
        .catch((error) => {
          //console.log(error);
          // setUpdateMessage(error && error.message)
        });
    }
  };

  const downloadFile = ({ data, fileName, fileType }) => {
    //console.log(data, fileName, fileType);
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
  const gotoReasonModal = (data) => {
    setmodalInactiveShow(true);
    setDocId(data._id);
  };

  const addToggleInActiveFunc = (e) => {
    e.preventDefault();

    axios
      .patch(
        api + "/survival-document/toggle-active/" + docId,
        reason,
        axiosConfig
      )
      .then((response) => {
        //console.log(response);
        handleClick();
        setUpdateMessage(response && response.data.message);

        if (response.data && response.data.error === false) {
          const { data } = response;
          dispatch(getSurvivalDocList(props.location.state));
          setmodalInactiveShow(false);
        } else {
          handleClick();
          setUpdateMessage(response && response.data.message);
        }
      })
      .catch((error) => {
        //console.log(error, "error");
        handleClick();
        setUpdateMessage(error && error.message);
      });
  };
  //////////////// for csv function ////

  const downloadCsvFile = ({ data, fileName, fileType }) => {
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
  let exportData=[];
  {(survivorPcList).map((x)=>{
    exportData.push({ _id:x._id, survivor:x.survivor,source:x.source, doc_path:x.doc_path, doc_ref:x.doc_ref, started_date:x.started_date,why:x.why.name,court:x.court.name,current_status:x.current_status.name,result_of_prosecution:x.result_of_prosecution.name,document_type:x.document_type.name,document_url:x.document_url,result_of_pc:x.result_of_pc,escalation_required:x.escalation_required,escalation_type:x.escalation_type.name,escalation_reason:x.escalation_reason.name})
  })}
  const exportToCsv = (e) => {
    //console.log(e, "e");
    e.preventDefault();

    // Headers for each column
    let headers = [
      "Id,Survivor,Source,DocPath,DocRef,StartedDate,Why,Court,CurrentSTatus,ResultOfPresecution,DocumentType,DocumentUrl,ResultOfPc,EscalationRequired,EscalationType,EscalationReason",
    ];

    
    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const { _id, survivor,source, doc_path, doc_ref, started_date,why,court,current_status,result_of_prosecution,document_type,document_url,result_of_pc,escalation_required,escalation_type,escalation_reason } = user;
      acc.push(
        [ _id, survivor,source.toUpperCase(), doc_path, doc_ref, moment(started_date).format("DD-MMM-YYYY"),why,court,current_status,result_of_prosecution,document_type,document_url,result_of_pc,escalation_required,escalation_type,escalation_reason].join(",")
      );
      return acc;
    }, []);

    downloadCsvFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "survivorPcList.csv",
      fileType: "text/csv",
    });
  };

  const startedDateHandler = (e) =>{
    setAddPcData({
      ...addPcData,
      [e.target.name]: e.target.value,
    })
  }

  const escalaDateHandler = (e) =>{
    setAddPcEscalationData({
      ...addPcEscalationData,
      [e.target.name]: e.target.value,
    })
  }

  const fileDateHandler = (e) =>[
    setAddPcEscalationData({
      ...addPcEscalationData,
      [e.target.name]: e.target.value,
    })
  ]

  const downloadPdf = ()=>{
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
    doc.text("SURVIVOR PROCEDURAL CORRECTION LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Id","Survivor","Source","DocPath","DocRef","StartedDate","Why","Court","CurrentSTatus","ResultOfPresecution","DocumentType","DocumentUrl","ResultOfPc","EscalationRequired","EscalationType","EscalationReason"
    ];
    const name = "survivor-pc-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
       item._id, item.survivor,item.source.toUpperCase(), item.doc_path, item.doc_ref, moment(item.started_date).format("DD-MMM-YYYY"),item.why,item.court,item.current_status,item.result_of_prosecution,item.document_type,item.document_url,item.result_of_pc,item.escalation_required,item.escalation_type,item.escalation_reason
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
    doc.save(name);
  }

  return (
    <>
      <Topbar />
      <main className="main_body">
        <NotificationPage
          handleClose={handleClose}
          open={open}
          message={updateMessage}
          type={messagType}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Procedural Correction</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>PC</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topProcedural topcartbar Correctioncartbar white_box_shadow">
            <SurvivorTopCardExtra survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            <div className="vieweditdelete">
              <Dropdown className="me-1">
                <Dropdown.Toggle variant="border" className="shadow-0">
                  Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={(e) => exportToCsv(e)}>
                    Download CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(e) => downloadPdf(e)}>
                    Download PDF
                  </Dropdown.Item>
                  <Dropdown.Item onClick={()=>changeLogFunc()}>Change Log</Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => onGotoAddPcEscalation()}
                  >
                    Add Escalation
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add"
              >
                <span onClick={() => onGotoAddPc()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <sapn onClick={() => onGotoEditPc()}>
                  <i className="fal fa-pencil"></i>
                </sapn>
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
              <DataTablePcFilter
                survivorPcList={
                  survivorPcList && survivorPcList.length > 0 && survivorPcList
                }
                survivorName={
                  survivorDetails && 
                  survivorDetails.survivor_name &&
                  survivorDetails.survivor_name
                } isLoading={isLoading}
                onSelectRow={onSelectRow}
              />
             
            </div>
          </div>
          {pcEscalationList && pcEscalationList.length > 0 && (
            <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
              <div className="vieweditdelete">
                <MDBTooltip
                  tag="button"
                  wrapperProps={{ className: "add_btn view_btn" }}
                  title="Add"
                >
                  <span onClick={() => onGotoAddPcEscalation()}>
                    <i className="fal fa-plus-circle"></i>
                  </span>
                </MDBTooltip>
                <MDBTooltip
                  tag="a"
                  wrapperProps={{ className: "edit_btn" }}
                  title="Edit"
                >
                  <sapn onClick={() => onGotoEditPcEscalation()}>
                    <i className="fal fa-pencil"></i>
                  </sapn>
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
                      <th width="16.66%">Source</th>
                      <th width="16.66%">PC Started Date</th>
                      <th width="16.66%">Escalated type</th>
                      <th width="16.66%">Date of Escalation</th>
                      <th width="16.66%">Registration number</th>
                      <th width="16.66%">Date of file</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pcEscalationList &&
                      pcEscalationList.length > 0 ?
                      pcEscalationList.map((item) => {
                        return (
                          <tr
                            className={[
                              item._id === pcEscSelected._id &&
                                activePcEscalClass === true &&
                                "current",
                            ]}
                            onClick={() => onSelectedPcEscal(item)}
                          >
                            <td>
                              {item && item.source && item.source.toUpperCase()}
                            </td>
                            <td>
                              {item &&
                                item.pc_started_date &&
                                moment(item.pc_started_date).format(
                                  "DD-MMM-YYYY"
                                )}
                            </td>
                            <td>
                              {item &&
                                item.escalted_type &&
                                item.escalted_type.name}
                            </td>
                            <td>
                              {item &&
                                item.date_of_escalation &&
                                moment(item.date_of_escalation).format(
                                  "DD-MMM-YYYY"
                                )}
                            </td>
                            <td>
                              {item &&
                                item.registration_number &&
                                item.registration_number}
                            </td>
                            <td>
                              {item &&
                                item.date_of_file &&
                                moment(item.date_of_file).format("DD-MMM-YYYY")}
                            </td>
                          </tr>
                        );
                      })
                      
                      :
                      <tr>
                      <td className="text-center" colSpan={6}>
                           <b>NO Data Found !!</b>
                       </td>
                   </tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="white_box_shadow mt-4 survivors_table_wrap position-relative">
            <MDBAccordion
              flush
              // initialActive={1}
            >
              <MDBAccordionItem
                className="tableAccordionWrap tableAccordionWrap-uppercase"
                collapseId={1}
                headerTitle="List of Documents"
              >
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="15%">Type</th>
                        <th>Document</th>
                        {/* <th>Document Date</th> */}
                        <th>Uploaded Date</th>
                        <th>Notes</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {survivalDocList &&
                      survivalDocList.data &&
                      survivalDocList.data.length > 0 ? (
                        survivalDocList.data.map((item) => {
                          return (
                            <>
                            {item && item.file !=="" ?
                            
                            <tr>
                              <td>
                                {item &&
                                  item.document_type &&
                                  item.document_type.name.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.file &&
                                  item.file.split("_").pop()}
                              </td>
                              {/* <td>18-03-2022</td> */}
                              <td>
                                {item &&
                                  item.createdAt &&
                                  moment(item.createdAt).format("DD-MMM-YYYY")}
                              </td>
                              <td>
                                {item &&
                                  item.inactive_reason &&
                                  item.inactive_reason}
                              </td>
                             
                              <td>
                              {item && item.file && item.file &&
                                <Dropdown className="tablebutton">
                                  <Dropdown.Toggle
                                    variant="border-gray"
                                    className="shadow-0"
                                  >
                                    Action
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    <Dropdown.Item   href={item && item.file && item.file}
                                  // onClick={() =>
                                  //   downloadFile(
                                  //     item.file,
                                  //     item.file.split("_").pop(),
                                  //     item.file.split(".").pop()
                                  //   )
                                  // }
                                  >
                                      Download
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      as="button"
                                      onClick={() => gotoReasonModal(item)}
                                    >
                                      Inactive
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                        }
                              </td>
                            </tr>
                        : <></>}</>
                          );
                        })
                      ) : (
                        <tr>
                        <td className="text-center" colSpan={5}>
                             <b>NO Data Found !!</b>
                         </td>
                     </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </MDBAccordionItem>
            </MDBAccordion>
          </div>

          <div className="white_box_shadow mt-4 survivors_table_wrap position-relative">
            <MDBAccordion
              flush
              // initialActive={1}
            >
              <MDBAccordionItem
                className="tableAccordionWrap tableAccordionWrap-uppercase"
                collapseId={1}
                headerTitle="List of fir"
              >
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="15%">Source</th>
                        <th>FIR Number</th>
                        <th>FIR Date</th>
                        {/* <th>Sections</th>
                                                <th width="24%">Accused</th> */}
                        <th width="14%">Police Station</th>
                      </tr>
                    </thead>
                    <tbody>
                      {firList && firList.data && firList.data.length > 0 ? (
                        firList.data.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item &&
                                  item.location &&
                                  item.location.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.fir &&
                                  item.fir.number &&
                                  item.fir.number}
                              </td>
                              <td>
                                {item &&
                                  item.fir &&
                                  item.fir.date &&
                                  moment(item.fir.date).format("DD-MMM-YYYY")}
                              </td>
                              {/* <td></td>
                                                <td>{item && item.location && item.location}</td> */}
                              <td>
                                {item &&
                                  item.policeStation &&
                                  item.policeStation.name &&
                                  item.policeStation.name}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                        <td className="text-center" colSpan={4}>
                             <b>NO Data Found !!</b>
                         </td>
                     </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </MDBAccordionItem>
            </MDBAccordion>
          </div>

          <div className="white_box_shadow mt-4 survivors_table_wrap position-relative">
            <MDBAccordion
              flush
              // initialActive={1}
            >
              <MDBAccordionItem
                className="tableAccordionWrap tableAccordionWrap-uppercase"
                collapseId={1}
                headerTitle="List of Lawyers for PC (Readonly) for a particulr survivor"
              >
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="15%">Source</th>
                        <th>Lawyer</th>
                        <th>Type</th>
                        <th>Is Leading</th>
                        <th width="12%">From Date</th>
                        <th width="12%">To Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {survivorLawyersList &&
                        survivorLawyersList.length > 0 ?
                        survivorLawyersList.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item.source && item.source.toUpperCase()}
                              </td>
                              <td>{item.name && item.name.name}</td>
                              <td>{item.type && item.type.name}</td>
                              <td>{item.isleading && item.isleading === true? "Yes" : "No"}</td>
                              <td>
                                {item.from_date &&
                                  
                                    moment(item.from_date)
                                    .format("DD-MMM-YYYY")}
                              </td>
                              <td>
                                {item.to_date &&
                                  
                                    moment(item.to_date)
                                    .format("DD-MMM-YYYY")}
                              </td>
                            </tr>
                          );
                        })
                      :
                      <tr>
                      <td className="text-center" colSpan={6}>
                           <b>NO Data Found !!</b>
                       </td>
                   </tr>}
                    </tbody>
                  </table>
                </div>
              </MDBAccordionItem>
            </MDBAccordion>
          </div>

          <div className="white_box_shadow mt-4 survivors_table_wrap position-relative">
            <MDBAccordion
              flush
              // initialActive={1}
            >
              <MDBAccordionItem
                className="tableAccordionWrap tableAccordionWrap-uppercase"
                collapseId={1}
                headerTitle="List of Investigation for a particulr survivor"
              >
                <div className="table-responsive big-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="15%">Source</th>
                        <th>Investigation Agency type</th>
                        <th>Agency name</th>
                        <th>Officer Rank</th>
                        <th>investigation status</th>
                        <th>investigation result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investigationList && investigationList.length > 0 ? (
                        investigationList.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item &&
                                  item.source &&
                                  item.source.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.type_of_investigation_agency &&
                                  item.type_of_investigation_agency}
                              </td>
                              <td>
                                {item &&
                                  item.name_of_agency &&
                                  item.name_of_agency}
                              </td>
                              <td>
                                {item &&
                                  item.rank_of_inv_officer &&
                                  item.rank_of_inv_officer}
                              </td>
                              <td>
                                {item &&
                                  item.status_of_investigation &&
                                  item.status_of_investigation}
                              </td>
                              <td>
                                {item &&
                                  item.result_of_inv &&
                                  item.result_of_inv}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                        <td className="text-center" colSpan={6}>
                             <b>NO Data Found !!</b>
                         </td>
                     </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </MDBAccordionItem>
            </MDBAccordion>
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalPCShow}
        onHide={setModalPCShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Procedural Correction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="source"
                    value={addPcData && addPcData.source && addPcData.source}
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please enter Source Date 
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Started Date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    required
                    name="started_date"
                    datePickerChange={startedDateHandler}
                    data={addPcData && addPcData.started_date}
                    message={"Please enter Started Date"}
                  />
                  {/* <Form.Control
                    required
                    type="date"
                    name="started_date"
                    value={
                      addPcData &&
                      addPcData.started_date &&
                      moment(addPcData.started_date).format("YYYY-MM-DD")
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="PC Started Date"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Started Date 
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Why? <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="why"
                    value={addPcData && addPcData.why && addPcData.why._id}
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option  value={""} hidden={true}>Please select</option>
                    {pcWhyList &&
                      pcWhyList.length > 0 &&
                      pcWhyList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name.toUpperCase()}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Why
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Court <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="court"
                    value={addPcData && addPcData.court && addPcData.court._id}
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {courtList &&
                      courtList.length > 0 &&
                      courtList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Court
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Current Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="current_status"
                    value={
                      addPcData &&
                      addPcData.current_status &&
                      addPcData.current_status._id
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcCurrentStatusList &&
                      pcCurrentStatusList.length > 0 &&
                      pcCurrentStatusList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name.toUpperCase()}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Current Status 
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result of prosecution{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="result_of_prosecution"
                    value={
                      addPcData &&
                      addPcData.result_of_prosecution &&
                      addPcData.result_of_prosecution._id
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcResultofProsecutionList &&
                      pcResultofProsecutionList.length > 0 &&
                      pcResultofProsecutionList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select  Result of prosecution
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Document Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="document_type"
                    value={
                      addPcData &&
                      addPcData.document_type &&
                      addPcData.document_type._id
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcDocumentTypeList &&
                      pcDocumentTypeList.length > 0 &&
                      pcDocumentTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Document Type
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Document</Form.Label>
                  <Form.Control
                    onChange={handleFileInput}
                    type="file"
                    // required
                    name="file"
                    size="lg"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result of PC <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="result_of_pc"
                    value={
                      addPcData &&
                      addPcData.result_of_pc &&
                      addPcData.result_of_pc
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"success"}>Success</option>
                    <option value={"rejected"}>Rejected</option>
                  </Form.Select>  
                  <Form.Control.Feedback type="invalid">
              Please select Result of PC
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reference FIR/Investigation/Chragesheet Type{" "}
                  </Form.Label>
                  <Form.Select
                  required
                    name="doc_ref"
                    value={addPcData && addPcData.doc_ref}
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="survivorFirs">Survivor FIR</option>
                    <option value="survivorInvestigations">
                      Survivor Investigation
                    </option>
                    <option value="survivorChargeSheets">
                      Survivor ChargeSheet
                    </option>
                  </Form.Select>
                </Form.Group>
                {addPcData && !addPcData.doc_ref && (
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Reference Number</Form.Label>
                    <Form.Select>
                      <option hidden={true}>Please select</option>
                    </Form.Select>
                  </Form.Group>
                )}
                {addPcData &&
                  addPcData.doc_ref &&
                  addPcData.doc_ref === "survivorFirs" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcData &&
                          addPcData.doc_ref &&
                          addPcData.doc_ref === "survivorFirs" &&
                          "FIR"}{" "}
                        Number
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcData && addPcData.doc_path && addPcData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcData({
                            ...addPcData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>
                        {firList &&
                          firList.data &&
                          firList.data.length > 0 &&
                          firList.data.map((item) => {
                            //console.log(item);

                            return (
                              <option value={item._id}>
                                {item && item.fir && item.fir.number}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}{" "}
                {addPcData && addPcData.doc_ref === "survivorInvestigations" && (
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>
                      Reference{" "}
                      {addPcData &&
                        addPcData.doc_ref &&
                        addPcData.doc_ref === "survivorInvestigations" &&
                        "Investigation"}{" "}
                      Numebr
                    </Form.Label>
                    <Form.Select
                      name="doc_path"
                      value={
                        addPcData && addPcData.doc_path && addPcData.doc_path
                      }
                      onChange={(e) =>
                        setAddPcData({
                          ...addPcData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={true}>Please select</option>

                      {investigationList &&
                        investigationList.length > 0 &&
                        investigationList.map((item) => {
                          console.log(item,"return")
                          return (
                            <option value={item._id}>
                              {item &&
                                item.name_of_agency +
                                  "/" +
                                  item.name_of_inv_officer}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                )}
                {addPcData &&
                  addPcData.doc_ref &&
                  addPcData.doc_ref === "survivorChargeSheets" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcData &&
                          addPcData.doc_ref &&
                          addPcData.doc_ref === "survivorChargeSheets" &&
                          "ChargeSheet"}{" "}
                        Number
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcData && addPcData.doc_path && addPcData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcData({
                            ...addPcData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>

                        {chargeSheetList &&
                          chargeSheetList.length > 0 &&
                          chargeSheetList.map((item) => {
                            return (
                              <option value={item & item._id}>
                                {item &&
                                  item.charge_sheet &&
                                  item.charge_sheet.number}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalation Required <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="escalation_required"
                    value={
                      addPcData &&
                      addPcData.escalation_required &&
                      addPcData.escalation_required
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Escalated Required
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalated type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    value={
                      addPcData &&
                      addPcData.escalation_type &&
                      addPcData.escalation_type._id
                    }
                    name="escalation_type"
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcEscalatedTypeList &&
                      pcEscalatedTypeList.length > 0 &&
                      pcEscalatedTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Escalated type
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalation Reason <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="escalation_reason"
                    value={
                      addPcData &&
                      addPcData.escalation_reason &&
                      addPcData.escalation_reason._id
                    }
                    onChange={(e) =>
                      setAddPcData({
                        ...addPcData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcEscalationReasonList &&
                      pcEscalationReasonList.length > 0 &&
                      pcEscalationReasonList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Escalation Reason 
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
                    //   addPcData && !addPcData.sa
                    //     ? true
                    //     : !addPcData.started_date
                    //     ? true
                    //     : !addPcData.why
                    //     ? true
                    //     : !addPcData.court
                    //     ? true
                    //     : !addPcData.current_status
                    //     ? true
                    //     : !addPcData.result_of_prosecution
                    //     ? true
                    //     : !addPcData.document_type
                    //     ? true
                    //     : !addPcData.result_of_pc
                    //     ? true
                    //     : !addPcData.escalation_required
                    //     ? true
                    //     : !addPcData.escalation_type
                    //     ? true
                    //     : !addPcData.escalation_reason
                    //     ? true
                    //     : false
                    // }
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
        show={modalPCEscalationShow}
        onHide={setModalPCEscalationShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Escalation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validatedEscal1} onSubmit={handleSubmitescal}
            // onSubmit={(e) => addPcEscalationFunc(e)}
            >
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Source</Form.Label>
                  <Form.Select
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.source &&
                      addPcEscalationData.source
                    }
                    disabled={true}
                    // onChange={(e) =>
                    //   setAddPcEscalationData({
                    //     ...addPcEscalationData,
                    //     [e.target.name]: e.target.value,
                    //   })
                    // }
                    name="source"
                  >
                    <option hidden={true}>Please select</option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                  
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>PC Started Date</Form.Label>
                  <Form.Control
                    // type="date"
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.pc_started_date &&
                      moment(addPcEscalationData.pc_started_date).format(
                        "DD-MMM-YYYY"
                      )
                    }
                    disabled={true}
                    name="pc_started_date"
                    placeholder="PC Started Date"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Current Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    value={
                      addPcEscalationData && addPcEscalationData.current_status
                    }
                    disabled={true}
                    name="current_status"
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcCurrentStatusList &&
                      pcCurrentStatusList.length > 0 &&
                      pcCurrentStatusList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Current Status 
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalated type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="escalted_type"
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.escalted_type &&
                      addPcEscalationData.escalted_type._id
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcEscalatedTypeList &&
                      pcEscalatedTypeList.length > 0 &&
                      pcEscalatedTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select  Escalated type
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of Escalation</Form.Label>
                  <DatePicker 
                    name="date_of_escalation"
                    datePickerChange={escalaDateHandler}
                    data={addPcEscalationData &&
                    addPcEscalationData.date_of_escalation}
                  />
                  {/* <Form.Control
                    type="date"
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.date_of_escalation &&
                      moment(addPcEscalationData.date_of_escalation).format(
                        "YYYY-MM-DD"
                      )
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="date_of_escalation"
                    placeholder="PC Started Date"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Registration number</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={
                      addPcEscalationData &&
                      addPcEscalationData.registration_number &&
                      addPcEscalationData.registration_number
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="registration_number"
                    placeholder=""
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of file</Form.Label>
                  <DatePicker 
                    name="date_of_file"
                    datePickerChange={fileDateHandler}
                    data={addPcEscalationData &&
                      addPcEscalationData.date_of_file}
                  />
                  {/* <Form.Control
                    type="date"
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.date_of_file &&
                      moment(addPcEscalationData.date_of_file).format(
                        "YYYY-MM-DD"
                      )
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="date_of_file"
                    placeholder="PC Started Date"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reason for WRIT/Appeal/Contempt{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    defaultValue={
                      addPcEscalationData &&
                      addPcEscalationData.reason_for_writ_appeal_contemt &&
                      addPcEscalationData.reason_for_writ_appeal_contemt
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="reason_for_writ_appeal_contemt"
                  />
                  <Form.Control.Feedback type="invalid">
              Please enter Reason for WRIT/Appeal/Contempt
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Status of WRIT/Appeal/Contempt</Form.Label>
                  <Form.Control
                    defaultValue={
                      addPcEscalationData &&
                      addPcEscalationData.status_of_writ_appeal_contempt &&
                      addPcEscalationData.status_of_writ_appeal_contempt
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="status_of_writ_appeal_contempt"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Document Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.document_type &&
                      addPcEscalationData.document_type._id
                    }
                    name="document_type"
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcDocumentTypeList &&
                      pcDocumentTypeList.length > 0 &&
                      pcDocumentTypeList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Document Type
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Document</Form.Label>
                  <Form.Control
                    onChange={handleFileInput}
                    type="file"
                    // required
                    name="file"
                    size="lg"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Result of Escalation <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.result_of_escalation &&
                      addPcEscalationData.result_of_escalation
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="result_of_escalation"
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"writ"}>Writ</option>
                    <option value={"contempt"}>Contempt</option>
                    <option value={"revisions"}>Revisions</option>
                    <option value={"petitions"}>Petitions</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Result of Escalation
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Reference Type </Form.Label>
                  <Form.Select
                    name="doc_ref"
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.doc_ref &&
                      addPcEscalationData.doc_ref
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value="survivorFirs">Survivor Fir</option>
                    <option value="survivorInvestigations">
                      Survivor Investigation
                    </option>
                    <option value="survivorChargeSheets">
                      Survivor ChargeSheet
                    </option>
                  </Form.Select>
                </Form.Group>
                {addPcEscalationData && !addPcEscalationData.doc_ref && (
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Reference Number</Form.Label>
                    <Form.Select>
                      <option hidden={true}>Please select</option>
                    </Form.Select>
                  </Form.Group>
                )}
                {addPcEscalationData &&
                  addPcEscalationData.doc_ref &&
                  addPcEscalationData.doc_ref === "survivorFirs" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcEscalationData &&
                          addPcEscalationData.doc_ref &&
                          addPcEscalationData.doc_ref === "survivorFirs" &&
                          "FIR"}{" "}
                        Number
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcEscalationData &&
                          addPcEscalationData.doc_path &&
                          addPcEscalationData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcEscalationData({
                            ...addPcEscalationData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>
                        {firList &&
                          firList.data &&
                          firList.data.length > 0 &&
                          firList.data.map((item) => {
                            //console.log(item);

                            return (
                              <option value={item._id}>
                                {item && item.fir && item.fir.number}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}{" "}
                {addPcEscalationData &&
                  addPcEscalationData.doc_ref === "survivorInvestigations" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcEscalationData &&
                          addPcEscalationData.doc_ref &&
                          addPcEscalationData.doc_ref ===
                            "survivorInvestigations" &&
                          "Investigation"}{" "}
                        Numebr
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcEscalationData &&
                          addPcEscalationData.doc_path &&
                          addPcEscalationData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcEscalationData({
                            ...addPcEscalationData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>

                        {investigationList &&
                          investigationList.length > 0 &&
                          investigationList.map((item) => {
                            console.log(item, "invest");
                            return (
                              <option value={item._id}>
                                {item &&
                                  item.name_of_agency +
                                    "/" +
                                    item.name_of_inv_officer}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}
                {addPcEscalationData &&
                  addPcEscalationData.doc_ref &&
                  addPcEscalationData.doc_ref === "survivorChargeSheets" && (
                    <Form.Group as={Col} md="6" className="mb-3">
                      <Form.Label>
                        Reference{" "}
                        {addPcEscalationData &&
                          addPcEscalationData.doc_ref &&
                          addPcEscalationData.doc_ref ===
                            "survivorChargeSheets" &&
                          "ChargeSheet"}{" "}
                        Number
                      </Form.Label>
                      <Form.Select
                        name="doc_path"
                        value={
                          addPcEscalationData &&
                          addPcEscalationData.doc_path &&
                          addPcEscalationData.doc_path
                        }
                        onChange={(e) =>
                          setAddPcEscalationData({
                            ...addPcEscalationData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option hidden={true}>Please select</option>

                        {chargeSheetList &&
                          chargeSheetList.length > 0 &&
                          chargeSheetList.map((item) => {
                            return (
                              <option value={item & item._id}>
                                {item &&
                                  item.charge_sheet &&
                                  item.charge_sheet.number}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  )}
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    What is concluded <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.what_is_concluded &&
                      addPcEscalationData.what_is_concluded
                    }
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="what_is_concluded"
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"convicted"}>Convicted</option>
                    <option value={"aquital"}>Aquital</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select  What is concluded
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalation Required <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.escalation_required &&
                      addPcEscalationData.escalation_required
                    }
                    name="escalation_required"
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Escalation Required
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Escalation Reason <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    onChange={(e) =>
                      setAddPcEscalationData({
                        ...addPcEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addPcEscalationData &&
                      addPcEscalationData.escalation_reason &&
                      addPcEscalationData.escalation_reason._id
                    }
                    name="escalation_reason"
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {pcEscalationReasonList &&
                      pcEscalationReasonList.length > 0 &&
                      pcEscalationReasonList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Escalation Reason
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
                  <Button type="submit" className="submit_btn shadow-0">
                    Submit
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        dialogClassName={"inactivemodal"}
        show={modalInactiveShow}
        onHide={setmodalInactiveShow}
        size="md"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-box">
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows="4"
                  name="inactive_reason"
                  onChange={(e) =>
                    setReason({
                      ...reason,
                      [e.target.name]: e.target.value,
                    })
                  }
                  placeholder="Enter the Reason"
                />
              </Form.Group>
              <Form.Group className="text-end">
                <Button
                  className="submit_btn shadow-0"
                  disabled={reason && !reason.inactive_reason ? true : false}
                  onClick={(e) => addToggleInActiveFunc(e)}
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {showAlert === true && (
        <AlertComponent
        alertFlag={alertFlag}alertMessage={alertMessage} 
        showAlert={showAlert}
        goToAddEscal={onGotoAddPcEscalation}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default SurvivorProceduralCorrection;
