import React from 'react';
import './sidebar.css';
import SidebarMenu from './SidebarMenu';
import SidebarProfile from './SidebarProfile';

const Sidebar = (props) => {
  
  return (
    <>
      <div className={props.className}>
        <SidebarProfile />
        <SidebarMenu />
      </div>
    </>
  )
}

export default Sidebar