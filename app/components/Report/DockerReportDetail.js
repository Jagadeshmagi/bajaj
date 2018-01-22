import React from 'react'
import {Navbar, Col, Button, Row, FormGroup, Glyphicon, InputGroup, FormControl,Popover,OverlayTrigger} from 'react-bootstrap';
import {blueBtn , btnPrimary, mytable, selectStyle} from 'sharedStyles/styles.css'
import {BarChart, PieChart, tickFormat} from 'react-d3-components'
import {input, legend, low, medium, high, passed} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import ScrollableDataTable from "containers/DataTable/ScrollableDataTable"
import {MetaItem, ReportHeader, ReportTitle, CircularScoreGraph, GraphLegends} from './ReportCommon'
import {getAssetType,getcloudDataStatistics,getWorkLogViewRecord, getDashboardStatistics, getCloudPolicyResultsListWithFilter, getTragettedPolicypacks, getState, getSeverity} from 'helpers/reports'
import {getAssetGroup, getAssetFilter, getAsset} from 'helpers/assetGroups'
import {getPolicyDetails} from 'helpers/policies'
import getAssetGroupsList from 'helpers/assetGroups'
import {IndividualdockerScanResults,getDockerDataStatistics,getControlFamiliesOnPolicyPackForDocker} from 'helpers/docker'
import {getScoreWithScanId,getWorkLogViewRecordForDocker} from 'helpers/docker'
import {getDiscoveryWorklog} from 'helpers/context'
import {ResourceColumnChooserClass} from 'containers/Infrastructure/ResourceColumnChooserCell'
import {RuleDetails} from 'containers/PolicyPacksList/RuleDetails'
import AttributeConstants from 'constants/AttributeConstants'
import {AccessCell,ArrayLinkCell,ScoreCell, ScoreCell2, ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, TooltipDataCell, CollapsedRowsCell, PolicyNameCell, RemediationCell, PolicyPacksCell, RecipeCell} from 'components/Table/Table'
import moment from 'moment'
import {SpinnyLogo} from 'containers'
import { connect } from 'react-redux'
import {findElement} from 'javascripts/util.js'
import Select from 'react-select'

