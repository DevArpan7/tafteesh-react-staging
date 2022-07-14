import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import {
  getLawyersList,
  getLawyersCategoryList,
  getMasterBlockList,
  getStateList,
  getCourtList,
} from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import moment from "moment";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import LawyersListDataTable from "./LawyersListDataTable";
import AlertComponent from "../../components/AlertComponent";
import { MultiSelect } from "react-multi-select-component";

const LawyersList = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const lawyersList = useSelector((state) => state.lawyersList);
  const courtList = useSelector((state) => state.courtList);

  const lawyersCategoryList = useSelector((state) => state.lawyersCategoryList);
  const masterBlockList = useSelector((state) => state.masterBlockList);
  const stateList = useSelector((state) => state.stateList);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [courtArr, setCourtArr] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectCat, setSelectCat] = useState([]);
  const [categoryArr, setCategoryArr] = useState([]);

  const [addLawyerData, setAddLawyerData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/lawyer";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [activeClass, setActiveClass] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
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
    dispatch(getLawyersList());
    dispatch(getLawyersCategoryList());
    dispatch(getMasterBlockList());
    dispatch(getStateList());
    dispatch(getCourtList());
  }, [props]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [lawyersList]);

  useEffect(() => {
    const options = [];
    let obj = { label: "", value: "" };
    courtList &&
      courtList.length > 0 &&
      courtList.map((court) => {
        return (
          (obj = { label: court.name, value: court._id }),
          options.push(obj),
          console.log(options, obj, "options, obj"),
          setCourtArr(options)
        );
      });
  }, [courtList]);

  useEffect(() => {
    const options = [];
    let obj = { label: "", value: "" };
    lawyersCategoryList &&
      lawyersCategoryList.length > 0 &&
      lawyersCategoryList.map((court) => {
        return (
          (obj = { label: court.name, value: court._id }),
          options.push(obj),
          console.log(options, obj, "options, obj"),
          setCategoryArr(options)
        );
      });
  }, [lawyersCategoryList]);

  useEffect(() => {
    let arr = [];
    selected &&
      selected.length > 0 &&
      selected.map((data) => {
        return (
          arr.push(data.value),
          console.log(arr, "arr"),
          setAddLawyerData({
            ...addLawyerData,
            court: arr,
          })
        );
      });
  }, [selected]);
  useEffect(() => {
    let arr = [];
    selectCat &&
      selectCat.length > 0 &&
      selectCat.map((data) => {
        return (
          arr.push(data.value),
          console.log(arr, "arr"),
          setAddLawyerData({
            ...addLawyerData,
            category: arr,
          })
        );
      });
  }, [selectCat]);

  useEffect(() => {
    let obj = {};
    let arr = [...selected];
    addLawyerData &&
      addLawyerData.court &&
      addLawyerData.court.length > 0 &&
      addLawyerData.court.map((item) => {
        return (obj = { label: item && item.name && item.name, value: item._id }), arr.push(obj);
      });
      setSelected(arr);
      let catobj = {};
      let catarr = [...selectCat];
      addLawyerData &&
        addLawyerData.category &&
        addLawyerData.category.length > 0 &&
        addLawyerData.category.map((item) => {
          return (catobj = { label: item && item.name && item.name, value: item._id }), catarr.push(catobj);
        });

        console.log(catarr,"catarr")
    setSelectCat(catarr);
  }, [addLawyerData && addLawyerData._id]);


