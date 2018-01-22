import React, {PropTypes} from 'react'
import {Navbar, Col, Button, Row ,InputGroup,FormGroup,Glyphicon,FormControl,Popover,OverlayTrigger} from 'react-bootstrap';
import { blueBtn , btnPrimary, mytable, selectStyle} from 'sharedStyles/styles.css'
import { BarChart, PieChart } from 'react-d3-components'
import {input, public_fixedDataTable_main} from './styles.css'
import {MetaItem, ReportHeader,StackedHorizontalBarChart,ReportTitle,CircularScoreGraph, GraphLegends,GraphLegendsForHorizontal} from './ReportCommon'
import {getResultsList} from 'helpers/reports'
import {getAssetGroup} from 'helpers/assetGroups'
import {getDiscoveredOS} from 'helpers/dashboard'
import {getScoreWithWorklogId,getGroupResultsByControlFamily} from 'helpers/reports'
import {getOnPremPolicyResultsList,getWorkLogViewRecord,
        getcloudDataStatistics,getAssetType,getTragettedPolicypacks} from 'helpers/reports'
import {getDiscoveryWorklog} from 'helpers/context'
import {ResourceColumnChooserClass} from 'containers/Infrastructure/ResourceColumnChooserCell'
import ScrollableDataTable from "containers/DataTable/ScrollableDataTable"
import {Table,Column, Cell} from 'fixed-data-table'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange} from 'containers/Infrastructure/styles.css'
import moment from 'moment'
import {SpinnyLogo} from 'containers'
import { connect } from 'react-redux'
import AttributeConstants from 'constants/AttributeConstants'
import ReactTooltip from 'react-tooltip'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import {findElement} from 'javascripts/util.js'

ReportMeta.propTypes = {
  cloudType: PropTypes.string.isRequired,
  reportGeneratedEndTime: PropTypes.string.isRequired,
  assessmentCompleted: PropTypes.string.isRequired,
  analyst: PropTypes.string,
  profiles: PropTypes.array,
}

