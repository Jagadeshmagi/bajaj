import React, {PropTypes} from 'react'
import {MetaItem,StackedHorizontalBarChart, ReportHeader, ReportTitle, CircularScoreGraph, GraphLegendsForHorizontal} from './ReportCommon'
import {Row, Col , Glyphicon,OverlayTrigger,Popover,ProgressBar,FormGroup,InputGroup,FormControl} from 'react-bootstrap'
import {Table,Column, Cell} from 'fixed-data-table'
import { RemediationCell,DevicePolicyNameCell, RecipeCell, ReportStateCell} from 'components/Table/Table'
import ScrollableDataTable from "containers/DataTable/ScrollableDataTable"
import {mytable, selectStyle} from 'sharedStyles/styles.css'
import {getResourceById,getDeviceDetailHeaderRecord, getDevicePolicyResultsList, getControlFamiliesOnPolicyPack, getDeviceResultsByControlFamily, getState, getSeverity} from 'helpers/reports'
import {ResourceColumnChooserClass} from 'containers/Infrastructure/ResourceColumnChooserCell'
import {RuleDetails} from 'containers/PolicyPacksList/RuleDetails'
import AttributeConstants from 'constants/AttributeConstants'
import moment from 'moment'
import {SpinnyLogo} from 'containers'
import { connect } from 'react-redux'
import Select from 'react-select'
import {findElement} from 'javascripts/util.js'

ReportMeta.propTypes = {
  headerInfo: PropTypes.array.isRequired,
}

