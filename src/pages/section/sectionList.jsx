import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import { KamoTopbar } from '../../components';
import { MDBTooltip, MDBBtn } from 'mdb-react-ui-kit';
import { Modal, Button } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from '../../components/NotificationPage';
import axios from "axios";
import { getAuthorityTypeList ,getAuthorityList, getActList, getSectionList} from '../../redux/action';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import Dropdown from 'react-bootstrap/Dropdown';
import CsvImportPage from '../../components/CsvImportPage';
import Papa from "papaparse";
import moment from 'moment';
import AlertComponent from "../../components/AlertComponent";
import SectionListDataTable from './SectionListDataTable';


const SectionList = (props) => {
    const [modalAddShow, setModalAddShow] = useState(false);
    const [modalTitle,setModalTitle] = useState('Add Section')
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const authorityTypeList = useSelector((state) => state.authorityTypeList);
    const authorityList = useSelector((state) => state.authorityList)
    const actList = useSelector((state) => state.actList);
    const sectionList = useSelector((state) => state.sectionList);
    // const [sectionList,setSectionList]=useState([])
    const [isLoaded,setIsLoaded]=useState(false)
    const [isLoading,setIsLoading] = useState(true)

    const [addShgData, setAddShgData] = useState({});
    const [updateMessage, setUpdateMessage] = useState("");
    const api = "https://kamo-api.herokuapp.com/api/section";
    const token = localStorage.getItem("accessToken");
    let axiosConfig = {
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    };
    const [activeClass, setActiveClass] = useState(false);
    const [selectedData, setSelectedData] = useState({})


    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);
    const [erorMessage, setErorMessage] = useState("");
  

    // console.log(authorityList,"authorityList")
    // console.log(actList,'actlistttttttttttttttttttttttt')

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
        dispatch(getSectionList())
        dispatch(getActList());
    }, [props])
    useEffect(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }, [sectionList]);
    ////// on cancel button function ///
    const onCancel = () => {
        setModalAddShow(false)
        setAddShgData({})
        // setSelectedData({})
    }


    const ongotoEdit = () => {
        if(selectedData && !selectedData._id){
            alert("Please select one Section !!")
        } else{
        setModalTitle('Update Section')
        setModalAddShow(true)
        setAddShgData(selectedData)
        }
    }

    const ongotoAdd=()=>{
        setModalAddShow(true)
        setAddShgData({})
        setSelectedData({})

    }
    /////// delete function call //////////
    const onDeleteChangeFunc = () => {
        if (selectedData && !selectedData._id) {
          alert("Please select one Authority ");
        } else {
          setShowAlert(true);
        }
      };
    
      const onDeleteFunction = () => {
        axios
          .patch(api + "/delete/" + selectedData._id)
          .then((response) => {
            handleClick();
            setUpdateMessage(response && response.data.message);
            if (response.data && response.data.error === false) {
              const { data } = response;
              setSelectedData({})
              dispatch(getSectionList());
              setShowAlert(false);
              setErorMessage("");
            }
          })
          .catch((error) => {
            //console.log(error, "partner error");
          });
      };


    ///// add shg api cll function /////

    const addShgFunc = (e) => {
        e.preventDefault()
        var body = addShgData

        if (addShgData && addShgData._id) {

            axios
                .patch(api + "/update/" + addShgData._id, body, axiosConfig)
                .then((response) => {
                    console.log(response);
                    handleClick();

                    setUpdateMessage(response && response.data.message);

                    if (response.data && response.data.error === false) {
                        const { data } = response;
                        dispatch(getSectionList())
                        setModalAddShow(false);
                        setAddShgData({})

                        // setSelectedData({});
                        setActiveClass(false);


                    }
                })
                .catch((error) => {
                    console.log(error, "shg add error");
                });
        }
        else {

            // axios
            //     .post(api + "/create", body, axiosConfig)
            //     .then((response) => {
            //         console.log(response,'sssssssssssssssssssss');
            //         handleClick();
            //         setUpdateMessage(response && response.data.message);
            //         if (response.data && response.data.error === false) {
            //             const { data } = response;
            //             dispatch(getAuthorityList())
            //             setModalAddShow(false);
            //             setAddShgData({})

            //         }
            //     })
            //     .catch((error) => {
            //         console.log(error, "shg add error");
            //     });

                axios
                .post(api + "/create", body, axiosConfig)
                .then((response) => {
                    console.log(response);
                    handleClick();
                    setUpdateMessage(response && response.data.message);
                    if (response.data && response.data.error === false) {
                        const { data } = response;
                        dispatch(getSectionList())
                        setModalAddShow(false);
                        // setAddStateData({})

                    }
                })
                .catch((error) => {
                    console.log(error, "shg add error");
                });
        }
    }

