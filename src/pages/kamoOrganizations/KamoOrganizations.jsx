import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import { KamoTopbar } from '../../components';
import { MDBTooltip, MDBBtn } from 'mdb-react-ui-kit';
import { Modal, Button } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from '../../components/NotificationPage';
import axios from "axios";
import { getOrganizationList, getStateList,deleteOrganisation} from '../../redux/action';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import moment from 'moment';
import Papa from "papaparse";
import CsvImportPage from '../../components/CsvImportPage';
import AlertComponent from "../../components/AlertComponent";
import OrganizationsDataTable from './OrganizationsDataTable';

const KamoOrganizations = (props) => {
    const [modalAddShow, setModalAddShow] = useState(false);
    const [isLoading,setIsLoading] = useState(true)
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const organizationList = useSelector((state) => state.organizationList);
    const stateList = useSelector((state) => state.stateList);

    const [addOrgData, setAddOrgData] = useState({});
    const [updateMessage, setUpdateMessage] = useState("");
    const api = "https://tafteesh-staging-node.herokuapp.com/api/organization";
    const token = localStorage.getItem("accessToken");
    let axiosConfig = {
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    };
    const [activeClass, setActiveClass] = useState(false);
    const [selectedData, setSelectedData] = useState({})
    const [erorMessage,setErorMessage] = useState("")

    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);

//////// delete function call //////////
const onDeleteChangeFunc=()=>{
    if (selectedData && !selectedData._id) {
      alert("Please select one partner");
    } else {
    setShowAlert(true)
    }
  }

  const onDeleteFunction=()=>{
    dispatch(deleteOrganisation(selectedData._id))
    setShowAlert(false)
  }


    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const onSelectRow = (item) => {

        setSelectedData(item);
        setActiveClass(true);

    }
    useEffect(() => {
        dispatch(getOrganizationList());
        dispatch(getStateList())
    }, [props])
    useEffect(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }, [organizationList]);
    ////// on cancel button function ///
    const onCancel = () => {
        setModalAddShow(false)
        setAddOrgData({})
        setSelectedData({})
    }

    const ongotoEdit = () => {
        if(selectedData && !selectedData._id){
            alert("Please select one organisation")
        } else{
        setModalAddShow(true)
        setAddOrgData(selectedData)
        }
    }

    const ongotoAdd = () => {
        setModalAddShow(true)
        setAddOrgData({})
        setSelectedData({})

    }

    useEffect(()=>{
        console.log(addOrgData,"org data")
    },[addOrgData]);

    ///// add Organisation api cll function /////

    const addOrgFunc = (e) => {
        e.preventDefault()
        var body = addOrgData
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        let isValid = true;
        if (!pattern.test(body.email)) {
      
          isValid = false;
      
          setErorMessage( "Please enter valid email address.");
      
        }
        else{
        if (addOrgData && addOrgData._id) {

            axios
                .patch(api + "/update/" + addOrgData._id, body, axiosConfig)
                .then((response) => {
                    console.log(response);
                    handleClick();

                    setUpdateMessage(response && response.data.message);

                    if (response.data && response.data.error === false) {
                        const { data } = response;
                        dispatch(getOrganizationList())
                        setModalAddShow(false);
                        setSelectedData({});
                        setActiveClass(false);
                        setAddOrgData({})

                        setErorMessage("")
                    }
                })
                .catch((error) => {
                    console.log(error, "shg add error");
                });
        }
        else {

            axios
                .post(api + "/create", body, axiosConfig)
                .then((response) => {
                    console.log(response);
                    handleClick();
                    setUpdateMessage(response && response.data.message);
                    if (response.data && response.data.error === false) {
                        const { data } = response;
                        dispatch(getOrganizationList())
                        setModalAddShow(false);
                        setAddOrgData({})
                        setErorMessage("")
                    }
                })
                .catch((error) => {
                    console.log(error, "shg add error");
                });
        }
    }
}


//////////////// for csv function ////

const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType })

    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
}