function ReportMeta (props) {

  let generatedTime = props.headerInfo.generated
  let completedTime = props.headerInfo.completed
  let profiles = ''

  if(generatedTime == null || generatedTime == "null" || generatedTime =='' || generatedTime === undefined)
    generatedTime='-'
  else
    generatedTime = moment.utc(generatedTime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm [UTC]');

  //+++++++ Converting completedTime to system locale time
  if(completedTime == null || completedTime == "null" || completedTime =='' || completedTime === undefined)
    completedTime='-'
  else
    completedTime = moment.utc(completedTime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm [UTC]');

  //++++ Analyst ++++
  let rptAnalyst = props.analyst
  if (props.analyst === null || props.analyst === '' || props.analyst === undefined || props.analyst === 'undefined')
    rptAnalyst='-'

  // +++++ Profiles and deviceType +++++++++
  if (props.headerInfo.profiles && props.headerInfo.profiles !== null && props.headerInfo.profiles!== 'null' && props.headerInfo.profiles.length > 0) {
    profiles = props.headerInfo.profiles.join(',')
  }

  if (props.headerInfo.devicetype && props.headerInfo.devicetype != null){
      profiles = profiles === '' ? props.headerInfo.devicetype: (profiles +", "+props.headerInfo.devicetype)
  }

  return (
    <table style={{marginTop:10}}>
      <tbody>
        <MetaItem title='Policy Pack' desc = {props.policyPack}/>
        <MetaItem title='Assessment started '   desc= {generatedTime}  />
        <MetaItem title='Assessment completed '   desc= {completedTime}  />
        <MetaItem title='Analyst '   desc= {rptAnalyst}  />
        {((props.headerInfo.profiles && props.headerInfo.profiles.length > 0) || (props.headerInfo.devicetype && props.headerInfo.devicetype != null))?<MetaItem title='Profiles' desc = {profiles}/>:''}
        <tr style={{height:'15px'}}></tr>
        <tr style={{fontSize:24,marginLeft:15,color:'#454855', fontWeight:'600'}}> Resource Summary</tr>
        <tr style={{height:'15px'}}></tr>
        <MetaItem title='Host/Instance ID '   desc= {props.headerInfo.hostname}  />
        <MetaItem title='IP address '   desc= {props.headerInfo.privateip}  />
        <MetaItem title='OS '   desc= {props.headerInfo.osName} />
      </tbody>
    </table>
  )
}

const DevicePolicyGroupTableTest = React.createClass({
  getInitialState(){
    return{
      score:0,
      columnChooserShow:false,
      columnsList:[
        {name:'policies', displayHeaderText:'POLICY NAME',displayText:'Policy Name',show:true, columnName: "POLICY NAME", width:"130"},
        {name:'severity', displayHeaderText:'SEVERITY',displayText:'Severity', show:true, columnName: "SEVERITY", width:"130"},
        {name:'state', displayHeaderText:'STATE',displayText:'State', show:true, columnName: "STATE", width:"130"},
        {name:'weights', displayHeaderText:'WEIGHT',displayText:'Weight', show:true, columnName: "WEIGHT", width:"130"},
        {name:'controlId', displayHeaderText:'CONTROL FAMILY',displayText:'Control Family',show:true, columnName: "CONTROL FAMILY", width:"130"},
        {name:'fixsugesion', displayHeaderText:'REMEDIATION STEPS',displayText:'Remediation Steps', show:false, columnName: "REMEDIATION STEPS", width:"130"},

      ],
    }
  },

  columnDisplayChangeHandler(colName){
    let newColumnsList = [];
    this.state.columnsList.forEach(function(col){
      if(col.name === colName){
        newColumnsList.push({...col,show:!col.show});
      }else{
        newColumnsList.push(col);
      }
    })
    this.setState({columnsList:newColumnsList})
  },


  columnChooserToggle() {
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
  },

  getTableColumn: function(colName){

      //let refreshDetailsProp = this.props.refreshDetails;
      let colObj = findElement(this.state.columnsList,"name",colName);

      if(colObj != null && colObj["show"]){

        switch(colName){
          case 'policies' :
          return <Column
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={2}
              cell={<DevicePolicyNameCell col="policies" data={this.props.list} />}
              width={360} />

          case 'severity' :
          return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={1}
              align="center"
              cell={({rowIndex, ...props}) => {
              let severityObj = this.props.list[rowIndex]['severity']

                return(
                <Cell {...props}>
                  {AttributeConstants.SEVERITY[severityObj]}
                </Cell>
              )}}
              width={100} />

          case 'state' :
          return  <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              align='center'
              cell={<ReportStateCell col="state" data={this.props.list} />}
              width={70} />

          case 'weights' :
          return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              align="center"
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {this.props.list[rowIndex]["weights"]}
                </Cell>
              )}
              width={50} />

          case 'controlId' :
          return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {
                let cId = this.props.list[rowIndex]["controlId"]
                if(cId == "null"||cId == null){
                  cId = '-'
                }
               return( <Cell {...props}>
                  {cId}
                </Cell>
              )}}
              width={100} />

          case 'fixsugesion' :
          return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}

               cell={<RemediationCell col="fixsugesion" data={this.props.list} />}
              width={200} />

          default :
            return {}
        }
     }
  },
  render(){
    return (
      <ScrollableDataTable
        large = "yes"
        columnsList={this.state.columnsList}
        getTableColumn={this.getTableColumn}
        checkboxColumn={<Column
              header={<Cell></Cell>}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {}
                </Cell>
              )}
              width={0} />}
        attributeChooserColumn ={<Column
          align="center"
          header={<Cell><ResourceColumnChooserClass
              remediation={true}
              toggle={this.columnChooserToggle}
              columnShow={this.state.columnChooserShow}
              container={this.refs.resourcesTable}
              columnsList={this.state.columnsList}
              changeHandler={this.columnDisplayChangeHandler}/>
          </Cell>}
          cell={<RecipeCell reportType={'deviceCompliance'} 
                            refresh={this.props.refresh}
                            col="fixsugesion"
                            pp={this.props.pp} 
                            os={this.props.os} 
                            col={'policies'}
                            worklogId={this.props.worklogId}
                            flagCol={'flag'}
                            policyResultIdCol={'policyresultid'}
                            deviceName={this.props.deviceName}
                            data={this.props.list} />}
          width={250} />}
        list={this.props.list}
        getDataList={this.props.getDataList}
        updateList={this.props.updateList}
        filter={this.props.filter}
      />


    )}
})


