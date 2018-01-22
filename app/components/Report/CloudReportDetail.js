import React, { PropTypes } from 'react'
import {Col, Glyphicon} from 'react-bootstrap'
import {selectStyle} from 'sharedStyles/styles.css'
import {BarChart} from 'react-d3-components'
import {Column, Cell} from 'fixed-data-table'
import ScrollableDataTable from 'containers/DataTable/ScrollableDataTable'
import {MetaItem, ReportHeader, ReportTitle, CircularScoreGraph, GraphLegends} from './ReportCommon'
import {getCloudPolicyResultsListWithFilter,
        getScoreWithWorklogId, getWorkLogViewRecord, getAssetType,
        getcloudDataStatistics, getControlFamiliesOnPolicyPack,
        getTragettedPolicypacks, getState, getSeverity} from 'helpers/reports'
import {ResourceColumnChooserClass} from 'containers/Infrastructure/ResourceColumnChooserCell'
import AttributeConstants from 'constants/AttributeConstants'
import moment from 'moment'
import { connect } from 'react-redux'
import {SpinnyLogo} from 'containers'
import Select from 'react-select'
import {PolicyNameCell, RemediationCell, PolicyPacksCell, RecipeCell, ReportStateCell} from 'components/Table/Table'
import {findElement} from 'javascripts/util.js'

ReportMeta.propTypes = {
  cloudType: PropTypes.string.isRequired,
  reportGeneratedEndTime: PropTypes.string.isRequired,
  assessmentCompleted: PropTypes.string.isRequired,
  analyst: PropTypes.string,
  profiles: PropTypes.array,
}

function ReportMeta (props) {
  let cloudType = props.cloudType
  let profiles = ''
  if (props.cloudType === null) {
    cloudType = 'AWS'
  }

  if (props.cloudType !== null && props.cloudType === 'aws') {
    cloudType = 'AWS'
  }

  if (props.cloudType !== null && props.cloudType === 'azure') {
    cloudType = 'Azure'
  }

  let generatedTime = props.reportGeneratedEndTime
  let completedTime = props.assessmentCompleted

  // +++++++ Converting generatedTime to system locale time
  if (generatedTime === null || generatedTime === 'null' || generatedTime === '' || generatedTime === undefined) {
    generatedTime = '-'
  }
  else
  {
    generatedTime = moment.utc(generatedTime, 'YYYY/MM/DD @ HH:mm TZD').format('MM[/]DD[/]YYYY [@] HH[:]mm [UTC]')
  }
  // +++++++ Converting completedTime to system locale time
  if (completedTime === null || completedTime === 'null' || completedTime === '' || completedTime === undefined) {
    completedTime = '-'
  }
  else {
    completedTime = moment.utc(completedTime, 'YYYY/MM/DD @ HH:mm TZD').format('MM[/]DD[/]YYYY [@] HH[:]mm [UTC]')
  }

  let rptAnalyst = props.analyst
  if (props.analyst === null || props.analyst === '') {
    rptAnalyst = '-'
  }

  if (props.profiles && props.profiles !== null && props.profiles !== 'null' && props.profiles.length>0) {
    profiles = props.profiles.join(',')
  }

  return (
    <table style={{ marginTop: 20}}>
      <tbody>
        <MetaItem title='Cloud Type' desc={cloudType}/>
        <MetaItem title='Assessment started' desc={generatedTime}/>
        <MetaItem title='Assessment completed' desc= {completedTime}/>
        <MetaItem title='Analyst' desc= {rptAnalyst}/>
        {props.profiles.length >0 ?<MetaItem title='Profiles' desc = {profiles}/>:''}
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

  getInitialState () {
    return {
      policyPacks: [],
      groups: [],
    }
  },
  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.policyList !== this.props.policyList) {
      this.setState({policyPacks: nextProps.policyList})
    }
  },

  render: function () {
    let selectStyle1 = { border: '1px solid #4C58A4', height: 40, fontSize: 18, color: '#4C58A4', paddingTop: 0, paddingBottom: 0, paddingLeft: 10, paddingRight: 0, width: '175px', lineHeight: '2.3em'}
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
    )
  },
})

