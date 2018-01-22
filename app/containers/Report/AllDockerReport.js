import React, { PropTypes } from 'react'
import {  Nav, Navbar, Form, FormGroup, FormControl,InputGroup,Glyphicon,
         ControlLabel, Button, Grid, Row , Col,OverlayTrigger, Popover} from 'react-bootstrap'
import DatePicker from 'react-bootstrap-date-picker'
import {blueBtn, btnPrimary,selectStyle} from 'sharedStyles/styles.css'
import {dateInput} from './styles.css'
import { DockerReport } from 'components'
import RepeatTest from './RepeatTest'
import StopTest from './StopTest'
import DeleteTest from './DeleteTest'
import GenerateReport from './GenerateReport'
import {getPolicyDetails} from 'helpers/policies'
import getAssetGroupsList from 'helpers/assetGroups'
import {getReportsMainList,getReportsExists,getReportsCount} from 'helpers/reports'
import {dockerScanResults} from 'helpers/docker'
import Joi from 'joi-browser'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const ReportsInitialState = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>You currently have no report available</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>Would you like to start a new assessment?</td></tr>
          <tr><td style={{textAlign: 'center'}}>
            <Button href={'#/cloud/-1'} bsStyle='primary' bsSize='large' className={btnPrimary} style={{borderRadius: 0, marginTop: 20,marginBottom: 20,width:'300px'}}>
                Discover and Test
            </Button>
          </td></tr>
        </tbody>
      </table>
    )
  }
})

function findElement(arr, propName, propValue) {
  let report = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      report = arr[i];
  return report
}

const ActionButtons = React.createClass({
  render: function () {
        let count = this.props.reportCount
        let selectedCount = this.props.selectedList.length
        let selectedReport = {}
        let selectedReports = []
        let separator =  ' | '
        let repeatTestSeparator =  ''
        let stopSeperator = ''
        if(selectedCount === 1){
          selectedReport = findElement(this.props.list,"scanid",this.props.selectedList[0]);
          selectedReports.push(selectedReport);
          if(selectedReport.status === 'COMPLETED' || selectedReport.status === 'ABORTED'){
            repeatTestSeparator =  ' | '
          }else{
            stopSeperator =  ' | '
          }
        }else if(selectedCount > 1){
            this.props.selectedList.map((scanid) => {
              selectedReports.push(findElement(this.props.list,"scanid",scanid));
            })
        }
        return (selectedCount > 0 )
        ? <p style={{paddingLeft: 5, fontSize: 15}}>
            {selectedCount} Reports selected: {' '}
           {/* {(selectedCount === 1 && selectedReport.status === 'COMPLETED') ? <GenerateReport report={selectedReport}/> : <noscript />}{repeatTestSeparator}
            {(selectedCount === 1 && (selectedReport.status === 'COMPLETED' || selectedReport.status === 'ABORTED')) ? <RepeatTest report={selectedReport} reloadList={this.props.reloadList} showAlert={this.props.showAlert}/> : <noscript />}{repeatTestSeparator}
            <a href="javaScript:void(0)">Archive</a> {separator}
            <a href="javaScript:void(0)">Share</a> {separator}
            <DeleteTest selectedReports={selectedReports} removeReport={this.props.removeReport}/>{stopSeperator}
            {(selectedCount === 1 && selectedReport.status !== 'COMPLETED' && selectedReport.status !== 'ABORTED') ? <StopTest report={selectedReport} /> : <noscript />}*/}
        </p>
      :
      <p style={{paddingLeft: 5, fontSize: 15}}>{count} Reports</p>
  }
})

const ControlFamilySelection = React.createClass({
  getInitialState(){
    return{
      policyPacks:[],
      groups:[],
    }
  },
  componentDidMount(){
    getPolicyDetails("root")
    .then((rootPolicies) => {
      this.setState({policyPacks: rootPolicies});
    })
    .catch((error) => console.log("Error in getting the root policies list:"+JSON.stringify(error)))

    getAssetGroupsList()
    .then(
      (groups) =>  {
        this.setState({groups:groups});
      }
     )
    .catch((error) => console.log("Error in getAssetGroupsList in container:" + error))

  },
  render: function () {
    let selectStyle1 = { border:'1px solid #4C58A4',height:40,fontSize: 18,color:'#4C58A4', marginLeft: 120,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:0, width:'165px',backgroundSize: '6px 6px,6px 6px, 2.5em 2.5em',lineHeight:'2.3em'}
    return (
      <div style={{marginLeft:300}}>
        <select className={selectStyle} style={selectStyle1} id="policyPack" onChange={this.props.handlePolicyPackChange}>
        <option value="">All Policy Packs</option>
          {this.state.policyPacks.map((option) => {
           if(option.path.indexOf("Image_")!=-1){
              let val = "["+option.path+"]";
              return(<option key={option.path} value={val}>{option.title}</option>)
            }
            }
          )}
        </select>
        
      </div>
    )
  }
})

