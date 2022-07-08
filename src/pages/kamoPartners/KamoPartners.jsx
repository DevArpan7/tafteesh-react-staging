import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { getPartnerList,deletePartner } from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import moment from "moment";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import alertImg from "../../assets/img/alertPopupimg.png";
import AlertComponent from "../../components/AlertComponent";
import PartnersDataTable from "./PartnersDataTable";

const KamoPartners = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [isLoading,setIsLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const partnerList = useSelector((state) => state.partnerList);
  const [erorMessage, setErorMessage] = useState("");

  const [addPartnerData, setAddPartnerData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/partner";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});

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

  useEffect(() => {
    dispatch(getPartnerList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [partnerList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddPartnerData({});
    // setSelectedData({});
  };

//////// delete function call //////////
  const onDeleteChangeFunc=()=>{
    if (selectedData && !selectedData._id) {
      alert("Please select one partner");
    } else {
    setShowAlert(true)
    }
  }

  const onDeleteFunction=()=>{
    dispatch(deletePartner(selectedData._id))
    setShowAlert(false)
  }


  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one partner");
    } else {
      setModalAddShow(true);
      setAddPartnerData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddPartnerData({});
    setSelectedData({});
  };

  useEffect(() => {
    console.log(addPartnerData, "org data");
  }, [addPartnerData]);

  ///// add Organisation api cll function /////

  const addPartnerFunc = (e) => {
    e.preventDefault();
    var body = addPartnerData;
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    let isValid = true;
    if (!pattern.test(body.email)) {
      isValid = false;

      setErorMessage("Please enter valid email address.");
    } else {
      if (addPartnerData && addPartnerData._id) {
        axios
          .patch(api + "/update/" + addPartnerData._id, body, axiosConfig)
          .then((response) => {
            console.log(response);
            handleClick();

            setUpdateMessage(response && response.data.message);

            if (response.data && response.data.error === false) {
              const { data } = response;
              dispatch(getPartnerList());
              setModalAddShow(false);
              // setSelectedData({});
              setActiveClass(false);
              setErorMessage("");
              setAddPartnerData({});
            }
          })
          .catch((error) => {
            console.log(error, "shg add error");
          });
      } else {
        axios
          .post(api + "/create", body, axiosConfig)
          .then((response) => {
            console.log(response);
            handleClick();
            setUpdateMessage(response && response.data.message);
            if (response.data && response.data.error === false) {
              const { data } = response;
              dispatch(getPartnerList());
              setModalAddShow(false);
              setAddPartnerData({});
              setErorMessage("");
            }
          })
          .catch((error) => {
            console.log(error, "shg add error");
          });
      }
    }
  };

  //////////////// for csv function ////

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
    let headers = ["Id,PartnerName,PhoneNo,Email"];

    // Convert users data to a csv
    let usersCsv = partnerList.data.reduce((acc, user) => {
      const { _id,name, phone_no, email } = user;
      acc.push([_id,name, phone_no, email].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "partners.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };
  const downloadSampleCsv = (e) => {
    e.preventDefault();
    let headers = ["PartnerName,PhoneNo,Email"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name, phone_no, email } = user;
      acc.push([name, phone_no, email].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "partners.csv",
      fileType: "text/csv",
    });
  };
  const handleOnChange = (e) => {
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      setFile(inputFile);
    }
  };

  const handleOnSubmit = (e) => {
    console.log(e, file);
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        console.log(event, "event");
        const csvOutput = event.target.result;
        console.log(csvOutput, "csvOutput");
        const csv = Papa.parse(csvOutput, { header: true });
        const parsedData = csv?.data;
        console.log(parsedData, "parsedData");
        setImportCSVdata(parsedData);
      };

      fileReader.readAsText(file);
    } else {
      alert("Please upload a .csv File");
    }
  };
  useEffect(() => {
    let obj = {};
    console.log(importCSVdata, "importCSVdata");
    importCSVdata &&
      importCSVdata.length > 0 &&
      importCSVdata.map((item) => {
        return (
          (obj = {
            name: item && item.PartnerName,
            email: item && item.Email,
            phone_no: item && item.PhoneNo,
          }),
          console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getPartnerList());
                setImportCSVdata([]);
                setFile();
                setImportCsvOpenModel(false);
              }
            })
            .catch((error) => {
              console.log(error, "shg add error");
            })
        );
      });
  }, [importCSVdata]);

  return (
    <>
      <KamoTopbar />
      <main className="main_body">
        <NotificationPage
          handleClose={handleClose}
          open={open}
          message={updateMessage}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Partners List</h2>
            </div>
          </div>

          <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
            <div className="vieweditdelete">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="border"
                  className="shadow-0"
                  id="download-dropdown"
                >
                  Download List
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportToCsv}>
                    Export CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onImportCsv()}>
                    Import CSV
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "view_btn add_btn" }}
                title="Add"
              >
                <span onClick={() => ongotoAdd()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag={"a"}
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => ongotoEdit()}>
                  <i className="fal fa-pencil"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "delete_btn" }}
                title="Delete"
              >
                <span onClick={()=> onDeleteChangeFunc()}>
                  <i className="fal fa-trash-alt"></i>
                </span>
              </MDBTooltip>
            </div>
            <PartnersDataTable 
              partnerList={partnerList &&
              partnerList.data &&
              partnerList.data.length > 0 &&
              partnerList.data}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
            {/* <div className="table-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="33.33%">Name </th>
                    <th width="33.33%">Phone</th>
                    <th width="33.33%">Email</th>
                    <th width="33.33%">createdAt</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerList &&
                  partnerList.data &&
                  partnerList.data.length > 0 ? (
                    partnerList.data.map((item) => {
                      return (
                        <tr
                          className={[
                            item._id === selectedData._id &&
                              activeClass === true &&
                              "current",
                          ]}
                          onClick={() => onSelectRow(item)}
                        >
                          <td>{item && item.name && item.name}</td>
                          <td>{item && item.phone_no && item.phone_no}</td>
                          <td>{item && item.email && item.email}</td>
                          <td>
                            {item &&
                              item.createdAt &&
                              moment(item.createdAt).format("DD/MM/YYYY")}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={4}>
                        <b>NO Data Found !!</b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
        {importCsvOpenModel === true && (
          <Modal
            show={importCsvOpenModel}
            onHide={onImportCsv}
            size="md"
            aria-labelledby="reason-modal"
            className="addFormModal"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Select File
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="site_form_wraper">
                <CsvImportPage
                  downloadSampleCsv={downloadSampleCsv}
                  handleOnChange={handleOnChange}
                  handleOnSubmit={handleOnSubmit}
                />
              </div>
            </Modal.Body>
          </Modal>
        )}

        <Modal
          className="addFormModal"
          show={modalAddShow}
          onHide={setModalAddShow}
          size="lg"
          aria-labelledby="reason-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            {addPartnerData && addPartnerData._id ? "Update Partner" : "Add Partner"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Name </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      defaultValue={
                        addPartnerData &&
                        addPartnerData.name &&
                        addPartnerData.name
                      }
                      name="name"
                      onChange={(e) =>
                        setAddPartnerData({
                          ...addPartnerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Phone </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={10}
                      placeholder=""
                      defaultValue={
                        addPartnerData &&
                        addPartnerData.phone_no &&
                        addPartnerData.phone_no
                      }
                      name="phone_no"
                      onChange={(e) =>
                        setAddPartnerData({
                          ...addPartnerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="12" className="mb-3">
                    <Form.Label>Email </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder=""
                      defaultValue={
                        addPartnerData &&
                        addPartnerData.email &&
                        addPartnerData.email
                      }
                      name="email"
                      onChange={(e) =>
                        setAddPartnerData({
                          ...addPartnerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <div
                      className="text-danger"
                      style={{ fontSize: 12, marginTop: 5 }}
                    >
                      {erorMessage && erorMessage}{" "}
                    </div>
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
                      Close
                    </MDBBtn>
                  </Form.Group>
                  <Form.Group as={Col} md="auto">
                    <Button
                      type="submit"
                      disabled={
                        addPartnerData && !addPartnerData.name
                          ? true
                          : !addPartnerData.phone_no
                          ? true
                          : !addPartnerData.email
                          ? true
                          : false
                      }
                      onClick={addPartnerFunc}
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
      </main>
      {
        showAlert === true && 
        <AlertComponent showAlert={showAlert}handleCloseAlert={handleCloseAlert}onDeleteFunction={onDeleteFunction}  />
      }
     
    </>
  );
};

export default KamoPartners;