function ReportMeta (props) {
  let profiles = ''
  let cloudType=props.cloudType
  if(props.cloudType === null)
    cloudType='AWS'
  if(props.cloudType != null  && props.cloudType === "aws")
    cloudType = 'AWS'
  if(props.cloudType != null && props.cloudType === "azure")
    cloudType = 'Azure'
  if(props.cloudType != null && props.cloudType === "ONPREM")
    cloudType = 'On-Prem'

  let generatedTime=props.reportGeneratedEndTime
  let completedTime=props.assessmentCompleted

  if(generatedTime == null || generatedTime === "null" || generatedTime =='' || generatedTime === undefined)
    generatedTime='-'
  else
    generatedTime = moment.utc(generatedTime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm [UTC]');

  //+++++++ Converting completedTime to system locale time
  if(completedTime === null || completedTime === 'null' || completedTime === '' || completedTime === undefined)
    completedTime = '-'
  else
    completedTime = moment.utc(completedTime,'YYYY/MM/DD @ HH:mm TZD').format('MM[/]DD[/]YYYY [@] HH[:]mm [UTC]');

  let rptAnalyst = props.analyst
  if (props.analyst === null || props.analyst === '')
    rptAnalyst = '-'

  if (props.profiles && props.profiles !== null && props.profiles!== 'null' && props.profiles.length>0) {
    profiles = props.profiles.join(',')
  }
  return (
    <table style={{marginTop:20}}>
      <tbody>
        <MetaItem title='Type'   desc={cloudType}  />
        <MetaItem title='Assessment started' desc={generatedTime}/>
        <MetaItem title='Assessment completed'   desc= {completedTime}/>
        <MetaItem title='Analyst'   desc= {rptAnalyst}/>
        {(props.profiles && props.profiles.length > 0)?<MetaItem title='Profiles' desc = {profiles}/>:''}
      </tbody>
    </table>
  )
}


const PolicyPackSelection = React.createClass({
  propTypes: {
    policyList: PropTypes.array.isRequired,
    policyPackChange: PropTypes.func.isRequired,
    selectedPolicyPack: PropTypes.string.isRequired,
    policyPackReactSelect: PropTypes.array.isRequired,
  },
  getInitialState(){
    return{
      policyPacks:[]
    }
  },

   componentWillReceiveProps(nextProps,nextState){
    if(nextProps.policyList != this.props.policyList)
    this.setState({policyPacks:nextProps.policyList})
  },
  render: function () {
   let selectStyle1 = { border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4', marginLeft: 8, paddingTop:0, paddingBottom:0, paddingLeft:10, paddingRight:0, width:'175px',lineHeight:'2.3em'}
    return (
       <div>
        <Select className="dropdownFilter" 
          value={this.props.selectedPolicyPack}
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
    getInitialState() {
      return {
        barChartWidth: '',
        dataLength:0
      }
    },
    dynamicChartWidth(){
      var xValuesArray = []
      let zoomTime = this.props.currentZoom;
      // console.log('HHHHHHHH', this.props.statisticsData.combinedData.data[0].values.length)
      this.props.statisticsData.combinedData.data[0].values.map((val,key)=>{
        xValuesArray.push(val.x)
      })
      var unique = xValuesArray.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      })

      let dataCount = unique.length +1;

      if(zoomTime === 'day'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data,});}
      else if(zoomTime === 'week'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data,});}
      else if(zoomTime === 'month'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data,})
      }else if(zoomTime === 'quarter'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data,})
      }else if(zoomTime === 'year'){
        this.setState({barChartWidth:dataCount*170,statisticsData:this.props.statisticsData.combinedData.data,})
      }

    },
    componentWillReceiveProps(){
      setTimeout(this.dynamicChartWidth,1000);
      //this.setState({dataLength:this.props.statisticsData.combinedData.dataByDate.length})
    },
    tooltipBar(x, y0, y, total) {
      return y;
    },
   /* componentDidMount(){
      this.setState({dataLength:this.props.statisticsData.combinedData.dataByDate.length})
    },*/
    render: function () {
      let dataLength = 0
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
      // let selectStyle = {  fontSize: 12, margin: 4, marginRight: 20, backgroundColor:'#FFFFFF', color: '#4C58A4', borderColor: '#4C58A4'}
      let selectStyle1 = { border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4', marginLeft: 8,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:0, width:'165px',lineHeight:'2.3em'}
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
              trendColor='green'
            }else{
              trendGlyph='minus';
              trendColor='red'
            }

            scanValue=String(scanValue);
            scanValue=scanValue.replace("-","")
            scanValue=parseInt(scanValue)
          }
        }
      }

      let barChartWidthVar = this.state.barChartWidth;
      let state = ''
      let score = this.props.assessmentScore;
      let stateClassName = ''
      if(score != null){
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
        state='-';
        score = 'N/A';
        stateClassName = {color:'#4C58A4'}
      }

      setTimeout(function (){
        var vis = d3.selectAll('.tick line')
        var yis = d3.selectAll('.domain')
        // console.log("THIS IS THE VIS. WHAT IS IT?????", vis)
        yis.attr("stroke","#f9fafc")
        vis.each(function(d,i) {
          let findYAxis = d3.select(this).attr("x2")
          if(findYAxis!=0){
            d3.select(this).attr("x2","200%").attr("stroke",'#d5deec')
          }
        });
      }, 1000);

      return (
        <div style={{marginLeft: 20,marginTop: 40,marginBottom:30,paddingBottom:30}}>
            <Col xs={8} style={{backgroundColor: '#F9FAFC'}}>
              <p style={{fontSize: 20, fontWeight: 'bold', marginBottom:10}} >SCORE OVERVIEW</p>
                <div style={{marginBottom:20 }}>Zoom:
                  <select style={selectStyle1} onChange={this.props.selectChangeHandler} className={selectStyle}>
                    <option value='day'>Day</option>
                    <option value='week'>Week</option>
                    <option value='month'>Month</option>
                    <option value='quarter'>Quarter</option>
                    <option value='year'>Year</option>
                  </select>
                </div>

              {(dataLength>0)?
                <div>
              <div style={{minWidth:830, overflow:'auto',marginBottom:15}}>
                <BarChart
                      groupedBars
                      colorScale={scale}
                      data={myTestData}
                      width={barChartWidthVar}
                      height={270}
                      yAxis={{tickArguments: [5]}}
                      tooltipHtml={this.tooltipBar}
                      margin={{top: 10, bottom: 50, left: 60, right: 50}}/>
              </div>
               <GraphLegends />
               </div>
              :<div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{marginTop:'100px',textAlign:'center'}}>No data available for the selected policypack</div>}

            </Col>
            <Col xs={1}></Col>
            <Col xs={2}>
               <div style={{ backgroundColor: 'White', width: 220, paddingTop: 5,marginBottom:30,marginRight:-10,marginLeft:0}}>
                  <CircularScoreGraph score={score}/>
                  <div style={{color: trendColor, marginLeft: 40, paddingLeft:35}}>
                    <Glyphicon style={{color:trendColor, fontSize: 8}} glyph={trendGlyph}/> {scanValue}%
                  </div>
                  <div style={{marginLeft: 40, paddingLeft:10}}>since last scan</div>
                  <table style={{borderTop: 5, borderTopColor: '#E8EFF9',borderTopStyle: 'Solid',width: 220}}>
                    <tr>
                      <th style={{width:110,textAlign:"center",borderRight: 5, borderRightColor: '#E8EFF9',borderRightStyle: 'Solid'}}>STATE</th>
                      <th style= {stateClassName}>{state}</th>
                    </tr>
                  </table>
              </div>
            </Col>
        </div>
    )
  }
})



