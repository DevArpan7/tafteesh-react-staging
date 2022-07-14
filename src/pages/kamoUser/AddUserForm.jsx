import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import { getBlockList, getDistrictList,getUsersList } from "../../redux/action";

const AddUserForm = (props) => {
  console.log(props, "add user form");
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const stateList = useSelector((state) => state.stateList);
  const districtList = useSelector((state) => state.districtList);
  const blockList = useSelector((state) => state.blockList);
  const roleList = useSelector((state) => state.roleList);
  const organizationList = useSelector((state) => state.organizationList);
  const shgList = useSelector((state) => state.shgList);
  const collectivesList = useSelector((state) => state.collectivesList);
  const [addUserData, setAddUserData] = useState({});
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const history = useHistory();
  const [pictureData, setPictureData] = useState({});
  const [trafficimage, setTrafficimage] = useState();
  const [fileSelect, setFileSelect] = useState("");

  const [erorMessage, setErorMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const [messagType, setMessagType] = useState("");
  const [fieldData, setFieldData] = useState({ field: "", message: "" });
  const [loader, setLoader] = useState(false);
  const { userId, data } = props;
  const [rolArr, setRolArr] = useState([]);
  console.log(userId, data, "userId");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    let arr =
      roleList &&
      roleList.length > 0 &&
      roleList.filter((data) => data.name != "Admin");
    setRolArr(arr);
  }, [roleList]);

  console.log(rolArr, "rolArr");
  const getDistrictListByState = (e) => {
    setAddUserData({
      ...addUserData,
      [e.target.name]: e.target.value,
    });
    dispatch(getDistrictList(e.target.value));
  };

  useEffect(() => {
    console.log(addUserData, "addUserData");
  }, [addUserData]);

  const getBlockListByDist = (e) => {
    setAddUserData({
      ...addUserData,
      [e.target.name]: e.target.value,
    });
    dispatch(getBlockList(addUserData.state, e.target.value));
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

  useEffect(() => {
    if (addUserData && addUserData.fname) {
      setFieldData({ field: "fname", message: "" });
    } else if (addUserData && addUserData.lname) {
      setFieldData({ field: "lname", message: "" });
    } else if (addUserData && addUserData.email) {
      setFieldData({ field: "email", message: "" });
    } else if (addUserData && addUserData.mobile) {
      setFieldData({ field: "mobile", message: "" });
    } else if (addUserData && addUserData.alternative_ph_no) {
      setFieldData({ field: "alternative_ph_no", message: "" });
    } else if (addUserData && addUserData.pin) {
      setFieldData({ field: "pin", message: "" });
    } else if (addUserData && addUserData.role) {
      setFieldData({ field: "role", message: "" });
    } else {
      setFieldData({ field: "", message: "" });
    }
  }, [addUserData]);

  const addUserFunc = (e) => {
    e.preventDefault();
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var phonPattern = new RegExp("^((\\+91-?)|0)?[0-9]{10}$")
    var pinPattern = new RegExp("^((\\+91-?)|0)?[0-9]{6}$")
    let isValid = true;
    const elment = document.getElementById("field-view");
    if (addUserData && !addUserData.fname) {
      setFieldData({
        field: "fname",
        message: "Please enter First Name",
      });
      
      window.scrollTo(10, elment.offsetTop);
    } else if (addUserData && !addUserData.lname) {
      setFieldData({
        field: "lname",
        message: "Please enter Last Name",
      });
      window.scrollTo(10, elment.offsetTop);
    } else if (addUserData && !addUserData.email) {
      setFieldData({
        field: "email",
        message: "Please enter Email Id",
      });
      window.scrollTo(9, elment.offsetTop);
    } else if (
      addUserData &&
      addUserData.email &&
      !pattern.test(addUserData.email)
    ) {
      setFieldData({ field: "email", message: "Please enter valid email Id." });
      window.scrollTo(9, elment.offsetTop);
      isValid = false;
    } else if (addUserData && !addUserData.mobile) {
      setFieldData({ field: "mobile", message: "Please enter Mobile no" });
      window.scrollTo(9, elment.offsetTop);
    } else if (addUserData && addUserData.mobile < 1000000000) {
      setFieldData({ field: "mobile", message: "Mobile no is invalid" });
      window.scrollTo(9, elment.offsetTop);
    }else if (addUserData && addUserData.mobile && !phonPattern.test(addUserData.mobile)) {
      setFieldData({ field: "mobile", message: "Mobile no is invalid" });
      window.scrollTo(9, elment.offsetTop);
    }
    else if (addUserData && addUserData.alternative_ph_no < 1000000000) {
      setFieldData({ field: "alternative_ph_no", message: "Mobile no is invalid" });
      window.scrollTo(9, elment.offsetTop);

    }else if (addUserData &&  addUserData.alternative_ph_no && !phonPattern.test(addUserData.alternative_ph_no)) {
      setFieldData({ field: "alternative_ph_no", message: "Mobile no is invalid" });
      window.scrollTo(9, elment.offsetTop);
    }
    else if (addUserData && addUserData.pin < 99999) {
      setFieldData({ field: "pin", message: "PIN no is invalid" });
      window.scrollTo(1, elment.offsetTop);
      
    }else if (addUserData && addUserData.pin && !pinPattern.test(addUserData.pin)) {
      setFieldData({ field: "pin", message: "PIN no is invalid" });
      window.scrollTo(1, elment.offsetTop);
      
    }

     else if (addUserData && !addUserData.role) {
      setFieldData({ field: "role", message: "Please select Role" });
    } else {
      setFieldData({ field: "", message: "" });

      var body = {
        ...addUserData,
        image: trafficimage && trafficimage,
      };

      if (userId) {
        setLoader(true);
        axios
          .patch(api + "/user/update-profile/" + userId, body, axiosConfig)
          .then((res) => {
            console.log(res);
            setLoader(false);

            if (res && res.data && res.data.error == false) {
              const { data } = res;
              setErorMessage("");
              handleClick();
              setUpdateMessage(res && res.data.message);
              setMessagType("success");
              console.log(data, res);
              dispatch({ type: "USERS_LIST", data: data });
              dispatch(getUsersList());
              history.push("/user-list");
            } else {
              handleClick();
              setMessagType("error");
              setUpdateMessage(res && res.data.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            setLoader(false);

            handleClick();
            setMessagType("error");
            setUpdateMessage(error && error.message);
          });
      } else {
        setLoader(true);

        axios
          .post(api + "/user/create", body, axiosConfig)
          .then((res) => {
            console.log(res);
            setLoader(false);
            if (res && res.data && res.data.error == false) {
              const { data } = res;
              setErorMessage("");
              handleClick();
              setMessagType("success");
              setUpdateMessage(res && res.data.message);
              console.log(data, res);
              dispatch(getUsersList());
              dispatch({ type: "USERS_LIST", data: data });
              history.push("/user-list");
            } else {
              handleClick();
              setMessagType("error");
              setUpdateMessage(res && res.data.data.message);
            }
          })
          .catch((error) => {
            setLoader(false);
            console.log(error);
            handleClick();
            setMessagType("error");
            setUpdateMessage(error && error.message);
          });
      }
    }
  };

  ///// api call for user details ./////////

  useEffect(() => {
    getUserDetails();
  }, [userId]);
  const getUserDetails = (id) => {
    console.log(id);
    axios
      .get(api + "/user/detail/" + userId, axiosConfig)
      .then((response) => {
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setAddUserData(data.data);
        }
      })
      .catch((error) => {
        console.log(error, "user details error");
      });
  };

  return (
    <>
      <Form id="field-view">
        <NotificationPage
          handleClose={handleClose}
          open={open}
          type={messagType}
          message={updateMessage}
        />
        <div className="white_box_shadow_20 survivorsFormCard mb-4">
          <h3 class="survivorsFormCardHeading">
            Personal Details<i class="fal fa-user-circle"></i>
          </h3>
          <Row>
            {/* <Form.Group className="form-group" as={Col} md="12" controlId="validationCustom01">
                            <Form.Label>User  No:</Form.Label>
                            <Form.Control
                                name="username"
                                onChange={(e) => setAddUserData({
                                    ...addUserData,
                                    [e.target.name]: e.target.value
                                })
                                }
                                required
                                type="text"
                                placeholder=""
                            />
                            <Form.Control.Feedback type="invalid">
                                User No. is a required field.
                            </Form.Control.Feedback>
                        </Form.Group> */}
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom02"
            >
              <Form.Label>
                First Name: <span className="requiredStar">*</span>
              </Form.Label>
              <Form.Control
                defaultValue={addUserData && addUserData.fname}
                name="fname"
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                type="text"
                placeholder=""
              /> {fieldData.field == "fname" && (
                <small className="mt-4 mb-2 text-danger">
                  {fieldData && fieldData.message}
                </small>
              )}
            </Form.Group>
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom03"
            >
              <Form.Label>
                Last Name <span className="requiredStar">*</span>
              </Form.Label>
              <Form.Control
                defaultValue={addUserData && addUserData.lname}
                name="lname"
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                type="text"
                placeholder=""
              /> {fieldData.field == "lname" && (
                <small className="mt-4 mb-2 text-danger">
                  {fieldData && fieldData.message}
                </small>
              )}
            </Form.Group>
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>
                E-mail <span className="requiredStar">*</span>
              </Form.Label>
              <Form.Control
                defaultValue={addUserData && addUserData.email}
                type="email"
                name="email"
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder=""
              />
              <div
                className="text-danger"
                style={{ fontSize: 12, marginTop: 5 }}
              >
              {fieldData.field == "email" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
              </div>
            </Form.Group>

            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>Gender:</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                name="gender"
                value={addUserData && addUserData.gender}
                aria-label="Default select example"
              >
                <option hidden="true">Open this select menu</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">Transgender</option>
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>
                Phone No <span className="requiredStar">*</span>
              </Form.Label>
              <Form.Control
                maxLength={10}
                type="text"
                name="mobile"
                defaultValue={addUserData && addUserData.mobile}
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder=""
                required
              />
              {fieldData.field == "mobile" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
            </Form.Group>
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>Alternate Phone number</Form.Label>
              <Form.Control
              maxLength={10}
                type="text"
                name="alternative_ph_no"
                defaultValue={addUserData && addUserData.alternative_ph_no}
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder=""
              />{fieldData.field == "alternative_ph_no" && (
                <small className="mt-4 mb-2 text-danger">
                  {fieldData && fieldData.message}
                </small>
              )}
            </Form.Group>
          </Row>
        </div>
        <div className="white_box_shadow_20 survivorsFormCard mb-4">
          <h3 className="survivorsFormCardHeading">
            Address
            <i class="fal fa-map-marker-alt"></i>
          </h3>
          <Row className="justify-content-between">
            {/* <Form.Group className="form-group" as={Col} md="12" controlId="validationCustom04">
                            <h3 className='forminnertitle'>Address</h3>
                        </Form.Group> */}
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>State:</Form.Label>
              <Form.Select
                onChange={getDistrictListByState}
                name="state"
                value={
                  addUserData && addUserData.state && addUserData.state._id
                }
                aria-label="Default select example"
              >
                <option hidden="true">Open this select menu</option>
                {stateList &&
                  stateList.length > 0 &&
                  stateList.map((data) => {
                    return <option value={data._id}>{data.name}</option>;
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>District:</Form.Label>
              <Form.Select
                onChange={getBlockListByDist}
                name="district"
                value={
                  addUserData &&
                  addUserData.district &&
                  addUserData.district._id
                }
                aria-label="Default select example"
              >
                <option hidden="true">Open this select menu</option>
                {districtList &&
                  districtList.length > 0 &&
                  districtList.map((data) => {
                    return <option value={data._id}>{data.name}</option>;
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>Panchayat/Block Name:</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                name="block"
                value={
                  addUserData && addUserData.block && addUserData.block._id
                }
                aria-label="Default select example"
              >
                <option hidden="true">Open this select menu</option>
                {blockList &&
                  blockList.length > 0 &&
                  blockList.map((data) => {
                    return <option value={data._id}>{data.name}</option>;
                  })}
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>Pin:</Form.Label>
              <Form.Control
                defaultValue={addUserData && addUserData.pin && addUserData.pin}
                type="text"
                maxLength={6}
                name="pin"
                placeholder=""
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
              {fieldData.field == "pin" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
            </Form.Group>
          </Row>
        </div>
        <div className="white_box_shadow_20 survivorsFormCard mb-4">
          <h3 className="survivorsFormCardHeading">
            Legal Info
            <i class="fal fa-gavel"></i>
          </h3>
          <Row className="justify-content-between">
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>Select Type of Organizations:</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                value={
                  addUserData &&
                  addUserData.organization_type &&
                  addUserData.organization_type
                }
                name="organization_type"
                aria-label="Default select example"
              >
                <option hidden="true">Open this select menu</option>
                {/* <option value="1">Partner</option> */}
                <option value="organizations">Organizations</option>
                <option value="collectives">Collectives</option>
                <option value="shg">Self help Group</option>
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>Name of Organizations:</Form.Label>
              <Form.Select
                value={
                  addUserData &&
                  addUserData.organization &&
                  addUserData.organization._id
                }
                name="organization"
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                disabled={
                  addUserData && addUserData.organization_type ? false : true
                }
                aria-label="Default select example"
              >
                <option hidden="true">Open this select menu</option>
                {addUserData &&
                addUserData.organization_type === "organizations"
                  ? organizationList &&
                    organizationList.data &&
                    organizationList.data.length > 0 &&
                    organizationList.data.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })
                  : addUserData &&
                    addUserData.organization_type === "collectives"
                  ? collectivesList &&
                    collectivesList.data &&
                    collectivesList.data.length > 0 &&
                    collectivesList.data.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })
                  : addUserData &&
                    addUserData.organization_type === "shg" &&
                    shgList &&
                    shgList.data &&
                    shgList.data.length > 0 &&
                    shgList.data.map((data) => {
                      return <option value={data._id}>{data.name}</option>;
                    })}
              </Form.Select>
              
            </Form.Group>
            <Form.Group
              className="form-group"
              as={Col}
              md="6"
              controlId="validationCustom04"
            >
              <Form.Label>
                Select Role: <span className="requiredStar">*</span>
              </Form.Label>
              <Form.Select
                value={addUserData && addUserData.role && addUserData.role._id}
                name="role"
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    [e.target.name]: e.target.value,
                  })
                }
                aria-label="Default select example"
              >
                <option value={""} hidden="true">
                  Open this select menu
                </option>
                {rolArr &&
                  rolArr.length > 0 &&
                  rolArr.map((data) => {
                    return <option value={data._id}>{data.name}</option>;
                  })}
              </Form.Select>
              {fieldData.field == "role" && (
                      <small className="mt-4 mb-2 text-danger">
                        {fieldData && fieldData.message}
                      </small>
                    )}
            </Form.Group>
            <Form.Group as={Col} md="6" className="mb-3">
              <Form.Label>Document</Form.Label>
              <Form.Control
                onChange={handleFileInput}
                type="file"
                name="file"
                size="lg"
                // defaultValue={addDocumentData && addDocumentData.file && addDocumentData.file}
              />
            </Form.Group>
          </Row>
          {/* </div>

                <div className="white_box_shadow_20"> */}
          {/* <Row className="justify-content-between">
                        <h3 className='forminnertitle mb-4'>Set Access</h3>
                        <div className="survivors_table_wrap survivors_table_wrap_gap position-relative mb-4">
                            <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="40%">List of Survivor</th>
                                        <th width="20%"><label className='viewhead'>View</label></th>
                                        <th width="20%"><label className='edithead'>Edit</label></th>
                                        <th width="20%"><label className='deletehead'>Delete</label></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>VC</td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>PC</td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>FIR</td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Chargesheet</td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Master Data</td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                className='switchOnOff'
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Row> */}
        </div>
        <Row className="justify-content-between">
          <Form.Group as={Col} xs="auto">
            <Link to="/user-list" className="text-uppercase cancle_btn">
              Cancel
            </Link>
          </Form.Group>
          <Form.Group as={Col} xs="auto">
            <Button
              className="submit_btn text-uppercase"
              disabled={loader == true ? true : false}
              onClick={addUserFunc}
              type="submit"
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
    </>
  );
};

export default AddUserForm;
