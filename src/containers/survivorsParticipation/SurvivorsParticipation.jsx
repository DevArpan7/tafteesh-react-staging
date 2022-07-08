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
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import { NavLink, useHistory } from "react-router-dom";
import { getParticipationList, getSurvivorDetails } from "../../redux/action";
import moment from "moment";

const SurvivorsParticipation = (props) => {
  const [modalParticipationShow, setModalParticipationShow] = useState(false);
  const [participationData, setParticipationData] = useState({});
  const participationList = useSelector((state) => state.participationList);
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const [activeClass, setActiveClass] = useState(false);

  const [open, setOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const dispatch = useDispatch();
  const [survivorId, setSurvivorId] = useState('')
  const [selectedData, setSelectedData] = useState({});
  const api = "https://kamo-api.herokuapp.com/api/survival-participation";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(participationList, "participationList", props, "props");
  const onCancel = () => {
    setModalParticipationShow(false);
    setParticipationData({})
    setSelectedData({});

  }

  useEffect(() => {
    setSurvivorId(props.location && props.location.state)
    console.log()
    dispatch(getParticipationList(props.location && props.location.state));
    dispatch(getSurvivorDetails(props.location && props.location.state));
  }, [props]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSelectRow = (item) => {

    setSelectedData(item);
    setActiveClass(true);

  }

  const gotoEdit = () => {
    setParticipationData(selectedData)
    setModalParticipationShow(true);
  }


  const addParticipation = (e) => {
    e.preventDefault();
    let body = {
      ...participationData,
      "survivor": survivorId && survivorId
    }
    if (participationData && participationData._id) {


      axios
        .patch(api + "/update/" + participationData._id, body, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          setParticipationData({})
          if (res && res.data && res.data.error == false) {

            const { data } = res;

            console.log(data, res);
            // dispatch({ type: "PARTICIPATION_LIST", data: data });
            dispatch(getParticipationList(survivorId));
            setModalParticipationShow(false)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post(api + "/create", body, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          setParticipationData({})
          if (res && res.data && res.data.error == false) {

            const { data } = res;

            console.log(data, res);
            // dispatch({ type: "PARTICIPATION_LIST", data: data });
            dispatch(getParticipationList(data.data.survivor));
            setModalParticipationShow(false)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  //////////////// for csv function ////

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
  const formatDate = (value) => {
    //console.log(value, "value");
    // return value.toLocaleDateString('en-US', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    // });
    return moment(value).format("DD-MMM-YYYY");
  };


  const exportToCsv = e => {
    console.log(e, "e")
    e.preventDefault()

    // Headers for each column
    let headers = ['Id,Survivor,Meeting Date,Survivor Participation,Family Support,Who Support Legal,createdAt']

    // Convert users data to a csv
    let usersCsv = participationList.reduce((acc, user) => {
      const { _id, survivor, meeting_date, participation, family_support, support_from_family_to_persue_case, createdAt } = user
      acc.push([_id, survivor, formatDate(meeting_date), participation, family_support, support_from_family_to_persue_case, formatDate(createdAt)].join(','))
      return acc
    }, [])
    console.log(usersCsv)
    downloadFile({
      data: [...headers, ...usersCsv].join('\n'),
      fileName: 'participationList.csv',
      fileType: 'text/csv',
    })
  }

  ///download pdf/////


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
      "MEETING DATE",
      "SURVIVOR PARTICIPATION",
      "FAMILY SUPPORT",
      "WHO SUPPORT LEGALLY",
      "CREATED AT"
    ];
    const name = "survivor-participation-list" + new Date().toISOString() + ".pdf";
    let goalsRows = [];
    participationList?.forEach((item) => {
      const temp = [
        item._id,
        moment(item.meeting_date).format("DD/MM/YYYY"),
        item.participation,
        item.family_support,
        item.support_from_family_to_persue_case,
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
        <NotificationPage handleClose={handleClose} open={open} message={updateMessage} />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Survivor Participation</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>
                  Survivor Participation
                </MDBBreadcrumbItem>
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
                  <Dropdown.Item onClick={(e) => exportToCsv(e)}>Export To CSV</Dropdown.Item>
                  <Dropdown.Item href="/#">Change Log</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add">
                <span onClick={() => setModalParticipationShow(true)}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"

                wrapperProps={{ className: "edit_btn" }}
                title="Edit">
                <span onClick={() => gotoEdit()}>
                  <i className="fal fa-pencil"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "delete_btn" }}
                title="Delete">
                <i className="fal fa-trash-alt"></i>
              </MDBTooltip>
            </div>
            <div className="table-responsive big-desktop-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="8%">Meeting Date</th>
                    <th width="15%">Survivor's Participation</th>
                    <th width="8%">Family Support</th>
                    <th width="12%">Who Supplort Legal</th>
                    {/* <th width="15%">Notes</th>
                    <th width="10%">
                      Meeting By <span>(Social Worker)</span>
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {participationList && participationList.length > 0 ? participationList.map((item) => {
                    return (
                      <tr
                        className={[item._id === selectedData._id && activeClass === true && 'current']} onClick={() => onSelectRow(item)}
                      >
                        <td>{item && item.meeting_date && moment(item.meeting_date).format("DD/MM/YYYY")}</td>
                        <td>{item && item.participation && item.participation}</td>
                        <td>{item && item.family_support && item.family_support}</td>
                        <td>{item && item.support_from_family_to_persue_case && item.support_from_family_to_persue_case}</td>
                        {/* <td>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                          Exercitationem iste culpa.
                        </td>
                        <td>Lorem ipsum dolor sit amet,</td> */}
                      </tr>
                    )
                  }) :

                    <tr>
                      <td className="text-center" colSpan={4}>
                        <b>NO Data Found !!</b>
                      </td>
                    </tr>
                  }

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalParticipationShow}
        onHide={setModalParticipationShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Participation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Meeting date <span className="requiredStar">*</span></Form.Label>
                  <Form.Control
                    value={participationData && participationData.meeting_date && moment(participationData.meeting_date).format("YYYY-MM-DD")}
                    onChange={(e) => setParticipationData({
                      ...participationData,
                      [e.target.name]: e.target.value
                    })}
                    type="date"
                    name="meeting_date"
                    placeholder="Date of Birth"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>participation <span className="requiredStar">*</span></Form.Label>
                  <Form.Control onChange={(e) => setParticipationData({
                    ...participationData,
                    [e.target.name]: e.target.value
                  })} name='participation' type="text"
                    defaultValue={participationData && participationData.participation && participationData.participation} />
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>Family support <span className="requiredStar">*</span></Form.Label>
                  <Form.Control onChange={(e) => setParticipationData({
                    ...participationData,
                    [e.target.name]: e.target.value
                  })} name='family_support' type="text"
                    defaultValue={participationData && participationData.family_support && participationData.family_support} />
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                  <Form.Label>
                    who support the survivor from family to pursue her legal
                    case  <span className="requiredStar">*</span>
                  </Form.Label>
                  <Form.Control
                    defaultValue={participationData && participationData.support_from_family_to_persue_case && participationData.support_from_family_to_persue_case}
                    onChange={(e) => setParticipationData({
                      ...participationData,
                      [e.target.name]: e.target.value
                    })}
                    name='support_from_family_to_persue_case'
                    as="textarea"
                    rows="4"
                    placeholder="Enter the Reason"
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} md="auto">
                  <MDBBtn
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"

                    onClick={() => onCancel()}>
                    Cancel
                  </MDBBtn>
                </Form.Group>
                <Form.Group as={Col} md="auto">
                  <Button onClick={addParticipation}
                    disabled={participationData && !participationData.meeting_date ? true : !participationData.participation ? true : !participationData.family_support ? true : !participationData.support_from_family_to_persue_case ? true : false}
                    type="submit" className="submit_btn shadow-0">
                    Submit
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SurvivorsParticipation;
