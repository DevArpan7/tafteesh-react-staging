import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { Topbar } from '../../components';
import AddSurvivorsForm from './AddSurvivorsForm';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { getSurvivorDetails} from '../../redux/action';
import queryString from "query-string";


const AddSurvivors = (props) => {
    console.log(props,"addSUr")
    const survivorDetails = useSelector((state) => state.survivorDetails);
    const dispatch = useDispatch();
    const history = useHistory();
    let url = props.location.search;
  let getId = queryString.parse(url, { parseNumbers: true });


  console.log(getId,url,"url")
    useEffect(() => {
        if( getId) {
        dispatch(getSurvivorDetails(getId && getId.survivorId))
        }else{
            dispatch({ type: "SURVIVOR_DETAILS", data: {} });
        }
    }, [props]);
    // useEffect(() => {
    //     if( props && props.location && props.location.state) {
    //     dispatch(getSurvivorDetails(props.location.state))
    //     }else{
    //         dispatch({ type: "SURVIVOR_DETAILS", data: {} });
    //     }
    // }, [props]);


  return (
    <>
        <Topbar />
        <main className="main_body">
            <div className="bodyright">
                <div className="row justify-content-between mb-4">
                    <div className="col-auto">
                        <h2 className="page_title"> {getId && getId.survivorId ? "Update Survivor" :"Add Survivors"}</h2>
                    </div>
                    <div className="col-auto">
                        <Link to="/survivors" className="text-uppercase cancle_btn">Cancel</Link>
                    </div>
                </div>

                <div className="site_form_wraper">
                    <AddSurvivorsForm  survivorId={getId && getId.survivorId}/>
                </div>
            </div>           
        </main>
    </>
  )
}

export default AddSurvivors