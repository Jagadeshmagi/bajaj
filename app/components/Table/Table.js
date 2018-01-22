import React from 'react'
import ReactDOM from 'react-dom'
import {Cell} from 'fixed-data-table'
import {Checkbox,Glyphicon, ProgressBar, Row, Col, Grid, Popover,OverlayTrigger, Button, Modal} from 'react-bootstrap'
import {getAssetgroupPercent} from "./../../helpers/assetGroups"
import ReactTooltip from 'react-tooltip'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange, progressbargeneral} from 'containers/Infrastructure/styles.css'
import AttributeConstants from 'constants/AttributeConstants'
import {RuleDetails} from 'containers/PolicyPacksList/RuleDetails'
import {FailedResults} from 'components/Report/FailedResults'
import moment from 'moment'
import {blueBtn, btnPrimary,selectStyle, modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {modalContainer,deleteDialogClass,modal,toolstyle} from './styles.css'
import {AlertDetails} from '../Report/AlertDetails'
import {RemediationModal} from './chefModal'

export function TextCell ({rowIndex, data, col, ...props}) {

  let value;
  if (col === "active"){
    if (data[rowIndex][col] === true){
      value = <span style={{color:"#00C484"}}>Active</span>
    } else {
      value = <span style={{color:"#FF444D"}}>Suspended</span>
    }
  } else if (col === "created") {
      value = data[rowIndex][col]
      value = moment.utc(value).format('MM[/]DD[/]YYYY [@] HH[:]mm');
  } else if (col === "roles"){
        value = AttributeConstants.ROLES[data[rowIndex][col]] || data[rowIndex][col]
  } else {
    value = (data[rowIndex][col] && data[rowIndex][col] !== 'null'|| data[rowIndex][col] == 0 && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
  }
  return(
  <Cell  style={{wordBreak: 'break-all',padding:'0px',whiteSpace: 'pre-line',overflow:'auto'}} {...props}>
      {value}
  </Cell>
 )
}

export const RemediationCell = React.createClass({
  render() {
    const {data, rowIndex, col, ...props} = this.props;
    let fixsuggestion="";
     let threedotsfixsuggestion="...";
     let overlaysizefixsuggestion=0;
     let fixsugessionValue = data[rowIndex][col]
    //  .substring(5, data[rowIndex][col].length)

   const tooltipfixsuggestion = (
     <Popover  style={{maxWidth:'100%',width:'600px',wordWrap: "break-word"}}>
       <div dangerouslySetInnerHTML={{__html:fixsugessionValue}} style={{height:'auto', overflow:'auto'}}></div>
     </Popover>
   );
    function decodeHTMLEntities (str) {
       if(str && typeof str === 'string') {
         str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
         str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
       }
       return str;
     }
    const shortened = decodeHTMLEntities(fixsugessionValue)

      return(
      <Cell {...props}>
        <div>
            <OverlayTrigger ref="toolname" trigger="click" rootClose placement="bottom"  overlay={tooltipfixsuggestion}>
              <div style={{cursor: 'pointer',whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px"}}>{shortened}</div>
            </OverlayTrigger>
        </div>
      </Cell>
    )
  }
})

export const RecipeCell = React.createClass({
  getInitialState(){
    return{
      showRemediationModal:false
    }
  },
  openRemediationModal(){
    this.setState({
      showRemediationModal:true
    })
  },
  render() {
    console.log("these are the props props", this.props)
    const {data, rowIndex, col,policyResultIdCol,worklogId,flagCol, ...props} = this.props;
    let fixsuggestion="";
     let threedotsfixsuggestion="...";
     let overlaysizefixsuggestion=0;
     let fixsugessionValue = data[rowIndex][col]

    function decodeHTMLEntities (str) {
       if(str && typeof str === 'string') {
         str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
         str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
       }
       return str;
     }
    const shortened = decodeHTMLEntities(fixsugessionValue)
      return(
      <Cell {...props}>
        <div style={{marginRight:"-30"}}>
          <RemediationModal
            pp={this.props.pp}
            suppressed = {data[rowIndex][flagCol]}
            refresh={this.props.refresh}
            os={this.props.os}
            reportType={this.props.reportType}
            pName={data[rowIndex][col]}
            deviceName={this.props.deviceName}
            worklogId={this.props.worklogId}
            policyResultId = {data[rowIndex][policyResultIdCol]}
            remediationSteps={<div dangerouslySetInnerHTML={{__html:fixsugessionValue}} style={{height:'auto', overflow:'auto'}}></div>}
          />
        </div>
      </Cell>
    )
  }
})

export const PolicyNameCell = React.createClass({
  render() {
    const {data, rowIndex, col, ...props} = this.props;
    let overlaysizepolicyname=0;
    let policies = data[rowIndex][col]


    let typecve=""

    if(this.props.docker&&this.props.docker=="docker"){
      if(data[rowIndex]["policyGuideline"]!=null){
        let i=0;
        for (i=0;i<data[rowIndex]["policyGuideline"].length;i++){
          if(data[rowIndex]["policyGuideline"][i].indexOf("Image_CDICVESCAN")!=-1)
            typecve="CVE"
        }

      }
    }

    return(
      <div >
      <Cell {...props}
        onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
        onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
        <div data-type="info" ref='valueDiv' data-tip={policies}>
          <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px"}}>
          {
            (this.props.docker&&this.props.docker=="docker")?
            <div style={{display:'inline-block'}}>
            &nbsp;&nbsp;<RuleDetails padding="5" style={{textAlign:"right", marginRight:"-20px"}} key={data[rowIndex]["ruleid"]} ruleId={data[rowIndex]["ruleid"]} type={typecve}/> &nbsp;&nbsp;
            </div>
            :
            <div style={{display:'inline-block'}}>
            &nbsp;&nbsp;<RuleDetails padding="5" style={{textAlign:"right", marginRight:"-20px"}} key={data[rowIndex]["ruleId"]} ruleId={data[rowIndex]["ruleId"]} /> &nbsp;&nbsp;
            </div>
          }
            {policies}
         </div>
        </div>
      </Cell>
      </div>
    )
  }
})

export const DevicePolicyNameCell = React.createClass({
  render() {
    const {rowIndex, ...props} = this.props;
    let data =this.props.data;
    let policies = data[rowIndex]["policies"]
    return(
      <div >
      <Cell {...props}
        onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
        onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
        <div data-type="info" ref='valueDiv' data-tip={policies}>
          <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"20px"}}>
            &nbsp;&nbsp;<RuleDetails key={data[rowIndex]["ruleId"]} ruleId={data[rowIndex]["ruleId"]}/>
            {policies}
          </div>
        </div>
      </Cell>
      </div>
    )
  }
})

export const ReportStateCell = React.createClass({
  render() {
    const {rowIndex,flagCol, ...props} = this.props;
    let data =this.props.data;
    let colrAttr=""
    let policyName=''
    let suppress = false
    let failFalg = false
    let policyResultId = 0;

    let stateObj = data[rowIndex]['state'];
    if(stateObj && stateObj === 'Suppressed'){
      suppress = true
      colrAttr = 'black'
    }
   else if(stateObj && stateObj === 'Fail'&&this.props.showFailedRsult&&this.props.showFailedRsult==true)
    {
      failFalg = true
      colrAttr = 'red'
      policyResultId = data[rowIndex]['policyresultid'];
      policyName = data[rowIndex]['policies']
    }
    else{
      if(stateObj === 'Pass')colrAttr = 'green'
      else if(stateObj === 'Not_Applicable')colrAttr = '#F6A623'
    //  else if(stateObj === 'Fail')colrAttr = 'red'
    }

    let reason = data[rowIndex]["reason"]

    if(suppress){
      return(<div>
         <Cell {...props}
        onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
        onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
        <div data-type="info" ref='valueDiv' data-tip={reason}>
          <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"20px"}}>
              <span style={{color:colrAttr}}>{AttributeConstants.STATE[stateObj]}</span>
          </div>
        </div>
      </Cell>
        </div>
        )
    }else if(failFalg){
      return(
        <div >
        <Cell {...props}>
          <FailedResults colorAttr={colrAttr} 
                        policyResultId={policyResultId}
                        policyName={policyName}/>
        </Cell>
      </div>
        )
    }
    else{
    return(
      <div >
        <Cell {...props}>
          <span style={{color:colrAttr}}>{AttributeConstants.STATE[stateObj]}</span>
        </Cell>
      </div>
    )}
  }
})

