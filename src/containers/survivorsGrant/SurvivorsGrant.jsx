import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCard } from "../../components";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorDetails,
  getGrantList,
  getCourtList,
  getMortgageList,
  getSurvivaLGrantList,
  getChangeLog
} from "../../redux/action";

import "./survivorsgrant.css";
import moment from "moment";
import GrantDataTable from "./GrantDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";

const SurvivorsGrant = (props) => {
  const [modalGrantShow, setModalGrantShow] = useState(false);
  const [modalUtilizationShow, setModalUtilizationShow] = useState(false);
  const [modalInstallmentShow, setModalInstallmentShow] = useState(false);
  const [modalEscalationShow, setModalEscalationShow] = useState(false);
  const [addGrantData, setAddGrantData] = useState({});
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const grantList = useSelector((state) => state.grantList);
  const courtList = useSelector((state) => state.courtList);
  const mortgageList = useSelector((state) => state.mortgageList);
  const survivalGrantList = useSelector((state) => state.survivalGrantList);
  const [addUtilizationData, setAddUtilizationData] = useState({});
  const [pictureData, setPictureData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [selectFile, setSelectFile] = useState("");
  const [addInstallmentData, setAddInstallmentData] = useState({});
  const [addEscalationData, setAddEscalationData] = useState({});
  const [addEscalationArr, setaddEscalationArr] = useState([]);
  const [addUtilizationArr, setAddUtilizationArr] = useState([]);
  const [addInstArr, setAddInstArr] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");

  const deletedById= localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
const [validated, setValidated] = useState(false);
const [validatedUtil, setValidatedUtil] = useState(false);
const [validatedescal,setValidatedescal] = useState(false)
const [validatedInstl,setValidatedInstl] = useState(false)

  
  
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  console.log(
    grantList,
    "grantList",
    courtList,
    "courtList",
    mortgageList,
    "mortgageList"
  );


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivalGrantList]);

  const changeLogFunc=()=>{
    let type= "grant"
    dispatch(getChangeLog(type,deletedById))
    props.history.push("/change-log")
  }

  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getSurvivaLGrantList(props.location.state));
    }
    dispatch(getGrantList());
    dispatch(getCourtList());
    dispatch(getMortgageList());
  }, [props]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValidated(false);
    setOpen(false);
  };

  const onSelectRow = (item) => {
    setSelectedData(item);
    setActiveClass(true);
  };

  const gotoAddGrant = () => {
    setSelectedData({});
    setAddGrantData({});
    setModalGrantShow(true);
  };
  const ongotoEditGrant = () => {
    setModalGrantShow(true);
    setAddGrantData(selectedData);
  };


  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Income");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    let body ={
      deleted_by : deletedById && deletedById,
      deleted_by_ref: deletedByRef && deletedByRef
    }
    axios
      .patch(api + "/survival-grant/delete/" + selectedData._id,body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({})
          dispatch(getSurvivaLGrantList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };

  useEffect(() => {
    if(addGrantData && (addGrantData.name_of_grant_compensation &&addGrantData.name_of_grant_compensation._id)){
          setAddGrantData({
            ...addGrantData,
            purpose_of_grant: addGrantData && addGrantData.name_of_grant_compensation && addGrantData.name_of_grant_compensation.purpose_of_grant,
          });
    }
    else{
    let purpose = grantList.filter(
      (x) => x._id === addGrantData.name_of_grant_compensation
    );
    setAddGrantData({
      ...addGrantData,
      purpose_of_grant: purpose.length > 0 ? purpose[0].purpose_of_grant : null,
    });

    console.log(purpose, "purpose");
}
  }, [addGrantData && addGrantData.name_of_grant_compensation]);

  //////////// for UTILIZATION /////START//////////
  const gotoAddUtilize = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Grant");
    } else {
      setModalUtilizationShow(true);    
  };
    // if (selectedData && selectedData.utilization_plans && selectedData.utilization_plans.length > 0) {
    //     setAddUtilizationArr([...addUtilizationArr, selectedData.utilization_plans])
    // }
  };

  /////////////////END///////////////////////////

  ///////// for INSTALLMENT////START///////////////

  const gotoAddInstallment = () => {
     //////// delete function call //////////
    if (selectedData && !selectedData._id) {
      alert("Please select one Grant");
    } else {
      setModalInstallmentShow(true);    
  };
    if (
      selectedData &&
      selectedData.installments &&
      selectedData.installments.length > 0
    ) {
      setAddInstArr([...addInstArr, selectedData.installments]);
    }
  };

  useEffect(() => {
    console.log(addInstallmentData, "addInstallmentData");
    if (addInstallmentData.estimated_date && addInstallmentData.amount) {
      setAddInstArr([...addInstArr, addInstallmentData]);
    }
  }, [addInstallmentData]);

  /////////////////END////////////////////////////////////////////////

  const gotoAddEscalation = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Grant");
    } else {
      setModalEscalationShow(true);    
  };
  };
 
  console.log(addGrantData, "addGrantData");

  /////////////////////file upload function/////////////////////////
  const onDocumentChange = (e, flag) => {
    console.log(flag, "flag");
    console.log(e, e.target.files[0]);
    let data = e.target.files[0];
    setSelectFile(e.target.files[0]);
    storeFile(data, flag);
  };

  const storeFile = (file, flag) => {
    console.log(file, flag, "flaggg");
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
          if (flag === true) {
            setAddEscalationData({
              ...addEscalationData,
              reference_document:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
          } else {
            setAddGrantData({
              ...addGrantData,
              reference_document:
                "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
            });
            setPictureData(data.data.filePath);
            console.log(addGrantData, pictureData);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if(selectedData && selectedData._id){
      addGrantFunc(event);

      }else{
      event.preventDefault();
      event.stopPropagation();
      }
    } else {
      addGrantFunc(event);
    }
    setValidated(true);
  };
  const addGrantFunc = (e) => {
    e.preventDefault();
    var addData = {
      ...addGrantData,
      survivor: props.location && props.location.state
    };
    var updateData = {
      ...addGrantData,
      survivor: props.location && props.location.state,
      user_id : deletedById && deletedById
    };

    if (selectedData && selectedData._id) {
      axios
        .patch(
          api + "/survival-grant/update/" + selectedData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setValidated(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivaLGrantList(props.location.state));
            setAddInstallmentData({});
            setAddUtilizationData({});
            setAddGrantData({});
            // setSelectedData({});
            setAddEscalationData({});
            setModalGrantShow(false);
            setModalUtilizationShow(false);
            setModalInstallmentShow(false);
            setModalEscalationShow(false);
          }
        })
        .catch((error) => {
          console.log(error, "fir add error");
        });
    } else {
      axios
        .post(api + "/survival-grant/create", addData, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setValidated(false);
          setAddGrantData({});
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivaLGrantList(props.location.state));
            setModalGrantShow(false);
          }
        })
        .catch((error) => {
          console.log(error, "grant add error");
        });
    }
  };

