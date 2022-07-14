import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import {
  getCitDimensionQuestionList,
  deleteCitDimensionQues,
  getCitDimensionList,
} from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import moment from "moment";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import AlertComponent from "../../components/AlertComponent";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@mui/material/Radio";
import CitDimensionQuesDataTable from "./CitDimensionQuesDataTable";

const CitDimensionQues = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const citDimensionQuestionList = useSelector(
    (state) => state.citDimensionQuestionList
  );
  const [addCitDimensionQuesData, setaddCitDimensionQuesData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/cit-dimension-question";
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
  const citDimensionList = useSelector((state) => state.citDimensionList);
  const [citDataExistance, setCitDataExistance] = useState(false);
  const [citOption, setCitOption] = useState(false);
  const [citAnsType, setCitAnsType] = useState(false);
  const [citData, setCitData] = useState(false);
  const [citDimension, setCitDimension] = useState(false);
  const [fieldData, setFieldData] = useState({
    field: "",
    message: "",
  });

  const [selectedValue, setSelectedValue] = React.useState(false);
  const [loader, setLoader] = useState(false);

  const trueArr = [true, "true"];

  const [openCheckfrom, setOpenCheckfrom] = useState();
  
  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one partner");
    } else {
      setShowAlert(true);
    }
  };

  useEffect(() => {
    console.log(openCheckfrom, "openCheckfrom");
  }, [openCheckfrom]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [citDimensionQuestionList]);

  useEffect(() => {
    setOpenCheckfrom(selectedValue);

    setaddCitDimensionQuesData({
      ...addCitDimensionQuesData,
      data_existance_check: selectedValue === "true" ? true : false,
    });
  }, [selectedValue]);

  const onDeleteFunction = () => {
    dispatch(deleteCitDimensionQues(selectedData._id));
    setShowAlert(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSelectRow = (item) => {
    console.log(item, "itemmm");
    setSelectedData(item);
    setActiveClass(true);
  };
  useEffect(() => {
    dispatch(getCitDimensionQuestionList());
    dispatch(getCitDimensionList());
  }, [props]);

  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setaddCitDimensionQuesData({});
    // setSelectedData({});
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one CIT");
    } else {
      setModalAddShow(true);
      setaddCitDimensionQuesData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setaddCitDimensionQuesData({});
    setSelectedData({});
  };

  const onOptionChange = (e) => {
    let data = e.target.value;
    var options = data.split(",");
    setaddCitDimensionQuesData({
      ...addCitDimensionQuesData,
      options: options,
    });
  };

  useEffect(() => {
    console.log(fieldData, "fieldData");
    if (addCitDimensionQuesData && addCitDimensionQuesData.cit_dimension) {
      setCitDimension(false);
      setFieldData({ field: "cit_dimension", message: "" });
    } else if (addCitDimensionQuesData && addCitDimensionQuesData.data) {
      setCitData(false);
      setFieldData({ field: "data", message: "" });
    } else if (addCitDimensionQuesData && addCitDimensionQuesData.answer_type) {
      setCitAnsType(false);
      setFieldData({ field: "answer_type", message: "" });
    } else if (addCitDimensionQuesData && addCitDimensionQuesData.options) {
      setCitOption(false);
      setFieldData({ field: "options", message: "" });
    } else if (
      addCitDimensionQuesData &&
      addCitDimensionQuesData.data_existance_check_from
    ) {
      setCitDataExistance(false);
      setFieldData({ field: "data_existance_check_from", message: "" });
    } else {
    }
  }, [addCitDimensionQuesData]);

  console.log(fieldData, "fieldData");

  ///// add shg api cll function /////
  const addShgFunc = (e) => {
    e.preventDefault();
    console.log(addCitDimensionQuesData, "addCitDimensionQuesData");

    if (addCitDimensionQuesData && !addCitDimensionQuesData.cit_dimension) {
      setFieldData({
        field: "cit_dimension",
        message: "Please enter CIT Dimension value",
      });
      setCitDimension(true);
    } else if (addCitDimensionQuesData && !addCitDimensionQuesData.data) {
      setFieldData({ field: "data", message: "Please enter Question" });
      setCitData(true);
      setCitDimension(false);
    } else if (
      addCitDimensionQuesData &&
      !addCitDimensionQuesData.answer_type
    ) {
      setFieldData({
        field: "answer_type",
        message: "Please enter Answer Type",
      });
      setCitAnsType(true);
      setCitData(false);
      setCitDimension(false);
    } else if (
      addCitDimensionQuesData &&
      addCitDimensionQuesData.answer_type != "textarea" &&
      !addCitDimensionQuesData.options
    ) {
      setFieldData({ field: "options", message: "Please enter Option" });
      setCitOption(true);
      setCitAnsType(false);
      setCitData(false);
      setCitDimension(false);
    } else if (
      addCitDimensionQuesData &&
      addCitDimensionQuesData.data_existance_check === "true" &&
      !addCitDimensionQuesData.data_existance_check_from
    ) {
      setFieldData({
        field: "data_existance_check_from",
        message: "Please select Data existance check",
      });
      setCitDataExistance(true);
      setCitOption(false);
      setCitAnsType(false);
      setCitData(false);
      setCitDimension(false);
    } else {
      setFieldData({ field: "", message: "" });
      setCitDataExistance(false);
      setCitOption(false);
      setCitAnsType(false);
      setCitData(false);
      setCitDimension(false);

      var body = addCitDimensionQuesData;

      if (addCitDimensionQuesData && addCitDimensionQuesData._id) {
        setLoader(true);
        axios
          .patch(
            api + "/update/" + addCitDimensionQuesData._id,
            body,
            axiosConfig
          )
          .then((response) => {
            console.log(response);
            handleClick();

            setUpdateMessage(response && response.data.message);
            setLoader(false);
            if (response.data && response.data.error === false) {
              const { data } = response;
              dispatch(getCitDimensionQuestionList());
              setModalAddShow(false);
              setaddCitDimensionQuesData({});

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
              dispatch(getCitDimensionQuestionList());
              setModalAddShow(false);
              setaddCitDimensionQuesData({});
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
    let headers = [
      "Id,CITDimension,Question,QuestionExistanceCheck,QuestionExistanceCheckFrom",
    ];

    // Convert users data to a csv
    let usersCsv = citDimensionQuestionList.reduce((acc, user) => {
      const {
        _id,
        cit_dimension,
        data,
        data_existance_check,
        data_existance_check_from,
      } = user;
      acc.push(
        [
          _id,
          cit_dimension.name,
          data,
          data_existance_check,
          data_existance_check_from,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "citDimensionques.csv",
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
      fileName: "citDimensionques.csv",
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
                dispatch(getCitDimensionQuestionList());
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
              <h2 className="page_title">CIT Dimension Question List</h2>
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

            <CitDimensionQuesDataTable
              citDimensionQuestionList={
                citDimensionQuestionList &&
                citDimensionQuestionList.length > 0 &&
                citDimensionQuestionList
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
              {addCitDimensionQuesData && addCitDimensionQuesData._id
                ? "Update CIT Dimension Question"
                : "Add CIT Dimension Question"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>CIT Dimension </Form.Label>
                    <Form.Select
                      name="cit_dimension"
                      value={
                        addCitDimensionQuesData &&
                        addCitDimensionQuesData.cit_dimension &&
                        addCitDimensionQuesData.cit_dimension._id
                      }
                      onChange={(e) =>
                        setaddCitDimensionQuesData({
                          ...addCitDimensionQuesData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"} value="">
                        Default select
                      </option>
                      {citDimensionList &&
                        citDimensionList.length > 0 &&
                        citDimensionList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "cit_dimension" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Question </Form.Label>
                    <Form.Control
                      defaultValue={
                        addCitDimensionQuesData &&
                        addCitDimensionQuesData.data &&
                        addCitDimensionQuesData.data
                      }
                      type="text"
                      placeholder=""
                      name="data"
                      onChange={(e) =>
                        setaddCitDimensionQuesData({
                          ...addCitDimensionQuesData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    {fieldData.field == "data" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Answer Type </Form.Label>
                    <Form.Select
                      name="answer_type"
                      value={
                        addCitDimensionQuesData &&
                        addCitDimensionQuesData.answer_type &&
                        addCitDimensionQuesData.answer_type
                      }
                      onChange={(e) =>
                        setaddCitDimensionQuesData({
                          ...addCitDimensionQuesData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"} value="">
                        Default select
                      </option>
                      <option value={"textarea"}>{"Textarea"}</option>
                      <option value={"select"}>{"Select"}</option>
                      <option value={"checkbox"}>{"Checkbox"}</option>
                      <option value={"radio"}>{"Radio"}</option>
                    </Form.Select>
                    {fieldData.field == "answer_type" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  {addCitDimensionQuesData &&
                    addCitDimensionQuesData.answer_type &&
                    addCitDimensionQuesData.answer_type !== "textarea" && (
                      <Form.Group className="form-group" as={Col} md="6">
                        <Form.Label>Options </Form.Label>
                        <i className="bi bi-plus-circle-fill"></i>
                        <Form.Control
                          defaultValue={
                            addCitDimensionQuesData &&
                            addCitDimensionQuesData.options &&
                            addCitDimensionQuesData.options.map((x) => x)
                          }
                          type="text"
                          placeholder="yes,no,other"
                          name="options"
                          onChange={(e) => onOptionChange(e)}
                        />
                        {fieldData.field == "options" && (
                          <small className="mt-4 mb-2 text-danger">
                            {fieldData && fieldData.message}
                          </small>
                        )}
                      </Form.Group>
                    )}

                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Data Existance Check </Form.Label>

                    <RadioGroup
                      row
                      aria-labelledby="demo-form-control-label-placement"
                      name="data_existance_check"
                      defaultValue={
                        addCitDimensionQuesData &&
                        addCitDimensionQuesData.data_existance_check &&
                        addCitDimensionQuesData.data_existance_check
                      }
                      onChange={(e) =>
                        setaddCitDimensionQuesData({
                          ...addCitDimensionQuesData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Yes"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="No"
                        labelPlacement="start"
                      />
                    </RadioGroup>
                  </Form.Group>
                  {addCitDimensionQuesData &&
                    addCitDimensionQuesData.data_existance_check &&
                    String(addCitDimensionQuesData.data_existance_check) ==
                      "true" && (
                      <Form.Group className="form-group" as={Col} md="6">
                        <Form.Label>Data Existance Check From </Form.Label>
                        <Form.Select
                          name="data_existance_check_from"
                          value={
                            addCitDimensionQuesData &&
                            addCitDimensionQuesData.data_existance_check_from &&
                            addCitDimensionQuesData.data_existance_check_from
                          }
                          onChange={(e) =>
                            setaddCitDimensionQuesData({
                              ...addCitDimensionQuesData,
                              [e.target.name]: e.target.value,
                            })
                          }
                        >
                          <option hidden={"true"} value="">
                            Default select
                          </option>
                          <option value={"documents"}>{"Documents"}</option>
                          <option value={"fir"}>{"FIR"}</option>
                          <option value={"investigation"}>
                            {"Investigation"}
                          </option>
                          <option value={"chargesheet"}>{"Chargesheet"}</option>
                        </Form.Select>
                        {fieldData.field == "data_existance_check_from" &&
                          citDataExistance == true && (
                            <small className="mt-4 mb-2 text-danger">
                              {fieldData && fieldData.message}
                            </small>
                          )}
                      </Form.Group>
                    )}
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
                      disabled={loader == true ? true: false}
                     
                      onClick={addShgFunc}
                      className="submit_btn shadow-0"
                    >
                      {loader && loader === true ? (
                        <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                      ): "Submit"}
                      
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

export default CitDimensionQues;
