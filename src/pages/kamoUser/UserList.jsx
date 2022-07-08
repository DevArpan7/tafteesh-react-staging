import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { Modal, Button } from "react-bootstrap";

import { MDBTooltip } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import {
  getUsersList,
  usersSearchApi,
  getOrganizationList,
  getRoleList,
} from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import CsvImportPage from "../../components/CsvImportPage";
import Papa from "papaparse";
import UserListDataTableList from "./UserListDataTable";
import AlertComponent from "../../components/AlertComponent";
import { findAncestor,goToUserAdd,goToUserDetail} from "../../utils/helper";

const UserList = (props) => {
  const [modalAddShow, setModalAddShow] = useState(false);

  const api = "https://kamo-api.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`, 
    },
  };

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const dispatch = useDispatch();
  const usersList = useSelector((state) => state.usersList);
  const organizationList = useSelector((state) => state.organizationList);
  const roleList = useSelector((state) => state.roleList);

  const [activeClass, setActiveClass] = useState(false);
  const [userId, setUserId] = useState("");
  const [flag, setFlag] = useState("");
  const history = useHistory();
  const [searchData, setSearchData] = useState({});

  useEffect(() => {
    dispatch(getUsersList());
    dispatch(getOrganizationList());
    dispatch(getRoleList());
  }, [props]);

  /////// user search api /////////

  useEffect(() => {
    if (searchData && searchData.searchText) {
      dispatch(usersSearchApi(searchData));
    }
  }, [searchData]);


  console.log(userId,"userId")
  const onSelectRow = (id) => {
    console.log(id);
    setActiveClass(true);
    setUserId(id);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const goToEdit = (e) => {
    setFlag(e);
    console.log("go to update user", userId);
    history.pushState({ pathname: "/add-user", data: userId });
  };

  // const goToUserAdd=(e)=>{
  //   goToUserAdd(e,userId,history)
  // }
  const [isLoading,setIsLoading] = useState(true)
  useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }, [usersList]);

  console.log(props, usersList, "prrrrrooppssss");

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (!userId) {
      alert("Please select one User");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = (e) => {
    e.preventDefault();
    axios
      .patch(api + "/user/delete/" + userId, axiosConfig)
      .then((response) => {
        console.log(response);
      
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          // setUserDetails(data.data);
          dispatch(getUsersList());
          setUserId('')
          setShowAlert(false);
        }
      })
      .catch((error) => {
        setModalAddShow(false);

        console.log(error, "user details error");
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
      "Id,User Name, First Name, Last Name,Email,Gender,Mobile,Organization,Role",
    ];

    // Convert users data to a csv
    let usersCsv = usersList.reduce((acc, user) => {
      const {
        _id,
        username,
        fname,
        lname,
        email,
        gender,
        mobile,
        organization,
        role,
      } = user;
      acc.push(
        [
          _id,
          username,
          fname,
          lname,
          email,
          gender,
          mobile,
          organization.name,
          role.name,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "users.csv",
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
      fname: "Ankit",
      lname: "Kumar",
      email: "ankit@mail.com",
      gender: "male",
      mobile: "6790987654",
      organization: "62a9b276c05c6a1059f92f22",
      role: "6220946e782030497a18f164",
    },
  ]);

  const onImportCsv = () => {
    setImportCsvOpenModel(!importCsvOpenModel);
  };
  const downloadSampleCsv = (e) => {
    let headers = ["FirstName,LastName,Email,Gender,Mobile,Organization,Role"];

    // Convert users data to a csv
    let usersCsv = sampleArr.reduce((acc, user) => {
      const { fname, lname, email, gender, mobile, organization, role } = user;
      acc.push(
        [fname, lname, email, gender, mobile, organization, role].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...usersCsv].join("\n"),
      fileName: "users.csv",
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
            fname: item && item.FirstName,
            lname: item && item.LastName,
            email: item && item.Email,
            gender: item && item.Gender,
            mobile: item && item.Mobile,
            organization: item && item.Organization,
            role: item && item.Role,
          }),
          console.log(obj, "obj"),
          axios
            .post(api + "/user/create", obj, axiosConfig)
            .then((response) => {
              console.log(response);
              handleClick();
              setUpdateMessage(response && response.data.message);
              if (response.data && response.data.error === false) {
                const { data } = response;
                dispatch(getUsersList());
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
              <h2 className="page_title">User List</h2>
            </div>
            <div className="col-auto">
              <Form>
                <Row className="align-items-center">
                  <Form.Group className="shortboxTitle" as={Col} md="auto">
                    <h6 className="mb-0">Short By</h6>
                  </Form.Group>
                  <Form.Group className="shortboxSelect" as={Col} md="auto">
                    <Form.Select
                      name="searchText"
                      onChange={(e) =>
                        setSearchData({
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={true}>Select Category</option>
                      {roleList &&
                        roleList.length > 0 &&
                        roleList.map((role) => {
                          return (
                            <option value={role && role._id}>
                              {role && role.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="shortboxSelect" as={Col} md="auto">
                    <Form.Select
                      name="searchText"
                      onChange={(e) =>
                        setSearchData({
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option hidden={true}>Select Organization</option>
                      {organizationList &&
                        organizationList.data &&
                        organizationList.data.length > 0 &&
                        organizationList.data.map((org) => {
                          return (
                            <option value={org && org._id}>
                              {org && org.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                </Row>
              </Form>
            </div>
          </div>
          <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin  position-relative">
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
                tag={"a"}
                wrapperProps={{ className: "view_btn" }}
                title="View"
              >
                <span onClick={(e)=> goToUserDetail(e,userId,history)}> 
                  <i className="fal fa-eye"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag={"a"} 
                wrapperProps={{
                  // to: { pathname: "/add-user", data: userId },
                  className: "edit_btn",
                }}
                // wrapperProps={{ to: '/add-user', className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={(e)=> goToUserAdd(e,userId,history)}> 
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
            <UserListDataTableList 
              usersList={usersList && usersList.length > 0 &&
                usersList}
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />
            {/* <div className="table-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Username</th>
                    <th width="15%">Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList && usersList.length > 0 ? (
                    usersList.map((data) => {
                      return (
                        <tr
                          className={[
                            data._id === userId &&
                              activeClass === true &&
                              "current",
                          ]}
                          onClick={() => onSelectRow(data._id)}
                        >
                          <td>{data && data.role && data.role.name}</td>
                          <td>{data && data.email && data.email}</td>
                          <td>{data && data.mobile && data.mobile}</td>
                          <td>{data && data.username && data.username}</td>
                          <td>
                            {data &&
                              data.organization &&
                              data.organization.name}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={5}>
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
        {/* <Modal
          className="addFormModal"
          show={modalAddShow}
          onHide={setModalAddShow}
          size="lg"
          aria-labelledby="reason-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Document
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="site_form_wraper">
              <Form>
                <Row>
                  <p>{"Are you sure you want to delete this role ???"}</p>
                </Row>
                <Row className="justify-content-between">
                  <Form.Group as={Col} md="auto">
                    <Button
                      className="shadow-0 cancle_btn"
                      color="danger"
                      onClick={() => setModalAddShow(false)}
                    >
                      Close
                    </Button>
                  </Form.Group>
                  <Form.Group as={Col} md="auto">
                    <Button
                      onClick={onDeleteFunc}
                      type="submit"
                      className="submit_btn shadow-0"
                    >
                      Submit
                    </Button>
                  </Form.Group>
                </Row>
              </Form>
            </div>
          </Modal.Body>
        </Modal> */}
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

export default UserList;