const DeviceDetail = React.createClass({

  getInitialState(){
    return{
      resourceId: '',
      loadingDiv: true,
      list: [],
      totalResultsCount: 0,
      headerInfo: [],
      policyPacks: [],
      controlFamilies: [],
      stateList: [],
      severityList: [],
      stateReactSelect: [],
      severityReactSelect: [],
      controlFamilyReactSelect: [],
      selectedState:'',
      selectedControlFamily:'',
      selectedPolicyPack:'',
      selectedSeverity:'',
      resource:{},
      filters:{},
      horizontalChartData:{}
    }
  },
  componentWillMount(){

    let worklogId = this.props.routeParams.worklogId
    let resourceId = this.props.routeParams.resourceId
    let policyPack = this.props.location.query.policypack
    let reportAssetType = this.props.location.query.reportAtype;

    // ++++++++++++++ Seeting policypack and applying filter to Get Table (List) Data++++++++++++++++++++
    this.setState({selectedPolicyPack:policyPack.substring(5)}/*,function(){
          this.selectPolicyPack()
    }*/)

     // ++++++++++++++ Getting Header Information ++++++++++++++++++++
    getDeviceDetailHeaderRecord(worklogId, resourceId, policyPack, reportAssetType)
    .then((DeviceDetailHeaderRecord)=>{
      if(DeviceDetailHeaderRecord.policies !== null && DeviceDetailHeaderRecord.policies.length>0)
      {
        let firstPolicyPack = policyPack.substring(5)
        getDeviceResultsByControlFamily(worklogId, resourceId, firstPolicyPack)
        .then((data) => {
          this.setState({horizontalChartData:data},function(){
            this.selectPolicyPack()
          })
        })
        .catch((error) => console.log("Error in getting controlfamily results: "+error))
      }
      this.setState({
        headerInfo: DeviceDetailHeaderRecord,
        policyPacks: DeviceDetailHeaderRecord.policies})
      })
    .catch((DeviceDetailHeaderRecordError)=>console.log("Error in fetching viewData "+DeviceDetailHeaderRecordError))

  },

  refresh(){
    /*
     *Used for refreshing 
     *a) Score
     *b) table
     *c) horizontal bar chart
     */

    let worklogId = this.props.routeParams.worklogId
    let resourceId = this.props.routeParams.resourceId
    let policyPack = this.props.location.query.policypack
    let reportAssetType = this.props.location.query.reportAtype;

    getDeviceDetailHeaderRecord(worklogId, resourceId, policyPack, reportAssetType)
    .then((DeviceDetailHeaderRecord)=>{
      if(DeviceDetailHeaderRecord.policies !== null && DeviceDetailHeaderRecord.policies.length>0)
      {
        let firstPolicyPack = policyPack.substring(5)
        getDeviceResultsByControlFamily(worklogId, resourceId, firstPolicyPack)
        .then((data) => {
          this.setState({horizontalChartData:data},function(){
            this.selectPolicyPack()
          })
        })
        .catch((error) => console.log("Error in getting controlfamily results: "+error))
      }
      this.setState({
        headerInfo: DeviceDetailHeaderRecord,
        policyPacks: DeviceDetailHeaderRecord.policies})
      })
    .catch((DeviceDetailHeaderRecordError)=>console.log("Error in fetching viewData "+DeviceDetailHeaderRecordError))
  },

  getDataOnScroll(start,end,filter){
    let worklogId = this.props.routeParams.worklogId
    let resourceId = this.props.routeParams.resourceId
    getDevicePolicyResultsList(worklogId, resourceId,filter,start,end)
    .then((response) =>  {
       let newList = this.state.list.concat(response.devicedetails);
       this.updateList(newList);
    })
    .catch((resultListError) => console.log("Error in fetchReportsList:" + JSON.stringify(resultListError)))
  },
  
  updateList(newList){
    this.setState({list:newList});
  },

  selectPolicyPack(){
    this.constructFilter();
    // ++++++++++++ Populate ControlFamily for selected policyPacks ++++++++++++++++++
    let controlFamiliesList = this.state.horizontalChartData.controlFamily
    let controlFamilyArrayVal = {label: '', value: '', title:''}, controlfamilyArray = [];
    this.setState({controlFamilies: this.state.horizontalChartData.controlFamily},function(){
        if(controlFamiliesList != null && controlFamiliesList.length > 0)
        {
          controlFamilyArrayVal = {label:'All Control Families',value:'', title:''}
          controlfamilyArray.push(controlFamilyArrayVal)
        }
         this.state.controlFamilies.map((val, key ) => {
          controlFamilyArrayVal = {label: '', value: '', title: ''}
          controlFamilyArrayVal.label= val
          controlFamilyArrayVal.value = val
          controlFamilyArrayVal.title = val
          controlfamilyArray.push(controlFamilyArrayVal)
        })
        this.setState({controlFamilyReactSelect:controlfamilyArray})
      })
    var params = "?worklogid="+this.props.routeParams.worklogId+"&assettype=ONPREM"+"&policypack="+this.state.selectedPolicyPack+"&resid"+this.props.routeParams.resourceId
    // ++++++++++ Get state for table filter ++++++++++++++++++++
    let stateArrayVal = {label:'',value:''}, stateArray = [];
    getState(params)
    .then((stateList) => {
      this.setState({stateList: stateList.state}, function(){
        if(stateList != null && stateList.state != null && stateList.state.length > 0){
          stateArrayVal = {label:'Select State',value:'', title:''}
            stateArray.push(stateArrayVal)
        }
        this.state.stateList.map((val, key ) => {
          stateArrayVal = {label:'', value:'', title: ''}
          stateArrayVal.label= AttributeConstants.STATE[val]
          stateArrayVal.value = val
          stateArray.push(stateArrayVal)
        })
        this.setState({stateReactSelect:stateArray})
      })
    })
    .catch((fetchStateError) => console.log("error in fetching states "+fetchStateError))

    // ++++++++ Get severity for table filter ++++++++++++
    let severityArrayVal = {label:'', value:'', title: ''}, severityArray = [];
    getSeverity(params)
    .then((severityList) => {
      this.setState({severityList: severityList.sevearity},function(){
        if(severityList !=null && severityList.sevearity !=null && severityList.sevearity.length > 0){
          severityArrayVal = {label:'Select Severity',value:'', title:''}
          severityArray.push(severityArrayVal)
        }
        this.state.severityList.map((val, key) => {
          severityArrayVal = {label:'', value:''}
          severityArrayVal.label = AttributeConstants.SEVERITY[val]
          severityArrayVal.value = val
          severityArrayVal.title = AttributeConstants.SEVERITY[val]
          severityArray.push(severityArrayVal)
        })
        this.setState({severityReactSelect: severityArray})
      })
    })
    .catch((fetchSeverityError) => console.log('error in fetching severity'+ fetchSeverityError))
  },

   stateChange(stateVal){
    this.setState({selectedState: stateVal},function(){
      this.constructFilter();
    }.bind(this));
  },

  severityChange(severityVal){
    this.setState({selectedSeverity:severityVal},function(){
      this.constructFilter();
    }.bind(this));
  },

  controlFamilyChange(controlFamilyVal){
    this.setState({selectedControlFamily:controlFamilyVal},function(){
      this.constructFilter();
    }.bind(this))
  },

  constructFilter(){
    let filters = {};

    if(this.state.selectedPolicyPack != null && this.state.selectedPolicyPack !== ''){
      filters["policypacks"] = this.state.selectedPolicyPack.split(',');
    }
    if(this.state.selectedState != null && this.state.selectedState !== ''){
      filters["state"]= this.state.selectedState.split(',');
    }
    if(this.state.selectedSeverity != null && this.state.selectedSeverity !== ''){
      filters["severity"]= this.state.selectedSeverity.split(',');
    }
    if(this.state.selectedControlFamily != null && this.state.selectedControlFamily !== ''){
      filters["controlid"]= this.state.selectedControlFamily.split(',');
    }

    this.setState({filters:filters},function(){
      this.applyFilter()
    });
  },

  applyFilter(){
    this.setState({loadingDiv:true})
    let worklogId = this.props.routeParams.worklogId
    let resourceId = this.props.routeParams.resourceId
    getDevicePolicyResultsList(worklogId, resourceId, this.state.filters,50,50)
    .then((response) =>  {
        this.setState({loadingDiv:false,
                      list:response.devicedetails,
                      totalResultsCount:response.filterCount});
    })
    .catch((error) => console.log("Error in getDevicePolicyResultsList in container:" + error))
  },
  render(){
    let resourceCount = 0;
    if(this.state.list != null){
      resourceCount = this.state.list.length;
    }
    document.title ='device'

    let style = {
      fontSize: 24,
      color: '#454855',
      fontWeight: 'bold'
    }
    let controlFamilyDropdownStyle = { height:40,fontSize: 15,color:'#4C58A4', marginLeft: 8,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:25, width:'185px'}
    let selectStyle2 = {  height:40,fontSize: '15px',  marginTop: 10,marginLeft: 10,color:'#4C58A4'}
    let selectStyle1 = { border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4', paddingTop:0, paddingBottom:0, paddingLeft:10, paddingRight:0, width:'175px',lineHeight:'2.3em'}
    let state = ''
    let score=''
    let colorState=''

      score = this.state.headerInfo.score;
      if(score != null){
        if(score > 80){
          state = "GOOD";
          colorState = "#00C484"
        }
        else if(score > 50 && score <= 80){
          state = "WARNING";
          colorState = "#F9C73D"
        }
        else if(score <= 50){
          state = "ALERT";
          colorState = "#FF444D"
        }else{
          state = '-';
          colorState = "#4C58A4";
        }
      }

    let reportScore = 0
    if(this.state.headerInfo && this.state.headerInfo.score && this.state.headerInfo.score!=null && this.state.headerInfo.score!='null')
      reportScore = this.state.headerInfo.score
    else if(this.state.headerInfo.score === null)
      reportScore = 'N/A'
    return (
     <div>
     <div style={{minHeight:800}}>
      <ReportHeader name='Resource Compliance Report' />
        <div style={{backgroundColor: '#F9FAFC',marginLeft:20,marginRight:20}}>
        <div style={{paddingLeft:35}}>
          <ReportTitle  title={"Report Details"}
                      resourceId={this.props.routeParams.resourceId}
                      worklogId={this.props.routeParams.worklogId}
                      selectedPolicyPack={this.state.selectedPolicyPack}
                      assetType={"ONPREM"}/>
        </div>
        <div style={{paddingLeft:20}}>
            <Col xs={9}>
              <ReportMeta headerInfo={this.state.headerInfo}
                          analyst={this.props.location.query.analyst}
                          policyPack={this.props.location.query.reportName}
                          />
            </Col>
            <Col xs={3}>
                <div style={{ backgroundColor: 'White', width: 220,marginTop:10, paddingTop: 5,marginLeft:5}}>
                    <div style={{minHeight:160}}>
                      <CircularScoreGraph score={reportScore}/>
                    </div>
                    <table style={{borderTop: 5, borderTopColor: '#E8EFF9',borderTopStyle: 'Solid',width: 220}}>
                      <tr>
                        <th style={{width: 110,textAlign:'center',borderRight: 5, borderRightColor: '#E8EFF9',borderRightStyle: 'Solid'}}>STATE</th>
                        <th style= {{width: 110,textAlign:'center',color:colorState}}>{state}</th>
                      </tr>
                    </table>
                </div>
            </Col>
        </div>

        <div className='col-lg-12 col-xs-12 col-md-12 col-sm-12' style={{width: '100%', marginLeft:18, paddingRight:56}}>
          <div className='col-lg-12 col-xs-12 col-md-12 col-sm-12' style={{backgroundColor: '#FFFFFF',marginTop: 20}}>
                  <div style={{fontSize: 20, fontWeight: 'bold',paddingTop:10, color: '#454855',lineHeight:2}} >
                      ISSUES COUNT PER CONTROL FAMILY
                  </div>

                  <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12" style={{height:'200px'}}>
                        <StackedHorizontalBarChart
                        canvasWidth={'700'}
                        idProp={"newTest"} horizontalChartData={this.state.horizontalChartData}/>
                  </div>

                  <div className=" col-lg-5 col-xs-5 col-md-5 col-sm-5"> </div>
                  <div className="col-lg-7 col-xs-7 col-md-7 col-sm-7" style={{paddingLeft:60,marginTop:40,marginBottom:20,lineHeight:2}}>
                  <GraphLegendsForHorizontal />
                  </div>
          </div>
        </div>
        </div>
        </div>
        <div style={{minHeight:200,position:'relative'}}>
           {this.state.loadingDiv?
            <div style={{width:'100%'}}>
              <SpinnyLogo />
            </div>
        :<div id="bottomContent">
          <div className='col-lg-12 col-xs-12 col-md-12 col-sm-12' style={{padding:'10px 46px 5px 55px', height: '60px'}}>
              <div className='col-lg-4 col-xs-4 col-md-4 col-sm-4' style={{paddingLeft:'0px',fontSize:20,color: '#454855'}}>
                 <strong> {this.state.totalResultsCount} Policies</strong>
              </div>
              <div className='col-lg-8 col-xs-8 col-md-8 col-sm-8'>
                  <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <span style={{marginRight: '10px'}}>
                      <Select className="dropdownFilter" placeholder={'Select State'}
                        name=""
                        value={this.state.selectedState}
                        options={this.state.stateReactSelect}
                        searchable={true}
                        multi={false}
                        clearable={false}
                        allowCreate={false}
                        onChange={this.stateChange}/>
                    </span>
                    <span style={{marginRight: '10px'}}>
                     <Select className="dropdownFilter" placeholder={'Select Severity'}
                        name=""
                        value={this.state.selectedSeverity}
                        options={this.state.severityReactSelect}
                        searchable={true}
                        multi={false}
                        clearable={false}
                        allowCreate={false}
                        onChange={this.severityChange}/>
                    </span>
                    <span style={{zIndex: 100}}>
                     <Select className="dropdownFilter" placeholder={'All Control Families'}
                        name=""
                        value={this.state.selectedControlFamily}
                        options={this.state.controlFamilyReactSelect}
                        searchable={true}
                        multi={false}
                        clearable={false}
                        allowCreate={false}
                        onChange={this.controlFamilyChange}/>
                    </span>
                  </div>
              </div>
          </div>
          <div className='col-lg-12 col-xs-12 col-md-12 col-sm-12' style={{marginLeft:'-20px'}}>
            <DevicePolicyGroupTableTest
              os={this.state.headerInfo.osName}
              worklogId={this.props.routeParams.worklogId}
              pp={this.state.selectedPolicyPack}
              deviceName={this.state.headerInfo.hostname}
              list={this.state.list}
              updateList={this.updateList}
              filter={this.state.filters}
              getDataList={this.getDataOnScroll}
              refresh={this.refresh}/>
          </div>
        </div>}
      </div>
      </div>
    )
  }
})
export default connect(
 ({users}) => ({loginName: users.login}),
)(DeviceDetail)
