import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import {row, col, Col, Row} from 'react-bootstrap'
import {dashboardBar} from './styles.css'
import {SpinnyLogo} from 'containers'
import {SeverityChart} from './Dashboard'
import AttributeConstants from 'constants/AttributeConstants'
import {getQuestionData8, getDashboardQuestion8Dropdown, getQuestion8ControlFamilyList, getTop25Issues, failedDeviceCount, top25IssuesFilters} from 'helpers/dashboard'
import {diamond, triangleup, sevcircle, liStyle, toolTipStyle} from './styles.css'
import {CircularScoreGraph} from './Top25ReportCommon'
import moment from 'moment'

class Top25Issues extends React.Component {
	constructor(props) {
    super(props);
    this.state={
      discoveredOS: [],
      policyPacks: [],
      groupsSelect:[],
      osReactSelect:[],
      groupsReactSelect:[],
      controlFamReactSelect: [],
      selectedOS: '',
      selectedPolicyPack: '',
      selectedControlFamily: '',
      selectedGroup: '',
      disableControlFamily: true,

      actionsOptions: [
        {label:"Select Action", value:''},
        {label:"Action2", value:"act2"},
        {label:"Action3", value:"act3"},
        {label:"Action4", value:"act4"},
      ],
      selectedAction: 'Select Action',
      responce: [],
      actionList: {},
      loadingDiv: true,
      loadingTable: true,
      top3ControlFamilies:[],
      resourcesArray: [],
      d1:[
        {
          "values": [
          ],
          "label": ""
        }
      ],
      byPolicyPacks: [],
      byGroups:[],
      d3:[
      {
        "values": [{
          'x':'AwsGroup',
          'y':'50'
        },{
          'x':'AzureGroup',
          'y':'25'
        }
        ],
        "label": "By Group"
      }
    ],
    countValue:4,
    issueDisplayText: 'View all 25 issues'
    }
  }

  parseData(data){
    var data2 = data[0].values.sort(function(a,b) {return parseFloat(b.y) - parseFloat(a.y);}).slice(0,10);
    data[0].values = data2
    return data
  }
  componentDidMount(){
    let osArrayVal = {label:'',value:''}, osArray=[]
    let groupArrayVal = {label:'',value:''}, groupArray=[]
    let policyArrayVal = {label:'',value:''}, policyArray=[]
    
    //+++++++++ Getting Top25OS Select OS Dropdown ++++++++++++++++
    getDashboardQuestion8Dropdown()
    .then(
      (data) => {
        /*********** For OS Dropdown ***********/
        this.setState({discoveredOS:data.data_os}, function(){
          if(data != null && data.data_os != null && data.data_os.length>0)
          {
            osArrayVal = {label:'Select OS',value:'', title:''}
            osArray.push(osArrayVal)
          }
          this.state.discoveredOS.map((val,key)=>{
          osArrayVal = {label:'',value:'', title:''}
          osArrayVal.label= val.osname
          osArrayVal.value = val.osname
          osArrayVal.title = val.osname
          // console.log('osArray',osArrayVal)
          osArray.push(osArrayVal)
        })
        this.setState({osReactSelect:osArray})
        })

        /*********** For Groups Dropdown ***********/
        this.setState({groupsSelect:data.data_group}, function(){
          if(data!=null && data.data_group != null && data.data_group.length>0){
            groupArrayVal = {label:'Select Group',value:'', title:''}
            groupArray.push(groupArrayVal)
          }
          this.state.groupsSelect.map((val,key)=>{          
            groupArrayVal = {label:'',value:''}
            groupArrayVal.label= val.groupname
            groupArrayVal.title = val.groupname,
            groupArrayVal.value = val.groupname,
            groupArray.push(groupArrayVal)          
          })
         this.setState({groupsReactSelect:groupArray}) 
        })

        /*********** For Policy pack Dropdown ***********/
        this.setState({policyPacks:data.data_policy}, function(){
          if(data!=null && data.data_policy != null && data.data_policy.length>0){
            policyArrayVal = {label:'Select Policy Pack',value:'', title:''}
            policyArray.push(policyArrayVal)
          }
          this.state.policyPacks.map((val,key)=>{    
          console.log('val.policypackname',val.policypackname)      
            policyArrayVal = {label:'',value:''}
            policyArrayVal.label= val.policypackname
            policyArrayVal.title = val.policypackname,
            policyArrayVal.value = val.policypackname,
            policyArray.push(policyArrayVal)          
          })
         this.setState({policyPacksReactSelect:policyArray}) 
        })
      }
    )
    .catch((getDashboardQuestion8DropdownError)=>console.log("Error in fetching the discoveredOS in container"+getDashboardQuestion8DropdownError))

    getQuestionData8()
    .then((data) => {
      let d1 = this.parseData(data.data_os);
      let byPolicyPacks = this.parseData(data.data_policy)
      //let d3 = this.parseData(data.combinedData.d3);
      let byGroups = this.parseData(data.data_group);
      this.setState({
        loadingDiv:false,
        d1: d1,
        byGroups: byGroups,
        byPolicyPacks:byPolicyPacks,
        'top3ControlFamilies': data.data_family
      },function(){
        // console.log('top3ControlFamilies New', this.state.byPolicyPacks, this.state.byGroups)
      });
    })
    .catch((error) => console.log("Error in getting Question 1 data:", error))

    /****** Get top 25 Question Data ***********/
    getTop25Issues()
    .then((data) => {
      this.setState({loadingTable:false,
                    responce:data.output})
    })
    .catch((error) => console.log("Error in getting data", error))
  }

