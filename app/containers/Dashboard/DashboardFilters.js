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

export const DashboardFilters = React.createClass({
  getInitialState() {
    return{
      groups:[],
      discoveredOS:[],
      policyPacks:[],
      controlFamilies:[],
      policyPacksReactSelect:[],
      groupsReactSelect:[],
      osReactSelect:[],
      controlFamReactSelect:[],
      disableControlFamily:true,
      dataLoad:{},
      time:this.props.time,
      selectedPolicyPack:this.props.selectedPolicyPack,
      selectedGroup:this.props.selectedGroup,
      selectedControlFamily:this.props.selectedControlFamily,
      selectedOS:this.props.selectedOS,
      chartRange:[
        {label:"Day", value:"Daily"},
        {label:"Week", value:"Weekly"},
        {label:"Month", value:"Monthly"},
        {label:"Quarter", value:"Quarterly"},
        {label:"Year", value:"Yearly"},
      ],
    }
  },

  componentDidMount(){
    this.setState({
      dataLoad:this.props.dataLoad,
      // time:this.props.time,
      selectedPolicyPack:this.props.selectedPolicyPack,
      selectedGroup:this.props.selectedGroup,
      selectedControlFamily:this.props.selectedControlFamily,
      selectedOS:this.props.selectedOS
    });
    let osArrayVal = {label:'',value:''}, osArray=[]
    let groupArrayVal = {label:'',value:''}, groupArray=[]
    let policyArrayVal = {label:'',value:''}, policyArray=[]
    //+++++++++ Getting DiscoveredOS List for Select OS Dropdown ++++++++++++++++
    getDiscoveredOS()
    .then(
      (discoveredOS) => {
        this.setState({discoveredOS:discoveredOS.ostypes}, function(){
          if(discoveredOS != null && discoveredOS.ostypes != null && discoveredOS.ostypes.length>0)
          {
            osArrayVal = {label:'Select OS',value:'', title:''}
            osArray.push(osArrayVal)
          }
          this.state.discoveredOS.map((val,key)=>{
          osArrayVal = {label:'',value:'', title:''}
          osArrayVal.label= val
          osArrayVal.value = val
          osArrayVal.title = val
          osArray.push(osArrayVal)
        })
        this.setState({osReactSelect:osArray})
        })
      }
    )
    .catch((discoveredOSListerror)=>console.log("Error in fetching the discoveredOS in container"+discoveredOSListerror))

    //++++++++++ Getting AssetGroups List for Select Group Dropdown ++++++++++++++
    getCompletedScanGroups()
    .then(
      (groups) =>  {
        this.setState({groups:groups},function(){
          if(groups != null && groups.length>0)
          {
            groupArrayVal = {label:'Select Group',value:'', title:''}
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

     //++++++++++ Getting PolicyPacks List for Select policypack Dropdown ++++++++++++++
    getAppliedPolicies('true')
    .then((rootPolicies) => {
      this.setState({policyPacks: rootPolicies},function(){
        if(rootPolicies != null && rootPolicies.length>0)
        {
          policyArrayVal = {label:'Select Policy Pack',value:'', title:''}
          policyArray.push(policyArrayVal)
        }
        this.state.policyPacks.map((val,key)=>{
          if(val.assettype!='IMAGE' && val.assettype!='image'){
            policyArrayVal = {label:'',value:''}
            policyArrayVal.label= val.title
            policyArrayVal.title = val.title,
            policyArrayVal.value = val.path.slice(5),
            policyArray.push(policyArrayVal)
          }
        })
        this.setState({policyPacksReactSelect:policyArray})
      });
    })
    .catch((error) => console.log("Error in getting the root policies list:"+JSON.stringify(error)))

    //+++++++++ Getting ControlFamilies dropdown based on policypack selected +++++++++++
    if(this.props.selectedPolicyPack!=''){
      getControlFamilyList(this.props.selectedPolicyPack)
      .then((policyPacks) => {
	      this.setState({controlFamilies:policyPacks},function(){
	      	console.log("controlFamilies in DashboardFilters "+this.state.controlFamilies)
	      });
	    })
	    .catch((error) => console.log("Error in getting the root policies list:"+JSON.stringify(error)))
	   }
  },

  componentWillReceiveProps(nextProps,nextState){
    this.setState({
      dataLoad:nextProps.dataLoad,
      time:nextProps.time,
      selectedPolicyPack:nextProps.selectedPolicyPack,
      selectedGroup:nextProps.selectedGroup,
      selectedControlFamily:nextProps.selectedControlFamily,
      selectedOS:nextProps.selectedOS

    });

    let controlFamArrayVal = {label:'',value:''}, controlFamArray=[]
  //+++++++++ Getting ControlFamilies dropdown based on policypack selected +++++++++++
    if(nextProps.selectedPolicyPack !== this.props.selectedPolicyPack){
      this.setState({controlFamReactSelect:[]})
      if(nextProps.selectedPolicyPack!=''){
  	    getControlFamilyList(nextProps.selectedPolicyPack)
  	    .then((policyPack) => {
  	    	this.setState({controlFamilies: policyPack},function(){


            console.log('controlFamilies controlFamilies', this.state.controlFamilies)
            if(this.state.controlFamilies != ''){
              controlFamArrayVal = {label:'Select Control Family',value:'', title:''}
              controlFamArray.push(controlFamArrayVal)
              this.state.controlFamilies.map((val,key)=>{
                controlFamArrayVal = {label:'',value:'', title:''}
                controlFamArrayVal.label= val
                controlFamArrayVal.value = val
                controlFamArrayVal.title = val
                controlFamArray.push(controlFamArrayVal)
              })
              this.setState({disableControlFamily:false, controlFamReactSelect:controlFamArray})
            }
  	      });
  	    })
  	    .catch((error) => console.log("Error in getting the root policies list:"+JSON.stringify(error)))
      }else{
         //+++++ Disabling controlFamily and setting it back to initial state
         this.setState({disableControlFamily:true})
      }
   }
  },

  render: function () {
    let selectStyle = {marginLeft: '10px'}
    let buffer = {paddingLeft: 40, paddingTop:15, paddingBottom:15}
    return (
      <div>
        <Row className="col-lg-12 col-md-12 col-sm-12" style={{margin:'20px 0 20px 10px'}}>
          <Col lg={1} sm={1} style={{zIndex:"30"}}>
            {/*<span>Zoom: </span>*/}
            <span>
              <Select className="dropdownTimeZone"
                name=""
                value={this.state.time}
                options={this.state.chartRange}
                searchable={true}
                multi={false}
                clearable={false}
                allowCreate={false}
                onChange={this.props.handleChangeTime}/>

              {/*<select className={dropdown} value={this.state.time} onChange={this.props.handleChangeTime}>
                  <option value='Daily'>Day</option>
                  <option selected="selected" value='Weekly'>Week</option>
                  <option value='Monthly'>Month</option>
                  <option value='Quarterly'>Quarter</option>
                  <option value='Yearly'>Year</option>
                </select>*/}
              </span>
          </Col>
          <Col lg={11} sm={11} style={{display:'flex', justifyContent:'flex-end',paddingRight:30}}>
            <span style={selectStyle}>
              <Select className="dropdownFilter" placeholder={'Select OS'}
                name=""
                value={this.state.selectedOS}
                options={this.state.osReactSelect}
                searchable={true}
                multi={false}
                clearable={false}
                allowCreate={false}
                onChange={this.props.handleChangeOS}/>
            </span>
            {/*<span style={selectStyle}>
              <select id="discoveredOS" className={dropdown} value={this.state.selectedOS} onChange={this.props.handleChangeOS}>
                  <option value=''>Select OS</option>
                    {this.state.discoveredOS.map((osList) => {
                      if(osList!=null){
                        let name = osList;
                          if (osList.length > 15) {
                            name = osList.slice(0, 15) + "...";
                          }
                        return (<option key={osList} title={osList} value={osList}>{name}</option>)
                      }}
                    )}
              </select>
            </span>*/}
              <span style={selectStyle}>
                <Select className="dropdownFilter" placeholder={'Select Group'}
                  name=""
                  value={this.state.selectedGroup}
                  options={this.state.groupsReactSelect}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.props.handleGroupChange}/>
              </span>
              {/*<span  style={selectStyle}>
                <select id="group" className={dropdown} value={this.state.selectedGroup} onChange={this.props.handleGroupChange}>
                  <option value=''>Select Group</option>
                   {this.state.groups.map((option) => {
                     let name = option.name;
                     if (option.name.length > 10) {
                       name = option.name.slice(0, 10) + "...";
                     }
                    return (<option key={option.id} title={option.name} value={option.name}>{name}</option>)
                    }
                  )}
                </select>
              </span>*/}
              <span style={selectStyle}>
                <Select className="dropdownFilter" placeholder={'Select Policy Pack'}
                  name=""
                  value={this.state.selectedPolicyPack}
                  options={this.state.policyPacksReactSelect}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.props.handlePolicyPackChange}/>
              </span>
                {/*
              <span style={selectStyle}>
                <select className={dropdown} id="policyPack" value={this.state.selectedPolicyPack} onChange={this.props.handlePolicyPackChange}>
                  <option value="">Select Policy pack</option>
                   {  this.state.policyPacks.map((option) => {
                    if(option.assettype!="IMAGE"){
                      let val = option.path.substring(5,option.length)
                      let title = option.title;
                      if (option.title.length > 20) {
                        title = option.title.slice(0, 20) + "...";
                      }
                      return(<option key={option.path} title={option.title} value={val}>{title}</option>)
                    }}
                    )}
                </select>
              </span>
              */}
              <span style={selectStyle}>
                <Select className="dropdownFilter" placeholder={'Select Control Family'}
                  name=""
                  value={this.state.selectedControlFamily}
                  options={this.state.controlFamReactSelect}
                  searchable={true}
                  disabled={this.state.selectedPolicyPack !==''&&this.state.controlFamReactSelect.length!==0?false : true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.props.handleControlFamilyChange}/>
              </span>

              {/*<span style={selectStyle}>
                <select className={dropdown} id="controlFamily"
                  value={this.state.selectedControlFamily}
                  style={{backgroundColor:this.state.disableControlFamily==true?'#eee':'#fff'}}
                  disabled={this.state.disableControlFamily}
                  onChange={this.props.handleControlFamilyChange}>
                  <option value=''>Select Control family</option>
                      { this.state.controlFamilies.map((option) => {
                        let controlidVal = option
                        if (option.length > 20) {
                          controlidVal = option.slice(0, 20) + "...";
                        }
                        return(<option key={option} title={option} value={option}>{controlidVal}</option>)}
                      )}
                </select>
              </span>*/}
          </Col>
        </Row>
      </div>
    )
  }
})
