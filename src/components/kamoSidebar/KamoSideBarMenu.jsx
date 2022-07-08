import React, {useState} from 'react'
import { NavLink } from "react-router-dom";

const KamoSideBarMenu = ({item}) => {
    const [open, setOpen] = useState(false);


    if(item.childrens){
        return (
            <li className={open ? "sidebar-item open" : "sidebar-item"}>
                <div className="sidebar-title"  onClick={() => setOpen(!open)}>
                    <span>
                        { item.icon && <i className={item.icon}></i> }
                        {item.title}    
                    </span> 
                    <i className="far fa-angle-down toggle-btn"></i>
                </div>
                <div className="sidebar-submenu">
                    <ul>
                        { item.childrens.map((child, index) => <KamoSideBarMenu key={index} item={child} />) }
                    </ul>
                </div>
            </li>
        )
    }else{
        return (
            <li className="sidebar-item plain">
                <NavLink exact to={item.path || "#"}>
                    { item.icon && <i className={item.icon}></i> }
                    {item.title}
                    {item.textnew && <span className='new'>{item.textnew}</span>}
                </NavLink>
            </li>
        )
    }
}

export default KamoSideBarMenu