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
import { Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getShelterHomeList,
  getSurvivorDetails,
  getShelterQuestionList,
  getChangeLog
} from "../../redux/action";
import NotificationPage from "../../components/NotificationPage";
import moment from "moment";
import ShelterHomeDataTable from "./ShelterHomeDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";

const SurvivorShelterHome = (props) => {
  const [modalShelterHomeShow, setModalShelterHomeShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const shelterHomeList = useSelector((state) => state.shelterHomeList);
  const [addShelterHomeData, setAddShelterHomeData] = useState({});
  const shelterQuestionList = useSelector((state) => state.shelterQuestionList);
  const [journeyObj, setJourneyObj] = useState({});
  const [journeyArr, setJourneyArr] = useState([]);
  const api = "https://tafteesh-staging-node.herokuapp.com/api/shelter-home";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const deletedById= localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  
  const[resultLoad, setResultLoad] = useState(false)
  

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [shelterHomeList]);

  const changeLogFunc=()=>{
    let type= "shelter"
    dispatch(getChangeLog(type,deletedById))
    props.history.push("/change-log")
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (props.location.state) {
      dispatch(getShelterHomeList(props.location.state));
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getShelterQuestionList());
    }
  }, [props]);
  console.log(shelterQuestionList, "shelterQuestionList");
  console.log(shelterHomeList, "shelterHOMEList");


  const onJourneyChange = (e, ques, index) => {
    const toUpdate = [...journeyArr];
    if (toUpdate[index]) {
      toUpdate[index][e.target.name] = e.target.value;
      toUpdate[index]["question"]= ques && ques;
    } else {
      toUpdate.push({
        [e.target.name]: e.target.value,
        "question": ques && ques,
      });
    }
    setJourneyArr(toUpdate);
  };
  

  // const onJourneyChange = (e, ques) => {
  //   console.log(ques);
  //   setJourneyObj({
  //     ...journeyObj,
  //     question: ques && ques,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  useEffect(() => {
    console.log(journeyObj, "journeyObj");
    if (journeyObj && journeyObj.answer && journeyObj.score) {
      setJourneyArr([...journeyArr, journeyObj]);
    }
  }, [journeyObj]);

  const gotoAdd = (e) => {
    setModalShelterHomeShow(true);
    setActiveClass(false);
    setAddShelterHomeData({});
    setJourneyArr([]);
    setSelectedData({})
    setJourneyObj({});
  };
  const gotoEdit = (e) => {
    setModalShelterHomeShow(true);
    setAddShelterHomeData({
      source: selectedData && selectedData.source,
      shelter_home: selectedData && selectedData.shelter_home,
      from_date: selectedData && selectedData.from_date,
      to_date: selectedData && selectedData.to_date,
    });

    setJourneyArr(selectedData && selectedData.journey && selectedData.journey);
  };
  const onCancel = () => {
    setModalShelterHomeShow(false);
    setAddShelterHomeData({});
    setJourneyArr([]);
    setJourneyObj({});
  };
  const onSelectRow = (data) => {
    console.log(data);
    setActiveClass(true);
    setSelectedData(data);
  };




  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one shelter-home");
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
      .patch(api + "/delete/" + selectedData._id,body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({})
          dispatch(getShelterHomeList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
  const handleSubmit = (event) => {
    console.log(event,"habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if(selectedData && selectedData._id){
        addShelterHomeFunc(event);
    setValidated(false);

      }
      else{
      event.preventDefault();
      event.stopPropagation();
      }
    } else{
      addShelterHomeFunc(event);
    }
    setValidated(true);

  }
  ///// API CAL ADD AND UPDATE shelter home//////

  const addShelterHomeFunc = (e) => {
    e.preventDefault();
    // const tempData = {
    //   ...addShelterHomeData,
    //   survivor: props.location.state,
    //   journey: journeyArr,

    // };
    let isValid = true;
    if (journeyArr.length > 0) {
      for (let i = 0; i < journeyArr.length; i++) {
        if (journeyArr[i].answer && journeyArr[i].score === undefined) {
          isValid = false;
          break;
        }
      }
    }
    if (!isValid) {
      alert("please add score for the journey you want to add.");
      return;
    }
    var addData = {
      ...addShelterHomeData,
      survivor: props.location && props.location.state,
      journey: journeyArr,
    };
    var updateData = {
      ...addShelterHomeData,
      survivor: props.location && props.location.state,
      user_id: deletedById && deletedById,
      journey: journeyArr,
    };

    if (selectedData && selectedData._id) {
      setResultLoad(true)
      axios
        .patch(api + "/update/" + selectedData._id, updateData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setAddShelterHomeData({});
          setJourneyArr([]);
          setJourneyObj({});
          setValidated(false);
          setResultLoad(false)
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            console.log(data, res);
            dispatch(getShelterHomeList(props.location.state));
            setModalShelterHomeShow(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setResultLoad(false)
        });
    } else {
      setResultLoad(true)
      axios
        .post(api + "/create", addData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setAddShelterHomeData({});
          setJourneyArr([]);
          setJourneyObj({});
          setValidated(false);
          setResultLoad(false)
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            console.log(data, res);
            dispatch(getShelterHomeList(props.location.state));
            setModalShelterHomeShow(false);
          }
        })
        .catch((error) => {
          setResultLoad(false)
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
    let headers = ["Id,Survivor,Source,Shelter Home,From,To"];

    // Convert users data to a csv
    let usersCsv = shelterHomeList.reduce((acc, user) => {
      const { _id,survivor, source, shelter_home, from_date, to_date } = user;
      acc.push([_id,survivor, source, shelter_home, formatDate(from_date), formatDate(to_date)].join(","));
      return acc;
    }, []);

    downloadCsvFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "shelterHomeList.csv",
      fileType: "text/csv",
    });
  };

  const fromDateChangeHandel = (e) =>{
    setAddShelterHomeData({
      ...addShelterHomeData,
      [e.target.name]: e.target.value,
    })
  }
  const toDateChangeHandel = (e) =>{
    setAddShelterHomeData({
      ...addShelterHomeData,
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
    doc.text("SHELTER HOME LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "SOURCE",
      "SHELTER HOME",
     "FROM",
     "TO",
      "CREATED AT"
    ];
    const name = "shelter-home-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    shelterHomeList?.forEach((item) => {
      const temp = [
        item.source,
        item.shelter_home,
        moment(item.from_date).format("DD/MM/YYYY"),
        moment(item.to_date).format("DD/MM/YYYY"),
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
              <h2 className="page_title">Shelter Home</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Shelter Home</MDBBreadcrumbItem>
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
                    Export PDF
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
                <span onClick={() => gotoAdd()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => gotoEdit()}>
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
              <ShelterHomeDataTable
                shelterHomeList={
                  shelterHomeList &&
                  shelterHomeList.length > 0 &&
                  shelterHomeList
                }
                onSelectRow={onSelectRow}
                isLoading={isLoading}
              />
              {/* <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="12%">Source</th>
                                        <th width="12%">Shelter Home</th>
                                        <th width="12%">From</th>
                                        <th width="12%">To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shelterHomeList && shelterHomeList.length > 0 ? shelterHomeList.map((item) => {
                                        return (

                                            <tr  className={[item._id === selectedData._id && activeClass === true && 'current']}
                                            onClick={() => onSelectRow(item)}>
                                                <td>{item && item.sa && item.sa}</td>
                                                <td>{item && item.shelter_home && item.shelter_home}</td>
                                                <td>{item && item.from_date && moment(item.from_date).format("DD/MM/YYYY")}</td>
                                                <td>{item && item.to_date && moment(item.to_date).format("DD/MM/YYYY")}</td>
                                            </tr>

                                        )
                                    })
                                        :
                                        <tr>
                                             <td className="text-center" colSpan={4}>
                                                <b>NO Data Found !!</b>
                                            </td>
                                        </tr>
                                    }

                                </tbody>
                            </table> */}
            </div>
          </div>
            <>
            {selectedData && selectedData.journey && selectedData.journey.length > 0 &&
              <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap           position-relative">
                <h4 className="mb-4 small_heading">Journey</h4>
               
                <div className="table-responsive big-mobile-responsive">
                <table className="table table-borderless mb-0">
                            <thead>
                                <tr>
                                    <th width="15%">Question</th>
                                    <th width="15%">Answer</th>
                                    <th width="6%">Survivor Score</th>
                                </tr>
                            </thead>
                            <tbody>
                              {selectedData && selectedData.journey && selectedData.journey.length > 0 &&selectedData.journey.map((item)=>{
                                return(
<tr>
                                    <td>{item && item.question}</td>
                                    <td>{item && item.answer}</td>
                                    <td><button
                                    style={{
                                      padding: "6px 13px",
                                      borderRadius: "5px",
                                      fontWeight: 600,
                                      letterSpacing: "0.5px",
                                      fontSize: "12px",
                                      border: "1px solid #AB9D1A",
                                    }}
                                  >
                                    {item && item.score +"/10"}
                                  </button></td>
                                </tr>
                                )
                              })}
                                
                                
                            </tbody>
                        </table>
                </div>
              </div>
}
            </>
        
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalShelterHomeShow}
        onHide={setModalShelterHomeShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Shelter Home
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form  noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Source <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                  required
                    name="source"
                    value={
                      addShelterHomeData &&
                      addShelterHomeData.source &&
                      addShelterHomeData.source
                    }
                    onChange={(e) =>
                      setAddShelterHomeData({
                        ...addShelterHomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Default select</option>
                    <option value="da">DA</option>
                    <option value="sa">SA</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
              Please select Source
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Shelter Home <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                  required
                    name="shelter_home"
                    type="text"
                    defaultValue={
                      addShelterHomeData &&
                      addShelterHomeData.shelter_home &&
                      addShelterHomeData.shelter_home
                    }
                    onChange={(e) =>
                      setAddShelterHomeData({
                        ...addShelterHomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                    <Form.Control.Feedback type="invalid">
              Please enter Shelter Home
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    From Date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    required
                    message={"Please select From Date"}
                    name="from_date"
                    data={addShelterHomeData &&
                      addShelterHomeData.from_date}
                    datePickerChange={fromDateChangeHandel}
                  />
                  {/* <Form.Control
                    required
                    type="date"
                    name="from_date"
                    value={
                      addShelterHomeData &&
                      addShelterHomeData.from_date &&
                      moment(addShelterHomeData.from_date).format("YYYY-MM-DD")
                    }
                    onChange={(e) =>
                      setAddShelterHomeData({
                        ...addShelterHomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="From Date"
                  />
                   <Form.Control.Feedback type="invalid">
              Please select  From Date
            </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    To Date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    required
                    message={"Please select To Date"}
                    name="to_date"
                    data={addShelterHomeData &&
                    addShelterHomeData.to_date}
                    datePickerChange={toDateChangeHandel}
                  />
                  {/* <Form.Control
                    required
                    type="date"
                    name="to_date"
                    value={
                      addShelterHomeData &&
                      addShelterHomeData.to_date &&
                      moment(addShelterHomeData.to_date).format("YYYY-MM-DD")
                    }
                    onChange={(e) =>
                      setAddShelterHomeData({
                        ...addShelterHomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="To Date"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select To Date
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <h4 className="modalSectionTitle">Journey</h4>
                  {shelterQuestionList &&
                    shelterQuestionList.length > 0 &&
                    shelterQuestionList.map((ques,index) => {
                      return (
                        <div className="questionSet" key={index}>
                          <div className="questionSetQ">
                            <div className="row">
                              <div className="col-lg">
                                <h5>Q.1.</h5>
                              </div>
                              <div className="col-lg-10">
                                <h5>
                                  {ques && ques.question && ques.question}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="questionSetA">
                            <div className="row align-items-center">
                              <div className="col-lg">
                                <h5>Ans.</h5>
                              </div>
                              <div className="col-lg-6">
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    name="answer"
                                    // onBlur={(e) =>
                                    //   onJourneyChange(e, ques.question)
                                    // }
                                    defaultValue={journeyArr[index] !== undefined &&
                                      journeyArr[index].answer ? journeyArr[index].answer: null}
                                    onChange={(e) =>
                                      onJourneyChange(e, ques.question, index)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div className="col-lg-3">
                                <Form.Group>
                                  <Form.Select
                                    
                                    disabled={
                                      journeyArr[index] !== undefined &&
                                      journeyArr[index].answer
                                        ? false
                                        : true
                                    }
                                    name="score"
                                    defaultValue={journeyArr[index] !== undefined &&
                                      journeyArr[index].score}
                                    onChange={(e) =>
                                      onJourneyChange(e, ques.question, index)
                                    }
                                  >
                                    <option hidden={true}>
                                      Select score
                                    </option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                  </Form.Select>
                                </Form.Group>
                              </div>

                            
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                    disabled={resultLoad}
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

export default SurvivorShelterHome;
