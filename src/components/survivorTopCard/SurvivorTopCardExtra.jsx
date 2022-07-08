import React,{useState, useEffect} from 'react';
import { MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

const SurvivorTopCardExtra = (props) => {
const {survivorDetails}= props;
const survivorActionDetails = useSelector((state) => state.survivorActionDetails);
  // const survivorDetails = useSelector((state) => state.survivorDetails);
  
  return (
    <>
        <MDBAccordion 
        flush 
        // initialActive={1}
        >
            <MDBAccordionItem className="survivor_cardbar_wrap" collapseId={1} headerTitle='Survivor'>
              <div className="survivor_card_bar">
                <ul>
                  <li>
                    <h6 className="mb-2">Survivor ID</h6>
                    <h5 className="mb-0">{survivorDetails && survivorDetails.survivor_id && survivorDetails.survivor_id}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Name</h6>
                    <h5>{survivorDetails && survivorDetails.survivor_name && survivorDetails.survivor_name}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Gender</h6>
                    <h5>{survivorDetails && survivorDetails.gender && survivorDetails.gender}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Date of Trafficking</h6>
                    <h5>{survivorDetails && survivorDetails.date_of_trafficking && moment(survivorDetails.date_of_trafficking).format("DD/MM/YYYY")}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Rescue?</h6>
                    <h5>Yes</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Procedural Correction </h6>
                    <h5>Yes</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Victim Compensation </h6>
                    <h5>No</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">CIT</h6>
                    <h5>No</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Leadership</h6>
                    <h5>Yes</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Financial Inclusion</h6>
                    <h5>Yes</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Status of Tafteesh</h6>
                    <h5>{survivorDetails && survivorDetails.status_in_tafteesh && survivorDetails.status_in_tafteesh}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Place of rescue</h6>
                    <h5>NA</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Months since the survivor got trafficked as SA</h6>
                    <h5>5</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Months between when trafficked and when case concluded at SA</h6>
                    <h5>5</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Months since the survivor rescued</h6>
                    <h5>5</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Months between when rescued and when case concluded at DA</h6>
                    <h5>5</h5>
                  </li>
                </ul>
              </div>
            </MDBAccordionItem>
        </MDBAccordion>
    </>
  )
}

export default SurvivorTopCardExtra