const ReportSelector = React.createClass({
  getInitialState: function(){
    return {
      valueFrom: '',
      valueTo: '',
      valueFrom_validation:null,
      valueTo_validation:null,
      valueFrom_error: '',
      valueTo_error: ''
    }
  },
  componentDidMount(){
    this.setState({valueFrom:this.props.fromDate})
    this.setState({valueTo:this.props.toDate})
  },
  componentWillReceiveProps(nextProps,nextState){
    if (nextProps.fromDate != this.props.fromDate) {
      this.setState({valueFrom:nextProps.fromDate})
    }
    if (nextProps.toDate != this.props.toDate) {
      this.setState({valueTo:nextProps.toDate})
    }
  },
  validateFromDate(value){
    let valid = true
    let newDate = new Date();
    let currentDate = newDate.toDateString();
    let fromValueDate = new Date(value).toDateString();
   // let toValueDate = new Date(this.state.valueTo).toDateString();

    //let fromDate_schema = {fromDate: Joi.date().max(currentDate).max(toValueDate)}
    let fromDate_schema = {fromDate: Joi.date().max(currentDate)}
    let result = Joi.validate({fromDate: fromValueDate}, fromDate_schema)
    if(result.error){
      valid = false
    }

    return valid
  },
  validateToDate(value){
    let valid = true
    let newDate = new Date();
    let currentDate = newDate.toDateString();
    let toValueDate = new Date(value).toDateString();
    //let fromValueDate = new Date(this.state.valueFrom).toDateString();

    //let toDate_schema = {toDate: Joi.date().max(currentDate).min(fromValueDate)}
     let toDate_schema = {toDate: Joi.date().max(currentDate)}
    let toResult = Joi.validate({toDate: toValueDate}, toDate_schema)
    if(toResult.error){
      valid = false
    }

    return valid
  },
  handleChangeFrom: function(value,formattedValue) {
    // value is an ISO String.
    this.setState({
      valueFrom: value
    });
    if(this.validateFromDate(value)){
      this.setState({valueFrom_validation: '',valueFrom_error: ''});
      this.refs.fromDateHint.hide();
      this.props.fromDateChange(value);
    }else{
      this.setState({valueFrom_validation: "error",valueFrom_error: "From date should be less than or equal to today and 'To' date"});
      this.refs.fromDateHint.show();
    }
  },
  handleChangeTo: function(value,formattedValue) {
    // value is an ISO String.
    this.setState({
      valueTo: value
    });

    if(this.validateToDate(value)){
      this.setState({valueTo_validation: '',valueTo_error: ''});
      this.refs.toDateHint.hide();
      this.props.toDateChange(value);
    }else{
      this.setState({valueTo_validation: "error",valueTo_error: "To date should be less than or equal to today and greater than or equal to 'From' date"});
      this.refs.toDateHint.show();
    }

  },
  fromDateChanged(e){
    if(!this.validateFromDate(formFromDate.value)){
      this.setState({valueFrom_error: "Not valid from date. So ignoring the changes"});
      //this.setState({valueFrom_validation: "error"});
      this.refs.fromDateHint.hide();
    }

  },
  toDateChanged(e){
    if(!this.validateToDate(formToDate.value)){
      this.setState({valueTo_error: "Not valid from date. So ignoring the changes"});
      //this.setState({valueTo_validation: "error"});
      this.refs.toDateHint.hide();
    }
  },
  render: function () {
    return (
      <div className="row">
        <div className="col-lg-5">
          <Form inline>
            <OverlayTrigger
              ref="fromDateHint"
              placement="top"
              trigger="manual"
              overlay={ <Popover id="valueFromTooltip">{this.state.valueFrom_error}
                        </Popover>
                      }
            >
            <FormGroup controlId="formFromDate" className="datePick" validationState={this.state.valueFrom_validation}>
              <ControlLabel style={{fontSize:'14px',fontWeight:'500'}}>From</ControlLabel>
              {' '}
              <DatePicker value={this.state.valueFrom} onBlur={this.fromDateChanged} onChange={this.handleChangeFrom}/>
            </FormGroup>
            </OverlayTrigger>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <OverlayTrigger
              ref="toDateHint"
              placement="top"
              trigger="manual"
              overlay={ <Popover id="valueToTooltip">{this.state.valueTo_error}
                        </Popover>
                      }
             >

            <FormGroup controlId="formToDate" className="datePick" validationState={this.state.valueTo_validation}>
              <ControlLabel style={{fontSize:'14px',fontWeight:'500'}}>To</ControlLabel>
              {' '}
              <DatePicker value={this.state.valueTo} onBlur={this.toDateChanged} onChange={this.handleChangeTo}/>
            </FormGroup>

            </OverlayTrigger>
          </Form>
        </div>
        <div  className="col-lg-7">
          <ControlFamilySelection
            handlePolicyPackChange={this.props.policyPackChange}
            handleGroupChange={this.props.groupChange}   />
        </div>
      </div>
    )
  }
})