function ScanResultCircle (props) {
  let textXvalue = '30%';
  let textYvalue = '60%';
  let textAnchor='';

  if(props.assessmentScore<9){
    textXvalue = '40%';
    textYvalue = '60%';
    textAnchor='start';

  }
  return (
    <svg width="200" height="200">
        <circle r="80" cx="100" cy="100" />
        <text style={{textAnchor:textAnchor}} x={textXvalue} y={textYvalue}
          fontFamily='Verdana'
          fontSize='55'
          color = '#4C58A4'
        >{props.assessmentScore}</text>
    </svg>
  )
}

const ReportDetail = React.createClass({

  getInitialState(){
    return{
      list:[],
      loadingDiv:true,
      totalCount:0,
      assetGroupId:'',
      policyPacks: [],
      policyPackReactSelect: [],
      groups: [],
      asset: {},
      statisticsData: [],
      dataByDateLength: 0,
      discoveredOS: [],
      osReactSelect: [],
      score: 0,
      analyst: '',
      reportName: '',
      cloudType: '',
      profiles: [],
      reportGeneratedEndTime: '',
      assessmentCompleted: '',
      assetGroup: {},
      filters: {},
      horizontalChartData: {},
      selectedOS: '',
      columnChooserShow: false,
      selectedPolicyPack: '',
      columnsList:[
        {name:'hostName',displayText:'NAME',show:true, columnName: "NAME", width:"130"},
        {name:'ipaddress',displayText:'IP ADDRESS',show:true, columnName: "IP ADDRESS", width:"130"},
        {name:'resourceType',displayText:'TYPE',show:true, columnName: "TYPE", width:"130"},
        {name:'osName',displayText:'OS',show:true, columnName: "OS", width:"130"},
        {name:'devicescore',displayText:'RISK SCORE',show:true, columnName: "RISK SCORE", width:"130"},
        {name:'complianceStatus',displayText:'STATUS',show:true, columnName: "STATUS", width:"130"},
        {name:'timeStamp',displayText:'ASSESSMENT TIME(UTC)',show:true, columnName: "ASSESSMENT TIME", width:"130"},
      ],
      select: 'day'
    }
  },

   contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentWillMount(){
    let worklogId = this.props.routeParams.worklogId;
    let policyPack = this.props.location.query.policypackname;
    let asssettype=this.props.location.query.assettype;
    let reportAssetType = this.props.location.query.reportAtype;
    let policypackname = policyPack.replace("root.", "");

     //+++++++++++++ Setting selected policypacks ++++++++++++++++++
    this.setState({selectedPolicyPack:policyPack.substring(5,policyPack.length)},function(){
               // this.selectPolicyPack()
    })

     // ++++++++++++++ Fetch list of targetted policypacks ++++++++++++
    let policypackArrayVal = {label:'',value:'', title:''}, policyArray = [];
    getTragettedPolicypacks(worklogId, reportAssetType)
    .then((result) => {
      this.setState({ analyst: result.analyst,
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
    .catch((fetchStateError) => console.log("error in fetching states "+fetchStateError))

    //+++++++++ Getting DiscoveredOS List for Select OS Dropdown ++++++++++++++++
    var params = "?worklogid="+worklogId+"&policypack="+policypackname;
    let oSArrayVal = {label:'',value:''}, oSArray = [];
    getDiscoveredOS(params)
    .then(
      (discoveredOS) => {
        this.setState({discoveredOS:discoveredOS.ostypes},function(){
          if(discoveredOS != null && discoveredOS.ostypes != null && discoveredOS.ostypes.length > 0){
            oSArrayVal = {label:'All OS',value:'', title:''}
            oSArray.push(oSArrayVal) 
        }
        this.state.discoveredOS.map((val, key ) => {
          oSArrayVal = {label:'', value:''}
          oSArrayVal.label = val
          oSArrayVal.value = val
          oSArrayVal.title = val
          oSArray.push(oSArrayVal)      
        })
        this.setState({osReactSelect:oSArray})
        })
      }
    )
    .catch((discoveredOSListerror)=>console.log("Error in fetching the discoveredOS in container"+discoveredOSListerror))

    let filter = this.state.filters;
    let pp =[];
    pp.push(policyPack)
    filter["policypacks"]=pp

    getOnPremPolicyResultsList(worklogId,filter,50,50)
     .then(
          (resultsList) =>  {
            this.setState({loadingDiv:false,
                          list:resultsList.device,
                          totalCount:resultsList.filterCount})
          })
     .catch((resultListError) => console.log("Error in fetchReportsList:" + resultListError))

    getScoreWithWorklogId(worklogId,policyPack)
     .then((resultScoreObj)=>{
        let resultScore = resultScoreObj.score;
        this.setState({score:resultScore})
      })
     .catch((resultScoreError)=>console.log("error is getScoreWithWorklogId "+resultScoreError))

      //+++++++++ Getting type for policypack to be displayed in Header info Type+++++++
     getAssetType(policyPack)
    .then((ppAssetType)=>{
        this.setState({cloudType:ppAssetType.assetType})
    })
    .catch((fetchAssetError)=>console.log("error in fetching ppAssetType"+fetchAssetError))

    getWorkLogViewRecord(worklogId, reportAssetType, policyPack)
     .then((resultViewData)=>{
      if(resultViewData.profiles) {
        this.setState({profiles: resultViewData.profiles})
      }
        this.setState({reportGeneratedEndTime:resultViewData.generated,
                        reportName:resultViewData.reportname,
                        assessmentCompleted:resultViewData.completed,
                        assetGroupId:resultViewData.assetgroupid,
                       })

          if(policyPack !== null){
              //+++++++++++++++ get statisticsData for graph ++++++++++++++++++++
              getcloudDataStatistics(worklogId,'day',policyPack.substring(5))
              .then((complianceData)=>{
                this.setState({statisticsData:complianceData},function(){
                  if(this.state.statisticsData.combinedData.dataByDate && this.state.statisticsData.combinedData.dataByDate.length>0){
                    this.setState({dataByDateLength:this.state.statisticsData.combinedData.dataByDate.length})
                  }
                })
              })
              .catch((complianceDataError)=>console.log("error in fetching complianceData "+complianceDataError))

              getGroupResultsByControlFamily(worklogId,resultViewData.assetgroupid,policyPack.substring(5,policyPack.length))
              .then((data) => {
                this.setState({horizontalChartData:data})
              })
              .catch((error) => console.log("Error in getting controlfamily results: "+error))
          }//

      })
      .catch((resultViewDataError)=>console.log("Error in fetching viewData "+resultViewDataError))
  },


   componentWillReceiveProps(nextProps){
    let policyPack = nextProps.location.query.policypackname;
    let worklogId  = nextProps.routeParams.worklogId;
    let asssettype = nextProps.location.query.assettype;
    let reportAssetType = nextProps.location.query.reportAtype;

    //++++Updating score when route params changes +++++++++++
    if(nextProps.location.query.policypackname != this.props.location.query.policypackname){

     // ++++++++++++++ Fetch list of targetted policypacks ++++++++++++
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
    .catch((fetchStateError) => console.log("error in fetching states "+fetchStateError))

      this.setState({selectedOS:'',loadingDiv:true})
      let filter = this.state.filters;
      let pp =[];
      pp.push(policyPack)
      filter["policypacks"]=pp

      getOnPremPolicyResultsList(worklogId,filter,50,50)
       .then(
            (resultsList) =>  {
              this.setState({loadingDiv:false,
                            list:resultsList.device,
                            totalCount:resultsList.filterCount})
            })
       .catch((resultListError) => console.log("Error in fetchReportsList:" + resultListError))

      getScoreWithWorklogId(this.props.routeParams.worklogId,nextProps.location.query.policypackname)
      .then((resultScoreObj)=>{
        let resultScore = resultScoreObj.score;
        this.setState({score:resultScore})
      })
      .catch((resultScoreError)=>console.log("error is getScoreWithWorklogId "+resultScoreError))

      //+++++++++++++ Setting firstPolicyPack +++++++++++++++++++++++
        if(policyPack !== null)
        {
          //+++++++++++++ Getting headerInformation +++++++++++++++++++++++
          let Pp = this.state.selectedPolicyPack
          let newPp = "root."+Pp
          getWorkLogViewRecord(worklogId,reportAssetType,newPp)
          .then((resultViewData)=>{
            if(resultViewData.profiles){
              this.setState({profiles: resultViewData.profiles})
            }
            this.setState({reportGeneratedEndTime:resultViewData.generated,
                            assessmentCompleted:resultViewData.completed,
                            reportName:resultViewData.reportname,
                            assetGroupId:resultViewData.assetgroupid})
          })
          .catch((resultViewDataError)=>console.log("Error in fetching viewData "+resultViewDataError))

          this.setState({selectedPolicyPack:policyPack.substring(5,policyPack.length)},function(){
            getGroupResultsByControlFamily(worklogId,resultViewData.assetgroupid,policyPack.substring(5,policyPack.length))
            .then((data) => {
              this.setState({horizontalChartData:data})
            })
            .catch((error) => console.log("Error in getting controlfamily results: "+error))
          })

          this.setState({select:'day'},function(){
            //+++++++++++++++ get statisticsData for graph ++++++++++++++++++++
            getcloudDataStatistics(worklogId,'day',policyPack.substring(5))
            .then((complianceData)=>{
              this.setState({statisticsData:complianceData},function(){
                if(this.state.statisticsData.combinedData.dataByDate && this.state.statisticsData.combinedData.dataByDate.length>0){
                    this.setState({dataByDateLength:this.state.statisticsData.combinedData.dataByDate.length})
                  }
              })
            })
            .catch((complianceDataError)=>console.log("error in fetching complianceData "+complianceDataError))
          })
        }
    }
  },


  columnChooserToggle() {
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
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
    console.log("NewList "+JSON.stringify(newColumnsList))
    this.setState({columnsList:newColumnsList})
    console.log("colList "+JSON.stringify(this.state.columnsList))
  },

  selectChangeHandler(event){
    let worklogId = this.props.routeParams.worklogId
    let policyPack = this.props.location.query.policypackname

    this.setState({
      select:event.target.value
    }, (props)=>{
      console.log(props)
        getcloudDataStatistics(worklogId, this.state.select, policyPack.substring(5))
        .then((complianceData)=>{
          this.setState({statisticsData:complianceData},function(){
            if(this.state.statisticsData.combinedData.dataByDate && this.state.statisticsData.combinedData.dataByDate.length>0){
                    this.setState({dataByDateLength:this.state.statisticsData.combinedData.dataByDate.length})
            }
          })
        })
        .catch((complianceDataError)=>console.log("error in fetching complianceData "+complianceDataError))
    })
  },

   policyPackChange(ppValue){
    let worklogId = this.props.routeParams.worklogId
    let policyPack = this.props.location.query.policypackname
    let asssettype=this.props.location.query.assettype;
    let reportAssetType = this.props.location.query.reportAtype;
    let pp="root.";
    let concatPP = pp.concat(ppValue);

    getAssetType(pp.concat(ppValue))
    .then((ppAssetType)=>{
      if (ppAssetType.assetType === 'AWS'){

        let navPath ='cloudReportdetail/'+this.props.routeParams.worklogId+'?policypackname='+concatPP+'&assettype=AWS'+'&reportAtype='+this.props.location.query.reportAtype
        this.context.router.replace(navPath);

      } else if (ppAssetType.assetType === 'ONPREM'){
         
         let navPath='reportdetail/'+this.props.routeParams.worklogId+'?policypackname='+concatPP+'&assettype=ONPREM'+'&reportAtype='+this.props.location.query.reportAtype
         this.context.router.replace(navPath);
      }
    })
    .catch((fetchAssetError)=>console.log("error in fetching ppAssetType++ "+fetchAssetError))

    this.setState({selectedPolicyPack:ppValue},function(){

       getcloudDataStatistics(this.props.routeParams.worklogId, this.state.select,this.state.selectedPolicyPack)
        .then((complianceData) => {
          this.setState({statisticsData:complianceData}, function(){
            if(this.state.statisticsData.combinedData.dataByDate && this.state.statisticsData.combinedData.dataByDate.length>0){
                    this.setState({dataByDateLength:this.state.statisticsData.combinedData.dataByDate.length})
                  }
          })
        })
        .catch((complianceDataError)=>console.log("error in fetching complianceData "+complianceDataError))

        //+++++++++++++ Getting headerInformation +++++++++++++++++++++++
      let Pp = this.state.selectedPolicyPack
      let newPp = "root."+Pp
      getWorkLogViewRecord(worklogId,reportAssetType,newPp)
      .then((resultViewData) => {
        if(resultViewData.profiles){
              this.setState({profiles: resultViewData.profiles})
            }
        this.setState({reportGeneratedEndTime:resultViewData.generated,
                        assessmentCompleted:resultViewData.completed,
                        reportName:resultViewData.reportname,
                        assetGroupId:resultViewData.assetgroupid})
      })
      .catch((resultViewDataError) => console.log("Error in fetching viewData "+resultViewDataError))

      //++++++++++++ GetScore ++++++++++++++++++
      getScoreWithWorklogId(worklogId,policyPack)
     .then((resultScoreObj) => {
        let resultScore = resultScoreObj.score;
        this.setState({score:resultScore})
      })
     .catch((resultScoreError) => console.log("error is getScoreWithWorklogId "+resultScoreError))

      //++++++++++++ OnChange of policyPacks horizontal chart data needs to be changed ++++++++++++++++++
       getGroupResultsByControlFamily(this.props.routeParams.worklogId,this.state.assetGroupId,this.state.selectedPolicyPack)
       .then((data) => {
          this.setState({horizontalChartData:data})
        })
        .catch((error) => console.log("Error in getting controlfamily results: "+error))
    }.bind(this));
  },

  osTypeChange(osTypeVal){
    this.setState({selectedOS:osTypeVal},function(){
    this.constructFilter();
    }.bind(this))
  },

  constructFilter(){
    let policyPack = this.props.location.query.policypackname;

    let filter = this.state.filters;

    let pp =[];
    pp.push(policyPack)
    filter["policypacks"]=pp

    if(this.state.selectedOS != null && this.state.selectedOS !== ''){
      filter["osname"] = this.state.selectedOS.split(',');
    }else {
      delete filter["osname"];
    }

    this.setState({filters:filter},function(){
      this.applyFilter()
    });
  },

  applyFilter(){
    console.log("apply filter called: "+JSON.stringify(this.state.filters));
    let worklogId = this.props.routeParams.worklogId
    getOnPremPolicyResultsList(worklogId, this.state.filters,50,50)
    .then((reports) =>  {
        this.setState({list:reports.device,
                      totalCount:reports.filterCount});
    })
    .catch((error) => console.log("Error in getOnPremPolicyResultsList in container:" + error))
  },

   getDataOnScroll(start,end,filter){
    let worklogId = this.props.routeParams.worklogId
    let resourceId = this.props.routeParams.resourceId
    getOnPremPolicyResultsList(worklogId, filter,start,end)
     .then((resultsList) =>  {
      //alert(resultsList.length);
      //Promise.resolve(resultsList)
        let newList = this.state.list.concat(resultsList.device);
       // this.setState({list:newList,totalCount:resultsList.filterCount});
       this.setState({list:newList});
    })
    .catch((resultListError) => console.log("Error in fetchReportsList:" + resultListError))
  },
  updateList(newList){
    this.setState({list:newList});
  },


  getTableColumn: function(colName){

      let concatPP = "root."
      let selectedPP = concatPP+this.state.selectedPolicyPack
      let ppTitle= findElement(this.state.policyPacks,"ppname",selectedPP)
      let colObj = findElement(this.state.columnsList,"name",colName);

      if(colObj != null && colObj["show"]){
        switch(colName){
          case 'hostName' :
          return <Column
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={2}
              align="center"
              cell={({rowIndex, ...props}) => {
                let hostname = this.state.list[rowIndex]['groupname']
                let status = this.state.list[rowIndex]['status']
                let detailLink = '#devicedetail/'+this.state.list[rowIndex]["worklogId"]+'/'+this.state.list[rowIndex]["resourceId"]+'?policypack='+selectedPP+'&analyst='+this.state.analyst+'&reportAtype='+this.props.location.query.reportAtype+'&reportName='+encodeURIComponent(ppTitle.pptitle)
                if(hostname === null || hostname === "null" || hostname === undefined || hostname === "")
                  hostname = '-';
                if(hostname === '-'){
                  return(
                    <Cell {...props}>{hostname}</Cell>
                  )
                }
                 if(status === 'COMPLETED'){
                  return(
                    <Cell {...props}
                      onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
                      onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
                      <div data-type="info" ref='valueDiv' data-tip={hostname}>
                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px", paddingLeft:"10px"}}>
                          <a href={detailLink} target='_blank' title='Report'>{hostname}</a>
                        </div>
                      </div>
                    </Cell>
                  )
                }else{
                  return(
                    <Cell {...props}
                      onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
                      onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
                      <div data-type="info" ref='valueDiv' data-tip={hostname}>
                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px", paddingLeft:"10px"}}>
                          {hostname}
                        </div>
                      </div>
                    </Cell>
                  )
                }
              }}
              width={150} />

          case 'ipaddress' :
          return <Column
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={2}
              align="center"
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {this.state.list[rowIndex]["ipaddress"]}
                </Cell>
              )}
              width={80} />

          case 'resourceType' :
          return  <Column
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={2}
              align="center"
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {this.state.list[rowIndex]["osType"]}
                </Cell>
              )}
              width={80} />

          case 'osName' :
          return <Column
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={2}
               align="center"
              cell={({rowIndex, ...props}) => {

                return(
                <Cell {...props}>
                   {this.state.list[rowIndex]["osName"]}
                </Cell>
              )}}
              width={100} />

          case 'devicescore' :
          return <Column
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={2}
              align="center"
               cell={({rowIndex, ...props}) => {
                 let statusStyle;
                 let deviceScoreDiv;
                 let discoveryStatus =  this.state.list[rowIndex]["status"]
              if(discoveryStatus =="RUNNING" || discoveryStatus == "running"){
                deviceScoreDiv = <div >{'-'}</div>
              }else if(this.state.list[rowIndex]["score"] != null && (discoveryStatus =="COMPLETED"|| discoveryStatus == "completed")){
                if(this.state.list[rowIndex]["score"] <= 50){
                  statusStyle = diamondRed;
                }else if(50 < this.state.list[rowIndex]["score"] && this.state.list[rowIndex]["score"]<= 80){
                  statusStyle = triangleupOrange;
                }else if( 80 < this.state.list[rowIndex]["score"] && this.state.list[rowIndex]["score"]<=100){
                  statusStyle = circleGreen;}
                deviceScoreDiv =  <div className={statusStyle}
                    style={{display:'flex',justifyContent:'center',paddingLeft:'10px'}}>
                      {statusStyle? this.state.list[rowIndex]["score"]:""}
                  </div>
              }else
              deviceScoreDiv = <div >{'-'}</div>
                return(
                 <Cell {...props}>
                  {deviceScoreDiv}
                </Cell>
              )}}
              width={50}/>

          case 'complianceStatus' :
          return <Column
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={2}
               align="center"
              cell={({rowIndex, ...props}) => {
              let state=''
              let stateColor='';
              let complianceDiv;
              let discoveryStatus = this.state.list[rowIndex]["status"]
              if(discoveryStatus == "RUNNING"|| discoveryStatus == "running"){
                complianceDiv = <div>{'Running'}</div>
              }
              else if(this.state.list[rowIndex]["score"] != null && (discoveryStatus =="COMPLETED"|| discoveryStatus == "completed")){
                  if(this.state.list[rowIndex]["score"] > 80){
                    state = 'Good';
                    stateColor = '#00C484'
                  }
                  else if(this.state.list[rowIndex]["score"]  > 50 && this.state.list[rowIndex]["score"]<=80){
                    state = 'Warning'
                    stateColor = '#F9C73D'
                  }
                  else if(this.state.list[rowIndex]["score"]  <= 50){
                    state = 'Alert'
                    stateColor = '#FF444D'
                  }
                complianceDiv = <span style={{width:'150px',color:stateColor}}> {state} </span>
              }
              else
                 complianceDiv = <div>{AttributeConstants.TEST_STATUS[discoveryStatus]}</div>

              return(
                <Cell {...props}>
                  {complianceDiv}
                </Cell>
              )}}
              width={50} />

           case 'timeStamp' :
          return <Column
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={2}
               align="center"
              cell={({rowIndex, ...props}) => {
                let timeStamp = this.state.list[rowIndex]["endTime"]
                if(timeStamp == null || timeStamp === "null" ||timeStamp === "" || timeStamp === undefined)
                  timeStamp = '-'
                else
                  timeStamp = moment.utc(timeStamp,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                return(
                <Cell {...props}>
                  {timeStamp}
                </Cell>
              )}}
              width={250} />


          default :
            return {}
        }
     }
   },

  render(){
  let resourcesCount = 0;
  if(this.state.list != null){
    resourcesCount = this.state.list.length;
  }

  let hostNameStyle = findElement(this.state.columnsList,"name","hostName")["show"] ? {display:'table-cell',width:'20%', 'textAlign':'center'}:{display:'none',width:'20%', 'textAlign':'center'}
  let ipaddressStyle = findElement(this.state.columnsList,"name","ipaddress")["show"] ? {display:'table-cell',width:'15%'}:{display:'none',width:'15%'}
  let resourceTypeStyle = findElement(this.state.columnsList,"name","resourceType",)["show"] ? {display:'table-cell',width:'10%'}:{display:'none',width:'10%'}
  let osNameStyle = findElement(this.state.columnsList,"name","osName")["show"] ? {display:'table-cell',width:'15%', 'textAlign':'center'}:{display:'none',width:'15%', 'textAlign':'center'}
  let devicescoreStyle = findElement(this.state.columnsList,"name","devicescore")["show"] ? {display:'table-cell',width:'10%'}:{display:'none',width:'10%'}
  let complianceStatusStyle = findElement(this.state.columnsList,"name","complianceStatus")["show"] ? {display:'table-cell',width:'15%'}:{display:'none',width:'15%'}
  let timeStampStyle = findElement(this.state.columnsList,"name","timeStamp")["show"] ? {display:'table-cell',width:'15%'}:{display:'none',width:'15%'}
  let selectStyle1 = { border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4', marginLeft: 8,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:0, width:'165px',lineHeight:'2.3em'}

  return (
    <div>
      <div id="contents" style={{minHeight:1140}}>
      <ReportHeader name='Resource Group Report'/>
      <div style={{backgroundColor: '#F9FAFC', margin:'-20px 60px 0 60px'}}>
      <div className='col-lg-12 col-xs-12 col-md-12 col-sm-12' id="topWrapper" style={{padding:0}}>
         <ReportTitle title={this.state.reportName}
                      worklogId={this.props.routeParams.worklogId}
                      selectedPolicyPack={this.state.selectedPolicyPack}
                      resourceId={-1}
                      assetType={this.props.location.query.assettype}/>
        <div className="row">
          <div className="col-lg-4 pull-left">
            <PolicyPackSelection
              policyPackChange = {this.policyPackChange}
              selectedPolicyPack = {this.state.selectedPolicyPack}
              policyList = {this.state.policyPacks}
              policyPackReactSelect = {this.state.policyPackReactSelect}/>
          </div>
        </div>
        <ReportMeta cloudType={this.state.cloudType}
                    reportGeneratedEndTime={this.state.reportGeneratedEndTime}
                    assessmentCompleted={this.state.assessmentCompleted}
                    reportName={this.state.reportName}
                    analyst={this.state.analyst}
                    worklogId={this.props.routeParams.worklogId}
                    profiles={this.state.profiles}/>
        <ComplianceBarChart assessmentScore={this.state.score}
          statisticsData={this.state.statisticsData}
          selectChangeHandler={this.selectChangeHandler}
          currentZoom={this.state.select}/>
      </div>
        <div style={{marginLeft: 12,marginTop: 20,marginRight:-5}}>
          <div className='col-lg-12 col-xs-12 col-md-12 col-sm-12' style={{backgroundColor: '#FFFFFF',marginTop: 20}}>
            <div  className="row">
                <div className="col-lg-10 col-xs-10 col-md-10 col-sm-10" style={{fontSize: 20, fontWeight: 'bold',paddingTop:10, marginBottom:10, color: '#454855',lineHeight:2}} >
                    ISSUES COUNT PER CONTROL FAMILY
                </div>
            </div>
            <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12" style={{height:'200px'}}>
              <StackedHorizontalBarChart
              canvasWidth={'700'}
              idProp={"onPremHorizontalChart"}
              horizontalChartData={this.state.horizontalChartData}/>
            </div>
            <div className=" col-lg-5 col-xs-5 col-md-5 col-sm-5"> </div>
            {(this.state.dataByDateLength>0)?
              <div className="col-lg-7 col-xs-7 col-md-7 col-sm-7" style={{marginTop:40,marginBottom:20,lineHeight:2}}>
                <GraphLegendsForHorizontal />
              </div>
            :''}
          </div>
        </div>
        <br />
        </div>
        </div>
         <div style={{minHeight:200,position:'relative'}}>
           {this.state.loadingDiv?
            <div style={{width:'100%'}}>
              <SpinnyLogo />
            </div>
       : <div id="resourceWrapper">
       <div>
       <Row style={{margin:'0 70px 0 60px'}}>
        <Col xs={4} style={{paddingTop:20,marginBottom:5,paddingLeft:15}}>
         <p style={{fontSize: 20, fontWeight: 'bold'}}>{this.state.totalCount} Resources</p>
        </Col>
        <Col style={{paddingTop:20,marginBottom:20, paddingRight:0, float:'right', marginRight:-7}}>
          <span style={{zIndex: 100}}>
            <Select className="dropdownFilter" placeholder={'All OS'}
              name=""
              value={this.state.selectedOS}
              options={this.state.osReactSelect}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              onChange={this.osTypeChange}/>
          </span>
        </Col>
      </Row>
        <div style={{margin:'0 auto'}}>
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
              header={<Cell><ResourceColumnChooserClass
                  needMaxWidth={true}
                  toggle={this.columnChooserToggle}
                  columnShow={this.state.columnChooserShow}
                  container={this.refs.resourcesTable}
                  columnsList={this.state.columnsList}
                  changeHandler={this.columnDisplayChangeHandler}/>
              </Cell>}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {''}
                </Cell>
              )}
              width={100} />}
        list={this.state.list}
        getDataList={this.getDataOnScroll}
        updateList={this.state.updateList}
        filter={this.state.filters}
      />
    </div>
      </div>
      </div>}
      </div>

    </div>
  )}
})

export default connect(
 ({users}) => ({loginName: users.login}),
)(ReportDetail)