export const ScanProgress = React.createClass({
  getInitialState() {
    return {
      percentComplete: this.props.group.percent,
      refresh: true
    };
  },
  getPercent(){
    if (this.state.refresh === true){
      let percentComplete = parseInt(this.props.group.percent) || this.state.percentComplete || 0
      if (status !== 'Completed' &&  percentComplete === 0){
        getAssetgroupPercent(this.props.group.id).then((res)=>{
          {
            if(res != null && res.output != null){
              let resOutput = JSON.parse(res.output);
              this.setState({
                percentComplete: Math.round(resOutput.percent)
              })
            }
          }
        })
        .catch((error)=>{
          console.log("getAssetgroupPercenterror", error)
        })
      }
    }
  },
  // componentDidMount(){
  //   let percentComplete = parseInt(this.props.group.percent) || this.state.percentComplete || 0
  //   this.getPercent();
  // },
  componentWillReceiveProps(nextProps,nextState){
      let status = this.props.status
      let percentComplete = parseInt(this.props.group.percent) || this.state.percentComplete || 0
      console.log("percentComplete Group Id: "+this.props.group.id +"percent: "+ percentComplete, this.props.group.percent);
      this.setState({
        percentComplete: percentComplete,
        refresh: nextProps.refresh
      }, this.getPercent())
  },
  render(){
  // bsClass='progressbargeneral'
    return(
      <div style={{fontSize:'18px'}}>
        {this.props.status} &nbsp;&nbsp;&nbsp;{this.state.percentComplete} %
        <div>
          <ProgressBar style={{height:'5px'}} bsStyle="success" now={this.state.percentComplete}/>
        </div>
      </div>
    )
  }
})

