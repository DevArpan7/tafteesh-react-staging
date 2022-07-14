import React from 'react';
import { NavLink } from "react-router-dom";


const SidebarMenu = () => {
  return (
    <>
      <nav className="sidemenu">
        <ul>
          <li><NavLink exact to="/dashboard"><i className="fal fa-clipboard"></i> Dashboard</NavLink></li>
          <li><NavLink activeClassName="active" exact to="/survivors"><i className="fal fa-users"></i> Survivors</NavLink></li>
          <li><NavLink activeClassName="active" exact to="/survivor-traffickers"><i className="fal fa-list-alt"></i>Traffickers List</NavLink></li>
          {/* <li><NavLink activeClassName="active" exact to="/survivors"><i className="fal fa-sack-dollar"></i> Victim Compensation </NavLink></li>
          <li><NavLink activeClassName="active" exact to="/survivors"><i className="fal fa-gavel"></i> Procedural Correction </NavLink></li> */}
          <li><NavLink activeClassName="active" exact to="/notification"><i className="fal fa-bell"></i> Notification <span className='new'>0</span></NavLink></li>
        </ul>
      </nav>
    </>
  )
}

export default SidebarMenu