function ReportMeta (props) {
  let dockerType=props.dockerType
  if(props.dockerType === null)
    dockerType='Public'

  let generatedTime=props.reportGeneratedEndTime
  let completedTime=props.assessmentCompleted

  //+++++++ Converting generatedTime to system locale time
  if(generatedTime == null || generatedTime === "null"||generatedTime==='' || generatedTime === undefined)
    generatedTime='-'
  else
    generatedTime = moment.utc(generatedTime, "YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm [UTC]');

  //+++++++ Converting completedTime to system locale time
  if(completedTime == null || completedTime == "null"||completedTime==='' || completedTime === undefined)
    completedTime='-'
  else
    completedTime = moment.utc(completedTime, "YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm [UTC]');

  let rptAnalyst=props.analyst
  if(props.analyst == null || props.analyst == '')
    rptAnalyst='-'

  return (
    <table style={{marginTop:20}}>
      <tbody>
        <MetaItem title='Test name'   desc={props.reportName}  />
        <MetaItem title='Assessment started' desc={generatedTime}/>
        <MetaItem title='Assessment completed'   desc= {completedTime}/>
        <MetaItem title='Analyst'   desc= {rptAnalyst}/>

      </tbody>
    </table>
  )
}

const PolicyPackSelection = React.createClass({

  getInitialState(){
    return{
      policyPacks:[],
      groups:[]
    }
  },

   componentWillReceiveProps(nextProps,nextState){
    if(nextProps.policyList != this.props.policyList)
    this.setState({policyPacks:nextProps.policyList})
  },

  render: function () {
    let selectStyle1 = { border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4',paddingTop:0, paddingBottom:0, paddingLeft:10, paddingRight:0, width:'175px',lineHeight:'2.3em'}
    return (
      <div>
          <Select className="dropdownFilter"
          value={this.props.policypackname}
          options={this.props.policyPackReactSelect}
          searchable={false}
          multi={false}
          clearable={false}
          allowCreate={false}
          onChange={this.props.policyPackChange}/>
      </div>
    )}
})


const ComplianceBarChart = React.createClass({
  getInitialState(){
    return {
      select: "day",
      barChartWidth:''
    }
  },
  dynamicChartWidth(){
      let zoomTime = this.props.currentZoom;
      let dataCount = this.props.statisticsData.combinedData.data[0].values.length + 1;

      if(zoomTime === 'day'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data})}
      else if(zoomTime === 'week'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data})}
      else if(zoomTime === 'month'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data})
      }else if(zoomTime === 'quarter'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data})
      }else if(zoomTime === 'year'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data})
      }

   },
    componentWillReceiveProps(){
      setTimeout(this.dynamicChartWidth,1000);
    },
  selectChangeHandler(event){
    this.setState({
      select:event.target.value
    })
  },
  tooltipBar(x, y0, y, total) {
    return y;
  },
    render: function () {
      let dataLength = 0;
      let dataFlag = false;
      let graphMsg = '';
      if(this.props.statisticsData.combinedData && (this.props.statisticsData.combinedData.dataByDate.length>0))
        {
          dataLength = this.props.statisticsData.combinedData.dataByDate.length;
          let dataByDate = this.props.statisticsData.combinedData.dataByDate;
          dataByDate.map((result)=>{
            let values = result.values;
            if(values[0]>0 || values[1]>0 || values[2]>0){
              dataFlag=true;
              return true;
            }
          })
        }
      if(dataFlag)
        graphMsg = 'No data available for the selected policypack.'
      else
       graphMsg = 'No failed policies for the selection.'

      const scale = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484']);
      let selectStyle1 = { border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4', marginLeft: 8,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:0, width:'165px',lineHeight:'2.3em'}
     // let selectStyle = {  fontSize: 12, margin: 4, marginRight: 10, backgroundColor:'#FFFFFF', color: '#4C58A4', borderColor: '#4C58A4'}
      let myTestData
      let trendData
      let scanTrend
      let scanValue,trendGlyph,trendColor
      if(this.props.statisticsData.combinedData){
        myTestData = this.props.statisticsData.combinedData.data
        trendData =  this.props.statisticsData.combinedData.dataByDate
        if(trendData != null && trendData.length>0){
          scanTrend=trendData[trendData.length-1]
          if(scanTrend.values !=null && scanTrend.values.length >0)
          {
            scanValue=scanTrend.values[scanTrend.values.length-1]
            if(scanValue==0){
              trendGlyph=''
            }
            else if(scanValue>0){
              trendGlyph='plus';
              trendColor='green';
            }else{
              trendGlyph='minus';
              trendColor='red';
            }
          }
        }
      }

      let state = ''
      let barChartWidthVar=this.state.barChartWidth
      let score = this.props.assessmentScore;
      let stateClassName = ''
      if(score !== null){
        if(score > 80){
          state = "GOOD";
          stateClassName = {color:'#00C484'}
        }
        else if(score > 50 && score <= 80){
          state = "WARNING";
          stateClassName = {color:'#F9C73D'};
        }
        else if(score <= 50){
          state = "ALERT";
          stateClassName = {color:"#FF444D"}
        }
      }else if(score === null){
        state = "-";
        stateClassName = {color:'#4C58A4'}
        score = "N/A"
      }

      setTimeout(function (){
        var vis = d3.selectAll('.tick line')
        var yis = d3.selectAll('.domain')
        yis.attr("stroke","#f9fafc")
        vis.each(function(d,i) {
          let findYAxis = d3.select(this).attr("x2")
          if(findYAxis!=0){
            d3.select(this).attr("x2","200%").attr("stroke",'#d5deec')
          }
        });
      }, 500);

      return (
        <div style={{marginTop: 40, height:430}}>
            <Col xs={8} style={{backgroundColor: '#F9FAFC',paddingLeft:0}}>
             {(dataLength>0 && dataFlag)?
              <div>
              <p style={{fontSize:18 , fontWeight: 'bold', marginBottom:10}} >SCORE OVERVIEW</p>
               Zoom:
              <select value={this.props.currentZoom} className={selectStyle} style={selectStyle1} onChange={this.props.selectChangeHandler}>
                <option value='day'>Day</option>
                <option value='week'>Week</option>
                <option value='month'>Month</option>
                <option value='quarter'>Quarter</option>
                <option value='year'>Year</option>
              </select>
              <div style={{minWidth:850, overflow:'auto',marginBottom:15}}>
                <BarChart
                      groupedBars
                      colorScale={scale}
                      data={myTestData}
                      width={barChartWidthVar}
                      height={290}
                      yAxis={{tickArguments: [5]}}
                      yAxis={{tickFormat:d3.format("d")}}
                      tooltipHtml={this.tooltipBar}
                      margin={{top: 25, bottom: 50, left: 30, right: 50}}/>
                </div>
                <GraphLegends />
                </div>
                :<div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{marginTop:'100px',textAlign:'center'}}>{graphMsg}</div>}

            </Col>
            <Col xs={1}></Col>
            <Col xs={2}>

              <div style={{ backgroundColor: 'White', width: 220, paddingTop: 5}}>
                  <CircularScoreGraph score={score}/>
                  <div style={{color: trendColor, marginLeft: 40, paddingLeft:35}}>
                    <Glyphicon style={{color:trendColor, fontSize: 8}} glyph={trendGlyph}/> {scanValue}%
                  </div>
                  <div style={{marginLeft: 40, paddingLeft:10}}>since last scan</div>
                  <table style={{borderTop: 5, borderTopColor: '#E8EFF9',borderTopStyle: 'Solid',width: 220}}>
                    <tr>
                      <th style={{borderRight: 5, borderRightColor: '#E8EFF9',borderRightStyle: 'Solid'}}>STATE</th>
                      <th style= {stateClassName}>{state}</th>
                    </tr>
                  </table>
              </div>

            </Col>

        </div>
    )
  }
})



