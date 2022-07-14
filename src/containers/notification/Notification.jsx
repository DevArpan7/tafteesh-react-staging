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
import './notification.css'

import {
  getNotificationList
} from "../../redux/action";
const Notification = (props) => {
  const changeLogList = useSelector((state) => state.changeLogList);
  const notificationList = useSelector((state) => state.notificationList);

  const [modalNewloanLogShow, setModalNewloanLogShow] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  const gotoAddLoan = (e, data) => {
    setDetailsData(data);
    setModalNewloanLogShow(true);
  };

useEffect(()=>{
  dispatch(getNotificationList(userId))
},[props])


console.log(notificationList,"notificationList");
  return (
    <>
      <Topbar />
      <main className="main_body">
        <div className="bodyright">
          <div className="row justify-content-between mb30">
            <div className="col-auto">
              <h2 className="page_title mb-3 mb-md-0">Notification</h2>
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
          <div className="white_box_shadow_20 survivors_table_wrap position-relative">
            <div className="table-responsive medium-mobile-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th width="4%">Created Date</th>
                    <th width="4%">Time</th>
                    <th width="10%">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationList && notificationList.length > 0 ? (
                    notificationList.map((item) => {
                      return (
                        <tr>
                          <td>
                            {item &&
                              item.createdAt &&
                              moment(item.createdAt).format("DD-MMM-YYYY")}
                          </td>
                          <td>
                            {item &&
                              item.createdAt &&
                              moment(item.createdAt).format("hh:mm A")}
                          </td>
                          <td>{item && item.description}</td>
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
            </div>
          </div>
        </div>
      </main>
     
    </>
  );
};

export default Notification;
