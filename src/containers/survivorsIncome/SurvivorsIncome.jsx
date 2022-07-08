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
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import { getSurvivorDetails, getSurvivalIncomeList, getChangeLog } from "../../redux/action";
import moment from "moment";
import IncomeDataTable from "./IncomeDataTable";
import AlertComponent from "../../components/AlertComponent";

const SurvivorsIncome = (props) => {
  const [modalIncomShow, setModalIncomShow] = useState(false);
  const [addIncomeData, setAddIncomeData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");

  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [validated, setValidated] = useState(false);


  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const incomeList = useSelector((state) => state.incomeList);

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [incomeList]);


  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorDetails(props.location.state));
      dispatch(getSurvivalIncomeList(props.location.state));
    }
  }, [props]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValidated(false)
    setOpen(false);
  };

  const onCancel = () => {
    setModalIncomShow(false);
    setValidated(false)
  };

  const gotoAdd = () => {
    setSelectedData({});
    setActiveClass(false);
    setModalIncomShow(true);
    setAddIncomeData({});
  };
  const gotoEdit = () => {
    setModalIncomShow(true);
    setAddIncomeData(selectedData);
  };
  const onSelectRow = (item) => {
    setSelectedData(item);
    setActiveClass(true);
  };

  const changeLogFunc = () => {
    let type = "income"
    dispatch(getChangeLog(type, deletedById))
    props.history.push("/change-log")
  }

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Income");
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
      .patch(api + "/survival-income/delete/" + selectedData._id, body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({})
          dispatch(getSurvivalIncomeList(props.location && props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      addIncomeFunc(event);
    }
    setValidated(true);
  };


  
  const numberFormat = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);


  /////// add income api call function //////
  const addIncomeFunc = (e) => {
    e.preventDefault();
    // var body = {
    //   survivor: props.location && props.location.state,
    //   ...addIncomeData,
    // };
    var addData = {
      ...addIncomeData,
      survivor: props.location && props.location.state,
    };
    var updateData = {
      ...addIncomeData,
      survivor: props.location && props.location.state,
      user_id: deletedById && deletedById,
    };
    if (addIncomeData && addIncomeData._id) {
      axios
        .patch(
          api + "/survival-income/update/" + addIncomeData._id,
          updateData,
          axiosConfig
        )
        .then((response) => {
          console.log(response);
          handleClick();
          setValidated(false);
          setUpdateMessage(response && response.data.message);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivalIncomeList(props.location.state));
            setAddIncomeData({});
            setModalIncomShow(false);
            setActiveClass(false);
            setSelectedData({});
          } else {
            handleClick();
            setUpdateMessage(response && response.data.message);
          }
        })
        .catch((error) => {
          console.log(error, "error");
          handleClick();
          setUpdateMessage(error && error.message);
        });
    } else {
      axios
        .post(api + "/survival-income/create", addData, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setValidated(false);
          setUpdateMessage(response && response.data.message);
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getSurvivalIncomeList(props.location.state));
            setAddIncomeData({});
            setModalIncomShow(false);
            setActiveClass(false);
          }
        })
        .catch((error) => {
          console.log(error, "error");
          handleClick();
          setUpdateMessage(error && error.message);
        });
    }
  };
  console.log(incomeList, 'incomeeeeeeeeeeeeeeeeeee')

  //export csv function///

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

  const exportToCsv = e => {
    e.preventDefault()

    // Headers for each column
    let headers = [' Id,Amount,Mode Of Earning,Source,Survivor,Type,createdAt']

    // Convert users data to a csv
    let usersCsv = incomeList.data.reduce((acc, user) => {
      const { _id, amount, mode_of_earning,  source, survivor, type, createdAt } = user
      acc.push([_id, amount, mode_of_earning, source, survivor, type, formatDate(createdAt)].join(','))
      return acc
    }, [])

    downloadFile({
      data: [...headers, ...usersCsv].join('\n'),
      fileName: 'incomeList.csv',
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
    doc.text("SURVIVOR LAWYER LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      'Id', 'Amount', 'Mode Of Earning', 'Source', 'Survivor', 'Type', 'Created At'
    ];
    const name = "survivor-lawyer-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    incomeList.data?.forEach((item) => {
      const temp = [
        item._id, item.amount, item.mode_of_earning,  item.source, item.survivor, item.type, formatDate(item.createdAt)
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
              <h2 className="page_title">Income</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Income</MDBBreadcrumbItem>
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
                  <Dropdown.Item onClick={exportToCsv}>Export CSV</Dropdown.Item>
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
            {incomeList && incomeList.totalIncome && (
              <h4 className="mb-4 small_heading">
                Total Family Income (Monthly) : {" "}
                {incomeList && numberFormat (incomeList.totalIncome)}
              </h4>
            )}
            <div className="table-responsive medium-mobile-responsive">
              <IncomeDataTable
                incomeList={incomeList && incomeList.data && incomeList.data.length > 0 && incomeList.data}
                onSelectRow={onSelectRow} isLoading={isLoading}
              />

              {/* <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="5%">Sr#</th>
                                        <th>Mode of earning</th>
                                        <th>Monthly Income</th>
                                        <th>Updated Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomeList && incomeList.data && incomeList.data.length > 0 ? incomeList.data.map((item, index) => {
                                          let idx = index +1
                                        return (
                                            <tr
                                                style={{ cursor: "pointer" }}
                                                className={[item._id === selectedData._id && activeClass === true && 'current']}
                                                onClick={() => onSelectRow(item)}>
                                                <td>{idx}</td>
                                                <td>{item && item.mode_of_earning && item.mode_of_earning}</td>
                                                <td>{item && item.amount && item.amount}</td>
                                                <td>{item && item.updatedAt && moment(item.updatedAt).format("DD/MM/YYYY")}</td>
                                            </tr>
                                        )
                                    }) :

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
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalIncomShow}
        onHide={setModalIncomShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Income
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Mode of earning</Form.Label>
                  <Form.Select
                    name="mode_of_earning"
                    value={
                      addIncomeData &&
                      addIncomeData.mode_of_earning &&
                      addIncomeData.mode_of_earning
                    }
                    onChange={(e) =>
                      setAddIncomeData({
                        ...addIncomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Default select</option>
                    <option value="part time job">Part Time Job</option>
                    <option value="full time job">Full time job</option>
                    <option value="business">Business</option>
                    <option value="stipend">Stipend</option>
                  </Form.Select>
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
                          addIncomeData &&
                          addIncomeData.amount &&
                          addIncomeData.amount
                        }
                        onChange={(e) =>
                          setAddIncomeData({
                            ...addIncomeData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        name="amount"
                        type="text"
                      />
                  </InputGroup>
                  
                  <Form.Control.Feedback type="invalid">
                    Please enter Amount
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={
                      addIncomeData && addIncomeData.type && addIncomeData.type
                    }
                    onChange={(e) =>
                      setAddIncomeData({
                        ...addIncomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option hidden={true}>Default select</option>
                    <option value="job">Job</option>
                    <option value="business">Business</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Source</Form.Label>
                  <Form.Control
                    name="source"
                    value={
                      addIncomeData &&
                      addIncomeData.source &&
                      addIncomeData.source
                    }
                    onChange={(e) =>
                      setAddIncomeData({
                        ...addIncomeData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />

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
                    //   addIncomeData && !addIncomeData.amount ? true : false
                    // }
                    // onClick={addIncomeFunc}
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

export default SurvivorsIncome;
