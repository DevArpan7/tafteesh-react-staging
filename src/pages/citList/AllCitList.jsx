import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import { KamoTopbar } from '../../components';
import { MDBTooltip, MDBBtn } from 'mdb-react-ui-kit';
import { Modal, Button } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from '../../components/NotificationPage';
import axios from "axios";
import { getAllCitList } from '../../redux/action';
import AllCitDataTable from './AllCitDataTable';

const AllCitList = (props) => {
    const [modalAddShow, setModalAddShow] = useState(false);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const allCitList = useSelector((state) => state.allCitList);
    const [addShgData, setAddShgData] = useState({});
    const [updateMessage, setUpdateMessage] = useState("");
    const api = "https://kamo-api.herokuapp.com/api";
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
    const [isLoading, setIsLoading] = useState(false);

    const [checked, setChecked] = React.useState(false);
    const [toggleId, setToggleId] = useState('');
    const handleChange = (event, id) => {
        //   console.log(event.target.checked,id,"iiiiiiiiiiii");
        setChecked(!checked)
        setToggleId(id);

    };


    useEffect(() => {
        let body = {
            approval: checked
        }
        setIsLoading(true)
        axios
            .patch(api + "/cit/toggle-approval/" + toggleId, body, axiosConfig)
            .then((response) => {
                console.log(response);
                handleClick();
                setUpdateMessage(response && response.data.message);
                if (response.data && response.data.error === false) {
                    const { data } = response;
                    dispatch(getAllCitList())
                    setTimeout(() => {
                        setIsLoading(false);
                      }, 1000);
                    //   setChecked(false);
                    setToggleId('');

                }
            })
            .catch((error) => {
                setTimeout(() => {
                    setIsLoading(false);
                  }, 1000);
                console.log(error, "shg add error");
            });
    }, [checked])

  

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
        dispatch(getAllCitList());
    }, [props])


    return (
        <>
            <KamoTopbar />
            <main className="main_body">
                <NotificationPage handleClose={handleClose} open={open} message={updateMessage} />
                <div className="bodyright">
                    <div className="row justify-content-between">
                        <div className="col-auto">
                            <h2 className="page_title">All CIT List</h2>
                        </div>
                    </div>
                    <div className="white_box_shadow_20 survivors_table_wrap vieweditdeleteMargin40 position-relative">
                       

                        <AllCitDataTable
                            allCitList={allCitList && allCitList.length > 0 && allCitList} isLoading={isLoading}
                            onSelectRow={onSelectRow} checked={checked} handleChange={handleChange}
                        />

                       
                    </div>
                </div>
                
                
            </main>
           
        </>
    )
}

export default AllCitList
