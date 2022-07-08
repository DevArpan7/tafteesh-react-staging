import React from 'react';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 

import { Login,AdminLogin } from "./components";
import { Error } from './components';
import { SocialWorkerDashboard, SurvivorsList, SurvivorTraffickersList,SurvivorsLawyers, AddSurvivors, SurvivorsDocument ,SurvivorFir, SurvivorsRescue, SurvivorsInvestigation, SurvivorsParticipation, SurvivorShelterHome, SurvivorsNextPlan, SurvivorsLoan, SurvivorsIncome, SurvivorsGrant, SurvivorCIT, MyAccount, SurvivorProceduralCorrection, SurvivorVictimCompensation, SurvivorChargesheet, SurvivorProfileDetails, ChangeLog, SurvivorSupplimentaryChargesheet } from "./containers";
import { KamoAdmin, AddUser, UserList, TraffickersList, LawyersList, KamoPartners, KamoOrganizations, KamoSHG, KamoCollectives,KamoStates
,KamoBlocks ,KamoDistrict, LawyersCategory,PoliceStations,AuthorityType,AuthorityList, CitDimension,CitDimensionQues, ActList, SectionList, DocumentList ,AllCitList, AllSurvivorList,KamoUserDetails, TraffickersDetails} from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import '../src/assets/css/fontawesome.css';
import './app.css';


const App = () => {
  return (
    <>
      <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/adminlogin" component={AdminLogin} />
            <Route exact path="/dashboard" component={SocialWorkerDashboard} />
            <Route exact path="/survivors" component={SurvivorsList} />
            <Route exact path="/survivor-document" component={SurvivorsDocument} />
            <Route exact path="/survivor-fir" component={SurvivorFir} />
            <Route exact path="/survivor-rescue" component={SurvivorsRescue} />
            <Route exact path="/survivor-investigation" component={SurvivorsInvestigation} />
            <Route exact path="/survivor-participation" component={SurvivorsParticipation} />
            <Route exact path="/survivor-shelter-home" component={SurvivorShelterHome} />
            <Route exact path="/survivor-next-plan" component={SurvivorsNextPlan} />
            <Route exact path="/survivor-loan" component={SurvivorsLoan} />
            <Route exact path="/survivor-lawyer" component={SurvivorsLawyers} />

            <Route exact path="/survivor-income" component={SurvivorsIncome} />
            <Route exact path="/survivor-grant" component={SurvivorsGrant} />
            <Route exact path="/survivor-cit" component={SurvivorCIT} />
            <Route exact path="/myaccount" component={MyAccount} />
            <Route exact path="/survivor-pc" component={SurvivorProceduralCorrection} />
            <Route exact path="/survivor-vc" component={SurvivorVictimCompensation} />
            <Route exact path="/survivor-chargesheet" component={SurvivorChargesheet} />
            <Route exact path="/survivor-supplimentary-chargesheet" component={SurvivorSupplimentaryChargesheet} />
            <Route exact path="/add-survivor" component={AddSurvivors} />
            <Route exact path="/survivor-traffickers" component={SurvivorTraffickersList} />
            <Route exact path="/admin" component={KamoAdmin} />
            <Route exact path="/add-user" component={AddUser} />
            <Route exact path="/user-list" component={UserList} />
            <Route exact path="/user-details" component={KamoUserDetails} />
            <Route exact path="/profile-details" component={SurvivorProfileDetails} />
            <Route exact path="/traffickers-list" component={TraffickersList} />
            <Route exact path="/traffickers-details" component={TraffickersDetails} />
            <Route exact path="/lawyers-list" component={LawyersList} />
            <Route exact path="/partners" component={KamoPartners} />
            <Route exact path="/organizations" component={KamoOrganizations} />
            <Route exact path="/states" component={KamoStates} />
            <Route exact path="/blocks" component={KamoBlocks} />
            <Route exact path="/districts" component={KamoDistrict} />
            <Route exact path="/lawyers-category" component={LawyersCategory} />
            <Route exact path="/police-station" component={PoliceStations} />
            <Route exact path="/all-cit" component={AllCitList} />
            <Route exact path="/all-survivor" component={AllSurvivorList} />

            <Route exact path="/authority_type" component={AuthorityType} />
            <Route exact path="/authority_list" component={AuthorityList} />
            <Route exact path="/act_list" component={ActList} />
            <Route exact path="/document_list" component={DocumentList} />
            <Route exact path="/section_list" component={SectionList} />
            <Route exact path="/cit_dimension" component={CitDimension} />
            <Route exact path="/cit_dimension_ques" component={CitDimensionQues} />
            
            <Route exact path="/shg-home" component={KamoSHG} />
            <Route exact path="/collectives" component={KamoCollectives} />
            <Route exact path="/change-log" component={ChangeLog} />
            <Route component={Error} />
          </Switch>
        </Router>
    </>
  )
}

export default App