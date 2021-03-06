import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import {
  getCitDimensionList,
  deleteCitDimension,
  getCITVersionList,
  getCitDimensionAllList,
} from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import moment from "moment";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import AlertComponent from "../../components/AlertComponent";
import CitDimensionDataTable from "./CitDimensionDataTable";

const CitDimension = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const citDimensionList = useSelector((state) => state.citDimensionList);
  const [addShgData, setAddShgData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/cit-dimension";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const citVersionList = useSelector((state) => state.citVersionList);
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [citName, setCitName] = useState("");
  const [citVersion, setCitVersion] = useState("");
  const [loader, setLoader] = useState(false);

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one partner");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    dispatch(deleteCitDimension(selectedData._id));
    setShowAlert(false);
  };

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
    dispatch(getCITVersionList());
    // dispatch(getCitDimensionList());
    dispatch(getCitDimensionAllList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [citDimensionList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddShgData({});
    // setSelectedData({})
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one CIT");
    } else {
      setModalAddShow(true);
      setAddShgData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddShgData({});
    setSelectedData({});
  };

  useEffect(() => {
    console.log(fieldData, "fieldData");
    if (addShgData && addShgData.name) {
      setCitName(false);
      setFieldData({ field: "name", message: "" });
    } else if (addShgData && addShgData.cit_version) {
      setCitVersion(false);
      setFieldData({ field: "cit_version", message: "" });
    } else {
    }
    setFieldData({ field: "", message: "" });
  }, [addShgData]);
  ///// add shg api cll function /////

  const addShgFunc = (e) => {
    e.preventDefault();

    if (addShgData && !addShgData.name) {
      setFieldData({
        field: "name",
        message: "Please enter Name",
      });
      setCitName(true);
    } else if (addShgData && !addShgData.cit_version) {
      setFieldData({
        field: "cit_version",
        message: "Please select CIT Version",
      });
      setCitVersion(true);
      setCitName(false);
    } else {
      setFieldData({ field: "", message: "" });
      setCitName(false);
      setCitVersion(false);

      var body = addShgData;

      if (addShgData && addShgData._id) {
        setLoader(true);
        axios
          .patch(api + "/update/" + addShgData._id, body, axiosConfig)
          .then((response) => {
            console.log(response);
            handleClick();

            setUpdateMessage(response && response.data.message);
            setLoader(false);

            if (response.data && response.data.error === false) {
              const { data } = response;
              // dispatch(getCITVersionList());
              dispatch(getCitDimensionAllList());
              setModalAddShow(false);
              // setAddShgData({});

              // setSelectedData({});
              setActiveClass(false);
            }
          })
          .catch((error) => {
            setLoader(false);

            console.log(error, "cit add error");
          });
      } else {
        setLoader(true);

        axios
          .post(api + "/create", body, axiosConfig)
          .then((response) => {
            console.log(response);
            handleClick();
            setUpdateMessage(response && response.data.message);
            setLoader(false);

            if (response.data && response.data.error === false) {
              const { data } = response;
              // dispatch(getCITVersionList());
              dispatch(getCitDimensionAllList());
              setModalAddShow(false);
              // setAddShgData({});
            }
          })
          .catch((error) => {
            setLoader(false);

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
    let headers = ["Id,CITDimension,CreatedAt"];

    // Convert users data to a csv
    let usersCsv = citDimensionList.reduce((acc, user) => {
      const { _id, name, createdAt } = user;
      acc.push([_id, name, createdAt].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "citDimension.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([{ name: "Mental Issue" }]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };

  const downloadSampleCsv = (e) => {
    let headers = ["CITDimension"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name } = user;
      acc.push([name].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "citDimension.csv",
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
          (obj = { name: item && item.CITDimension }),
          console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getCITVersionList());
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
              <h2 className="page_title">CIT Dimension List</h2>
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
                <span onClick={() => onDeleteChangeFunc()}>
                  <i className="fal fa-trash-alt"></i>
                </span>
              </MDBTooltip>
            </div>

            <CitDimensionDataTable
              citDimensionList={
                citDimensionList &&
                citDimensionList.length > 0 &&
                citDimensionList
              }
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
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
              {addShgData && addShgData._id
                ? "Update CIT Dimension"
                : "Add CIT Dimension"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Name </Form.Label>
                    <Form.Control
                      defaultValue={
                        addShgData && addShgData.name && addShgData.name
                      }
                      type="text"
                      placeholder=""
                      name="name"
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                     {fieldData.field == "name" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>CIT Version </Form.Label>
                    <Form.Select
                      name="cit_version"
                      value={
                        addShgData &&
                        addShgData.cit_version &&
                        addShgData.cit_version._id
                      }
                      onChange={(e) =>
                        setAddShgData({
                          ...addShgData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"}>Default select</option>
                      {citVersionList &&
                        citVersionList.length > 0 &&
                        citVersionList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "cit_version" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
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
                      disabled={loader == true ? true : false}
                      onClick={addShgFunc}
                      className="submit_btn shadow-0"
                    >
                      {loader && loader === true ? (
                        <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Form.Group>
                </Row>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
      </main>
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

export default CitDimension;
