import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorDetails,
  getStateList,
  getRescueList,
  getChangeLog
} from "../../redux/action";
import moment from "moment";
import RescueDataTable from "./RescueDataTable";
import "./survivorsrescue.css";
import AlertComponent from "../../components/AlertComponent";

import DatePicker from "../../components/DatePicker";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const SurvivorsRescue = (props) => {
  const [modalRescueShow, setModalRescueShow] = useState(false);
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const rescueList = useSelector((state) => state.rescueList);
  const [selectedData, setSelectedData] = useState({});
  const stateList = useSelector((state) => state.stateList);
  const [addRescueData, setAddRescueData] = useState({});
  const [validated, setValidated] = useState(false);

  const [activeClass, setActiveClass] = useState(false);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const dispatch = useDispatch();
  const [survivorId, setSurvivorId] = useState("");
  const api = "https://kamo-api.herokuapp.com/api/survival-rescue";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [messagType,setMessagType] = useState('')

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // initFilters1();
  }, [rescueList]);


  useEffect(() => {
    setSurvivorId(props.location && props.location.state);
    console.log();
    dispatch(getSurvivorDetails(props.location && props.location.state));
    dispatch(getStateList());
    dispatch(getRescueList(props.location && props.location.state));
  }, [props]);
console.log(stateList,'state')
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSelectRow = (item) => {
    setSelectedData(item);
    setActiveClass(true);
  };
  const gotoAdd = () => {
    setAddRescueData({});
    setModalRescueShow(true);
  };

  const gotoEdit = () => {
    setAddRescueData(selectedData);
    setModalRescueShow(true);
  };



  const changeLogFunc=()=>{
    let type= "rescue"
    dispatch(getChangeLog(type,deletedById))
    props.history.push("/change-log")
  }
  

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Rescue");
    } else {
      setShowAlert(true);
    }
  };
  console.log(rescueList,'rescueeeeeeeeeeeeeeeeeeeee')

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
        setMessagType("success")
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getRescueList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error")
      });
  };


//// age of now
const calculate_age = (obj) => {
  console.log(obj,"survivorDetils")
  var  birthDate= new Date(survivorDetails && survivorDetails.date_of_birth);
  var  today= new Date(obj);  // create a date object directly from `dob1` argument
  var age_now = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
  {
      age_now--;
  }
  console.log(age_now);
  setAddRescueData({
    ...addRescueData,
    age_when_rescued: age_now
  })
  return age_now;
}
useEffect(()=>{
  if(addRescueData && addRescueData.date_of_rescue){
  calculate_age(addRescueData.date_of_rescue)
  }
},[addRescueData && addRescueData.date_of_rescue])

  const handleSubmitRes = (event) => {
    console.log(event, "habdleSubmit");
    // const {form}= event.target

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if(addRescueData && addRescueData._id){
        addRescue(event);
      }else{
      event.preventDefault();
      event.stopPropagation();
      }
    } else {
      addRescue(event);
    }
    setValidated(true);
  };
  
  //////add rescue API call function ////////////
  const addRescue = (e) => {
    e.preventDefault();
    let updateData = {
      ...addRescueData,
      survivor: survivorId && survivorId,
      user_id: deletedById && deletedById,
    };
    let addData = {
      ...addRescueData,
      survivor: survivorId && survivorId,
    };

    console.log(updateData,"updateData",addData,"addData");
    console.log(addRescueData, "addRescueData");
    if (addRescueData && addRescueData._id) {
      axios
        .patch(api + "/update/" + addRescueData._id, updateData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          setMessagType("success")
          setValidated(false)
          setActiveClass(false)
          setAddRescueData({});
          if (res && res.data && res.data.error == false) {
            const { data } = res;

            console.log(data, res);
            // dispatch({ type: "PARTICIPATION_LIST", data: data });
            dispatch(getRescueList(survivorId));
            setModalRescueShow(false);
          }
        })
        .catch((error) => {
          console.log(error);
          handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error")
        });
    } else {
      axios
        .post(api + "/create", addData, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          setValidated(false)
          setAddRescueData({});
          setActiveClass(false)
          setMessagType("success")
          if (res && res.data && res.data.error == false) {
            const { data } = res;

            console.log(data, res);
            // dispatch({ type: "PARTICIPATION_LIST", data: data });
            dispatch(getRescueList(survivorId));
            setModalRescueShow(false);
          }
        })
        .catch((error) => {
          console.log(error);
          handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error")
        });
    }
  };
  const onChangeDateHandler =(e)=>{
    setAddRescueData({
      ...addRescueData,
      [e.target.name]: e.target.value,
    })
  }
  const formatDate = (value) => {
    //console.log(value, "value");
    // return value.toLocaleDateString('en-US', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    // });
    return moment(value).format("DD-MMM-YYYY");
  };

  let exportData=[]
  rescueList.map((x,index)=>{
      exportData.push({survivor:survivorDetails.survivor_name,age_when_rescued:x.age_when_rescued,date_of_rescue:formatDate(x.date_of_rescue),nature_of_the_place_of_rescue:x.nature_of_the_place_of_rescue,rescue_conducted_by:x.rescue_conducted_by,rescue_from_city:x.rescue_from_city,rescue_from_place:x.rescue_from_place,rescue_from_state:x.rescue_from_state.name,update_notes : x.update_notes})
  })
  console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
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
  
  const exportToCsv = e => {
    e.preventDefault()

    // Headers for each column
    let headers = ['Id,Surviver,Age when rescued,Date Of Rescue,Natur Of the Place,Conducted By,Rescue City,Rescue Place,Rescue State,Update Notes']

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
        const { survivor,age_when_rescued,date_of_rescue,nature_of_the_place_of_rescue,rescue_conducted_by,rescue_from_city,rescue_from_place,rescue_from_state,update_notes} = user
        acc.push([survivor,age_when_rescued,date_of_rescue,nature_of_the_place_of_rescue,rescue_conducted_by,rescue_from_city,rescue_from_place,rescue_from_state,update_notes].join(','))
        return acc
    }, [])

    downloadFile({
        data: [...headers, ...usersCsv].join('\n'),
        fileName: 'RescueList.csv',
        fileType: 'text/csv',
    })
}


