import React from 'react'
import KamoSideBarMenu from './KamoSideBarMenu';
import items from "./kamosidebarlist.json"

const KamoSideBar = (props) => {
  return (
    <>
      <nav className="sidemenu">
        <ul className={props.className}>
          { items.map((item, index) => <KamoSideBarMenu key={index} item={item} />) }
        </ul>
      </nav>
    </>
  )
}

export default KamoSideBar