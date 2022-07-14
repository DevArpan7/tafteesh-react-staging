import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import ReactDragListView from "react-drag-listview";
import "jspdf-autotable";
import { Topbar, SurvivorTopCard } from "../../components";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";

import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBSwitch,
} from "mdb-react-ui-kit";
import Dropdown from "react-bootstrap/Dropdown";
import * as bootstrap from "bootstrap";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Button as IconButton } from "primereact/button";
import {
  MDBAccordion,
  MDBAccordionItem,
  MDBRadio,
  MDBSpinner,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from "../../components/NotificationPage";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import {
  getSurvivorDetails,
  getCitDimensionQuestionList,
  getCitDimensionList,
  // getCitDimensionListAllByVersion,
  getCitList,
  getCitDimensionQuestionsById,
  createCITDetailApi,
  getCitDDetailsListById,
  createCITListOfAction,
  getCitListOfActionsByCitId,
  getCITStarDetails,
  getCITVersionList,
  getCitDimensionListByVersionId
} from "../../redux/action";
import star from "../../assets/img/star.png";
import moment from "moment";
import AlertComponent from "../../components/AlertComponent";
import DatePicker from "../../components/DatePicker";

import "./survivorcit.css";

const SurvivorCIT = (props) => {
  const [modalCitShow, setModalCitShow] = useState(false);
  const [cit, setCits] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [filters1, setFilters1] = useState(null);
  const [isCitLoading, setIsCitLoading] = useState(true);
  const [modalDimensionsShow, setModalDimensionsShow] = useState(false);
  const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const citDimensionList = useSelector((state) => state.citDimensionList);
  const [isLoading, setIsLoading] = useState(true);
  const [cityDimensionStateList, setCityDimensionStateList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [actionListToSend, setActionListToSend] = useState([]);
  const [isShowCitGoalModal, setIsShowCitGoalModal] = useState(false);
  const [isShowCitGoalEditModal, setIsShowCitGoalEditModal] = useState(false);
  const [activity, setActivity] = useState("");
  const [activityToEdit, setActivityToEdit] = useState({});
  const [selectedGoalToEdit, setSelectedGoalToEdit] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [starList, setStartList] = useState([]);
  const citDimensionQuestionList = useSelector(
    (state) => state.citDimensionQuestionList
  );
  const citList = useSelector((state) => state.citList);
  const [defaultData, setDefaultData] = useState({
    // version: 1,
    status: "ongoing",
  });
  const [addCitData, setAddCitData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const api = "https://tafteesh-staging-node.herokuapp.com/api";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };
  const citVersionList = useSelector((state) => state.citVersionList);

  const [selectedData, setSelectedData] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [addDimnsionData, setAddDimensionData] = useState({});
  const [actionList, setActionList] = useState([]);
  const [actionListToShow, setActionListToShow] = useState([]);
  const [open, setOpen] = useState(false);
  const [questionArr, setQuestionArr] = useState([]);
  const [questionObj, setQuestionObj] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [dimensionId, setDimensionId] = useState("");
  const [isShowActionList, setIsShowActionList] = useState(false);
  const [selectedDataCitDetails, setSelectedDataCitDetails] = useState("");
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const openEditActivityModal = (item) => {
    console.log(actionListToShow);
    setSelectedGoalToEdit(item._id);
    setIsShowCitGoalModal(true);
    const actionItem = actionListToShow?.find((t) => t._id === item._id);
    if (actionItem) {
      setActivityList(actionItem.activities);
    }
  };

  const openEditGoal = (item) => {
    setSelectedGoalToEdit(item._id);
    setIsShowCitGoalEditModal(true);
  };
  const citService = citList && citList.length > 0 && citList;

  useEffect(() => {
    setCits(citService);
    //setLoading1(false);
    setTimeout(() => {
      setIsCitLoading(false);
    }, 1000);
    initFilters1();
  }, [citService]);
  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      status: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      createdAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      assessment_date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
    });
    setGlobalFilterValue1("");
  };
  const clearFilter1 = () => {
    initFilters1();
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };

    _filters1["global"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };
  const onSelectRow = (item) => {

    console.log(item,"itemItem")
    setSelectedData(item);
    setSelectedRow(item);
    setActiveClass(true);
    getCitDDetailsListById(item._id).then((res) => {
      setSelectedDataCitDetails(res);
    });
    getCitListOfActionsByCitId(item._id).then((res) => {
      setActionListToShow(res);
    });
    dispatch(getCitDimensionListByVersionId(item.cit_version))

  };
  const onGotoAddcit = () => {
    setModalCitShow(true);
  };

  const onGotoEditcit = () => {
    if (!selectedData._id) {
      alert("Please a CIT to edit");
    } else {
      setModalCitShow(true);
      const setData = { ...selectedData };
      setData.next_assesment_date = moment(setData.next_assesment_date).format(
        "DD-MMM-YYYY"
      );
      setAddCitData(setData);
    }
  };

  const addActivity = (e) => {
    e.preventDefault();
    if (selectedGoalToEdit) {
      const body = { activity };
      axios
        .patch(
          api + "/cit-goal/update/" + selectedGoalToEdit,
          body,
          axiosConfig
        )
        .then((response) => {
          if (response.data && response.data.error === false) {
            getCitListOfActionsByCitId(selectedData?._id).then((res) => {
              setSelectedGoalToEdit("");
              setActivity("");
              setIsShowCitGoalModal(false);
              setActionListToShow(res);
            });
          }
        })
        .catch((error) => {
          console.log(error, "fir add error");
        });
    }
  };

  const onGotoDimension = () => {
    if (selectedData && !selectedData._id) {
      alert("Please select a CIT to add Dimension Info !!");
    } else {
      setModalDimensionsShow(true);
    }
  };

  useEffect(() => {
    if (props.location.state) {
      dispatch(getSurvivorDetails(props.location.state));
    }
    // dispatch(getCitDimensionList());
    // dispatch(getCitDimensionListAllByVersion())
    dispatch(getCITVersionList());
    dispatch(getCitDimensionQuestionList());
    dispatch(getCitList(props.location.state));
  }, [props]);

  useEffect(() => {
    if (survivorDetails) {
      getCITStarDetails(survivorDetails?._id).then((res) => {
        setStartList(res);
      });
    }
  }, [survivorDetails]);

  const onCancel = () => {
    setModalCitShow(false);
    setAddCitData({});
  };

  const onQuestionChange = (e, ques, id) => {
    setDimensionId(id);
    let data = {
      question: ques,
      [e.target.name]: e.target.value,
    };
    if (data && data.answer !== "") {
      setQuestionObj(data);
      setQuestionArr([...questionArr, data]);
    }
  };

  function removeDuplicateObjectFromArray() {
    var check = new Set();
    return questionArr.filter(
      (obj) =>
        !check.has(obj.question) &&
        check.add(obj.question) &&
        check.delete(obj.question)
    );
  }

  async function setQues() {
    for (let i = 0; i < citDimensionList.length; i++) {
      await new Promise((resolve) => {
        getCitDimensionQuestionsById(citDimensionList[i]._id).then((res) => {
          citDimensionList[i].questions = res;
          citDimensionList[i].isLoading = false;
          resolve();
        });
      });
    }

    setCityDimensionStateList(citDimensionList);
    setIsLoading(false);
  }
  useEffect(() => {
    if (citDimensionList.length > 0) setQues();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citDimensionList]);

  ////////////// API CALL FUCTION FOR ADD AND UPDATE CIT ////////
  const addCitFunc = (e) => {
    e.preventDefault();

    let isValid = true;
    if (citList?.length > 0) {
      for (let i = 0; i < citList.length; i++) {
        if (
          moment(addCitData.next_assesment_date).isBetween(
            moment(citList[i].assessment_date),
            moment(citList[i].next_assesment_date)
          ) ||
          moment(addCitData.assessment_date).isBetween(
            moment(citList[i].assessment_date),
            moment(citList[i].next_assesment_date)
          )
        ) {
          isValid = false;
          break;
        }
      }
    }

    // console.warn(pictureData, profile);
    var body = {
      ...addCitData,
      "cit_version": addCitData && addCitData.cit_version ?  addCitData.cit_version  : citVersionList &&
      citVersionList.length > 0 &&
      citVersionList[0]._id,
      "status" : addCitData && addCitData.status ?  addCitData.status  : defaultData.status,
      survivor: props.location.state,
    };
    body.next_assesment_date = moment(body.next_assesment_date).format(
      "YYYY-MM-DD"
    );

    // console.log("body", body)
    if (addCitData && addCitData._id) {
      axios
        .patch(api + "/cit/update/" + addCitData._id, body, axiosConfig)
        .then((response) => {
          console.log(response);
          handleClick();
          setUpdateMessage(response && response.data.message);

          if (response.data && response.data.error === false) {
            const { data } = response;
            dispatch(getCitList(props.location.state));
            setAddCitData({});

            setModalCitShow(false);
          }
        })
        .catch((error) => {
          console.log(error, "fir add error");
        });
    } else {
      if (!isValid) {
        alert("CIT already exists for that data");
        return;
      }
      axios
        .post(api + "/cit/create", body, axiosConfig)
        .then((res) => {
          console.log(res);
          handleClick();
          setUpdateMessage(res && res.data.message);
          if (res && res.data && res.data.error === false) {
            const { data } = res;
            setAddCitData({});
            dispatch(getCitList(props.location.state));

            setModalCitShow(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const updateCit = (e) => {
    e.preventDefault();
    if (addDimnsionData && selectedData?._id) {
      const toSendObj = { ...addDimnsionData };
      if (addDimnsionData.file) {
        const formData = new FormData();
        formData.append("file", addDimnsionData.file);
        axios
          .post(
            "https://tafteesh-staging-node.herokuapp.com/api/file/upload",
            formData,
            axiosConfig
          )
          .then(function (response) {
            if (response && response.data.error === false) {
              const { data } = response;
              const obj = `https://tafteesh-staging-node.herokuapp.com/${
                data.data && data.data.filePath
              }`;
              toSendObj.reference_documents = obj;
              delete toSendObj.file;
              updateCitObj(toSendObj);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        toSendObj.file = "";
        updateCitObj(toSendObj);
      }
    }

    function updateCitObj(toSendObj) {
      axios
        .patch(api + "/cit/update/" + selectedData?._id, toSendObj, axiosConfig)
        .then((response) => {
          handleClick();
          setUpdateMessage(response && response.data.message);

          if (response.data && response.data.error === false) {
            dispatch(getCitList(props.location.state));

            setModalDimensionsShow(false);
            setSelectedData(response.data.result);

            if (selectedData) {
              if (survivorDetails) {
                getCITStarDetails(survivorDetails?._id).then((res) => {
                  setStartList(res);
                });
              }
              getCitDDetailsListById(selectedData._id).then((res) => {
                setSelectedDataCitDetails(res);
              });
              getCitListOfActionsByCitId(selectedData._id).then((res) => {
                setActionListToShow(res);
              });
            }
          }
        })
        .catch((error) => {
          console.log(error, "fir add error");
        });
    }
  };

  const getInputType = (ques) => {
    switch (ques.answer_type) {
      case "textarea":
        return <Form.Control type="text" required />;
      case "select":
        return (
          <Form.Select required>
            <option value="" hidden={true}>
              Default select
            </option>
            {ques.options?.map((opt, index) => {
              return (
                <option key={index} value={opt}>
                  {opt}
                </option>
              );
            })}
          </Form.Select>
        );
      case "radio":
        return (
          <>
            {ques.options?.map((opt, index) => {
              return (
                <Form.Check
                  inline
                  name={`radio_${ques._id}`}
                  className="Radio"
                  key={index}
                  type="radio"
                  label={opt}
                />
              );
            })}
          </>
        );
      case "checkbox":
        return (
          <>
            {ques.options?.map((opt, index) => {
              return (
                <Form.Check
                  inline
                  name="group1"
                  className="Checkbox"
                  key={index}
                  type="checkbox"
                  label={opt}
                />
              );
            })}
          </>
        );
      default:
        break;
    }
  };
  const handleOnSubmit = (e, dimensionId, index) => {
    e.preventDefault();
    const data = {
      cit_id: selectedData?._id,
      dimension_id: dimensionId,
      dimension_detail: [],
      dimension_score: e.target.elements.dimension_score.value,
    };
    let questionsObj = cityDimensionStateList.find(
      (t) => t._id === dimensionId
    );
    questionsObj.questions.forEach((item, index) => {
      if (item.answer_type !== "checkbox" && item.answer_type !== "radio") {
        if (item.answer_type === "select") {
          let toCheckElems = [];

          for (let i = 0; i < item.options?.length; i++) {
            toCheckElems.push(item.options[i]);
          }
          data.dimension_detail.push({
            question_id: item._id,
            answer: toCheckElems.find((t) => t !== "on"),
            action_needed: true,
          });
        } else {
          data.dimension_detail.push({
            question_id: item._id,
            answer: e.target.elements[index].value,
            action_needed: actionListToSend.find(
              (t) => t.dimension_queston === item._id
            )
              ? true
              : false,
          });
        }
      } else if (item.answer_type === "checkbox") {
        let answer = "";
        e.target.elements.group1?.forEach((groupItem, index1) => {
          if (groupItem.checked) {
            answer = answer
              ? answer + "," + item.options[index1]
              : item.options[index1];
          }
        });
        data.dimension_detail.push({
          question_id: item._id,
          answer,
          action_needed: actionListToSend.find(
            (t) => t.dimension_queston === item._id
          )
            ? true
            : false,
        });
      } else if (item.answer_type === "radio") {
        let answer = "";
        let radioItem = `radio_${item._id}`;
        console.log(e.target.elements[radioItem]);
        e.target.elements[radioItem]?.forEach((groupItem, index1) => {
          if (groupItem.checked) {
            answer = answer
              ? answer + "," + item.options[index1]
              : item.options[index1];
          }
        });
        data.dimension_detail.push({
          question_id: item._id,
          answer,
          action_needed: actionListToSend.find(
            (t) => t.dimension_queston === item._id
          )
            ? true
            : false,
        });
      }
    });
    createCITDetailApi(data)
      .then(() => {
        //toggle accordion
        const myCollapse = document
          .getElementById("dynamic_" + index)
          .getElementsByClassName("collapse")[0];
        const buttonCollapse = document
          .getElementById("dynamic_" + index)
          .getElementsByClassName("accordion-button")[0];
        buttonCollapse.classList.add("collapsed");
        const newIndex = index + 1;
        const myCollapse1 = document.getElementById("dynamic_" + newIndex)
          ? document
              .getElementById("dynamic_" + newIndex)
              .getElementsByClassName("collapse")[0]
          : "";
        new bootstrap.Collapse(myCollapse, {
          toggle: true,
        });
        if (myCollapse1) {
          const buttonCollapse1 = document
            .getElementById("dynamic_" + newIndex)
            .getElementsByClassName("accordion-button")[0];
          buttonCollapse1.classList.remove("collapsed");
          new bootstrap.Collapse(myCollapse1, {
            toggle: true,
          });
        }
        alert("Please move to the next accordion!!");
      })
      .catch((err) => {
        alert(err);
      });
    if (actionListToSend.length > 0) {
      const toSendActionList = [...actionListToSend];
      toSendActionList.forEach((item) => {
        item.score = e.target.elements.dimension_score.value;
      });
      createCITListOfAction(actionListToSend).then((res) => {
        setActionList(res);
        setActionListToSend([]);
        setIsShowActionList(true);
      });
    }
  };
  const onDeleteFunction = () => {
    if (selectedGoalToEdit) {
      axios
        .delete(api + "/cit-goal/delete/" + selectedGoalToEdit)
        .then((response) => {
          //console.log(response);
          if (response.data && response.data.error === false) {
            getCitListOfActionsByCitId(selectedData?._id).then((res) => {
              setSelectedGoalToEdit("");
              setShowAlert(false);
              setActionListToShow(res);
            });
          }
        })
        .catch((error) => {
          //console.log(error, "partner error");
        });
    }
  };
  const onActionChange = (item, ques, e) => {
    const toUpdate = [...actionListToSend];
    if (e.target.checked) {
      toUpdate.push({
        cit_id: selectedData?._id,
        dimension_id: item._id,
        dimension_queston: ques._id,
        sr_no:
          toUpdate.length === 0 ? 0 : toUpdate[toUpdate.length - 1].sr_no + 1,
        score: 0,
        department: "",
        duty_bearer: "",
        targeted_date: "",
      });
    } else {
      toUpdate = [];
    }
    setActionListToSend(toUpdate);
  };

  const openDeleteAlert = (item) => {
    setSelectedGoalToEdit(item._id);
    setShowAlert(true);
  };

  const getBodyOfColumn = (row, e) => {
    return (
      <span>
        {e.column.props.dataType === "date"
          ? moment(row[e.column.props.filterField]).format("DD-MMM-YYYY")
          : e.column.props.header === "APPROVED"
          ? row[e.column.props.filterField] === true
            ? "Yes"
            : "No"
          : row[e.column.props.filterField]}
      </span>
    );
  };
  const renderHeader1 = () => {
    return (
      <div className="p-d-flex p-jc-between">
        <IconButton
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
          onClick={clearFilter1}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header1 = renderHeader1();

  // download blank pdf
  const downloadPdf = (type) => {
    const doc = new jsPDF({
      orientation: "landscape",
    });
    const name = "cit" + new Date().toISOString() + ".pdf";
    const citDetails = {
      "CIT DATE":
        type === "blank"
          ? ""
          : moment(selectedData?.createdAt).format("DD-MMM-YYYY"),
      "NEXT ASSESSMENT":
        type === "blank"
          ? ""
          : moment(selectedData?.next_assesment_date).format("DD-MMM-YYYY"),
      STATUS: type === "blank" ? "" : selectedData?.status,
    };
    // add heading
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("CIT DETAILS", 22, 22);

    // add content
    doc.setFontSize(10);
    doc.text("CIT DATE:", 22, 30);
    doc.text(citDetails["CIT DATE"], 60, 30);
    doc.text("NEXT ASSESSMENT:", 22, 40);
    doc.text(citDetails["NEXT ASSESSMENT"], 60, 40);
    doc.text("STATUS:", 22, 50);
    doc.text(citDetails["STATUS"], 60, 50);

    //  // add heading
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("SURVIVOR DETAILS", 22, 70);

    //  // add content
    doc.setFontSize(10);
    doc.text("SURVIVOR NAME:", 22, 84);
    doc.text(survivorDetails?.survivor_name, 60, 84);
    doc.text("SURVIVOR ID", 22, 94);
    doc.text(survivorDetails?.survivor_id, 60, 94);
    // add the list of goal
    doc.setFontSize(20);
    doc.text("Goals/List of Action", 22, 114);
    const goalsColumns = [
      "CREATED DATE",
      "DIMENSION",
      "CIT_ID",
      "DUTY BEARER",
      "DEPARTMENT",
      "STATUS",
    ];
    let goalsRows = [];
    doc.setFontSize(10);
    if (type === "selected" && actionListToShow) {
      actionListToShow.forEach((item) => {
        const temp = [
          moment(item.createdAt).format("DD-MMM-YYYY"),
          item.dimension_id?.name,
          item.cit_id?._id,
          item.duty_bearer,
          item.department,
          item.status || "pending",
        ];
        goalsRows.push(temp);
      });
      doc.autoTable(goalsColumns, goalsRows, { startY: 124, startX: 22 });
    } else {
      doc.autoTable(goalsColumns, goalsRows, { startY: 124, startX: 22 });
    }

    // add the list of dimensions
    doc.setFontSize(20);
    doc.addPage();
    doc.text("Dimensions", 22, 10);
    const dimensionColumns = ["LABEL", "SCORE", "QUESTIONS"];

    let dimensionsRows = [];
    doc.setFontSize(10);
    if (type === "selected" && selectedDataCitDetails) {
      selectedDataCitDetails.forEach((item) => {
        const temp = [item.dimension_id?.name, item.dimension_score, ""];
        dimensionsRows.push(temp);
      });
      doc.autoTable(dimensionColumns, dimensionsRows, {
        startX: 22,
        startY: false,
        columnWidth: "wrap",
        styles: {
          overflow: "linebreak",
          columnWidth: "100",
          cellPadding: 4,
          overflowColumns: "linebreak",
        },
        didDrawCell: (cell) => {
          const body = [];
          if (cell.column.dataKey === 2 && cell.cell.section === "body") {
            if (type !== "blank") {
              const details = selectedDataCitDetails?.find((t) =>
                cell.row.raw.includes(t.dimension_id?.name)
              );
              details?.dimension_detail?.forEach((item1) => {
                const temp2 = [
                  item1.question_id?.data,
                  item1.answer,
                  item1.action_needed ? "Yes" : "No",
                ];
                body.push(temp2);
              });
            }
            doc.autoTable({
              head: [["Questions", "Answers", "Action Required"]],
              body,
              startY: cell.cell.y,
              margin: { left: cell.cell.x },
              tableWidth: "wrap",
              theme: "grid",
              styles: {
                fontSize: 7,
              },
            });
          }
        },
      });
    } else {
      doc.autoTable(dimensionColumns, dimensionsRows, {
        startY: 20,
        startX: 22,
      });
    }
    doc.save(name);
  };

  const closeDimensionModal = () => {
    setModalDimensionsShow(false);
    if (selectedData) {
      getCitDDetailsListById(selectedData._id).then((res) => {
        setSelectedDataCitDetails(res);
      });
      getCitListOfActionsByCitId(selectedData._id).then((res) => {
        setActionListToShow(res);
      });
    }
    if (survivorDetails) {
      getCITStarDetails(survivorDetails?._id).then((res) => {
        setStartList(res);
      });
    }
  };

  const scrollToView = (type) => {
    if (type === "goal") {
      const el = document.getElementById("list_goal_pdf_view");
      window.scrollTo(0, el.offsetTop - 50);
    } else {
      const el = document.getElementById("star-box-view");
      window.scrollTo(0, el.offsetTop);
    }
  };

  const toggleStatus = (item) => {
    axios
      .patch(
        api + "/cit-goal/update/" + item._id,
        { status: !item.status },
        axiosConfig
      )
      .then((response) => {
        if (response.data && response.data.error === false) {
          getCitListOfActionsByCitId(selectedData?._id).then((res) => {
            setActionListToShow(res);
          });
        }
      })
      .catch((error) => {
        console.log(error, "fir add error");
      });
  };

  const onDragDrop = (from, to) => {
    console.log(from, to, "froooo");
    const data = [...actionListToShow];
    data[from].sr_no = to + 1;
    data[to].sr_no = from + 1;
    axios
      .patch(api + "/cit-goal/rearrange-serial-number", data, axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          setActionListToShow(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error, "fir add error");
      });
  };
  const onAssesmentChange = (e) => {
    const nextAssDate = moment(e.target.value)
      .add(6, "M")
      .format("DD-MMM-YYYY");
    setAddCitData({
      ...addCitData,
      next_assesment_date: nextAssDate,
      [e.target.name]: e.target.value,
    });
  };

  const updateActivity = (e) => {
    e.preventDefault();
    if (selectedGoalToEdit) {
      axios
        .patch(
          api + "/cit-goal/update/" + selectedGoalToEdit,
          activityToEdit,
          axiosConfig
        )
        .then((response) => {
          if (response.data && response.data.error === false) {
            getCitListOfActionsByCitId(selectedData?._id).then((res) => {
              setSelectedGoalToEdit("");
              setActivity("");
              setIsShowCitGoalEditModal(false);
              setActionListToShow(res);
            });
          }
        })
        .catch((error) => {
          console.log(error, "fir add error");
        });
    }
  };

  return (
    <>
      <Topbar />
      <main className="main_body">
        <NotificationPage
          handleClose={handleClose}
          open={open}
          message={updateMessage}
        />
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">
                CIT history of{" "}
                {survivorDetails && survivorDetails.survivor_name} (
                {survivorDetails && survivorDetails.survivor_id})
              </h2>
            </div>
            <div className="col-auto">
              <MDBBreadcrumb className="topbreadcrumb">
                <MDBBreadcrumbItem>
                  <Link to="/dashboard">Dashboard</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <Link to="/survivors">Survivors</Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>CIT</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </div>
          </div>
          <div className="topcartbar white_box_shadow">
            <SurvivorTopCard survivorDetails={survivorDetails} />
          </div>

          <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap  position-relative">
            <div className="vieweditdelete">
              <Dropdown className="me-1">
                <Dropdown.Toggle variant="border" className="shadow-0">
                  Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {selectedData && (
                    <>
                      <Dropdown.Item
                        href="javascript:void(0)"
                        onClick={() => onGotoDimension()}
                      >
                        Dimensions
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Item
                    href="javascript:void(0)"
                    onClick={() => scrollToView("goal")}
                  >
                    Goals/List of action
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="javascript:void(0)"
                    onClick={() => scrollToView("star")}
                  >
                    Star
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="javascript:void(0)"
                    onClick={() => downloadPdf("selected")}
                  >
                    Download selected
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="javascript:void(0)"
                    onClick={() => downloadPdf("blank")}
                  >
                    Download Blank
                  </Dropdown.Item>
                  <Dropdown.Item href="/#">Change Log</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <MDBTooltip
                tag="button"
                wrapperProps={{ className: "add_btn view_btn" }}
                title="Add"
              >
                <span onClick={() => onGotoAddcit()}>
                  <i className="fal fa-plus-circle"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "edit_btn" }}
                title="Edit"
              >
                <span onClick={() => onGotoEditcit()}>
                  <i className="fal fa-pencil"></i>
                </span>
              </MDBTooltip>
              <MDBTooltip
                tag="a"
                wrapperProps={{ className: "delete_btn" }}
                title="Delete"
              >
                <i className="fal fa-trash-alt"></i>
              </MDBTooltip>
            </div>
            <div className="table-responsive medium-mobile-responsive">
              <div className="dataTableFilter">
                <DataTable
                  value={cit}
                  paginator
                  loading={isCitLoading}
                  className="dataTableFilter-customers"
                  showGridlines
                  rows={10}
                  selection={selectedRow}
                  onSelectionChange={(e) => onSelectRow(e.value)}
                  dataKey="_id"
                  filters={filters1}
                  filterDisplay="menu"
                  //loading={loading1}
                  responsiveLayout="scroll"
                  globalFilterFields={[
                    "createdAt",
                    "next_assesment_date",
                    "status",
                  ]}
                  header={header1}
                  emptyMessage="No records found."
                >
                  <Column selectionMode="single" />
                  <Column
                    header="CIT DATE"
                    filterField="createdAt"
                    style={{ minWidth: "12rem" }}
                    dataType="date"
                    filter
                    body={getBodyOfColumn}
                    filterPlaceholder="Search by cit date"
                    // filterClear={filterClearTemplate}
                    // filterApply={filterApplyTemplate}
                    // filterFooter={filterFooterTemplate}
                  />
                  <Column
                    header="WELL BEING SCORE"
                    filterField="overall_score"
                    style={{ minWidth: "14rem" }}
                    body={getBodyOfColumn}
                    filter
                  />
                  <Column
                    header="NEXT ASSESSMENT"
                    filterField="next_assesment_date"
                    dataType="date"
                    filterMenuStyle={{ width: "14rem" }}
                    style={{ minWidth: "14rem" }}
                    body={getBodyOfColumn}
                    filter
                    //filterElement={representativeFilterTemplate}
                  />
                  <Column
                    header="STATUS"
                    filterField="status"
                    style={{ minWidth: "14rem" }}
                    body={getBodyOfColumn}
                    filter
                    //filterElement={dateFilterTemplate}
                  />
                  <Column
                    header="APPROVED"
                    filterField="approval"
                    style={{ minWidth: "14rem" }}
                    body={getBodyOfColumn}
                    filter
                  />
                </DataTable>
              </div>
            </div>
          </div>

          {selectedData && (
            <>
              <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap cit_table_wrap position-relative">
                <div className="vieweditdelete">
                  <Dropdown className="me-1">
                    <Dropdown.Toggle variant="border" className="shadow-0">
                      Action
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item>Change Log</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <MDBTooltip
                    tag="button"
                    wrapperProps={{ className: "add_btn view_btn" }}
                    title="Add"
                  >
                    <span onClick={() => onGotoDimension()}>
                      <i className="fal fa-plus-circle"></i>
                    </span>
                  </MDBTooltip>
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "edit_btn" }}
                    title="Edit"
                  >
                    <i className="fal fa-pencil"></i>
                  </MDBTooltip>
                  <MDBTooltip
                    tag="a"
                    wrapperProps={{ className: "delete_btn" }}
                    title="Delete"
                  >
                    <i className="fal fa-trash-alt"></i>
                  </MDBTooltip>
                </div>
                <h4 className="small_heading mb-4">Dimensions</h4>
                {selectedDataCitDetails && (
                  <>
                    <MDBAccordion
                      className="citAccordionWrap"
                      flush
                      id="dimension_accordion_pdf"
                    >
                      {selectedDataCitDetails.map((item, index) => {
                        return (
                          <MDBAccordionItem
                            collapseId={index}
                            key={index}
                            headerTitle={
                              <>
                                {item.dimension_id?.name}
                                <span>{item.dimension_score} / 10</span>
                              </>
                            }
                          >
                            {item.dimension_detail.map((detail, index1) => {
                              return (
                                <div
                                  className="citQuestion_item_wrap"
                                  key={index1}
                                >
                                  <div className="citQuestion_top">
                                    <div className="citQuestion_top_left">
                                      <h3 className="mb-0">Q.{index1 + 1}.</h3>
                                    </div>
                                    <div className="citQuestion_top_middle">
                                      {detail.question_id?.data}
                                    </div>
                                    <div className="citQuestion_top_right">
                                      <div
                                        className={
                                          detail.action_needed
                                            ? "cityesbtn"
                                            : "citnobtn"
                                        }
                                      >
                                        <i className="fal fa-tags"></i>
                                        {detail.action_needed ? "Yes" : "No"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="citQuestion_bottom">
                                    <div className="citQuestion_bottom_left">
                                      <h3 className="mb-0">Ans:</h3>
                                    </div>
                                    <div className="citQuestion_bottom_right">
                                      <div className="citQuestion_bottom_right_other">
                                        {detail.answer}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </MDBAccordionItem>
                        );
                      })}
                    </MDBAccordion>
                  </>
                )}
              </div>
            </>
          )}

          <div className="mt-5 goalsList" id="list_goal_pdf">
            <h4 className="mb-4 small_heading">
              Goals/List of action (Pending -{" "}
              {actionListToShow?.filter((t) => t.status === false).length},
              closed -{" "}
              {actionListToShow?.filter((t) => t.status === true).length})
            </h4>

            <div
              className=" white_box_shadow_20 survivors_table_wrap position-relative"
              id="list_goal_pdf_view"
            >
              <div className="table-responsive medium-mobile-responsive diveMove">
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Created Date</th>
                      <th>Dimension</th>
                      <th>Question</th>
                      <th>Duty Bearer</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ReactDragListView
                      handleSelector="a"
                      onDragEnd={(fromIndex, toIndex) =>
                        onDragDrop(fromIndex, toIndex)
                      }
                    >
                      {actionListToShow && actionListToShow.length > 0 ? (
                        actionListToShow.map((item) => {
                          console.log(item, "looooog");
                          return (
                            <tr>
                              <td>
                                {" "}
                                <a href="javascript:voi(0)" class="move_ic">
                                  <i
                                    class="fa fa-arrows"
                                    aria-hidden="true"
                                  ></i>
                                </a>{" "}
                                {item.sr_no}
                              </td>
                              <td>
                                {item &&
                                  item.createdAt &&
                                  moment(item.createdAt).format("DD/MM/YYYY")}
                              </td>
                              <td>{item.dimension_id?.name}</td>
                              <td>
                                {item.dimension_queston &&
                                  item.dimension_queston.data}
                              </td>
                              <td>{item.duty_bearer}</td>
                              <td>{item.department}</td>
                              <td>
                                {" "}
                                <MDBSwitch
                                  checked={item.status}
                                  onChange={() => toggleStatus(item)}
                                  label={item.status ? "Closed" : "Pending"}
                                />
                              </td>
                              <td>
                                <MDBTooltip
                                  tag="button"
                                  wrapperProps={{ className: "edit_btn" }}
                                  title="Add Activity"
                                >
                                  <span
                                    onClick={() => openEditActivityModal(item)}
                                  >
                                    <i className="fal fa-pencil"></i>
                                  </span>
                                </MDBTooltip>
                                <MDBTooltip
                                  tag="button"
                                  wrapperProps={{ className: "edit_btn" }}
                                  title="Edit"
                                >
                                  <span onClick={() => openEditGoal(item)}>
                                    <i className="fal fa-pencil"></i>
                                  </span>
                                </MDBTooltip>
                                <MDBTooltip
                                  tag="button"
                                  wrapperProps={{
                                    className: "delete_btn-goal",
                                  }}
                                  title="Delete"
                                >
                                  <span onClick={() => openDeleteAlert(item)}>
                                    <i className="fal fa-trash-alt"></i>
                                  </span>
                                </MDBTooltip>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={4}>
                            <b>NO Data Found !!</b>
                          </td>
                        </tr>
                      )}
                    </ReactDragListView>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {selectedData && selectedData.analysis_ans && (
            <div className="mt-5 goalsList">
              <h4 className="mb-4 small_heading">
                Analysis ,Priorities of the survivor
              </h4>
              <div className=" white_box_shadow_20 survivors_table_wrap position-relative">
                <div className="table-responsive medium-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td>
                          {selectedData ? selectedData.analysis_ans : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {starList.length > 0 && (
            <div className="mt-5 starBox" id="star-box-view">
              <h4 className="mb-4 small_heading">Star</h4>
              <div className="white_box_shadow survivors_table_wrap position-relative">
                <div className="starBox_row">
                  <div className="starBox_col">
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>1</span>
                        <h5>{starList[0].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[0].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="starBox_col">
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>2</span>
                        <h5>{starList[1].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[1].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="starBox_col">
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>3</span>
                        <h5>{starList[2].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[2].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="starBox_col starBox_col_tow">
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>4</span>
                        <h5>{starList[3].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[3].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>6</span>
                        <h5>{starList[4].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[4].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="starBox_col starBox_col_img">
                    <div className="starBox_img">
                      <img src={star} alt="" />
                    </div>
                  </div>
                  <div className="starBox_col starBox_col_tow">
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>5</span>
                        <h5>{starList[5].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[5].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>7</span>
                        <h5>{starList[6].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[6].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="starBox_col">
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>8</span>
                        <h5>{starList[7].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[7].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="starBox_col">
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>9</span>
                        <h5>{starList[8].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[8].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="starBox_col">
                    <div className="starBox_item">
                      <div className="starBox_item_top">
                        <span>10</span>
                        <h5>{starList[9].dimension.name}</h5>
                      </div>
                      <div className="starBox_item_bottom">
                        {starList[9].cits?.map((item, index) => {
                          return (
                            <div
                              className="starBox_item_bottom_list"
                              key={index}
                            >
                              <div className="starBox_item_bottom_list_name">
                                {index + 1}
                              </div>
                              <div className="starBox_item_bottom_list_list_date">
                                {moment(item.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="starBox_item_bottom_list_list_count">
                                {item.score}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedData?.significant_observations ||
          selectedData?.reference_documents?.length > 0 ? (
            <div className="mt-5 signficantList">
              <h4 className="mb-4 small_heading">Significant Observations</h4>
              <div className=" white_box_shadow_20 survivors_table_wrap position-relative">
                <div className="table-responsive medium-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        {selectedData?.significant_observations && (
                          <th>Significant Observations</th>
                        )}
                        {selectedData?.reference_documents?.length > 0 && (
                          <th>Reference Document</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {selectedData?.significant_observations && (
                          <td>{selectedData.significant_observations}</td>
                        )}

                        {selectedData &&
                          selectedData.reference_documents &&
                          selectedData.reference_documents.length > 0 && (
                            <td>
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={
                                  selectedData &&
                                  selectedData.reference_documents &&
                                  selectedData.reference_documents.length > 0
                                    ? selectedData.reference_documents[0]
                                    : "javascript:void(0)"
                                }
                              >
                                {selectedData &&
                                selectedData.reference_documents &&
                                selectedData.reference_documents.length > 0
                                  ? selectedData.reference_documents[0]
                                  : "N/A"}
                              </a>
                            </td>
                          )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {selectedData && selectedData.caregivers && (
            <div className="mt-5 goalsList">
              <h4 className="mb-4 small_heading">Parents/Caregivers</h4>
              <div className=" white_box_shadow_20 survivors_table_wrap position-relative">
                <div className="table-responsive medium-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td>
                          {selectedData ? selectedData.caregivers : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {selectedData && selectedData.overall_score && (
            <div className="mt-5 goalsList">
              <h4 className="mb-4 small_heading">Overall score</h4>
              <div className=" white_box_shadow_20 survivors_table_wrap position-relative">
                <div className="table-responsive medium-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td>
                          {selectedData ? selectedData.overall_score : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {selectedData?.worry_statements || selectedData?.goal_statements ? (
            <div className="mt-5 signficantList">
              <h4 className="mb-4 small_heading">Statements</h4>
              <div className=" white_box_shadow_20 survivors_table_wrap position-relative">
                <div className="table-responsive medium-mobile-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        {selectedData?.worry_statements && (
                          <th>Worry Statements</th>
                        )}
                        {selectedData?.goal_statements && (
                          <th>Goal Statement</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {selectedData?.worry_statements && (
                          <td>{selectedData.worry_statements}</td>
                        )}
                        {selectedData?.goal_statements && (
                          <td>{selectedData.goal_statements}</td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <Modal
        className="addFormModal"
        show={modalCitShow}
        onHide={setModalCitShow}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add CIT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Assessment Date</Form.Label>
                  <DatePicker
                    name="assessment_date"
                    datePickerChange={(e) => onAssesmentChange(e)}
                    data={
                      addCitData &&
                      addCitData.assessment_date &&
                      addCitData.assessment_date
                    }
                    // message={"Please select Application Date"}
                  />
                  {/* <Form.Control
                    onChange={(e) => onAssesmentChange(e)}
                    name="assessment_date"
                    value={
                      addCitData &&
                      addCitData.assessment_date &&
                      moment(addCitData.assessment_date).format("YYYY-MM-DD")
                    }
                    type="date"
                  /> */}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Next Assessment</Form.Label>
                  <Form.Control
                    name="next_assesment_date"
                    disabled
                    value={addCitData?.next_assesment_date}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Version</Form.Label>
                 
                  <Form.Select
                    name="cit_version"
                    onChange={(e) =>
                      setAddCitData({
                        ...addCitData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={addCitData && addCitData.cit_version ?  addCitData.cit_version  : citVersionList &&
                      citVersionList.length > 0 &&
                      citVersionList[0]._id}
                  >
                    <option hidden={true}>Please Select</option>
                    {citVersionList &&
                      citVersionList.length > 0 &&
                      citVersionList.map((item) => {
                        return <option value={item && item._id}>{item && item.name}</option>
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    onChange={(e) =>
                      setAddCitData({
                        ...addCitData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={addCitData && addCitData.status ?  addCitData.status  : defaultData.status}
                  >
                    <option hidden={true}>Please Select</option>
                    <option value={"ongoing"}>Ongoing</option>
                    <option value={"closed"}>Closed</option>
                    <option value={"completed"}>Completed</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </Button>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={
                      addCitData && !addCitData.assessment_date
                        ? true
                        : !addCitData.next_assesment_date
                        ? true
                        : false
                    }
                    onClick={addCitFunc}
                    className="submit_btn shadow-0"
                  >
                    Submit
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="addFormModal"
        show={modalDimensionsShow}
        onHide={() => closeDimensionModal()}
        size="xl"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Dimensions Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MDBAccordion
            className="citModalAccordionWrap"
            flush
            id="dimension_details_add"
          >
            {isLoading ? (
              <MDBSpinner></MDBSpinner>
            ) : (
              <>
                {cityDimensionStateList &&
                  cityDimensionStateList.length > 0 &&
                  cityDimensionStateList.map((item, index) => {
                    return (
                      <MDBAccordionItem
                        //onClick={() => getQuestionsList(item)}
                        collapseId={index}
                        headerTitle={item?.name}
                        key={index}
                        id={"dynamic_" + index}
                      >
                        {item.isLoading ? (
                          <MDBSpinner />
                        ) : (
                          <>
                            <Form
                              onSubmit={(e) =>
                                handleOnSubmit(e, item._id, index)
                              }
                            >
                              {item &&
                                item.questions &&
                                item.questions.length > 0 &&
                                item.questions.map((ques, index) => {
                                  let idx = index + 1;
                                  return (
                                    <div
                                      className="citQuestion_item_wrap"
                                      key={index}
                                    >
                                      <div className="citQuestion_top">
                                        <div className="citQuestion_top_left">
                                          <h3 className="mb-0">Q.{idx}.</h3>
                                        </div>
                                        <div className="citQuestion_top_middle">
                                          {ques.data}
                                          <span>
                                            {" "}
                                            <Form.Check
                                              inline
                                              name="action-required"
                                              key={index}
                                              type="checkbox"
                                              label={"Action Required"}
                                              onChange={(e) =>
                                                onActionChange(item, ques, e)
                                              }
                                            />
                                          </span>
                                        </div>
                                      </div>
                                      <div className="citQuestion_bottom">
                                        <div className="citQuestion_bottom_left">
                                          <h3 className="mb-0">Ans:</h3>
                                        </div>
                                        <div className="citQuestion_bottom_right">
                                          <Row>
                                            <div className="col-lg-6">
                                              <div className="citQuestion_bottom_rightInput_box">
                                                {getInputType(ques)}
                                              </div>
                                            </div>
                                          </Row>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              <div
                                className="citQuestion_item_wrap"
                                key={index}
                              >
                                <div className="citQuestion_bottom">
                                  <div className="citQuestion_bottom_right">
                                    <Row>
                                      <div className="col-lg-6">
                                        <div className="citQuestion_bottom_rightInput_box">
                                          <label>Dimension Score</label>
                                          <Form.Control
                                            type="number"
                                            name="dimension_score"
                                            required
                                          />
                                        </div>
                                      </div>
                                    </Row>
                                  </div>
                                </div>
                              </div>

                              <Row className="justify-content-end">
                                <Form.Group as={Col} xs="auto">
                                  <Button
                                    type="submit"
                                    className="submit_btn shadow-0"
                                  >
                                    Save
                                  </Button>
                                </Form.Group>
                              </Row>
                            </Form>
                          </>
                        )}
                      </MDBAccordionItem>
                    );
                  })}
              </>
            )}
          </MDBAccordion>
          <Form onSubmit={updateCit}>
            <div className="citItemBox">
              <div className="citItemBox__title">Overall score</div>
              <div className="citItemBox__fields">
                <Row>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Overall score</Form.Label>
                    <Form.Control
                      type="number"
                      name="overall_score"
                      required
                      onChange={(e) =>
                        setAddDimensionData({
                          ...addDimnsionData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Row>
              </div>
            </div>
            <div className="citItemBox">
              <div className="citItemBox__title">Statements</div>
              <div className="citItemBox__fields">
                <Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Worry statements:</Form.Label>
                    <Form.Control
                      name="worry_statements"
                      onChange={(e) =>
                        setAddDimensionData({
                          ...addDimnsionData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      type="text"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Goal statements:</Form.Label>
                    <Form.Control
                      type="text"
                      name="goal_statements"
                      onChange={(e) =>
                        setAddDimensionData({
                          ...addDimnsionData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Row>
              </div>
            </div>

            <div className="citItemBox">
              <div className="citItemBox__title">
                Analysis, Priorities of the survivor
              </div>
              <div className="citItemBox__fields">
                <Row>
                  <Form.Group as={Col} md="12">
                    <Form.Label>
                      Strengths and resources available as of now? What’s going
                      on well? Who are the supportive people around?
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="analysis_ans"
                      onChange={(e) =>
                        setAddDimensionData({
                          ...addDimnsionData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Row>
              </div>
            </div>

            <div className="citItemBox">
              <div className="citItemBox__title">Parents/careivers</div>
              <div className="citItemBox__fields">
                <Row>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Parents/careivers</Form.Label>
                    <Form.Control
                      type="text"
                      name="caregivers"
                      onChange={(e) =>
                        setAddDimensionData({
                          ...addDimnsionData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Row>
              </div>
            </div>
            <div className="citItemBox">
              <div className="citItemBox__title">Significant Observations</div>
              <div className="citItemBox__fields">
                <Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Significant Observations</Form.Label>
                    <Form.Control
                      type="text"
                      name="significant_observations"
                      onChange={(e) =>
                        setAddDimensionData({
                          ...addDimnsionData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Reference Document</Form.Label>
                    <Form.Control
                      type="file"
                      name="file"
                      onChange={(e) =>
                        setAddDimensionData({
                          ...addDimnsionData,
                          [e.target.name]: e.target.files[0],
                        })
                      }
                    />
                  </Form.Group>
                </Row>
              </div>
            </div>
            <div className="citItemBox">
              <div className="citItemBox__title">List of actions</div>
              <div className="table-responsive medium-mobile-responsive">
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr>
                      <th width="10%">Created Date</th>
                      <th width="18%">Dimension</th>
                      <th width="18%">Question</th>
                      <th width="18%">Duty Bearer</th>
                      <th width="18%">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isShowActionList && actionList?.length > 0 ? (
                      actionList.map((item) => {
                        return (
                          <tr>
                            <td>
                              {item &&
                                item.createdAt &&
                                moment(item.createdAt).format("DD/MM/YYYY")}
                            </td>
                            <td>{item.dimension_id?.name}</td>
                            <td>
                              {item.dimension_queston &&
                                item.dimension_queston?.data}
                            </td>
                            <td>{item.duty_bearer}</td>
                            <td>{item.department}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="text-center" colSpan={4}>
                          <b>NO Data Found !!</b>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Row className="justify-content-between">
              <Form.Group as={Col} md="auto">
                <Button
                  type="button"
                  className="shadow-0 cancle_btn"
                  color="danger"
                  onClick={() => setModalDimensionsShow(false)}
                >
                  Cancel
                </Button>
              </Form.Group>
              <Form.Group as={Col} md="auto">
                <Button type="submit" className="submit_btn shadow-0">
                  Submit
                </Button>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        className="updateCitGoalModal"
        show={isShowCitGoalModal}
        onHide={setIsShowCitGoalModal}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Goals/List of action activity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            {activityList.length > 0 && (
              <>
                <h6>Activity List</h6>
                <MDBListGroup>
                  {activityList.map((item, index) => {
                    return (
                      <MDBListGroupItem key={index}>{item}</MDBListGroupItem>
                    );
                  })}
                </MDBListGroup>
              </>
            )}
            <Form onSubmit={addActivity}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Activity</Form.Label>
                  <Form.Control
                    onChange={(e) => setActivity(e.target.value)}
                    name="activity"
                    value={activity}
                    type="text"
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setIsShowCitGoalModal(false)}
                  >
                    Cancel
                  </Button>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={activity ? false : true}
                    className="submit_btn shadow-0"
                  >
                    Submit
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="updateCitGoalModal"
        show={isShowCitGoalEditModal}
        onHide={setIsShowCitGoalEditModal}
        size="lg"
        aria-labelledby="reason-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Goals/List of action
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="site_form_wraper">
            <Form onSubmit={updateActivity}>
              <Row>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Duty Bearer</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setActivityToEdit({
                        ...activityToEdit,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="duty_bearer"
                    value={activityToEdit.duty_bearer}
                    type="text"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setActivityToEdit({
                        ...activityToEdit,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="department"
                    value={activityToEdit.department}
                    type="text"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Targetted Date</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setActivityToEdit({
                        ...activityToEdit,
                        [e.target.name]: e.target.value,
                      })
                    }
                    name="targeted_date"
                    value={
                      addCitData &&
                      addCitData.targeted_date &&
                      moment(addCitData.targeted_date).format("YYYY-MM-DD")
                    }
                    type="date"
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-between">
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="button"
                    className="shadow-0 cancle_btn"
                    color="danger"
                    onClick={() => setIsShowCitGoalEditModal(false)}
                  >
                    Cancel
                  </Button>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                  <Button
                    type="submit"
                    disabled={
                      Object.keys(activityToEdit).length > 0 ? false : true
                    }
                    className="submit_btn shadow-0"
                  >
                    Submit
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {showAlert === true && (
        <AlertComponent
          showAlert={showAlert}
          handleCloseAlert={() => setShowAlert(false)}
          onDeleteFunction={onDeleteFunction}
        />
      )}
    </>
  );
};

export default SurvivorCIT;
