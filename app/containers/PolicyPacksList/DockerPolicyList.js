import React, { Component, PropTypes } from 'react'
import {InputGroup,FormControl,Row,FormGroup,Glyphicon,Col,ControlLabel,Popover,OverlayTrigger} from 'react-bootstrap'
import {mytablepol,verticalLine,infoCircle} from './styles.css'
import {getPolicyDetails,getOSList,getRuleCount} from 'helpers/policies'
import loadingImage from 'assets/Loading_icon.gif'
import {TreeNode} from './TreeNode'
import {PolicyPacksProfiles} from './PolicyPacksProfiles'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import {selectStyle} from 'sharedStyles/styles.css'

function findElement(arr, propName, propValue) {
  let obj  = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      obj = arr[i];
  return obj
}

const DockerPolicyPacksList = React.createClass ({

  getInitialState(){
    return{
      dummyPolicyPacks:[
        {"path":"root.HIPAA","family":"HIPAA","controlid":"HIPAA-PP","title":"HIPAA Policy Pack","priority":"NA","impacts":"NA","description":"Version 1.0, 11/12/2016","supplimental":"NA","additionalProperties":{}},
        {"path":"root.PCI","family":"PCI","controlid":"PCIDSS","title":"PCI DSS 3.2 Policy Pack","priority":"NA","impacts":"NA","description":"Version 1.0, 11/12/2016","supplimental":"NA","additionalProperties":{}},
        {"path":"root.SOC2","family":"SOC2","controlid":"SOC2-PP","title":"SOC2 Policy Pack","priority":"NA","impacts":"NA","description":"Version 1.0, 11/12/2016","supplimental":"NA","additionalProperties":{}},
        {"path":"root.DISA","family":"DISA","controlid":"DISA-PP","title":"DISA Policy Pack","priority":"NA","impacts":"NA","description":"Version 1.0, 11/12/2016","supplimental":"NA","additionalProperties":{}},
        {"path":"root.ISO","family":"ISO","controlid":"ISO-27002","title":"ISO 27002 Policy Pack","priority":"NA","impacts":"NA","description":"Version 1.0, 11/12/2016","supplimental":"NA","additionalProperties":{}},
      ],
      visible: true,
      policiesList:[],
      selectedList: [],
      showTree:false,
      isFetching:false,
      rootNode: {},
      benchmarksList:[],
      selectedBenchmark:{},
      osSelected:"ALL",
      osOptions:[
        { value: "ALL", label: "All OS" }
      ],
      displayLearnMore:true,
      popoverHeight:'250px',
      selectedProfilesList:[],
      ruleCount:'',
      rootNode: {}
    }
  },

  componentDidMount(){
    this.setState({isFetching:true});
    getPolicyDetails("root")
    .then((rootPolicies) => {
      this.setState({policiesList: rootPolicies},function(){
        //++++++ For showing treeNode of the selected policyPack +++++++++++++
        if(this.props.selectedPolicies!=null || this.props.selectedPolicies!=''){
         let policyPack = findElement(this.state.policiesList,"path",this.props.selectedPolicies[this.props.selectedPolicies.length-1])
         this.policyPackTreeHandler(policyPack.title, policyPack.path)
        }
      });
      this.setState({isFetching:false});
    })
    .catch((error) => console.log("Error in getting the root policies list:"+JSON.stringify(error)))
  },

  componentWillReceiveProps(nextProps,nextState){
    if (nextProps.selectedPolicies != this.props.selectedPolicies)
      this.setState({selectedList:nextProps.selectedPolicies});
  },

  toggle(){
    this.setState({visible: !this.state.visible});
  },

  updateOSList(policyPack){
    getOSList(policyPack.path)
    .then((osList) => {
       this.setState({benchmarksList:osList})
       let newOsOptions = [{ value: "ALL", label: "All OS" }]
       osList.map((osObj) => {
          let osOpt = {};
          osOpt.value = osObj.name;
          osOpt.label = osObj.platforms;
          newOsOptions.push(osOpt);
       })
       this.setState({osOptions: newOsOptions});
       this.setState({osSelected:"ALL",
                      selectedBenchmark:this.state.benchmarksList[0]});
     })
    .catch((error) => {console.log("Error in getting OSList:"+JSON.stringify(error))})

  },

  setPolicyProfiles(list){
    this.setState({selectedProfilesList:list},function(){
      //++++++++ call API to fetch policies count ++++++++++++++++++
      getRuleCount(null,this.state.rootNode.path,this.state.osSelected,this.state.selectedProfilesList)
      .then((ruleCount) => {
        this.setState({ruleCount: ruleCount});
      })
      .catch((error) => console.log("Error in getting the rule count:"+JSON.stringify(error)))
      })
  },

  handleSelections(e){
    let chkVal = e.target.id;
    let title = e.target.name;
    let policyPack = findElement(this.state.policiesList,"path",chkVal)
    const index = this.state.selectedList.indexOf(chkVal)
    let newList = this.state.selectedList.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({selectedList: newList})

    if(e.target.checked === true){  
      this.state.policiesList.map(function(policyPack){
      if(e.target.name != policyPack.title){
        document.getElementById(policyPack.title).style.outline=''
      }})
      document.getElementById(title).style.outline='2px solid #00C484';
      this.setState({rootNode:policyPack,
        osSelected:"ALL",
        selectedProfilesList:[]},function(){
          //++++++++++++ call API to fetch policies count ++++++++++++++++++
       getRuleCount(null,this.state.rootNode.path,this.state.osSelected,this.state.selectedProfilesList)
      .then((ruleCount) => {
         this.setState({ruleCount: ruleCount});
      })
      .catch((error) => console.log("Error in getting the rule count:"+JSON.stringify(error)))
      });

      this.updateOSList(policyPack);
    }else{
     /*
      if(e.target.id === this.state.rootNode.path){
        this.setState({rootNode:{}});
      }*/
    }
    if(newList.length > 0){
      this.setState({showTree:true,
        visible:true});
    }else{
      this.setState({showTree:false});
      this.state.policiesList.map(function(policyPack){
        document.getElementById(policyPack.title).style.outline=''
      })
      this.setState({osOptions: []});
    }
    this.props.showPoliciesChecked(newList);
  },

  //++++++ BrowsingPolicyPack without selecting PolicyPack ++++++++++
  policyPackTreeHandler(policyPackTitle, policypackPath){
    this.state.policiesList.map(function(policyPack){
      if(policyPackTitle!= policyPack.title){
        document.getElementById(policyPack.title).style.outline=''
      }
    })
    let chkVal = policypackPath;
    let policyPack = findElement(this.state.policiesList,"path",chkVal)
    let title = policyPackTitle;
    document.getElementById(policyPackTitle).style.outline='2px solid #00C484';
    this.setState({rootNode:policyPack,
                  osSelected:"ALL",
                  selectedProfilesList:[],
                  showTree:true,
                  visible:true},function(){
                    //++++++++++++ call API to fetch policies count ++++++++++++++++++
       getRuleCount(null,this.state.rootNode.path,this.state.osSelected,this.state.selectedProfilesList)
      .then((ruleCount) => {
         this.setState({ruleCount: ruleCount});
      })
      .catch((error) => console.log("Error in getting the rule count:"+JSON.stringify(error)))
      });

    this.updateOSList(policyPack);
  },

  infoHandler(){
    this.setState({displayLearnMore:false,
      popoverHeight:'500px'})
  },

   exitedFunc(){
    this.setState({displayLearnMore:true,
      popoverHeight:'250px'})
  },

  handleOS(osSelected){
       this.setState({osSelected:osSelected,
        selectedBenchmark:findElement(this.state.benchmarksList,"name",osSelected)},function(){
        //++++++++ call API to fetch policies count ++++++++++++++++++
        getRuleCount(null,this.state.rootNode.path,this.state.osSelected,this.state.selectedProfilesList)
        .then((ruleCount) => {
          this.setState({ruleCount: ruleCount});
        })
        .catch((error) => console.log("Error in getting the rule count:"+JSON.stringify(error)))
        });
  },

  render() {
    let style;
    let expandCollapseIcon = "menu-right";
    let iconStyle = {fontSize:'10px'};
    if (!this.state.visible) {
      style = {display: "none"};
    }else{
      expandCollapseIcon = "menu-down";
      iconStyle = {fontSize:'10px',color:'#00C484'};
    }
    let expandIcon = "";
      expandIcon =  <span style={{paddingRight:'20px'}}><Glyphicon style={iconStyle} glyph={expandCollapseIcon}/></span> 

    let policiesListData = this.state.policiesList;
    let standingLineStyle = {fontSize: 25,opacity:0.7,borderWidth:'2px', height: 85,paddingTop:2,paddingBottom: 3,paddingLeft: 0,paddingRight:0}
    let containerStyle={paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%',fontFamily: 'Source Sans Pro'}
    let seperatorDivStyle=this.state.showTree ?{width:'17px',height: '1650px',marginLeft:'20px',background:'linear-gradient(to left, #F9FAFC, #b4bcca)',
                          position:'absolute','right':'-19px',zIndex:99,'top':'50px','opacity':'0.4'}: {display:'none'}
    let emptyDivStyle = this.state.showTree ? {display:'none'} : {  display:'block',height:'1300px'}
    let detailsDivStyle = this.state.showTree ? {height:'1750px',paddingLeft:'-15px',paddingRight:'-15px',borderRight:'20px solid #FFFFFF',borderTop:'1px solid #E5EAF4',display:'block',backgroundColor:'#f9fafc', marginBottom:2} : {display:'none'}
    let tableStyle = this.state.showTree ? {borderLeft: '20px solid white',padding:'1px 15px 0 2px',backgroundColor:'white', height:'1650px'} : { borderLeft: '20px solid white',borderRight: '20px solid #FFFFFF' }
  
      const tooltipUnsupportedMsg = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:300,height:60,marginLeft:-50,marginTop:-20}}>Coming soon..</Popover>
    );
    return(
      <div style={{fontSize:'15px',marginLeft:'50px',marginRight:'60px'}}>
        <Row style={{margin:'0px'}}>
          {this.state.showTree ? '' : <Col lg={3}></Col>}
          <Col lg={9} style={{marginLeft:'0px'}}>
            <FormGroup controlId="search" className="search">
            <InputGroup style={{marginRight:"60px", marginTop:"30px"}}>
              <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
              <FormControl type="text" placeholder="Search for reports, policy packs, control families, controls or groups"  />
            </InputGroup>
            </FormGroup>
          </Col>
          {this.state.showTree ?

            <Col lg={3} style={{ position: 'absolute', width:'300px',marginTop:"30px", right:'102px'}}>
              <FormGroup controlId="osSelect">
                <Select id="osSelect"  placeholder={<i>Select OS</i>}
                  name=""
                  value={this.state.osSelected}
                  options={this.state.osOptions}
                  clearable={true}
                  searchable={true}
                  onChange={this.handleOS}/>
              </FormGroup>

          </Col> : ""
          }
      </Row>

      
  <div style={{marginTop:'10px',height: '1050px'}}>
        <div className="col-lg-3 col-xs-3 col-sm-3 col-md-3" id="emptyDiv" style={emptyDivStyle}></div>
        <div className="col-lg-5 col-xs-5 col-sm-5 col-md-5" id="policyPacksList" style={{paddingRight:'0px',minHeight:'1750px'}}>
          <div style={{height:'50px',borderTop:'1px solid #E5EAF4',backgroundColor:'#FFFFFF',paddingLeft:'25px',paddingTop:'10px'}}>
            POLICY PACKS
          </div>
          <div style={tableStyle}>
            <table className={mytablepol}>
              <tbody>
                {
                  this.state.policiesList.map(function(policyPack){
                    let imgSrc; 
                    if(policyPack.path !== null){
                      imgSrc = require('assets/'+policyPack.path.slice(5)+'.png');
                    }
                    let countsHTML = "";
                    if(policyPack.ruleCount !== null && policyPack.ruleCount > 0){
                      countsHTML = <span style={{fontWeight:'bold'}}>{policyPack.ruleCount} policies</span>
                    }
                    let heightProp=policyPack.description.length-180;
                    const tooltipPolicyPackdescription = (

                      <Popover style={{wordWrap: "break-word"}}>
                      <div style={{height:heightProp}}>
                        <div dangerouslySetInnerHTML={{__html: policyPack.description}}>
                        </div>
                          <a href='javascript:void(0)' style={{float:'right',marginTop:'10px'}}
                            onClick={this.infoHandler.bind(this)}>
                              Learn More
                          </a>
                        </div>
                      </Popover>


                    );
                    const tooltipPolicyPackSuppliment = (
                    <Popover style={{wordWrap: "break-word"}}>
                      <div style={{overflow:'auto', height:this.state.popoverHeight}}>
                        <div dangerouslySetInnerHTML={{__html: policyPack.description}}>
                        </div>
                         <div style={{marginTop:'10px'}} dangerouslySetInnerHTML={{__html: policyPack.supplimental}}>
                          </div>
                        </div>
                    </Popover>);
                    let disableCheckBox=false;
                    let op={opacity:1}
                    if(this.props.pageType!=null&&this.props.pageType=="dockerImage"){
                      if(policyPack.path.indexOf("Image_")==-1){
                          disableCheckBox=true;
                          op={opacity:0.5}
                      }
                    }
                    return (
                      <tr id={policyPack.title} key={policyPack.title} style={op}>
                        <td style={{paddingRight: 0,paddingLeft: 10,marginRight: 0,marginLeft:0,width:'35%'}}>
                         <input type='checkbox' id={policyPack.path} name={policyPack.title} onChange={this.handleSelections}
                          checked={(this.state.selectedList.indexOf(policyPack.path) != -1)?true:false} disabled={disableCheckBox}/>
                         <label htmlFor={policyPack.path} ></label>
                         <label >&nbsp;&nbsp;<img style={{valign: 'top'}} src={imgSrc}/></label>
                        </td>
                        <td style={{paddingRight: 10,paddingLeft: 0,marginRight: 0,marginLeft:0}}>
                        <label className={verticalLine} style={standingLineStyle}></label>
                        </td>
                        <br/>
                        <td style={{paddingTop:25,paddingBottom:25,paddingLeft:0}}>
                          <a href='javascript:void(0)'
                            onClick={this.policyPackTreeHandler.bind(this,policyPack.title,policyPack.path)}>
                              {policyPack.title}
                          </a>
                           <OverlayTrigger ref="infoPopup" placement="right" trigger="click" rootClose onExited={this.exitedFunc} overlay={this.state.displayLearnMore?tooltipPolicyPackdescription:tooltipPolicyPackSuppliment}>
                            <ControlLabel className={infoCircle} style={{color:'#4C58A4',fontWeight: '700',float:'right'}} >
                              <i style={{paddingRight:'0.25em'}}>i</i>
                            </ControlLabel>
                          </OverlayTrigger>
                          <br/>
                          {policyPack.versionInfo}
                          <br/>
                          {countsHTML}
                        </td>
                      </tr>
                    );
                  }.bind(this))
                }
                {
                  this.state.dummyPolicyPacks.map(function(policyPack){
                    let imgSrc;
                    if(policyPack.controlid !== null){
                      imgSrc = require('assets/'+policyPack.controlid+'.png');
                    }
                    return (
                      <tr key={policyPack.title}>
                      <OverlayTrigger ref="unsupportedMsg" placement="right" trigger="click" rootClose onExited={this.exitedFunc} overlay={tooltipUnsupportedMsg}>
                        <td style={{paddingRight: 0,paddingLeft: 10,marginRight: 0,marginLeft:0,width:'35%'}}>
                         <input type='checkbox' id={policyPack.path} name={policyPack.title} disabled={true}/>
                         <label htmlFor={policyPack.path} ></label>
                         <label >&nbsp;&nbsp;<img style={{valign: 'top'}} src={imgSrc}/></label>
                        </td>
                      </OverlayTrigger>
                        <td style={{paddingRight: 10,paddingLeft: 0,marginRight: 0,marginLeft:0}}>
                        <label className={verticalLine} style={standingLineStyle}></label>
                        </td>
                        <br/>
                        <td style={{paddingTop:25,paddingBottom:25,paddingLeft:0}}>
                          {policyPack.title}
                          <br/>
                          {policyPack.description}
                        </td>
                      </tr>
                      
                    );
                  }.bind(this))
                }
              </tbody>
            </table>
        <div className="seperator" style={seperatorDivStyle}></div>
          </div>
        </div>
        <div className="col-lg-7 col-xs-7 col-sm-7 col-md-7" id="detailsDiv"  style={detailsDivStyle}>
        <div style={{backgroundColor:'#FFFFFF',marginLeft:'-20px',marginRight:'-20px'}}>
           <div id="policyPackTitle" style={{height:'50px',paddingLeft:'25px',paddingTop:'10px'}}>
            {this.state.showTree ? this.state.rootNode.title : ''}
           </div>
        </div>
        <div style={{maxHeight:1250, overflowY:'auto', overflowX:'hidden'}}>
           {<PolicyPacksProfiles setPolicyProfiles={this.setPolicyProfiles} benchmark={this.state.selectedBenchmark}/>}
          {this.state.showTree ?
            <div style={{margin:'10px 0px 10px 0px'}}>
              <h5 onClick={this.toggle} style={{marginLeft:'30px',fontSize:'15px'}}>
                <Row>
                  <Col xl={11} md={10} sm={9} style={{fontSize:'15px',fontWeight:'bold'}}>
                   {this.state.ruleCount} Policies
                  </Col>
                  <Col xl={1} md={2} sm={3} style={{textAlign: 'right'}}>
                    {expandIcon}
                  </Col>
                </Row>
              </h5>
              {this.state.visible?
                <TreeNode policyPackPath={this.state.rootNode.path} osSelected={this.state.osSelected} profiles={this.state.selectedProfilesList} node={this.state.rootNode} root="YES" marginPx={0} />
              :null}
          </div>
        : null}
        </div>
        </div>
      </div>
    </div>
    )
    }
})

export  {DockerPolicyPacksList}