const ComplianceBarChart = React.createClass({
  propTypes: {
    currentZoom: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      select: 'day',
      barChartWidth: '',
      chartRange: [
        {label: 'Day', value: 'day'},
        {label: 'Week', value: 'week'},
        {label: 'Month', value: 'month'},
        {label: 'Quarter', value: 'quarter'},
        {label: 'Year', value: 'year'},
      ],
    }
  },

  componentWillReceiveProps () {
    setTimeout(this.dynamicChartWidth, 1000)
  },

  selectChangeHandler (event) {
    this.setState({select: event})
  },

  dynamicChartWidth () {
    let zoomTime = this.props.currentZoom
    let dataCount = this.props.statisticsData.combinedData.data[0].values.length + 1

    if (zoomTime === 'day') {
      this.setState({barChartWidth: dataCount*170, statisticsData: this.props.statisticsData.combinedData.data})
    }
    else if (zoomTime === 'week') {
      this.setState({barChartWidth: dataCount*170, statisticsData: this.props.statisticsData.combinedData.data})
    }
    else if (zoomTime === 'month') {
      this.setState({barChartWidth: dataCount*170, statisticsData: this.props.statisticsData.combinedData.data})
    }
    else if (zoomTime === 'quarter') {
      this.setState({barChartWidth: dataCount*170, statisticsData: this.props.statisticsData.combinedData.data})
    }
    else if (zoomTime === 'year') {
      this.setState({barChartWidth: dataCount*170, statisticsData: this.props.statisticsData.combinedData.data})
    }
  },

  tooltipBar(x, y0, y, total) {
    return y
  },

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
    const scale = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484'])
    let myTestData, trendData, scanTrend, scanValue, trendGlyph, trendColor
    if (this.props.statisticsData.combinedData){
      myTestData = this.props.statisticsData.combinedData.data
      trendData = this.props.statisticsData.combinedData.dataByDate
      if (trendData !== null && trendData.length>0) {
        scanTrend = trendData[trendData.length-1]
        if (scanTrend.values !== null && scanTrend.values.length > 0) {
          scanValue = scanTrend.values[scanTrend.values.length-1]
          if (scanValue === 0) {
            trendGlyph = ''
          }
          else if (scanValue > 0) {
            trendGlyph = 'plus'
            trendColor = 'green'
          }
          else {
            trendGlyph = 'minus'
            trendColor = 'red'
          }
        }
      }
    }
    let barChartWidthVar = this.state.barChartWidth
    let state = ''
    let score = this.props.assessmentScore
    let stateClassName = ''
    if (score !== null) {
      if (score > 80) {
        state = 'GOOD'
        stateClassName = {color: '#00C484'}
      }
      else if (score > 50 && score <= 80) {
        state = 'WARNING'
        stateClassName = {color: '#F9C73D'}
      }
      else if (score <= 50) {
        state = 'ALERT'
        stateClassName = {color: '#FF444D'}
      }
    }else if (score === null) {
      state = '-'
      score = 'N/A'
      stateClassName = {color: '#4C58A4'}
    }

    setTimeout(function (){
      var vis = d3.selectAll('.tick line')
      var yis = d3.selectAll('.domain')
      yis.attr('stroke','#f9fafc')
      vis.each(function(d,i) {
        let findYAxis = d3.select(this).attr('x2')
        if (findYAxis!=0) {
          d3.select(this).attr('x2', '200%').attr('stroke', '#d5deec')
        }
      });
    }, 1000);

    return (
      <div style={{marginTop: 40, height: 420}}>
          <Col xs={8} style={{backgroundColor: '#F9FAFC', paddingLeft: 0}}>
            {(dataLength>0 && dataFlag)?
            <div>
            <p style={{fontSize: 18 , fontWeight: 'bold', marginBottom: 10}}>SCORE OVERVIEW</p>
              <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <span style={{marginLeft: '10px', marginRight: '10px', marginTop: '10px'}}>
                  Zoom:
                </span>
                <Select className='dropdownTimeZone'
                  name=""
                  value={this.props.currentZoom}
                  options={this.state.chartRange}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.props.selectChangeHandler}/>
              </div>

              <div style={{minWidth: 830, overflow: 'auto', marginBottom: 15}}>
                <BarChart
                  groupedBars
                  colorScale={scale}
                  data={myTestData}
                  width={barChartWidthVar}
                  height={280}
                  yAxis={{tickArguments: [5]}}
                  yAxis={{tickFormat:d3.format("d")}}
                  tooltipHtml={this.tooltipBar}
                  margin={{top: 20, bottom: 50, left: 30, right: 50}}/>
              </div>
               <GraphLegends />
               </div>
              :<div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{marginTop:'100px',textAlign:'center'}}>{graphMsg}</div>}

          </Col>
          <Col xs={1}></Col>
          <Col xs={2}>

            <div style={{ backgroundColor: 'White', width: 220, paddingTop: 5}}>
                <CircularScoreGraph score={score}/>
                <div style={{color: trendColor, marginLeft: 40, paddingLeft: 35}}>
                  <Glyphicon style={{color:trendColor, fontSize: 8}} glyph={trendGlyph}/> {scanValue}%
                </div>
                <div style={{marginLeft: 40, paddingLeft: 10}}>since last scan</div>
                <table style={{borderTop: 5, borderTopColor: '#E8EFF9', borderTopStyle: 'Solid', width: 220}}>
                  <tr>
                    <th style={{borderRight: 5, borderRightColor: '#E8EFF9', borderRightStyle: 'Solid'}}>STATE</th>
                    <th style= {stateClassName}>{state}</th>
                  </tr>
                </table>
            </div>
          </Col>
      </div>
    )
  }
})

