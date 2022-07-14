import React, { useState, useEffect, useRef } from "react";
import { Topbar, SurvivorTopCard } from "../../components";

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
import "./survivorchargesheet.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import {
  getSurvivorDetails,
  getFirList,
  getTraffickerList,
  getChargeSheetList,
  getChargeSheetListByFirIdandInvestId,
  getChangeLog,
  getSectionByActId,
  getActList

} from "../../redux/action";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";
import ChargesheetDataTable from "./ChargesheetDataTable";
import DatePicker from "../../components/DatePicker";
import { NavLink, useHistory, useLocation } from "react-router-dom";

const SurvivorChargesheet = (props) => {
  const [modalChargesheetShow, setModalChargesheetShow] = useState(false);
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivorActionDetails = useSelector(
    (state) => state.survivorActionDetails
  );

  const traffickerList = useSelector((state) => state.traffickerList);
  const chargeSheetList = useSelector((state) => state.chargeSheetList);
  const firList = useSelector((state) => state.firList);
  const [finalAccues, setFinalAccues] = useState([]);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [addChargeSheetData, setAddChargeSheetData] = useState({});
  const [chargeSheetObj, setCahrgeSheetObj] = useState({});
  const [firObj, setFirObj] = useState({});
  const [accusedincludedArr, setAccusedincludedArr] = useState([]);
  const [sendAccusedincludedArr, setSendAccusedincludedArr] = useState([]);
  const [accusedNotIncludedObj, setAccusedNotIncludedObj] = useState({});
  const [accusedNotIncludedArr, setAccusedNotIncludedArr] = useState([]);
  const [sectionArrbyFir, setSectionArrbyFir] = useState([]);
  const [addSectionObj, setAddSectionObj] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [updateChargeSheetData, setUpdateChargeSheetData] = useState({});
  const [selectedFir, setSelectedFir] = useState({});
  const [sendaccusedNotincludedArr, setSendAccusedNotincludedArr] = useState(
    {}
  );
  const formRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [resultLoad, setResultLoad] = useState(false);

  const [validated, setValidated] = useState(false);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [isLoading, setIsLoading] = useState(true);
  const [messagType, setMessagType] = useState("");

  const history = useHistory();
  const search = useLocation().search;
  const survivorId = new URLSearchParams(search).get("survivorId");
  const firId = new URLSearchParams(search).get("firId");
  const investId = new URLSearchParams(search).get("investigationId");
  const [firArr, setFirArr] = useState([]);

  const actList = useSelector((state) => state.actList);
  const sectionByActId = useSelector((state) => state.sectionByActId);

  console.log(survivorId, firId, investId, "investIdinvestId");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [chargeSheetList]);

  const changeLogFunc = () => {
    let type = "chargesheet";
    dispatch(getChangeLog(type, deletedById));
    props.history.push("/change-log");
  };


  useEffect(()=>{
    if(survivorId&& firId && investId){
      dispatch(getFirList(survivorId));

    }
  },[survivorId&& firId && investId])


  useEffect(() => {
    console.log(props.location, "location");
    dispatch(getSurvivorDetails(survivorId));
    dispatch(getTraffickerList());
dispatch(getActList())

   
    if (investId) {
      dispatch(
        getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
        
      );
 
    } else {
      dispatch(getChargeSheetList(survivorId));
    }
  }, [survivorId]);

  const gotSupplimentaryChargeSheet = () => {
    console.log(selectedData);
    if (!selectedData) {
      alert("Please select one Investigation");
    } else {
      props.history.push({
        pathname: "/survivor-supplimentary-chargesheet",
        state: selectedData._id,
        investId: selectedData,
        firId: props.location.firId,
        flag: "fromInvest",
      });
    }
  };

  useEffect(() => {
    console.log(firList, "firList");

    let data =
      firList &&
      firList.data &&
      firList.data.length > 0 &&
      firList.data.filter((x) => x._id === firId && x);
    console.log(data, "dataaaaa");
    setFirArr(data);
  }, [firList]);

  /////// notification open function //////
  const handleClick = () => {
    setOpen(true);
  };
  ////// notification close function ///////
  const handleClose = () => {
    setOpen(false);
    setFinalAccues([]);
  };

  //// on celect row function /////
  const onSelectRow = (e) => {
    console.log(e);
    setSelectedData(e);
    scrollToView(e);
    setActiveClass(true);
  };

  const scrollToView = (data) => {
    if (data && data.section && data.section > 0) {
      //   const el = document.getElementById("list_goal_pdf_view");
      //   window.scrollTo(0, el.offsetTop - 50);
      // } else {
      const el = document.getElementById("section-list");
      window.scrollTo(0, el.offsetTop);
    }
  };
  // add charge sheet modal open/////
  const gotoAdd = () => {
    setValidated(false);
    setModalChargesheetShow(true);
    setFinalAccues([]);
  };

  /////// go to edit modal open function//////

  const gotoEdit = (e) => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Chargesheet");
    } else {
      setModalChargesheetShow(true);
      setUpdateChargeSheetData(selectedData);
    }
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Chargesheet");
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
      .patch(api + "/survival-chargesheet/delete/" + selectedData._id, body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success");
        setResultLoad(false);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({});
          dispatch(
            getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
          );
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        handleClick();
        setResultLoad(false);
        setUpdateMessage(error && error.message);
        setMessagType("error");
      });
  };

  useEffect(() => {
    let arr = [];
    let obj = {};

    // let filterdata =
    traffickerList &&
      traffickerList.length > 0 &&
      traffickerList.filter((item) => {
        return (
          accusedNotIncludedArr &&
          accusedNotIncludedArr.length > 0 &&
          accusedNotIncludedArr.map((x) => {
            return (
              (obj = {
                name: x.name === item._id && item.trafficker_name,
                accused_type: x.name === item._id && x.accused_type,
              }),
              arr.push(obj)
            );
          })
        );
      });
    console.log(arr, obj, "aaaaaaaa");

    setFinalAccues(arr);
  }, [accusedNotIncludedObj]);

  ///////// on cancel button function ///////
  const onCancel = (e) => {
    setAddChargeSheetData({});
    setAccusedNotIncludedArr([]);
    setAccusedNotIncludedObj({});
    setAccusedincludedArr([]);
    setCahrgeSheetObj({});
    setSectionArrbyFir([]);
    setUpdateChargeSheetData({});
    setModalChargesheetShow(false);
    setActiveClass(false);
    setFirObj({});
  };

  /////// onchange function of charge sheet date and charge sheet number ////
  const onChargeSheetChange = (e) => {
    console.log(e);
    setCahrgeSheetObj({
      ...chargeSheetObj,
      [e.target.name]: e.target.value,
    });
  };
  console.log(chargeSheetObj, "chargeSheetObj");

  //////// onchange function of fir number and date select //////
  const onFirNumberChange = (e) => {
    let selectedFirArr = firArr.filter((ele) => ele._id === e.target.value);
    console.log("selectedFir", selectedFirArr);
    // setSelectedFir(selectedFirArr[0]);

    setFirObj({
      number: selectedFirArr[0] && selectedFirArr[0]._id,
      date:
        selectedFirArr[0] &&
        selectedFirArr[0].fir &&
        selectedFirArr[0].fir.date &&
        selectedFirArr[0].fir.date,
    });

    // setFirData(selectedFir[0]);
    let arr = [];
    let obj = {};
    let showArr = [];
    let showObj = {};

    ////// set data for accused /////////
    selectedFirArr[0] &&
      selectedFirArr[0].accused &&
      selectedFirArr[0].accused.length > 0 &&
      selectedFirArr[0].accused.map((x) => {
        console.log(x, "x");
        return (
          (obj = {
            name: x && x.name && x.name._id,
            accused_type: x && x.accused_type && x.accused_type,
          }),
          (showObj = {
            name:
              x && x.name && x.name.trafficker_name && x.name.trafficker_name,
            accused_type: x && x.accused_type && x.accused_type,
          }),
          arr.push({ ...obj }),
          showArr.push({ ...showObj })
        );
      });

    /////// set data to show in modal //////////

    setAccusedincludedArr(showArr);
    setSendAccusedincludedArr(arr);

    ////// set data for section /////////

    let sectionObj = {};
    let sectionArr = [];
    selectedFirArr[0] &&
      selectedFirArr[0].section &&
      selectedFirArr[0].section.length > 0 &&
      selectedFirArr[0].section.map((x) => {
        console.log(x, "x");
        return (
          (sectionObj = {
            section_type: x && x.section_type && x.section_type,
            section_number: x && x.section_number && x.section_number,
            date_of_section_when_added_to_fir:
              x &&
              x.date_of_section_when_added_to_fir &&
              x.date_of_section_when_added_to_fir,
            notes: x && x.notes && x.notes,
          }),
          sectionArr.push({ ...sectionObj })
        );
      });

    /////// set data in state //////////

    setSectionArrbyFir(sectionArr);
  };
  //////////// set data for update charge sheet ////////////

  useEffect(() => {
    console.log(updateChargeSheetData, "updateChargeSheetData");
    setAddChargeSheetData({
      location:
        updateChargeSheetData &&
        updateChargeSheetData.location &&
        updateChargeSheetData.location,
      type_of_violation:
        updateChargeSheetData &&
        updateChargeSheetData.type_of_violation &&
        updateChargeSheetData.type_of_violation,
    });
    setCahrgeSheetObj({
      number:
        updateChargeSheetData &&
        updateChargeSheetData.charge_sheet &&
        updateChargeSheetData.charge_sheet.number &&
        updateChargeSheetData.charge_sheet.number,
      date:
        updateChargeSheetData &&
        updateChargeSheetData.charge_sheet &&
        updateChargeSheetData.charge_sheet.date &&
        updateChargeSheetData.charge_sheet.date,
    });
    // setSelectedFir(updateChargeSheetData && updateChargeSheetData);

    setFirObj({
      number:
        updateChargeSheetData &&
        updateChargeSheetData.fir &&
        updateChargeSheetData.fir._id,
      date:
        updateChargeSheetData &&
        updateChargeSheetData.fir &&
        updateChargeSheetData.fir.fir &&
        updateChargeSheetData.fir.fir.date,
    });

    // setFirData(selectedFir[0]);
    let arr = [];
    let obj = {};
    let showArr = [];
    let showObj = {};

    ////// set data for accused included /////////
    updateChargeSheetData &&
      updateChargeSheetData.accused_included &&
      updateChargeSheetData.accused_included.length > 0 &&
      updateChargeSheetData.accused_included.map((x) => {
        console.log(x, "x");
        return (
          (obj = {
            name: x && x.name && x.name._id,
            accused_type: x && x.accused_type && x.accused_type,
          }),
          (showObj = {
            name:
              x && x.name && x.name.trafficker_name && x.name.trafficker_name,
            accused_type: x && x.accused_type && x.accused_type,
          }),
          arr.push({ ...obj }),
          showArr.push({ ...showObj })
        );
      });

    /////// set data to show in modal //////////

    setAccusedincludedArr(showArr);
    setSendAccusedincludedArr(arr);

    ////// set data for accused not included /////////

    let arr1 = [];
    let obj1 = {};
    let showArr1 = [];
    let showObj1 = {};

    updateChargeSheetData &&
      updateChargeSheetData.accused_not_included &&
      updateChargeSheetData.accused_not_included.length > 0 &&
      updateChargeSheetData.accused_not_included.map((x) => {
        console.log(x, "x");
        return (
          (obj1 = {
            name: x && x.name && x.name._id,
            accused_type: x && x.accused_type && x.accused_type,
          }),
          (showObj1 = {
            name:
              x && x.name && x.name.trafficker_name && x.name.trafficker_name,
            accused_type: x && x.accused_type && x.accused_type,
          }),
          arr1.push({ ...obj1 }),
          showArr1.push({ ...showObj1 })
        );
      });

    /////// set data to show in modal //////////

    setAccusedNotIncludedArr(showArr);

    setSendAccusedNotincludedArr(arr);

    /////// set data in state //////////

    setSectionArrbyFir(
      updateChargeSheetData &&
        updateChargeSheetData.section &&
        updateChargeSheetData.section
    );
  }, [updateChargeSheetData]);

  console.log(firObj, "firObj");

  ////// onchange function for add accused not included ////////

  const onAccusedChange = (e) => {
    console.log(e);
    setAccusedNotIncludedObj({
      ...accusedNotIncludedObj,
      [e.target.name]: e.target.value,
    });
  };
  //////accused submit button function /////
  const onSubmitAccused = (e) => {
    console.log(accusedNotIncludedObj, "accusedNotIncludedObj");
    e.preventDefault();
    setSendAccusedNotincludedArr([
      ...sendaccusedNotincludedArr,
      accusedNotIncludedObj,
    ]);
    if (!accusedNotIncludedObj.name || !accusedNotIncludedObj.accused_type) {
      console.log("no data added");
    } else {
      setAccusedNotIncludedArr([
        ...accusedNotIncludedArr,
        accusedNotIncludedObj,
      ]);
    }
    formRef.current.reset();
    setAccusedNotIncludedObj({});
  };

  console.log(sendaccusedNotincludedArr, "sendaccusedNotincludedArr");
  ////// onchange function for add section////////

  const onSectionChange = (e) => {
    console.log(e);
    setAddSectionObj({
      ...addSectionObj,
      [e.target.name]: e.target.value,
    });
    dispatch(getSectionByActId(e.target.value))
  };

  const onSectionNumberChange = (e) => {
    setAddSectionObj({
      ...addSectionObj,
      [e.target.name]: e.target.value,
    });
    // dispatch(getSectionByActId(e.target.value))
  };
  ///////section submit button function ////
  const onSubmitASection = (e) => {
    e.preventDefault();
    console.log(addSectionObj, "add");
    if (addSectionObj.section_type) {
      setSectionArrbyFir([...sectionArrbyFir, addSectionObj]);
    } else {
      console.log("no data added");
    }
    formRef.current.reset();
    setAddSectionObj({});
  };

  useEffect(() => {
    console.log(sectionArrbyFir, "sectionArrbyFir arr");
  }, [sectionArrbyFir]);

  const handleSubmit = (event) => {
    console.log(event, "habdleSubmit");
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (updateChargeSheetData && updateChargeSheetData._id) {
        setValidated(false);
        addChargeSheetFunc(event);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    } else {
      addChargeSheetFunc(event);
    }
    setValidated(true);
  };

  //////// add charge sheet api call function //////

  const addChargeSheetFunc = (e) => {
    e.preventDefault();
    const tempData = {
      survivor: survivorId,
      ...addChargeSheetData,
      charge_sheet: chargeSheetObj,
      fir: firObj && firObj.number,
      accused_included: sendAccusedincludedArr,
      accused_not_included: sendaccusedNotincludedArr,
      section: sectionArrbyFir,
      investigation: investId,
    };
    const updateData = {
      survivor: survivorId,
      ...addChargeSheetData,
      charge_sheet: chargeSheetObj,
      fir: firObj && firObj.number,
      accused_included: sendAccusedincludedArr,
      accused_not_included: sendaccusedNotincludedArr,
      section: sectionArrbyFir,
      investigation: investId,
      user_id: deletedById,
    };

    if (updateChargeSheetData && updateChargeSheetData._id) {
      setResultLoad(true);
      axios
        .patch(
          api + "/survival-chargesheet/update/" + updateChargeSheetData._id,
          updateData,
          axiosConfig
        )
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          setMessagType("success");
          setValidated(false);
          setResultLoad(false);
          if (res && res.data && res.data.error == false) {
            const { data } = res;

            console.log(data, res);
            dispatch(
              getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
            );
            dispatch({ type: "CHARGE_SHEET_LIST", data: data.data });
            setModalChargesheetShow(false);
            setAddChargeSheetData({});
            setAccusedNotIncludedArr([]);
            setAccusedincludedArr([]);
            setCahrgeSheetObj({});
            setSectionArrbyFir([]);
            setActiveClass(false);
            setFirObj({});
          }
        })
        .catch((error) => {
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
          setResultLoad(false);
        });
    } else {
      setResultLoad(true);
      axios
        .post(api + "/survival-chargesheet/create", tempData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setAddChargeSheetData({});
          setValidated(false);
          setMessagType("success");
          setResultLoad(false);
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            console.log(data, res);
            dispatch(
              getChargeSheetListByFirIdandInvestId(survivorId, firId, investId)
            );
            dispatch({ type: "CHARGE_SHEET_LIST", data: data.data });
            setModalChargesheetShow(false);
            setAddChargeSheetData({});
            setAccusedNotIncludedArr([]);
            setAccusedincludedArr([]);
            setCahrgeSheetObj({});
            setSectionArrbyFir([]);
            setActiveClass(false);
            setFirObj({});
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

  //export csv function///

  //  console.log(chargeSheetList,'firrrrrrrrrrrrrr')

  let exportData = [];
  chargeSheetList &&
    chargeSheetList.length > 0 &&
    chargeSheetList.map((x, index) => {
      exportData = [
        {
          chargesheetDate: moment(x.charge_sheet.date).format("DD-MMM-YYYY"),
          chargesheetNumber: x.charge_sheet.number,
          date: moment(x.fir.fir.date).format("DD-MMM-YYYY"),
          firNumber: x.fir.fir.number,
          gd_number: x.fir.gd_number,
          issue_mention_in_gd: x.fir.issue_mention_in_gd,
          location: x.fir.location,
          survivor: survivorDetails.survivor_name,
          fircreatedAt: moment(x.fir.createdAt).format("DD-MMM-YYYY"),
          policeStation: x.fir.policeStation.name,
          accusedName: x.fir.accused[index]?.name.trafficker_name,
          accusedType: x.fir.accused[index]?.accused_type,
          sectionNUmber: x.fir.section[index]?.section_number,
          sectionType: x.fir.section[index]?.section_type,
          sectionNote: x.fir.section[index]?.notes,
          dateofsection:
            moment(x.fir.section[index]?.date_of_section_when_added_to_fir).format("DD-MMM-YYYY"),
          createdAt: moment(x.createdAt).format("DD-MMM-YYYY")
        },
      ];
    });
  //  console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
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

   const exportToCsv = e => {
       e.preventDefault()

       // Headers for each column
       let headers = ['ChargesheetDate,ChargesheetNumber,Date,FirNumber,GdNumber,Issue,Location,Survivor,FirCreatedAt,PolicStation,NameOfAccused,AccusedType,SectionNumber,SectionType,SectionNotes,DateOfSection,CreatedAt']

       // Convert users data to a csv
       let usersCsv = exportData.reduce((acc, user) => {
           const {chargesheetDate,chargesheetNumber,date,firNumber,gd_number,issue_mention_in_gd,location,survivor,fircreatedAt,policeStation,accusedName,accusedType,sectionNUmber,sectionType,sectionNote,dateofsection,createdAt} = user
           acc.push([chargesheetDate,chargesheetNumber,date,firNumber,gd_number,issue_mention_in_gd,location,survivor,fircreatedAt,policeStation,accusedName,accusedType,sectionNUmber,sectionType,sectionNote,dateofsection,createdAt].join(','))
           return acc
       }, [])

       downloadFile({
           data: [...headers, ...usersCsv].join('\n'),
           fileName: 'chargesheetList.csv',
           fileType: 'text/csv',
       })
   }
/////pdf download////////////////


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
  doc.text("SURVIVOR CHARGESHEET LIST", 22, 60);
  doc.setFontSize(10);
  const survivorColumns = [
  'ChargesheetDate','ChargesheetNumber','Date','FirNumber','GdNumber','Issue','Location','Survivor','FirCreatedAt','PolicStation','NameOfAccused','AccusedType','SectionNumber','SectionType','SectionNotes','DateOfSection','CreatedAt'
  ];

  const name = "survivor-chargesheet-list" + new Date().toISOString() + ".pdf";
  let goalsRows = [];
  exportData?.forEach((item) => {
    const temp = [item.chargesheetDate,item.chargesheetNumber,item.date,item.firNumber,item.gd_number,item.issue_mention_in_gd,item.location,item.survivor,item.fircreatedAt,item.policeStation,item.accusedName,item.accusedType,item.sectionNUmber,item.sectionType,item.sectionNote,item.dateofsection,item.createdAt
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
          type={messagType}
          message={updateMessage}
        />

        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Chargesheet</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Chargesheet</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            {firId && investId ? (
              <div className="vieweditdelete">
                <Dropdown className="me-1">
                  <Dropdown.Toggle variant="border" className="shadow-0">
                    Action
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={()=> downloadPdf()}>Download PDF</Dropdown.Item>
                    <Dropdown.Item onClick={exportToCsv}>Export To CSV</Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => gotSupplimentaryChargeSheet()}
                    >
                      Supplimentary Chargesheet
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=> changeLogFunc()}>Change Log</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <MDBTooltip
                  tag="button"
                  wrapperProps={{ className: "add_btn view_btn" }}
                  title="Add"
                >
                  <span onClick={() => gotoAdd()}>
                    <i className="fal fa-plus-circle"></i>
                  </span>
                </MDBTooltip>
                <MDBTooltip
                  tag="a"
                  wrapperProps={{ className: "edit_btn" }}
                  title="Edit"
                >
                  <span onClick={(e) => gotoEdit(e)}>
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
            ) : (
              <></>
            )}
            <ChargesheetDataTable
              chargeSheetList={
                chargeSheetList && chargeSheetList.length > 0 && chargeSheetList
              }
              isLoading={isLoading}
              onSelectRow={onSelectRow}
            />
            {/* <div className="table-responsive big-mobile-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="12%">Location</th>
                    <th width="15%">Charge Sheet No</th>
                    <th width="15%">Charge sheet date</th>
                  </tr>
                </thead>
                <tbody>
                  {chargeSheetList && chargeSheetList.length > 0 ? (
                    chargeSheetList.map((item) => {
                      return (
                        <tr
                          className={[
                            item._id === selectedData._id &&
                              activeClass === true &&
                              "current",
                          ]}
                          onClick={() => onSelectRow(item)}
                        >
                          <td>{item && item.location && item.location}</td>
                          <td>
                            {item &&
                              item.charge_sheet &&
                              item.charge_sheet.number &&
                              item.charge_sheet.number}
                          </td>
                          <td>
                            {item &&
                              item.charge_sheet &&
                              item.charge_sheet.date &&
                              moment(item.charge_sheet.date).format(
                                "DD/MM/YYYY"
                              )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={3}>
                        <b>NO Data Found !!</b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> */}
            {selectedData &&
              selectedData.accused_included &&
              selectedData.accused_included.length > 0 && (
                <>
                  <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                    List of accused in chargesheet
                  </h4>
                  <div className="table-responsive big-mobile-responsive">
                    <table className="table table-borderless mb-0">
                      <thead>
                        <tr>
                          <th width="12%">Name of accused</th>
                          <th width="10%">Type of accused</th>
                          <th width="10%">Added on</th>
                          {/* <th width="20%">Notes</th> */}
                          <th width="20%">
                            Action to remove accused - with notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData &&
                          selectedData.accused_included &&
                          selectedData.accused_included.length > 0 &&
                          selectedData.accused_included.map((item) => {
                            return (
                              <tr>
                                {item &&
                                  item.name &&
                                  item.name.trafficker_name && (
                                    <>
                                      <td>
                                        {item &&
                                          item.name &&
                                          item.name.trafficker_name &&
                                          item.name.trafficker_name.toUpperCase()}
                                      </td>
                                      <td>
                                        {item &&
                                          item &&
                                          item.accused_type &&
                                          item.accused_type.toUpperCase()}
                                      </td>
                                      <td>
                                        {selectedData &&
                                          selectedData.createdAt &&
                                          moment(selectedData.createdAt).format(
                                            "DD-MMM-YYYY"
                                          )}
                                      </td>
                                      {/* <td>Lorem ipsum dolor sit amet,</td> */}
                                      <td>{""}</td>
                                    </>
                                  )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            {selectedData &&
              selectedData.accused_not_included &&
              selectedData.accused_not_included.length > 0 && (
                <>
                  <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                    List of accused not in chargesheet
                  </h4>
                  <div className="table-responsive big-mobile-responsive mb30">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th width="12%">Name of accused</th>
                          <th width="10%">Type of accused</th>
                          {/* <th width="20%">Notes</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData &&
                          selectedData.accused_not_included &&
                          selectedData.accused_not_included.length > 0 &&
                          selectedData.accused_not_included.map((item) => {
                            return (
                              <tr>
                                {item &&
                                  item.name &&
                                  item.name.trafficker_name && (
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
                                      {/* <td>Lorem ipsum dolor sit amet,</td> */}
                                    </>
                                  )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            <div id="section-list">
              {selectedData &&
                selectedData.section &&
                selectedData.section.length > 0 && (
                  <>
                    <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                      Section
                    </h4>
                    <div className="table-responsive big-mobile-responsive">
                      <table className="table table-borderless mb-0">
                        <thead>
                          <tr>
                            <th width="12%">Type</th>
                            <th width="10%">Section</th>
                            <th width="15%">
                              Date of section <span>(When added to fir)</span>
                            </th>
                            {/* <th width="15%">Date of section <span>(When removed from chargesheet)</span></th> */}
                            <th width="20%">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedData &&
                            selectedData.section &&
                            selectedData.section.length > 0 &&
                            selectedData.section.map((item) => {
                              return (
                                <tr>
                                  <td>
                                    {item.section_type && item.section_type}
                                  </td>
                                  <td>
                                    {item.section_number && item.section_number}
                                  </td>
                                  <td>
                                    {item.date_of_section_when_added_to_fir &&
                                      moment(
                                        item.date_of_section_when_added_to_fir
                                      ).format("DD-MMM-YYYY")}
                                  </td>
                                  <td>{item.notes && item.notes}</td>
                                  {/* <td>{item.section_type && item.section_type}</td> */}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalChargesheetShow}
        onHide={setModalChargesheetShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {addChargeSheetData &&
                      addChargeSheetData._id ? "Update Chargesheet" : "Add Chargesheet"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    source/destination <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="location"
                    value={
                      addChargeSheetData &&
                      addChargeSheetData.location &&
                      addChargeSheetData.location
                    }
                    onChange={(e) =>
                      setAddChargeSheetData({
                        ...addChargeSheetData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Select location
                    </option>
                    <option value="sa">SA</option>
                    <option value="da">DA</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Location
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Charge Sheet No <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      chargeSheetObj &&
                      chargeSheetObj.number &&
                      chargeSheetObj.number
                    }
                    onChange={onChargeSheetChange}
                    name="number"
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Charge Sheet No
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Charge sheet date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker
                    required
                    message={"Please enter Charge sheet date"}
                    name="date"
                    datePickerChange={onChargeSheetChange}
                    data={chargeSheetObj && chargeSheetObj.date}
                  />
                  {/* <Form.Control
                    required
                    type="date"
                    name="date"
                    onChange={onChargeSheetChange}
                    value={
                      chargeSheetObj &&
                      chargeSheetObj.date &&
                      moment(chargeSheetObj.date).format("YYYY-MM-DD")
                    }
                    placeholder="Date of Birth"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Charge sheet date
                  </Form.Control.Feedback> */}
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Type of violation identified{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="type_of_violation"
                    defaultValue={
                      addChargeSheetData &&
                      addChargeSheetData.type_of_violation &&
                      addChargeSheetData.type_of_violation
                    }
                    type="text"
                    onChange={(e) =>
                      setAddChargeSheetData({
                        ...addChargeSheetData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Type of violation identified
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    FIR Number <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="number"
                    onChange={onFirNumberChange}
                    // value={firObj && firObj._id && firObj._id}
                    value={firObj && firObj.number && firObj.number}
                  >
                    <option value={""} hidden={true}>
                      Select FIR number
                    </option>
                    {firArr &&
                      firArr.length > 0 &&
                      firArr.map((data) => {
                        return (
                          <option value={data && data._id}>
                            {data && data.fir && data.fir.number}{" "}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select FIR Number
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Date of FIR</Form.Label>
                  <Form.Control
                    type="text"
                    name="date"
                    disabled={true}
                    defaultValue={
                      firObj &&
                      firObj.date &&
                      moment(firObj.date).format("DD-MMM-YYYY")
                    }
                    placeholder="Date of FIR"
                  />
                </Form.Group>
                {/* <Form.Group as={Col} md="6" className="mb-3">
                                    <Form.Label>Supplimentary chargesheet number</Form.Label>
                                    <Form.Control
                                        type="text"
                                    />
                                </Form.Group> */}
                {/* <Form.Group as={Col} md="6" className="mb-3">
                                    <Form.Label>Result of investivation</Form.Label>
                                    <Form.Select>
                                        <option>Default select</option>
                                    </Form.Select>
                                </Form.Group> */}
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form ref={formRef}>
                    <Row className="justify-content-between">
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Name of Accused{" "}
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <Form.Select
                          onChange={(e) => onAccusedChange(e)}
                          name="name"
                        >
                          <option hidden={true}>Select accused</option>
                          {traffickerList &&
                            traffickerList.length > 0 &&
                            traffickerList.map((item) => {
                              return (
                                <option value={item && item._id && item._id}>
                                  {item &&
                                    item.trafficker_name &&
                                    item.trafficker_name}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Type of accused (initial){" "}
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <Form.Select
                          onChange={(e) => onAccusedChange(e)}
                          name="accused_type"
                        >
                          <option hidden={true}>Select accused type</option>
                          <option value="sa">SA</option>
                          <option value="da">DA</option>
                          <option value="transit">Transit</option>
                        </Form.Select>
                      </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                      <Form.Group as={Col} md="auto" className="mb-3">
                        <Button
                          type="submit"
                          onClick={(e) => onSubmitAccused(e)}
                          className="addbtn addbtn_blue shadow-0"
                        >
                          Add Accused
                        </Button>
                      </Form.Group>
                    </Row>
                    {accusedNotIncludedArr && accusedNotIncludedArr.length > 0 && (
                      <>
                        <div className="white_box_shadow_20 survivors_table_wrap position-relative mb-4">
                          <h4 className="mb-4 small_heading">
                            List of accused not in chargesheet
                          </h4>
                          <div className="table-responsive big-mobile-responsive">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="12%">Accused name</th>
                                  <th width="10%">Accused Type</th>
                                  {/* <th></th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  // accusedNotIncludedArr &&
                                  //   accusedNotIncludedArr.length > 0 &&
                                  finalAccues &&
                                    finalAccues.length > 0 &&
                                    finalAccues.map((item) => {
                                      return (
                                        <tr>
                                          {item && item.name && (
                                            <>
                                              <td>{item.name && item.name}</td>
                                              <td>
                                                {item.accused_type &&
                                                  item.accused_type.toUpperCase()}
                                              </td>
                                            </>
                                          )}
                                        </tr>
                                      );
                                    })
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                    {accusedincludedArr && accusedincludedArr.length > 0 && (
                      <>
                        <div className="white_box_shadow_20 survivors_table_wrap position-relative mb-4">
                          <h4 className="mb-4 small_heading">
                            List of accused in chargesheet
                          </h4>
                          <div className="table-responsive big-mobile-responsive">
                            <table className="table table-borderless mb-0">
                              <thead>
                                <tr>
                                  <th width="12%">Accused name</th>
                                  <th width="10%">Accused Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {accusedincludedArr &&
                                  accusedincludedArr.length > 0 &&
                                  accusedincludedArr.map((item) => {
                                    console.log(item, "item");

                                    return (
                                      <tr>
                                        {item && item.name && (
                                          <>
                                            <td>{item.name && item.name}</td>
                                            <td>
                                              {item.accused_type &&
                                                item.accused_type.toUpperCase()}
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </Form>
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form ref={formRef}>
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Type of section{" "}
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <Form.Select
                          name="section_type"
                          onChange={onSectionChange}
                        >
                          <option hidden={true}>Select section type</option>
                          {actList && actList.length > 0 && actList.map((item)=>{
                            return(
                          <option value={item && item.name}>{item && item.name} </option>

                            )
                          })}
                          {/* <option value="ipc">IPC </option>
                          <option value="itpc">ITPC </option> */}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Section
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <Form.Select
                          name="section_number"
                          onChange={onSectionNumberChange}
                        >
                          <option hidden={true}>Default select</option>
                          {sectionByActId && sectionByActId.length > 0 && sectionByActId.map((item)=>{
                            return(
                          <option value={item && item.number}>{item && item.number} </option>

                            )
                          })}
                          {/* <option value="366A">366A</option>
                          <option value="366B">366B</option>
                          <option value="370">370</option>
                          <option value="370A">370A</option>
                          <option value="372">372</option>
                          <option value="373">373</option> */}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Date of section when added to FIR{" "}
                          {/* <span className="requiredStar">*</span> */}
                        </Form.Label>
                        <DatePicker
                          // message={'Please enter Charge sheet date'}
                          name="date_of_section_when_added_to_fir"
                          datePickerChange={onSectionChange}
                          data={
                            addSectionObj &&
                            addSectionObj.date_of_section_when_added_to_fir
                          }
                        />
                        {/* <Form.Control
                          type="date"
                          name="date_of_section_when_added_to_fir"
                          onChange={onSectionChange}
                        /> */}
                      </Form.Group>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                          type="text"
                          name="notes"
                          onChange={onSectionChange}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                      <Form.Group as={Col} md="auto" className="mb-3">
                        <Button
                          type="submit"
                          onClick={(e) => onSubmitASection(e)}
                          className="addbtn addbtn_blue shadow-0"
                        >
                          Add Section
                        </Button>
                      </Form.Group>
                    </Row>
                    {sectionArrbyFir && sectionArrbyFir.length > 0 && (
                      <>
                        <h4 className="mt-4 pt-2 pb-1 mb-4 small_heading">
                          List of Section
                        </h4>

                        <div className="table-responsive big-mobile-responsive">
                          <table className="table table-borderless mb-0">
                            <thead>
                              <tr>
                                <th width="12%">Type of section</th>
                                <th width="10%">Section</th>
                                <th width="12%">
                                  Date of section when added to FIR
                                </th>
                                <th width="10%">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sectionArrbyFir &&
                                sectionArrbyFir.length > 0 &&
                                sectionArrbyFir.map((item) => {
                                  return (
                                    <tr>
                                      {item && item.section_type && (
                                        <>
                                          <td>
                                            {item &&
                                              item.section_type &&
                                              item.section_type.toUpperCase()}
                                          </td>
                                          <td>
                                            {item &&
                                              item.section_number &&
                                              item.section_number}
                                          </td>
                                          <td>
                                            {item &&
                                              moment(item.date_of_section_when_added_to_fir).format("DD-MMM-YYYY")}
                                          </td>
                                          <td>{item && item.notes}</td>
                                        </>
                                      )}
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </>
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
                    onClick={(e) => onCancel(e)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={resultLoad === true ? true : false}
                    // disabled={
                    //   addChargeSheetData && !addChargeSheetData.location
                    //     ? true
                    //     : !addChargeSheetData.type_of_violation
                    //     ? true
                    //     : chargeSheetObj && !chargeSheetObj.number
                    //     ? true
                    //     : !chargeSheetObj.date
                    //     ? true
                    //     : firObj && !firObj.number
                    //     ? true
                    //     : false
                    // }
                    // onClick={(e) => addChargeSheetFunc(e)}
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

export default SurvivorChargesheet;
