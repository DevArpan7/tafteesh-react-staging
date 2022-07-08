import React,{useEffect,useState} from 'react'
import { KamoTopbar } from '../../components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import tab1img from "../../assets/img/partner.png";
import tab2img from "../../assets/img/organization.png";
import tab3img from "../../assets/img/shgname.png";
import tab4img from "../../assets/img/collective.png";

import KamoPartner from './KamoPartner';
import KamoOrganizations from './KamoOrganizations';
// import KamoStates from './KamoStates';
import KamoSHG from './KamoSHG';
import KamoCollectives from './KamoCollectives';
import "./kamoadmin.css";
import { useDispatch, useSelector } from "react-redux";
import NotificationPage from '../../components/NotificationPage';
import axios from "axios";
import {getAdminDashboardData, getPartnerList ,getOrganizationList,getShgList,getCollectivesList} from '../../redux/action';

export const KamoAdmin = (props) => {
  const dispatch = useDispatch();
  const partnerList = useSelector((state) => state.partnerList);
  const organizationList = useSelector((state) => state.organizationList);
  const shgList = useSelector((state) => state.shgList);
  const collectivesList = useSelector((state) => state.collectivesList);
  const adminDashboardData = useSelector((state) => state.adminDashboardData);
  const monthDashboardData = useSelector((state) => state.monthDashboardData);
  const stateDashboardData = useSelector((state) => state.stateDashboardData);
  const ageDashboardData = useSelector((state) => state.ageDashboardData);



  
  useEffect(() => {
    dispatch(getPartnerList());
    dispatch(getOrganizationList());
    dispatch(getShgList());
    dispatch(getCollectivesList());
    dispatch(getAdminDashboardData());


}, [props])

console.log(adminDashboardData,ageDashboardData,stateDashboardData,monthDashboardData,"adminDashboardData")

const onGoToPartner=()=>{
  props.history.push("/partners")
}


const onGoToOrga=()=>{
  props.history.push("/organizations")
}

const onGoToShg=()=>{
  props.history.push("/shg-home")
}

const onGoToColl=()=>{
  props.history.push("/collectives")
}

  return (
    <>
        <KamoTopbar />
        <main className="main_body">
          <div className="bodyright">
            <Tabs>
              <TabList className="row">
                <Tab onClick={()=>onGoToPartner()} className="col-lg-3 socialworker_tab_menu kamoadmin_tab_menu">
                  <div className="totla_profile_box white_box_shadow">
                    <div className="kamoadmin_tab_menu_top">
                      <span className='kamoadmintabImg'><img src={tab1img} alt="" /></span>
                      <h3>Partners</h3>
                    </div>
                    <div className="kamoadmin_tab_menu_bottom">
                      <span>{partnerList && partnerList.totalcount && partnerList.totalcount}</span>
                    </div>
                  </div>
                </Tab>
                <Tab onClick={()=> onGoToOrga()} className="col-lg-3 socialworker_tab_menu kamoadmin_tab_menu">
                  <div className="totla_profile_box white_box_shadow">
                    <div className="kamoadmin_tab_menu_top">
                      <span className='kamoadmintabImg'><img src={tab2img} alt="" /></span>
                      <h3>Organizations</h3>
                    </div>
                    <div className="kamoadmin_tab_menu_bottom">
                      <span>{organizationList && organizationList.totalcount && organizationList.totalcount}</span>
                    </div>
                  </div>
                </Tab>
                <Tab onClick={()=>onGoToShg()} className="col-lg-3 socialworker_tab_menu kamoadmin_tab_menu">
                  <div className="totla_profile_box white_box_shadow">
                    <div className="kamoadmin_tab_menu_top">
                      <span className='kamoadmintabImg'><img src={tab3img} alt="" /></span>
                      <h3>SHG Name</h3>
                    </div>
                    <div className="kamoadmin_tab_menu_bottom">
                      <span>{shgList && shgList.totalcount && shgList.totalcount}</span>
                    </div>
                  </div>
                </Tab>
                <Tab onClick={()=>onGoToColl()}  className="col-lg-3 socialworker_tab_menu kamoadmin_tab_menu">
                  <div className="totla_profile_box white_box_shadow">
                    <div className="kamoadmin_tab_menu_top">
                      <span className='kamoadmintabImg'><img src={tab4img} alt="" /></span>
                      <h3>Collectives</h3>
                    </div>
                    <div className="kamoadmin_tab_menu_bottom">
                      <span>{collectivesList && collectivesList.totalcount && collectivesList.totalcount}</span>
                    </div>
                  </div>
                </Tab>
              </TabList>

              <TabPanel>
                <KamoPartner />
              </TabPanel>
              <TabPanel>
                <KamoOrganizations />
              </TabPanel>
              <TabPanel>
                <KamoSHG />
              </TabPanel>
              <TabPanel>
                <KamoCollectives />
              </TabPanel>
            </Tabs>              
          </div>           
        </main>        
    </>
  )
}
export default KamoAdmin

