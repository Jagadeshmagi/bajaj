import React, { PropTypes } from 'react'
import {Nav, Navbar, Form, FormGroup, FormControl,InputGroup,Glyphicon,
         ControlLabel, Button, Grid, Row , Col,OverlayTrigger, Popover} from 'react-bootstrap'
import DatePicker from 'react-bootstrap-date-picker'
import {blueBtn, btnPrimary,selectStyle} from 'sharedStyles/styles.css'
import {dateInput} from './styles.css'
import { Report } from 'components'
import RepeatTest from './RepeatTest'
import StopTest from './StopTest'
import DeleteTest from './DeleteTest'
import GenerateReport from './GenerateReport'
import {getPolicyDetails} from 'helpers/policies'
import {getAppliedPolicies} from 'helpers/dashboard'
import getAssetGroupsList from 'helpers/assetGroups'
import {getReportsMainList,getReportsExists,getReportsCount,getReportTags,getReportFilter} from 'helpers/reports'
import Joi from 'joi-browser'
import {SpinnyLogo} from 'containers'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import AutoSearch from '../Infrastructure/autoSearch'
import Select from 'react-select'

const ReportsInitialState = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>You currently have no report available</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>Would you like to start a new assessment?</td></tr>
          <tr><td style={{textAlign: 'center'}}>
            <Button href={'#/cloud/-1'} bsStyle='primary' bsSize='large' className={btnPrimary} style={{borderRadius: 0, marginTop: 20,marginBottom: 20,width:'300px'}}>
                Discover and Assess
            </Button>
          </td></tr>
        </tbody>
      </table>
    )
  }
})

function findIndex(arr, propName, propValue) {
  let inx = -1;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      inx = i;
  return inx
}

function findElement(arr, propName, propValue) {
  let report = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      report = arr[i];
  return report
}


const ShowReport = React.createClass({
  
  render: function () {
     let selectedPolicyPack={};
    let testName = this.props.report.testName
    let aType = this.props.report.assetType
    if(testName === null || testName === "null")
      testName = '-';

    let testStatus = this.props.report.status

    let detailLink = '#reportdetail/'+this.props.report.worklogid

    if(this.props.filter.policypacks!=null){
       //++++++++++ Filters for policypack is applied ++++++++++++
      let appliedPolicypack = this.props.filter.policypacks
      let stringifiedPolicyPack = appliedPolicypack.toString();
      selectedPolicyPack = findElement(this.props.policyPacks,"path",stringifiedPolicyPack.substring(1,stringifiedPolicyPack.length-1));
    }
    else{
      //+++++++++ No filters appiled +++++++++
      let firstPolicyPackName = this.props.report.policygroups[0];
      if(firstPolicyPackName != null && aType != null){
        selectedPolicyPack = findElement(this.props.policyPacks,"path",firstPolicyPackName);
      }
    }

    if(aType=== "IMAGE")
      detailLink = '#dockerReportdetail/'+this.props.report.worklogid+'?policypackname='+selectedPolicyPack.path+'&assettype='+aType+'&reportAtype='+aType
    else if(selectedPolicyPack["assettype"] && selectedPolicyPack["assettype"].toUpperCase() === "ONPREM")
      detailLink = '#reportdetail/'+this.props.report.worklogid+'?policypackname='+selectedPolicyPack.path+'&assettype='+aType+'&reportAtype='+aType
    else if(selectedPolicyPack["assettype"] && selectedPolicyPack["assettype"].toUpperCase() === "AWS")
      detailLink = '#cloudReportdetail/'+this.props.report.worklogid+'?policypackname='+selectedPolicyPack.path+'&assettype='+aType+'&reportAtype='+aType                

   
    return (
      <a href={detailLink} target='_blank' title='Report'>Show Report</a>
    )
  }
})

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
          selectedReport = findElement(this.props.list,"id",this.props.selectedList[0]);
          selectedReports.push(selectedReport);
          if(selectedReport){
            if(selectedReport.status === 'COMPLETED' || selectedReport.status === 'ABORTED'){
              repeatTestSeparator =  ' | '
            }else{
              if(selectedReport.assetType !== 'IMAGE')
                stopSeperator =  ' | '
            }
          }
        }else if(selectedCount > 1){
            this.props.selectedList.map((id) => {
              selectedReports.push(findElement(this.props.list,"id",id));
            })
        }
      
        return (selectedCount > 0 )
        ? <p style={{paddingLeft: 5, fontSize: 15}}>
            {selectedCount} Reports selected: {' '}
            {(selectedCount === 1 &&selectedReport && selectedReport.status === 'COMPLETED') ? <GenerateReport report={selectedReport} selectedPolicyPack={this.props.selectedPolicyPack}/> : <noscript />}{repeatTestSeparator}
            {(selectedCount === 1 && selectedReport && (selectedReport.status === 'COMPLETED' || selectedReport.status === 'ABORTED')) ? <RepeatTest report={selectedReport} reloadList={this.props.reloadList} showAlert={this.props.showAlert}/> : <noscript />}{repeatTestSeparator}
            {(selectedCount === 1 && selectedReport && (selectedReport.status === 'COMPLETED')) ? <span><ShowReport report={selectedReport} filter={this.props.filter} policyPacks={this.props.policyPacks}/>{repeatTestSeparator}</span> : <noscript />}
            {/*}
            <a href="javaScript:void(0)">Archive</a> {separator}
            <a href="javaScript:void(0)">Share</a> {separator}
            */}
            <DeleteTest selectedReports={selectedReports} removeReport={this.props.removeReport}/>{stopSeperator}
            {(selectedCount === 1 && selectedReport && selectedReport.status !== 'COMPLETED' && selectedReport.status !== 'ABORTED' && selectedReport.assetType !== 'IMAGE') ? <StopTest report={selectedReport} /> : <noscript />}
        </p>
      :
      <p style={{paddingLeft: 5, fontSize: 15}}>{count} Reports</p>
    
  }
})

