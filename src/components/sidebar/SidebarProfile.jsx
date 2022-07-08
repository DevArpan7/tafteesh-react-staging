import React from 'react';
import profileImg from "../../assets/img/profile_img.png";

const SidebarProfile = () => {
  const profileImage = (localStorage.getItem('image'));
  const firstName = (localStorage.getItem('fname'));
  const lastName = (localStorage.getItem('lname'));
  const role = (localStorage.getItem('role'));


  return (
    <>
        <div className="bodyleft_account d-flex align-items-center">
            <div className="bodyleft_account_img">
                <img src={profileImage ? profileImage : profileImg} alt="" />
            </div>
            <div className="bodyleft_account_text">
                <h4 className="mb-1">{firstName && firstName}</h4>
                <h6 className="mb-0">{role && role}</h6>
            </div>
        </div>
    </>
  )
}

export default SidebarProfile