// function ScanProgress(props){
//   let status = props.status
//   let resourcesScanned = parseInt(props.group.resourcesScanned) || 0
//   let resourcesTobeScanned = parseInt(props.group.resourcesTobeScanned) || 0
//   let percentComplete = 0;
//   percentComplete = Math.round(resourcesScanned/resourcesTobeScanned * 100)
//   if(isNaN(percentComplete)) {
//     percentComplete = 0
//   } else if(percentComplete > 100) {
//       percentComplete = 100
//     }
//
//   // let bsStyle={height:'5px', backgroundColor:"#00C484"}}
//   return(
//     <div style={{fontSize:'18px'}}>
//       {status} &nbsp;&nbsp;&nbsp;{percentComplete} %
//       <div>
//         <ProgressBar bsStyle="success" now={percentComplete}/>
//       </div>
//     </div>
//   )
// }
export function DiscoveryCell ({rowIndex, data, col, errorCol, ...props}) {
  let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null'|| data[rowIndex][col] == 0 && data[rowIndex][col] !== 'null')? data[rowIndex][col].toUpperCase() : '-';
  let errorStatus = (data[rowIndex][errorCol] && data[rowIndex][errorCol]!=='null')? data[rowIndex][errorCol] : '-';
  if(value === "RUNNING"){
    return(
      <Cell  style={{wordBreak: 'break-all',padding:'0px',whiteSpace: 'pre-line',overflow:'auto'}} {...props}>
        <div style={{paddingTop:"8"}}><ScanProgress refresh={props.refresh} key={rowIndex} group={data[rowIndex]} status={AttributeConstants.TEST_STATUS[value]}/></div>
      </Cell>
   )
 } else if(errorStatus && errorStatus !== 'null' && errorStatus !=='-'){
    return (
         <Cell style={{paddingLeft:'30px'}} {...props}
            onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
            onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
            <div data-type="info" ref='valueDiv' data-tip={errorStatus}>
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px"}}>
                {AttributeConstants.TEST_STATUS[value]}
              </div>
            </div>
        </Cell>
        )
 }else{
  return(
     <Cell  style={{wordBreak: 'break-all',padding:'0px',whiteSpace: 'pre-line',overflow:'auto'}} {...props}>
       {AttributeConstants.TEST_STATUS[value]}
     </Cell>
  )
 }
}

export function LinkCell ({rowIndex, data, col, ...props}){
  let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
  return(
  <Cell  {...props}>
    <a href='JavaScript: void(0)'>{value}</a>
  </Cell>
  )
}

export function CheckboxCell ({rowIndex, data, col,...props}){
  let listToUse = [];
  if(props.selectedList[0] !== null && typeof props.selectedList[0] === 'object'){
    // for (){}
    // listToUse.push(props.selectedList[i].id)
    listToUse = props.selectedList.map(function(oneSelected) {return oneSelected.id;});
  } else {
    listToUse = props.selectedList;
  }
 return(
  <Cell style={{marginTop:"5"}} {...props}>
    <input type='checkbox' id={data[rowIndex][col]}
        value={data[rowIndex].cloudtype}
        name = {data[rowIndex].name || data[rowIndex].username || data[rowIndex].ipaddress}
        checked={(listToUse.indexOf(data[rowIndex][col]) != -1)?true:false}
        onChange= {(e) => props.onClickHandler(e)} />
    <label htmlFor={data[rowIndex][col]}></label>
  </Cell>
  )
}