const ReportDetail = React.createClass({

  getInitialState(){
    return {
      assetGroupId: '',
      policyPacks: [],
      totalPoliciesCount: 0,
      groups: [],
      list: [],
      controlFamilies: [],
      controlFamilyReactSelect: [],
      stateList: [],
      severityList: [],
      stateReactSelect: [],
      severityReactSelect: [],
      asset: {},
      statisticsData: [],
      score: 0,
      profiles: [],
      analyst: '',
      reportName: '',
      cloudType: '',
      reportGeneratedEndTime: '',
      assessmentCompleted: '',
      columnChooserShow: false,
      columnsList: [
        {name: 'policyName', displayHeaderText: 'POLICY NAME', displayText: 'Policy Name', show: true, columnName: 'POLICY NAME', width: '130'},
        {name: 'severity', displayHeaderText: 'SEVERITY', displayText: 'Severity', show: true, columnName: 'SEVERITY', width: '130'},
        {name: 'state', displayHeaderText: 'STATE',displayText:'State', show: true,columnName: 'STATE', width: '130'},
        {name: 'weights', displayHeaderText: 'WEIGHT',displayText:'Weight', show: true, columnName: 'WEIGHT', width: '130'},
        {name: 'guildeline', displayHeaderText: 'POLICY PACK', displayText: 'Policy Pack', show:true, columnName: 'POLICY PACK', width: '130'},
        {name: 'controlId', displayHeaderText: 'CONTROL FAMILY', displayText: 'Control Family',show:true, columnName: 'CONTROL FAMILY', width: '130'},
        {name: 'remidiation', displayHeaderText: 'REMEDIATION STEPS', displayText: 'Remediation Steps', show:false, columnName: 'REMEDIATION STEPS', width: '130'},
      ],
      select: 'day',
      selectedPolicyPack: '',
      policyPackReactSelect: [],
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
    let policyPack = this.props.location.query.policypackname
    let reportAssetType = this.props.location.query.reportAtype

    //  +++++++++++++ Setting selected policypacks ++++++++++++++++++
    this.setState({selectedPolicyPack:policyPack.substring(5,policyPack.length)},function(){
                this.selectPolicyPack()
              })
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
    .catch((fetchPolicyPackError) => console.log("error in fetching policypacks "+fetchPolicyPackError))

    // +++++++++++++ Getting Score for Graph +++++++++++++++++++++++
    getScoreWithWorklogId(worklogId, policyPack)
      .then((resultScoreObj) => {
        let resultScore = resultScoreObj.score
        this.setState({score: resultScore})
      })
      .catch((resultScoreError) => console.log("error is getScoreWithWorklogId "+resultScoreError))

      // +++++++++++++++ get statisticsData for graph ++++++++++++++++++++
      getcloudDataStatistics(worklogId,'day',policyPack.substring(5))
      .then((complianceData) => {
        this.setState({statisticsData: complianceData})
      })
      .catch((complianceDataError) => console.log("error in fetching complianceData "+complianceDataError))

    // +++++++++ Getting type for policypack to be displayed in Header info Type+++++++
     getAssetType(policyPack)
    .then((ppAssetType) => {
        this.setState({cloudType: ppAssetType.assetType})
    })
    .catch((fetchAssetError) => console.log("error in fetching ppAssetType"+fetchAssetError))

    // +++++++++++++ Getting headerInformation +++++++++++++++++++++++
      getWorkLogViewRecord(worklogId, reportAssetType, policyPack)
      .then((resultViewData) => {
        this.setState({reportGeneratedEndTime: resultViewData.generated,
                        assessmentCompleted: resultViewData.completed,
                        reportName: resultViewData.reportname,
                        assetGroupId: resultViewData.assetgroupid,
                       })

        // +++++++++++++ Setting firstPolicyPack +++++++++++++++++++++++
       /* if(policyPack !== null){
              this.setState({selectedPolicyPack:policyPack.substring(5,policyPack.length)},function(){
                this.selectPolicyPack()
              })
        }
*/
      })
      .catch((resultViewDataError) => console.log("Error in fetching viewData "+resultViewDataError))
  },

  componentWillReceiveProps(nextProps){

    let asssettype = this.props.location.query.assettype
     // ++++Updating score when route params changes +++++++++++
    if (nextProps.location.query.policypackname !== this.props.location.query.policypackname){
      getScoreWithWorklogId(this.props.routeParams.worklogId, nextProps.location.query.policypackname)
      .then((resultScoreObj) => {
        let resultScore = resultScoreObj.score
        this.setState({score:resultScore})
      })
      .catch((resultScoreError) => console.log("error is getScoreWithWorklogId "+resultScoreError))

      // ++++++++++++++ Fetch list of targetted policypacks ++++++++++++
    let policypackArrayVal = {label:'',value:'', title:''}, policyArray = [];
    getTragettedPolicypacks(this.props.routeParams.worklogId, nextProps.location.query.reportAtype)
    .then((result) => {
      this.setState({analyst:result.analyst,
        policyPacks: result.ppinfo}, function(){

        this.state.policyPacks.map((val, key ) => {
          policypackArrayVal = {label:'', value:'', title:''}
          policypackArrayVal.label = val.pptitle
          policypackArrayVal.value = val.ppname.substring(5, val.length)
          policypackArrayVal.title = val.pptitle
          policyArray.push(policypackArrayVal)
        })
        this.setState({policyPackReactSelect:policyArray})
      })
    })
    .catch((fetchStateError) => console.log("error in fetching states "+fetchStateError))

    }
  },

  policyPackChange(ppValue){
    let pp = 'root.'
    let concatPP = pp.concat(ppValue)
    getAssetType(pp.concat(ppValue))
    .then((ppAssetType) => {
      if (ppAssetType.assetType === 'AWS'){
        let navPath = 'cloudReportdetail/'+this.props.routeParams.worklogId+'?policypackname='+concatPP+'&assettype=AWS'+'&reportAtype='+this.props.location.query.reportAtype
        this.context.router.replace(navPath)
      }else if (ppAssetType.assetType === 'ONPREM'){
         let navPath = 'reportdetail/'+this.props.routeParams.worklogId+'?policypackname='+concatPP+'&assettype=ONPREM'+'&reportAtype='+this.props.location.query.reportAtype
         this.context.router.replace(navPath)
      }
    })
    .catch((fetchAssetError) => console.log("error in fetching ppAssetType"+fetchAssetError))
    this.setState({selectedPolicyPack:ppValue,
                  selectedState: '',
                  selectedSeverity: '',
                  selectedGroup: '',
                  selectedControlFamily: '',
                  select: 'day'},function(){
      this.selectPolicyPack()
    }.bind(this))
  },

   selectPolicyPack(){
    let worklogId = this.props.routeParams.worklogId
    let policyPack = this.props.location.query.policypackname
    let reportAssetType = this.props.location.query.reportAtype

    this.constructFilter()

    // ++++++++++++ Populate ControlFamily for selected policyPacks ++++++++++++++++++
    let controlFamilyArrayVal = {label: '', value: '', title:''}, controlfamilyArray = [];
    getControlFamiliesOnPolicyPack(worklogId, this.state.selectedPolicyPack)
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
    var params = "?worklogid="+worklogId+"&assettype="+reportAssetType+"&policypack="+this.state.selectedPolicyPack;
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


    this.setState({select: 'day'}, function(){ // +++++++++++++++ get statisticsData for graph ++++++++++++++++++++
      getcloudDataStatistics(worklogId, 'day', this.state.selectedPolicyPack)
      .then((complianceData) => {
        this.setState({statisticsData: complianceData})
      })
      .catch((complianceDataError) => console.log("error in fetching complianceData "+complianceDataError))})

     // +++++++++++++ Getting headerInformation +++++++++++++++++++++++
      let Pp = this.state.selectedPolicyPack
      let newPp = "root."+Pp
      getWorkLogViewRecord(worklogId, reportAssetType, newPp)
      .then((resultViewData) => {
        if (resultViewData.profiles) {
          this.setState({profiles: resultViewData.profiles})
        }
        this.setState({reportGeneratedEndTime: resultViewData.generated,
                        assessmentCompleted: resultViewData.completed,
                        reportName: resultViewData.reportname,
                        assetGroupId: resultViewData.assetgroupid})
      })
      .catch((resultViewDataError) => console.log("Error in fetching viewData "+resultViewDataError))
  },

  stateChange(stateVal) {
    this.setState({selectedState: stateVal}, function(){
      this.constructFilter()
    }.bind(this))
  },

  severityChange(severityVal) {
    this.setState({selectedSeverity: severityVal}, function(){
      this.constructFilter()
    }.bind(this))
  },

  controlFamilyChange(controlFamilyVal) {
    this.setState({selectedControlFamily: controlFamilyVal}, function(){
      this.constructFilter()
    }.bind(this))
  },

  constructFilter(){
    let filters = {}

    if (this.state.selectedPolicyPack !== null && this.state.selectedPolicyPack !== ''){
      filters["policypacks"] = this.state.selectedPolicyPack.split(',')
    }
    if (this.state.selectedState !== null && this.state.selectedState !== ''){
      filters["state"] = this.state.selectedState.split(',')
    }
    if (this.state.selectedSeverity !== null && this.state.selectedSeverity !== ''){
      filters["severity"] = this.state.selectedSeverity.split(',')
    }
    if (this.state.selectedGroup !== null && this.state.selectedGroup !== ''){
      filters["groups"] = this.state.selectedGroup.split(',')
    }
    if (this.state.selectedControlFamily != null && this.state.selectedControlFamily !== ''){
      filters["controlid"]= this.state.selectedControlFamily.split(',')
    }

    this.setState({filters:filters}, function(){
      this.applyFilter()
    })
  },

  applyFilter(){
    let worklogId = this.props.routeParams.worklogId
    this.setState({loadingDiv:true})
    getCloudPolicyResultsListWithFilter(worklogId, this.state.filters, 50, 50)
    .then((reports) =>  {
        this.setState({list: reports.cloud,
                        totalPoliciesCount: reports.filterCount,
                        loadingDiv: false})
    })
    .catch((error) => {this.setState({loadingDiv:false})
      console.log('Error in getCloudPolicyResultsListWithFilter in container:' + error)})
  },

  columnChooserToggle() {
    this.setState({ columnChooserShow: !this.state.columnChooserShow })
  },

  getDataOnScroll(start, end, filter){
    let worklogId = this.props.routeParams.worklogId
    getCloudPolicyResultsListWithFilter(worklogId, filter, start, end)
    .then((resultsList) =>  {
       let newList = this.state.list.concat(resultsList.cloud)
       this.updateList(newList)
    })
    .catch((resultListError) => console.log('Error in fetchReportsList:' + JSON.stringify(resultListError)))
  },

  updateList(newList){
    this.setState({list: newList})
  },

  refresh(){
    /*
     *Used for refreshing 
     *a) Score
     *b) table
     *c) vertical bar chart
    */
    let worklogId = this.props.routeParams.worklogId
    let policyPack = this.props.location.query.policypackname
    let reportAssetType = this.props.location.query.reportAtype
    
    getScoreWithWorklogId(this.props.routeParams.worklogId, this.props.location.query.policypackname)
      .then((resultScoreObj) => {
        let resultScore = resultScoreObj.score
        this.setState({score:resultScore})
      })
      .catch((resultScoreError) => console.log("error is getScoreWithWorklogId "+resultScoreError))
    
    // ++++++++++ Get state for table filter ++++++++++++++++++++
    let stateArrayVal = {label:'',value:''}, stateArray = [];
    var params = "?worklogid="+worklogId+"&assettype="+reportAssetType+"&policypack="+this.state.selectedPolicyPack;
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
    this.applyFilter()

    // +++++++++++++++ get statisticsData for graph ++++++++++++++++++++
      
      this.setState({select: 'day'}, function(){ // +++++++++++++++ get statisticsData for graph ++++++++++++++++++++
      getcloudDataStatistics(worklogId, 'day', this.state.selectedPolicyPack)
      .then((complianceData) => {
        this.setState({statisticsData: complianceData})
      })
      .catch((complianceDataError) => console.log("error in fetching complianceData "+complianceDataError))})
  },

  columnDisplayChangeHandler(colName){
    let newColumnsList = []
    this.state.columnsList.forEach(function(col){
      if (col.name === colName) {
        newColumnsList.push({...col,show:!col.show})
      }
      else {
        newColumnsList.push(col)
      }
    })
    this.setState({columnsList: newColumnsList})
  },

  selectChangeHandler(event) {
    let worklogId = this.props.routeParams.worklogId
    let policyPack = this.props.location.query.policypackname
    this.setState({select: event
    }, (props) => {
      if (this.state.assetGroupId !== null && this.state.assetGroupId !== 'null') {
        getcloudDataStatistics(worklogId, this.state.select,policyPack.substring(5))
        .then((complianceData) => {
          this.setState({statisticsData: complianceData})
        })
        .catch((complianceDataError) => console.log("error in fetching complianceData "+complianceDataError))
      }
    })
  },


  getTableColumn: function(colName){

      let colObj = findElement(this.state.columnsList, 'name', colName)

      if (colObj !== null && colObj['show']) {

        switch(colName){

          case 'policyName' :
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              cell={<PolicyNameCell col="policies" data={this.state.list} />}
              width={300}
              minWidth={200}
               />

           case 'severity' :

          return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={1}
              align='center'
              cell={({rowIndex, ...props}) => {
                let severityObj = this.state.list[rowIndex]['severity']
                return (
                <Cell {...props}>
                  {AttributeConstants.SEVERITY[severityObj]}
                </Cell>
              )}}
              width={75} />

          case 'state' :
          return  <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={1}
              align="center"
              cell={<ReportStateCell col="state" data={this.state.list} showFailedRsult={true}/>}
              width={98} />

          case 'remidiation' :
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={1}
              cell={<RemediationCell col='fixsugesion' data={this.state.list} />}
              width={350} />

          case 'weights' :
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              align="center"
              cell={({rowIndex, ...props}) => {
                return (
               <Cell {...props}>
                  {this.state.list[rowIndex]['weights']}
                </Cell>
              )}}
              width={60} />

          case 'guildeline':
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              align = 'center'
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
              cell={({rowIndex, ...props}) => {
                let cId = this.state.list[rowIndex]['controlId']
                if (cId === 'null'|| cId === null) {
                  cId = '-'
                }
                return (
                <Cell {...props}>
                   {cId}
                </Cell>
              )}}
              width={110} />
          default :
            return {}
        }
     }
   },

  render(){

  let selectStyle1 = { border: '1px solid #4C58A4', height: 40, fontSize: 18,color: '#4C58A4', marginLeft: 8,paddingTop: 0, paddingBottom: 0, paddingLeft: 10, paddingRight: 0, width:'165px', lineHeight:'2.3em'}
  let controlFamilyDropdownStyle = {border: '1px solid #4C58A4', height:40,fontSize: 18, color:'#4C58A4', marginLeft: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 10, paddingRight:25, width:'185px', lineHeight:'2.3em'}

  return (
    <div>
      <ReportHeader name='Cloud Test Report'/>
      <div style={{backgroundColor: '#F9FAFC', marginLeft: 60, marginRight:60}}>
        <ReportTitle  title={this.state.reportName}
                      worklogId={this.props.routeParams.worklogId}
                      selectedPolicyPack={this.state.selectedPolicyPack}
                      resourceId={-1}
                      assetType={this.props.location.query.assettype}/>
        <PolicyPackSelection
          policyPackChange = {this.policyPackChange}
          policyList = {this.state.policyPacks}
          selectedPolicyPack = {this.state.selectedPolicyPack}
          policyPackReactSelect = {this.state.policyPackReactSelect}
          />
        <ReportMeta cloudType={this.state.cloudType}
                    reportGeneratedEndTime={this.state.reportGeneratedEndTime}
                    assessmentCompleted={this.state.assessmentCompleted}
                    reportName={this.state.reportName}
                    analyst={this.state.analyst}
                    profiles={this.state.profiles}
                    worklogId={this.props.routeParams.worklogId}/>
        <ComplianceBarChart
          assessmentScore={this.state.score}
          statisticsData={this.state.statisticsData}
          selectChangeHandler={this.selectChangeHandler}
          currentZoom={this.state.select}
          />
          <div style={{minHeight:200,position:'relative'}}>
           {this.state.loadingDiv
            ?<div style={{width:'100%'}}>
              <SpinnyLogo />
            </div>
            :
              <div>
                <div style={{height:70}}>
                  <Col xs={4} style={{paddingTop: 20,paddingLeft: 0}}>
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
                      <span style={{marginRight: '10px'}}>
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
              <div id='policies' style={{marginLeft: '-60px', marginBottom: '20px'}}>
                <ScrollableDataTable
                  large = 'yes'
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
                            remediation={true}
                            toggle={this.columnChooserToggle}
                            columnShow={this.state.columnChooserShow}
                            container={this.refs.resourcesTable}
                            columnsList={this.state.columnsList}
                            changeHandler={this.columnDisplayChangeHandler}/>
                        </Cell>}
                        cell={<RecipeCell 
                          reportType={'cloud'}
                          refresh={this.refresh}
                          col="fixsugesion" 
                          policyResultIdCol={'policyresultid'}
                          flagCol={'flag'}
                          pp={this.state.selectedPolicyPack} 
                          col="policies" 
                          worklogId={this.props.routeParams.worklogId}
                          data={this.state.list} />}
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
  ) }
})
export default connect(
 ({users}) => ({loginName: users.login}),
)(ReportDetail)
