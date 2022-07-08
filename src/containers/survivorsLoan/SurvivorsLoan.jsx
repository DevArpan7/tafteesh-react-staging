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
import "./survivorloan.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvaivalLoanList,
  getSurvivorDetails,
  getMortgageList,
  getChangeLog
} from "../../redux/action";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import LoanDataTable from "./LoanDataTable";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";

const SurvivorsLoan = (props) => {
  const [modalNewloanLogShow, setModalNewloanLogShow] = useState(false);
  const [modalPaidlogShow, setModalPaidlogShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivalLoanList = useSelector((state) => state.survivalLoanList);
  const [modalInactiveShow, setmodalInactiveShow] = useState(false);

  const mortgageList = useSelector((state) => state.mortgageList);
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [selectFile, setSelectFile] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [addLoanData, setAddLoanData] = useState({});
  const [addPaidLogData, setAddPaidLogData] = useState({});
  const [mortArr, setMortArr] = useState([]);
  const [reason, setReason] = useState({})
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");

  const [validated, setValidated] = useState(false);
  const [validatedPaidlog, setValidatedPaidlog] = useState(false)
  const [messagType, setMessagType] = useState('')

  const [selected, setSelected] = useState([]);

  const api = "https://kamo-api.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [survivalLoanList]);

  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvaivalLoanList(props.location.state));
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getMortgageList());
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


  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Loan");
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
      .patch(api + "/survival-loan/delete/" + selectedData._id, body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success")
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({})
          dispatch(getSurvaivalLoanList(props.location && props.location.state));
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


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData({})
    setAddLoanData({})
  };

  const onSelectRow = (item) => {
    setSelectedData(item);
    setActiveClass(true);
  };

  ////// go to add loan ///

  const gotoAddLoan = () => {
    setModalNewloanLogShow(true);
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

  console.log(addLoanData, "addLoanData");

  useEffect(() => {
    let arr = [];
    selected &&
      selected.length > 0 &&
      selected.map((data) => {
        return (arr.push(data.value), console.log(arr, "arr"),
          setAddLoanData({
            ...addLoanData,
            "mortgage": arr
          })
        )
      });
  }, [selected]);

  const handleSubmitPaidLog = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      addPaidLog(event);
    }
    setValidatedPaidlog(true);
  }


  const addPaidLog = (e) => {
    e.preventDefault();
    axios
      .patch(api + "/survival-loan/add-paid-log/" + selectedData._id, addPaidLogData, axiosConfig)
      .then((response) => {
        console.log(response);
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success")
        if (response.data && response.data.error === false) {
          const { data } = response;
          dispatch(getSurvaivalLoanList(props.location.state));
          setActiveClass(false);
          setSelectedData({});
          setAddLoanData({});
          setAddPaidLogData({});
          setModalPaidlogShow(false);

        } else {
          handleClick();
          setUpdateMessage(response && response.data.message);
        }
        setValidatedPaidlog(false);

      })
      .catch((error) => {
        console.log(error, "error");
        handleClick();
        setUpdateMessage(error && error.message);
        setMessagType("error")
      });
  }


  const changeLogFunc = () => {
    let type = "loan"
    dispatch(getChangeLog(type, deletedById))
    props.history.push("/change-log")
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (addLoanData && addLoanData._id) {
        setValidated(false)
        addLoanFunc(event);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    } else {
      addLoanFunc(event);
    }
    setValidated(true);
  };

  //////////// add loan api call function /////////////
  const addLoanFunc = (e) => {
    e.preventDefault();
    let updateData = {
      survivor: props.location && props.location.state,
      ...addLoanData,
      // paid_log: [addPaidLogData],
      user_id: deletedById && deletedById
    };
    let body = {
      survivor: props.location && props.location.state,
      ...addLoanData,
    };

    // var body =
    // addLoanData && addLoanData._id ? updateData : addData;

    if (addLoanData && addLoanData._id) {
      axios
        .patch(
          api + "/survival-loan/update/" + addLoanData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          setValidated(false);
          setValidatedPaidlog(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvaivalLoanList(props.location.state));
            setModalNewloanLogShow(false);
            setActiveClass(false);
            // setSelectedData({});
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
        .post(api + "/survival-loan/create", body, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setMessagType("success")
          setValidated(false);
          setValidatedPaidlog(false);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvaivalLoanList(props.location.state));
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

  const receivedOnDateHandel = (e) => {
    setAddLoanData({
      ...addLoanData,
      [e.target.name]: e.target.value,
    })
  }

  const asOfDateChangeHandel = (e) => {
    setAddPaidLogData({
      ...addPaidLogData,
      [e.target.name]: e.target.value,
    })
  }

  const numberFormat = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);
  //export csv function///

  console.log(survivalLoanList, 'firrrrrrrrrrrrrr')
  const formatDate = (value) => {
    return moment(value).format("DD-MMM-YYYY");
  };

  let exportData = []
  survivalLoanList?.data?.map((x, index) => {
    exportData.push({ _id: x._id,amount:x.amount,isDeleted:x.is_deleted,purpose:x.purpose,rate:x.rate,rate_of_interest_mode:x.rate_of_interest_mode,received_on:formatDate(x.received_on),repayment_per_month:x.repayment_per_month,survivor:x.survivor,tenure:x.tenure,total_paid_amount:x.total_paid_amount,where:x.where,mortgage:x.mortgage,paidLogTotalPaid:x.paid_log?.map((y)=>{return y.total_paid}),paidLogDate:x.paid_log?.map((y)=>{return formatDate(y.as_of_date)}),paidLogId:x.paid_log?.map((y)=>{return y._id}),createdAt: formatDate(x.createdAt) })
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
    let headers = ['Id,Amount,IsDeleted,MOrtgage,Date,TotalPaid,LogId,Purpose,Rate,Interest Mode,Received On,Repayment Per Month,Survivor Id,Tenure,Total Paid,Where,Created At']

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const { _id,amount,isDeleted,mortgage,paidLogDate,paidLogTotalPaid,paidLogId,purpose,rate,rate_of_interest_mode,received_on,repayment_per_month,survivor,tenure,total_paid,where,createdAt} = user
      acc.push([_id,amount,isDeleted,mortgage,paidLogDate,paidLogTotalPaid,paidLogId,purpose,rate,rate_of_interest_mode,received_on,repayment_per_month,survivor,tenure,total_paid,where,createdAt].join(','))
      return acc
    }, [])

    downloadFile({
      data: [...headers, ...usersCsv].join('\n'),
      fileName: 'loanList.csv',
      fileType: 'text/csv',
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
      'Id','Amount','IsDeleted','MOrtgage','Date','TotalPaid','LogId','Purpose','Rate','Interest Mode','Received On','Repayment Per Month','Survivor Id','Tenure','Total Paid,Where','Created At'
    ];
    const name = "survivor-loan-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [
       item. _id,item.amount,item.isDeleted,item.mortgage,item.paidLogDate,item.paidLogTotalPaid,item.paidLogId,item.purpose,item.rate,item.rate_of_interest_mode,item.received_on,item.repayment_per_month,item.survivor,item.tenure,item.total_paid,item.where,item.createdAt      ];
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
              <h2 className="page_title">Loan</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Loan</MDBBreadcrumbItem>
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
                  <Dropdown.Item onClick={exportToCsv}>Export CSV</Dropdown.Item>
                  <Dropdown.Item onClick={downloadPdf}>Download PDF</Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLogFunc()}>Change Log</Dropdown.Item>
                  <Dropdown.Item onClick={() => gotoAddPaidLog()}>Paid Log</Dropdown.Item>
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
            {survivalLoanList && survivalLoanList.totalLoan && (
              <h4 className="mb-4 small_heading">
                Total Outstanding Loan Amount :{" "}
                {survivalLoanList && numberFormat(survivalLoanList.totalLoan)}
              </h4>
            )}
            <div className="table-responsive big-mobile-responsive">
              <LoanDataTable
                survivalLoanList={
                  survivalLoanList &&
                  survivalLoanList.data &&
                  survivalLoanList.data.length > 0 &&
                  survivalLoanList.data
                } isLoading={isLoading}
                onSelectRow={onSelectRow}
                selectedData={selectedData}
              />
             
            </div>
          </div>
          {selectedData &&
            selectedData.paid_log &&
            selectedData.paid_log.length > 0 && (
              <div
                id="paidlogBox"
                className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative"
              >
                <h4 className="mb-4 small_heading">Paid Log </h4>
                {/* <div className="vieweditdelete">
                  <MDBTooltip
                    tag="button"
                    wrapperProps={{ className: "add_btn view_btn" }}
                    title="Add"
                  >
                    <span onClick={() => gotoAddPaidLog()}>
                      <i className="fal fa-plus-circle"></i>
                    </span>
                  </MDBTooltip>
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ href: "/#", className: "delete_btn" }}
                    title="Delete"
                  >
                    <i className="fal fa-trash-alt"></i>
                  </MDBTooltip>
                </div> */}

                <div className="table-responsive small-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th>Paid Summary#</th>
                        <th>Total Paid</th>
                        <th>As of Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedData &&
                        selectedData.paid_log &&
                        selectedData.paid_log.length > 0 &&
                        selectedData.paid_log.map((item, idx) => {
                          let index = idx + 1
                          return (
                            <tr>
                              <td>{index && index}</td>
                              <td>{item && item.total_paid}</td>
                              <td>
                                {item &&
                                  moment(item.as_of_date).format("DD-MMM-YYYY")}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
          <Modal.Title id="contained-modal-title-vcenter"> {selectedData && selectedData._id ? "Update Loan" : "Add Loan"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Where <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    required
                    name="where"
                    value={
                      addLoanData && addLoanData.where && addLoanData.where
                    }
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="shg">SHG</option>
                    <option value="bank">Bank</option>
                    <option value="family">Family</option>
                    <option value="privat_money_lander">Private Money Lander </option>
                    <option value="family_member">Family Member</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Where
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Amount <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                      <InputGroup.Text>
                      ₹
                      </InputGroup.Text>
                      <Form.Control
                        required
                        defaultValue={
                          addLoanData && addLoanData.amount && addLoanData.amount
                        }
                        name="amount"
                        type="number"
                        onChange={(e) =>
                          setAddLoanData({
                            ...addLoanData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                  </InputGroup>                  
                  <Form.Control.Feedback type="invalid">
                    Please enter Amount
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Rate <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addLoanData && addLoanData.rate && addLoanData.rate
                    }
                    name="rate"
                    type="number"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Rate
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Purpose <span className="requiredStar">*</span>
                  </Form.Label>

                  <Form.Control
                    required
                    name="purpose"
                    defaultValue={
                      addLoanData && addLoanData.purpose && addLoanData.purpose
                    }
                    type="text"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Purpose
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Rate of interest mode</Form.Label>
                  <Form.Select
                    name="rate_of_interest_mode"
                    value={
                      addLoanData &&
                      addLoanData.rate_of_interest_mode &&
                      addLoanData.rate_of_interest_mode
                    }
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value={""} hidden={true}>Please select</option>
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly"> Weekly</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select Rate of interest mode
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Received On</Form.Label>
                  <DatePicker
                    name="received_on"
                    data={addLoanData &&
                      addLoanData.received_on}
                    datePickerChange={receivedOnDateHandel}
                  />
                  {/* <Form.Control
                    type="date"
                    name="received_on"
                    value={
                      addLoanData &&
                      addLoanData.received_on &&
                      moment(addLoanData.received_on).format("YYYY-MM-DD")
                    }
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Date of Birth"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Tenure <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    defaultValue={
                      addLoanData && addLoanData.tenure && addLoanData.tenure
                    }
                    name="tenure"
                    type="number"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Tenure
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Mortgage</Form.Label>
                  <MultiSelect
                    options={mortArr}
                    value={selected}
                    hasSelectAll={false}
                    disableSearch={true}
                    onChange={setSelected}
                    labelledBy={"Select"}
                    className={"survivorMultiselect-box multiselectbox_span"}
                    overrideStrings={{
                      selectSomeItems: "Select columns to view",
                      allItemsAreSelected: "All Items are Selected",
                      selectAll: "Select All",
                      search: "Search",
                    }}
                  />

                  {/* {mortArr &&
                    mortArr.length > 0 &&
                    mortArr.map((item) => {
                      return (
                        <options value={item && item.value}>
                          {item && item.label}
                        </options>
                      );
                    })} */}
                  {/* </MultiSelect> */}

                  {/* <div>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        Select
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={selected}
                        onChange={handleChange}
                        input={<OutlinedInput label="Select" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {mortgageList &&
                          mortgageList.length > 0 &&
                          mortgageList.map((item) => (
                            <MenuItem label={item.name} value={item.name}>
                              <Checkbox
                                checked={selected.indexOf(item._id) > -1}
                              />
                              <ListItemText primary={item.name} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Repayment (Per Month){" "}
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                      <InputGroup.Text>
                      ₹
                      </InputGroup.Text>
                      <Form.Control
                    required
                    defaultValue={
                      addLoanData &&
                      addLoanData.repayment_per_month &&
                      addLoanData.repayment_per_month
                    }
                    type="number"
                    name="repayment_per_month"
                    onChange={(e) =>
                      setAddLoanData({
                        ...addLoanData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  </InputGroup>
                 
                  <Form.Control.Feedback type="invalid">
                    Please enter Repayment (Per Month){" "}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Total Paid Amount <span className="requiredStar">*</span>
                  </Form.Label>
                  <InputGroup>
                      <InputGroup.Text>
                      ₹
                      </InputGroup.Text>
                      <Form.Control
                        required
                        defaultValue={
                          addLoanData &&
                          addLoanData.total_paid_amount &&
                          addLoanData.total_paid_amount
                        }
                        name="total_paid_amount"
                        type="number"
                        onChange={(e) =>
                          setAddLoanData({
                            ...addLoanData,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                  </InputGroup>
                  
                  <Form.Control.Feedback type="invalid">
                    Please enter Total Paid Amount
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Reference Document</Form.Label>
                  <Form.Control
                    type="file"
                    // required
                    name="reference_document"
                    size="lg"
                    onChange={(e) => onDocumentChange(e)}
                  />
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
                    //   addLoanData && !addLoanData.where
                    //     ? true
                    //     : !addLoanData.amount
                    //     ? true
                    //     : !addLoanData.rate
                    //     ? true
                    //     : !addLoanData.purpose
                    //     ? true
                    //     : !addLoanData.tenure
                    //     ? true
                    //     : !addLoanData.repayment_per_month
                    //     ? true
                    //     : !addLoanData.total_paid_amount
                    //     ? true
                    //     : false
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

      <Modal
        className="addFormModal"
        show={modalPaidlogShow}
        onHide={setModalPaidlogShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add paid log
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validatedPaidlog} onSubmit={handleSubmitPaidLog}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Total Paid</Form.Label>
                  <Form.Control
                    required
                    onChange={(e) =>
                      setAddPaidLogData({
                        ...addPaidLogData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="total_paid"
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter Total Paid
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>As of Date</Form.Label>
                  <DatePicker
                    required
                    name="as_of_date"
                    data={addPaidLogData &&
                      addPaidLogData.as_of_date}
                    datePickerChange={asOfDateChangeHandel}
                    message={"Please enter As of Date"}
                  />
                  {/* <Form.Control
                    required
                    type="date"
                    name="as_of_date"
                    onChange={(e) =>
                      setAddPaidLogData({
                        ...addPaidLogData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder="Date of Birth"
                  />
                    <Form.Control.Feedback type="invalid">
                    Please enter As of Date
                  </Form.Control.Feedback> */}
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setModalPaidlogShow(false)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    // onClick={() => setModalPaidlogShow(false)}
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

export default SurvivorsLoan;