export function CheckboxCellUser ({rowIndex, data, col,...props}){
  // console.log("data[rowIndex][col]", data[rowIndex][col])
  let listToUse = [];
  if(props.selectedList[0] !== null && typeof props.selectedList[0] === 'object'){
    // for (){}
    // listToUse.push(props.selectedList[i].id)
    listToUse = props.selectedList.map(function(oneSelected) {return oneSelected.id;});
  } else {
    listToUse = props.selectedList;
  }
// // if (rowIndex === 0){
//   if (true){
//   document.getElementsByClassName("disabledAdmin").disabled = true;
// }
let render;
let userID = localStorage.getItem("userID");
if (rowIndex === 0 || data[rowIndex][col] == userID){
  console.log("data[rowIndex][col]", data[rowIndex][col])
// if (data[rowIndex].username && data[rowIndex].username === "administrator"){
  render=(<Cell style={{marginTop:"5"}} {...props}><a href='JavaScript: void(0)'>{rowIndex}</a></Cell>)
}else{
  render = (
    <Cell style={{marginTop:"5"}} {...props}>
      <input type='checkbox' id={data[rowIndex][col]}
          value={data[rowIndex].cloudtype}
          name = {data[rowIndex].name?data[rowIndex].name:data[rowIndex].username}
          checked={(listToUse.indexOf(data[rowIndex][col]) != -1)?true:false}
          onChange= {(e) => props.onClickHandler(e)} />
      <label htmlFor={data[rowIndex][col]}></label>
    </Cell>
  )
}
 return rowIndex === 0 || data[rowIndex][col] == userID
   ?
   <Cell style={{marginTop:"5"}} {...props}>
     <input type='checkbox' id={data[rowIndex][col]}
        disabled={true}
         value={data[rowIndex].cloudtype}
         name = {data[rowIndex].name?data[rowIndex].name:data[rowIndex].username}
         checked={(listToUse.indexOf(data[rowIndex][col]) != -1)?true:false}
         onChange= {(e) => props.onClickHandler(e)} />
     <label htmlFor={data[rowIndex][col]}></label>
   </Cell>
  :
    <Cell style={{marginTop:"5"}} {...props}>
      <input type='checkbox' id={data[rowIndex][col]}
          value={data[rowIndex].cloudtype}
          name = {data[rowIndex].name?data[rowIndex].name:data[rowIndex].username}
          checked={(listToUse.indexOf(data[rowIndex][col]) != -1)?true:false}
          onChange= {(e) => props.onClickHandler(e)} />
      <label htmlFor={data[rowIndex][col]}></label>
    </Cell>
}


export function CredCheckboxCell ({rowIndex, data, col,...props}){
  // console.log("datadataasdfasdfk", data[rowIndex].name)
  let listToUse = [];
  if(props.selectedList[0] !== null && typeof props.selectedList[0] === 'object'){
    // for (){}
    // listToUse.push(props.selectedList[i].id)
    listToUse = props.selectedList.map(function(oneSelected) {return oneSelected.id;});
  } else {
    listToUse = props.selectedList;
  }
 return(
  <Cell style={{marginTop:"5"}} {...props}>
    <input type='checkbox' id={data[rowIndex][col]}
        value={data[rowIndex].label}
        name = {data[rowIndex].label}
        checked={(listToUse.indexOf(data[rowIndex][col]) != -1)?true:false}
        onChange= {(e) => props.onClickHandler(e)} />
    <label htmlFor={data[rowIndex][col]}></label>
  </Cell>
  )
}

export function CheckboxCell2 ({rowIndex, data, col, matrix, ...props}){
  let listToUse = [];
  // let newID = matrix ? data[rowIndex][col] + matrix : data[rowIndex][col];
  let newID = data[rowIndex][col]

  if(props.selectedList[0] !== null && typeof props.selectedList[0] === 'object'){
    // for (){}
    // listToUse.push(props.selectedList[i].id)
    listToUse = props.selectedList.map(function(oneSelected) {return oneSelected.id;});
  } else {
    listToUse = props.selectedList;
  }
  // value={matrix?matrix:data[rowIndex].cloudtype}

 return(
  <Cell style={{marginTop:"5"}} {...props}>
    <input type='checkbox' id={newID}
        value={matrix?matrix:data[rowIndex].cloudtype}
        data-custom={data[rowIndex][col]}
        checked={(listToUse.indexOf(data[rowIndex][col]) != -1)?true:false}
        onChange= {(e) => {
          props.onClickHandler(e, matrix)}} />
    <label htmlFor={data[rowIndex][col]}></label>
  </Cell>
  )
}

// export function CheckboxCell3 ({rowIndex, data, col, ...props}) {
//
//   let value;
// return(
//   <Cell  style={{wordBreak: 'break-all',padding:'0px',whiteSpace: 'pre-line',overflow:'auto'}} {...props}>
//     <input type='checkbox'
//       // id={newID}
//       //   value={matrix?matrix:data[rowIndex].cloudtype}
//       //   data-custom={data[rowIndex][col]}
//       // checked={(listToUse.indexOf(data[rowIndex][col]) != -1)?true:false}
//         // onChange= {(e) => {
//         //   props.onClickHandler(e)}}
//           />
//   </Cell>
//  )
// }

