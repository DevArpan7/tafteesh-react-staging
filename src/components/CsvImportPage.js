import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function CsvImportPage(props) {
  const { handleOnChange, handleOnSubmit, downloadSampleCsv } = props;
  console.log(props, "import csv function");
  // const [file, setFile] = useState();

  // const fileReader = new FileReader();

  // const handleOnChange = (e) => {
  //     setFile(e.target.files[0]);
  // };

  // const handleOnSubmit = (e) => {
  //     console.log(e,file);
  //     e.preventDefault();

  //     if (file) {
  //         fileReader.onload = function (event) {
  //             console.log(event,"event");
  //             const csvOutput = event.target.result;
  //             console.log(csvOutput,"csvOutput")
  //         };

  //         fileReader.readAsText(file);
  //     }

  // };

  return (
    <div className="site_form_wraper">
      <form>
        <Row>
          <Form.Group as={Col} xs="12" className="mb-3">
            <Form.Control
              type={"file"}
              id={"csvFileInput"}
              accept={".csv,.xlsx,.xls"}
              onChange={handleOnChange}
            />
          </Form.Group>
          <Form.Group as={Col} xs="auto">
            <button
              className="btn im_ex_btn"
              onClick={(e) => {
                handleOnSubmit(e);
              }}
            >
              IMPORT CSV
            </button>
          </Form.Group>
          <Form.Group as={Col}>
            <button
              className="btn submit_btn w-100"
              onClick={(e) => {
                downloadSampleCsv(e);
              }}
            >
              Download sample CSV file
            </button>
          </Form.Group>
        </Row>
      </form>
    </div>
  );
}