const DockerReportDetail = React.createClass({

  getInitialState(){
    return{
      assetGroupId:'',
      policyPacks:[],
      policyPackReactSelect: [],
      totalPoliciesCount:0,
      groups:[],
      list:[],
      controlFamilies: [],
      controlFamilyReactSelect: [],
      stateList: [],
      severityList: [],
      stateReactSelect: [],
      severityReactSelect: [],
      asset:{},
      statisticsData:[],
      score:0,
      analyst:'',
      reportName:'',
      dockerType:'',
      reportGeneratedEndTime:'',
      assessmentCompleted:'',
      columnChooserShow:false,
      columnsList:[
        {name:'policyName',displayText:'Policy Name',displayHeaderText:'POLICY NAME',show:true,columnName: "POLICY NAME", width:"130"},
        {name:'severity',displayText:'Severity',displayHeaderText:'SEVERITY',show:true,columnName: "SEVERITY", width:"130"},
        {name:'state',displayText:'State',displayHeaderText:'STATE',show:true,columnName: "STATE", width:"130"},
        {name:'remidiation',displayText:'Remediation  Steps',displayHeaderText:'REMEDIATION STEPS',show:true,columnName: "REMEDIATION STEPS", width:"130"},
        {name:'weights',displayText:'Weight',displayHeaderText:'WEIGHT',show:false,columnName: "WEIGHT", width:"130"},
        {name:'guildeline',displayText:'Policy Pack',displayHeaderText:'POLICY PACK',show:false,columnName: "POLICY PACK", width:"130"},
        {name:'controlId',displayText:'Control Family',displayHeaderText:'CONTROL FAMILY',show:false,columnName: "CONTROL FAMILY", width:"130"},
      ],
      select: "day",
      selectedPolicyPack: '',
      selectedState: '',
      selectedSeverity: '',
      selectedGroup: '',
      selectedControlFamily: '',
      filters: {},
      loadingDiv: true
    }
  },
   contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  componentWillMount(){
    let worklogId = this.props.routeParams.worklogId
    let asssettype=this.props.location.query.assettype;
    let policyPack = this.props.location.query.policypackname;
    let reportAssetType = this.props.location.query.reportAtype;

    //+++++++++++++ Setting selected policypacks ++++++++++++++++++
    this.setState({selectedPolicyPack:policyPack.substring(5,policyPack.length)},function(){
        this.selectPolicyPack()
      })
   //++++++++++++++ Fetch list of targetted policypacks ++++++++++++
    let policypackArrayVal = {label:'',value:'', title:''}, policyArray = [];
    getTragettedPolicypacks(worklogId, reportAssetType)
    .then((result) => {
      this.setState({analyst:result.analyst,
                    policyPacks: result.ppinfo}, function(){

        this.state.policyPacks.map((val, key ) => {
          policypackArrayVal = {label:'', value:'', title:''}
          policypackArrayVal.label= val.pptitle
          policypackArrayVal.value = val.ppname.substring(5, val.length)
          policypackArrayVal.title = val.pptitle
          policyArray.push(policypackArrayVal)
        })
        this.setState({policyPackReactSelect:policyArray})
      })
    })
    .catch((fetchPolicyPackError) => console.log("error in fetching policypacks "+fetchPolicyPackError))

     /*IndividualdockerScanResults(worklogId,{},50,50)
      .then(
            (resultsList) =>  {
              console.log("SCANRESULTFORDOCKER"+JSON.stringify(resultsList))
              this.setState({list:resultsList.scanDetails,totalPoliciesCount:resultsList.filterCount
                            },function(){
                              console.log("DOCKER  LIST**"+this.state.list)
                            })
            })
        .catch((resultListError) => console.log("Error in fetchReportsList:"+ JSON.stringify(resultListError)))*/


         getWorkLogViewRecord(worklogId,asssettype,policyPack)
          .then((resultViewData)=>{

            this.setState({reportGeneratedEndTime:resultViewData.generated,
                            assessmentCompleted:resultViewData.completed,
                            reportName:resultViewData.reportname,
                            dockerType:resultViewData.cloudtype,
                            assetGroupId:resultViewData.assetgroupid,
                           })
             })
          .catch((resultViewDataError)=>console.log("Error in fetching viewData "+resultViewDataError))

            let firstPolicyPack="";
            if(policyPack!=null && policyPack!=""){
             firstPolicyPack=policyPack.substring(5,policyPack.length);

            //+++++++++++++ Setting firstPolicyPack +++++++++++++++++++++++

              getScoreWithScanId(worklogId,firstPolicyPack)
              .then((resultScoreObj)=>{
                if(resultScoreObj){
                let resultScore = resultScoreObj.score;
                this.setState({score:resultScore})
              }
              })
              .catch((resultScoreError)=>console.log("error is getScoreWithScanId "+resultScoreError))

              getDockerDataStatistics(worklogId,'day',firstPolicyPack)
              .then((complianceData)=>{
                this.setState({statisticsData:complianceData})
              })
              .catch((complianceDataError)=>console.log("error in fetching complianceData "+complianceDataError))
           }



       /* getDockerDataStatistics(worklogId,'day')
          .then((complianceData)=>{
            this.setState({statisticsData:complianceData})
          })
          .catch((complianceDataError)=>console.log("error in fetching complianceData "+complianceDataError))
*/
      //+++++++++++++ Getting headerInformation +++++++++++++++++++++++


  },
  componentWillReceiveProps(nextProps){
    //++++Updating score when route params changes +++++++++++
    if(nextProps.location.query.policypackname != this.props.location.query.policypackname){

     getScoreWithScanId(this.props.routeParams.worklogId,nextProps.location.query.policypackname)
      .then((resultScoreObj)=>{
        if(resultScoreObj){
        let resultScore = resultScoreObj.score;
        this.setState({score:resultScore})
      }
      })
      .catch((resultScoreError)=>console.log("error is getScoreWithScanId "+resultScoreError))


    }
  },
   policyPackChange(ppVal){
      let pp="root.";
      let concatPolicy = pp.concat(ppVal);
      let concatPP = ppVal
      let worklogID = this.props.routeParams.worklogId
      let asssettype = this.props.location.query.assettype;
      let navPath='dockerReportdetail/'+this.props.routeParams.worklogId+'?policypackname='+concatPP+'&assettype=IMAGE'+'&reportAtype='+this.props.location.query.reportAtype

      this.context.router.replace(navPath);
      this.setState({selectedPolicyPack:ppVal},function(){
        this.selectPolicyPack()
        this.setState({select:'day',
                        selectedState:'',
                        selectedSeverity:'',
                        selectedGroup:'',
                        selectedControlFamily:'',},function(){


        getDockerDataStatistics(worklogID,this.state.select,concatPP)
        .then((complianceData)=>{
            this.setState({statisticsData:complianceData})
        })
        .catch((complianceDataError)=>console.log("error in fetching complianceData "+complianceDataError))
        });

        getWorkLogViewRecord(worklogID,asssettype,concatPolicy)
          .then((resultViewData)=>{

            this.setState({reportGeneratedEndTime:resultViewData.generated,
                            assessmentCompleted:resultViewData.completed,
                            reportName:resultViewData.reportname,
                            dockerType:resultViewData.cloudtype,
                            assetGroupId:resultViewData.assetgroupid,
                           })
             })
          .catch((resultViewDataError)=>console.log("Error in fetching viewData "+resultViewDataError))




      }.bind(this));

  },


   selectPolicyPack(){
    this.constructFilter();
    // ++++++++++++ Populate ControlFamily for selected policyPacks ++++++++++++++++++
   /* getControlFamiliesOnPolicyPackForDocker(this.props.routeParams.worklogId, this.state.selectedPolicyPack)
    .then((controlFamiliesList)=>{
      this.setState({controlFamilies:controlFamiliesList.controlfamily},function(){
      })
    })
    .catch((controlFamilyError)=>console.log("error in fetching control families "+controlFamilyError))*/
    let controlFamilyArrayVal = {label: '', value: '', title:''}, controlfamilyArray = [];
    getControlFamiliesOnPolicyPackForDocker(this.props.routeParams.worklogId, this.state.selectedPolicyPack)
    .then((controlFamiliesList) => {
      this.setState({controlFamilies: controlFamiliesList.controlfamily}, function(){
      if(controlFamiliesList != null && controlFamiliesList.controlfamily !=null && controlFamiliesList.controlfamily.length > 0){
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
    })
    .catch((controlFamilyError) => console.log("error in fetching control families "+controlFamilyError))

    // ++++++++++++ Parms for state and severity +++++++++++++
    var params = "?worklogid="+this.props.routeParams.worklogId+"&assettype="+this.props.location.query.reportAtype+"&policypack="+this.state.selectedPolicyPack;
    // +++++++++++++++++++++++++++++++++++++++++++++++

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
          stateArrayVal = {label:'', value:''}
          stateArrayVal.label= AttributeConstants.STATE[val]
          stateArrayVal.value = val
          stateArray.push(stateArrayVal)
        })
        this.setState({stateReactSelect:stateArray})
      })
    })
    .catch((fetchStateError) => console.log("error in fetching states "+fetchStateError))

    // ++++++++ Get severity for table filter ++++++++++++
    let severityArrayVal = {label:'', value:'', title:''}, severityArray = [];
    getSeverity(params)
    .then((severityList) => {
      this.setState({severityList: severityList.sevearity}, function(){
        if (severityList !=null && severityList.sevearity !=null && severityList.sevearity.length>0){
          severityArrayVal = {label:'Select Severity',value:'', title:''}
          severityArray.push(severityArrayVal)
        }
        this.state.severityList.map((val, key) => {
          severityArrayVal = {label:'', value:'',title:''}
          severityArrayVal.label = AttributeConstants.SEVERITY[val]
          severityArrayVal.value = val
          severityArrayVal.title = AttributeConstants.SEVERITY[val]
          severityArray.push(severityArrayVal)
        })
        this.setState({severityReactSelect:severityArray})
      })
    })
    .catch((fetchSeverityError) => console.log('error in fetching severity'+ fetchSeverityError))
  },

  stateChange(stateVal){
    this.setState({selectedState:stateVal},function(){
      this.constructFilter();
    }.bind(this));  },


  severityChange(severityValue){
    this.setState({selectedSeverity:severityValue},function(){
      this.constructFilter();
    }.bind(this));
  },

  controlFamilyChange(ctrlFamilyValue){
    this.setState({selectedControlFamily:ctrlFamilyValue},function(){
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
    if(this.state.selectedGroup != null && this.state.selectedGroup !== ''){
      filters["groups"]= this.state.selectedGroup.split(',');
    }
    if(this.state.selectedControlFamily != null && this.state.selectedControlFamily !== ''){
      filters["controlid"]= this.state.selectedControlFamily.split(',');
    }

    this.setState({filters:filters},function(){
      this.applyFilter()
    });
  },
  applyFilter(){
    let worklogId = this.props.routeParams.worklogId

    this.setState({loadingDiv:true})
    IndividualdockerScanResults(worklogId,this.state.filters,50,50)
      .then(
            (resultsList) =>  {
              this.setState({list:resultsList.scanDetails,
                totalPoliciesCount:resultsList.filterCount,
                loadingDiv:false
              })
            })
        .catch((resultListError) => {this.setState({loadingDiv:false})
          console.log("Error in fetchReportsList:" + resultListError)})

  },

  columnChooserToggle() {
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
  },

   getDataOnScroll(start,end,filter){
    let worklogId = this.props.routeParams.worklogId

    IndividualdockerScanResults(worklogId,filter,start,end)
      .then(
            (resultsList) =>  {
              let newList = this.state.list.concat(resultsList.scanDetails);
              this.updateList(newList);
            })
        .catch((resultListError) => console.log("Error in fetchReportsList:" + resultListError))


  },

  updateList(newList){
    this.setState({list:newList});
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

  selectChangeHandler(event){
    let imageId = this.props.routeParams.worklogId
    this.setState({
      select:event.target.value
    }, (props)=>{
      if(imageId!= null && imageId != "null"){
        getDockerDataStatistics(imageId, this.state.select,this.state.selectedPolicyPack)
        .then((complianceData)=>{
          this.setState({statisticsData:complianceData})
        })
        .catch((complianceDataError)=>console.log("error in fetching complianceData "+complianceDataError))
      }
    })
  },


  getTableColumn: function(colName){

      //let refreshDetailsProp = this.props.refreshDetails;
      let colObj = findElement(this.state.columnsList,"name",colName);

      if(colObj != null && colObj["show"]){

        switch(colName){

          case 'policyName' :
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              cell={<PolicyNameCell col="title" data={this.state.list} docker={"docker"}/>}
              width={230} />

          case 'severity' :
          return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              align="center"
              cell={({rowIndex, ...props}) => {
              let severityObj = this.state.list[rowIndex]['severity']
              if(severityObj === "null"|| severityObj=== null || severityObj === undefined){
                 return(
                <Cell {...props}>
                  -
                </Cell>
               )
              }else{
                return(
                <Cell {...props}>
                  {AttributeConstants.SEVERITY[severityObj.replace(/ /g,"_").toUpperCase()]}
                </Cell>
              )
              }
              }}
              width={100} />

          case 'state' :
          return  <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              align="center"
              cell={({rowIndex, ...props}) => {
                let colrAttr=""
                let stateObj=this.state.list[rowIndex]['state'];
                if (stateObj === 'Pass')colrAttr = 'green'
                else if (stateObj === 'Fail')colrAttr ='red'
                else if (stateObj === 'Not_Applicable'){
                  colrAttr = '#F6A623'
                }
                return(
                <Cell {...props}>
                 <span style={{color:colrAttr}}>{AttributeConstants.STATE[stateObj]}</span>
                </Cell>
              )}}

              width={100} />

          case 'remidiation' :
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {
              let fixsuggestion="";
               let threedotsfixsuggestion="...";
               let overlaysizefixsuggestion=0;
               let fixsugessionValue = this.state.list[rowIndex]["fixsuggestion"]
               if(fixsugessionValue.length >0 && fixsugessionValue.length >20){
                  fixsuggestion= fixsugessionValue.substring(0,50);
                  threedotsfixsuggestion="...";
                  overlaysizefixsuggestion=(fixsugessionValue.length-200)
                }
                else{
                  fixsuggestion= fixsugessionValue;
                  threedotsfixsuggestion="";
                }
                const tooltipfixsuggestion = (
                  <Popover  style={{maxWidth:'100%',width:'600px',wordWrap: "break-word"}}>
                    <div dangerouslySetInnerHTML={{__html:fixsugessionValue}} style={{height:overlaysizefixsuggestion>300?300:overlaysizefixsuggestion, overflow:'auto'}}></div>
                  </Popover>
                );

                return(
                <Cell {...props}>
                 <div dangerouslySetInnerHTML={{__html: fixsuggestion}} style={{display:'inline'}}></div>
                    <OverlayTrigger ref="toolname" trigger="click" rootClose placement="bottom"  overlay={tooltipfixsuggestion}>
                      <span style={{display:'inline', cursor: 'pointer'}}> {threedotsfixsuggestion}  </span>
                    </OverlayTrigger>
                </Cell>
              )}}
              width={350} />

          case 'weights' :
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              align="center"
              cell={({rowIndex, ...props}) => {
                return(
               <Cell {...props}>
                  {this.state.list[rowIndex]["weight"]}
                </Cell>
              )}}
              width={60} />

          case 'guildeline':
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={5}
              align='center'
              cell = {({rowIndex, ...props}) => {
                  return(
                    <Cell>
                      <PolicyPacksCell width={150} policyname={this.state.list[rowIndex]['pptitle']} col="policygroups"/>
                    </Cell>
                  )

              }}
              width={150} />

          case 'controlId':
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {this.state.list[rowIndex]["controlid"]}
                </Cell>
              )}
              width={110} />
          default :
            return {}
        }
     }
   },

  render(){

    let policyNameStyle = findElement(this.state.columnsList,"name","policyName")["show"] ? {display:'table-cell',width:'20%', 'text-align':'center'}:{display:'none',width:'20%', 'text-align':'center'}
    let severityStyle = findElement(this.state.columnsList,"name","severity")["show"] ? {display:'table-cell',width:'2%'}:{display:'none',width:'2%'}
    let stateStyle = findElement(this.state.columnsList,"name","state",)["show"] ? {display:'table-cell',width:'2%'}:{display:'none',width:'2%'}
    let remidiationStyle = findElement(this.state.columnsList,"name","remidiation")["show"] ? {display:'table-cell',width:'35%', 'text-align':'center'}:{display:'none',width:'35%', 'text-align':'center'}
    let weightStyle = findElement(this.state.columnsList,"name","weights")["show"] ? {display:'table-cell',width:'1%'}:{display:'none',width:'1%'}
    let guildelineStyle = findElement(this.state.columnsList,"name","guildeline")["show"] ? {display:'table-cell',width:'10%'}:{display:'none',width:'10%'}
    let controlIdStyle = findElement(this.state.columnsList,"name","controlId")["show"] ? {display:'table-cell',width:'7%'}:{display:'none',width:'7%'}
    let selectStyle1 = { border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4', marginLeft: 8,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:0, width:'165px',lineHeight:'2.3em'}
    let controlFamilyDropdownStyle = {border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4', marginLeft: 8,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:25, width:'185px',lineHeight:'2.3em'}

    return (
      <div>
        <ReportHeader name='Docker Assessment Report'/>
        <div style={{backgroundColor: '#F9FAFC', marginLeft: 60, marginRight:60}}>
           <ReportTitle  title={this.state.reportName}
                        worklogId={this.props.routeParams.worklogId}
                        selectedPolicyPack={this.state.selectedPolicyPack}
                        resourceId={-1}
                        assetType={this.props.location.query.assettype}/>
            <PolicyPackSelection
              policyPackChange = {this.policyPackChange}
              policypackname = {this.state.selectedPolicyPack}
              policyList = {this.state.policyPacks}
              policyPackReactSelect = {this.state.policyPackReactSelect}/>
          <ReportMeta dockerType={this.state.dockerType}
                      reportGeneratedEndTime={this.state.reportGeneratedEndTime}
                      assessmentCompleted={this.state.assessmentCompleted}
                      reportName={this.state.reportName}
                      analyst={this.state.analyst}
                      worklogId={this.props.routeParams.worklogId}/>
          <ComplianceBarChart
            assessmentScore={this.state.score}
            statisticsData={this.state.statisticsData}
            selectChangeHandler={this.selectChangeHandler}
            currentZoom={this.state.select}
            />

          <div style={{minHeight:200,position:'relative'}}>
           {this.state.loadingDiv?
            <div style={{width:'100%'}}>
              <SpinnyLogo />
            </div>
            :
          <div>
            <div style={{height:70}}>
              <Col xs={4} style={{paddingTop:20,paddingLeft:0}}>
                <p style={{fontSize: 20, fontWeight: 'bold'}}>
                 {this.state.totalPoliciesCount} Policies
                </p>
              </Col>
              <Col xs={8}  style={{paddingTop:20,paddingRight:0,float:'right'}}>
                 <div style={{display:'flex', justifyContent:'flex-end'}}>
                      <span style={{marginRight: '10px'}}>
                 <Select className="dropdownFilter" placeholder={'Select State'}
                        name='state'
                        value={this.state.selectedState}
                        options={this.state.stateReactSelect}
                        searchable={true}
                        multi={false}
                        clearable={false}
                        allowCreate={false}
                        onChange={this.stateChange}/>
                  </span>
                  <span style={{marginRight:'10px'}}>

                <Select className="dropdownFilter" placeholder={'Select Severity'}
                            name="severityLevel"
                            value={this.state.selectedSeverity}
                            options={this.state.severityReactSelect}
                            searchable={true}
                            multi={false}
                            clearable={false}
                            allowCreate={false}
                            onChange={this.severityChange}/>
                </span>
               <span style = {{zIndex: 100}}>
                        <Select className="dropdownFilter" placeholder={'All Control Families'}
                            name='cFamily'
                            value={this.state.selectedControlFamily}
                            options={this.state.controlFamilyReactSelect}
                            searchable={true}
                            multi={false}
                            clearable={false}
                            allowCreate={false}
                            onChange={this.controlFamilyChange}/>
                      </span>
                      </div>
              </Col>
              </div>
          <div id="policies" style={{marginLeft:'-60px',marginBottom:'20px'}}>
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
                cell={<RecipeCell reportType={'docker'} col="fixsuggestion" pp={this.state.selectedPolicyPack} os={this.props.os} col="title" data={this.state.list} />}
                width={250} />}
              list={this.state.list}
              getDataList={this.getDataOnScroll}
              updateList={this.state.updateList}
              filter={this.state.filters}
            />
          </div>
          </div>
           }
        </div>
        </div>
      </div>
  )}
})

export default connect(
 ({users}) => ({loginName: users.login}),
)(DockerReportDetail)