export function CheckboxCell3 ({rowIndex, data, col, matrix, ...props}){
  let listToUse = [];
    // console.log("this is the role data", data, data[rowIndex],data[rowIndex][col] )
  // // let newID = matrix ? data[rowIndex][col] + matrix : data[rowIndex][col];
  let newID = data[rowIndex][col]
  // let newID = 0
  //
  // if(props.selectedList[0] !== null && typeof props.selectedList[0] === 'object'){
  //   // for (){}
  //   // listToUse.push(props.selectedList[i].id)
  //   listToUse = props.selectedList.map(function(oneSelected) {return oneSelected.id;});
  // } else {
  //   listToUse = props.selectedList;
  // }
  // value={matrix?matrix:data[rowIndex].cloudtype}

 return(
  <Cell style={{marginTop:"5"}} {...props}>
    <input type='checkbox' id={newID}
      checked={(listToUse.indexOf(data[rowIndex][col]) != -1)?true:false}
        onChange= {(e) => {
          props.onClickHandler(e)}}
 />
    <label htmlFor={data[rowIndex][col]}></label>
  </Cell>
  )
}

export function ArrayLinkCell ({rowIndex, data, col, ...props}) {
  let linkArray = [];
  if(data[rowIndex][col] != null){
    (data[rowIndex][col]).map((item) => {
        linkArray.push(<a href='JavaScript: void(0)' key={item}>{item}</a>)
        linkArray.push(' ')
    })
    return(
    <Cell  {...props}>{linkArray}</Cell>
    )
  }else{
    return <Cell  {...props}>-</Cell>
  }

}

export function AccessCell ({rowIndex, data, col, ...props}) {
  let iconClass = (data[rowIndex][col]==="True")?"ok":"remove"
  let iconStyle = {fontSize:'12px',color: (data[rowIndex][col]==="True")?"#00C484":"#FF444D"}

  return(
  <Cell className={center} {...props}><Glyphicon glyph={iconClass} style={iconStyle}/></Cell>
)}

export function ScoreCell ({rowIndex, data, statusCol,col, ...props}) {
  let statusStyle;
  if(data[rowIndex][col] <= 50 && data[rowIndex]['discovery_status'] === "COMPLETED"){
    statusStyle = diamondRed;
  }else if(data[rowIndex][col] > 80 && data[rowIndex]['discovery_status'] === "COMPLETED"){
    statusStyle = circleGreen;
  }else if(50 < data[rowIndex][col] <= 80 && data[rowIndex]['discovery_status'] === "COMPLETED"){
    statusStyle = triangleupOrange;
  }
    return(
    <Cell {...props}>
      <div className={statusStyle} style={{paddingLeft:'35px'}}>{statusStyle?data[rowIndex][col]:""}</div>
    </Cell>
)}



export const ScoreLinkCell = React.createClass({
  render() {
    const {rowIndex, ...props} = this.props;
    let data =this.props.data;
    let statusStyle;
    if(data[rowIndex]["score"] >= 0 && data[rowIndex]["score"] != null){
      if(data[rowIndex]["score"] <= 50 && data[rowIndex]['discovery_status'] === "COMPLETED"){
        statusStyle = diamondRed;
      }else if(50 < data[rowIndex]["score"] && data[rowIndex]["score"] <= 80 && data[rowIndex]['discovery_status'] === "COMPLETED"){
        statusStyle = triangleupOrange;
      }else if(data[rowIndex]["score"] > 80 && data[rowIndex]['discovery_status'] === "COMPLETED"){
        statusStyle = circleGreen;}
    }
      return(
      <Cell {...props}>
        <div className={statusStyle} style={{paddingLeft:'25px'}}>
          {
            statusStyle?
            <a href={'#/assetGroupReport/'+data[rowIndex]['worklogid']} target="_blank">{data[rowIndex]["score"]}</a>
            :
            "-"
          }
        </div>
      </Cell>
      )
  }
});

export function ScoreCell2 ({index, data, ...props}) {
  let that = this;
  let statusStyle;
  if(data.score <= 50){
    statusStyle = diamondRed;
  }else if(data.score > 80){
    statusStyle = circleGreen;
  }else if(50 < data.score <= 80){
    statusStyle = triangleupOrange;
  }
    return (
      <div>
        <div className={statusStyle}>{statusStyle?data.score:""}</div>
        {/*<a className={statusStyle} data-for='score' data-tip='custom show' data-event='click focus' style={{paddingLeft:'30px'}}>{statusStyle?data.score:""}</a>
        <ReactTooltip id='score' place="right" type="info" >
          <div></div>
          <div>ERROR: Error</div>
          <div>REMEDIATION: Remediate</div>
      </ReactTooltip>*/}
      </div>
    );
}

export function ComplianceCell ({rowIndex, data, statusCol, ...props}) {
  let statusStyle;
  let value = (data[rowIndex][statusCol] && data[rowIndex][statusCol] !=null && data[rowIndex][statusCol] !== "null" && data[rowIndex][statusCol] >= 0 )? data[rowIndex][statusCol] : '-'
  if(value != null && value !== '-'){
    var score = parseInt(value);
    if(score <= 50){
      statusStyle = diamondRed;
    }else if(50 < score && score <= 80){
      statusStyle = triangleupOrange;
    }else if(score > 80){
      statusStyle = circleGreen;
    }
  }

  return(
   <Cell {...props}>
    <div className={statusStyle} style={{paddingLeft:'30px',display:'flex',justifyContent:'center'}}>{value}</div>
  </Cell>
)}

