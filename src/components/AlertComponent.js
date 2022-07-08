import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
// import alertImg from "../../assets/img/alertPopupimg.png";
import alertImg from "../assets/img/mobile-color-logo.png";

const AlertComponent = (props) => {
  const {
    showAlert,
    handleCloseAlert,
    onDeleteFunction,
    alertFlag,
    alertMessage,
    goToAddEscal,
  } = props;

  return (
    <div>
      <Modal
        show={showAlert}
        onHide={handleCloseAlert}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div className="alertTextBox">
            <div className="alertTextBoxImg">
              <img src={alertImg} alt="" />
            </div>
            {alertMessage && alertMessage !== "" ? (
              <h4>{alertMessage}</h4>
            ) : (
              <h4>Are you sure, you want to delete ?</h4>
            )}
            <div className="row ml-0 mr-0 justify-content-between">
              {alertFlag && alertFlag === "alert" ? (
                <div className="col-auto">
                  <Button
                    variant="secondary"
                    className="alertNoBtn"
                    onClick={handleCloseAlert}
                  >
                    Ok
                  </Button>
                </div>
              ) : alertFlag && alertFlag === "concluded" ? (
                <div className="col-auto">
                  <Button
                    variant="secondary"
                    className="alertNoBtn"
                    onClick={handleCloseAlert}
                  >
                    Ok
                  </Button>
                </div>
              ) : alertFlag && alertFlag == "add" ? (
                <>
                  <div className="col-auto">
                    <Button
                      variant="secondary"
                      className="alertNoBtn"
                      onClick={handleCloseAlert}
                    >
                      Skip
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button
                      variant="secondary"
                      className="alertYesBtn"
                      onClick={goToAddEscal}
                    >
                      Yes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-auto">
                    <Button
                      variant="secondary"
                      className="alertNoBtn"
                      onClick={handleCloseAlert}
                    >
                      No
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button
                      variant="secondary"
                      className="alertYesBtn"
                      onClick={onDeleteFunction}
                    >
                      Yes
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AlertComponent;