const onUtilCancel=()=>{
  setAddUtilizationData({})
setModalUtilizationShow(false)
setValidatedUtil(false)
}

const onInstalCancel=()=>{
  setAddInstallmentData({})
  setModalInstallmentShow(false)
  setValidatedInstl(false)
  }

  const onEscalCancel=()=>{
    setAddEscalationData({})
    setModalEscalationShow(false)
    setValidatedescal(false)
    }

    const numberFormat = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);


  const handleSubmitutil = (event,flag) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      addGrantInstFunc(event,flag);
    }
    setValidatedInstl(true)
    setValidatedescal(true)
    setValidatedUtil(true)
  };

   ////// API CALL FOR ADD UTILISATION/INSTALMET/ESCALATION FUNCTION ///////

  const addGrantInstFunc = (e, flag) => {
    e.preventDefault();
    let addData = {};
    // let instal = {}
    // let escal = {};
    if (flag === "util") {
      addData = {
        utilization: [addUtilizationData],
        survivor: props.location && props.location.state,
      };
    } else if (flag === "instal") {
      addData = {
        installment: [addInstallmentData],
        survivor: props.location && props.location.state,
      };
    } else if (flag === "escal") {
      addData = {
        escalation: [addEscalationData],
        survivor: props.location && props.location.state,
      };
    }

    console.log(addData, "addData");
    axios
      .patch(
        api +
          "/survival-grant/add-escalation-installment-utilization/" +
          selectedData._id,
        addData,
        axiosConfig
      )
      .then((response) => {
        console.log(response);
        handleClick();
        setUpdateMessage(response && response.data.message);
        setValidatedUtil(false)
        setValidatedInstl(false)
        setValidatedescal(false)
        if (response.data && response.data.error === false) {
          const { data } = response;
          dispatch(getSurvivaLGrantList(props.location.state));
          setAddInstallmentData({});
          setAddUtilizationData({});
          setAddGrantData({});
          // setSelectedData({});
          setAddEscalationData({});
          setModalGrantShow(false);
          setModalUtilizationShow(false);
          setModalInstallmentShow(false);
          setModalEscalationShow(false);
        }
      })
      .catch((error) => {
        console.log(error, "fir add error");
      });
  };

  const grandAppliedDateHandel = (e) =>{
    setAddGrantData({
      ...addGrantData,
      [e.target.name]: e.target.value,
    })
  }

  const grandreceivedDateHandel = (e) =>{
    setAddGrantData({
      ...addGrantData,
      [e.target.name]: e.target.value,
    })
  }

  const estimatedDateChangeHandel = (e) =>{
    setAddInstallmentData({
      ...addInstallmentData,
      [e.target.name]: e.target.value,
    })
  }

  const escalaOnDateChangeHandel = (e) =>{
    setAddEscalationData({
      ...addEscalationData,
      [e.target.name]: e.target.value,
    })
  }

  const escalaRecivedOnDate = (e) =>{
    setAddEscalationData({
      ...addEscalationData,
      [e.target.name]: e.target.value,
    })
  }