export const GroupCell = React.createClass({
  render() {
    const {data, rowIndex, col, ...props} = this.props;
    let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
    let cut = value;
    if (value.length >= 15) {
      cut = value.slice(0, 15) + " ...";
      return (
        <Cell
          style={{paddingLeft:'30px'}} {...props}
          onMouseEnter={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));
          }}
          onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));
          }}>
          <div ref='valueDiv' data-tip={value}>
            {cut}
          </div>
        </Cell>
      );
    } else {
      return (
        <Cell  style={{wordBreak: 'break-all',padding:'0px',whiteSpace: 'pre-line',overflow:'auto'}} {...props}>
          {value}
        </Cell>
      )
    }
  }
});


export const PolicyPacksCell = React.createClass({
  render() {
    const {data, rowIndex, col,policyname, ...props} = this.props;
    let value = '-';
    if(typeof(policyname) === 'object')
      value = policyname.length > 0? policyname.join(', ') : '-';
    else if (typeof(policyname) === 'string')
      value = policyname
  return(
    (value.length < 5)?
    <Cell {...props} style={{textAlign:"center"}}>
      {value}
    </Cell>:
    <Cell {...props}
      onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
      onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
      <div data-type="info" ref='valueDiv' data-tip={value}>
        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px", paddingLeft:"10px"}}>
          {value}
        </div>
      </div>
    </Cell>
    );
  }
})