const AllDockerReports = React.createClass({
  getInitialState(){
    return{
      loading:false,
      reportsExist:true,
      reportsCount:'',
      list:[],
      selectedList: [],
      selectAll:false,
      selectedPolicyPack:'',
      selectedGroup:'',
      fromDate:'',
      toDate:'',
      filterList:{}
    }
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  componentWillMount(){
    getReportsExists()
    .then((result) => {
      if(result != null && result.status === false)
        this.setState({reportsExist:false})
    })
    .catch((error) => console.log("Error in getting Reports status:"+error))

    getPolicyDetails("root")
    .then((rootPolicies) => {
      this.setState({policyPacks: rootPolicies});
    })
    .catch((error) => console.log("Error in getting the root policies list:"+JSON.stringify(error)))
  },
  componentDidMount(){
    //get total reports count
    // getReportsCount()
    // .then((counts) => {
    //   if(counts !== null)
    //     this.setState({reportsCount:counts.total})
    // })
    // .catch((error) => console.log("Error in getting Reports count:"+error))

 
    //set default filter to be last one month records
    /*
    let toDate = new Date();
    let currentDate = new Date();
    let fromDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

    this.setState({toDate:toDate.toISOString(),fromDate:fromDate.toISOString()},function(){
      this.constructFilter();
    })
    */
    this.applyFilter()
  },
  showAllReports(){
    let navPath='/report/allreports';
    // console.log("NavPath is "+navPath);
    this.context.router.replace(navPath);

  },
  showAllDockerReports(){
    let navPath='/report/alldockerreports';
    // console.log("NavPath is "+navPath);
    this.context.router.replace(navPath);
  },

  fromDateChange(value){
    this.setState({fromDate:value},function(){
      this.constructFilter();
    });
  },
  toDateChange(value){
    this.setState({toDate:value},function(){
      this.constructFilter();
    });
  },
  policyPackChange(e){

    this.setState({selectedPolicyPack:e.target.value},function(){
      this.constructFilter();
    });
  },
  groupChange(e){
    this.setState({selectedGroup:e.target.value},function(){
      this.constructFilter();
    });
  },
  constructFilter(){
    let filters = {};

    if(this.state.fromDate != null && this.state.fromDate !== ''){
      filters["startdate"] = this.state.fromDate;
    }
    if(this.state.toDate != null && this.state.toDate !== ''){
      filters["enddate"] = this.state.toDate;
    }
    if(this.state.selectedPolicyPack != null && this.state.selectedPolicyPack !== ''){
      filters["policypacks"] = this.state.selectedPolicyPack.split(',');
    }
    if(this.state.selectedGroup != null && this.state.selectedGroup !== ''){
      filters["groups"]= this.state.selectedGroup.split(',');
    }

    this.setState({filterList:filters},function(){
      this.applyFilter()
    });
  },
  applyFilter(){
   
    console.log("apply filter called: "+JSON.stringify(this.state.filterList));
    dockerScanResults(50,50,this.state.filterList)
    .then((reports) =>  {
     
        this.setState({list:reports.scanResults,
                       reportsCount:reports.filterCount,
                    selectedList:[]});
    })
    .catch((error) => console.log("Error in getReportsMainList in container:" + error))
  },
  onClickHandler(e) {
    let chkVal = parseInt(e.target.id);
    const index = this.state.selectedList.indexOf(chkVal)
    let newList = this.state.selectedList.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({selectedList: newList})
  },
  selectAllHandler(){
    this.setState({selectAll:!this.state.selectAll}, function(){
      if(this.state.selectAll === true){
       dockerScanResults(0,0,this.state.filterList)
       .then((reports) =>  {
        let selectList = [];
        reports.scanResults.map((r) => {
          selectList.push(r.scanid)
        })
        this.setState({list:reports.scanResults, reportsCount:reports.filterCount,selectedList:selectList});
       })
       .catch((error) => console.log("Error in getReportsMainList in container:" + error))
      }else{
        this.setState({selectedList: []})
      }
    })
  },
  reloadList(){
    this.applyFilter();
  },
  updateList(newList){
    this.setState({list:newList});
  },
  getDataOnScroll(start,end,filter){
    dockerScanResults(start,end,filter)
    .then((resultsList) =>  {
       let newList = this.state.list.concat(resultsList.scanResults);
       this.updateList(newList);
    })
    .catch((resultListError) => console.log("Error in getReportsMainList:" + resultListError))
  },  
  refreshDetails(index,workLogStr){
    if (index !== -1) {
      let newList = this.state.list.slice();
      newList[index].status = workLogStr;
      this.setState({list:newList});
    }
  },
  removeReport(reportId){
    //remove report from selected list
    this.removeFromSelected(reportId)

    //remove report from the list
    let reportInx = -1;
    for (var i=0; i < this.state.list.length; i++)
      if (this.state.list[i]["scanid"] == reportId)
        reportInx = i;
    let newList = this.state.list.slice();
    if(reportInx > -1){
      newList.splice(reportInx,1);
      this.setState({list: newList});
    }

  },
  removeFromSelected(reportId){
    let newList = this.state.selectedList.slice();
    const index = this.state.selectedList.indexOf(reportId)
    if(index > -1){
      newList.splice(index,1);
      this.setState({selectedList: newList});
    }
  },  
  showAlert(msg){
    Alert.show(msg);
  },
  render() {
    return (
      <div>
      {this.state.reportsExist ?
      <div style={{marginLeft:'60px',marginRight:'60px'}}>
        <FormGroup controlId="search" className="search">
        <InputGroup style={{marginRight:"60px", marginTop:"30px"}}>
          <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
          <FormControl type="text" placeholder="Search for reports, policy packs, control families, controls or groups"  />
        </InputGroup>
        </FormGroup>

        <div>

        <ReportSelector
         fromDate={this.state.fromDate}
         toDate={this.state.toDate}
         fromDateChange={this.fromDateChange}
         toDateChange={this.toDateChange}
         policyPackChange={this.policyPackChange}
         groupChange={this.groupChange}/>

        <div style={{margin:'0px',height:'27x'}}>&nbsp;</div>
          <div style={{position:'relative'}}>
            <div style={{width:'50%', float:'left'}}>
              <ActionButtons
                reportCount={this.state.reportsCount}
                selectedList={this.state.selectedList}
                list={this.state.list}
                reloadList={this.reloadList}
                showAlert={this.showAlert}
                removeReport={this.removeReport}/>
            </div>
            <div id="tabs" style={{minWidth:222, width:'50%', position:'absolute',top:-5, right:58, zIndex:999, display:'flex',justifyContent:'flex-end',}}>
                  <Tabs selectedIndex={1}>
                    <TabList >
                      <Tab><div onClick={this.showAllReports} >Group Report Page</div></Tab>
                      <Tab><div onClick={this.showAllDockerReports} >Image Report page</div></Tab>
                    </TabList>
                  </Tabs>
            </div>
          </div>
       

        <DockerReport
          selectHandler={this.onClickHandler}
          reportsList={this.state.list}
          selectedList={this.state.selectedList}
          selectAllHandler={this.selectAllHandler}
          refreshDetails={this.refreshDetails}
          getDataList={this.getDataOnScroll}
          updateList={this.updateList}
          filter={this.state.filterList}
          />
        </div>
      </div>
    
     
      :
      <div><ReportsInitialState/></div>
      }
      </div>
      )

  },
})

export default AllDockerReports

