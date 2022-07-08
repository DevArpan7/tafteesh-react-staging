import React, { useEffect, useState } from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import { Topbar } from '../../components';
import { MDBTooltip, MDBBtn } from 'mdb-react-ui-kit';
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { getTraffickerList } from '../../redux/action';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotificationPage from '../../components/NotificationPage';

import TraffickersDataTableList from './TraffickersDataTableList';


const SurvivorTraffickersList = (props) => {
    const [modalAddShow, setModalAddShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [userId, setUserId] = useState('');
    const [activeClass, setActiveClass] = useState(false);
    const [open, setOpen] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [addTraffickerData, setAddTraffickerData] = useState({});
    const traffickerList = useSelector((state) => state.traffickerList);
    const api = "https://tafteesh-staging-node.herokuapp.com/api";
    const token = localStorage.getItem("accessToken");
    let axiosConfig = {
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    };
    const dispatch = useDispatch();
    const [fileSelect, setFileSelect] = useState("");
    const [pictureData, setPictureData] = useState({});
    const [pictureArr, setPictureArr] = useState([]);

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setTimeout(() => {
    setIsLoading(false);
  }, 1000);
}, [traffickerList]);

    useEffect(() => {
        dispatch(getTraffickerList());
    }, []);

    const onSelectRow = (id) => {
        console.log(id);
        setActiveClass(true);
        setUserId(id);
    }

    const removeSelection = () => {
        setAddTraffickerData({});
        setActiveClass(false);
        setUserId('');
    }

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    const onCancel = () => {
        setModalAddShow(false);
        setPictureData({})

    }

    /////////////////////file upload function/////////////////////////
    const handleFileInput = (e) => {
        console.log(e, e.target.files[0]);
        let data = e.target.files[0];

        setFileSelect(e.target.files[0]);
        storeFile(data);
    };

    const storeFile = (file) => {
        console.log(file);
        const formData = new FormData();
        formData.append("file", file);
        axios
            .post(
                "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
                formData,
                axiosConfig
            )
            .then(function (response) {
                console.log("successfully uploaded", response);
                if (response && response.data.error === false) {
                    const { data } = response
                    setPictureData(data.data)
                    let obj = ""
                    obj = `https://tafteesh-staging-node.herokuapp.com/${data.data && data.data.filePath}`

                    setPictureArr([...pictureArr, obj])
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        console.log(pictureArr);
    }, [pictureArr]);


    /* api call for trafficker detail */
    useEffect(() => {
        console.log(userId,"userId");
        if(userId !==''){
        getTraffickerDetails();
        }
    }, [userId]);

    const getTraffickerDetails = (id) => {
        console.log(id)
        axios
            .get(api + "/trafficker-profile/detail/" + userId, axiosConfig)
            .then((response) => {
                console.log(response);
                if (response.data && response.data.error === false) {
                    const { data } = response;
                    setAddTraffickerData(data.data);
                }
            })
            .catch((error) => {
                console.log(error, "user details error");
            });
    };

    const addUserFunc = (e) => {
        e.preventDefault();
        var objData = {
            ...addTraffickerData,
            "photograph": pictureArr
        }
        var body = objData;
        if (userId) {
            axios
                .patch(api + "/trafficker-profile/update/" + userId, body, axiosConfig)
                .then((res) => {
                    console.log(res);
                    handleClick();
                    setUpdateMessage(res && res.data.message);
                    if (res && res.data && res.data.error == false) {
                        const { data } = res;

                        console.log(data, res);
                        dispatch(getTraffickerList());
                        // setPictureData({})
                        setPictureArr([])
                        setAddTraffickerData({})
                        setModalAddShow(false)
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            axios
                .post(api + "/trafficker-profile/create", body, axiosConfig)
                .then((res) => {
                    console.log(res);
                    handleClick();
                    setUpdateMessage(res && res.data.message);
                    if (res && res.data && res.data.error == false) {
                        const { data } = res;

                        console.log(data, res);
                        dispatch(getTraffickerList());
                        setPictureData({})
                        setPictureArr([])
                        setAddTraffickerData({})
                        setModalAddShow(false)
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <>
            <Topbar />
            <main className="main_body">
                <div className="bodyright">
                    <div className="row justify-content-between">
                        <div className="col-auto">
                            <h2 className="page_title">Traffickers List</h2>
                        </div>
                    </div>
                    <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
                        {/* <div className="vieweditdelete">
                            <MDBTooltip tag="button" wrapperProps={{ className: "view_btn add_btn" }} title='Add'>
                                <span onClick={() => { setModalAddShow(true); removeSelection() }}>
                                    <i className="fal fa-plus-circle"></i>
                                </span>
                            </MDBTooltip>
                            <MDBTooltip tag={Link} wrapperProps={{ className: "edit_btn" }} title='Edit'>
                                <span onClick={() => {
                                    if (!userId) {
                                        alert('Please select a trafficker')
                                    } else {
                                        setModalAddShow(true)
                                    }
                                }}>
                                    <i className="fal fa-pencil"></i>
                                </span>
                            </MDBTooltip>
                            <MDBTooltip tag="button" wrapperProps={{ className: "delete_btn" }} title='Delete'>
                                <span>
                                    <i className="fal fa-trash-alt"></i>
                                </span>
                            </MDBTooltip>
                        </div> */}

                        <TraffickersDataTableList 
                            traffickerList={traffickerList && traffickerList.length > 0 && traffickerList}
                            onSelectRow={onSelectRow} isLoading={isLoading}
                        />
                        {/* <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="9%">SN </th>
                                        <th>Name </th>
                                        <th>Gender </th>
                                        {/* <th width="10%">Photo </th> */}
                                        {/* <th width="20%">Address </th> */}
                                        {/*<th width="10%">Survivor <span>(Count)</span></th>
                                        <th>ID Mark</th>
                                        <th>Is Trafficker</th>
                                    </tr>
                                </thead> */}
                                {/* <tbody>
                                    {traffickerList && traffickerList.length > 0 ? traffickerList.map((data,index) => {
                                        let indx = index + 1
                                        return (
                                            <tr className={[data._id === userId && activeClass === true && 'current']} onClick={() => onSelectRow(data._id)} key={data._id}>
                                                <td>{indx && indx}</td>
                                                <td>{data && data.trafficker_name && data.trafficker_name}</td>
                                                <td>{data && data.gender && data.gender}</td> */}
                                                {/* <td>
                                                    <img src={data && data.photograph && data.photograph}
                                                        alt="" />
                                                </td> */}
                                                {/* <td>{data && data.residential_address && data.residential_address}</td> */}
                                                {/* <td>0</td>
                                                <td>{data && data.identification_mark && data.identification_mark}</td>
                                                <td>{data && data.is_trafficker && data.is_trafficker === true ? "Yes": "No"}</td>
                                            </tr>
                                        )
                                    }) :
                                        <tr>
                                            <td className="text-center" colSpan={6}>
                                                <b>NO Data Found !!</b>
                                            </td>
                                        </tr>
                                    } 
                                </tbody>
                            </table>
                        </div>*/}
                    </div>
                </div>

                <Modal className="addFormModal" show={modalAddShow} onHide={setModalAddShow} size="lg" aria-labelledby="reason-modal" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Traffickers
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="site_form_wraper">
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <NotificationPage
                                    handleClose={handleClose}
                                    open={open}
                                    message={updateMessage}
                                />
                                <Row>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Name <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.trafficker_name}
                                            name='trafficker_name'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Age <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.age}
                                            name='age'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="number"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="form-group">
                                        <Form.Label>Gender <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Select
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            name='gender'
                                            value={addTraffickerData && addTraffickerData.gender}
                                        >
                                            <option hidden="true">Open this select menu</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="transgender">Transgender</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="form-group">
                                        <Form.Label>Photo </Form.Label>
                                        <Form.Control
                                            onChange={handleFileInput}
                                            type="file"
                                            name="file"
                                            size="lg"
                                        />

                                        {pictureArr && pictureArr.map((pic) => {
                                            return (
                                                <div style={{fontSize: "12px"}}> 
                                                    {pic && pic.split('/').pop()}

                                                </div>
                                            )
                                        })}


                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>ID Mark </Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.identification_mark}
                                            name='identification_mark'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Is Trafficker ?</Form.Label>
                                        <Form.Select name="is_trafficker"
                                            value={addTraffickerData && addTraffickerData.is_trafficker && addTraffickerData.is_trafficker}
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })}>
                                            <option hidden={true}>Default select</option>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </Form.Select>
                                    </Form.Group>
                                    {/* <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Alias </Form.Label>
                                        <Form.Control
                                            defaultValue={addTraffickerData && addTraffickerData.alias}
                                            name='alias'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            type="text"
                                            placeholder=""
                                        />
                                    </Form.Group> */}

                                    <Form.Group as={Col} md="12" className="form-group">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows="4"
                                            defaultValue={addTraffickerData && addTraffickerData.residential_address}
                                            name='residential_address'
                                            onChange={(e) => setAddTraffickerData({
                                                ...addTraffickerData,
                                                [e.target.name]: e.target.value
                                            })
                                            }
                                            placeholder="Enter Address"
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="justify-content-between">
                                    <Form.Group as={Col} md="auto">
                                        <MDBBtn type='button' className="shadow-0 cancle_btn" color='danger'
                                            onClick={() => onCancel()}>Close</MDBBtn>
                                    </Form.Group>
                                    <Form.Group as={Col} md="auto">
                                        <Button type="submit"
                                            disabled={addTraffickerData && !addTraffickerData.trafficker_name ? true :
                                                !addTraffickerData.gender ? true : !addTraffickerData.age ? true :
                                                    false}
                                            className="submit_btn shadow-0" onClick={addUserFunc} >Submit</Button>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            </main>
        </>
    )
}


export default SurvivorTraffickersList