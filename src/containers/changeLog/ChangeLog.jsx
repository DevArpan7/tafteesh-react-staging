import React, { useEffect, useState } from "react";
import { Topbar } from "../../components";

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
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import './changelog.css'

const ChangeLog = (props) => {
  const [modalInactiveShow, setmodalInactiveShow] = useState(false);
  const [modalAddShow, setModalAddShow] = useState(false);
  const changeLogList = useSelector((state) => state.changeLogList);
  const [modalNewloanLogShow, setModalNewloanLogShow] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [oldData,setOldData] = useState({})
  const [newData,setNewData] = useState({})

  const gotoAddLoan = (e, data) => {
    setDetailsData(data);
    setModalNewloanLogShow(true);
  };
    console.log(changeLogList && changeLogList,"changeLogList")
useEffect(()=>{
    setOldData(detailsData && detailsData.old_data && JSON.parse(detailsData.old_data)[0]);
    setNewData(detailsData && detailsData.new_data && JSON.parse(detailsData.new_data));

},[detailsData]);


//   console.log(
//     detailsData && detailsData.old_data && JSON.parse(detailsData.old_data),
//     "dataaaa"
//   );

console.log("oldData", oldData);
console.log("newData", newData);


  return (
    <>
      <Topbar />
      <main className="main_body">
        <div className="bodyright">
          <div className="row justify-content-between mb30">
            <div className="col-auto">
              <h2 className="page_title mb-3 mb-md-0">Change Log</h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                {/* <MDBBreadcrumbItem active>Survivor Documents</MDBBreadcrumbItem> */}
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
            <div className="table-responsive medium-mobile-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="10%">Date</th>
                    {/* <th width="10%">Old data</th> */}
                    <th width="10%">Change Description</th>
                    {/* <th width="10%">New Data</th> */}
                    <th width="10%">Status</th>
                    <th width="10%">Changed by</th>
                    <th width="10%">Note if any</th>
                    <th width="10%">Show Details</th>
                  </tr>
                </thead>
                <tbody>
                  {changeLogList && changeLogList.length > 0 ? (
                    changeLogList.map((item) => {
                      return (
                        <tr>
                          <td>
                            {item &&
                              item.updatedAt &&
                              moment(item.updatedAt).format("DD-MMM-YYYY")}
                          </td>
                          {/* <td>{item &&  item.survivor && item.survivor.survivor_name +" "+ item.old_data} </td> */}
                          <td>{item && item.description}</td>
                          {/* <td>{item && item.survivor && item.survivor.survivor_name +" "+ item.new_data}</td> */}
                          <td>
                            {item && item.status && item.status === true
                              ? "true"
                              : "false"}
                          </td>
                          <td>
                            {item &&
                              item.changed_by &&
                              item.changed_by.fname +
                                " " +
                                item.changed_by.lname +
                                " (" +
                                item.changed_by.username +
                                ")"}
                          </td>
                          <td>{item && item.note} </td>
                          {/* <td onClick={(e)=> gotoAddLoan(e)}> details</td> */}
                          <td>
                            <button
                              onClick={(e) => gotoAddLoan(e, item)}
                              style={{
                                padding: "6px 13px",
                                borderRadius: "5px",
                                fontWeight: 600,
                                letterSpacing: "0.5px",
                                fontSize: "12px",
                                border: "1px solid #AB9D1A",
                              }}
                            >
                              Show Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={7}>
                        <b>NO Data Found !!</b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Modal
        className="addFormModal"
        show={modalNewloanLogShow}
        onHide={setModalNewloanLogShow}
        size="xl"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"> Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="logdate_design">
            <div className="col-lg-6 col-12">
                <b className="mb-3 d-block">Old Data</b>
                <ul>
                    {oldData && Object.keys(oldData).map((key) => (
                        <li class="row">
                            <div className="col-5">{key.split("_").join("-")}</div>
                            {/* (oldData[key] && oldData[key].length && oldData[key].map( e => <li><code>{JSON.stringify(e)}</code></li>)) */}
                            <div className="col">{(typeof oldData[key] == 'string')? oldData[key] : <code>{JSON.stringify(oldData[key])}</code> }</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-lg-6 col-12">
                <b className="mb-3 d-block">New Data</b>
                <ul>
                    {newData && Object.keys(newData).map((key) => (
                        <li class="row">
                            <div className="col-5">{key.split("_").join("-")}</div>
                            <div className="col">{(typeof newData[key] == 'string')? newData[key] : <code>{JSON.stringify(newData[key])}</code>}</div>
                        </li>
                    ))}
                </ul>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChangeLog;
