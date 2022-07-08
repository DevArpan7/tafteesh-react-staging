import React from 'react';
import LoginForm from './LoginForm';
import "./login.css";
import logo from "../../assets/img/logo.png";

const Login = () => {
  return (
    <>
      <section className='login__body'>
          <div className="login__body_left">
              <div className="login__body_left__logo">
                <img src={logo} alt="" />
              </div>
          </div>
          <div className="login__body_box">
            <h2>Welcome to  <span>Tafteesh</span></h2>
            <p>In search of Justice</p>
            <LoginForm />
            <div className='login__border'>
              <span className='login__border__one'></span>
              <span className='login__border__two'></span>
            </div>
          </div> 
          <div className="login__body_right">        
          </div>
      </section>
    </>
  )
}

export default Login