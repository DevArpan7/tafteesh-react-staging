import React, { useState, useEffect, useRef } from "react";
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
import { Button, Form, Row, Col } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import { NavLink, useHistory } from "react-router-dom";
import { findAncestor, goToSurvivorInvest } from "../../utils/helper";
// import { NavLink, useHistory } from "react-router-dom";

import {
  getPoliceStationList,
  getSurvivorDetails,
  getTraffickerList,
  getFirList,
  getChangeLog,
  getActList,
  getSectionByActId
} from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import moment from "moment";
import { reset } from "react-tabs/lib/helpers/uuid";
import AlertComponent from "../../components/AlertComponent";
import FirDataTable from "./FirDataTable";
import DatePicker from "../../components/DatePicker";
import queryString from "query-string";

const SurvivorFir = (props) => {
  const [modalFirShow, setModalFirShow] = useState(false);
  const [addFirData, setAddFirData] = useState({});
  const [accusedObj, setAccusedObj] = useState({});
  const dispatch = useDispatch();
  const actList = useSelector((state) => state.actList);
  const traffickerList = useSelector((state) => state.traffickerList);
  const sectionByActId = useSelector((state) => state.sectionByActId);
  const firList = useSelector((state) => state.firList);
  const [firObj, setFirObj] = useState({});
  const [accusedArr, setAccusedArr] = useState([]);
  const [showAccusedArr, setShowAccusedArr] = useState([]);
  const [sectionArr, setSectionArr] = useState([]);
  const policeStationList = useSelector((state) => state.policeStationList);
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const [sectionObj, setSectionObj] = useState({});
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
  const [validated, setValidated] = useState(false);
  const [validatedaccus, setValidatedaccus] = useState(false);
  const [validatedSec, setValidatedSec] = useState(false);
  const [activeClass, setActiveClass] = useState(false);
  const [firData, setFirData] = useState({});
  const formRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [erorMessage, setErorMessage] = useState("");
  const [survivorId, setSurvivorId] = useState("");
  const [resultLoad, setResultLoad] = useState(false);
const[bodyAccuseObj,setbodyAccuseObj] =useState({})
  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [alertFlag, setAlertFlag] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [messagType, setMessagType] = useState("");
  const history = useHistory();
  const [finalAccues, setFinalAccues] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });

  console.log(getId, "getId");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // initFilters1();
  }, [firList]);

  const handleShow = () => {
    console.log("select");
    setShowAlert(true);
  };

  const changeLogFunc = () => {
    let type = "fir";
    dispatch(getChangeLog(type, deletedById));
    props.history.push("/change-log");
  };

  const handleCloseAlert = () => {
    setAlertMessage("");
    setAlertFlag("");
    setShowAlert(false);
  };
  const onSelectRow = (data) => {
    console.log(data);
    setActiveClass(true);
    setFirData(data);
    setAddFirData(data);
    scrollToView(data);

    // if(data && data.escalation_required && item.escalation_required === true){
    // setAlertFlag("alert");
    // setAlertMessage("Need to Add Escalation for this PC")
    // handleShow()
    // }
    // else{
    // setShowAlert(false);
    // }
  };

  const scrollToView = (data) => {
    if (data && data.accused && data.accused.length > 0) {
      // const el = document.getElementById("list_goal_pdf_view");
      // window.scrollTo(0, el.offsetTop - 50);
      // } else {
      const el = document.getElementById("section-list");
      window.scrollTo(0, el.offsetTop);
    }
  };
  const onShowModel = (e) => {
    setModalFirShow(true);
    setAddFirData({});
    setFirData({});
    setAddFirData({});
    setFinalAccues([]);
    setShowAccusedArr([]);
    setFirObj({});
  };
  // useEffect(() => {
  // setSurvivorId(getId.survivorId);
  // }, [getId.survivorId]);

  const gotoInvestigation = (e) => {
    if (!firData._id) {
      alert("Please select one FIR");
    } else {
      let object = { survivorId: getId.survivorId, firId: firData._id };
      goToSurvivorInvest(e, object, history);
      // props.history.push({
      // pathname: "/survivor-investigation",
      // state: survivorId,
      // firId: firData._id,
      // flag: "fromFir",
      // });
    }
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (firData && !firData._id) {
      alert("Please select one Fir");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: deletedByRef && deletedByRef,
    };
    setResultLoad(true);
    axios
      .patch(api + "/survival-fir/delete/" + firData._id, body)
      .then((response) => {
        handleClick();
        setMessagType("success");
        setResultLoad(false);
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getFirList(getId.survivorId));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error");
        setResultLoad(false);
      });
  };

  const onShowEditModel = (e) => {
    setModalFirShow(true);
    // setAddFirData(firData);

    let accusedObj = {};
    let arr = [];
    let obj1 = {};
    let showArr1 = [];

    firData &&
      firData.accused &&
      firData.accused.length > 0 &&
      firData.accused.map((item) => {
        return (
          (accusedObj = {
            name: item.name && item.name._id,
            accused_type: item.accused_type,
          }),
          (obj1 = {
            trafficker_name:
              item &&
              item.name &&
              item.name.trafficker_name &&
              item.name.trafficker_name,
            name: item &&
              item.name &&
              item.name._id &&
              item.name._id,
            accused_type: item && item.accused_type && item.accused_type,
          }),
          showArr1.push({ ...obj1 }),
          arr.push(accusedObj)
        );
      });

    /////// set data to show in modal //////////

    setShowAccusedArr(showArr1);
    setAccusedArr(arr);
    setSectionArr(firData && firData.section);
  };

  useEffect(() => {
    dispatch(getPoliceStationList());
    dispatch(getTraffickerList());
dispatch(getActList())
    dispatch(getFirList(getId.survivorId));
    dispatch(getSurvivorDetails(getId.survivorId));
  }, [getId.survivorId]);

  //////// on fir change function ////
  const onFirNumberChange = (e) => {
    console.log(e);

    setFirObj({
      ...firObj,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    console.log(firObj, addFirData, "addFirData");
    setFirObj({
      ...firObj,
      number:
        firObj && firObj.number
          ? firObj.number
          : addFirData && addFirData.fir && addFirData.fir.number,
      date:
        firObj && firObj.date
          ? firObj.date
          : addFirData && addFirData.fir && addFirData.fir.date,
    });
  }, [firData]);

  const onCancel = () => {
    setShowAccusedArr([]);
    setSectionObj({});
    setAccusedObj({});
    setSectionArr([]);
    setAccusedArr([]);
    setAddFirData({});
    // setFirData({});
    setModalFirShow(false);
    setActiveClass(false);
    setValidatedaccus(false);
    setValidatedSec(false);
    setValidated(false);
  };

  useEffect(() => {
    setAddFirData({
      ...addFirData,
      fir: firObj,
    });
  }, [firObj]);

  const handleClick = () => {
    setOpen(true);
    // setFinalAccues([])
  };

  const handleClose = () => {
    setOpen(false);
    setValidatedaccus(false);
    setValidatedSec(false);
    setValidated(false);
    setFinalAccues([]);
  };
  ////// on accused change function ////

  const onAccusesChange = (e) => {
   
      setAccusedObj({
        ...accusedObj,
        [e.target.name]: e.target.value
      });

  };

  const handleSubmitAccus = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      if (firData && firData._id) {
        setValidatedaccus(false);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    } else {
      onAddAccused(event);
    }
    setValidatedaccus(true);
  };

  const onAddAccused = (e) => {
    e.preventDefault();
    if (accusedObj.name && accusedObj.accused_type) {
     let data= showAccusedArr && showAccusedArr.length > 0 && showAccusedArr.find(e=> e.name ==accusedObj.name )
     if(data){
      setShowAccusedArr(showAccusedArr)
      setAccusedArr(accusedArr)
     }else{

      if(accusedObj.name){
        let trfname= traffickerList &&
        traffickerList.length > 0 &&
        traffickerList.find(x=> x._id == accusedObj.name)
        if(trfname){
          accusedObj.trafficker_name = trfname.trafficker_name
          setShowAccusedArr([...showAccusedArr, accusedObj]);
        }
      } else{

      setShowAccusedArr([...showAccusedArr, accusedObj]);
      }
    setAccusedArr([...accusedArr, accusedObj]);

    }
  }
    formRef.current.reset();
    // setAccusedObj({});
  };

  useEffect(()=>{
    console.log(showAccusedArr,"showAccusedArrshowAccusedArr")
  },[showAccusedArr])
  
  const onDeleteAccuse=(value)=>{
    console.log(showAccusedArr,value,"vvvvvvvvvv")
    var array = [...showAccusedArr]; // make a separate copy of the array
    
      array.splice(value, 1);
      console.log(array);
      setAccusedArr(array)
      setShowAccusedArr(array)

  }
  console.log(showAccusedArr,accusedArr,"accusedArr")
 
  useEffect(() => {
    let arr = [];
    let obj = {};
    console.log(showAccusedArr, "showAccusedArr");
    // let filterdata =


    traffickerList &&
      traffickerList.length > 0 &&
      traffickerList.filter((item) => {
        return (
          showAccusedArr &&
          showAccusedArr.length > 0 &&
          showAccusedArr.map((x) => {
            return (
              (obj = {
                name: x.name === item._id && item.trafficker_name,
                accused_type: x.name === item._id && x.accused_type,
              }),
              arr.push(obj),
              console.log(arr,"accuse")
            );
          })
        );
      });
    console.log(arr, obj, "aaaaaaaa");
    setFinalAccues(arr);
  }, [showAccusedArr]);

  console.log(finalAccues, "final");

  const onGdNumberChange = (e) => {
    setAddFirData({
      ...addFirData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setAddFirData({
      ...addFirData,
      accused: accusedArr,
    });
  }, [accusedArr]);

  const onSectionChange = (e) => {
    setSectionObj({
      ...sectionObj,
      [e.target.name]: e.target.value,
    });
    dispatch(getSectionByActId(e.target.value))
  };
  const onSectionNumberChange = (e) => {
    setSectionObj({
      ...sectionObj,
      [e.target.name]: e.target.value,
    });
    // dispatch(getSectionByActId(e.target.value))
  };




  const handleSubmitSec = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (firData && firData._id) {
        setValidatedSec(false);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    } else {
      onSectionSubmit(event);
    }
    setValidatedSec(true);
  };


const onDeleteSection=(value)=>{
  console.log(sectionArr,value,"vvvvvvvvvv")
  var array = [...sectionArr]; // make a separate copy of the array
  
    array.splice(value, 1);
    console.log(array);
    setSectionArr(array)
    // setShowAccusedArr(array)
}

  const onSectionSubmit = (e) => {
    e.preventDefault();
    if (sectionObj.section_type) {
      setSectionArr([...sectionArr, sectionObj]);
    }
    formRef.current.reset();
    setSectionObj({});
  };

  useEffect(() => {
    setAddFirData({
      ...addFirData,
      section: sectionArr,
    });
  }, [sectionArr]);
  console.log(policeStationList, "policeStationList");

  const handleSubmit = (event) => {
    console.log(event, "habdleSubmit");
    // const {form}= event.target

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (firData && firData._id) {
        onAddFirFunc(event);
        // event.preventDefault();
        console.log(addFirData,"addFirDataaddFirData")
        setValidated(false);
      } else {
        event.preventDefault();

        event.stopPropagation();
      }
    } else {
      setValidated(false);
      onAddFirFunc(event);
    }
    setValidated(true);
  };

  const onAddFirFunc = (e) => {
    e.preventDefault();
    let updateData = {
      user_id: deletedById && deletedById,
      ...addFirData,
      survivor: getId.survivorId,
    };
    let addData = {
      ...addFirData,
      survivor: getId.survivorId,
    };
    if (firData && firData._id) {
      setResultLoad(true);
      axios
        .patch(
          api + "/survival-fir/update/" + firData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success");
          setValidated(false);
          setValidatedaccus(false);
          setResultLoad(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getFirList(getId.survivorId));
            dispatch({ type: "FIR_LIST", data: data.result });
            setShowAccusedArr([]);
            setSectionObj({});
            setAccusedObj({});
            setSectionArr([]);
            setAccusedArr([]);
            setAddFirData({});
            // setFirData({});
            // setActiveClass(false);
            setModalFirShow(false);
          }
        })
        .catch((error) => {
          console.log(error, "fir add error");
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
          setResultLoad(false);
        });
    } else {
      setResultLoad(true);
      axios
        .post(api + "/survival-fir/create", addData, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setValidated(false);
          setValidatedaccus(false);
          setResultLoad(false);
          setMessagType("success");
          if (response.data && response.data.error === false) {
            const { data } = response;

            dispatch({ type: "USERS_LIST", data: data.data });
            dispatch(getFirList(getId.survivorId));
            setModalFirShow(false);
            setAddFirData({});
            setShowAccusedArr([]);
            setSectionArr([]);
            // setFirData({});
            // setActiveClass(false);
            setAccusedArr([]);
          }
        })
        .catch((error) => {
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
          setResultLoad(false);
        });
    }
  };

  const onChangeDateHandler = (e) => {
    setAddFirData({
      ...addFirData,
      [e.target.name]: e.target.value,
    });
  };
  //export csv function///

  console.log(firList.data, "firrrrrrrrrrrrrr");
  let exportData = [];
  firList&& firList.data && firList.data.length > 0 &&
  firList.data.map((x, index) => {
    exportData.push({
      date: x && x.fir && x.fir.date && moment(x.fir.date).format("DD-MMM-YYYY"),
      firNumber: x.fir.number,
      gd_number: x.gd_number,
      issue_mention_in_gd: x.issue_mention_in_gd,
      location: x.location,
      survivor: survivorDetails.survivor_name,
      createdAt: moment(x.createdAt).format("DD-MMM-YYYY"),
      policeStation: x.policeStation.name,
      sectionType: x.section.map((y) => {
        return y.section_type;
      }),
      sectionNumber: x.section.map((y) => {
        return y.section_number;
      }),
      dateOfSection: x.section.map((y) => {
        return moment(y.date_of_section_when_added_to_fir).format(
          "DD-MMM-YYYY"
        );
      }),
      sectionNote: x.section.map((y) => {
        return y.notes;
      }),
      
      accusedType: x.accused.map((y) => {
        return y.accused_type;
      }),
      nameOfAccused: x.accused.map((y) => {
        return y.name?.trafficker_name;
      }),
      
    });
  });
  console.log(
    exportData,
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  );
  let sectionData = [];
  firList.data.map((x) => {
    x.section.map((y) => {
      sectionData.push(y);
    });
  });
  console.log(sectionData, "cccccccccccccccccccccc");
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
  const exportToCsv = (e) => {
    e.preventDefault();

    // Headers for each column
    let headers = [
      "Date,FirNumber,GdNUmber,Issue,Location,Survivor,CreatedAt,PoliceStation,SectionId,Section Type,Section Number,Date Of Section,Section Notes,Type Of Accused,Id Of Accused,Name of Accused",
    ];

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {
        
        date,
        firNumber,
        gd_number,
        issue_mention_in_gd,
        location,
        survivor,
        createdAt,
        policeStation,
        sectionId,
        sectionType,
        sectionNumber,
        dateOfSection,
        sectionNote,
        accusedType,
        nameOfAccused,
        idOfAccused,
      } = user;
      acc.push(
        [
          
          date,
          firNumber,
          gd_number,
          issue_mention_in_gd,
          location,
          survivor,
          createdAt,
          policeStation,
          sectionId,
          sectionType,
          sectionNumber,
          dateOfSection,
          sectionNote,
          accusedType,
          nameOfAccused,
          idOfAccused,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "firList.csv",
      fileType: "text/csv",
    });
  };

  ///download pdf

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
    doc.text("SURVIVOR FIR LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
    
      "Date",
      "FirNumber",
      "GdNUmber",
      "Issue",
      "Location",
      "Survivor",
      "CreatedAt",
      "PoliceStation",
      "SectionId",
      "Section Type",
      "Section Number",
      "Date Of Section",
      "Section Notes",
      "Type Of Accused",
      "Id Of Accused",
      "Name of Accused",
    ];
    const name = "survivor-fir-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
        
        item.date,
        item.firNumber,
        item.gd_number,
        item.issue_mention_in_gd,
        item.location,
        item.survivor,
        item.createdAt,
        item.policeStation,
        item.sectionId,
        item.sectionType,
        item.sectionNumber,
        item.dateOfSection,
        item.sectionNote,
        item.accusedType,
        item.nameOfAccused,
        item.idOfAccused,
      ];
      goalsRows.push(temp);
    });
    doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
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
          type={messagType}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">FIR</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>FIR</MDBBreadcrumbItem>
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
                  <Dropdown.Item onClick={(e) => gotoInvestigation(e)}>
                    Investigation
                  </Dropdown.Item>
                  <Dropdown.Item onClick={downloadPdf}>Download PDF</Dropdown.Item>
                  <Dropdown.Item onClick={exportToCsv}>
                    Export to CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLogFunc()}>
                    Change Log
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add"
              >
                <span onClick={() => onShowModel()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => onShowEditModel()}>
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

            <FirDataTable
              firList={
                firList &&
                firList.data &&
                firList.data.length > 0 &&
                firList.data
              }
              isLoading={isLoading}
              onSelectRow={onSelectRow}
            />

            {firData && firData.accused && firData.accused.length > 0 && (
              <div>
                <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                  List of Accused
                </h4>
                <table className="table table-borderless mb-5">
                  <thead>
                    <tr>
                      <th width="12%">Name of accused</th>
                      <th width="10%">Type of accused</th>
                      <th width="10%">Added on</th>
                      {/* <th width="20%">Action to remove accused - with notes</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {firData &&
                      firData.accused &&
                      firData.accused.length > 0 &&
                      firData.accused.map((item) => {
                        return (
                          <tr>
                            {/* {item && item.name && item.name.trafficker_name && ( */}
                              <>
                                <td>
                                  {item &&
                                    item.name &&
                                    item.name.trafficker_name.toUpperCase()}
                                </td>
                                <td>
                                  {item &&
                                    item.accused_type &&
                                    item.accused_type.toUpperCase()}
                                </td>
                                <td>
                                  {firData &&
                                    firData.createdAt &&
                                    moment(firData.createdAt).format(
                                      "DD-MMM-YYYY"
                                    )}
                                </td>
                                {/* <td>{"need discuss"}</td> */}
                              </>
                            {/* ) */}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
            <div id="section-list">
              {firData && firData.section && firData.section.length > 0 && (
                <>
                  <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">Section</h4>
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="10%">Type</th>
                        <th width="10%">Section</th>
                        <th width="15%">Supplimentary FIR Number</th>
                        <th width="15%">Notes</th>
                        {/* <th width="20%">Action to remove accused - with notes</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {firData &&
                        firData.section &&
                        firData.section.length > 0 &&
                        firData.section.map((item) => {
                          return (
                            <tr>
                              {item && item.section_type && (
                                <>
                                  <td>
                                    {item && item.section_type.toUpperCase()}
                                  </td>
                                  <td>{item && item.section_number}</td>
                                  <td>{"NA"}</td>
                                  <td>{item && item.notes}</td>
                                  {/* <td>{"need discuss"}</td> */}
                                </>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalFirShow}
        onHide={setModalFirShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add FIR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    source/Destination <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="location"
                    required
                    value={addFirData && addFirData.location}
                    onChange={(e) =>
                      setAddFirData({
                        ...addFirData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Default select
                    </option>
                    <option value="sa">{"SA"}</option>
                    <option value="da"> {"DA"}</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Source/Destination
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Police station <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    value={
                      addFirData &&
                      addFirData.policeStation &&
                      addFirData.policeStation._id
                    }
                    name="policeStation"
                    onChange={(e) =>
                      setAddFirData({
                        ...addFirData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value="" hidden={true}>
                      Please select
                    </option>
                    {policeStationList &&
                      policeStationList.length > 0 &&
                      policeStationList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Police station
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Name of Defacto complainer at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData &&
                        addFirData.location &&
                        addFirData.location === "da" &&
                        "DA"}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="name_of_defacto_complainer"
                    type="text"
                    defaultValue={
                      addFirData && addFirData.name_of_defacto_complainer
                    }
                    onChange={(e) =>
                      setAddFirData({
                        ...addFirData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Name of Defacto complainer at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Relationship with Defacto complainer at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addFirData && addFirData.relation_with_defacto_complainer
                    }
                    name="relation_with_defacto_complainer"
                    type="text"
                    onChange={(e) =>
                      setAddFirData({
                        ...addFirData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Relationship with Defacto complainer at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" className="mb-3">
                  <Form.Label>
                    GD Number at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="gd_number"
                    type="text"
                    defaultValue={
                      addFirData && addFirData.gd_number && addFirData.gd_number
                    }
                    // onChange={(e) =>
                    // setAddFirData({
                    // ...addFirData,
                    // [e.target.name]: e.target.value
                    // })}
                    onChange={onGdNumberChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter GD Number at{" "}
                    {addFirData &&
                    addFirData.location &&
                    addFirData.location === "sa"
                      ? "SA"
                      : addFirData && addFirData.location === "da" && "DA"}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" className="mb-3">
                  <Form.Label>Date</Form.Label>

                  <DatePicker
                    // message={"Please enter date of Rescue."}
                    name="date_of_gd"
                    datePickerChange={onChangeDateHandler}
                    data={addFirData && addFirData.date_of_gd}
                  />

                  {/* <Form.Control
type="date"
name="date_of_gd"
value={
addFirData &&
addFirData.date_of_gd &&
moment(addFirData.date_of_gd).format("YYYY-MM-DD")
}
onChange={(e) =>
setAddFirData({
...addFirData,
[e.target.name]: e.target.value,
})
}
placeholder="Date of gd at sa"
/> */}
                </Form.Group>
                <Form.Group as={Col} md="4" className="mb-3">
                  <Form.Label>
                    Issue mentioned <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={addFirData && addFirData.issue_mention_in_gd}
                    name="issue_mention_in_gd"
                    type="text"
                    onChange={(e) =>
                      setAddFirData({
                        ...addFirData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Issue mentioned
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    FIR Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    defaultValue={
                      addFirData && addFirData.fir && addFirData.fir.number
                    }
                    name="number"
                    onChange={onFirNumberChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter FIR Number
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Date of FIR <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker
                    required
                    message={" Please enter Date of FIR."}
                    name="date"
                    datePickerChange={onFirNumberChange}
                    data={addFirData && addFirData.fir && addFirData.fir.date}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter FIR Date
                  </Form.Control.Feedback>
                  {/* <Form.Control
required
type="date"
name="date"
value={
addFirData &&
addFirData.fir &&
moment(addFirData.fir.date).format("YYYY-MM-DD")
}
onChange={onFirNumberChange}
placeholder="Date of Birth"
/>
<Form.Control.Feedback type="invalid">
Please enter Date of FIR
</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Issues in FIR <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="issues_in_fir"
                    defaultValue={
                      addFirData &&
                      addFirData.issues_in_fir &&
                      addFirData.issues_in_fir
                    }
                    type="text"
                    onChange={(e) =>
                      setAddFirData({
                        ...addFirData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Issues in FIR
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form
                    ref={formRef}
                    // noValidate validated={validatedSec} onSubmit={handleSubmitAccus}
                  >
                    <Row className="justify-content-between">
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Name of Accused </Form.Label>

                        <Form.Select
                          required
                          onChange={(e) => onAccusesChange(e)}
                          name="name"
                        >
                          <option value={""} hidden={true}>
                            Please select
                          </option>
                          {traffickerList &&
                            traffickerList.length > 0 &&
                            traffickerList.map((item) => {
                              return (
                                <option value={item._id}>
                                  {item.trafficker_name}
                                </option>
                              );
                            })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please enter Name of accused
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Type of accused </Form.Label>
                        <Form.Select
                          required
                          onChange={(e) => onAccusesChange(e)}
                          name="accused_type"
                        >
                          <option value={""} hidden={true}>
                            Please select
                          </option>
                          <option value="sa">SA</option>
                          <option value="da">DA</option>
                          <option value="transit">Transit</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please select Type of accused
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                      <Form.Group as={Col} md="auto" className="mb-3">
                        <Button
                          type="submit"
                          onClick={(e) => onAddAccused(e)}
                          className="addbtn addbtn_blue shadow-0"
                        >
                          Add Accused
                        </Button>
                      </Form.Group>
                    </Row>
                    {showAccusedArr && showAccusedArr.length > 0 && (
                      <div className="white_box_shadow_20 survivors_table_wrap position-relative mb-4">
                        <h4 class="mb-4 small_heading">Add Accused</h4>
                        <table className="table table-borderless mb-0">
                          <thead>
                            <tr>
                              <th width="12%">Name of Accused </th>
                              <th width="10%">Type of accused </th>
                              <th width="4%"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* {finalAccues &&
finalAccues.length > 0 &&finalAccues[0].name !==false ?
finalAccues.map((item) => {
return (
<tr>
{item && item.name &&
<>
<td>{item && item.name}</td>
<td>{item && item.accused_type}</td>
</>}
</tr>
);
}): */}
                            {showAccusedArr &&
                              showAccusedArr.length > 0 &&
                              showAccusedArr.map((item,index) => {
                                return (
                                  <tr>
                                    {/* {item && item.name && ( */}
                                      <>
                                        <td>{item && item.trafficker_name}</td>
                                        <td>{item && item.accused_type}</td>
                                        <td>
                                          {" "}
                                          <MDBTooltip
                                            tag="a"
                                            wrapperProps={{
                                              className: "delete_btn",
                                            }}
                                            title="Delete"
                                          >
                                            <span onClick={() => onDeleteAccuse(index)}>
                                              <i style={{color: "red"}} className="fal fa-trash-alt"></i>
                                            </span>
                                          </MDBTooltip>
                                        </td>
                                      </>
                                    {/* )} */}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Form>
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form
                    ref={formRef}
                    // noValidate validated={validatedSec} onSubmit={handleSubmitSec}
                  >
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Type of section</Form.Label>
                        <Form.Select
                          required
                          onChange={onSectionChange}
                          name="section_type"
                        >
                          <option hidden={true} value="">
                            Please select
                          </option>
                          {actList && actList.length>0 && actList.map((item)=>{
                            return(

                              <option value={item && item.name}>{item && item.name} </option>
                              )
                          })}
                          {/* <option value="itpc">ITPC </option> */}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please select Type of section
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Section</Form.Label>
                        <Form.Select
                          required
                          onChange={onSectionNumberChange}
                          name="section_number"
                        >
                          <option value="" hidden={true}>
                            Please select
                          </option>
                          {sectionByActId && sectionByActId.length > 0 && sectionByActId.map((item)=>{
                            return(
                              <option value={item && item.number}>{item && item.number}</option>

                            )
                          })}

{/*                           
                          <option value="366B">366B</option>
                          <option value="370">370</option>
                          <option value="370A">370A</option>
                          <option value="372">372</option>
                          <option value="373">373</option> */}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please select Section number
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Date of section when added to FIR
                        </Form.Label>
                        <DatePicker
                          required
                          message={"Please select the date."}
                          name="date_of_section_when_added_to_fir"
                          datePickerChange={onSectionChange}
                          data={
                            sectionObj &&
                            sectionObj.date_of_section_when_added_to_fir
                          }
                        />
                        {/* <Form.Control
required
onChange={onSectionChange}
type="date"
name="date_of_section_when_added_to_fir"
placeholder="Date of Birth"
/>
<Form.Control.Feedback type="invalid">
Please select the date.
</Form.Control.Feedback> */}
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                          onChange={onSectionChange}
                          name="notes"
                          type="text"
                        />
                      </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                      <Form.Group as={Col} md="auto" className="mb-3">
                        <Button
                          type="submit"
                          onClick={onSectionSubmit}
                          className="addbtn addbtn_blue shadow-0"
                        >
                          Add Section
                        </Button>
                      </Form.Group>
                    </Row>
                    {sectionArr && sectionArr.length > 0 && (
                      <div className="white_box_shadow_20 survivors_table_wrap position-relative mb-4">
                        <h4 class="mb-4 small_heading">Add Section</h4>
                        <table className="table table-borderless mb-0">
                          <thead>
                            <tr>
                              <th width="12%">Type of section</th>
                              <th width="10%">Section</th>
                              <th width="12%">
                                Date of section <span>when added to FIR</span>
                              </th>
                              <th width="10%">Notes</th>
                              <th width="10%"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {sectionArr &&
                              sectionArr.length > 0 &&
                              sectionArr.map((item,index) => {
                                return (
                                  <tr>
                                    <td>
                                      {item && item.section_type.toUpperCase()}
                                    </td>
                                    <td>{item && item.section_number}</td>
                                    <td>
                                      {item &&
                                        moment(
                                          item.date_of_section_when_added_to_fir
                                        ).format("DD-MMM-YYYY")}
                                    </td>
                                    <td>{item && item.notes}</td>
                                    <td>
                                          {" "}
                                          <MDBTooltip
                                            tag="a"
                                            wrapperProps={{
                                              className: "delete_btn",
                                            }}
                                            title="Delete"
                                          >
                                            <span onClick={() => onDeleteSection(index)}>
                                              <i style={{color: "red"}} className="fal fa-trash-alt"></i>
                                            </span>
                                          </MDBTooltip>
                                        </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Form>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} xs="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={resultLoad === true ? true : false}
                    // disabled={
                    // addFirData && !addFirData.location
                    // ? true
                    // : !addFirData.policeStation
                    // ? true
                    // : !addFirData.name_of_defacto_complainer
                    // ? true
                    // : !addFirData.gd_number
                    // ? true
                    // : !addFirData.fir
                    // ? true
                    // : !addFirData.issue_mention_in_gd
                    // ? true
                    // : !addFirData.accused
                    // ? true
                    // : !addFirData.section
                    // ? true
                    // : false
                    // }
                    // onClick={(e) => onAddFirFunc(e)}
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
          alertFlag={alertFlag}
          alertMessage={alertMessage}
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default SurvivorFir;