export const TooltipCell = React.createClass({
  render() {
    const {data, rowIndex, col, ...props} = this.props;
    let valueOrig = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
    var value = valueOrig.replace(/["{}]/g,"").split(',').join(', ')
      if(value && value !== 'null' && value !=='-') {
        if(col === "enddate") {
          value = moment(value).format('MM[/]DD[/]YYYY [@] HH[:]mm');
        }
        return (
          <Cell style={{paddingLeft:'30px'}} {...props}
            onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
            onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
            <div data-type="info" ref='valueDiv' data-tip={value}>
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px"}}>
                {value}
              </div>
            </div>
          </Cell>
        );
      }
      else {
        value = '-';
        return (
          <Cell  style={{paddingLeft:'30px'}} {...props}>
              {value}
          </Cell>
        );
      }
    }
});


export const TestStatusCell = React.createClass({
  render() {
    const {data, rowIndex,errorCol,col, ...props} = this.props;
    let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
      if(value && value !== 'null' && value !=='-') {
        return (
          <Cell {...props}
            onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
            onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
            <div data-type="info" ref='valueDiv' data-tip={AttributeConstants.TEST_STATUS[value]}>
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px"}}>
                {AttributeConstants.TEST_STATUS[value]}
              </div>
            </div>
          </Cell>
        );
      }
      else {
        value = '-'
        return (
          <Cell  style={{paddingLeft:'30px'}} {...props}>
            {value}
          </Cell>
        );
      }
    }
});


export const TooltipCellPolicyPack = React.createClass({
  render() {
    const {data, rowIndex, col, ...props} = this.props;
    let valueOrig = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
    var value = valueOrig.replace(/["{}]/g,"").split(',').join(', ')
      if(value && value !== 'null' && value !=='-') {
        if(col === "enddate") {
          value = moment(value).format('MM[/]DD[/]YYYY [@] HH[:]mm');
        }
        return (
          <Cell style={{paddingLeft:'10px'}} {...props}
            onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
            onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
            <div data-type="info" ref='valueDiv' data-tip={value}>
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width - 30}}>
                {value}
              </div>
            </div>
          </Cell>
        );
      }
      else {
        value = '-';
        return (
          <Cell  style={{paddingLeft:'30px'}} {...props}>
              {value}
          </Cell>
        );
      }
    }
});

// export const TooltipCell = React.createClass({
//   render() {
//     const {data, rowIndex, col, ...props} = this.props;
//     let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
//     let cut = value;
//     if (col === "osName" && value.length > 15) {
//       cut = value.slice(0, 15) + " ...";
//       return (
//         <Cell
//           style={{paddingLeft:'30px'}} {...props}
//           onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
//           onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
//           <div data-type="info" ref='valueDiv' data-tip={value}>
//             {cut}
//           </div>
//         </Cell>
//       );
//     } else if (col === "hostName") {
//       return (
//         <Cell style={{paddingLeft:'30px'}} {...props}
//           onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
//           onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
//           <div data-type="info" ref='valueDiv' data-tip={value}>
//             <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px"}}>
//               {value}
//             </div>
//           </div>
//         </Cell>
//       );
//     }
//     else if(col === "enddate")
//     {
//       let lastScan ;
//       if(value && value !== 'null' && value !=='-')
//       {
//         lastScan =moment(value).format('MM[/]DD[/]YYYY [@] HH[:]mm[:]ss');
//         return (
//           <Cell style={{paddingLeft:'30px'}} {...props}
//             onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
//             onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
//             <div data-type="info" ref='valueDiv' data-tip={lastScan}>
//               <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px"}}>
//                 {lastScan}
//               </div>
//             </div>
//           </Cell>
//         );
//       }
//       else
//       { lastScan = '-';
//         return (
//           <Cell  style={{paddingLeft:'30px'}} {...props}>
//               {lastScan}
//           </Cell>
//         );
//       }
//     }
//      else if (col !== "osName" && value.length > 12) {
//       cut = value.slice(0, 12) + " ...";
//       return (
//         <Cell
//           style={{paddingLeft:'30px'}} {...props}
//           onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
//           onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
//           <div data-type="info" ref='valueDiv' data-tip={value}>
//             {cut}
//           </div>
//         </Cell>
//       );
//     } else {
//       return(
//         <Cell  style={{paddingLeft:'30px'}} {...props}>
//             {value}
//         </Cell>
//      )
//     }
//   }
// });

export const AlertReports = React.createClass({

  render() {
    const {data, rowIndex, col,alertId,startTimeAlertDetail,endTimeAlertDetail, ...props} = this.props;
    // alert('I am calle'+JSON.stringify(data[rowIndex].record))

    let myArray=[], valueForTool, myArray2=[];
    let alertdata=[];
    if(data[rowIndex].record)
      alertdata.push(data[rowIndex].record)




    for (var key in data[rowIndex].record) {
       let resultVal = JSON.stringify(data[rowIndex].record[key])
       let resultValue = resultVal.replace(/\"/g, "")

        let myResultValue = ' '+ '<b>'+key+'</b>' + ' : ' + resultValue+' '
        let myResultValueTool=' '+ key + ' : ' + resultValue+' '
        myArray.push(myResultValue)
        myArray2.push(myResultValueTool)
        myArray.toString()
        myArray2.toString()
        valueForTool = myArray2.toString()
     }
     if(myArray.toString().length>400){
        let shortCredLabel=myArray.toString().substring(0,400)
        myArray=shortCredLabel.concat('...')
      }

    let value = (data[rowIndex].record !== 'null')? myArray: '-';

   let alertsText = JSON.stringify(data[rowIndex].record);
    let newStartTime = this.props.startTimeAlertDetail[rowIndex];
    let newEndTime = this.props.endTimeAlertDetail[rowIndex];

   return (
      <div>
      <Cell {...props}>

        <div
          onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
          onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
          {/*<div data-type="info" ref='valueDiv' data-tip={value}>
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"20px",paddingTop:9}}>
                {value}
            </div>
          </div>
          <div style={{float:'right', paddingRight:20}}>
            <AlertDetails  alertId={this.props.alertId} starttime={newStartTime} endtime={newEndTime} />
          </div>
          </div>*/}
          <div data-type="info" ref='valueDiv' data-tip={valueForTool} style={{fontSize:17}} data-class={toolstyle}></div>
            <div style={{wordBreak:'break-all'}} dangerouslySetInnerHTML={{__html:value}}></div>


        </div>
        <div style={{float:'right', paddingRight:10, marginTop:2}}>
            <AlertDetails type={this.props.type} alertdata={alertdata} alertId={this.props.alertId} starttime={newStartTime} endtime={newEndTime} />
          </div>
        </Cell>
      </div>
    );
    }
});
export const ImageCell = React.createClass({

  render() {
    const {data, rowIndex, col, ...props} = this.props;

    let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';


    return (
      <div>
        <Cell {...props}
          onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
          onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
          <div data-type="info" ref='valueDiv' data-tip={value}>
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"20px"}}>
                {value}
            </div>
          </div>
        </Cell>
      </div>
    );
    }
});

export const GroupsCell = React.createClass({

  render() {
    const {data, rowIndex, col, ...props} = this.props;
    let valueAlert = "New Window";
    let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
    let groupsResourcesLink = 'JavaScript: void(0)'
      groupsResourcesLink = '#groupsResourcesDetails/'+data[rowIndex]["id"]+"/"+data[rowIndex]["name"]

    return (
      <div>
        <Cell {...props}
          onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
          onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
          <div data-type="info" ref='valueDiv' data-tip={value}>
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"20px"}}>
              &nbsp;&nbsp;&nbsp;&nbsp;<a href={groupsResourcesLink} target='_blank' title='Open in a new Window'><Glyphicon style={{fontSize: '15px', marginLeft:-14, color:'#505ca6'}} glyph={'share'}></Glyphicon></a>&nbsp;&nbsp;&nbsp;
              {value}
            </div>
          </div>
        </Cell>
      </div>
    );
    }
});

