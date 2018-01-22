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
import {SpinnyLogo} from 'containers'
import {findElement} from 'javascripts/util.js'

function getNodeIndexFromSelectedList(selectedSet,selectedPolicyPath){
  let indx  = -1;
  for (var i=0; i < selectedSet.length; i++)
    if (selectedSet[i]["policyPackName"] === selectedPolicyPath)
      indx = i;
  return indx
}

const PolicyPacksList = React.createClass ({

  getInitialState(){
    return{
      visible: true,
      loadingDiv:true,
      showTree:false,
      isFetching:false,
      displayLearnMore:true,
      popoverHeight:'250px',
      osSelected:"ALL",
      osOptions:[
        { value: "ALL", label: "All OS" }
      ],

      selectedSet:[],
      policiesList:[],
      selectedList: [],
      benchmarksList:[],
      selectedBenchmark: {},
      selectedProfilesList: [],

      ruleCount: '',
      rootNode: {},
      selectedVariableList: [],
      globalVariableList: [],
    
    }
  },

  propTypes: {
    originPage: PropTypes.string,
    isEditable: PropTypes.bool,
    type: PropTypes.string,
    saveSelectedSet: PropTypes.func,
  },

  getDefaultProps(){
    return{
      originPage: 'policyPacks',
    }
  },

  componentDidMount(){
   // this.setState({isFetching:true});
    getPolicyDetails("root")
    .then((rootPolicies) => {
      this.setState({policiesList: rootPolicies},function(){
                   this.setState({loadingDiv:false},function(){
        //++++++ For showing treeNode of the selected policyPack +++++++++++++

        if(this.props.selectedSet!=null && this.props.selectedSet.length>0){
         let policyPack = findElement(this.state.policiesList,"path",this.props.selectedSet[this.props.selectedSet.length-1].policyPackName)
         this.policyPackTreeHandler(policyPack.title, policyPack.path)
        }
      });
      });
      //this.setState({isFetching:false});
    })
    .catch((error) => console.log("Error in getting the root policies list:"+JSON.stringify(error)))
  },

  componentWillReceiveProps(nextProps,nextState){

    if (nextProps.selectedSet != this.props.selectedSet){
      this.setState({selectedSet:nextProps.selectedSet})
      let selectedPolicyPackNames = [];
      nextProps.selectedSet.map((node) => {
        selectedPolicyPackNames.push(node["policyPackName"])
      })

      this.setState({selectedList:selectedPolicyPackNames});
    }
   
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
          //osOpt.value = osObj.name;
          osOpt.value = osObj.platforms.join(',');
          osOpt.label = osObj.platforms.join(',');
          newOsOptions.push(osOpt);
       })
       this.setState({osOptions: newOsOptions});
       this.setState({osSelected:"ALL",
                      selectedBenchmark:this.state.benchmarksList[0]});
     })
    .catch((error) => {console.log("Error in getting OSList:"+JSON.stringify(error))})

  },

  setPolicyProfiles(list){
    let selectedNodeIndx = getNodeIndexFromSelectedList(this.state.selectedSet,this.state.rootNode.path)
    let newSelectedSet = this.state.selectedSet.slice();
    if(selectedNodeIndx > -1){
      newSelectedSet[selectedNodeIndx]["profileSet"] = list;
      this.setState({selectedSet: newSelectedSet});
      this.props.saveSelectedSet(newSelectedSet);
    }
    this.setState({selectedProfilesList:list},function(){
      //++++++++ call API to fetch policies count ++++++++++++++++++
      getRuleCount(null,this.state.rootNode.path,this.state.osSelected,this.state.selectedProfilesList)
      .then((ruleCount) => {
        this.setState({ruleCount: ruleCount});
      })
      .catch((error) => console.log("Error in getting the rule count:"+JSON.stringify(error)))
      })
  },
  SettingVariables(list){

    let selectedNodeIndx = getNodeIndexFromSelectedList(this.state.selectedSet,this.state.rootNode.path)
    let newSelectedSet = this.state.selectedSet.slice();
    if(selectedNodeIndx > -1){
      
      newSelectedSet[selectedNodeIndx]["artifacts"].map((a,b)=>{
        list.map((x,y)=>{
          if(a.artifact_name==x.artifact_name){
            newSelectedSet[selectedNodeIndx]["artifacts"][b] = list[y];
          }
        })
      })
      
      this.setState({selectedSet: newSelectedSet});
      this.props.saveSelectedSet(newSelectedSet);

      let listVariable=this.state.selectedVariableList.slice();

      this.state.selectedVariableList.map((a,b)=>{
        list.map((x,y)=>{
          if(a.artifact_name==x.artifact_name){
            listVariable[b] = list[y];
            this.setState({selectedVariableList:listVariable});
          }
        })
      })
    }
  },

  handleSelections(e){
    if(this.props.originPage === 'scanGroups')
    {  
      document.getElementById("scanGroups").scrollTop = 0 
    }
    else
    {
      window.scrollTo(0, 0)
    }
    let chkVal = e.target.id;
    let title = e.target.name;
    let policyPack = findElement(this.state.policiesList,"path",chkVal)
    const index = this.state.selectedList.indexOf(chkVal)
    let newList = this.state.selectedList.slice();
    let newSelectedSet = this.state.selectedSet.slice();

    let newNode ={}
    if (index === -1)
    {
      newNode["policyPackName"] = chkVal;
      newNode["profileSet"] = [];
      newNode["artifacts"]=policyPack.artifacts;
      newSelectedSet = newSelectedSet.concat(newNode);
      newList = newList.concat(chkVal)
    } else {
      newSelectedSet.splice(index,1);
      newList.splice(index,1);
      //this.setState({selectedVariableList:[],globalVariableList:[]})
    }
    this.setState({selectedSet: newSelectedSet})
    this.setState({selectedList: newList})

  

    if(e.target.checked === true)
    {
      var target = document.getElementById(e.target.name);
      var tbl = document.getElementById("policyPacksTable");
      var rows = tbl.rows;
      var tbody = tbl.children[0];
      tbody.insertBefore(target,rows[0]);
     
      this.state.policiesList.map(function(policyPack){
      if(e.target.name != policyPack.title){
        document.getElementById(policyPack.title).style.outline=''
      }})
      //to make the new list without object reference and assign to globalVariableList so that we can use in refresh articfacts
      let newList=[];
      policyPack.artifacts.map((atrifactdata)=>{
        newList.push(Object.assign({}, atrifactdata))
      })
  
      document.getElementById(title).style.outline='2px solid #00C484';
      this.setState({rootNode:policyPack,
        osSelected:"ALL",
        selectedProfilesList:[],
        selectedVariableList:policyPack.artifacts,
        globalVariableList:newList},function(){
         
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
      this.setState({showTree:true,visible:true});
    }else{
      this.setState({showTree:false});
      this.state.policiesList.map(function(policyPack){
        document.getElementById(policyPack.title).style.outline=''
      })
      this.setState({osOptions: []});
    }
    //this.props.showPoliciesChecked(newList);
    this.props.saveSelectedSet(newSelectedSet);


  },
  // ++++++ BrowsingPolicyPack without selecting PolicyPack ++++++++++
  policyPackTreeHandler(policyPackTitle, policypackPath){
    if(this.props.originPage === 'scanGroups')
    {  
      document.getElementById("scanGroups").scrollTop = 0 
    }
    else
    {
      window.scrollTo(0, 0)
    }
    var target = document.getElementById(policyPackTitle);
    var tbl = document.getElementById('policyPacksTable');
    var rows = tbl.rows;
    var tbody = tbl.children[0];
    tbody.insertBefore(target,rows[0]); 
    this.state.policiesList.map(function(policyPack){
      if(policyPackTitle!= policyPack.title){
        document.getElementById(policyPack.title).style.outline=''
      }
    })
    let chkVal = policypackPath;
    let policyPack = findElement(this.state.policiesList,"path",chkVal)
    //if policy pack exists in selectedSet set the selecedProfilesList
    let selectedProfilesList =[];
    let artifacts=[];
    let selectedNodeIndx = getNodeIndexFromSelectedList(this.state.selectedSet,policypackPath)
    if(selectedNodeIndx > -1){
      selectedProfilesList = this.state.selectedSet[selectedNodeIndx].profileSet
      artifacts = this.state.selectedSet[selectedNodeIndx].artifacts
    }
    let newList=[];
      policyPack.artifacts.map((atrifactdata)=>{
        newList.push(Object.assign({}, atrifactdata))
      })


    let title = policyPackTitle;
    document.getElementById(policyPackTitle).style.outline='2px solid #00C484';
    this.setState({rootNode:policyPack,
                  osSelected:"ALL",
                  selectedProfilesList:selectedProfilesList,
                  selectedVariableList:artifacts,
                  globalVariableList:newList,
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

  infoHandler(count,e){
    
    if(count<70)
    {
       document.querySelector('.arrow').style = 'top: 39%'
    }
    else if(count>100)
    {
       document.querySelector('.arrow').style = 'top: 29%'
    }
    else
    {
       document.querySelector('.arrow').style = 'top: 25%'
    }
   
    this.setState({displayLearnMore:false,
      popoverHeight:'500px'})
  },

  exitedFunc(){
    this.setState({displayLearnMore:true,
      popoverHeight:'250px'})
  },

  handleOS(osSelected){
    this.setState({osSelected:osSelected,
    selectedBenchmark:findElement(this.state.benchmarksList,"platforms",osSelected)},function(){
    //++++++++ call API to fetch policies count ++++++++++++++++++
    getRuleCount(null,this.state.rootNode.path,this.state.osSelected,this.state.selectedProfilesList)
    .then((ruleCount) => {
      this.setState({ruleCount: ruleCount});
    })
    .catch((error) => console.log("Error in getting the rule count:"+JSON.stringify(error)))
    });
  },
 Positioning(e){
  
    this.setState({displayLearnMore:true,topPos:e.clientY})
  
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

    let activePoliciesHeight = policiesListData.length;
    //let dummyPoliciesHeight = this.state.dummyPolicyPacks.length;
    //let leftColumnHeight = activePoliciesHeight*125 + dummyPoliciesHeight*125 + 20
    let leftColumnHeight = activePoliciesHeight*126 + 20
    // let leftColumnHeight = (activePoliciesHeight*64 + 635) + (dummyPoliciesHeight*64 + 305)
    /*if(this.state.showTree){
      leftColumnHeight = activePoliciesHeight*80 + dummyPoliciesHeight*80 + 710;
    }else{
      leftColumnHeight = activePoliciesHeight*80 + dummyPoliciesHeight*80 + 710;
    }*/
    
    let rightColumnHeight = leftColumnHeight+45;
    

    let standingLineStyle = {fontSize: 25,opacity:0.7,borderWidth:'2px', height: 85,paddingTop:2,paddingBottom: 3,paddingLeft: 0,paddingRight:0}
    let containerStyle={paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%',fontFamily: 'Source Sans Pro'}

    let seperatorDivStyle=this.state.showTree ?{width:'17px',height: leftColumnHeight,marginLeft:'20px',background:'linear-gradient(to left, #F9FAFC, #b4bcca)',
                          position:'absolute','right':'-19px',zIndex:99,'top':'50px','opacity':'0.4'}: {display:'none'}
  
    let emptyDivStyle = this.state.showTree ? {display:'none'} : {  display:'block',height:'1300px'}
    let detailsDivStyle = this.state.showTree ? {height:rightColumnHeight,paddingLeft:'-15px',paddingRight:'-15px',borderRight:'20px solid #FFFFFF',borderTop:'1px solid #E5EAF4',display:'block',backgroundColor:'#f9fafc', marginBottom:2} : {display:'none'}
    let tableStyle = this.state.showTree ? {borderLeft: '20px solid white',padding:'1px 15px 0 2px',backgroundColor:'white', height:leftColumnHeight} : { borderLeft: '20px solid white',borderRight: '20px solid #FFFFFF', borderBottom: '20px solid #fff' }
    let searchRowStyle = {margin:'0px',marginTop:'-20px'}
    
    if(this.state.showTree)
      searchRowStyle.height='100px'
    const tooltipUnsupportedMsg = (
      <Popover id ='unsupported' style={{color: 'black',borderWidth: 2,borderRadius:0,width:300,height:60,marginLeft:-50,marginTop:-20}}>Coming soon..</Popover>

    );
    return(
      <div>
      {this.state.loadingDiv?
    <div style={{marginTop: 100,paddingTop:'100px',width:'100%', minHeight:window.outerWidth}}>
      <SpinnyLogo />
    </div>
    :
      <div style={{fontSize:'15px',marginLeft:'50px',marginRight:'60px',minHeight:'500px'}}>
        <Row style={searchRowStyle}>
          {this.state.showTree ? '' : <Col lg={3}></Col>}
          <Col lg={9} style={{marginLeft:'0px'}}>
           {/* <FormGroup controlId="search" className="search">
            <InputGroup style={{marginRight:"60px", marginTop:"30px"}}>
              <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
              <FormControl type="text" placeholder="Search for reports, policy packs, control families, controls or groups"  />
            </InputGroup>
            </FormGroup>*/}
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

      
  <div style={{marginTop:'10px',height: leftColumnHeight+50}}>
        <div className="col-lg-3 col-xs-3 col-sm-3 col-md-3" id="emptyDiv" style={emptyDivStyle}></div>
        <div className="col-lg-5 col-xs-5 col-sm-5 col-md-5" id="policyPacksList" style={{paddingRight:'0px',minHeight:leftColumnHeight}}>
          <div style={{height:'50px',borderTop:'1px solid #E5EAF4',backgroundColor:'#FFFFFF',paddingLeft:'25px',paddingTop:'10px'}}>
            POLICY PACKS
          </div>
          <div style={tableStyle}>
            <table className={mytablepol} id='policyPacksTable'>
              <tbody>
                {

                  this.state.policiesList.map(function(policyPack){
                    let imgSrc;
                    if(policyPack.path !== null){
                      imgSrc = ('contentICONS/'+policyPack.path.slice(5)+'.png');
                    }
                    let countsHTML = "";
                    if(policyPack.ruleCount !== null && policyPack.ruleCount > 0){
                      countsHTML = <span style={{fontWeight:'bold'}}>{policyPack.ruleCount} policies</span>
                    }
                    let heightProp=policyPack.description.length-180;
                    var count = policyPack.supplimental.split(' ').length+policyPack.description.split(' ').length;
                    const tooltipPolicyPackdescription = (
                      
                      <Popover id='ppDescription' style={{wordWrap: "break-word"}}>
                      <div style={{height:heightProp}}>
                      
                        <div dangerouslySetInnerHTML={{__html: policyPack.description}}>
                        </div>
                          <a href='javascript:void(0)' style={{float:'right',marginTop:'10px'}}
                            onClick={this.infoHandler.bind(this,count)}>
                              Learn More
                          </a>
                        </div>
                      </Popover>


                    );
                    const tooltipPolicyPackSuppliment = (
                    <Popover id='ppSuppliment' style={{wordWrap: "break-word"}}>
                      <div style={{overflow:'auto',display: 'flex','flex-direction': 'column', 'max-height':this.state.popoverHeight,wordWrap: "break-word"}}>
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

        if(this.props.type!=null && this.props.type.toUpperCase()=="ONPREM"){
                      
                      if(policyPack.assettype.indexOf("ONPREM")==-1){


                          disableCheckBox=true;
                          op={opacity:0.5}
                      }
                  }

        if(this.props.type!=null && this.props.type.toUpperCase()=="AWS"){
                      
                      if(policyPack.assettype.indexOf("AWS")==-1 && policyPack.assettype.indexOf("ONPREM")==-1){


                          disableCheckBox=true;
                          op={opacity:0.5}
                      }
                  }


                  var seperat ="|"
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
                        <td style={{padding:'0 15px 0 0', position:'relative'}}>
                          <a href='javascript:void(0)' onClick={this.policyPackTreeHandler.bind(this,policyPack.title,policyPack.path)}>
                            <div style={{padding:'25px 0px 25px 0px',marginRight:21}}>
                              {policyPack.title}
                              <br/>
                              {policyPack.versionInfo}
                              <br/>
                              {countsHTML}
                              {policyPack.customisable?<div style={{display:'inline-block'}}>&nbsp;&nbsp;&nbsp;{seperat}&nbsp;&nbsp;&nbsp;<span style={{fontWeight:'bold'}}>{policyPack.editablerulecount} Editable</span></div>:<noscript />}
                            </div>
                          </a>
                              <OverlayTrigger ref="infoPopup" placement="right" trigger="click" rootClose onExited={this.exitedFunc} overlay={this.state.displayLearnMore?tooltipPolicyPackdescription:tooltipPolicyPackSuppliment}>
                              <ControlLabel onClick={this.Positioning} className={infoCircle} style={{color:'#4C58A4',fontWeight: '700',float:'right', position:'absolute', top:28, right:13, cursor:'pointer'}} >
                                <i style={{paddingRight:'0.25em'}}>i</i>
                              </ControlLabel>
                              </OverlayTrigger>
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
        <div style={{maxHeight:leftColumnHeight-1, overflowY:'auto', overflowX:'hidden'}}>
          {<PolicyPacksProfiles rootNode={this.state.rootNode} selectedProfilesList={this.state.selectedProfilesList} setPolicyProfiles={this.setPolicyProfiles} benchmark={this.state.selectedBenchmark}/>}
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
                <TreeNode policyPackPath={this.state.rootNode.path} osSelected={this.state.osSelected} profiles={this.state.selectedProfilesList} node={this.state.rootNode} root="YES" marginPx={0} isEditable={this.props.isEditable} resetList={this.state.globalVariableList} selectedArtifectSet={this.state.selectedVariableList} SettingVariables={this.SettingVariables} saveSelectedArtifacts={this.props.saveSelectedArtifacts}/>
              :null}
          </div>
        : null}
        </div>
        </div>
      </div>
    </div>
  }
    </div>
    )
    }
})

export  {PolicyPacksList}
  