const GroupsAndPolicyPackSelection = React.createClass({
  getInitialState(){
    return{
      policyPacks: [],
      groups: [],
      groupsReactSelect: [],
    }
  },
  componentDidMount(){
    this.setState({policyPacks: this.props.policyPacks});
    let groupArrayVal = {label:'',value:''}, groupArray=[]
    getAssetGroupsList()
    .then(
     (groups) =>  {
        this.setState({groups:groups},function(){
          if(groups != null && groups.length > 0)
          {
            groupArrayVal = {label:'All Groups',value:'', title:''}
            groupArray.push(groupArrayVal)          
          }          
          this.state.groups.map((val,key)=>{
            groupArrayVal = {label:'',value:'', title:''}
            groupArrayVal.label= val.name
            groupArrayVal.value = val.name
            groupArrayVal.title= val.name
            groupArray.push(groupArrayVal)          
          })
          this.setState({groupsReactSelect:groupArray})
        })
      })
    .catch((error) => console.log("Error in getAssetGroupsList in container:" + error))

  },

  componentWillReceiveProps(nextProps){
    if(nextProps.policyPacks!==this.props.policyPacks){
       this.setState({policyPacks: nextProps.policyPacks});
    }
  },
  render: function () {
    return (
      <div style={{display:'flex', justifyContent:'flex-end', paddingRight:7}}>
        <span style={{marginRight:'10px'}}>
        <Select className="dropdownFilter" placeholder={'All Policy Packs'}
          name=""
          value={this.props.selectedPolicyPack}
          options={this.props.policyPacksReactSelect}
          searchable={true}
          multi={false}
          clearable={false}
          allowCreate={false}
          onChange={this.props.handlePolicyPackChange}/>
        </span>
       
        <span style={{zIndex: 100}}>
        <Select className="dropdownFilter" placeholder={'All Groups'}
          name=""
          value={this.props.selectedGroup}
          options={this.state.groupsReactSelect}
          searchable={true}
          multi={false}
          clearable={false}
          allowCreate={false}
          onChange={this.props.handleGroupChange}/>
        </span>
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
    //let toValueDate = new Date(this.state.valueTo).toDateString();

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
              <DatePicker dateFormat="MM/DD/YYYY" value={this.state.valueFrom} onBlur={this.fromDateChanged} onChange={this.handleChangeFrom}/>
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

            <FormGroup  controlId="formToDate" className="datePick" validationState={this.state.valueTo_validation}>
              <ControlLabel style={{fontSize:'14px',fontWeight:'500'}}>To</ControlLabel>
              {' '}
              <DatePicker dateFormat="MM/DD/YYYY"  value={this.state.valueTo} onBlur={this.toDateChanged} onChange={this.handleChangeTo}/>
            </FormGroup>

            </OverlayTrigger>
          </Form>
        </div>
        <div  className="col-lg-7">
         <GroupsAndPolicyPackSelection
            handlePolicyPackChange={this.props.policyPackChange}
            handleGroupChange={this.props.groupChange} 
            selectedGroup = {this.props.selectedGroup} 
            policyPacks={this.props.policyPacks} 
            selectedPolicyPack={this.props.selectedPolicyPack}
            policyPacksReactSelect={this.props.policyPacksReactSelect}/>
        </div>
      </div>
    )
  }
})

