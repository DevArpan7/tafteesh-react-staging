import { combineReducers } from "redux";
import { stateList } from "./reducers/stateList";
import { districtList } from "./reducers/districtList";
import { blockList } from "./reducers/blockList";
import { userDetails } from "./reducers/userDetails";
import { shgList } from "./reducers/shgList";
import { policeStationList } from "./reducers/policeStationList";
import { collectivesList } from "./reducers/collectivesList";
import { survivorList } from "./reducers/survivorList";
import { participationList } from "./reducers/participationList";
import { roleList } from "./reducers/roleList";
import { organizationList } from "./reducers/organizationList";
import { usersList } from "./reducers/usersList";
import { survivorDetails } from "./reducers/survivorDetails";
import { traffickerList } from "./reducers/traffickerList";
import {chargeSheetList} from "./reducers/chargeSheetList";
import  {firList} from "./reducers/firList";
import { investigationList } from "./reducers/investigationList";
import { rescueList } from "./reducers/rescueList";
import {lawyersList} from "./reducers/lawyersList";
import {courtList} from "./reducers/courtList";
import {survivalVcList} from "./reducers/survivalVcList";
import {shelterHomeList} from "./reducers/shelterHomeList";
import {vcEscalationList} from "./reducers/vcEscalationList";
import {survivalLoanList} from "./reducers/survivalLoanList";
import {pcEscalationList} from "./reducers/pcEscalationList";
import {nextPlanList} from "./reducers/nextPlanList";
import {incomeList} from "./reducers/incomeList";
import {survivalDocList} from "./reducers/survivalDocList";
import {lawyersCategoryList} from "./reducers/lawyersCategoryList";
import {shelterQuestionList} from "./reducers/shelterQuestionList";
import {grantList} from "./reducers/grantList";
import {mortgageList} from "./reducers/mortgageList";
import {survivalGrantList} from "./reducers/survivalGrantList";
import {partnerList} from "./reducers/partnerList";
import {masterBlockList} from "./reducers/masterBlockList";
import {masterDistrictList} from "./reducers/masterDistrictList";
import {authorityTypeList} from "./reducers/authorityTypeList";
import {authorityList} from "./reducers/authorityList";
import {survivorPcList} from "./reducers/survivorPcList";
import {masterDocList} from "./reducers/masterDocList";
import {pcWhyList} from "./reducers/pcWhyList";
import {pcCurrentStatusList} from "./reducers/pcCurrentStatusList";
import {pcResultofProsecutionList} from "./reducers/pcResultofProsecutionList";
import {pcDocumentTypeList} from "./reducers/pcDocumentTypeList";
import {pcEscalatedTypeList} from "./reducers/pcEscalatedTypeList";
import {pcEscalationReasonList} from "./reducers/pcEscalationReasonList";
import {citDimensionList} from "./reducers/citDimensionList";
import {citDimensionQuestionList} from "./reducers/citDimensionQuestionList";
import {citList} from "./reducers/citList";
import {authorityListByAuthType} from "./reducers/authorityListByAuthType";
import {vcEscalation2List} from "./reducers/vcEscalation2List";
import {survivorLawyersList} from "./reducers/survivorLawyersList";
import { actList } from "./reducers/actList";
import { sectionList,sectionByActId } from "./reducers/sectionList";
import { SupplimentarychargeSheetList } from "./reducers/supplimentaryChargesheet";

import {lawyersListByCatId} from "./reducers/lawyersListByCatId";
import {allsurvivorList} from "./reducers/allsurvivorList";
import {changeLogList} from "./reducers/changeLogList";
import {survivorActionDetails} from "./reducers/survivorActionDetails";
import {allCitList} from "./reducers/allCitList";
import {adminDashboardData,ageDashboardData,monthDashboardData,stateDashboardData} from "./reducers/adminDashboardData";


const rootReducer = combineReducers({
  pcWhyList,
  adminDashboardData,
  ageDashboardData,
  stateDashboardData,
  monthDashboardData,
  allCitList,
  survivorActionDetails,
  changeLogList,
  allsurvivorList,
  lawyersListByCatId,
  vcEscalation2List,
  citDimensionQuestionList,
  survivorLawyersList,
  authorityListByAuthType,
  citList,
  citDimensionList,
  pcCurrentStatusList,
  pcDocumentTypeList,
  pcEscalatedTypeList,
  pcEscalationReasonList,
  pcResultofProsecutionList,
  stateList,
  districtList,
  blockList,
  userDetails,
  shgList,
  policeStationList,
  collectivesList,
  survivorList,
  participationList,
  roleList,
  organizationList,
  usersList,
  survivorDetails,
  traffickerList,
  firList,
  chargeSheetList,
  investigationList,
  rescueList,
  lawyersList,
  courtList,
  survivalVcList,
  shelterHomeList,
  vcEscalationList,
  survivalLoanList,
  pcEscalationList,
  nextPlanList,
  incomeList,
  lawyersCategoryList,
  survivalDocList,
  masterDocList,
  shelterQuestionList,
  grantList,
  mortgageList,
  survivalGrantList,
  partnerList,
  masterBlockList,
  masterDistrictList,
  authorityTypeList,
  authorityList,
  survivorPcList,
  actList,
  sectionList,
  sectionByActId,
  SupplimentarychargeSheetList
});

export default rootReducer;
