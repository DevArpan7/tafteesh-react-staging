import React, {useState,useEffect} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import { Sidebar } from '../../components';
import { useDispatch, useSelector } from "react-redux";

import './topbar.css';
import logo from "../../assets/img/color-logo.png";
import mobilelogo from "../../assets/img/mobile-color-logo.png";
import emoji from "../../assets/img/emoji.png";
import profileImg from "../../assets/img/profile_img.png";
import { NavLink, useHistory } from "react-router-dom";

import { getPendingItemList} from '../../redux/action';
const Topbar = (props)  => {
  const [switchLeftSide, setSwitchLeftSide] = useState("");
  const [switchToggle, setswitchToggle] = useState("");
  const profile = localStorage.getItem("image");
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();


  const pendingItemList = useSelector((state) => state.pendingItemList);
  
  const toggleSwitch = ()=>{
    setSwitchLeftSide (switchLeftSide === "" ? "bodyleftHide" : "");
    setswitchToggle (switchToggle === "" ? "togglebtn_hide" : "");
  }
const logoutFunc=()=>{
  localStorage.clear();
  // localStorage.removeItem('userId')
  // localStorage.removeItem('accessToken')
  // localStorage.removeItem('refreshToken')
  // localStorage.removeItem('image')
  // localStorage.removeItem('fname')
  // localStorage.removeItem('lname')
  // localStorage.removeItem('role')
  // localStorage.removeItem('organizationName')
  // localStorage.removeItem('organizationId')

  history.push('/')
}

  
useEffect(() => {
  dispatch(getPendingItemList(userId))
}, [userId])

const gotoPendingItems=()=>{
  history.push("/pending-case");
}
  return (
    <>
      <header className="main_header">
        <button className={`togglebtn ${switchToggle}`} onClick={toggleSwitch} type="button">
          <i className="fal fa-bars"></i>
        </button>  
        <div className="logo">
          <img className="desktoplogo" src={logo} alt="" />
          <img className="mobilelogo" src={mobilelogo} alt="" />
        </div>
        <div className="header_left">                  
          <div className="pending_case d-flex align-items-center">
            <div className="pending_case_icon">
              <img src={emoji} alt="" />
            </div>
            <div className="pending_case_text d-flex align-items-center">
              <span className='pendingtext'>Pending Cases</span>
              <span className='pendingcount' style={{cursor: "pointer"}} onClick={()=> gotoPendingItems()}>{pendingItemList && pendingItemList.length}</span>
            </div>
          </div>
        </div>
        <div className="acount_lastseen">
          <div className="last_seen">
            Last Seen <span>1 week ago</span> 
          </div>
          <div className="myacount">
            <Dropdown>
              <Dropdown.Toggle className="myacount_btn shadow-0 p-0" id="acount_dropdown">
                <img src={profile ? profile : profileImg} alt="" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Link onClick={logoutFunc} className="dropdown-item">Logout</Link>
                <Link to="/myaccount" className="dropdown-item">My Account</Link>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </header>
      <Sidebar className={`bodyleft ${switchLeftSide}`} />
    </>
  )
}

export default Topbar