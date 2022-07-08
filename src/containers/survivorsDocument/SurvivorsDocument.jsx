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
import { Button, Form, Row, Col } from "react-bootstrap";
import {
  getSurvivorDetails,
  getSurvivalDocList,
  getMasterDocList,
  getChangeLog
} from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from "../../components/NotificationPage";
import moment from "moment";
import "./survivordocument.css";
import DocDataTableFilter from "./DocDataTableFilter";

import AlertComponent from "../../components/AlertComponent";

const SurvivorsDocument = (props) => {
  const [modalInactiveShow, setmodalInactiveShow] = useState(false);
  const [modalAddShow, setModalAddShow] = useState(false);
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const survivalDocList = useSelector((state) => state.survivalDocList);
  const masterDocList = useSelector((state) => state.masterDocList);

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [validated, setValidated] = useState(false);
  const [resnValidated, setResnValidated] = useState(false);

  const [erorMessage, setErorMessage] = useState("");
  
const deletedById= localStorage.getItem("userId");
const deletedByRef = localStorage.getItem("role");


  const dispatch = useDispatch();

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
  const [addDocumentData, setAddDocumentData] = useState({});
  const [selectType, setSelectType] = useState("");
  const [aboutData, setAboutData] = useState("");
  const [selectFile, setSelectFile] = useState("");
  const [pictureData, setPictureData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [docId, setDocId] = useState("");
  const [reason, setReason] = useState({});
  const [inActiveClass, setInActiveClass] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messagType,setMessagType] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // initFilters1();
  }, [survivalDocList]);



  useEffect(() => {
    console.log(props.location && props.location.state);
    dispatch(getSurvivorDetails(props.location.state));
    dispatch(getSurvivalDocList(props.location.state));
    dispatch(getMasterDocList());
  }, [props]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const changeLogFunc=()=>{
    let type= "document"
    dispatch(getChangeLog(type,deletedById))
    props.history.push("/change-log")
  }
  

  const gotoAdd = () => {
    if(selectedData && !selectedData._id){
      alert("Please select one Document type")
    } else{
    // setSelectedData({});
    setActiveClass(false);
    setModalAddShow(true);
    }
  };

  ////// to split "_" and make camel case function ////////
  function capitalize(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  }

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
        "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
        formData,
        axiosConfig
      )
      .then(function (response) {
        console.log("successfully uploaded", response);
        if (response && response.data.error === false) {
          const { data } = response;
          setAddDocumentData({
            ...addDocumentData,
            file: "https://tafteesh-staging-node.herokuapp.com/" + data.data.filePath,
          });
          setPictureData(data.data.filePath);
          console.log(addDocumentData, pictureData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(survivalDocList, "survivalDocList");
  }, [survivalDocList]);


  const onSelectRow = (item) => {
    console.log(item,"item");
    setSelectedData(item);
    setActiveClass(true);
  };


  console.log(addDocumentData,"addDocumentData");
  useEffect(() => {
    console.log(selectedData,"selectedData");
    if(selectedData && selectedData._id)
    setAddDocumentData({
      ...addDocumentData,
      document_type:  selectedData.document_type &&
      selectedData.document_type._id,

    });
  }, [selectedData]);





  const handleSubmitDoc = (event) => {
    console.log(event,"habdleSubmit")
    // const {form}= event.target

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
    event.preventDefault();

      event.stopPropagation();

    } else{

      addDocumentFunc(event);
    }
    setValidated(true);


  }
  const addDocumentFunc = (e) => {
    e.preventDefault();
    
    var body = {
      survivor_profile: props.location && props.location.state,
      ...addDocumentData,
      user_id : deletedById && deletedById
    };

    axios
      .patch(api + "/survival-document/update/"+ selectedData._id, body, axiosConfig)
      .then((response) => {
        console.log(response);
        handleClick();
        setUpdateMessage(response && response.data.message);
        setMessagType("success")
        
        setValidated(false)

        if (response.data && response.data.error === false) {
          const { data } = response;
          dispatch(getSurvivalDocList(props.location.state));
          setModalAddShow(false);
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
    
  };
  ////// toggle Active/Inactive function /////

  const gotoReasonModal = (data) => {
    setmodalInactiveShow(true);
    setDocId(data._id);
  };

  const onCancel = () => {
    setModalAddShow(false);
  };


  const downloadFile = (data, fileName, fileType) => {
    console.log(data, fileName, fileType, "data, fileName, fileType ");
    var element = document.createElement("a");
    var file = new Blob([data], { type: "image/*" });
    console.log(file, "file");
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    element.click();
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Document");
    } else {
      setShowAlert(true);
    }
  };

  const onDeleteFunction = () => {
    
  let body ={
    deleted_by : deletedById && deletedById,
    deleted_by_ref: deletedByRef && deletedByRef
  }
    axios
      .patch(api +"/survival-document/delete/" + selectedData._id,body
      )
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getSurvivalDocList(props.location.state));
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };


  const handleSubmitReason = (event) => {
    console.log(event,"habdleSubmit")
    // const {form}= event.target

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
    event.preventDefault();

      event.stopPropagation();

    } else{

      addToggleInActiveFunc(event);
    }
    setResnValidated(true);


  }


  const addToggleInActiveFunc = (e) => {
    e.preventDefault();

    axios
      .patch(
        api + "/survival-document/toggle-active/" + docId,
        reason,
        axiosConfig
      )
      .then((response) => {
        console.log(response);
        handleClick();
        setUpdateMessage(response && response.data.message);
        setResnValidated(false)
        if (response.data && response.data.error === false) {
          const { data } = response;
          dispatch(getSurvivalDocList(props.location.state));
          setmodalInactiveShow(false);
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
  };

  // const addToggleInActiveFunc = (e) => {
  //     e.preventDefault();

  //     axios.patch(api + "/survival-document/toggle-active/"+docId,reason, axiosConfig)
  //         .then((response) => {
  //             console.log(response);
  //             handleClick();
  //             setUpdateMessage(response && response.data.message);

  //             if (response.data && response.data.error === false) {
  //                 const { data } = response;
  //                 dispatch(getSurvivalDocList(props.location.state));
  //                 setmodalInactiveShow(false);
  //             }
  //             else{
  //                 handleClick();
  //                 setUpdateMessage(response && response.data.message);
  //             }
  //         })
  //         .catch((error) => {
  //             console.log(error, "error");
  //             handleClick();
  //             setUpdateMessage(error && error.message);

  //         });

  // }


    //////////////// for csv function ////

    const downloadCSV = ({ data, fileName, fileType }) => {
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
    const formatDate = (value) => {
      //console.log(value, "value");
      // return value.toLocaleDateString('en-US', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric',
      // });
      return moment(value).format("DD-MMM-YYYY");
    };
  
    let exportData = [];
    survivalDocList.data?.map((x)=>{
      exportData.push({_id:x._id,survivor:survivorDetails?.survivor_name,about:x.about,active:x.active,docName:x.document_type.name,docId:x.document_type._id,file:x.file,createdAt:formatDate(x.createdAt)})
    })
    console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    const exportToCsv = e => {
      console.log(e, "e")
      e.preventDefault()
  
      // Headers for each column
      let headers = ['Id,Survivor,About,Active,Document Name,Document Id,File,createdAt']
  
      // Convert users data to a csv
      let usersCsv = exportData.reduce((acc, user) => {
        const { _id,survivor, about, active, docName, docId,file,  createdAt } = user
        acc.push([_id,survivor, about, active, docName, docId,file, createdAt])
        return acc
      }, [])
      console.log(usersCsv)
      downloadCSV({
        data: [...headers, ...usersCsv].join('\n'),
        fileName: 'DocList.csv',
        fileType: 'text/csv',
      })
    }
  
    ///download pdf/////
  
  console.log(survivalDocList.data,'survivaldoc')
  // console.log(Array.from(survivalDocList),'docccccccccccccccccc')

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
        "ID",
        "ABOUT",
        "IS ACTIVE",
        "DOCUMENT TYPE",
        "DOCUMENT ID",
        "File",
        "CREATED AT"
      ];
      const name = "survivor-document-list" + new Date().toISOString() + ".pdf";
      let goalsRows = [];
      survivalDocList.data.forEach((item) => {
        const temp = [
          item._id,
          item.about,
          item.active,
          item.document_type.name,
          item.document_type._id,
          item.file,
          moment(item.createdAt).format("DD/MM/YYYY"),
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
          type={messagType}
          message={updateMessage}
        />

        <div className="bodyright">
          <div className="row justify-content-between mb30">
            <div className="col-auto">
              <h2 className="page_title mb-3 mb-md-0">Survivor Documents</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Survivor Documents</MDBBreadcrumbItem>
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
                  <Dropdown.Item onClick={exportToCsv}>Export To CSV</Dropdown.Item>
                  <Dropdown.Item as={"a"} onClick={()=>changeLogFunc()} >
                    Change Log
                  </Dropdown.Item>
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
              {/* <MDBTooltip tag="a" wrapperProps={{ className: "edit_btn" }} title='Edit'>
                                <span onClick={() => gotoEdit()}>
                                    <i className="fal fa-pencil"></i>
                                </span>

                            </MDBTooltip> */}
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
            <DocDataTableFilter
              gotoReasonModal={gotoReasonModal}
              survivorDetails={survivorDetails && survivorDetails}
              survivalDocList={
                survivalDocList &&
                survivalDocList.data &&
                survivalDocList.data.length > 0 &&
                survivalDocList.data
              }
              onSelectRow={onSelectRow}
              isLoading={isLoading}
            />

            {/* <div
              className={
                survivalDocList &&
                survivalDocList.data &&
                survivalDocList.data.length > 5 &&
                "table-responsive medium-mobile-responsive"
              }
            >

              
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Document</th>
                    <th>File Name</th>
                    <th>Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {

                    survivalDocList &&
                    survivalDocList.data &&
                    survivalDocList.data.length > 0 ? (
                      survivalDocList.data.map((item) => {
                        return (
                          <tr
                            style={{ cursor: "pointer" }}
                            className={[
                              item._id === selectedData._id &&
                                activeClass === true &&
                                "current",
                            ]}
                            onClick={() => onSelectRow(item)}
                          >
                            <td>
                              {item &&
                                item.document_type &&
                                capitalize(item.document_type.name)}
                            </td>
                            <td>
                              {item &&
                                item.document_type &&
                                item.document_type.name}
                            </td>
                            <td>
                              <a
                                className="download__img"
                                style={{ cursor: "pointer" }}
                                href={item && item.file && item.file}
                              >
                                {item.file &&
                                  item.file &&
                                  survivorDetails &&
                                  survivorDetails.survivor_name &&
                                  survivorDetails.survivor_name + "_"}
                                {}
                                {item &&
                                  item.file &&
                                  item.file.split("_").pop()}
                              </a>
                              {item && item.fileName && item.fileName}
                            </td>
                            <td>
                              {item &&
                                item.updatedAt &&
                                moment(item.updatedAt).format("DD/MM/YYYY")}
                            </td>
                            {item && item.active === true ? (
                              <td className="text-end">
                                <Dropdown align="end" className="tablebutton">
                                  <Dropdown.Toggle
                                    variant="border-gray"
                                    className="shadow-0"
                                  >
                                    Action
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    <Dropdown.Item href="/#">
                                      Download
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      as="button"
                                      onClick={() => gotoReasonModal(item)}
                                    >
                                      Inactive
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            ) : (
                              <td></td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="text-center" colSpan={5}>
                          <b>NO Data Found !!</b>
                        </td>
                      </tr>
                    )
                  }
                </tbody>

                     survivalDocList &&  survivalDocList.isLoading ?
                     <tr>
                             <td colSpan={5} className='text-center'>
                                 <div class="spinner-border bigSpinner text-info"></div>
                            </td>
                         </tr>
                     :
              </table>
            </div> */}
          </div>
        </div>
      </main>

      <Modal
        dialogClassName={"inactivemodal"}
        show={modalInactiveShow}
        onHide={setmodalInactiveShow}
        size="md"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-box">
            <Form noValidate validated={resnValidated} onSubmit={handleSubmitReason}>
              <Form.Group className="mb-3"  controlId="validationCustom01">
                <Form.Control
                required
                  as="textarea"
                  rows="4"
                  name="inactive_reason"
                  onChange={(e) =>
                    setReason({
                      ...reason,
                      [e.target.name]: e.target.value,
                    })
                  }
                  placeholder="Enter the Reason"
                />
                <Form.Control.Feedback type="invalid">
              Please enter reason.
            </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="text-end">
                <Button
                  className="submit_btn shadow-0"
                  // disabled={reason && !reason.inactive_reason ? true : false}
                  // onClick={(e) => addToggleInActiveFunc(e)}
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

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
            Add Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form noValidate validated={validated} onSubmit={handleSubmitDoc}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Type 
                    {/* <span className="requiredStar">*</span> */}
                  </Form.Label>
                  <Form.Select
                    name="document_type"
                    value={
                      addDocumentData &&
                      addDocumentData.document_type 
                    }
                    disabled={true}
                    // onChange={(e) =>
                    //   setAddDocumentData({
                    //     ...addDocumentData,
                    //     document_type: e.target.value,
                    //   })
                    // }
                  >
                    <option hidden={true}>Default select</option>
                    {masterDocList &&
                      masterDocList.length > 0 &&
                      masterDocList.map((item) => {
                        return (
                          <option value={item && item._id}>
                            {item && item.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Document
                     {/* <span className="requiredStar">*</span> */}
                  </Form.Label>
                  <Form.Control
                    onChange={onDocumentChange}
                    type="file"
                    required
                    name="file"
                    size="lg"
                    // defaultValue={addDocumentData && addDocumentData.file && addDocumentData.file}
                  />
                    <Form.Control.Feedback type="invalid">
              Please add document.
            </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    About Document
                     {/* <span className="requiredStar">*</span> */}
                  </Form.Label>
                  <Form.Control
                  required
                    as="textarea"
                    rows="4"
                    name="about"
                    onChange={(e) =>
                      setAddDocumentData({
                        ...addDocumentData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    defaultValue={
                      addDocumentData &&
                      addDocumentData.about &&
                      addDocumentData.about
                    }
                    placeholder="Enter the Reason"
                  />
                    <Form.Control.Feedback type="invalid">
              Please enter about document.
            </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
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
                    // onClick={(e) => addDocumentFunc(e)}
                    className="submit_btn shadow-0"
                    // disabled={ !addDocumentData.file
                    //     ? true
                    //     : !addDocumentData.about
                    //     ? true
                    //     : false
                    // }
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

export default SurvivorsDocument;
