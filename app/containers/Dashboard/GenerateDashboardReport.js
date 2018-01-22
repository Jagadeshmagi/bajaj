import ReactDOM from 'react-dom'
import { dropdown} from './styles.css'
import {selectStyle, dropdownPolicy} from 'sharedStyles/styles.css'
import styles from 'sharedStyles/styles.css'
import React, { PropTypes } from 'react'
import {Grid, Row , Col} from 'react-bootstrap'
import {getSummaryData} from 'helpers/complianceSummary'
import {getControlFamilyList} from 'helpers/policies'
import {getDiscoveredOS, getAppliedPolicies} from 'helpers/dashboard'
import getAssetGroupsList, {getCompletedScanGroups} from 'helpers/assetGroups'
import Select from 'react-select'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
window.html2canvas = html2canvas

const GenerateDashboardReport = React.createClass({
  printDocument() {
   const input = document.getElementById('DashboardContent');
   console.log("dfasdfsdfasf", input)
   html2canvas(input)
     .then((canvas) => {
       const imgData = canvas.toDataURL('image/png');
       const pdf = new jsPDF({
         orientation: 'landscape',
         unit: 'in',
         format: [canvas.width, canvas.height]});

         pdf.addImage(imgData,0,0,canvas.width,canvas.height);
        //  if(canvas.height > 365){ // I noticed 365 was the height of my page but for your landscape page it must be lower depending on your unit (pt, or mm or cm etc)
        //    pdf.addPage();
        //    pdf.addImage(imgData,0,-365,canvas.width,canvas.height);
        //  }


      //  pdf.addImage(imgData, 'JPEG', 0, 0);
      //  pdf.output('dataurlnewwindow');
       pdf.save("download.pdf");
     })
   },

  //  showToolTip(){
  //     this.props.
  //  },
  //  hideToolTip(){
   //
  //  },
  render() {
    let svgTag1 = `
      <svg width="31px" height="31px" viewBox="1502 105 31 31" version="1.1">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(1503.000000, 106.000000)">
              <path d="M28,21 C28,25.42 24.42,29 20,29 C15.584,29 12,25.42 12,21 C12,16.582 15.584,13 20,13 C24.42,13 28,16.582 28,21 L28,21 Z" id="Stroke-1" stroke="#4C58A4" stroke-width="2"></path>
              <path d="M4,4 L18.998,4" id="Stroke-3" stroke="#4C58A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M9,26.9981 L4,26.9981 C1.79,26.9981 0,25.2081 0,22.9981 L0,4.0001" id="Stroke-5" stroke="#4C58A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M19.9981,0 L4.0001,0 C1.7901,0 0.0001,1.79 0.0001,4 C0.0001,6.209 1.7901,8 4.0001,8 L19.9981,8 L19.9981,9" id="Stroke-7" stroke="#4C58A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M20,18 L20,24" id="Stroke-9" stroke="#4C58A4" stroke-width="2" stroke-linecap="round"></path>
              <path d="M17,21 L23,21" id="Stroke-11" stroke="#4C58A4" stroke-width="2" stroke-linecap="round"></path>
          </g>
      </svg>
      `
    return (<span>
      {/*<div className="mb1">*/}
        <span className="mb1" style={this.props.style} onMouseOver={this.props.showToolTip} onMouseOut={this.props.hideToolTip} onClick={this.printDocument} dangerouslySetInnerHTML={{__html: svgTag1}}></span>
      {/*</div>*/}
    </span>);
  }
})

export default GenerateDashboardReport