//download pdf function

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
  doc.text("SURVIVOR RESCUE LIST", 22, 60);
  doc.setFontSize(10);
  const survivorColumns = [
    'Surviver','Age when rescued','Date Of Rescue','Nature Of the Place','Conducted By','Rescue City','Rescue Place','Rescue State','Update Notes'
  ];
  const name = "survivor-rescue-list" + new Date().toISOString() + ".pdf";
  let goalsRows = [];
  exportData?.forEach((item) => {
    const temp = [
      item.survivor,item.age_when_rescued,item.date_of_rescue,item.nature_of_the_place_of_rescue,item.rescue_conducted_by,item.rescue_from_city,item.rescue_from_place,item.rescue_from_state,item.update_notes
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
              <h2 className="page_title">Survivor Rescue</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Survivor Rescue</MDBBreadcrumbItem>
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
                  <Dropdown.Item onClick={downloadPdf}>Download PDF</Dropdown.Item>
                  <Dropdown.Item onClick={exportToCsv}>Export To CSV</Dropdown.Item>
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
              <RescueDataTable
                rescueList={rescueList && rescueList.length > 0 && rescueList}
                onSelectRow={onSelectRow}
                isLoading={isLoading}
              />
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
            Add Rescue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmitRes}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Date of Rescue
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker 
                    required
                    message={"Please enter date of Rescue."} 
                    name="date_of_rescue"
                    datePickerChange={onChangeDateHandler} 
                    data={addRescueData && addRescueData.date_of_rescue}
                  />
                  {/* <Form.Control
                    required
                    value={
                      addRescueData &&
                      addRescueData.date_of_rescue &&
                      moment(addRescueData.date_of_rescue).format("YYYY-MM-DD")
                    }
                    type="date"
                    name="date_of_rescue"
                    placeholder="Date of Rescue"
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter date of Rescue.
                  </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Age when rescued
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addRescueData && addRescueData.age_when_rescued
                    }
                    disabled={true}
                    // onChange={(e) =>
                    //   setAddRescueData({
                    //     ...addRescueData,
                    //     [e.target.name]: e.target.value,
                    //   })
                    // }
                    type="number"
                    name="age_when_rescued"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Age when Rescued.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rescue from place
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addRescueData && addRescueData.rescue_from_place
                    }
                    name="rescue_from_place"
                    type="text"
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Rescue from place .
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rescue from state <span className="requiredStar">*</span>
                  </Form.Label>

                  <Form.Select
                    required
                    name="rescue_from_state"
                    value={addRescueData && addRescueData.rescue_from_state && addRescueData.rescue_from_state._id}
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true} value="">
                      Default select
                    </option>
                    {stateList &&
                      stateList.length > 0 &&
                      stateList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please enter Rescue from state .
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rescue from city
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addRescueData && addRescueData.rescue_from_city
                    }
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="rescue_from_city"
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Rescue from city .
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Nature of the place of rescue{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addRescueData &&
                      addRescueData.nature_of_the_place_of_rescue
                    }
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="nature_of_the_place_of_rescue"
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Nature of the place of rescue
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Who conducted the rescue?{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="rescue_conducted_by"
                    value={addRescueData && addRescueData.rescue_conducted_by}
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true} value={""}>
                      Default select
                    </option>
                    <option value="self">Self</option>
                    <option value="customer">Customer</option>
                    <option value="family">Family</option>
                    <option value="local_police">Local Police</option>
                    <option value="ahtu">AHTU</option>
                    <option value="ngo">NGO</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Who conducted the rescue
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    Update Notes <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows="4"
                    name="update_notes"
                    defaultValue={addRescueData && addRescueData.update_notes}
                    onChange={(e) =>
                      setAddRescueData({
                        ...addRescueData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Enter the Reason"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter update notes
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setModalRescueShow(false)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    // onClick={addRescue}
                    // disabled={
                    //   addRescueData && !addRescueData.date_of_rescue
                    //     ? true
                    //     : !addRescueData.age_when_rescued
                    //     ? true
                    //     : !addRescueData.rescue_from_place
                    //     ? true
                    //     : !addRescueData.rescue_from_state
                    //     ? true
                    //     : !addRescueData.rescue_from_city
                    //     ? true
                    //     : !addRescueData.nature_of_the_place_of_rescue
                    //     ? true
                    //     : !addRescueData.rescue_conducted_by
                    //     ? true
                    //     : !addRescueData.update_notes
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

export default SurvivorsRescue;
