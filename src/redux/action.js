import axios from "../utils/axios";
const api = "https://tafteesh-staging-node.herokuapp.com/api/";

const token = localStorage.getItem("accessToken");
let axiosConfig = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${token}`,
  },
};

// ////// API CALL FOR GET STATE LIST /////

const stateList = (data) => {
  //console.log(data, "state reducers");
  return {
    type: "STATE_LIST",
    data: data,
  };
};
export const getStateList = () => {

  return (dispatch) => {
    axios
      .get(api + "state/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(stateList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "stateList error");
      });
  };
};

/////// API CALL FOR DISTRICT LIST /////////

const districtList = (data) => {
  //console.log(data, "district reducers");
  return {
    type: "DISTRICT_LIST",
    data: data,
  };
};
export const getDistrictList = (id) => {
  return (dispatch) => {
    axios
      .get(api + "district/list-by-state/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(districtList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "district error");
      });
  };
};

/////// API CALL FOR MASTER DISTRICT LIST /////////

const masterDistrictList = (data) => {
  //console.log(data, "masterDistrictList reducers");
  return {
    type: "MASTER_DISTRICT_LIST",
    data: data,
  };
};
export const getMasterDistrictList = () => {
  return (dispatch) => {
    axios
      .get(api + "district/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(masterDistrictList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "masterDistrictList error");
      });
  };
};

/////// API CALL FOR BLOCK LIST /////

const blockList = (data) => {
  //console.log(data, "block reducers");
  return {
    type: "BLOCK_LIST",
    data: data,
  };
};
export const getBlockList = (stateId,distId) => {
  return (dispatch) => {
    axios
      .get(api + "block/list-by-state-district/"+stateId+"/"+distId)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(blockList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "block error");
      });
  };
};



/////// API CALL FOR BLOCK LIST /////

const masterBlockList = (data) => {
  //console.log(data, "masterBlockList reducers");
  return {
    type: "MASTER_BLOCK_LIST",
    data: data,
  };
};
export const getMasterBlockList = () => {
  return (dispatch) => {
    axios
      .get(api + "block/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(masterBlockList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "masterBlockList error");
      });
  };
};

/////// API CALL FOR SHG LIST /////

const shgList = (data) => {
  //console.log(data, "SHG reducers");
  return {
    type: "SHG_LIST",
    data: data,
  };
};
export const getShgList = () => {
  return (dispatch) => {
    axios
      .get(api + "shg/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(shgList(data));
        }
      })
      .catch((error) => {
        //console.log(error, "shg error");
      });
  };
};

export const deleteShg = (id) => {
  return (dispatch) => {
    axios
      .patch(api + "shg/delete/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getShgList());
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
};
/////// API CALL FOR POLICE STATION LIST /////

const policeStationList = (data) => {
  //console.log(data, "policeStation reducers");
  return {
    type: "POLICE_STATION_LIST",
    data: data,
  };
};
export const getPoliceStationList = () => {
  return (dispatch) => {
    axios
      .get(api + "police-station/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(policeStationList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "policeStation error");
      });
  };
};

////// API CALL FOR COLLECTIVES LIST /////

const collectivesList = (data) => {
  //console.log(data, "collectives reducers");
  return {
    type: "COLLECTIVES_LIST",
    data: data,
  };
};
export const getCollectivesList = () => {
  return (dispatch) => {
    axios
      .get(api + "collective/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(collectivesList(data));
        }
      })
      .catch((error) => {
        //console.log(error, "collectives error");
      });
  };
};

export const deleteCollective = (id) => {
  return (dispatch) => {
    axios
      .patch(api + "collective/delete/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getCollectivesList());
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
};

////// API CALL FOR SURVIVOR LIST /////

const survivorList = (data) => {
  //console.log(data, "survivor reducers");
  return {
    type: "SURVIVOR_LIST",
    data: data,
  };
};



// export const getSurvivorList = () => {
//   return (dispatch) => {
//     dispatch({ type: 'LOADING_CONCERTS' });
//     return axios.get(api + "survival-profile/list",axiosConfig)
//       .then(response => {
//         const { data } = response;
//         dispatch({ type: 'GET_CONCERTS', data })
//         dispatch({ type: 'SET_CONCERTS', data })
//         dispatch(survivorList(data))
//       })
//       .catch( err=> {
       
//       }
//       )
//     }
// }


export const getSurvivorList = (id) => {
  return (dispatch) => {
    axios
      .get(api + "survival-profile/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "survivor error");
      });
  };
};




const allsurvivorList = (data) => {
  //console.log(data, "survivor reducers");
  return {
    type: "ALL_SURVIVOR_LIST",
    data: data,
  };
};

export const getAllSurvivorList = () => {
  return (dispatch) => {
    axios
      .get(api + "survival-profile/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(allsurvivorList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "survivor error");
      });
  };
};


////////////survivor search API clling ////////////

// export const servivorSearchApi = (body) => {
//   return (dispatch) => {
//     dispatch({ type: 'LOADING_CONCERTS' });
//     return axios.post(api + "survival-profile/search",body)
//       .then(response => {
//         const { data } = response;
//         console.log(data,"action data")
//         dispatch({ type: 'GET_CONCERTS', data })
//         dispatch({ type: 'SET_CONCERTS', data })
//         dispatch(survivorList(data.data))
//       })
//       .catch( err=> {
       
//       }
//       )
//     }
// }

export const servivorSearchApi = (body) => {
  return (dispatch) => {
    axios
      .post(api + "survival-profile/search",body)
      .then((response) => {
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "survivor error");
      });
  };
};




////// API CALL FOR PARTICIPATION LIST /////

const participationList = (data) => {
  //console.log(data, "participation reducers");
  return {
    type: "PARTICIPATION_LIST",
    data: data,
  };
};


export const getParticipationList = (id) => {
  //console.log(id)
  return (dispatch) => {
    axios
      .get(api + "survival-participation/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(participationList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "participation error");
      });
  };
};




////// API CALL FOR ROLE LIST /////

const roleList = (data) => {
  //console.log(data, "role reducers");
  return {
    type: "ROLE_LIST",
    data: data,
  };
};


export const getRoleList = () => {
  return (dispatch) => {
    axios
      .get(api + "role/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(roleList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "role error");
      });
  };
};





////// API CALL FOR ORGANIZATION LIST /////

const organizationList = (data) => {
  //console.log(data, "organization reducers");
  return {
    type: "ORGANIZATION_LIST",
    data: data,
  };
};


export const getOrganizationList = () => {
  return (dispatch) => {
    axios
      .get(api + "organization/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(organizationList(data));
        }
      })
      .catch((error) => {
        //console.log(error, "organization error");
      });
  };
};




export const deleteOrganisation = (id) => {
  return (dispatch) => {
    axios
      .patch(api + "organization/delete/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getOrganizationList());
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
};

//////////////////GET ALL USER LIST API CALL //////////


const usersList = (data) => {
  //console.log(data, "user reducers");
  return {
    type: "USERS_LIST",
    data: data,
  };
};


export const getUsersList = () => {
  return (dispatch) => {
    axios
      .get(api + "user/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(usersList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "user error");
      });
  };
};

////////////user search API clling ////////////
export const usersSearchApi = (body) => {
  return (dispatch) => {
    axios
      .post(api + "user/search",body)
      .then((response) => {
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(usersList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "survivor error");
      });
  };
};




//////////////////GET survivor DETAILS API CALL //////////


const survivorDetails = (data) => {
  //console.log(data, "survivor details reducers");
  return {
    type: "SURVIVOR_DETAILS",
    data: data,
  };
};
const survivorActionDetails = (data) => {
  //console.log(data, "survivor details reducers");
  return {
    type: "SURVIVOR_ACTION_DETAILS",
    data: data,
  };
};

export const getSurvivorDetails = (id) => {
  return (dispatch) => {
    axios
      .get(api + "survival-profile/detail/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorDetails(data.data));
          dispatch(survivorActionDetails(data.profileDetails));

        }
      })
      .catch((error) => {
        //console.log(error, "survivor details error");
      });
  };
};


//////////////////GET ALL TRAFFICKER LIST API CALL //////////


const traffickerList = (data) => {
  //console.log(data, "trafficker reducers");
  return {
    type: "TRAFFICKER_LIST",
    data: data,
  };
};


export const getTraffickerList = () => {
  return (dispatch) => {
    axios
      .get(api + "trafficker-Profile/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(traffickerList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "trafficker error");
      });
  };
};



//////////////////ADD FIR API CALL //////////


const firList = (data) => {
  //console.log(data, "firList reducers");
  return {
    // type: "FIR_LIST",
    data: data,
  };
};



export const getFirList = (id) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_CONCERTS' });
    return axios.get(api + "survival-fir/list/"+id,axiosConfig)
      .then(response => {
        const { data } = response;
        dispatch({ type: 'GET_CONCERTS', data })
        dispatch({ type: 'SET_CONCERTS', data })
        dispatch(firList(data.data))
      })
      .catch( err=> {
        // console.log(err.code)
        // console.log(err.message)
        // console.log(err.stack)
      }
      )
    }
}
// export const getFirList = (id) => {
//   return (dispatch) => {
//     axios
//       .get(api + "survival-fir/list/"+id,axiosConfig)
//       .then((response) => {
//         //console.log(response);
//         if (response.data && response.data.error === false) {
//           const { data } = response;

//           dispatch(firList(data.data));
//         }
//       })
//       .catch((error) => {
//         //console.log(error, "fir error");
//       });
//   };
// };


//////////////////GET CHARGE SHEET LIST API CALL //////////


const chargeSheetList = (data) => {
  //console.log(data, "charge sheet reducers");
  return {
    type: "CHARGE_SHEET_LIST",
    data: data,
  };
};


export const getChargeSheetList = (id) => {
  //console.log(id,"id");
  return (dispatch) => {
    axios
      .get(api + "survival-chargesheet/list/"+id,axiosConfig)
      .then((response) => {
        // console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(chargeSheetList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "charge sheet error");
      });
  };
};


export const getChargeSheetListByFirIdandInvestId = (survId,firId,investId) => {
  //console.log(id,"id");
  return (dispatch) => {
    axios
      .get(api + "survival-chargesheet/list/"+survId+"/"+firId+"/"+investId,axiosConfig)
      .then((response) => {
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(chargeSheetList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "charge sheet error");
      });
  };
};


//////////////////GET CHARGE SHEET LIST API CALL //////////


const supplimentarychargeSheetList = (data) => {
  //console.log(data, "charge sheet reducers");
  return {
    type: "SUPPLIMENTARY_CHARGE_SHEET_LIST",
    data: data,
  };
};


export const getSupplimentaryChargeSheetList = (id) => {
  console.log(id,"id");
  return (dispatch) => {
    axios
      .get(api + "supplimentary-chargesheet/list/"+id,axiosConfig)
      .then((response) => {
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;
          dispatch(supplimentarychargeSheetList(data.data));
        }
      })
      .catch((error) => {
        console.log(error, "charge sheet error");
      });
  };
};


//////////////////GET INVESTIGATION LIST API CALL //////////


const investigationList = (data) => {
  //console.log(data, "investigationList reducers");
  return {
    type: "INVESTIGATION_LIST",
    data: data,
  };
};


export const getInvestigationList = (id) => {
  //console.log(id,"id");
  return (dispatch) => {
    axios
      .get(api + "survival-investigation/list/"+id,axiosConfig)
      .then((response) => {
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(investigationList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "investigationList error");
      });
  };
};


export const getInvestigationListByFirId = (surid,firid) => {
  //console.log(id,"id");
  return (dispatch) => {
    axios
      .get(api + "survival-investigation/list/"+surid+"/"+firid,axiosConfig)
      .then((response) => {
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(investigationList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "investigationList error");
      });
  };
};



//////////////////GET RESCUE LIST API CALL //////////


const rescueList = (data) => {
  //console.log(data, "rescueList reducers");
  return {
    type: "RESCUE_LIST",
    data: data,
  };
};


export const getRescueList = (id) => {
  console.log(id,"id");
  return (dispatch) => {
    axios
      .get(api + "survival-rescue/list/"+id,axiosConfig)
      .then((response) => {
        console.log(response,'responseeeeeeeeeeeeeeeeeee');
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(rescueList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "rescueList error");
      });
  };
};



//////////////////GET ALL LAWYERS LIST API CALL //////////


const lawyersList = (data) => {
  //console.log(data, "lawyers reducers");
  return {
    type: "LAWYERS_LIST",
    data: data,
  };
};


export const getLawyersList = () => {
  return (dispatch) => {
    axios
      .get(api + "lawyer/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(lawyersList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "lawyers error");
      });
  };
};





//////////////////GET ALL LAWYERS LIST BY CAT ID API CALL //////////


const lawyersListByCatId = (data) => {
  //console.log(data, "lawyers reducers");
  return {
    type: "LAWYERS_LIST_CATEGORY_ID",
    data: data,
  };
};


export const getLawyersListByCatId = (id) => {
  return (dispatch) => {
    axios
      .get(api + "lawyer/list-by-category/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(lawyersListByCatId(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "lawyers error");
      });
  };
};


//////////////////GET ALL LAWYERS CATEGORY LIST API CALL //////////

const lawyersCategoryList = (data) => {
  //console.log(data, "lawyers category reducers");
  return {
    type: "LAWYERS_CATEGORY_LIST",
    data: data,
  };
};


export const getLawyersCategoryList = () => {
  return (dispatch) => {
    axios
      .get(api + "lawyer-category/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(lawyersCategoryList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "lawyers category error");
      });
  };
};


//////////////////GET ALL SURVIVOR LAWYERS LIST API CALL //////////


const survivorLawyersList = (data) => {
  //console.log(data, "Shelter home reducers");
  return {
    type: "SURVIVOR_LAWYERS_LIST",
    data: data,
  };
};


export const getSurvivorLawyersList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"survivor-lawyer/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorLawyersList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "shelter home vc error");
      });
  };
};

//////////////////GET ALL COURT LIST API CALL //////////


const courtList = (data) => {
  //console.log(data, "court reducers");
  return {
    type: "COURT_LIST",
    data: data,
  };
};


export const getCourtList = () => {
  return (dispatch) => {
    axios
      .get(api + "court/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(courtList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "court error");
      });
  };
};


//////////////////GET ALL VC LIST API CALL //////////


const survivalVcList = (data) => {
  //console.log(data, "vc reducers");
  return {
    type: "VC_LIST",
    data: data,
  };
};


export const getSurvivalVcList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"survival-vc/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivalVcList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "survival vc error");
      });
  };
};




//////////////////GET ALL SVC ESCALATION LIST API CALL //////////

const vcEscalationList = (data) => {
  //console.log(data, "vc escalation reducers");
  return {
    type: "VC_ESCALATION_LIST",
    data: data,
  };
};


export const getVcEscalationList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"vc-escalation/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(vcEscalationList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "vc escalation error");
      });
  };
};



//////////////////GET ALL SVC ESCALATION 2 LIST API CALL //////////
const vcEscalation2List = (data) => {
  //console.log(data, "vc escalation reducers");
  return {
    type: "VC_ESCALATION_2_LIST",
    data: data,
  };
};


export const getVcEscalation2List = (vcId,escalId) => {
  return (dispatch) => {
    axios
      .get(api +"vc-escalation/list-2/"+vcId+"/"+escalId)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(vcEscalation2List(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "vc escalation error");
      });
  };
};

//////////////////GET ALL SHELTER HOME LIST API CALL //////////


const shelterHomeList = (data) => {
  //console.log(data, "Shelter home reducers");
  return {
    type: "SHELTER_HOME_LIST",
    data: data,
  };
};


export const getShelterHomeList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"shelter-home/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(shelterHomeList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "shelter home vc error");
      });
  };
};


//////////////////GET ALL SURVIVAL LOAN LIST API CALL //////////

const survivalLoanList = (data) => {
  //console.log(data, "Survival loan reducers");
  return {
    type: "SURVIVAL_LOAN_LIST",
    data: data,
  };
};


export const getSurvaivalLoanList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"survival-loan/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivalLoanList(data));
        }
      })
      .catch((error) => {
        //console.log(error, "survival loan error");
      });
  };
};


//////////////////GET ALL PC ESCALATION LIST API CALL //////////

const pcEscalationList = (data) => {
  //console.log(data, "pc escalation reducers");
  return {
    type: "PC_ESCALATION_LIST",
    data: data,
  };
};


export const getPcEscalationList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"pc-escalation/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(pcEscalationList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "escalation error");
      });
  };
};




//////////////////GET ALL PC LIST API CALL //////////

const survivorPcList = (data) => {
  //console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_PC_LIST",
    data: data,
  };
};


export const getSurvivorPcList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"survival-pc/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorPcList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "survivorPcList error");
      });
  };
};

//////////////////GET ALL SURVIVAL NEXT PLAN LIST API CALL //////////

const nextPlanList = (data) => {
  //console.log(data, "nextPlanList reducers");
  return {
    type: "SURVIVAL_NEXT_PLAN_LIST",
    data: data,
  };
};


export const getNextPlanList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"survival-nextplanaction/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(nextPlanList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "nextPlanList error");
      });
  };
};


/////////////////GET ALL SURVIVAL INCOME LIST API CALL //////////

const incomeList = (data) => {
  //console.log(data, "incomeList reducers");
  return {
    type: "SURVIVAL_INCOME_LIST",
    data: data,
  };
};


export const getSurvivalIncomeList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"survival-income/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(incomeList(data));
        }
      })
      .catch((error) => {
        //console.log(error, "incomeList error");
      });
  };
};



/////////////////GET ALL SURVIVAL DOCUMENT LIST API CALL //////////

const survivalDocList = (data) => {
  //console.log(data, "survivalDocList reducers");
  return {
    type: "SURVIVAL_DOCUMENT_LIST",
    // type: "GET_CONCERTS",
    data: data,
  };
};


// export const getSurvivalDocList = (id) => {
//   return (dispatch) => {
//     dispatch({ type: 'LOADING_CONCERTS' });
//     return axios.get(api + "survival-document/list/"+id,axiosConfig)
//       .then(response => {
//         const { data } = response;
//         dispatch({ type: 'GET_CONCERTS', data })
//         // dispatch({ type: 'SET_CONCERTS', data })
//         dispatch(survivalDocList(data))
//       })
//       .catch( err=> {
       
//       }
//       )
//     }
// }

export const getSurvivalDocList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"survival-document/list/"+id)
      .then((response) => {
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;
          console.log(data,"survivalDocList....");

          dispatch(survivalDocList(data));
        }
      })
      .catch((error) => {
        //console.log(error, "survivalDocList error");
      });
  };
};





/////////////////GET ALL MASTER DOCUMENT LIST API CALL //////////

const masterDocList = (data) => {
  //console.log(data, "survivalDocList reducers");
  return {
    type: "MASTER_DOCUMENT_LIST",
    data: data,
  };
};


export const getMasterDocList = () => {
  return (dispatch) => {
    axios
      .get(api +"document/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(masterDocList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "masterDocList error");
      });
  };
};




/////////////////GET ALL SURVIVAL SHELTER HOME QUESTION LIST API CALL //////////

const shelterQuestionList = (data) => {
  //console.log(data, "shelterQuestionList reducers");
  return {
    type: "SHELTER_QUESTION_LIST",
    data: data,
  };
};


export const getShelterQuestionList = () => {
  return (dispatch) => {
    axios
      .get(api +"shelter-home-question/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(shelterQuestionList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "shelterQuestionList error");
      });
  };
};


/////////////////GET ALL SURVIVAL GRANT LIST API CALL //////////

const grantList = (data) => {
  //console.log(data, "grantList reducers");
  return {
    type: "GRANT_LIST",
    data: data,
  };
};


export const getGrantList = () => {
  return (dispatch) => {
    axios
      .get(api +"grant/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(grantList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "grantList error");
      });
  };
};

/////////////////GET ALL SURVIVAL MORTGAGE LIST API CALL //////////

const mortgageList = (data) => {
  //console.log(data, "mortgage reducers");
  return {
    type: "MORTGAGE_LIST",
    data: data,
  };
};


export const getMortgageList = () => {
  return (dispatch) => {
    axios
      .get(api +"mortgage/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(mortgageList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "mortgage error");
      });
  };
};


/////////////////GET ALL SURVIVAL DOCUMENT LIST API CALL //////////

const survivalGrantList = (data) => {
  //console.log(data, "survivalGrantList reducers");
  return {
    type: "SURVIVAL_GRANT_LIST",
    data: data,
  };
};


export const getSurvivaLGrantList = (id) => {
  return (dispatch) => {
    axios
      .get(api +"survival-grant/list/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivalGrantList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "survivalGrantList error");
      });
  };
};




////// API CALL FOR PARTNERS LIST /////

const partnerList = (data) => {
  //console.log(data, "partner reducers");
  return {
    type: "PARTNERS_LIST",
    data: data,
  };
};


export const getPartnerList = () => {
  return (dispatch) => {
    axios
      .get(api + "partner/list")
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(partnerList(data));
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
};



export const deletePartner = (id) => {
  return (dispatch) => {
    axios
      .patch(api + "partner/delete/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getPartnerList());
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
};

/////// API CALL FOR AUTHORITY TYPE LIST /////

const authorityTypeList = (data) => {
  //console.log(data, "authorityTypeList reducers");
  return {
    type: "AUTHORITY_TYPE_LIST",
    data: data,
  };
};
export const getAuthorityTypeList = () => {
  return (dispatch) => {
    axios
      .get(api + "authority_type/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(authorityTypeList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "authorityTypeList error");
      });
  };
};





/////// API CALL FOR authorityListByAuthType LIST /////

const authorityListByAuthType = (data) => {
  //console.log(data, "authorityList reducers");
  return {
    type: "AUTHORITY_LIST_BY_AUTHORITY_TYPE",
    data: data,
  };
};



export const getAuthorityByAuthorityType = (id) => {
  return (dispatch) => {
   
    return axios.get(api + "authority/list/"+id,axiosConfig)
      .then(response => {
        const { data } = response;
      
        dispatch(authorityListByAuthType(data.data))
      })
      .catch( err=> {
     
      }
      )
    }
}


/////// API CALL FOR AUTHORITY LIST /////

const authorityList = (data) => {
  //console.log(data, "authorityList reducers");
  return {
    // type: "AUTHORITY_LIST",
    data: data,
  };
};



export const getAuthorityList = () => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_CONCERTS' });
    return axios.get(api + "authority/list",axiosConfig)
      .then(response => {
        const { data } = response;
        dispatch({ type: 'GET_CONCERTS', data })
        dispatch({ type: 'SET_CONCERTS', data })
        dispatch(authorityList(data.data))
      })
      .catch( err=> {
        // console.log(err.code)
        // console.log(err.message)
        // console.log(err.stack)
      }
      )
    }
}



// export const getAuthorityList = () => {
//   return (dispatch) => {
//     axios
//       .get(api + "authority/list",axiosConfig)
//       .then((response) => {
//         //console.log(response);
//         if (response.data && response.data.error == false) {
//           const { data } = response;

//           dispatch(authorityList(data.data));
//         }
//       })
//       .catch((error) => {
//         //console.log(error, "authorityList error");
//       });
//   };
// };

// ////// API CALL FOR GET ACT LIST /////

const actList = (data) => {
  //console.log(data, "state reducers");
  return {
    type: "ACT_LIST",
    data: data,
  };
};
export const getActList = () => {
return (dispatch) => {
    axios
      .get(api + "act/list",axiosConfig)
      .then((response) => {
        // console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;
          dispatch(actList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "actList error");
      });
  };
};
const sectionList = (data) => {
  //console.log(data, "state reducers");
  return {
    type: "SECTION_LIST",
    data: data,
  };
};
export const getSectionList = () => {
return (dispatch) => {
    axios
      .get(api + "section/list",axiosConfig)
      .then((response) => {
        console.log(response,'sectionnnnnnnnnnnnnnnnnnnn');
        if (response.data && response.data.error == false) {
          const { data } = response;
          dispatch(sectionList(data.data));
        }
      })
      .catch((error) => {
        console.log(error, "sectionList error");
      });
  };
};

const sectionByActId = (data) => {
  //console.log(data, "state reducers");
  return {
    type: "SECTION_LIST_BY_ACT",
    data: data,
  };
};
export const getSectionByActId = (id) => {
  return (dispatch) => {
      axios
        .get(api + "section/list-by-act-name/"+id,axiosConfig)
        .then((response) => {
          console.log(response,'sectionnnnnnnnnnnnnnnnnnnn');
          if (response.data && response.data.error == false) {
            const { data } = response;
            dispatch(sectionByActId(data.data));
          }
        })
        .catch((error) => {
          console.log(error, "sectionByActId error");
        });
    };
  };
/////// API CALL FOR DISTRICT LIST /////////

// const districtList = (data) => {
//   //console.log(data, "district reducers");
//   return {
//     type: "DISTRICT_LIST",
//     data: data,
//   };
// };
// export const getDistrictList = (id) => {
//   return (dispatch) => {
//     axios
//       .get(api + "district/list-by-state/"+id)
//       .then((response) => {
//         //console.log(response);
//         if (response.data && response.data.error == false) {
//           const { data } = response;

//           dispatch(districtList(data.data));
//         }
//       })
//       .catch((error) => {
//         //console.log(error, "district error");
//       });
//   };
// };




/////// API CALL FOR Pc why LIST /////

const pcWhyList = (data) => {
  //console.log(data, "pcWhyList reducers");
  return {
    type: "PC_WHY_LIST",
    data: data,
  };
};
export const getPcWhyList = () => {
  return (dispatch) => {
    axios
      .get(api + "pcwhy/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcWhyList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "pcWhyList error");
      });
  };
};


/////// API CALL FOR Pc current status LIST /////

const pcCurrentStatusList = (data) => {
  //console.log(data, "pcCurrentStatusList reducers");
  return {
    type: "PC_CURRENT_STATUS_LIST",
    data: data,
  };
};
export const getPcCurrentStatusList = () => {
  return (dispatch) => {
    axios
      .get(api + "pc-current-status/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcCurrentStatusList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "pcCurrentStatusList error");
      });
  };
};


/////// API CALL FOR Pc PC Result of Prosecution List LIST /////

const pcResultofProsecutionList = (data) => {
  //console.log(data, "pcResultofProsecutionList reducers");
  return {
    type: "PC_RSULT_OF_PROSECUTION_LIST",
    data: data,
  };
};
export const getPcResultofProsecutionList = () => {
  return (dispatch) => {
    axios
      .get(api + "res-of-prosecution/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcResultofProsecutionList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "pcResultofProsecutionList error");
      });
  };
};


/////// API CALL FOR Pc PC Document Type List LIST /////

const pcDocumentTypeList = (data) => {
  //console.log(data, "Document Type reducers");
  return {
    type: "PC_DOCUMENT_TYPE_LIST",
    data: data,
  };
};
export const getPcDocumentTypeList = () => {
  return (dispatch) => {
    axios
      .get(api + "document-type/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcDocumentTypeList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "Document Type error");
      });
  };
};


/////// API CALL FOR Pc PC EscalatedType List LIST /////

const pcEscalatedTypeList = (data) => {
  //console.log(data, "EscalatedType reducers");
  return {
    type: "PC_ESCALATION_TYPE_LIST",
    data: data,
  };
};
export const getPcEscalatedTypeList = () => {
  return (dispatch) => {
    axios
      .get(api + "escalated-type/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcEscalatedTypeList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "EscalatedType error");
      });
  };
};


/////// API CALL FOR Pc  Escalation Reason LIST /////

const pcEscalationReasonList = (data) => {
  //console.log(data, "Escalation Reason reducers");
  return {
    type: "PC_ESCALATION_REASON_LIST",
    data: data,
  };
};
export const getPcEscalationReasonList = () => {
  return (dispatch) => {
    axios
      .get(api + "escalated-reason/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcEscalationReasonList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "Escalation Reason error");
      });
  };
};


/////// API CALL FOR CITDimension LIST /////

const citDimensionList = (data) => {
  //console.log(data, "CITDimension reducers");
  return {
    type: "CIT_DIMENSION_LIST",
    data: data,
  };
};
export const getCitDimensionList = () => {
  return (dispatch) => {
    axios
      .get(api + "cit-dimension/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(citDimensionList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "CITDimension error");
      });
  };
};

export const deleteCitDimension = (id) => {
  return (dispatch) => {
    axios
      .patch(api + "cit-dimension/delete/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getCitDimensionList());
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
};

/////// API CALL FOR CIT LIST /////

const citList = (data) => {
  //console.log(data, "CITreducers");
  return {
    type: "CIT_LIST",
    data: data,
  };
};
export const getCitList = (id) => {
  return (dispatch) => {
    axios
      .get(api + "cit/list/"+id,axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(citList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "CIT error");
      });
  };
};


/////// API CALL FOR CITDimensionQuestion LIST /////

const citDimensionQuestionList = (data) => {
  //console.log(data, "CITDimensionQuestion reducers");
  return {
    type: "CIT_DIMENSION_QUESTION_LIST",
    data: data,
  };
};
export const getCitDimensionQuestionList = () => {
  return (dispatch) => {
    axios
      .get(api + "cit-dimension-question/list",axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(citDimensionQuestionList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "CITDimensionQuestion error");
      });
  };
};
const citDimensionQuestionListByDimension = (data) => {
  //console.log(data, "CITDimensionQuestion reducers");
  return {
    type: "CIT_DIMENSION_QUESTION_LIST_BY_DIMENSION",
    data: data,
  };
};
// export const getCitDimensionQuestionsById = (id) => {
//   return (dispatch) => {
//     axios
//       .get(api + "cit-dimension-question/list-by-dimension/"+id,axiosConfig)
//       .then((response) => {
//         //console.log(response);
//         if (response.data && response.data.error === false) {
//           const { data } = response;

//           dispatch(citDimensionQuestionListByDimension(data.data));
//         }
//       })
//       .catch((error) => {
//         //console.log(error, "CITDimensionQuestion error");
//       });
//   };
// };
export const getCitDimensionQuestionsById = (id) => {
  return new Promise((resolve, reject)=>{
    axios
      .get(api + "cit-dimension-question/list-by-dimension/"+id,axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

         resolve(data.data);
        }
      })
      .catch((error) => {
        reject(error);
        //console.log(error, "CITDimensionQuestion error");
      });
  })
};

export const getCITStarDetails = (id) => {
  return new Promise((resolve, reject)=>{
    axios
      .get(api + "cit/star/"+id,axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error !== true) {
          const { data } = response;

         resolve(data.starData);
        }
      })
      .catch((error) => {
        reject(error);
        //console.log(error, "CITDimensionQuestion error");
      });
  })
};
export const getCitListOfActionsByCitId = (id) => {
  return new Promise((resolve, reject)=>{
    axios
      .get(api + "cit-goal/list-by-cit/"+id,axiosConfig)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

         resolve(data.data);
        }
      })
      .catch((error) => {
        reject(error);
        //console.log(error, "CITDimensionQuestion error");
      });
  })
};
export const getCitDDetailsListById= (id) => {
  return new Promise((resolve, reject)=>{
    axios
      .get(api + "cit_detail/list-by-cit/"+id,axiosConfig)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

         resolve(data.data);
        }
      })
      .catch((error) => {
        reject(error);
        //console.log(error, "CITDimensionQuestion error");
      });
  })
};
export const createCITDetailApi = (data) => {
  return new Promise((resolve, reject)=>{
    axios
      .post(api + "cit_detail/create",data)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

          resolve(data.data);
        }
        else{
         reject(response.data.message);
        }
      })
      .catch((error) => {
       reject(error);
      });
  })
};
export const createCITListOfAction = (data) => {
  return new Promise((resolve, reject)=>{
    axios
      .post(api + "cit-goal/create",data)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

          resolve(data.data);
        }
      })
      .catch((error) => {
       reject(error);
      });
  })
};



export const deleteCitDimensionQues = (id) => {
  return (dispatch) => {
    axios
      .patch(api + "cit-dimension-question/delete/"+id)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getCitDimensionQuestionList());
        }
      })
      .catch((error) => {
        //console.log(error, "partner error");
      });
  };
};


const changeLogList = (data) => {
  //console.log(data, "CITreducers");
  return {
    type: "CHANGE_LOG_LIST",
    data: data,
  };
};

export const getChangeLog = (type,id) => {
  console.log(type,id,"type,id");
  return (dispatch) => {
    axios
    .get(api + "change-log/list/"+type+"/"+id)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          console.log(data,"data")
          dispatch(changeLogList(data.data));
        }
        else{
          dispatch(changeLogList({}));
        }
      })
      .catch((error) => {
      });
  };
};


const allCitList = (data) => {
  //console.log(data, "CITreducers");
  return {
    type: "ALL_CIT_LIST",
    data: data,
  };
};

export const getAllCitList = () => {
  return (dispatch) => {
    axios
    .get(api + "cit/all-list")
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(allCitList(data.data));
        }
      })
      .catch((error) => {
      });
  };
};



const adminDashboardData = (data) => {
  //console.log(data, "CITreducers");
  return {
    type: "DASHBOARD_DATA",
    data: data,
  };
};

const monthDashboardData = (data) => {
  //console.log(data, "CITreducers");
  return {
    type: "MONTH_DASHBOARD_DATA",
    data: data,
  };
};

const stateDashboardData = (data) => {
  //console.log(data, "CITreducers");
  return {
    type: "STATE_DASHBOARD_DATA",
    data: data,
  };
};

const ageDashboardData = (data) => {
  //console.log(data, "CITreducers");
  return {
    type: "AGE_DASHBOARD_DATA",
    data: data,
  };
};


export const getAdminDashboardData = () => {
  return (dispatch) => {
    axios
    .get(api + "admin-dashboard/data")
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(adminDashboardData(data.data));
          dispatch(monthDashboardData(data.data.monthWiseSurvivor))
          dispatch(ageDashboardData(data.data.ageWiseSurvivor))
          dispatch(stateDashboardData(data.data.stateWiseSurvivor))

        }
      })
      .catch((error) => {
      });
  };
};