console.log(survivalGrantList,'granttttttttttttt')
const formatDate = (value) => {
  return moment(value).format("DD-MMM-YYYY");
};
const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType })

  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}
let exportData=[];
survivalGrantList.map((x)=>{
  exportData.push({id:x._id,amountRequested:x.amount_requested,applicationNumber:x.application_number,appliedOn:formatDate(x.applied_on),approvedAmount:x.approved_amount,createdAt:formatDate(x.createdAt),installment_number:x.installment_number,reason_for_escalation:x.reason_for_escalation,received_on:formatDate(x.received_on),refDoc:x.reference_document,refResultDoc:x.reference_result_document,status:x.status,grantCompensationAmount:x.name_of_grant_compensation.amount,
    grantCompensationName:x.name_of_grant_compensation.name,purposeOfGrant:x.name_of_grant_compensation.purpose_of_grant,grantCompensationInstallment:x.name_of_grant_compensation.installment_number,
  utilizationPlanAmount:x.utilization_plans?.map((y)=>{return y.amount}),utilizationPlanDesc:x.utilization_plans?.map((y)=>{return y.description}),installMentAmount:x.installments?.map((y)=>{return y.amount}),installMentDate:x.installments?.map((y)=>{return formatDate(y.estimated_date)}),escalationAmountRequested:x.escalations?.map((y)=>{return y.amount_requested}),escalatedOn:x.escalations?.map((y)=>{return formatDate(y.escalated_on)}),escalationAmountreceived:x.escalations?.map((y)=>{return formatDate(y.received_on)}),escalationAmountRefDoc:x.escalations?.map((y)=>{return y.reference_document}),createdAt:formatDate(x.createdAt)})
})
console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
const exportToCsv = e => {
  e.preventDefault()

  // Headers for each column
  let headers = [' Id,Amount Requested,Application Number,Applied On,Amount Approved,Installment Number,Name Of Grant Compensation,Purpose Of Grant,Grant Compensation Amount,Compensation Installment Number,Reason For Escalation,Reference Doc,Reference Result Doc,Status,Survivor,Utilization Amount,Utilization Desc,Escalation Amount Requested,Escalated On,Escalation Received On,Escalation Ref Doc,Installment Amount,Installment Date,createdAt']

  // Convert users data to a csv
  let usersCsv = exportData.reduce((acc, user) => {
    const { id,amountRequested,applicationNumber,appliedOn,approvedAmount,installment_number,grantCompensationName,grantCompensationAmount,grantCompensationInstallment,reason_for_escalation,refDoc,reference_result_document,status,survivor,utilizationPlanAmount,utilizationPlanDesc,escalationAmountRequested,escalatedOn,escalationAmountreceived,escalationAmountRefDoc,installMentAmount,installMentDate,createdAt} = user
    acc.push([ id,amountRequested,applicationNumber,appliedOn,approvedAmount,installment_number,grantCompensationName,grantCompensationAmount,grantCompensationInstallment,reason_for_escalation,refDoc,reference_result_document,status,survivor,utilizationPlanAmount,utilizationPlanDesc,escalationAmountRequested,escalatedOn,escalationAmountreceived,escalationAmountRefDoc,installMentAmount,installMentDate,createdAt].join(','))
    return acc
  }, [])

  downloadFile({
    data: [...headers, ...usersCsv].join('\n'),
    fileName: 'grantList.csv',
    fileType: 'text/csv',
  })
}

