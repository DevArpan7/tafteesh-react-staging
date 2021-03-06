import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { NavLink, useHistory } from "react-router-dom";
import { MDBCheckbox } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { Button } from 'primereact/button';

import axios from "axios";
// import { __DEV } from "../../isDev";
import NotificationPage from "../NotificationPage";
const AdminLoginForm = (props) => {
  const [loading2, setLoading2] = useState(false);
  const onLoadingClick2 = () => {
    setLoading2(true);

    setTimeout(() => {
        setLoading2(false);
    }, 2000);
  }
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [loginData, setLoginData] = useState({});
  const history = useHistory();
  const [conditionCheck, setConditionCheck] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [messageType, setMessageType] = useState({ type: '', logMessage: '' });
  const [updateMessage,setUpdateMessage] = useState('')

  const [open, setOpen] = useState(false);
  const token = (localStorage.getItem('accessToken'));
  
  useEffect(()=>{
    if(token){
history.push("/dashboard")
      
    }
    
  },[token]);
  
    const handleClick =() => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  const handelLoginField = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserLogin({ ...userLogin, [name]: value });
  };
  const handelSubmit = (e) => {
    e.preventDefault();
    const newLoginRecord = {
      ...userLogin,
      id: new Date().getTime().toString(),
    };
    setRecords([...records, newLoginRecord]);


  };

  const showModal = () => {

    if (userLogin && userLogin.password.length < 6) {
      setMessage("Password length should be greater than 6 !!")
    } else {
      setIsOpen(true);
    }
  };

  const agreedFunc = (e) => {
    console.log(e.target.checked, "eeee");
    setConditionCheck(e.target.checked)
  }

  const hideModal = () => {
    setIsOpen(false);
  };

  ////// API call function for login //////
  const loginFun = () => {

    // let userLogin = 
  setLoading2(true);
    setConditionCheck(true);
    axios
      .post("https://tafteesh-staging-node.herokuapp.com/api/admin/login", {
        user: userLogin.email,
        password: userLogin.password,
      })
      .then(function (response) {
        setLoading2(false);
        setTimeout(() => {
          setLoading2(false);
      }, 2000);
        const { data } = response;
        console.log(response, data.message);
        setConditionCheck(false);
        handleClick()
        setUpdateMessage(data && data.message)
        if (data.error == false) {
          
          localStorage.setItem('userId', data.data[0]._id);
          localStorage.setItem('accessToken', data.data[1].accessToken);
          localStorage.setItem('refreshToken', data.data[1].refreshToken);
          localStorage.setItem('image', data.data[0].image);
          // localStorage.setItem('UserName', data.data[0].image);

          // localStorage.setItem('fname', data.data[0].fname);
          // localStorage.setItem('lname', data.data[0].lname);
          localStorage.setItem('role', data.data[0].role.name);
          // localStorage.setItem('organizationName',data.data[0].organization.name);
          // localStorage.setItem('organizationId', data.data[0]._id);
         
          history.push("/admin");


          setLoginData(response.data);
          setUserLogin({ email: "", password: "" });
          setMessageType({ type: '', logMessage: '' });
        }
        else {
          hideModal();

        }
      })
      .catch(function (error) {
        setConditionCheck(false);
        setLoading2(true);
        console.log(error);
        setTimeout(() => {
          setLoading2(false);
      }, 2000);
      });

  };

  useEffect(() => {
    console.log(messageType, "message Type")
  }, [messageType]);


  return (
    <>
      <div className="login_form">
        <form action="" onSubmit={handelSubmit}>
        <NotificationPage handleClose={handleClose} open={open} message ={updateMessage}/>

          <div className="input-group mb-3">
            <div className="input-group-append">
              <span className="input-group-text">
                <i className="fal fa-envelope"></i>
              </span>
            </div>
            <input
              type="text"
              name="email"
              maxLength={50}
              autoComplete=""
              value={userLogin.email}
              onChange={handelLoginField}
              className="form-control input_user"
              placeholder="username"
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-append">
              <span className="input-group-text">
                <i className="fal fa-key-skeleton"></i>
              </span>
            </div>
            <input
              maxLength={8}
              type="password"
              autoComplete=""
              value={userLogin.password}
              onChange={handelLoginField}
              name="password"
              className="form-control input_pass"
              placeholder="password"
            />
          </div>
          {message && userLogin && userLogin.password && userLogin.password.length < 6 ?
            <p style={{ color: "#a10b0b" }} > {message && message}</p>
            : null}
          <div className="form-group form-group__forgot">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customControlInline"
              />
              <label
                className="custom-control-label"
                htmlFor="customControlInline">
                Remember me
              </label>
            </div>
            <div className="forgot_text">
              <a href="/#">Forgot Password?</a>
            </div>
          </div>
          {/* {loginMessage &&
          <p style={{ color: "#a10b0b" }}>{loginMessage}</p>
} */}
          <div className="d-flex justify-content-center login_container">
            <button
            //  disabled={conditionCheck == true ? false : true} 
             loading={loading2} 
             onClick={loginFun}
             // onClick={showModal}
              type="submit"
              name="button"
              disabled={userLogin && userLogin.email == '' ? true : userLogin.password == '' ? true : false}
              className="btn login_btn">
              Login
            </button>
          </div>

        </form>
      </div>

    </>
  );
};

export default AdminLoginForm;
