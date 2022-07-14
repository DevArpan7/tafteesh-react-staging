import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { findAncestor, goToTraffickerView } from "../../utils/helper";

import {
  getTraffickerList,
  getPoliceStationList,
  getMasterDistrictList,
  getStateList,
  getOrganizationList,
  getUsersList,
  getMasterBlockList,
  getAllSurvivorList,
} from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import TraffickersDataTableList from "./TraffickersDataTableList";
import AlertComponent from "../../components/AlertComponent";
// import { FormatColorReset } from '@mui/icons-material';

const TraffickersList = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userId, setUserId] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [addTraffickerData, setAddTraffickerData] = useState({});
  const [addSourceData, setAddSourceData] = useState({});
  const [addDestinationData, setAddDestinationData] = useState({});
  const [resultLoad, setResultLoad] = useState(false);
  const traffickerList = useSelector((state) => state.traffickerList);
  const policeStationList = useSelector((state) => state.policeStationList);
  const masterDistrictList = useSelector((state) => state.masterDistrictList);
  const stateList = useSelector((state) => state.stateList);
  const masterBlockList = useSelector((state) => state.masterBlockList);
  const usersList = useSelector((state) => state.usersList);
  const history = useHistory();
  const organizationList = useSelector((state) => state.organizationList);
  const allsurvivorList = useSelector((state) => state.allsurvivorList);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const loguserId = localStorage.getItem("userId");

  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const dispatch = useDispatch();
  const [fileSelect, setFileSelect] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [trafficimage, setTrafficimage] = useState();
  const [messagType, setMessagType] = useState("");

  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getTraffickerList());
    dispatch(getPoliceStationList());
    dispatch(getMasterDistrictList());
    dispatch(getMasterBlockList());
    dispatch(getStateList());
    dispatch(getUsersList());
    dispatch(getOrganizationList());
    dispatch(getAllSurvivorList());
  }, [props]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [traffickerList]);
  const onSelectRow = (data) => {
    console.log(data, "traficId");
    setActiveClass(true);
    setUserId(data._id);
  };
const gotoEdit=()=>{
  if (!userId) {
    alert("Please select a trafficker");
  } else {
    setModalAddShow(true);
    getTraffickerDetails(userId)
  }
}


  const gotoView = (e) => {
    if (!userId) {
      alert("Please select one Trafficker");
    } else {
      goToTraffickerView(e, userId, history);
    }
  };

  const removeSelection = () => {
    setAddTraffickerData({});
    setActiveClass(false);
    setUserId("");
    setAddTraffickerData({});
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalAddShow(false);
    setPictureData({});
    setAddTraffickerData({});
    setAddDestinationData({});
    setAddSourceData({});
  };

  const onCancel = () => {
    setModalAddShow(false);
    setPictureData({});
    setAddTraffickerData({});
    setAddDestinationData({});
    setAddSourceData({});
  };

  /////////////////////file upload function/////////////////////////
  const handleFileInput = (e) => {
    console.log(e, e.target.files[0]);
    let data = e.target.files[0];

    setFileSelect(e.target.files[0]);
    storeFile(data);
  };

  const storeFile = (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response;
          setPictureData(data.data);
          let obj = "";
          obj = `https://tafteesh-staging-node.herokuapp.com/${
            data.data && data.data.filePath
          }`;

          setTrafficimage(obj);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    console.log(trafficimage);
  }, [trafficimage]);

  /* api call for trafficker detail */
  useEffect(() => {
    console.log(userId, "userId");
    getTraffickerDetails(userId);
  }, [userId]);

  const getTraffickerDetails = (id) => {
    console.log(id);
    axios
      .get(api + "/trafficker-profile/detail/" + id, axiosConfig)
      .then((response) => {
        console.log(response, "daaaaa");
        if (response.data && response.data.error === false) {
          const { data } = response;
          setAddTraffickerData(data.data);

          setAddDestinationData(
            data.data && data.data.destination && data.data.destination
          );
          setAddSourceData(
            data.data && data.data.sourceArea && data.data.sourceArea
          );
        }
      })
      .catch((error) => {
        console.log(error, "user details error");
      });
  };
  useEffect(() => {
    setAddTraffickerData({
      ...addTraffickerData,
      destination: addDestinationData,
    });
  }, [addDestinationData]);
  useEffect(() => {
    setAddTraffickerData({
      ...addTraffickerData,
      sourceArea: addSourceData,
    });
  }, [addSourceData]);

  
  useEffect(() => {
    if (addTraffickerData && addTraffickerData.trafficker_name) {
      setFieldData({ field: "trafficker_name", message: "" });
    } else if (addTraffickerData && addTraffickerData.gender) {
      setFieldData({ field: "gender", message: "" });
    } else if (addTraffickerData && addTraffickerData.age) {
      setFieldData({ field: "age", message: "" });
    } else if (addTraffickerData && addTraffickerData.relation_with_survivor) {
      setFieldData({ field: "relation_with_survivor", message: "" });
    }else if (addTraffickerData && addTraffickerData.identification_mark) {
      setFieldData({ field: "identification_mark", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [addTraffickerData]);

  const addUserFunc = (e) => {
    e.preventDefault();

    if (addTraffickerData && !addTraffickerData.trafficker_name) {
      setFieldData({ field: "trafficker_name", message: "Please enter Name" });
    } else if (addTraffickerData && !addTraffickerData.gender) {
      setFieldData({ field: "gender", message: "Please select Gender" });
    } else if (addTraffickerData && !addTraffickerData.age) {
      setFieldData({
        field: "age",
        message: "Please enter Age",
      });
    } else if (addTraffickerData && !addTraffickerData.relation_with_survivor) {
      setFieldData({
        field: "relation_with_survivor",
        message: "Please write relation with survivor",
      });
    } else if (addTraffickerData && !addTraffickerData.identification_mark) {
      setFieldData({
        field: "identification_mark",
        message: "Please write Identification Mark",
      });
    }else if (addTraffickerData && !addTraffickerData.trafficked_to) {
      setFieldData({
        field: "trafficked_to",
        message: "Please write Trafficked To",
      });
    } else {
      setFieldData({
        field: "",
        message: "",
      });

    var objData = {
      ...addTraffickerData,
      image: trafficimage && trafficimage,

      // "photograph": pictureArr
    };
    var body = objData;
    if (userId) {
      setLoader(true);
      axios
        .patch(api + "/trafficker-profile/update/" + userId, body, axiosConfig)
        .then((res) => {
          console.log(res);
          setLoader(false);

          // setResultLoad(FormatColorReset)
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            handleClick();
            setUpdateMessage(res && res.data.message);
            setMessagType("success");
            console.log(data, res);
            dispatch(getTraffickerList());
            // setPictureData({})
            setTrafficimage({});
            // setAddTraffickerData({})
            setModalAddShow(false);
          } else {
            handleClick();
            setUpdateMessage(res && res.data.data.message);
            setMessagType("error");
          }
        })
        .catch((error) => {
          setLoader(false);
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
          console.log(error);
        });
    } else {
      setLoader(true);
      axios
        .post(api + "/trafficker-profile/create", body, axiosConfig)
        .then((res) => {
          console.log(res);

          setLoader(false);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            handleClick();
            setMessagType("success");

            setUpdateMessage(res && res.data.message);
            console.log(data, res);
            dispatch(getTraffickerList());
            setPictureData({});
            setTrafficimage({});
            // setAddTraffickerData({})
            setModalAddShow(false);
          } else {
            handleClick();
            setMessagType("error");

            setUpdateMessage(res && res.data.data.message);
          }
        })
        .catch((error) => {
          setLoader(false);
          handleClick();
          setUpdateMessage(error && error.message);
          setMessagType("error");
          console.log(error);
        });
    }
  }
  };

  /////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (!userId) {
      alert("Please select one Trafficker ");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    axios
      .patch(api + "/trafficker-profile/delete/" + userId)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setUserId("");
          dispatch(getTraffickerList());
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
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
      "Trafficker Id, Trafficker Name, Gender,Residential Address,Is Trafficker",
    ];

    // Convert users data to a csv
    let usersCsv = traffickerList.reduce((acc, user) => {
      const {
        trafficker_id,
        trafficker_name,
        gender,
        residential_address,
        is_trafficker,
      } = user;
      acc.push(
        [
          trafficker_id,
          trafficker_name,
          gender,
          residential_address,
          is_trafficker,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "trafficker.csv",
      fileType: "text/csv",
    });
  };

  return (
    <>
      <KamoTopbar />
      <main className="main_body">
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Traffickers List</h2>
            </div>
          </div>
          <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
            <div className="vieweditdelete">
              <Dropdown align="end">
                {/* <Dropdown.Toggle variant="border" className="shadow-0" id="download-dropdown">
                                    Download List
                                </Dropdown.Toggle> */}

                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportToCsv}>CSV</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "view_btn add_btn" }}
                title="Add"
              >
                <span
                  onClick={() => {
                    setModalAddShow(true);
                    removeSelection();
                  }}
                >
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag={"a"}
                wrapperProps={{ className: "view_btn add_btn" }}
                title="View"
              >
                <span onClick={(e) => gotoView(e)}>
                  <i className="fal fa-eye"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag={Link}
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span
                  onClick={() => {
                    gotoEdit()
                  }}
                >
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
            <TraffickersDataTableList
              traffickerList={
                traffickerList && traffickerList.length > 0 && traffickerList
              }
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
          </div>
        </div>


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
             { addTraffickerData &&
                        addTraffickerData._id ? "Update Traffickers" :  "Add Traffickers"} 
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form >
                <NotificationPage
                  handleClose={handleClose}
                  open={open}
                  message={updateMessage}
                />
                <Row>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>
                      Name of Trafficker / Accused{" "}
                      <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      name="trafficker_name"
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.trafficker_name &&
                        addTraffickerData.trafficker_name
                      }
                      type="text"
                      
                      placeholder=""
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    {fieldData.field == "trafficker_name" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>
                      Gender <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      
                      name="gender"
                      value={
                        addTraffickerData &&
                        addTraffickerData.gender &&
                        addTraffickerData.gender
                      }
                    >
                      <option value={""} hidden="true">
                        Open this select menu
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="transgender">Transgender</option>
                      {/* <option value="others">Others</option> */}
                    </Form.Select>
                    {fieldData.field == "gender" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group" as={Col} md="6">
                    <Form.Label>
                      Age<span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      name="age"
                      
                      type="number"
                      placeholder=""
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.age &&
                        addTraffickerData.age
                      }
                    />
                     {fieldData.field == "age" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>
                      Relationship with survivour (if any){" "}
                      <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      
                      value={
                        addTraffickerData &&
                        addTraffickerData.relation_with_survivor &&
                        addTraffickerData.relation_with_survivor
                      }
                      name="relation_with_survivor"
                    >
                      <option value={""} hidden="true">
                        Open this select menu
                      </option>
                      <option value="parents">Parents</option>
                      <option value="siblings">Siblings</option>
                      <option value="relatives">Relatives</option>
                      <option value="neighbour">Neighbour</option>
                      <option value="friend">Friend</option>
                      <option value="unknown">Unknown</option>
                    </Form.Select>
                    {fieldData.field == "relation_with_survivor" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>Residential address (SA)</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="residential_address_source"
                      type="text"
                      placeholder=""
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.residential_address_source &&
                        addTraffickerData.residential_address_source
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>Residential address (DA)</Form.Label>
                    <Form.Control
                      name="residential_address_destination"
                      type="text"
                      placeholder=""
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.residential_address_destination &&
                        addTraffickerData.residential_address_destination
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>
                      Identification Mark{" "}
                      <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Control
                      name="identification_mark"
                      type="text"
                      placeholder=""
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      
                      defaultValue={
                        addTraffickerData &&
                        addTraffickerData.identification_mark &&
                        addTraffickerData.identification_mark
                      }
                    />
                    {fieldData.field == "identification_mark" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                    
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      onChange={handleFileInput}
                      type="file"
                      
                      name="file"
                      size="lg"
                      // defaultValue={addDocumentData && addDocumentData.file && addDocumentData.file}
                    />
                  
                  </Form.Group>
                  <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label>
                      Trafficked to (Destination / Transit){" "}
                      <span className="requiredStar">*</span>
                    </Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setAddTraffickerData({
                          ...addTraffickerData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      name="trafficked_to"
                      
                      value={
                        addTraffickerData &&
                        addTraffickerData.trafficked_to &&
                        addTraffickerData.trafficked_to
                      }
                    >
                      <option value={""} hidden="true">
                        Open this select menu
                      </option>
                      <option value="destination">Destination</option>
                      <option value="transit">Transit</option>
                    </Form.Select>
                    {fieldData.field == "trafficked_to" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
                    
                  </Form.Group>
                  {addTraffickerData &&
                    addTraffickerData.trafficked_to === "destination" && (
                      <Form.Group
                        className="traffickerDestination"
                        as={Col}
                        md="12"
                        className="form-group"
                      >
                        <Row>
                         
                          <Form.Group as={Col} md="12" className="form-group">
                            <h5>Destination</h5>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              Name of Police station FIR was filed (DA)
                            </Form.Label>
                            <Form.Select
                              onChange={(e) =>
                                setAddDestinationData({
                                  ...addDestinationData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="police_station_name_fir_filed"
                              value={
                                addDestinationData &&
                                addDestinationData.police_station_name_fir_filed &&
                                addDestinationData.police_station_name_fir_filed
                              }
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {policeStationList &&
                                policeStationList.length > 0 &&
                                policeStationList.map((item) => {
                                  return (
                                    <option value={item && item.name}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              District of police station FIR was filed (DA)
                            </Form.Label>
                            <Form.Select
                              onChange={(e) =>
                                setAddDestinationData({
                                  ...addDestinationData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addDestinationData &&
                                addDestinationData.police_station_district_fir_filed &&
                                addDestinationData.police_station_district_fir_filed
                              }
                              name="police_station_district_fir_filed"
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {masterDistrictList &&
                                masterDistrictList.length > 0 &&
                                masterDistrictList.map((item) => {
                                  return (
                                    <option value={item && item.name}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              State of Police station FIR was filed (DA)
                            </Form.Label>
                            <Form.Select
                              onChange={(e) =>
                                setAddDestinationData({
                                  ...addDestinationData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addDestinationData &&
                                addDestinationData.police_station_state_fir_filed &&
                                addDestinationData.police_station_state_fir_filed
                              }
                              name="police_station_state_fir_filed"
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {stateList &&
                                stateList.length > 0 &&
                                stateList.map((item) => {
                                  return (
                                    <option value={item && item.name}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              FIR number filed at the destination
                            </Form.Label>
                            <Form.Control
                              name="fir_number_destination"
                              type="text"
                              placeholder=""
                              onChange={(e) =>
                                setAddDestinationData({
                                  ...addDestinationData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              defaultValue={
                                addDestinationData &&
                                addDestinationData.fir_number_destination &&
                                addDestinationData.fir_number_destination
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              GD number filed at the destination
                            </Form.Label>
                            <Form.Control
                              name="gd_number_destination"
                              type="text"
                              placeholder=""
                              onChange={(e) =>
                                setAddDestinationData({
                                  ...addDestinationData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              defaultValue={
                                addDestinationData &&
                                addDestinationData.gd_number_destination &&
                                addDestinationData.gd_number_destination
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>The year FIR was filed (DA)</Form.Label>
                            <Form.Control
                              name="year_of_fir"
                              type="number"
                              placeholder=""
                              onChange={(e) =>
                                setAddDestinationData({
                                  ...addDestinationData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              defaultValue={
                                addDestinationData &&
                                addDestinationData.year_of_fir &&
                                addDestinationData.year_of_fir
                              }
                            />
                          </Form.Group>
                        </Row>
                      </Form.Group>
                    )}
                  {addTraffickerData &&
                    addTraffickerData.trafficked_to === "transit" && (
                      <Form.Group
                        className="traffickerSource"
                        as={Col}
                        md="12"
                        className="form-group"
                      >
                        <Row>
                          {/* <Form.Group as={Col} md="6" className="form-group">
                                                <Form.Label>Photo </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    name="file"
                                                    size="lg"
                                                />
                                            </Form.Group> */}
                          <Form.Group as={Col} md="12" className="form-group">
                            <h5>Source Area</h5>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              Name of Police station FIR was filed (SA){" "}
                            </Form.Label>
                            <Form.Select
                              value={
                                addSourceData &&
                                addSourceData.police_station_name_fir_filed &&
                                addSourceData.police_station_name_fir_filed
                              }
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="police_station_name_fir_filed"
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {policeStationList &&
                                policeStationList.length > 0 &&
                                policeStationList.map((item) => {
                                  return (
                                    <option value={item && item.name}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              District of police station FIR was filed (SA){" "}
                            </Form.Label>
                            <Form.Select
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.police_station_district_fir_filed &&
                                addSourceData.police_station_district_fir_filed
                              }
                              name="police_station_district_fir_filed"
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {masterDistrictList &&
                                masterDistrictList.length > 0 &&
                                masterDistrictList.map((item) => {
                                  return (
                                    <option value={item && item.name}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              State of Police station FIR was filed (SA){" "}
                            </Form.Label>
                            <Form.Select
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.police_station_state_fir_filed &&
                                addSourceData.police_station_state_fir_filed
                              }
                              name="police_station_state_fir_filed"
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {stateList &&
                                stateList.length > 0 &&
                                stateList.map((item) => {
                                  return (
                                    <option value={item && item.name}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              FIR number filed at the source (then "/" , year){" "}
                            </Form.Label>
                            <Form.Control
                              name="fir_number_destination"
                              type="text"
                              placeholder=""
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              defaultValue={
                                addSourceData &&
                                addSourceData.fir_number_destination &&
                                addSourceData.fir_number_destination
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              The year FIR was filed (SA){" "}
                            </Form.Label>
                            <Form.Control
                              name="year_of_fir"
                              type="number"
                              placeholder=""
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              defaultValue={
                                addSourceData &&
                                addSourceData.year_of_fir &&
                                addSourceData.year_of_fir
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              GD number filed at the source (then "/" , year)
                            </Form.Label>
                            <Form.Control
                              name="gd_number_destination"
                              type="text"
                              placeholder=""
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              defaultValue={
                                addSourceData &&
                                addSourceData.gd_number_destination &&
                                addSourceData.gd_number_destination
                              }
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>Status of prosecution</Form.Label>
                            <Form.Select
                              name="status_of_prosecution"
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.status_of_prosecution &&
                                addSourceData.status_of_prosecution
                              }
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              <option value="absconding">Absconding</option>
                              <option value="arrested">Arrested</option>
                              <option value="bailed">Bailed</option>
                              <option value="incustody">In Custody</option>
                              <option value="acquited">Acquited</option>
                              <option value="Punished">Punished</option>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>Name of Survivor</Form.Label>
                            <Form.Select
                              name="survivor"
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.survivor &&
                                addSourceData.survivor
                              }
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>

                              {allsurvivorList &&
                                allsurvivorList.length > 0 &&
                                allsurvivorList.map((item) => {
                                  return (
                                    <option value={item && item._id}>
                                      {item && item.survivor_name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              Address of survivor (Block){" "}
                            </Form.Label>
                            <Form.Select
                              name="block_of_survivor"
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.block_of_survivor &&
                                addSourceData.block_of_survivor
                              }
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {masterBlockList &&
                                masterBlockList.length > 0 &&
                                masterBlockList.map((item) => {
                                  return (
                                    <option value={item && item.name}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              Address of survivor (District)
                            </Form.Label>
                            <Form.Select
                              name="district_of_survivor"
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.district_of_survivor &&
                                addSourceData.district_of_survivor
                              }
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {masterDistrictList &&
                                masterDistrictList.length > 0 &&
                                masterDistrictList.map((item) => {
                                  return (
                                    <option value={item && item.name}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              Name of NGO following up (Organizational ID)
                            </Form.Label>
                            <Form.Select
                              name="ngo_following_up"
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.ngo_following_up &&
                                addSourceData.ngo_following_up
                              }
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {organizationList &&
                                organizationList.data &&
                                organizationList.data.length > 0 &&
                                organizationList.data.map((item) => {
                                  return (
                                    <option value={item && item._id}>
                                      {item && item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>
                              Name of social worker following up
                            </Form.Label>
                            <Form.Select
                              name="social_worker_following_up"
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.social_worker_following_up &&
                                addSourceData.social_worker_following_up
                              }
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {usersList &&
                                usersList.length > 0 &&
                                usersList.map((item) => {
                                  return (
                                    <option value={item && item._id}>
                                      {item && item.fname + item.lname}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>Repeat offender</Form.Label>
                            <Form.Select
                              name="repeated_offender"
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              value={
                                addSourceData &&
                                addSourceData.repeated_offender &&
                                addSourceData.repeated_offender
                              }
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                              <option value="maybe">Maybe</option>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="6" className="form-group">
                            <Form.Label>Name of other survivors</Form.Label>
                            <Form.Select
                              name="other_survivor"
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              // value={addSourceData && addSourceData.other_survivor  && addSourceData.other_survivor}
                            >
                              <option hidden="true">
                                Open this select menu
                              </option>
                              {allsurvivorList &&
                                allsurvivorList.length > 0 &&
                                allsurvivorList.map((item) => {
                                  return (
                                    <option value={item && item._id}>
                                      {item && item.survivor_name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md="12" className="form-group">
                            <Form.Label>
                              Any memo about this trafficker
                            </Form.Label>
                            <Form.Control
                              name="memo_about_trafficker"
                              type="text"
                              placeholder=""
                              onChange={(e) =>
                                setAddSourceData({
                                  ...addSourceData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              defaultValue={
                                addSourceData &&
                                addSourceData.memo_about_trafficker &&
                                addSourceData.memo_about_trafficker
                              }
                            />
                          </Form.Group>
                        </Row>
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
                      // disabled={resultLoad}
                      disabled={loader == true ? true : false}
                      onClick={(e) => addUserFunc(e)}
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

export default TraffickersList;



 {/* <Modal className="addFormModal" show={modalAddShow} onHide={setModalAddShow} size="lg" aria-labelledby="reason-modal" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Traffickers
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="site_form_wraper">
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <NotificationPage
                                    handleClose={handleClose}
                                    open={open}
                                    message={updateMessage}
                                />
                                <Row>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Name <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.trafficker_name}
                                            name='trafficker_name'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Age <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.age}
                                            name='age'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="number"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="form-group">
                                        <Form.Label>Gender <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Select
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            name='gender'
                                            value={addTraffickerData && addTraffickerData.gender}
                                        >
                                            <option hidden="true">Open this select menu</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="transgender">Transgender</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="form-group">
                                        <Form.Label>Photo </Form.Label>
                                        <Form.Control
                                            onChange={handleFileInput}
                                            type="file"
                                            name="file"
                                            size="lg"
                                        />

                                        {pictureArr && pictureArr.map((pic) => {
                                            return (
                                                <div style={{fontSize: "12px"}}> 
                                                    {pic && pic.split('/').pop()}

                                                </div>
                                            )
                                        })}


                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>ID Mark </Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.identification_mark}
                                            name='identification_mark'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Is Trafficker ?</Form.Label>
                                        <Form.Select name="is_trafficker"
                                            value={addTraffickerData && addTraffickerData.is_trafficker && addTraffickerData.is_trafficker}
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })}>
                                            <option hidden={true}>Default select</option>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </Form.Select>
                                    </Form.Group>
                                    {/* <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Alias </Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.alias}
                                            name='alias'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group> ---commentend

                                    <Form.Group as={Col} md="12" className="form-group">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows="4"
                                            defaultValue={addTraffickerData && addTraffickerData.residential_address}
                                            name='residential_address'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            placeholder="Enter Address"
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="justify-content-between">
                                    <Form.Group as={Col} md="auto">
                                        <MDBBtn type='button' className="shadow-0 cancle_btn" color='danger'
                                            onClick={() => onCancel()}>Close</MDBBtn>
                                    </Form.Group>
                                    <Form.Group as={Col} md="auto">
                                        <Button type="submit"
                                            disabled={addTraffickerData && !addTraffickerData.trafficker_name ? true :
                                                !addTraffickerData.gender ? true : !addTraffickerData.age ? true :
                                                    false}
                                            className="submit_btn shadow-0" onClick={addUserFunc} >Submit</Button>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal> */}