const AllReports = React.createClass({
  getInitialState(){
    return{
      loading:true,
      reportsExist:true,
      reportsCount:'',
      policyPacks:[],
      policyPacksReactSelect:[],
      list:[],
      selectedList: [],
      selectAll:false,
      selectedPolicyPack:'',
      selectedGroup:'',
      fromDate:'',
      toDate:'',
      filterList:{},
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

    let policyArrayVal = {label:'',value:''}, policyArray=[]

    getAppliedPolicies('false')
   .then((rootPolicies) => {
      this.setState({policyPacks: rootPolicies},function(){
        if(rootPolicies != null && rootPolicies.length > 0)
        {
          policyArrayVal = {label:'All Policy Packs',value:'', title:''}
          policyArray.push(policyArrayVal)          
        }
        this.state.policyPacks.map((val,key)=>{
            policyArrayVal = {label:'',value:''}
            policyArrayVal.label= val.title
            policyArrayVal.title = val.title,
            policyArrayVal.value = "["+val.path+"]";
            policyArray.push(policyArrayVal) 
            
        })
        this.setState({policyPacksReactSelect:policyArray})
      });
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
    //remove default filter temporarily
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
    this.context.router.replace(navPath);

  },
  showAllDockerReports(){
    let navPath='/report/alldockerreports';
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
  policyPackChange(ppVal){
    this.setState({selectedPolicyPack: ppVal},function(){
      this.constructFilter();
    });
  },
  groupChange(grpVal){
    this.setState({selectedGroup: grpVal},function(){
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
 applyFilter() {
    getReportsMainList(50,50,this.state.filterList)
    .then((reports) =>  {
        this.setState({list:[] },function(){
          this.setState({list:reports.assessments,
            loading:false,
          reportsCount:reports.filterCount,
          selectedList:[]});
    })
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
       getReportsMainList(0,0,this.state.filterList)
       .then((reports) =>  {
        let selectList = [];
        reports.assessments.map((r) => {
          selectList.push(r.id)
        })
        this.setState({list:reports.assessments,reportsCount:reports.filterCount,selectedList:selectList});
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
    getReportsMainList(start,end,filter)
    .then((resultsList) =>  {
       if(JSON.stringify(this.state.list)==JSON.stringify(resultsList.assessments))
       {
        let newList = resultsList.assessments;
       
       }
       else
       {
        let newList = this.state.list.concat(resultsList.assessments);
       }
       this.updateList(newList);
    })
    .catch((resultListError) => console.log("Error in getReportsMainList:" + resultListError))
  },  
  
  refreshDetails(key,workLogStr){
    let index =findIndex(this.state.list,"id",key);
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
      if (this.state.list[i]["id"] == reportId)
        reportInx = i;
    let newList = this.state.list.slice();
    if(reportInx > -1){
      newList.splice(reportInx,1);
      this.setState({list:[]},function(){ 
        this.setState({list:newList})
      });
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
  searchNow: function(key, value, deleted) {
   
        var filter = this.state.filter
        var filterJson = {}
        var filterArray_testName = []
        var filterArray_endtime = []
        var filterArray_status = []
        var filterArray_score = []
        var filterArray_groups = []
        var filterArray_policygroups = []
       
        
       
        var filterString = '';
        var filterStr = '';
        var valueArray = [];
        var scanTimeStart = '';
        var scanTimeEnd = '';
        valueArray.push(value)
        if (key && value){
           key.map((elem) =>
              {
                var vals = elem.value.split(":")
                var key = vals[1];
                var val = vals[2]?vals[2]:null;

                if(key=='testname')
                {
                  
                  filterArray_testName.push(val)
                  
                }
                if(key=='endtime')
                {
                  filterArray_endtime.push(val)
                  
                }
                if(key=='status')
                {
                  filterArray_status.push(val)
                  
                }
                if(key=='score')
                {
                  filterArray_score.push(val)
                  
                }
                if(key=='groups')
                {
                  filterArray_groups.push(val)
                  
                }
                if(key=='policygroups')
                {
                  filterArray_policygroups.push(val)
                  
                }
                if(key=='LASTSCAN')
                {
                  scanTimeStart = elem.scanTimeStart
                  scanTimeEnd = elem.scanTimeEnd
                  
                }
              })
           
          if(scanTimeStart!='' && scanTimeEnd!='')
          {
            filterJson = {"reportname":filterArray_testName,"teststatus":filterArray_status,"score":filterArray_score,"groups":filterArray_groups,"policypacks":filterArray_policygroups,"startdate":scanTimeStart,"enddate":scanTimeEnd}
          }
          else
          {
            filterJson = {"reportname":filterArray_testName,"teststatus":filterArray_status,"score":filterArray_score,"groups":filterArray_groups,"policypacks":filterArray_policygroups}
          }
             getReportFilter(50, 50, filterJson).then((newElements)=>{
               let selectList = [];
             if (newElements.assessments) {
              newElements.assessments.map((elem) =>
              {
                selectList.push(elem.id)
              })
             }
             
               this.setState({
                   filter:filterJson,
                   list: newElements.assessments,
                   loading:false,
                   reportsCount:newElements.assessments.length,
                   selectedList: selectList,
                
               }, (res) => {
                 console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
             });
        } else {
          filter = {};
             getAssetGroupsTableListFilter(0, 5000, filter).then((newElements)=>{ 
               this.setState({
                   filter:filterJson,
                   list: newElements.assessments,
                   loading:false,
                   reportsCount:newElements.assessments.length,
                   selectedList: selectList,
                
               }, (res) => {
               })
             });
        }
  },
  deleteNow(key, deletedValue, deleted){
   // alert(key.length)
      var filter = this.state.filter
      var filterJson = {}
      var filterArray_testName = []
      var filterArray_endtime = []
      var filterArray_status = []
      var filterArray_score = []
      var filterArray_groups = []
      var filterArray_policygroups = []
     
      
     
      var filterString = '';
      var filterStr = '';
      // var valueArray = []
      // valueArray.push(value)
      if (key.length>0 && deletedValue){
         key.map((elem) =>
            {
              var vals = elem.value.split(":")
              var key = vals[1];
              var val = vals[2]?vals[2]:null;

              if(key=='testname')
              {
                
                filterArray_testName.push(val)
                
              }
              if(key=='endtime')
              {
                filterArray_endtime.push(val)
                
              }
              if(key=='status')
              {
                filterArray_status.push(val)
                
              }
              if(key=='score')
              {
                filterArray_score.push(val)
                
              }
              if(key=='groups')
              {
                filterArray_groups.push(val)
                
              }
              if(key=='policygroups')
              {
                filterArray_policygroups.push(val)
                
              }
             
              console.log("kys"+vals[1])
            })
         

        filterJson = {"reportname":filterArray_testName,"teststatus":filterArray_status,"score":filterArray_score,"groups":filterArray_groups,"policypacks":filterArray_policygroups}
           getReportFilter(50, 50, filterJson).then((newElements)=>{
             let selectList = [];
           if (newElements.assessments) {
            newElements.assessments.map((elem) =>
            {
              selectList.push(elem.id)
            })
           }
           
             this.setState({
                 filter:filterJson,
                 list: newElements.assessments,
                 loading:false,
                 reportsCount:newElements.assessments.length,
                 selectedList: selectList,
              
             }, (res) => {
               console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
           });
      } else {
        
        filter = {};
        
           getReportFilter(50, 50, filter).then((newElements)=>{
            
             this.setState({
                 filter:filter,
                 list: newElements.assessments,
                 loading:false,
                 reportsCount:newElements.assessments.length,
                 selectedList: [] ,
              
             }, (res) => {
               })
           });
      }
  },
  render() {
    return (
      <div>
        {this.state.reportsExist?
          <div>
          {this.state.loading?
            <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
              <SpinnyLogo />
            </div> 
            :
            <div>
              <div style={{marginLeft:'60px',marginRight:'60px'}}>
                {/*<FormGroup controlId="search" className="search">
                  <InputGroup style={{marginRight:"60px", marginTop:"30px"}}>
                    <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                    <FormControl type="text" placeholder="Search for reports, policy packs, control families, controls or groups"  />
                  </InputGroup>
                </FormGroup>*/}
                <div style={{marginTop:'30px'}}>
                 <ReportSelector
                   fromDate={this.state.fromDate}
                   toDate={this.state.toDate}
                   fromDateChange={this.fromDateChange}
                   toDateChange={this.toDateChange}
                   policyPackChange={this.policyPackChange}
                   groupChange={this.groupChange}
                   selectedGroup = {this.state.selectedGroup}
                   policyPacks={this.state.policyPacks}
                   selectedPolicyPack={this.state.selectedPolicyPack}
                   policyPacksReactSelect={this.state.policyPacksReactSelect}/> 

                  <div style={{margin:'0px',height:'27x'}}>&nbsp;</div>
                  <div style={{position:'relative'}}>
                    <div style={{width:'50%', float:'left'}}>
                      <ActionButtons
                        reportCount={this.state.reportsCount}
                        selectedList={this.state.selectedList}
                        list={this.state.list}
                        reloadList={this.reloadList}
                        showAlert={this.showAlert}
                        removeReport={this.removeReport}
                        selectedPolicyPack={this.state.selectedPolicyPack}
                        filter={this.state.filterList}
                        policyPacks={this.state.policyPacks}/>
                    </div>
                      {/*<div id="tabs" style={{minWidth:222, width:'50%', position:'absolute',top:-5, right:58, zIndex:999, display:'flex',justifyContent:'flex-end',}}>
                            <Tabs >
                              <TabList>
                                <Tab><div onClick={this.showAllReports} >Group Report Page</div></Tab>
                                <Tab><div onClick={this.showAllDockerReports} >Image Report page</div></Tab>
                              </TabList>
                            </Tabs>
                      </div>*/}
                  </div>
                  {/*}
                  <AutoSearch style={{width:"1000px"}}
                    searchNow={this.searchNow}
                    deleteNow={this.deleteNow}
                    getDataTags={getReportTags}
                  />*/}
                 
                  <Report
                    selectHandler={this.onClickHandler}
                    reportsList={this.state.list}
                    selectedList={this.state.selectedList}
                    selectAllHandler={this.selectAllHandler}
                    refreshDetails={this.refreshDetails}
                    getDataList={this.getDataOnScroll}
                    updateList={this.updateList}
                    filter={this.state.filterList}
                    policyPacks={this.state.policyPacks}
                    />
                </div>
              </div>
            </div>
            }
          </div> : <div><ReportsInitialState/></div>
      }
      </div>
      )
  },
})

export default AllReports