  showActionToolTip(divId){
    document.getElementById(divId).style.visibility="visible";
  }

  hideActionToolTip(divId){
    document.getElementById(divId).style.visibility="hidden";
  }

  handleActionChange(e){
    this.setState({selectedAction:e})
  }

  handleDeviceFailed(failedDeviceIds){
    console.log(failedDeviceIds)
  }

  top25FilterAPICall(){
    this.setState({loadingTable: true,
                  responce:[]})
    top25IssuesFilters(this.state.selectedOS, this.state.selectedGroup, this.state.selectedPolicyPack, this.state.selectedControlFamily)
    .then((data) => {
      this.setState({loadingTable: false})
      this.setState({responce:data.output})
    })
    .catch((error) => console.log("Error in getting data", error))
  }

  handleChangeOS(osVal){
    this.setState({selectedOS: osVal}, function(){
      this.top25FilterAPICall()
    })
  }

  handleChangeGroups(grpVal){
    this.setState({selectedGroup: grpVal}, function(){
      this.top25FilterAPICall()
    })
  }

  handleControlFamilyChange(cFamilyVal) {
    this.setState({selectedControlFamily: cFamilyVal}, function(){
      this.top25FilterAPICall()
    })
  }

  handlePolicyPackChange(policyPackVal){
    this.setState({selectedControlFamily:''})
    this.setState({selectedPolicyPack: policyPackVal}, function(){
      this.top25FilterAPICall()
      this.setState({controlFamReactSelect:[]})
      if(this.state.selectedPolicyPack != '')
      {
        getQuestion8ControlFamilyList(this.state.selectedPolicyPack)
        .then((data) => {
          this.setState({controlFamilies: data.data_family},function(){
            if(this.state.controlFamilies != ''){
              let controlFamArrayVal = {label: '', value: ''}, controlFamArray = []

              controlFamArrayVal = {label:'Select Control Family',value:'', title:''}
              controlFamArray.push(controlFamArrayVal)

              this.state.controlFamilies.map((val,key)=>{
                controlFamArrayVal = {label:'',value:'', title:''}
                controlFamArrayVal.label= val.family
                controlFamArrayVal.value = val.family
                controlFamArrayVal.title = val.family
                controlFamArray.push(controlFamArrayVal)
              })
              this.setState({disableControlFamily:false, 
                controlFamReactSelect:controlFamArray})
            }
          });
        })
        .catch((error) => console.log("Error in getting the control familes list:"+JSON.stringify(error)))
      }
    })
  }
  handleClick(){
    if(this.state.countValue == 4){
      this.setState({countValue:23,
        issueDisplayText:'View less'})
    }else if(this.state.countValue === 23){
      this.setState({countValue: 4,
        issueDisplayText: 'View all 25 issues'})
    }
  }

