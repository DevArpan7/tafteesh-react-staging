import React, { useState, useEffect, useRef } from "react";
import { Topbar, SurvivorTopCard } from "../../components";

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
import { MultiSelect } from "react-multi-select-component";
import "./survivorsupplimentarychargesheet.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorDetails,
  getFirList,
  getTraffickerList,
  getChargeSheetList,
  getChargeSheetListByFirIdandInvestId,
  getSupplimentaryChargeSheetList,
  getActList
} from "../../redux/action";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";
import SupplimentaryChargesheetDataTable from "./SupplimentaryChargesheetDataTable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DatePicker from "../../components/DatePicker";

const SurvivorSupplimentaryChargesheet = (props) => {
  console.log(props,'props]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]')
  const [modalChargesheetShow, setModalChargesheetShow] = useState(false);
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const traffickerList = useSelector((state) => state.traffickerList);
  // const supplimentaryChargeSheetList = useSelector((state) => state.supplimentarychargeSheetList);
  const chargeSheetList = useSelector((state) => state.chargeSheetList);
  const actList = useSelector((state) => state.actList);
console.log(actList,'acttttttttttttttttttt')

  const firList = useSelector((state) => state.firList);

  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [addChargeSheetData, setAddChargeSheetData] = useState({});
  const [chargeSheetObj, setCahrgeSheetObj] = useState({});
  const [firObj, setFirObj] = useState({});
  const [accusedincludedArr, setAccusedincludedArr] = useState([]);
  const [sendAccusedincludedArr, setSendAccusedincludedArr] = useState([]);
  const [accusedNotIncludedObj, setAccusedNotIncludedObj] = useState({});
  const [accusedNotIncludedArr, setAccusedNotIncludedArr] = useState([]);
  const [sectionArrbyFir, setSectionArrbyFir] = useState([]);
  const [addSectionObj, setAddSectionObj] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [updateChargeSheetData, setUpdateChargeSheetData] = useState({});
  const [selectedFir, setSelectedFir] = useState({});
  const [sendaccusedNotincludedArr, setSendAccusedNotincludedArr] = useState(
    {}
  );
  const formRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);
  const [erorMessage, setErorMessage] = useState("");


  const deletedById = localStorage.getItem("userId");
  const deletedByRef = localStorage.getItem("role");
  const [supplimentaryChargeSheetList, setSupplimentaryChargeSheetList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)


  const fetchAllSupplimentaryChargesheetList = (id) => {
    console.log(id,'idddddddddddddddddddddddddddddddddddddddddddddd')
    var axios = require('axios');
    var config = {
      method: 'get',
      url: `${api}/supplimentary-chargesheet/list/${id}`,
      headers: {}
    };
    axios(config)
      .then(function (response) {
        console.log(response.data.data, 'suppppppppppppppppppp response')
        console.log(id)
        // if (response.data.error == false) {
          setSupplimentaryChargeSheetList(response.data.data);
        //   setIsLoaded(true)
        // }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  console.log(supplimentaryChargeSheetList)
  const [sectionList,setSectionList] = useState([])
  const fetchAllSectionListById = (id) => {
    console.log(id,"iiiiii")
    var axios = require('axios');

    var config = {
      method: 'get',
      url: `${api}/section/list/${id}`,
      headers: {}
    };
    axios(config)
      .then(function (response) {
        console.log(response, 'sectionnnnnnnnnn response')
        console.log(id)
        if (response.data.error == false) {
          // setSupplimentaryChargeSheetList(response.data.data);
          // setIsLoaded(true)
          setSectionList(response.data.data)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  console.log(sectionList,'sectionListtttttttttttttt')
  useEffect(() => {
    console.log(props.location.state, 'locationnnnnnnnnnnnnnnnnnnnnn')
    fetchAllSupplimentaryChargesheetList(props.location.state)
    dispatch(getActList())
    // dispatch(getSupplimentaryChargeSheetList(props.location.state))
  }, [props]);
  console.log(supplimentaryChargeSheetList)
  console.log(survivorDetails,'hiiiiiiiiiiiiiiii')
  /////// notification open function //////
  const handleClick = () => {
    setOpen(true);
  };
  ////// notification close function ///////
  const handleClose = () => {
    setOpen(false);
  };

  //// on celect row function /////
  const onSelectRow = (e) => {
    console.log(e);
    setSelectedData(e);
    setActiveClass(true);
  };

  // add charge sheet modal open/////
  const gotoAdd = () => {
    setModalChargesheetShow(true);
  };

  /////// go to edit modal open function//////

  const gotoEdit = (e) => {
    setModalChargesheetShow(true);
    setUpdateChargeSheetData(selectedData);
    console.log(selectedData,'selectedddddddddddddddddd')
  };

  //////// delete function call //////////
  const onDeleteChangeFunc = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select one Chargesheet");
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
      .patch(api + "/supplimentary-chargesheet/delete/" + selectedData._id, body)
      .then((response) => {
        handleClick();
        setUpdateMessage(response && response.data.message);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSelectedData({})
          // dispatch(getChargeSheetList(props.location && props.location.state));
          fetchAllSupplimentaryChargesheetList(props.location.state)
          setShowAlert(false);
          setErorMessage("");
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };

  ///////// on cancel button function ///////
  const onCancel = (e) => {
    setAddChargeSheetData({});
    setAccusedNotIncludedArr([]);
    setAccusedNotIncludedObj({});
    setAccusedincludedArr([]);
    setCahrgeSheetObj({});
    setSectionArrbyFir([]);
    setUpdateChargeSheetData({});
    setModalChargesheetShow(false);
    setActiveClass(false);
    setFirObj({});
  };

  /////// onchange function of charge sheet date and charge sheet number ////
  const onChargeSheetChange = (e) => {
    console.log(e);
    setCahrgeSheetObj({
      [e.target.name]: e.target.value,
    });
  };
  console.log(chargeSheetObj, "chargeSheetObj");

  //////// onchange function of fir number and date select //////
  const [selectedAct,setSelectedAct] = useState()
  const onActChange = (e) =>{
    console.log(e.target.value,'selected actttttttttttttt')
    setSelectedAct(e.target.value)
    fetchAllSectionListById(e.target.value)
  }


  
 useEffect(()=>{
  //  console.log(updateChargeSheetData && updateChargeSheetData.act._id,"updateChargeSheetData")
   if(updateChargeSheetData && updateChargeSheetData.act){
    fetchAllSectionListById(updateChargeSheetData && updateChargeSheetData.act && updateChargeSheetData.act_id)
    setSelectedSection(updateChargeSheetData && updateChargeSheetData.section && updateChargeSheetData.section._id)

   }
 },[updateChargeSheetData])
const [selectedSection,setSelectedSection] = useState()
  const onSectionChange = (e) => {
   
    setSelectedSection(e.target.value)
  };
 
  //////// add charge sheet api call function //////

  const addChargeSheetFunc = (e) => {
    e.preventDefault();
    const tempData = {
      survivor:survivorDetails._id,
      survivor_chargesheet: props.location.state,
      ...addChargeSheetData,
      act:selectedAct,
      section:selectedSection,
      ...chargeSheetObj
    };

    var body = tempData;
console.log(survivorDetails)
    if (updateChargeSheetData && updateChargeSheetData._id) {
      axios
        .patch(
          api + "/supplimentary-chargesheet/update/" + updateChargeSheetData._id,
          body,
          axiosConfig
        )
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);

          if (res && res.data && res.data.error == false) {
            const { data } = res;
            console.log(data, res);
            fetchAllSupplimentaryChargesheetList(props.location.state);
            setModalChargesheetShow(false);
            setAddChargeSheetData({});
            setAccusedNotIncludedArr([]);
            setAccusedincludedArr([]);
            setCahrgeSheetObj({});
            setSectionArrbyFir([]);
            setActiveClass(false);
            setFirObj({});
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post(api + "/supplimentary-chargesheet/create", body, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setAddChargeSheetData({});

          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error == false) {
            const { data } = res;
            console.log(data, res);
            fetchAllSupplimentaryChargesheetList(props.location.state);
            setModalChargesheetShow(false);
            setAddChargeSheetData({});
            setAccusedNotIncludedArr([]);
            setAccusedincludedArr([]);
            setCahrgeSheetObj({});
            setSectionArrbyFir([]);
            setActiveClass(false);
            setFirObj({});
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    console.log(body,'bodyyyyyyyyyyyyyyyyyyyyyy')
  };
  // console.log(supplimentaryChargeSheetList, 'supppppppppppppplimentaaaaaaaaaaary')
  //export csv function///

  //  console.log(chargeSheetList,'firrrrrrrrrrrrrr')

  let exportData = []
  supplimentaryChargeSheetList  && supplimentaryChargeSheetList.length > 0 && supplimentaryChargeSheetList.map((x, index) => {
    exportData = [...exportData,{survivor:survivorDetails && survivorDetails.survivor_name,chargesheet:props.location.state, supplimentarychargesheetDate: moment(x.date).format("DD-MMM-YYYYY"), supplimentarychargesheetNumber: x.supplimentary_chargesheet_number, section: x.section.number, act: x.act.name,createdAt: moment(x.createdAt).format("DD-MMM-YYYY")}]
  })
   console.log(exportData,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
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
  console.log(chargeSheetObj,'chargeSheetObj')
  const exportToCsv = e => {
    e.preventDefault()

    // Headers for each column
    let headers = ['survivor,ChargesheetNumber,Date,SupplimentaryChargesheetNumber,Section,Act,CreatedAt']

    // Convert users data to a csv
    let usersCsv = exportData.reduce((acc, user) => {
      const {survivor, chargesheet, supplimentarychargesheetDate, supplimentarychargesheetNumber, section, act,createdAt } = user
      acc.push([survivor, chargesheet, supplimentarychargesheetDate, supplimentarychargesheetNumber, section, act, createdAt].join(','))
      return acc
    }, [])

    downloadFile({
      data: [...headers, ...usersCsv].join('\n'),
      fileName: 'SupplimentarychargesheetList.csv',
      fileType: 'text/csv',
    })
  }

  const downloadPdf = ()=>{
    const doc = new jsPDF({
      orientation: "landscape",
    });
    
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("SURVIVOR DETAILS", 22, 10);
    doc.setFontSize(10);
    doc.text("SURVIVOR NAME:", 22, 20);
    doc.text(survivorDetails?.survivor_name, 60, 20);
    doc.text("SURVIVOR ID", 22, 40);
    doc.text(survivorDetails?.survivor_id, 60, 40);

    doc.setFontSize(20);
    doc.text("SURVIVOR PROCEDURAL CORRECTION LIST", 22, 60);
    doc.setFontSize(10);
    const survivorColumns = [
      "Survivor","ChargesheetNumber","Date","SupplimentaryChargesheetNumber","Section","Act","CreatedAt"
      
    ];
    const name = "survivor-suplimentarychargesheet-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    exportData?.forEach((item) => {
      const temp = [item.survivor, item.chargesheet, item.supplimentarychargesheetDate, item.supplimentarychargesheetNumber, item.section, item.act, item.createdAt
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
              <h2 className="page_title">Supplimentary Chargesheet</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Supplimentary Chargesheet</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails && survivorDetails} />
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            {props && props.location && props.location.flag === "fromSurvivor" ?
              <></>
              :
              <div className="vieweditdelete">
                <Dropdown className="me-1">
                  <Dropdown.Toggle variant="border" className="shadow-0">
                    Action
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(e)=> downloadPdf(e)}>Download PDF</Dropdown.Item>
                    <Dropdown.Item onClick={exportToCsv}>Export To CSV</Dropdown.Item>
                    {/* <Dropdown.Item href="/#">Change Log</Dropdown.Item> */}
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
                  <span onClick={(e) => gotoEdit(e)}>
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
            }
            <SupplimentaryChargesheetDataTable
              chargeSheetList={supplimentaryChargeSheetList && supplimentaryChargeSheetList.length > 0 && supplimentaryChargeSheetList}
              onSelectRow={onSelectRow}
            />
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalChargesheetShow}
        onHide={setModalChargesheetShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           {updateChargeSheetData && updateChargeSheetData ? "Update Supplimentary Chargesheet" :"Add Supplimentary Chargesheet"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Date <span className="requiredStar">*</span>
                  </Form.Label>
                  {/* <Form.Control
                    type="date"
                    name="date"
                    onChange={onChargeSheetChange}
                    value={
                      chargeSheetObj &&
                      chargeSheetObj.date &&
                      moment(chargeSheetObj.date).format("YYYY-MM-DD")
                    }
                    placeholder="Date of Birth"
                  /> */}
                  <DatePicker 
                    required
                    message={"Please enter date."} 
                    name="date"
                    datePickerChange={onChargeSheetChange} 
                    data={chargeSheetObj && chargeSheetObj.date ? chargeSheetObj.date : updateChargeSheetData && updateChargeSheetData.date }
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                  Supplimentary Chargesheet Number
                    <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    name="supplimentary_chargesheet_number"
                    defaultValue={
                      chargeSheetObj &&
                      chargeSheetObj.supplimentary_chargesheet_number ? chargeSheetObj.supplimentary_chargesheet_number : updateChargeSheetData && updateChargeSheetData.supplimentary_chargesheet_number
                    }
                    type="text"
                    onChange={(e) =>
                      setAddChargeSheetData({
                        ...addChargeSheetData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>
                    Act Name <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Select
                    name="act"
                    onChange={onActChange}
                    // value={firObj && firObj._id && firObj._id}
                    value={selectedAct ? selectedAct  : updateChargeSheetData && updateChargeSheetData.act && updateChargeSheetData.act._id}
                  >
                    <option hidden={true}>Select Act</option>
                    {actList &&
                      actList.length > 0 &&
                      actList.map((data) => {
                        return (
                          <option value={data && data._id}>
                            {data && data.name}{" "}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>
                          Section <span className="requiredStar">*</span>
                        </Form.Label>
                        <Form.Select
                          name="section_number"
                          onChange={onSectionChange}
                          value={selectedSection}
                        >
                          <option hidden={true}>Select Section</option>
                          {sectionList &&
                      sectionList.length > 0 &&
                      sectionList.map((data) => {
                        return (
                          <option value={data && data._id}>
                            {data && data.number}{" "}
                          </option>
                        );
                      })}
                        </Form.Select>
                      </Form.Group>
                
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={(e) => onCancel(e)}
                  >
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button
                    type="submit"
                    onClick={(e) => addChargeSheetFunc(e)}
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

export default SurvivorSupplimentaryChargesheet;
