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
import "./survivorlawyers.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorLawyersList,
  getSurvivorDetails,
  getStateList,
  getLawyersList,
  getLawyersListByCatId,
  getLawyersCategoryList,
  getChangeLog
} from "../../redux/action";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import LoanDataTable from "./LawyerDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";


const SurvivorsLawyers = (props) => {
  const [modalNewloanLogShow, setModalNewloanLogShow] = useState(false);
  const [modalPaidlogShow, setModalPaidlogShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivalLoanList = useSelector((state) => state.survivalLoanList);
  const survivorLawyersList = useSelector((state) => state.survivorLawyersList);
  const mortgageList = useSelector((state) => state.mortgageList);
  const stateList = useSelector((state) => state.stateList);
  const lawyersList = useSelector((state) => state.lawyersList);
  const lawyersCategoryList = useSelector((state) => state.lawyersCategoryList);
  const lawyersListByCatId = useSelector((state) => state.lawyersListByCatId);

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [selectFile, setSelectFile] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [addLoanData, setAddLoanData] = useState({});
  const [addPaidLogData, setAddPaidLogData] = useState({});
  const [mortArr, setMortArr] = useState([]);

  const [selected, setSelected] = useState([]);

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [messagType, setMessagType] = useState('')

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivorLawyersList]);


  const api = "https://kamo-api.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  const changeLogFunc = () => {
    let type = "lawyer"
    dispatch(getChangeLog(type, deletedById))
    props.history.push("/change-log")
  }



  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorLawyersList(props.location.state));
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getStateList());
      dispatch(getLawyersList());
      dispatch(getLawyersCategoryList())
    }
  }, [props]);

  useEffect(() => {
    const options = [];
    let obj = { label: "", value: "" };
    mortgageList &&
      mortgageList.length > 0 &&
      mortgageList.map((mort) => {
        return (
          (obj = { label: mort.name, value: mort._id }),
          options.push(obj),
          console.log(options, obj, "options, obj"),
          setMortArr(options)
        );
      });
  }, [mortgageList]);


  console.log(mortArr, "mortarr");

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


  ////// go to add loan ///

  const gotoAddLoan = () => {
    setModalNewloanLogShow(true);
    setAddLoanData({})
    setSelectedData({});

  };

  ///// go to edit loan ///
  const gotoEditLoan = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one loan to update");
    } else {
      setModalNewloanLogShow(true);
      setAddLoanData(selectedData);
    }
  };

  ///// add paid log ///
  const gotoAddPaidLog = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one loan to add paid log");
    } else {
      setModalPaidlogShow(true);
      setAddLoanData(selectedData);
    }
  };

  console.log(addLoanData, "addLoanDataaddLoanDataaddLoanData")


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
    axios
      .patch(api + "/lawyer/delete/" + selectedData._id, body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success")
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getSurvivorLawyersList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error")
      });
  };

  /////////////////////file upload function/////////////////////////
  const onDocumentChange = (e) => {
    console.log(e, e.target.files[0]);
    let data = e.target.files[0];
    setSelectFile(e.target.files[0]);
    storeFile(data);
  };

  const storeFile = (file) => {
    console.log(file);
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
          console.log(data.data.filePath, "file path");
          setAddLoanData({
            ...addLoanData,
            reference_document: {
              name: file && file.name,
              file: "https://kamo-api.herokuapp.com/" + data.data.filePath,
            },
          });
          // setPictureData(data.data.filePath)
          // console.log(addLoanData, pictureData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    let arr = [];
    selected &&
      selected.length > 0 &&
      selected.map((data) => {
        return (
          arr.push(data.value),
          console.log(arr, "arr"),
          setAddLoanData({
            ...addLoanData,
            mortgage: arr,
          })
        );
      });
  }, [selected]);

  useEffect(() => {
    if (addLoanData && addLoanData.type) {
      dispatch(getLawyersListByCatId(addLoanData.type));
    }
  }, [addLoanData])


  const handleSubmit = (event) => {
    console.log(event, "habdleSubmit")
    // const {form}= event.target
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (addLoanData && addLoanData._id) {
        setValidated(false);
        addLoanFunc(event);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    } else {
      addLoanFunc(event);
    }
    setValidated(true);

  }
  //////////// add loan api call function /////////////
  const addLoanFunc = (e) => {
    e.preventDefault();
    let addData = {
      survivor: props.location && props.location.state,
      ...addLoanData,
    };
    var updateData = {
      ...addLoanData,
      survivor: props.location && props.location.state,
      user_id: deletedById && deletedById,
    };

    if (addLoanData && addLoanData._id) {
      axios
        .patch(
          api + "/survivor-lawyer/update/" + addLoanData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          setValidated(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivorLawyersList(props.location.state));
            setModalNewloanLogShow(false);
            setModalPaidlogShow(false);
            setActiveClass(false);
            setAddLoanData({});
            setAddPaidLogData({});
          } else {
            handleClick();
            setUpdateMessage(response && response.data.message);
          }
        })
        .catch((error) => {
          console.log(error, "error");
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error")
        });
    } else {
      axios
        .post(api + "/survivor-lawyer/create", addData, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          setValidated(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivorLawyersList(props.location.state));
            setModalNewloanLogShow(false);
            setAddLoanData({});
          } else {
            handleClick();
            setUpdateMessage(response && response.data.message);
          }
        })
        .catch((error) => {
          console.log(error, "error");
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error")
        });
    }
  };

  //export csv function///

  console.log(survivorLawyersList, 'firrrrrrrrrrrrrr')
  const formatDate = (value) => {
    return moment(value).format("DD-MMM-YYYY");
  };

  let exportData = []
  survivorLawyersList.map((x, index) => {
    exportData.push({ from_date: formatDate(x.from_date), to_date: formatDate(x.to_date), isleading: x.isleading, name: x.name.name, source: x.source, survivor: survivorDetails.survivor_name, type: x.type.name, createdAt: formatDate(x.createdAt) })
  })
  console.log(exportData, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
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
    let headers = ['FromDate,ToDate,IsLeading,Name,Source,Survivor,Type,createdAt']

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const { from_date, to_date, isleading, name, source, survivor, type, createdAt } = user
      acc.push([from_date, to_date, isleading, name, source, survivor, type, createdAt].join(','))
      return acc
    }, [])

    downloadFile({
      data: [...headers, ...usersCsv].join('\n'),
      fileName: 'lawyersList.csv',
      fileType: 'text/csv',
    })
  }


  const onChangeDateHandler = (e) => {
    setAddLoanData({
      ...addLoanData,
      [e.target.name]: e.target.value,
    })
  }


  /////////download pdf////////////////

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
    doc.text("SURVIVOR LAWYER LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      'From Date','To Date','Is Leading','Name','Source','Survivor','Type','created At'
    ];
    const name = "survivor-lawyer-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
      item.from_date, item.to_date, item.isleading, item.name, item.source, item.survivor, item.type, item.createdAt
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
              <h2 className="page_title">Lawyers</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Lawyers</MDBBreadcrumbItem>
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
                  <Dropdown.Item onClick={exportToCsv}>Export to CSV</Dropdown.Item>
                  <Dropdown.Item onClick={downloadPdf}>Download PDF</Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLogFunc()} >Change Log</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add"
              >
                <span onClick={() => gotoAddLoan()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => gotoEditLoan()}>
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
              <LoanDataTable
                survivorLawyersList={
                  survivorLawyersList &&
                  survivorLawyersList.length > 0 &&
                  survivorLawyersList
                }
                onSelectRow={onSelectRow}
                isLoading={isLoading}
              />
              
            </div>
            </div>
            </div>
          </main>

      <Modal
        className="addFormModal"
        show={modalNewloanLogShow}
        onHide={setModalNewloanLogShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           {selectedData && selectedData._id ? "Update Lawyers": "Add Lawyers"}
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
                    name="source"
                    required
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData && addLoanData.source && addLoanData.source
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>

                    <option value={"sa"}>{"SA"}</option>
                    <option value={"da"}>{"DA"}</option>


                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Source
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Type <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="type"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData && addLoanData.type && addLoanData.type._id
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {lawyersCategoryList && lawyersCategoryList.length > 0 && lawyersCategoryList.map((item) => {
                      return (

                        <option value={item && item._id}>{item && item.name}</option>
                      )
                    })}

                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Type
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Name
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="name"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData && addLoanData.name && addLoanData.name._id
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    {lawyersListByCatId && lawyersListByCatId.length > 0 && lawyersListByCatId.map((item) => {
                      return (
                        <option value={item && item._id}>{item && item.name}</option>
                      )
                    })}

                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Name
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Is Leading <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="isleading"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData && addLoanData.isleading && addLoanData.isleading
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>

                    <option value={true}>{"Yes"}</option>
                    <option value={false}>{"No"}</option>

                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select  Is Leading
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    From date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker
                    required
                    message={'Please enter  To date'}
                    name="from_date"
                    datePickerChange={onChangeDateHandler}
                    data={addLoanData && addLoanData.from_date}
                  />
                  {/* <Form.Control
                  required
                    value={
                      addLoanData && addLoanData.from_date && moment(addLoanData.from_date).format("YYYY-MM-DD")
                    }
                    name="from_date"
                    type="date"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                   <Form.Control.Feedback type="invalid">
              Please enter  From date 
            </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    To date <span className="requiredStar">*</span>
                  </Form.Label>
                  <DatePicker
                    required
                    message={'Please enter  To date '}
                    name="to_date"
                    datePickerChange={onChangeDateHandler}
                    data={addLoanData && addLoanData.to_date}
                  />
                  {/* <Form.Control
                  required
                    defaultValue={
                      addLoanData && addLoanData.to_date && moment(addLoanData.to_date).format("YYYY-MM-DD")
                    }
                    name="to_date"
                    type="date"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
              Please enter  To date 
            </Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Leading at <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="leading_at"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={
                      addLoanData &&
                      addLoanData.leading_at &&
                      addLoanData.leading_at
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value={"vc"}>VC</option>
                    <option value={"pc"}>PC</option>
                    <option value={"both"}>Both</option>

                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select  Leading at
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    updated notes <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addLoanData && addLoanData.updated_notes && addLoanData.updated_notes
                    }
                    name="updated_notes"
                    type="text"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter updated notes
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setModalNewloanLogShow(false)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    // disabled={
                    //   addLoanData && 
                    //   !addLoanData.source
                    //     ? true
                    //     : !addLoanData.name
                    //     ? true
                    //     : !addLoanData.type
                    //     ? true
                    //     : !addLoanData.isleading
                    //     ? true
                    //     : !addLoanData.from_date
                    //     ? true
                    //     : !addLoanData.to_date
                    //     ? true
                    //     : !addLoanData.leading_at
                    //     ? true
                    //     :!addLoanData.updated_notes ? true : false
                    // }
                    // onClick={addLoanFunc}
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

export default SurvivorsLawyers;