  render() {
    let renderCharts = [];
    let top3ControlFamilies = [];
    let style = {
        zIndex: 100,
        marginLeft:-25
    }

    let listItems = []
    this.state.top3ControlFamilies.map((val, key)=>{
      if(val.family.indexOf('-')>-1)
      {
        let controlFamily = '<b>'+val.family.substring(0,val.family.indexOf('-')+1)+'</b>'+val.family.substring(val.family.indexOf('-')+2)      
        listItems.push(<li className={liStyle} key={key} dangerouslySetInnerHTML={{__html:controlFamily}}></li>)
      }
      else{
        listItems.push(<li className={liStyle} key={key}>{val.family}</li>)           
      }
    })

    if(this.state.top3ControlFamilies.length>0){
      top3ControlFamilies.push(
        <div>Top 3 control families that
        <br/>
        contribute to your compliance:
        <br/> 
        <ul className="list-unstyled">{listItems}</ul>
        </div>
      )
    }
    if (this.state.d1[0].values.length > 0) {
      let policyChart, groupsChart

      this.state.byPolicyPacks[0].values.map((val,key)=>{
        policyChart = <div lg={4}>
        <SeverityChart
          sort={"desc"}
          donut={"policyPack"}
          currentQuestion={8}
          style={style}
          data={this.state.byPolicyPacks[0]}
          selectedProfile={this.state.byPolicyPacks.label}
          width={280}
          />
        </div>
      })
      renderCharts.push(policyChart)

      this.state.byGroups[0].values.map((val,key)=>{        
          groupsChart = <div lg={4}>
          <SeverityChart 
            data={this.state.byGroups[0]}
            sort={"desc"}
            donut={'groups'}
            currentQuestion={8}
            width={280}
            style={style}
            selectedProfile={this.state.byGroups.label}/>
        </div>
      })
      renderCharts.push(groupsChart)

      renderCharts.push(<div lg={4} >
        <SeverityChart data={this.state.d1[0]}
          sort={"desc"}
          donut={"OS"}
          currentQuestion={8}
          width={280}
          selectedProfile={this.state.d1.label}/>
        </div>)
      
     
    }else {
      if (this.state.loadingDiv) {
        renderCharts.push(
        <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
          <SpinnyLogo />
        </div>)
      } else {
        renderCharts.push(
          <Row>
            <Col className={dashboardBar} style={{paddingTop: 20, marginLeft:40, marginRight:40}}>
              <div style={{paddingTop:'100', textAlign:"center", paddingBottom:'100'}}>
                  There is currently no data available for the specified time range or data filter
              </div>
            </Col>
          </Row>
        )
      }
    }
    let filterSelectStyle = {marginLeft: '10px'}
    var tableData = [], tableDataIndi,resourcesArray=[]
    this.state.responce.map((val, key)=>{
      if(key<=this.state.countValue){
      resourcesArray = val.resources;
      var idName
      if(key % 2 == 0){
        idName = 'odd'
      }else{
        idName = 'even'
      }
      let resourcesLink = 'JavaScript: void(0)'
      resourcesLink = '#failed-devices-list/'+resourcesArray
      let symbol = (<div className={diamond}></div>)
      if( val.severity === 'HIGH'){
        symbol = (<div className={diamond}></div>)
      } else if( val.severity === 'MEDIUM'){
        symbol = (<div className={triangleup}></div>)
      } else if( val.severity === 'LOW'){
        symbol = (<div className={sevcircle}></div>)
      }
      var divId='action'+key
      var lastTestUtc = '-'
      if(val.lasttestdate && val.lasttestdate !== null)
      {
        lastTestUtc = moment.utc(val.lasttestdate,"YYYY/MM/DD @ HH:mm TZD").format('MM/DD/YYYY @ HH:mm');
      }
      tableDataIndi = (
        <div key={key} className={idName}>
          <div className='row'>
            <div className='col-lg-3' style={{display:'flex', marginTop:5}}>
              {symbol}
              <div style={{margin:'-5px 0 0 8px'}}>{AttributeConstants.SEVERITY[val.severity]} severity</div>
            </div>
            <div className='col-lg-6'>Last test: {lastTestUtc}</div>
            <div className='col-lg-3'>
            <span style={{position:'relative'}}>
            <span style={{color:'#95c3ea', cursor:'pointer'}} onMouseOver={this.showActionToolTip.bind(this, divId)} onMouseOut={this.hideActionToolTip.bind(this, divId)}>
              <Select className="dropdownFilter"
                value={this.state.selectedAction}
                options={this.state.actionsOptions}
                searchable={true}
                disabled={true}
                multi={false}
                clearable={false}
                allowCreate={false}
                />
                </span>
                <div id={divId} className={toolTipStyle} style={{width:115, visibility:'hidden', backgroundColor:'#00C484 ', color:'#fff', textAlign:'center', position:'absolute', top:10, left:30, padding:'6px 4px', borderRadius:3, zIndex:99}}>Coming soon</div>
              </span>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-3'>
              <p><b>Improvement:</b></p>
              <CircularScoreGraph score={val.improvment} id={key}/>
              {/*<div id="Canvas" style={{width:100, height:100, borderRadius:'50%', border:'5px solid #4b56a6', textAlign: 'center'}}>
                <span style={{paddingTop:15, fontSize:42, display:'inline-block', color:'#4b56a6'}}>{val.improvment}</span>
              </div>*/}
            </div>
            <div className='col-lg-9'>
              <p><b>{val.title}</b></p>
              <div dangerouslySetInnerHTML={{__html: val.description}}>
              </div>
              <a href={resourcesLink} target='_blank' title='Open in a new Window'><div style={{color:'#4d59a4'}} data-value={resourcesArray} onClick={() => this.handleDeviceFailed(resourcesArray)}>{val.numresources} {val.numresources == 1 ? 'Device Failed': 'Devices Failed'} &nbsp; &#62;</div></a>
            </div>
          </div>
        </div>
      )
      tableData.push(tableDataIndi)
    }
    })

   	return(
   		<div className='top25Wrapper'>
        <Row style={{marginTop:'30px', display:'flex', justifyContent:'flex-end', marginRight:'20px'}}>
          <Col lg={1}>
          </Col>
         <Col lg={11} style={{display:'flex', justifyContent:'flex-end'}}>
          <span style={filterSelectStyle}>
              <Select className="dropdownFilter" placeholder={'Select OS'}
                name=""
                value={this.state.selectedOS}
                options={this.state.osReactSelect}
                searchable={true}
                multi={false}
                clearable={false}
                allowCreate={false}
                onChange={this.handleChangeOS.bind(this)}/>
          </span>
          <span style={filterSelectStyle}>
                <Select className="dropdownFilter" placeholder={'Select Group'}
                  name=""
                  value={this.state.selectedGroup}
                  options={this.state.groupsReactSelect}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handleChangeGroups.bind(this)}/>
          </span>
          <span style={filterSelectStyle}>
                <Select className="dropdownFilter" placeholder={'Select Policy Pack'}
                  name=""
                  value={this.state.selectedPolicyPack}
                  options={this.state.policyPacksReactSelect}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handlePolicyPackChange.bind(this)}/>
          </span>
          <span style={filterSelectStyle}>
                <Select className="dropdownFilter" placeholder={'Select Control Family'}
                  name=""
                  value={this.state.selectedControlFamily}
                  options={this.state.controlFamReactSelect}
                  disabled={this.state.selectedPolicyPack !==''&&this.state.controlFamReactSelect.length!==0?false : true}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handleControlFamilyChange.bind(this)}/>
          </span> 
        </Col>
        </Row>
        <div className='row' style={{marginRight:'30px'}}>
          <div className='col-lg-9' style={{display:'flex',justifyContent:'space-around'}}>
            <div style={{display:'flex' }}>{renderCharts}</div>
          </div>
          <div className='col-lg-3' style={{paddingTop:30, paddingLeft:15}}>
            {top3ControlFamilies}
          </div>
        </div>
        <div className='row headingDiv'>
          <div className='col-lg-4'>TOP 25 ISSUES</div>
        <div className='col-lg-4' style={{cursor:'pointer', color:'#4C58A4'}} onClick={this.handleClick.bind(this)}>{this.state.issueDisplayText}</div>
        </div>
        {this.state.loadingTable?<div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}><SpinnyLogo /></div>
   			:<div className='top25Wrapper' style={{minHeight:190}}> {this.state.responce.length == 0 ? <div style={{margin:'50px 0', textAlign:'center'}}>There is currently no data available for the specified data filter</div>  : tableData}</div>}
   		</div>
   	)
 }
}

export default Top25Issues
