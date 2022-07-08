import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap';
import axios from "axios";
import NotificationPage from "../../components/NotificationPage"

const ChangePassword = (props) => {
    const userId = (localStorage.getItem('userId'));
    const { userDetailsFunc, api, token, axiosConfig } = props;
    const [passwordData, setPasswordData] = useState({});
    const [message, setMessage] = useState('');

    const [open, setOpen] = useState(false);
    const [updateMessage,setUpdateMessage] = useState('')
    const handleClick =() => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    ///////////// password update api call function /////////


    const changePasswordFunc = (e) => {
        e.preventDefault()
        if (passwordData && passwordData.new_password && passwordData.new_password.length <6) {
            setMessage("Password length should not be less than 6 !!")
        }
        else if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage("Please enter correct password !!")
        } else {
            var body = { old_password: passwordData.old_password, new_password: passwordData.new_password }

            axios.patch(api + 'change-password/' + userId, body, axiosConfig

            )
                .then(res => {
                    console.log(res);
                    setUpdateMessage(res && res.data.message)
                    handleClick()
                    if (res && res.data && res.data.error === false) {
                        setPasswordData({})
                        setMessage("")
                        userDetailsFunc();
                    }
                    
                })
                .catch((error) => {
                    console.log(error)
                    setMessage("")
                });
        }
    }


    return (
        <>
            <h4 className="pb-2">Update Password</h4>
            <Form>
            <NotificationPage handleClose={handleClose} open={open} message ={updateMessage}/>

                <Row>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control name='old_password' onChange={(e) => setPasswordData({
                            ...passwordData,
                            [e.target.name]: e.target.value
                        })}
                            type="password"
                            maxLength={8} />
                    </Form.Group>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control name='new_password' onChange={(e) => setPasswordData({
                            ...passwordData,
                            [e.target.name]: e.target.value
                        })}
                            type="password" maxLength={8}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control name='confirm_password' onChange={(e) => setPasswordData({
                            ...passwordData,
                            [e.target.name]: e.target.value
                        })}
                            type="password" maxLength={8}
                        />
                    </Form.Group>
                </Row>
                <p style={{ color: "#a10b0b" }}> {message && message}</p>
                <Row className="justify-content-start mt-4">
                    <Form.Group as={Col} md="auto">
                        <Button type="submit" onClick={changePasswordFunc} 
                        disabled={passwordData && !passwordData.old_password ? true : !passwordData.new_password ? true :
                        !passwordData.confirm_password ? true : false }
                        className="submit_btn shadow-0">Update Password</Button>
                    </Form.Group>
                </Row>
            </Form>
        </>
    )
}

export default ChangePassword
