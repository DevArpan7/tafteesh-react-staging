import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { getCollectivesList ,deleteCollective} from "../../redux/action";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import moment from "moment";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import AlertComponent from "../../components/AlertComponent";
import CollectivesDataTable from "./CollectivesDataTable";

const KamoCollectives = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [isLoading,setIsLoading] = useState(true)

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const collectivesList = useSelector((state) => state.collectivesList);
  const [addCollectiveData, setAddCollectiveData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api/collective";
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

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one partner");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    dispatch(deleteCollective(selectedData._id));
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
    dispatch(getCollectivesList());
  }, [props]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [collectivesList]);
  ////// on cancel button function ///
  const onCancel = () => {
    setModalAddShow(false);
    setAddCollectiveData({});
    // setSelectedData({});
  };

  const ongotoEdit = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one collective");
    } else {
      setModalAddShow(true);
      setAddCollectiveData(selectedData);
    }
  };

  const ongotoAdd = () => {
    setModalAddShow(true);
    setAddCollectiveData({});
    setSelectedData({});
  };

  ///// add shg api cll function /////

  const addCollectiveFunc = (e) => {
    e.preventDefault();
    var body = addCollectiveData;

    if (addCollectiveData && addCollectiveData._id) {
      axios
        .patch(api + "/update/" + addCollectiveData._id, body, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();

          setUpdateMessage(response && response.data.message);

          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getCollectivesList());
            setModalAddShow(false);
            // setSelectedData({});
            setActiveClass(false);
            setAddCollectiveData({});
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
            dispatch(getCollectivesList());
            setModalAddShow(false);
            setAddCollectiveData({});
          }
        })
        .catch((error) => {
          console.log(error, "shg add error");
        });
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
    let headers = ["Id,CollectiveName, CreatedAt"];

    // Convert users data to a csv
    let usersCsv = collectivesList.data.reduce((acc, user) => {
      const { _id,name, createdAt } = user;
      acc.push([_id,name, createdAt].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "collectives.csv",
      fileType: "text/csv",
    });
  };

  ///////////// import CSV file  function ////
  const [file, setFile] = useState();
  const [importCSVdata, setImportCSVdata] = useState([]);
  const fileReader = new FileReader();
  const [importCsvOpenModel, setImportCsvOpenModel] = useState(false);
  const [sampleArr, setSampleArr] = useState([{ name: "Ariit Das" }]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };
  const downloadSampleCsv = (e) => {
    let headers = ["CollectiveName"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { name } = user;
      acc.push([name].join(","));
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "collectives.csv",
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
          (obj = { name: item && item.CollectiveName }),
          console.log(obj, "obj"),
          axios
            .post(api + "/create", obj, axiosConfig)
            .then((response) => {
              console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getCollectivesList());
                setModalAddShow(false);
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
              <h2 className="page_title">Collectives List</h2>
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
            <CollectivesDataTable 
              collectivesList={collectivesList &&
              collectivesList.data &&
              collectivesList.data.length > 0 &&
              collectivesList.data}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
            {/* <div className="table-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="33.33%">Name </th>
                    <th width="33.33%">CreatedAt</th>
                  </tr>
                </thead>
                <tbody>
                  {collectivesList &&
                  collectivesList.data &&
                  collectivesList.data.length > 0 ? (
                    collectivesList.data.map((item) => {
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
                              item.createdAt &&
                              moment(item.createdAt).format("DD/MM/YYYY")}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={2}>
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
            {addCollectiveData && addCollectiveData._id ? "Update Collective": "Add Collective"}  
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
                        addCollectiveData &&
                        addCollectiveData.name &&
                        addCollectiveData.name
                      }
                      type="text"
                      placeholder=""
                      name="name"
                      onChange={(e) =>
                        setAddCollectiveData({
                          ...addCollectiveData,
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
                      Close
                    </MDBBtn>
                  </Form.Group>
                  <Form.Group as={Col} md="auto">
                    <Button
                      type="submit"
                      disabled={
                        addCollectiveData && !addCollectiveData.name
                          ? true
                          : false
                      }
                      onClick={addCollectiveFunc}
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

export default KamoCollectives;