console.log(selectCat,"selectCatselectCat")

  ////// on cancel button function ///
  const onCancel = (e) => {
    e.preventDefault();
    setModalAddShow(false);
    setAddLawyerData({});
    setSelectCat([])
    setSelected([])
    setFieldData({ field: "", message: "" });
    // setSelectedData({});
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one lawyer");
    } else {
      setModalAddShow(true);
      setAddLawyerData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddLawyerData({});
    setSelectedData({});
    setSelectCat([])
    setSelected([])
  };

  useEffect(() => {
    console.log(addLawyerData, "org data");
  }, [addLawyerData]);

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Lawyer");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    axios
      .patch(api + "/delete/" + selectedData._id)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({});
          dispatch(getLawyersList());
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };

  useEffect(() => {
    if (addLawyerData && addLawyerData.name) {
      setFieldData({ field: "name", message: "" });
    }else if (addLawyerData && addLawyerData.location) {
      setFieldData({ field: "location", message: "" });
    }else if (addLawyerData && addLawyerData.category) {
      setFieldData({ field: "category", message: "" });
    }else if (addLawyerData && addLawyerData.court) {
      setFieldData({ field: "court", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [addLawyerData]);
  ///// add Organisation api cll function /////

  const addLawyerFunc = (e) => {
    e.preventDefault();
    if (addLawyerData && !addLawyerData.name) {
      setFieldData({
        field: "name",
        message: "Please enter Name",
      });
      
    }else  if (addLawyerData && !addLawyerData.location) {
      setFieldData({
        field: "location",
        message: "Please select Location",
      });
    } else  if (addLawyerData && !addLawyerData.category) {
      setFieldData({
        field: "category",
        message: "Please select Category",
      });
    } else  if (addLawyerData && !addLawyerData.court) {
      setFieldData({
        field: "court",
        message: "Please select Court",
      });
      
    } 
    
    else {
      setFieldData({ field: "", message: "" });


    var body = {
      ...addLawyerData,
      // "court": selected && selected,
      // "category": selectCat && selectCat
    };

    console.log(body);
    if (addLawyerData && addLawyerData._id) {
      setLoader(true)
      axios
        .patch(api + "/update/" + addLawyerData._id, body, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();

          setUpdateMessage(response && response.data.message);
          setLoader(false)
          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getLawyersList());
            setSelectCat([])
            setSelected([])
            setModalAddShow(false);
            setAddLawyerData({});
           
          }
        })
        .catch((error) => {
          setLoader(false)
          console.log(error, "shg add error");
        });
    } else {
      setLoader(true)

      axios
        .post(api + "/create", body, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);
          setLoader(false)

          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getLawyersList());
            setSelectCat([])
            setSelected([])
            setModalAddShow(false);
            setAddLawyerData({});
            
          }
        })
        .catch((error) => {
          setLoader(false)
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
    let headers = ["Id,LawyerName,Location,Category,Block"];

    // Convert users data to a csv
    let usersCsv = lawyersList.reduce((acc, user) => {
      const { _id, name, location, name_of_group, blockId } = user;
      acc.push(
        [_id, name, location.name, name_of_group.name, blockId.name].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "lawyers.csv",
      fileType: "text/csv",
    });
  };
  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([
    {
      LawyerName: "Ankush Tiwari",
      Location: "India",
      Category: "62a9bf6bc204c7023bcf0ab7",
      Block: "62a9a866c05c6a1059f92eb5",
    },
  ]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };
  const downloadSampleCsv = (e) => {
    let headers = ["LawyerName,Location,Category,Block"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { LawyerName, Location, Category, Block } = user;
      acc.push([LawyerName, Location, Category, Block].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "lawyers.csv",
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
            name: item && item.LawyerName,
            location: item && item.Location,
            name_of_group: item && item.Category,
            blockId: item && item.Block,
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
                dispatch(getLawyersList());
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
              <h2 className="page_title">Lawyers List</h2>
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
            <LawyersListDataTable
              lawyersList={lawyersList && lawyersList.length > 0 && lawyersList}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
            {/* <div className="table-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th>Name </th>
                    <th>Category </th>
                    <th>Block </th>
                    <th>Location </th>
                  </tr>
                </thead>
                <tbody>
                  {lawyersList && lawyersList.length > 0 ? (
                    lawyersList.map((item) => {
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
                          <td>
                            {item &&
                              item.name_of_group &&
                              item.name_of_group.name}
                          </td>
                          <td>{item && item.blockId && item.blockId.name}</td>
                          <td>
                            {item &&
                              item.location &&
                              item.location.name &&
                              item.location.name}
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
                  handleOnChange={handleOnChange}
                  handleOnSubmit={handleOnSubmit}
                  downloadSampleCsv={downloadSampleCsv}
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
              {addLawyerData && addLawyerData._id
                ? "Update Lawyer"
                : " Add Lawyer"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  {/* <Form.Group className="form-group" as={Col} md="6"> */}
                  {/* <Form.Label>ID </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group> */}
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Name </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      defaultValue={
                        addLawyerData &&
                        addLawyerData.name &&
                        addLawyerData.name
                      }
                      name="name"
                      onChange={(e) =>
                        setAddLawyerData({
                          ...addLawyerData,
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
                  {/* <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Phone </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            defaultValue={addLawyerData && addLawyerData.phone && addLawyerData.phone}
                                            name="phone"
                                            onChange={(e) => setAddLawyerData({
                                                ...addLawyerData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group> */}
                  {/* <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Email </Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder=""
                                            defaultValue={addLawyerData && addLawyerData.email && addLawyerData.email}
                                            name="email"
                                            onChange={(e) => setAddLawyerData({
                                                ...addLawyerData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group> */}
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Location </Form.Label>
                    <Form.Select
                      name="location"
                      value={
                        addLawyerData &&
                        addLawyerData.location &&
                        addLawyerData.location._id
                      }
                      onChange={(e) =>
                        setAddLawyerData({
                          ...addLawyerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"} value="">Default select</option>
                      {stateList &&
                        stateList.length > 0 &&
                        stateList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                    {fieldData.field == "location" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Category </Form.Label>
                    {/* <Form.Select
                      name="name_of_group"
                      value={
                        addLawyerData &&
                        addLawyerData.name_of_group &&
                        addLawyerData.name_of_group.name
                      }
                      onChange={(e) =>
                        setAddLawyerData({
                          ...addLawyerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"}>Default select</option>
                      {lawyersCategoryList &&
                        lawyersCategoryList.length > 0 &&
                        lawyersCategoryList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select> */}
                    <MultiSelect
                      options={categoryArr}
                      value={selectCat}
                      hasSelectAll={false}
                      disableSearch={true}
                      onChange={setSelectCat}
                      labelledBy={"Select"}
                      className={"survivorMultiselect-box multiselectbox_span"}
                      overrideStrings={{
                        selectSomeItems: "Select columns to view",
                        allItemsAreSelected: "All Categories are Selected",
                        selectAll: "Select All",
                        search: "Search",
                      }}
                    />
                     {fieldData.field == "category" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>Court </Form.Label>
                    {/* <Form.Select
                      name="blockId"
                      value={
                        addLawyerData &&
                        addLawyerData.blockId &&
                        addLawyerData.blockId.name
                      }
                      onChange={(e) =>
                        setAddLawyerData({
                          ...addLawyerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={"true"}>Default select</option>
                      {masterBlockList &&
                        masterBlockList.length > 0 &&
                        masterBlockList.map((item) => {
                          return (
                            <option value={item._id}>
                              {item && item.name}
                            </option>
                          );
                        })}
                    </Form.Select> */}

                    <MultiSelect
                      options={courtArr}
                      value={selected}
                      hasSelectAll={false}
                      disableSearch={true}
                      onChange={setSelected}
                      labelledBy={"Select"}
                      className={"survivorMultiselect-box multiselectbox_span"}
                      overrideStrings={{
                        selectSomeItems: "Select columns to view",
                        allItemsAreSelected: "All Courts are Selected",
                        selectAll: "Select All",
                        search: "Search",
                      }}
                    />  {fieldData.field == "court" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                </Row>
                <Row className="justify-content-between">
                  <Form.Group as={Col} md="auto">
                    <MDBBtn
                      className="shadow-0 cancle_btn"
                      color="danger"
                      onClick={(e) => onCancel(e)}
                    >
                      Close
                    </MDBBtn>
                  </Form.Group>
                  <Form.Group as={Col} md="auto">
                    <Button
                      type="submit"
                      // disabled={
                      //   addLawyerData && !addLawyerData.name
                      //     ? true
                      //     : !addLawyerData.location
                      //     ? true
                      //     : !addLawyerData.category
                      //     ? true
                      //     : !addLawyerData.court
                      //     ? true
                      //     : false
                      // }
                      disabled={loader == true ? true : false}
                      onClick={addLawyerFunc}
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

export default LawyersList;