const exportToCsv = e => {
    e.preventDefault()

    // Headers for each column
    let headers = ['Id,OrganizationName,PhoneNo,Email,City,State,Pin,ContactPersion']

    // Convert users data to a csv
    let usersCsv = organizationList.data.reduce((acc, user) => {
        const { _id,name, phone, email, city,state, pin,contactPersion} = user
        acc.push([_id,name, phone, email, city,state, pin,contactPersion].join(','))
        return acc
    }, [])

    downloadFile({
        data: [...headers, ...usersCsv].join('\n'),
        fileName: 'organization.csv',
        fileType: 'text/csv',
    })
}


    ///////////// import CSV file  function ////
    const [file, setFile] = useState();
    const [importCSVdata, setImportCSVdata] = useState([]);
    const fileReader = new FileReader();

    const [importCsvOpenModel, setImportCsvOpenModel] = useState(false)
    const [sampleArr , setSampleArr] = useState([{"name": "User", "phone":"9876543212",
     "email":"user@mail.com", "city":"Kol","state":"62a9a7c3c05c6a1059f92eb0", 
     "pin":"123456","contactPersion":"Arpit","website": "www.website.com","address": "newtown"}])

    const onImportCsv = () => {
        setImportCsvOpenModel(!importCsvOpenModel)
    }
    const downloadSampleCsv=(e)=>{

        let headers = ['OrganizationName,PhoneNo,Email,City,State,Pin,ContactPersion,Website,Address']
    
        // Convert users data to a csv
        let usersCsv = sampleArr.reduce((acc, user) => {
            const { name, phone, email, city,state, pin,contactPersion, website,address } = user
            acc.push([name, phone, email, city,state, pin,contactPersion, website,address].join(','))
            return acc
        }, [])
    
        downloadFile({
            data: [...headers, ...usersCsv].join('\n'),
            fileName: 'organization.csv',
            fileType: 'text/csv',
        })
    }
    const handleOnChange = (e) => {

        if (e.target.files.length) {
            const inputFile = e.target.files[0];

            setFile(inputFile);
        }
    };

    const handleOnSubmit = (e) => {
        console.log(e, file);
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                console.log(event, "event");
                const csvOutput = event.target.result;
                console.log(csvOutput, "csvOutput")
                const csv = Papa.parse(csvOutput, { header: true });
                const parsedData = csv?.data;
                console.log(parsedData, "parsedData");
                setImportCSVdata(parsedData);
            };

            fileReader.readAsText(file);
        }
        else{
            alert("Please upload a .csv File")
        }
    }
    useEffect(() => {
        let obj = {}
        console.log(importCSVdata, "importCSVdata");
        importCSVdata && importCSVdata.length > 0 && importCSVdata.map((item) => {
          
            return (
                obj = { "name": item && item.OrganizationName,  "phone": item && item.PhoneNo ,"email": item && item.Email,
                    "city": item && item.City,  "state": item && item.State ,"pin": item && item.Pin,
                    "contactPersion": item && item.ContactPersion, "website": item && item.Website, "address": item && item.Address},
                console.log(obj, "obj"),
                axios
                    .post(api + "/create", obj, axiosConfig)
                    .then((response) => {
                        console.log(response);
                        handleClick();
                        setUpdateMessage(response && response.data.message);
                        if (response.data && response.data.error === false) {
                            const { data } = response;
                            dispatch(getOrganizationList())
                            setImportCSVdata([])
                            setFile()
                            setImportCsvOpenModel(false)
                        }
                    })
                    .catch((error) => {
                        console.log(error, "shg add error");
                    })
            )
        })
    }, [importCSVdata])



    return (
        <>
            <KamoTopbar />
            <main className="main_body">
                <NotificationPage handleClose={handleClose} open={open} message={updateMessage} />

                <div className="bodyright">
                    <div className="row justify-content-between">
                        <div className="col-auto">
                            <h2 className="page_title">Organizations List</h2>
                        </div>
                    </div>
                    <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
                        <div className="vieweditdelete">
                        <Dropdown align="end">
                                <Dropdown.Toggle variant="border" className="shadow-0" id="download-dropdown">
                                    Download List
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={exportToCsv}>Export CSV</Dropdown.Item>
                                    <Dropdown.Item onClick={() => onImportCsv()}>Import CSV</Dropdown.Item>
                                </Dropdown.Menu>
                                </Dropdown.Menu>
                            </Dropdown>
                            <MDBTooltip tag="button" wrapperProps={{ className: "view_btn add_btn" }} title='Add'>
                                <span onClick={() => ongotoAdd()}>
                                    <i className="fal fa-plus-circle"></i>
                                </span>
                            </MDBTooltip>
                            <MDBTooltip tag={"a"} wrapperProps={{ className: "edit_btn" }} title='Edit'>
                                <span onClick={() => ongotoEdit()}>
                                    <i className="fal fa-pencil"></i>
                                </span>
                            </MDBTooltip>
                            <MDBTooltip tag="button" wrapperProps={{ className: "delete_btn" }} title='Delete'>
                                <span onClick={()=> onDeleteChangeFunc()}>
                                    <i className="fal fa-trash-alt"></i>
                                </span>
                            </MDBTooltip>
                        </div>
                        <OrganizationsDataTable 
                            organizationList={organizationList && organizationList.data && organizationList.data.length > 0 && organizationList.data}
                            onSelectRow={onSelectRow}
                            isLoading={isLoading}
                        />
                        {/* <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="20%">Name </th>
                                        <th width="15%">Phone</th>
                                        <th width="28%">Email</th>
                                        <th width="12%">City</th>
                                        <th width="20%">Contact persion </th>
                                        <th width="12%">State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {organizationList && organizationList.data && organizationList.data.length > 0 ? organizationList.data.map((item) => {
                                        return (
                                            <tr className={[item._id === selectedData._id && activeClass === true && 'current']}
                                                onClick={() => onSelectRow(item)}>
                                                <td>{item && item.name && item.name}</td>
                                                <td>{item && item.phone && item.phone}</td>
                                                <td>{item && item.email && item.email}</td>
                                                <td>{item && item.city && item.city}</td>
                                                <td>{item && item.contact_persion && item.contact_persion}</td>
                                                <td>{item && item.state && item.state}</td>
                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                           <td className="text-center" colSpan={6}>
                                                <b>NO Data Found !!</b>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div> */}
                    </div>
                </div>
                {importCsvOpenModel === true &&
                    <Modal show={importCsvOpenModel} onHide={onImportCsv} size="md" aria-labelledby="reason-modal" className="addFormModal" centered>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Select File
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="site_form_wraper">
                                <CsvImportPage downloadSampleCsv={downloadSampleCsv} handleOnChange={handleOnChange} handleOnSubmit={handleOnSubmit} />
                            </div>
                        </Modal.Body>
                    </Modal>
                }
                <Modal className="addFormModal" show={modalAddShow} onHide={setModalAddShow} size="lg" aria-labelledby="reason-modal" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Organisation
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="site_form_wraper">
                            <Form>
                                <Row>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Name <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                        defaultValue={addOrgData && addOrgData.name && addOrgData.name}
                                            type="text"
                                            placeholder=""
                                            name="name"
                                            onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Phone <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                         maxLength={10}
                                          defaultValue={addOrgData && addOrgData.phone && addOrgData.phone}
                                            type="text"
                                            placeholder=""
                                            name="phone"
                                            onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-3">
                                        <Form.Label>Email <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                          defaultValue={addOrgData && addOrgData.email && addOrgData.email}
                                            type="email"
                                            placeholder=""
                                            name="email"
                                            onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                          <div className="text-danger" style={{fontSize: 12,marginTop:5}}>{erorMessage && erorMessage} </div>
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Address <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                          defaultValue={addOrgData && addOrgData.address && addOrgData.address}
                                            type="text"
                                            placeholder=""
                                            name="address"
                                            onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>City <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                          defaultValue={addOrgData && addOrgData.city && addOrgData.city}
                                            type="text"
                                            placeholder=""
                                            name="city"
                                            onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>State name <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Select
                                             onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                            name="state"
                                            value={
                                                addOrgData &&
                                                addOrgData.state &&
                                                addOrgData.state
                                            }>
                                                  <option hidden={"true"}>Please select State </option>
                                            {stateList &&
                                                stateList.length > 0 &&
                                                stateList.map((data) => {
                                                    return <option value={data.name}>{data.name}</option>
                                                })}
                                          
                                        </Form.Select>
                                    </Form.Group>
                                     
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>PIN <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                         maxLength={7}
                                          defaultValue={addOrgData && addOrgData.pin && addOrgData.pin}
                                            type="text"
                                            placeholder=""
                                            name="pin"
                                            onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Contact Person <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                          defaultValue={addOrgData && addOrgData.contactPersion && addOrgData.contactPersion}
                                            type="text"
                                            placeholder=""
                                            name="contactPersion"
                                            onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Website <span className='requiredStar'>*</span></Form.Label>
                                        <Form.Control
                                          defaultValue={addOrgData && addOrgData.website && addOrgData.website}
                                            type="text"
                                            placeholder=""
                                            name="website"
                                            onChange={(e) => setAddOrgData({
                                                ...addOrgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="justify-content-between">
                                    <Form.Group as={Col} md="auto">
                                        <MDBBtn type="button" className="shadow-0 cancle_btn" color='danger' 
                                        onClick={() => onCancel()}>Close</MDBBtn>
                                    </Form.Group>
                                    <Form.Group as={Col} md="auto">
                                        <Button type="submit"
                                        onClick={addOrgFunc}
                                        disabled={addOrgData && !addOrgData.name ? true : !addOrgData.phone ? true : !addOrgData.email ? true :
                                         !addOrgData.address ? true : !addOrgData.city ? true : !addOrgData.state ? true : !addOrgData.pin ? true :
                                        !addOrgData.contactPersion ? true : !addOrgData.website ? true : false }
                                        className="submit_btn shadow-0">Submit</Button>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            </main>
            {
        showAlert === true && 
        <AlertComponent showAlert={showAlert}handleCloseAlert={handleCloseAlert}onDeleteFunction={onDeleteFunction}  />
      }
        </>
    )
}

export default KamoOrganizations
