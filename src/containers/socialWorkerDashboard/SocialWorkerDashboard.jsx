import React, { useState, useEffect } from 'react';
import { Topbar } from '../../components';
import "./socialdashboard.css";
import axios from "axios";

import SocialDashboardTab from './SocialDashboardTab';
import { servivorDashboardApi} from '../../redux/action';

import { useDispatch, useSelector } from "react-redux";

const Dashboard = (props) => {
  const organizationName = localStorage.getItem('organizationName');
    const dispatch = useDispatch();
    const api = "https://kamo-api.herokuapp.com/api/";
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    };

const [vcArray,setVcArray] = useState([])
const [pcArray,setPcArray] = useState([])
const [countData, setCountData] = useState({});
const [loader , setLoader] = useState(false);
// console.log(countData,countData)
  useEffect(() => {
    if (!token) {
      props.history.push("/")

    } else if(token && role && role== "Admin"){
      props.history.push("/admin")

    }else{
      console.log("data")
    }
  }, [token]);

  
  useEffect(() => {
    servivorDashboardApi();
  }, [props])



  const servivorDashboardApi=()=>{
    setLoader(true);
    axios
      .get(api + "survivor-dashboard/list")
      .then(function (response) {
        setLoader(false);
        // console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setVcArray(data.datavc);
          setPcArray(data.datapc)
          setCountData({"totalcountpc": data.totalcountpc,"totalcountvc":data.totalcountvc, "totalcountpcda": data.totalcountpcda,
        "totalcountpcsa": data.totalcountpcsa,"totalcountvcda":data.totalcountvcda ,"totalcountvcsa": data.totalcountvcsa});

        }
      })
      .catch(function (error) {
        console.log(error);
        setLoader(false);
      });
  }


  return (
    <>
      <Topbar />
      <main className="main_body">
        <div className="bodyright">
          <h2 className="page_title">Organization Name: <span>{organizationName && organizationName}</span></h2>
          <div className="totla_profile">
            <SocialDashboardTab {...props} loader={loader} countData={countData}pcArray={pcArray}vcArray={vcArray} />
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard