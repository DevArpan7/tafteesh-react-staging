import React,{useState, useEffect} from 'react';
import { KamoTopbar } from '../../components';
// import { Link } from 'react-router-dom';
import AddUserForm from './AddUserForm';
import "./adduser.css";
import { useDispatch, useSelector } from "react-redux";
import { getRoleList,getBlockList,getDistrictList,getStateList,getOrganizationList,getCollectivesList,getShgList } from '../../redux/action';

import queryString from "query-string";

const AddUser = (props) => {
  console.log(props,"addddddddd")
  // const{data} = props.location;
  const dispatch = useDispatch();
  let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });
  console.log(getId,"getId")
 
  useEffect(()=>{
    dispatch(getRoleList());
    dispatch(getStateList());
    dispatch(getOrganizationList());
    dispatch(getCollectivesList());
    dispatch(getShgList());


  },[props]);

  return (
    <>
      <KamoTopbar />
      <main className="main_body">
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">Add User</h2>
            </div>
          </div>

          <div className="site_form_wraper">
            <AddUserForm userId={getId && getId.id}/>
          </div>
        </div>           
      </main>      
    </>
  )
}

export default AddUser