console.log(sectionList,'sectionnnnnnnnnnnnnnnnnnnnnnnnn')

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
let exportData=[];
    const exportToCsv = e => {
        e.preventDefault()

        // Headers for each column
        let headers = ['Section,Act,CreatedAt']

        sectionList.map((x)=>{
            exportData.push({section:x.number,act:x.act.name,createdAt:moment(x.createdAt).format('DD-MMM-YYYY')})
        })
        console.log(exportData,'exportdaaaaaaaaaaaaaaaa')
        // Convert users data to a csv
        let usersCsv = exportData.reduce((acc, user) => {
            const { section,act, createdAt } = user
            acc.push([section,act, createdAt].join(','))
            return acc
        }, [])

        downloadFile({
            data: [...headers, ...usersCsv].join('\n'),
            fileName: 'sectionList.csv',
            fileType: 'text/csv',
        })
    }
// console.log(sectionList,'sectionssssssssss')
    ///////////// import CSV file  function ////
    const [file, setFile] = useState();
    const [importCSVdata, setImportCSVdata] = useState([]);
    const fileReader = new FileReader();
    const [importCsvOpenModel, setImportCsvOpenModel] = useState(false)
    const [sampleArr , setSampleArr] = useState([{"name":"Ariit Das"}])

    const onImportCsv = () => {
        setImportCsvOpenModel(!importCsvOpenModel)
    }

    const downloadSampleCsv=(e)=>{

        let headers = ['AuthorityName']
    
        // Convert users data to a csv
        let usersCsv = sampleArr.reduce((acc, user) => {
            const {name} = user
            acc.push([name].join(','))
            return acc
        }, [])
    
        downloadFile({
            data: [...headers, ...usersCsv].join('\n'),
            fileName: 'authorityList.csv',
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
                obj = { name :item && item.AuthorityName},
                console.log(obj, "obj"),
                axios
                    .post(api + "/create", obj, axiosConfig)
                    .then((response) => {
                        console.log(response);
                        handleClick();
                        setUpdateMessage(response && response.data.message);
                        if (response.data && response.data.error === false) {
                            const { data } = response;
                            dispatch(getAuthorityList())
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

    const downloadPdf = () => {
        const doc = new jsPDF({
            orientation: "landscape",
        });

        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("SECTION DETAILS", 22, 10);
        const survivorColumns = [
            "SECTION",
            "ACT",
            "CREATED AT"
        ];
        const name = "Section-list" + new Date().toISOString() + ".pdf";
        let goalsRows = [];
        sectionList?.forEach((item) => {
            const temp = [
                item.number,
                item.act.name,
                moment(item.createdAt).format("DD/MM/YYYY"),
            ];
            goalsRows.push(temp);
        });
        doc.autoTable(survivorColumns, goalsRows, { startY: 75, startX: 22 });
        doc.save(name);
    }
    if(addShgData){
        console.log(addShgData?.act?.name,'actname')
    }
    return (
        <>
            <KamoTopbar />
            <main className="main_body">
                <NotificationPage handleClose={handleClose} open={open} message={updateMessage} />
                <div className="bodyright">
                    <div className="row justify-content-between">
                        <div className="col-auto">
                            <h2 className="page_title">Section List</h2>
                        </div>
                    </div>
                    <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
                        <div className="vieweditdelete">
                        <Dropdown align="end">
                                <Dropdown.Toggle variant="border" className="shadow-0" id="download-dropdown">
                                    Download List
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                <Dropdown.Item onClick={downloadPdf}>Download PDF</Dropdown.Item>
                                <Dropdown.Item onClick={exportToCsv}>Export CSV</Dropdown.Item>
                                    <Dropdown.Item onClick={() => onImportCsv()}>Import CSV</Dropdown.Item>
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
                                <span onClick={() => onDeleteChangeFunc()}>
                                    <i className="fal fa-trash-alt"></i>
                                </span>
                            </MDBTooltip>
                        </div>
                        {/* <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th width="33.33%">Id </th>
                                        <th width="33.33%">Number </th>
                                        <th width="33.33%">Act </th>
                                        <th width="33.33%">CreatedAt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        sectionList && !isLoaded ?
                                        <tr>
                                            <td colSpan={4} className='text-center'>
                                                <div class="spinner-border bigSpinner text-info"></div>
                                            </td>
                                        </tr>
                                    :
                                    
                                    sectionList &&  sectionList.length > 0 ? sectionList.map((item) => {
                                        return (
                                            <tr  className={[item._id === selectedData._id && activeClass === true && 'current']}
                                            onClick={() => onSelectRow(item)}>
                                                <td>{item._id}</td>
                                                <td>{item.number}</td>
                                                <td>{item.act}</td>
                                                <td>{item && item.createdAt && moment(item.createdAt).format("DD/MMM/YYYY")}</td>
                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                           <td className="text-center" colSpan={4}>
                                                <b>NO Data Found !!</b>
                                            </td>

                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div> */}
                        <SectionListDataTable 
                            authorityList={sectionList &&  sectionList.length > 0 && sectionList}
                            onSelectRow={onSelectRow}
                            isLoading={isLoading}
                        />
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
                            {modalTitle}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="site_form_wraper">
                            <Form>
                                <Row>
                                    <Form.Group className="form-group" as={Col} md="6">
                                        <Form.Label>Number </Form.Label>
                                        <Form.Control
                                        defaultValue={addShgData && addShgData.number && addShgData.number}
                                            type="text"
                                            placeholder=""
                                            name="number"
                                            onChange={(e) => setAddShgData({
                                                ...addShgData,
                                                [e.target.name]: e.target.value
                                            })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group" as={Col} md="6">
                                    <Form.Label>Act</Form.Label>
                                    <Form.Select name='act'
                                        value={addShgData &&  addShgData?.act?.name}
                                        onChange={(e) => setAddShgData({
                                            ...addShgData,
                                            [e.target.name]: e.target.value
                                        })}>
                                        <option hidden={true}>Please select</option>
                                        { actList && actList.length > 0 && actList.map((item) => {
                                            return (
                                                <option value={item && item._id}>{item && item.name}</option>
                                            )
                                        })}

                                    </Form.Select>
                                </Form.Group>
                                </Row>
                                <Row className="justify-content-between">
                                    <Form.Group as={Col} md="auto">
                                        <MDBBtn type="button" className="shadow-0 cancle_btn" color='danger'
                                            onClick={() => onCancel()}>Close</MDBBtn>
                                    </Form.Group>
                                    <Form.Group as={Col} md="auto">
                                        <Button type="submit"
                                        disabled={addShgData && !addShgData.number ? true  : !addShgData.act ? true  : false}
                                            onClick={addShgFunc}
                                            className="submit_btn shadow-0">Submit</Button>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            </main>
            {showAlert === true && (
        <AlertComponent
          showAlert={showAlert}
          handleCloseAlert={handleCloseAlert}
          onDeleteFunction={onDeleteFunction}
        />
      )}
        </>
    )
}

export default SectionList