export const GroupsForSchedule = React.createClass({
  render(){
    const {data, rowIndex, col, ...props} = this.props;
    let value = (data[rowIndex][col].length > 0)? data[rowIndex][col].join(', ') : '-';

  return(
    (value.length < 5)?
    <Cell {...props} style={{textAlign:"center"}}>
      {value}
    </Cell>:
    <Cell {...props}
      onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
      onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
      <div data-type="info" ref='valueDiv' data-tip={value}>
        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px", paddingLeft:"10px"}}>
          {value}
        </div>
      </div>
    </Cell>

    );
  }
})

export const TagsCell = React.createClass({

  render() {
    const {data, rowIndex, col, ...props} = this.props;
    let value =(data[rowIndex][col] && data[rowIndex][col] !== 'null')? JSON.stringify(data[rowIndex][col].AWS): '-';
    if(value==='{}')
      value = '-'
    let cut = value;
      if (value.length > 15) {
        cut = value.slice(0, 15) + " ...";
        return (
          <Cell {...props}
            onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
            onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
            <div data-type="info" ref='valueDiv' data-tip={value}>
              {cut}
            </div>
          </Cell>
        );
      } else {
        return(
        <Cell {...props}>
          {value}
        </Cell>
        )
      }
    }
});

export const CollapsedRowsCell = React.createClass({
  render() {
    const {data, col, rowIndex, columnKey, collapsedRows, callback, ...props} = this.props;
    let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
    return (
      <Cell {...props}>
        <div style={{paddingLeft:"15", marginLeft:-10}} onClick={() => callback(rowIndex)}>
          {value}&nbsp;&nbsp;{collapsedRows.has(rowIndex) ? (<Glyphicon style={{fontSize: '10px'}} glyph={'menu-up'}></Glyphicon>) : (<Glyphicon style={{fontSize: '10px'}} glyph={'menu-down'}></Glyphicon>) }
        </div>
      </Cell>
    );
  }
});

export const TooltipDataCell = React.createClass({
  render() {
    var colStyle = {borderRight:'2px solid #E5EAF4'}
    const {data, rowIndex, col, ...props} = this.props;
    let value = (data[rowIndex][col] && data[rowIndex][col] !== 'null')? data[rowIndex][col] : '-';
    var tooltipContent1 = (
      `<div>
        Generating Report: 70%
      </div>`
    )
    var tooltipContent = (
      <div>
        Generating Report: 70%
      </div>
    )
      return (
        <Cell
          style={{paddingLeft:'30px'}} {...props}
          onFocusOut={() => { "", console.log(onFocusOut); ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}
          onMouseMove={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}
          onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}
          >
          <a data-tip='custom show' data-event='click focus' data-for='ipaddress'> {value} </a>
          <ReactTooltip  type="info" scroll-hide='true' globalEventOff='click' style={{zIndex: '10'}} id='ipaddress' aria-haspopup='true' role='example' place="top">
            <Row style={{width:'80em'}}>
              <Col style = {colStyle} lg={3}>
                <div>Device Configuration</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
              </Col>
              <Col style = {colStyle} lg={3}>
                <div>Cloud Details</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
                <div>FAKE DATA FAKE DATA FAKE DATA</div>
              </Col>
              <Col lg={6}>
                <div>Policy Pack and Compliance Status</div>
                <Row>
                  <Col lg={3}>
                    TIME/DATE
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                  </Col>
                  <Col lg={3}>
                    DESCRIPTION/INFO
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                  </Col>
                  <Col lg={3}>
                    ICON/GLYPH
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                  </Col>
                  <Col lg={3}>
                    SCORE/INFO
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                    <div>FAKE DATA</div>
                  </Col>

                </Row>
              </Col>
            </Row>
          </ReactTooltip>
          onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
          onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
          <div ref='valueDiv' data-tip={value}>
            {cut}
          </div>
        </Cell>
      );
  }
});

export function RoleHeader ({rowIndex, data, col, selectAllHandler, ...props}) {
  return(
    <Cell style={{textAlign:"center"}} >
      <div>
        {col} <Glyphicon style={{color:'#4e56a0', fontSize:"16"}} glyph="glyphicon glyphicon-pencil" />
      </div>
      <div style={{color:'red', fontSize:"11", fontWeight:"100"}}>
        (Suspended)
      </div>
    <input type='checkbox'
      // id="selectAllChk" className="chkAll"
    checked={(data.length > 0 )?true:false}
    onClick={selectAllHandler}
    // ref={input => {
    //     if (input) {
    //       input.indeterminate = (selectedList.length > 0 && selectedList.length < data.length)?true:false;
    //     }
    //   }}
    />
    <label htmlFor="selectAllChk"></label>
    </Cell>
 )
}
