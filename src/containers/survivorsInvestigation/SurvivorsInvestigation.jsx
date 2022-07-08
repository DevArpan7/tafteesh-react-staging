import React, { useState, useEffect } from "react";
import { Topbar, SurvivorTopCard } from "../../components";

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
import moment from "moment";
import { Button, Form, Row, Col } from "react-bootstrap";
import {getFirList, getSurvivorDetails, getInvestigationList, getInvestigationListByFirId, getChangeLog } from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import AlertComponent from "../../components/AlertComponent";
import { findAncestor, goToSurvivorChargeSheet } from "../../utils/helper";

import InvestigationDataTable from "./InvestigationDataTable";
import { NavLink, useHistory, useLocation } from "react-router-dom";

const SurvivorsInvestigation = (props) => {
  const [modalInvestigationShow, setModalInvestigationShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const investigationList = useSelector((state) => state.investigationList);
  const [validated, setValidated] = useState(false);

  const [addInvData, setAddInvData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://kamo-api.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const handleShow = () => setShowAlert(true);
  const [activeClass, setActiveClass] = useState(false);
  // const [survivorId, setSurvivorId] = useState("");
  const [resultLoad, setResultLoad] = useState(false)
  const [alertFlag,setAlertFlag] = useState('')
const [alertMessage,setAlertMessage]= useState('')

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [messagType, setMessagType] = useState('')

  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  const search = useLocation().search;
  const survivorId = new URLSearchParams(search).get('survivorId');
  const firId = new URLSearchParams(search).get('firId');
  // let url = props.location.search;
  // let queryValues = queryString.parse(url, { parseNumbers: true });

  console.log(survivorId, "getId")



  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // initFilters1();
  }, [investigationList]);


  useEffect(() => {
    // console.log(props.location,"loctaion");
    dispatch(getSurvivorDetails(survivorId));
    dispatch(getFirList(survivorId));
    if (firId) {
      dispatch(getInvestigationListByFirId(survivorId, firId))
    } else {
      dispatch(getInvestigationList(survivorId));
    }
  }, [survivorId]);

  const cancelFun = () => {
    setAddInvData({});
    // setSelectedData({});
    setModalInvestigationShow(false);
  };
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onSelectRow = (data) => {
    console.log(data, 'datatestdada');
    setActiveClass(true);
    setSelectedData(data);
    setAddInvData(data);
  };

  const gotoEdit = () => {
    if (selectedData && selectedData) {
      setModalInvestigationShow(true);
      setAddInvData(selectedData)
    } else {
      alert("Please select one Investigation to update");
    }
  };


  console.log(addInvData, "addInvData")

  const gotoAdd = () => {
    setSelectedData({});
    setAddInvData({});
    setModalInvestigationShow(true);
  };
  //   useEffect(()=>{
  //     setSurvivorId(props.location && props.location.state);
  // },[props.location && props.location.state]);

  const gotChargeSheet = (e) => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Investigation");
    } 
    else if(selectedData && selectedData.status_of_investigation ==="Ongoing"){
      setAlertFlag("alert");
      setAlertMessage("You can't add ChargeSheet for Ongoing Investigation")
      handleShow()
    }
    
    else {
      let object = {
        survivorId: survivorId,
        firId: firId,
        investigationId: selectedData && selectedData._id
      }

      goToSurvivorChargeSheet(e, object, history)
      // props.history.push({
      //   pathname: "/survivor-chargesheet",
      //   state: survivorId,
      //   investId: selectedData._id,
      //   firId: firId,
      //   flag:"fromInvest"
      // });
    }
  };
  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Investigation");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {

    let body = {
      deleted_by: deletedById && deletedById,
      deleted_by_ref: deletedByRef && deletedByRef
    }
    setResultLoad(true)
    axios
      .patch(api + "/survival-investigation/delete/" + selectedData._id, body)
      .then((response) => {
        handleClick();
        setMessagType("success")
        setResultLoad(false)
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getInvestigationListByFirId(survivorId, firId))
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error")
        setResultLoad(false)
      });
  };

  const handleSubmit = (event) => {
    console.log(event, "habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (selectedData && selectedData._id) {
        setValidated(false)
        addInvestigationFunc(event);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    } else {
      addInvestigationFunc(event);
    }
    setValidated(true);


  }

  const changeLogFunc = () => {
    let type = "investigation"
    dispatch(getChangeLog(type, deletedById))
    props.history.push("/change-log")
  }


  const addInvestigationFunc = (e) => {
    e.preventDefault();
    // var body = {
    //   ...addInvData,
    //   survivor: props.location && props.location.state,
    //   ref_fir: props && props.location && props.location.firId
    // };
    var addData = {
      ...addInvData,
      survivor: survivorId,
      ref_fir: firId
    };
    var updateData = {
      ...addInvData,
      survivor: survivorId,
      ref_fir: firId,
      user_id: deletedById && deletedById,
    };
    if (selectedData && selectedData._id) {
      setResultLoad(true)
      axios
        .patch(
          api + "/survival-investigation/update/" + selectedData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
         
          setMessagType("success")
          // setSelectedData({});
          setValidated(false)
          setResultLoad(false)
          if (response.data && response.data.error === false) {
            const { data } = response;
            setAddInvData({});
            dispatch(getInvestigationListByFirId(survivorId, firId))
            dispatch({ type: "INVESTIGATION_LIST", data: data.result });
            setModalInvestigationShow(false);
          }
        })
        .catch((error) => {
          setResultLoad(false)
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error")
        });
    } else {
      setResultLoad(true)
      axios
        .post(api + "/survival-investigation/create", addData, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          setValidated(false)
          setAddInvData({});
          setResultLoad(false)
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getInvestigationListByFirId(survivorId, firId))
            dispatch({ type: "INVESTIGATION_LIST", data: data.data });
            setModalInvestigationShow(false);
          }
        })
        .catch((error) => {
          setResultLoad(false)
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error")
        });
    }
  };

  //export csv function///

  console.log(investigationList, 'firrrrrrrrrrrrrr')
  // console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
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
    let headers = ['NameOfAgency,NameOfInvestigatingOfficer,RankOfInvestigatingOfficer,FirRefference,ResultOfInvestigation,StatusOfInvestigation,Source,Survivor,TypeOfInvestigationAgency,createdAt']

    // Convert users data to a csv
    let usersCsv = investigationList.reduce((acc, user) => {
      const {name_of_agency, name_of_inv_officer, rank_of_inv_officer, ref_fir, result_of_inv, status_of_investigation, source, survivor, type_of_investigation_agency, createdAt } = user
      acc.push([name_of_agency, name_of_inv_officer, rank_of_inv_officer, ref_fir, result_of_inv, status_of_investigation, source, survivorDetails.survivor_name, type_of_investigation_agency, moment(createdAt).format('DD-MMM-YYYY')].join(','))
      return acc
    }, [])

    downloadFile({
      data: [...headers, ...usersCsv].join('\n'),
      fileName: 'investigationList.csv',
      fileType: 'text/csv',
    })
  }

  //////pdf download////////////////


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
    doc.text("SURVIVOR INVESTIGATION LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      'Name Of Agency','Name Of Investigating Officer','Rank Of Investigating Officer','Fir Refference','Result Of Investigation','Status Of Investigation','Source','Survivor','Type Of Investigation Agency','createdAt'
    ];
    const name = "survivor-investigation-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    investigationList?.forEach((item) => {
      const temp = [
        item.name_of_agency, item.name_of_inv_officer, item.rank_of_inv_officer, item.ref_fir, item.result_of_inv, item.status_of_investigation, item.source, survivorDetails.survivor_name, item.type_of_investigation_agency, moment(item.createdAt).format('DD-MMM-YYYY')
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
              <h2 className="page_title">Survivor Investigation</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>
                  Survivor Investigation
                </MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            {survivorId && firId ?


              <div className="vieweditdelete">
                <Dropdown className="me-1">
                  <Dropdown.Toggle variant="border" className="shadow-0">
                    Action
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => gotChargeSheet(e)}>ChargeSheet</Dropdown.Item>
                    <Dropdown.Item onClick={downloadPdf}>Download PDF</Dropdown.Item>
                    <Dropdown.Item onClick={exportToCsv}>Export To Csv</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLogFunc()}>Change Log</Dropdown.Item>
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
              :
              <></>

            }
            <InvestigationDataTable
              investigationList={investigationList}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />

            {/* <div className="table-responsive big-desktop-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="8%">Location</th>
                    <th width="18%">Type of Investigation Agency</th>
                    <th width="12%">Investigation agency</th>
                    <th width="20%">Rank of the investigating officer</th>
                    <th width="15%">Status of investigation</th>
                  </tr>
                </thead>
                <tbody>
                  {investigationList && investigationList.length > 0 ? (
                    investigationList.map((item) => {
                      console.log(item, 'item');
                      return (
                        <tr
                          className={[
                            item._id === selectedData._id &&
                              activeClass === true &&
                              "current",
                          ]}
                          onClick={() => onSelectRow(item)}
                        >
                          <td>
                            {item && item.source && item.source.toUpperCase()}
                          </td>
                          <td>
                            {item &&
                              item.type_of_investigation_agency &&
                              item.type_of_investigation_agency}
                          </td>
                          <td>
                            {item && item.name_of_agency && item.name_of_agency}{" "}
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
                        </tr>
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
            </div> */}

          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalInvestigationShow}
        onHide={setModalInvestigationShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedData && selectedData._id ? "Update Investigation" : "Add Investigation"}
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
                    value={addInvData && addInvData.source && addInvData.source}
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"da"}>DA</option>
                    <option value={"sa"}>SA</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Source
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Type of Investigation agency{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="type_of_investigation_agency"
                    value={
                      addInvData &&
                      addInvData.type_of_investigation_agency &&
                      addInvData.type_of_investigation_agency
                    }
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"Police Station"}>Police Station</option>
                    <option value={"AHTU"}>AHTU</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Type of Investigation agency
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Name of agency conducting the investigation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="name_of_agency"
                    value={
                      addInvData &&
                      addInvData.name_of_agency &&
                      addInvData.name_of_agency
                    }
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="CID">CID</option>
                    <option value="Barvipur">Barvipur</option>
                    <option value="Barashat">Barashat</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select  Name of agency conducting the investigation
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Name of the investigating officer{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="name_of_inv_officer"
                    defaultValue={
                      addInvData &&
                      addInvData.name_of_inv_officer &&
                      addInvData.name_of_inv_officer
                    }
                    type="text"
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select  Name of the investigating officer
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Status of investigation{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="status_of_investigation"
                    value={
                      addInvData &&
                      addInvData.status_of_investigation &&
                      addInvData.status_of_investigation
                    }
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Select</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Status of investigation
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rank of the investigating officer{" "}
                    <span>(Designation or rank)</span>{" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="rank_of_inv_officer"
                    defaultValue={
                      addInvData &&
                      addInvData.rank_of_inv_officer &&
                      addInvData.rank_of_inv_officer
                    }
                    type="text"
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter  Rank of the investigating officer
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>Result of investigation </Form.Label>
                  <Form.Select
                    name="result_of_inv"
                    value={
                      addInvData &&
                      addInvData.result_of_inv &&
                      addInvData.result_of_inv
                    }
                    onChange={(e) =>
                      setAddInvData({
                        ...addInvData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Please select option</option>
                    <option>ChargeSheet</option>
                    <option>FRT</option>
                    <option>Pending</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => cancelFun()}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    disabled={resultLoad === true ? true : false}
                    // disabled={
                    //   addInvData && !addInvData.source
                    //     ? true
                    //     : !addInvData.type_of_investigation_agency
                    //     ? true
                    //     : !addInvData.name_of_agency
                    //     ? true
                    //     : !addInvData.name_of_inv_officer
                    //     ? true
                    //     : !addInvData.name_of_agency
                    //     ? true
                    //     : !addInvData.status_of_investigation
                    //     ? true
                    //     : !addInvData.rank_of_inv_officer
                    //     ? true
                    //     : false
                    // }
                    // onClick={addInvestigationFunc}
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
        alertFlag={alertFlag}alertMessage={alertMessage} 
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default SurvivorsInvestigation;