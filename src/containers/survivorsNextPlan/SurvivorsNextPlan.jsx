import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCard } from "../../components";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import { getSurvivorDetails, getNextPlanList ,getChangeLog} from "../../redux/action";
import moment from "moment";
import NextPlanDataTable from "./NextPlanDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";

const SurvivorsNextPlan = (props) => {
  const [modalRescueShow, setModalRescueShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/survival-nextplanaction";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [validated, setValidated] = useState(false);

  const [selected, setSelected] = useState([]);
  const [addNextData, setAddNextData] = useState({});
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const nextPlanList = useSelector((state) => state.nextPlanList);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [nextPlanList]);


  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getNextPlanList(props.location.state));
    }
  }, [props]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const gotToEdit = () => {
    if (selectedData && selectedData._id) {
      setModalRescueShow(true);
      setAddNextData(selectedData);
    } else {
      alert("Please select one Next plan to update");
    }
  };

  const onCancel = () => {
    setModalRescueShow(false);
    setActiveClass(false);
    setSelectedData({});
    setAddNextData({});
    setValidated(false);
  };
  const onAddHandle = () => {
    setModalRescueShow(true);
    setActiveClass(false);
    setSelectedData({});
    setAddNextData({});
  };

  const onSelectRow = (data) => {
    console.log(data);
    setActiveClass(true);
    setSelectedData(data);
    setAddNextData(data);
  };

  const changeLogFunc=()=>{
    let type= "next_plan"
    dispatch(getChangeLog(type,deletedById))
    props.history.push("/change-log")
  }
  
  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Nest plan");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: deletedByRef && deletedByRef,
    };
    axios
      .patch(api + "/delete/" + selectedData._id, body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({});
          dispatch(getNextPlanList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };

  const handleSubmit = (event) => {
    console.log(event, "habdleSubmit");
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      addSurvivorNextPlanFunc(event);
    }
    setValidated(true);
  };
  ///// API CAL ADD AND UPDATE NEXT PLAN //////

  const addSurvivorNextPlanFunc = (e) => {
    e.preventDefault();
    const addData = {
      ...addNextData,
      survivor: props.location.state,
    };
    const updateData = {
      ...addNextData,
      survivor: props.location.state,
      user_id: deletedById && deletedById,
    };

    if (addNextData && addNextData._id) {
      axios
        .patch(api + "/update/" + addNextData._id, updateData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          setValidated(false)
          if (res && res.data && res.data.error == false) {
            const { data } = res;

            console.log(data, res);
            dispatch(getNextPlanList(props.location.state));
            setModalRescueShow(false);
            setAddNextData({});
            setSelectedData({});
            setActiveClass(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post(api + "/create", addData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setValidated(false)
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            console.log(data, res);
            dispatch(getNextPlanList(props.location.state));
            setModalRescueShow(false);
            setAddNextData({});
            setSelectedData({});
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  /////////////// for csv function ////

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
  const formatDate = (value) => {
    //console.log(value, "value");
    // return value.toLocaleDateString('en-US', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    // });
    return moment(value).format("DD-MMM-YYYY");
  };

  const exportToCsv = (e) => {
    console.log(e, "e");
    e.preventDefault();

    // Headers for each column
    let headers = ["Id,Planned Date,Plan Type,For,Status/Is Closed,To Do,MOde Of Meeting,Next Followup Action,Next Followup Date,Outcome,Reminder,Select,Stakeholdder Type,Stakeholder Participants,Survivor"];

    // Convert users data to a csv
    let usersCsv = nextPlanList.reduce((acc, user) => {
      const { _id, plan_date, type, plan_for, status, to_do,mode_of_meeting,next_followUp_action,next_followUp_date,outcome,remind_before_day_planed_date,select,stakeholdder_type,stakeholder_participants,survivor } = user;
      acc.push([ _id,formatDate(plan_date), type, plan_for, status, to_do,mode_of_meeting,next_followUp_action,formatDate(next_followUp_date),outcome,remind_before_day_planed_date,select,stakeholdder_type,stakeholder_participants,survivor].join(","));
      return acc;
    }, []);

    downloadCsvFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "nextPlanList.csv",
      fileType: "text/csv",
    });
  };

  const planDateChangeHandler = (e) =>{
    setAddNextData({
      ...addNextData,
      [e.target.name]: e.target.value,
    })
  }

  const nextFollowDateChangeHandel = (e) =>{
    setAddNextData({
      ...addNextData,
      [e.target.name]: e.target.value,
    })
  } 
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
    doc.text("SURVIVOR NEXT PLAN LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "MEETING MODE",
      "FOLLOWUP ACTION",
      "FOLLOWUP DATE",
      "OUTCOME",
      "PLANNED DATE",
      "PLAN TYPE",
      "FOR",
      "STATUS",
      "TO DO",
      "REMIND BEFORE",
      "SELECT",
      "STAKE HOLDER TYPE",
      "PARTICIPANTS",
      "CREATED AT"
    ];
    const name = "survivor-next-plan-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    debugger;
    nextPlanList?.forEach((item) => {
      const temp = [
        item.mode_of_meeting,
        item.next_followUp_action,
        moment(item.next_followUp_date).format("DD/MM/YYYY"),
        item.outcome,
        moment(item.plan_date).format("DD/MM/YYYY"),
        item.type,
        item.plan_for,
        item.status,
        item.to_do,
        item.remind_before_day_planed_date,
        item.select,
        item.stakeholdder_type,
        item.stakeholder_participants,
        moment(item.createdAt).format("DD/MM/YYYY"),
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
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Next Plan</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Next Plan</MDBBreadcrumbItem>
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
                  <Dropdown.Item onClick={downloadPdf}>
                    Download PDF
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(e) => exportToCsv(e)}>
                    Export CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={()=>changeLogFunc()}>Change Log</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add"
              >
                <span onClick={() => onAddHandle()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => gotToEdit()}>
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
              <NextPlanDataTable
                nextPlanList={nextPlanList}
                onSelectRow={onSelectRow} isLoading={isLoading}
              />
              {/* <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="12%">Planned Date</th>
                                        <th width="15%">Plan Type</th>
                                        <th width="12%">For</th>
                                        <th width="15%">Status/Is Closed</th>
                                        <th width="20%">To Do</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nextPlanList && nextPlanList.length > 0 ? nextPlanList.map((item) => {
                                        return (

                                            <tr
                                                className={[item._id === selectedData._id && activeClass === true && 'current']}
                                                onClick={() => onSelectRow(item)}>
                                                <td>{item && item.plan_date && moment(item.plan_date).format("DD/MM/YYYY")}</td>
                                                <td>{item && item.type && item.type}</td>
                                                <td>{item && item.plan_for && item.plan_for}</td>
                                                <td>{item && item.status && item.status}</td>
                                                <td>{item && item.to_do && item.to_do}</td>
                                            </tr>

                                        )
                                    })
                                        :
                                        <tr>
                                             <td className="text-center" colSpan={5}>
                                                <b>NO Data Found !!</b>
                                            </td>
                                        </tr>

                                    }
                                </tbody>
                            </table> */}
            </div>
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalRescueShow}
        onHide={setModalRescueShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Next Plan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    To do <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="to_do"
                    type="text"
                    defaultValue={
                      addNextData && addNextData.to_do && addNextData.to_do
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter To do
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Plan date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    required
                    message={"Please Select Plan date"}
                    data={addNextData &&
                      addNextData.plan_date}
                    name="plan_date"
                    datePickerChange={planDateChangeHandler}
                  />
                  {/* <Form.Control
                    required
                    type="date"
                    name="plan_date"
                    value={
                      addNextData &&
                      addNextData.plan_date &&
                      moment(addNextData.plan_date).format("YYYY-MM-DD")
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Date of Birth"
                  />
                   <Form.Control.Feedback type="invalid">
                    Please Select Plan date 
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Plan for <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="plan_for"
                    value={
                      addNextData &&
                      addNextData.plan_for &&
                      addNextData.plan_for
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="Social Worker">Social Worker</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please Select Plan for 
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Plan Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="type"
                    required
                    value={addNextData && addNextData.type && addNextData.type}
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="System">System</option>
                    <option value="Own">Own</option>
                    <option value="readonly">Readonly</option>
                    {/* <option>FIR</option>
                                    <option>ChargeSheet</option>
                                    <option>Investigation</option>
                                    <option>Inernal Review Meeting</option>
                                    <option>Planning Meeting</option> */}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please Select Plan Type
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Select <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="select"
                    required
                    value={
                      addNextData && addNextData.select && addNextData.select
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="PC">PC</option>
                    <option value="VC">VC</option>
                    <option value="Rehab">Rehab</option>
                    <option value="Advocacy Training">Advocacy Training</option>
                    <option value="FIR">FIR</option>
                    <option value="ChargeSheet">ChargeSheet</option>
                    <option value="Investigation">Investigation</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please Select 
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Remind before (N) days of planned date
                  </Form.Label>
                  <Form.Control
                    defaultValue={
                      addNextData &&
                      addNextData.remind_before_day_planed_date &&
                      addNextData.remind_before_day_planed_date
                    }
                    name="remind_before_day_planed_date"
                    type="number"
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Mode of meeting</Form.Label>
                  <Form.Select
                    name="mode_of_meeting"
                    value={
                      addNextData &&
                      addNextData.mode_of_meeting &&
                      addNextData.mode_of_meeting
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Default select</option>
                    <option value="Personal Visit">Personal Visit</option>
                    <option value="Online">Online</option>
                    <option value="Phone call">Phone call</option>
                  </Form.Select>
                </Form.Group>
                {/* <Form.Group as={Col} md="6" className="mb-3">
                                    <Form.Label>Survivor</Form.Label>
                                    <MultiSelect
                                        name="survivor"
                                        options={options}
                                        value={selected}
                                        hasSelectAll={false}
                                        disableSearch={true}
                                        onChange={setSelected}
                                        labelledBy={"Select"}
                                        className={"accusedMultiselect-box multiselectbox_span"}
                                        overrideStrings={{
                                            selectSomeItems: "Select columns to view",
                                            allItemsAreSelected: "All Items are Selected",
                                            selectAll: "Select All",
                                            search: "Search",
                                        }}
                                    />
                                </Form.Group> */}

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Stakeholder Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="stakeholdder_type"
                    required
                    value={
                      addNextData &&
                      addNextData.stakeholdder_type &&
                      addNextData.stakeholdder_type
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="KAMO">KAMO</option>
                    <option value="Other NGO">Other NGO</option>
                    <option value="Other Tafteesh partner">
                      Other Tafteesh Partner
                    </option>
                    <option value="Survivor">Survivor</option>
                    <option value="Survivor family">Survivor Family</option>
                    <option value="Duty Bearer">Duty Bearer</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select  Stakeholder Type 
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Stakeholders/Participants{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>

                  <Form.Control
                    type="text"
                    required
                    defaultValue={
                      addNextData &&
                      addNextData.stakeholder_participants &&
                      addNextData.stakeholder_participants
                    }
                    name="stakeholder_participants"
                    placeholder="Enter the Reason"
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
                    Please enter Stakeholders/Participants
                  </Form.Control.Feedback>
                  {/* <Form.Select>
                                        <option hidden={true}>Default select</option>
                                        <option>Rank Officer</option>
                                        <option>Duty Bearer</option>
                                    </Form.Select> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    required
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addNextData && addNextData.status && addNextData.status
                    }
                  >
                    <option value={""} hidden={true}>
                      Please select
                    </option>
                    <option value="Planning">Planning</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Status
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Outcome <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    required
                    defaultValue={
                      addNextData && addNextData.outcome && addNextData.outcome
                    }
                    name="outcome"
                    placeholder="Enter the Reason"
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
                    Please enter Outcome
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Next Followup date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    name="next_followUp_date"
                    required
                    data={addNextData &&
                      addNextData.next_followUp_date}
                    message={"Please select Next Followup date"}
                    datePickerChange={nextFollowDateChangeHandel}                    
                  />
                  {/* <Form.Control
                    type="date"
                    name="next_followUp_date"
                    required
                    placeholder="Date of Birth"
                    defaultValue={
                      addNextData &&
                      addNextData.next_followUp_date &&
                      moment(addNextData.next_followUp_date).format(
                        "YYYY-MM-DD"
                      )
                    }
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select Next Followup date 
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Next Followup Action <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addNextData &&
                      addNextData.next_followUp_action &&
                      addNextData.next_followUp_action
                    }
                    name="next_followUp_action"
                    type="text"
                    onChange={(e) =>
                      setAddNextData({
                        ...addNextData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Next Followup Action 
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
                    // disabled={addNextData && !addNextData.to_do ? true : !addNextData.plan_date ? true : !addNextData.plan_for ? true : !addNextData.select ? true : !addNextData.type ? true : !addNextData.stakeholder_participants ? true : !addNextData.stakeholdder_type ? true : !addNextData.status ? true : !addNextData.outcome ? true : !addNextData.next_followUp_date ? true : !addNextData.next_followUp_action ? true : false}
                    // onClick={addSurvivorNextPlanFunc}
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

export default SurvivorsNextPlan;