////////////download pdf////////////////
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
  doc.text("SURVIVOR GRANT LIST", 22, 60);
  doc.setFontSize(10);
  const survivorColumns = [
    'Id','Amount Requested','Application Number','Applied On','Amount Approved','Installment Number','Name Of Grant Compensation','Purpose Of Grant','Grant Compensation Amount','Compensation Installment Number','Reason For Escalation','Reference Doc','Reference Result Doc','Status','Survivor','Utilization Amount','Utilization Desc','Escalation Amount Requested','Escalated On','Escalation Received On','Escalation Ref Doc','Installment Amount','Installment Date','createdAt'
  ];
  const name = "survivor-lawyer-list" + new Date().toISOString() + ".pdf";
  let goalsRows = [];
  exportData?.forEach((item) => {
    const temp = [
      item.id,item.amountRequested,item.applicationNumber,item.appliedOn,item.approvedAmount,item.installment_number,item.grantCompensationName,item.grantCompensationAmount,item.grantCompensationInstallment,item.reason_for_escalation,item.refDoc,item.reference_result_document,item.status,item.survivor,item.utilizationPlanAmount,item.utilizationPlanDesc,item.escalationAmountRequested,item.escalatedOn,item.escalationAmountreceived,item.escalationAmountRefDoc,item.installMentAmount,item.installMentDate,item.createdAt    ];
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
        />

        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Grant</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Grant</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            <div className="vieweditdelete">
              <Dropdown className="me-1">
                <Dropdown.Toggle variant="border" className="shadow-0">
                  Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={()=>getChangeLog()}>Change Log</Dropdown.Item>
                  <Dropdown.Item onClick={exportToCsv}>Export CSV</Dropdown.Item>
                  <Dropdown.Item onClick={downloadPdf}>Download PDF</Dropdown.Item>

                  <Dropdown.Item onClick={() => gotoAddUtilize()}>
                    Utilization Plan
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => gotoAddInstallment()}>
                    Installments
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => gotoAddEscalation()}>
                    Escalation
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add"
              >
                <span onClick={() => gotoAddGrant()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => ongotoEditGrant()}>
                  <i className="fal fa-pencil"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{className: "delete_btn" }}
                title="Delete"
              >
               <span onClick={() => onDeleteChangeFunc()}>
                  <i className="fal fa-trash-alt"></i>
                </span>
              </MDBTooltip>
            </div>
            {selectedData && selectedData.approved_amount && (
              <h4 className="mb-4 small_heading">
                Total grant/compensation (Approved / Received so far):
                {selectedData &&
                  numberFormat(selectedData.approved_amount) 
                 }
                /
                {selectedData &&
                  numberFormat(selectedData.received_amount_so_far)
                  }
              </h4>
            )}
            <div className="table-responsive medium-mobile-responsive">
              <GrantDataTable
                survivalGrantList={
                  survivalGrantList &&
                  survivalGrantList.length > 0 &&
                  survivalGrantList
                }
                onSelectRow={onSelectRow}
                isLoading={isLoading}
              />
              {/* <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="5%">Sr#</th>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Applied</th>
                                        <th>Application Number</th>
                                        <th>Received</th>
                                        <th>Installments</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {survivalGrantList && survivalGrantList.length > 0 ? survivalGrantList.map((item, index) => {
                                        let idx = index + 1
                                        return (
                                            <tr className={[item._id === selectedData._id && activeClass === true && 'current']}
                                                onClick={() => onSelectRow(item)}>
                                                <td>{idx && idx}</td>
                                                <td>{item && item.name_of_grant_compensation && item.name_of_grant_compensation.name && item.name_of_grant_compensation.name}</td>
                                                <td>{item && item.amount_requested && item.amount_requested}</td>
                                                <td>{item && item.applied_on && moment(item.applied_on).format("DD/MM/YYYY")}</td>
                                                <td>{item && item.application_number && item.application_number}</td>
                                                <td>{item && item.received_on && moment(item.received_on).format("DD/MM/YYYY")}</td>
                                                <td>{item && item.installment_number && item.installment_number}</td>

                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                            <td className="text-center" colSpan={7}>
                                                <b>NO Data Found !!</b>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table> */}
            </div>
          </div>
          {selectedData &&
            selectedData.utilization_plans &&
            selectedData.utilization_plans.length > 0 && (
              <div className="white_box_shadow vieweditdeleteMargin survivors_table_wrap position-relative">
                <MDBAccordion flush initialActive={1}>
                  <MDBAccordionItem
                    className="tableAccordionWrap"
                    collapseId={1}
                    headerTitle="Utilization Plan"
                  >
                    <div className="vieweditdelete">
                      <MDBTooltip
                        tag="button"
                        wrapperProps={{ className: "add_btn view_btn" }}
                        title="Add"
                      >
                        <span onClick={() => setModalUtilizationShow(true)}>
                          <i className="fal fa-plus-circle"></i>
                        </span>
                      </MDBTooltip>
                      {/* <MDBTooltip tag="a" wrapperProps={{ href: '/#', className: "edit_btn" }} title='Edit'>
                                            <i className="fal fa-pencil"></i>
                                        </MDBTooltip> */}
                      <MDBTooltip
                        tag="a"
                        wrapperProps={{ className: "delete_btn" }}
                        title="Delete"
                      >
                        <i className="fal fa-trash-alt"></i>
                      </MDBTooltip>
                    </div>
                    <table className="table table-borderless mb-0">
                      <thead>
                        <tr>
                          <th width="60%">Utilization</th>
                          <th width="40%">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* <tr>
                                                <td>Description</td>
                                                <td>150000</td>
                                            </tr> */}
                        {selectedData &&
                          selectedData.utilization_plans &&
                          selectedData.utilization_plans.length > 0 &&
                          selectedData.utilization_plans?.map((item) => {
                            return (
                              <tr>
                                <td>
                                  {item && item.description && item.description}
                                </td>
                                <td>{item && item.amount && numberFormat(item.amount)}</td>{" "}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </MDBAccordionItem>
                </MDBAccordion>
              </div>
            )}
          {selectedData &&
            selectedData.installments &&
            selectedData.installments.length > 0 && (
              <div className="white_box_shadow vieweditdeleteMargin survivors_table_wrap position-relative">
                <MDBAccordion flush initialActive={1}>
                  <MDBAccordionItem
                    className="tableAccordionWrap"
                    collapseId={1}
                    headerTitle="Installments"
                  >
                    <div className="vieweditdelete">
                      <MDBTooltip
                        tag="button"
                        wrapperProps={{ className: "add_btn view_btn" }}
                        title="Add"
                      >
                        <span onClick={() => gotoAddInstallment()}>
                          <i className="fal fa-plus-circle"></i>
                        </span>
                      </MDBTooltip>
                      {/* <MDBTooltip tag="a" wrapperProps={{ href: '/#', className: "edit_btn" }} title='Edit'>
                                            <i className="fal fa-pencil"></i>
                                        </MDBTooltip> */}
                      <MDBTooltip
                        tag="a"
                        wrapperProps={{ className: "delete_btn" }}
                        title="Delete"
                      >
                        <i className="fal fa-trash-alt"></i>
                      </MDBTooltip>
                    </div>
                    <table className="table table-borderless mb-0">
                      <thead>
                        <tr>
                          <th width="15%">Installment</th>
                          <th width="40%">Estimated Date</th>
                          <th width="20%">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData &&
                          selectedData.installments &&
                          selectedData.installments.length > 0 &&
                          selectedData.installments?.map((item) => {
                            return (
                              <tr>
                                <td>
                                  {item && item.installment && item.installment}
                                </td>
                                <td>
                                  {item &&
                                    item.estimated_date &&
                                    moment(item.estimated_date).format(
                                      "DD-MMM-YYYY"
                                    )}
                                </td>
                                <td>{item && item.amount && numberFormat(item.amount)}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </MDBAccordionItem>
                </MDBAccordion>
              </div>
            )}

          {selectedData &&
            selectedData.escalations &&
            selectedData.escalations.length > 0 && (
              <div className="white_box_shadow vieweditdeleteMargin survivors_table_wrap position-relative">
                <MDBAccordion flush initialActive={1}>
                  <MDBAccordionItem
                    className="tableAccordionWrap"
                    collapseId={1}
                    headerTitle="Escalation"
                  >
                    <div className="vieweditdelete">
                      <MDBTooltip
                        tag="button"
                        wrapperProps={{ className: "add_btn view_btn" }}
                        title="Add"
                      >
                        <span onClick={() => setModalEscalationShow(true)}>
                          <i className="fal fa-plus-circle"></i>
                        </span>
                      </MDBTooltip>
                      {/* <MDBTooltip tag="a" wrapperProps={{ href: '/#', className: "edit_btn" }} title='Edit'>
                                            <i className="fal fa-pencil"></i>
                                        </MDBTooltip> */}
                      <MDBTooltip
                        tag="a"
                        wrapperProps={{ className: "delete_btn" }}
                        title="Delete"
                      >
                        <i className="fal fa-trash-alt"></i>
                      </MDBTooltip>
                    </div>
                    <div className="table-responsive medium-mobile-responsive">
                      <table className="table table-borderless mb-0">
                        <thead>
                          <tr>
                            <th width="10%">Sr#</th>
                            <th width="15%">Application no.</th>
                            <th width="18%">Escalated to</th>
                            <th width="18%">Escalated on (date)</th>
                            <th width="18%">Ref.Document</th>
                            <th width="18%">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedData &&
                            selectedData.escalations &&
                            selectedData.escalations.length > 0 &&
                            selectedData.escalations?.map((item, index) => {
                              let idx = index + 1;
                              return (
                                <tr>
                                  <td>{idx && idx}</td>
                                  <td>
                                    {item &&
                                      item.application_number &&
                                      item.application_number}
                                  </td>
                                  <td>
                                    {item &&
                                      item.escalated_to &&
                                      item.escalated_to}
                                  </td>
                                  <td>
                                    {item &&
                                      item.escalated_on &&
                                      moment(item.escalated_on).format(
                                        "DD-MMM-YYYY"
                                      )}
                                  </td>
                                  <td>
                                    <a
                                      className="download"
                                      href={
                                        item &&
                                        item.reference_document &&
                                        item.reference_document
                                      }
                                    >
                                      {item &&
                                        item.reference_document &&
                                        item.reference_document
                                          .split("/")
                                          .pop()}
                                    </a>
                                  </td>
                                  <td>
                                    {item &&
                                      item.reason_for_escalation &&
                                      item.reason_for_escalation}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </MDBAccordionItem>
                </MDBAccordion>
              </div>
            )}
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalGrantShow}
        onHide={setModalGrantShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           {selectedData && selectedData._id ? "Update Grant" : "Add Grant"} 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Name of grant/compensation</Form.Label>
                  <Form.Select
                    name="name_of_grant_compensation"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addGrantData &&
                      addGrantData.name_of_grant_compensation &&
                      addGrantData.name_of_grant_compensation._id
                    }
                  >
                    <option hidden={true}>Please select</option>
                    {grantList &&
                      grantList.length > 0 &&
                      grantList?.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Applied on <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    required
                    name="applied_on"
                    data={addGrantData &&
                      addGrantData.applied_on}
                    message={"Please Add Date"}
                    datePickerChange={grandAppliedDateHandel}
                  />
                  {/* <Form.Control
                    required
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="applied_on"
                    type="date"
                    value={
                      addGrantData &&
                      addGrantData.applied_on &&
                      moment(addGrantData.applied_on).format("YYYY-MM-DD")
                    }
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Purpose of grant</Form.Label>
                  <Form.Control
                    name="purpose_of_grant"
                    // onChange={(e) => setAddGrantData({
                    //     ...addGrantData,
                    //     [e.target.name]: e.target.value
                    // })}
                    disabled={true}
                    value={
                      addGrantData &&
                      addGrantData.purpose_of_grant &&
                      addGrantData.purpose_of_grant
                    }
                  />
                  {/* <option hidden={true}>Please select</option>
                                        {grantList && grantList.length > 0 && grantList.map((item) => {
                                            return (
                                                <option value={item && item.purpose_of_grant}>{item && item.purpose_of_grant}</option>

                                            )
                                        })}
                                    </Form.Select> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="application_number"
                    type="text"
                    defaultValue={
                      addGrantData && addGrantData.application_number
                    }
                  />
                   <Form.Control.Feedback type="invalid">
                    Please enter Application Number 
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount requested <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      required
                      onChange={(e) =>
                        setAddGrantData({
                          ...addGrantData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="amount_requested"
                      type="number"
                      defaultValue={addGrantData && addGrantData.amount_requested}
                    />
                  </InputGroup>                  
                  <Form.Control.Feedback type="invalid">
                    Please enter Amount requested 
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={addGrantData && addGrantData.status}
                  >
                    <option hidden={true}>Please select</option>
                    <option value="requested">Requested</option>
                    <option value="rejected">Rejected</option>
                    <option value="approved">Approved</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reference document <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    required
                    name="file"
                    size="lg"
                    onChange={(e) => onDocumentChange(e, false)}
                  />
                    <Form.Control.Feedback type="invalid">
                    Please enter Reference document
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Approved Amount</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                      <Form.Control
                      name="approved_amount"
                      type="number"
                      onChange={(e) =>
                        setAddGrantData({
                          ...addGrantData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      defaultValue={addGrantData && addGrantData.approved_amount}
                    />
                  </InputGroup>                  
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received On</Form.Label>
                  <DatePicker 
                    name="received_on"
                    data={addGrantData &&
                      addGrantData.received_on}
                    message={"Please Add Date"}
                    datePickerChange={grandreceivedDateHandel}
                  />
                  {/* <Form.Control
                    type="date"
                    name="received_on"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addGrantData &&
                      addGrantData.received_on &&
                      moment(addGrantData.received_on).format("YYYY-MM-DD")
                    }
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received Amount So far</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="received_amount_so_far"
                      onChange={(e) =>
                        setAddGrantData({
                          ...addGrantData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      defaultValue={
                        addGrantData && addGrantData.received_amount_so_far
                      }
                    />
                  </InputGroup>                   
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Reference result document </Form.Label>
                  <Form.Select
                    name="reference_result_document"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addGrantData && addGrantData.reference_result_document
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value="approval">Approval</option>
                    <option value="rejection">Rejection</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Installements </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="installment_number"
                    type="number"
                    defaultValue={
                      addGrantData && addGrantData.installment_number
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation </Form.Label>
                  <Form.Select
                    name="escalation"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={addGrantData && addGrantData.escalation}
                  >
                    <option hidden={true}>Please select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Reason for escalation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    name="reason_for_escalation"
                    type="text"
                    as="textarea"
                    onChange={(e) =>
                      setAddGrantData({
                        ...addGrantData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    defaultValue={
                      addGrantData && addGrantData.reason_for_escalation
                    }
                  />
                   <Form.Control.Feedback type="invalid">
                    Please enter  Reason for escalation
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setModalGrantShow(false)}
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

      <Modal
        className="addFormModal"
        show={modalUtilizationShow}
        onHide={setModalUtilizationShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Utilization
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validatedUtil} onSubmit={(e)=>handleSubmitutil(e, "util")}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Description<span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    name="description"
                    type="text"
                    onChange={(e) =>
                      setAddUtilizationData({
                        ...addUtilizationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter  Description
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount<span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                  required
                    onChange={(e) =>
                      setAddUtilizationData({
                        ...addUtilizationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    type="number"
                    name="amount"
                  />
                  </InputGroup> 
                  
                    <Form.Control.Feedback type="invalid">
                    Please enter Amount
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() =>onUtilCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    // disabled={
                    //   addUtilizationData && !addUtilizationData.description
                    //     ? true
                    //     : !addUtilizationData.amount
                    //     ? true
                    //     : false
                    // }
                    // onClick={(e) => addGrantInstFunc(e, "util")}
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
        show={modalInstallmentShow}
        onHide={setModalInstallmentShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Installment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validatedInstl} onSubmit={(e)=>handleSubmitutil(e, "instal")}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Installment #</Form.Label>
                  <Form.Control
                  
                    name="installment"
                    onChange={(e) =>
                      setAddInstallmentData({
                        ...addInstallmentData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    type="text"
                  />
                   
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Estimated date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                  data={addInstallmentData && addInstallmentData.estimated_date}
                    required
                    name="estimated_date"
                    datePickerChange={estimatedDateChangeHandel}
                    message={"Please enter Estimated date"}
                    // data={}
                  />
                  {/* <Form.Control
                    required
                    type="date"
                    name="estimated_date"
                    onChange={(e) =>
                      setAddInstallmentData({
                        ...addInstallmentData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Received On"
                  />
                    <Form.Control.Feedback type="invalid">
                    Please enter Estimated date
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Amount<span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      required
                        onChange={(e) =>
                          setAddInstallmentData({
                            ...addInstallmentData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        type="number"
                        name="amount"
                      />
                  </InputGroup>
                  
                   <Form.Control.Feedback type="invalid">
                    Please enter Amount
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => onInstalCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    // disabled={
                    //   addInstallmentData && !addInstallmentData.estimated_date
                    //     ? true
                    //     : !addInstallmentData.amount
                    //     ? true
                    //     : false
                    // }
                    // onClick={(e) => addGrantInstFunc(e, "instal")}
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
        show={modalEscalationShow}
        onHide={setModalEscalationShow}
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
            <Form noValidate validated={validatedescal} onSubmit={(e)=>handleSubmitutil(e, "escal")}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalated to</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    type="text"
                    name="escalated_to"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalated on (date)</Form.Label>
                  <DatePicker 
                    name="escalated_on"
                    datePickerChange={escalaOnDateChangeHandel}
                    data={addEscalationData && addEscalationData.escalated_on}
                  />
                  {/* <Form.Control
                    type="date"
                    name="escalated_on"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Escalated Date"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Application Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    type="text"
                    name="application_number"
                  />
                    <Form.Control.Feedback type="invalid">
                    Please enter Application Number
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount requested <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                    required
                      onChange={(e) =>
                        setAddEscalationData({
                          ...addEscalationData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      type="number"
                      name="amount_requested"
                    />
                  </InputGroup>
                   <Form.Control.Feedback type="invalid">
                    Please enter  Amount requested
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value="requested">Requested</option>
                    <option value="rejected">Rejected</option>
                    <option value="approved">Approved</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Reference document <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    required
                    name="file"
                    size="lg"
                    onChange={(e) => onDocumentChange(e, true)}
                  />
                    <Form.Control.Feedback type="invalid">
                    Please enter Reference document 
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received On</Form.Label>
                  <DatePicker 
                    name="received_on"
                    datePickerChange={escalaRecivedOnDate}
                    data={addEscalationData && addEscalationData.received_on}
                  />
                  {/* <Form.Control
                    type="date"
                    name="received_on"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Received On"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received Amount</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    ₹
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="received_amount"
                      onChange={(e) =>
                        setAddEscalationData({
                          ...addEscalationData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                  
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Reference result document </Form.Label>
                  <Form.Select
                    name="reference_result_document"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select</option>
                    <option value="approval">Approval</option>
                    <option value="rejection">Rejection</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Installements</Form.Label>
                  <Form.Control
                    name="installement_number"
                    type="text"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Escalation</Form.Label>
                  <Form.Select
                    name="escalation"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Plea se select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Reason for Escalation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    as="textarea"
                    rows="4"
                    name="reason_for_escalation"
                    onChange={(e) =>
                      setAddEscalationData({
                        ...addEscalationData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Reason for Escalation"
                  />
                    <Form.Control.Feedback type="invalid">
                    Please enter  Reason for Escalation
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => onEscalCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    // disabled={
                    //   addEscalationData && !addEscalationData.application_number
                    //     ? true
                    //     : !addEscalationData.amount_requested
                    //     ? true
                    //     : !addEscalationData.reference_document
                    //     ? true
                    //     : !addEscalationData.reason_for_escalation
                    //     ? true
                    //     : false
                    // }
                    // onClick={(e) => addGrantInstFunc(e, "escal")}
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
      {showAlert === true && (
        <AlertComponent
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default SurvivorsGrant;
