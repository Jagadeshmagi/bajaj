import React, { PropTypes } from 'react'
import {Glyphicon,Col, Row} from 'react-bootstrap'
import {getPolicyDetails, getPolicyPackRules, newGetPolicyPackRules} from 'helpers/policies'
import {SpinnyLogo} from 'containers'
import {RuleListModal} from './RuleListModal'
import {RuleDetails} from './RuleDetails'
import {RuleNode} from './RuleNode'

export const TreeNode = React.createClass ({
  getInitialState(){
    return{
      visible: false,
      marginPx: parseInt(this.props.marginPx) + 10,
      isFetching: false,
      childNodesLoaded: false,
      moreRulesToLoad:true,
      osSelected: this.props.osSelected,
      node: this.props.node,
      color:'white',
    }
  },
  fetchPolicyDetails(node){
    this.setState({isFetching:true});
    if(node.childCount !== null && node.childCount > 0){
    getPolicyDetails(node.path)
    .then((nodes) => {
        let newNode = {...this.state.node,childNodes:nodes}
        //console.log("newNODE in treenode:" + JSON.stringify(newNode));
        this.setState({node:newNode,isFetching:false,childNodesLoaded:true});
    })
    .catch((error) => console.log("Error in getting the getPolicyDetails"))
    }else{
      newGetPolicyPackRules(node.controlid, this.state.osSelected,this.props.policyPackPath,this.props.profiles,50,50)
      .then((nodes) => {
        let moreRulesToLoad = true;
        if(nodes.length < 50)
          moreRulesToLoad = false;
        let newNode = {...this.state.node,childNodes:nodes}
        this.setState({node:newNode,isFetching:false,childNodesLoaded:true,moreRulesToLoad:moreRulesToLoad});
      })
      .catch((error) => console.log("Error in getting the getPolicyPackRules"))
    }
  },
  showMore(){
    let node = this.state.node
      newGetPolicyPackRules(node.controlid, this.state.osSelected,this.props.policyPackPath,this.props.profiles,node.childNodes.length+50,50)
      .then((nodes) => {
        let moreRulesToLoad = true;
        if(nodes.length < 50)
          moreRulesToLoad = false;

        let existingNodes = this.state.node.childNodes;

        let newChildNodes = []
        existingNodes.map(function(n1){
          newChildNodes.push(n1)
        })
        nodes.map(function(n2){
          newChildNodes.push(n2)
        })

        let newNode = {...this.state.node,childNodes:newChildNodes}

        this.setState({node:newNode,isFetching:false,childNodesLoaded:true,moreRulesToLoad:moreRulesToLoad});
      })
      .catch((error) => console.log("Error in getting the getPolicyPackRules: "+error))
  },
  componentDidMount(){
    if(this.props.root === 'YES'){
      this.fetchPolicyDetails(this.props.node);
      this.setState({visible: true});
    }
  },
  toggle(){
    //check that the node is not a rule node and also that the childnodes are not already loaded
    if(this.state.node.ruleCount && (this.state.node.childNodes == null || this.state.node.childNodes.length === 0)){
      this.fetchPolicyDetails(this.props.node);
    }
    this.setState({visible: !this.state.visible});
  },

  componentWillReceiveProps(nextProps,nextState){

    if (nextProps.node != this.props.node) {
      this.setState({node:nextProps.node},function(){
         this.fetchPolicyDetails(nextProps.node);
      });
    }
    if (nextProps.osSelected != this.props.osSelected) {
      this.setState({osSelected:nextProps.osSelected},function(){
        if(this.state.node.childCount === 0 && this.state.childNodesLoaded)
          this.fetchPolicyDetails(nextProps.node)});
    }
  },

  render() {

    let childNodes;
    let classObj;
    let marginPX = this.state.marginPx
    let nodeDivStyle = {backgroundColor:'#F9FAFC'}
    if(marginPX === 30)
      nodeDivStyle = {backgroundColor:'#FFFFFF'}

    let bStyle={borderTop:'1px solid #EDF2F8',borderBottom:'1px solid #F9FAFC',backgroundColor:'#F9FAFC'}
    if(marginPX === 30)
      bStyle={borderTop:'1px solid #EDF2F8',borderBottom:'1px solid #FFFFFF',backgroundColor:'#FFFFFF'}
    else if(marginPX === 40)
      bStyle={borderTop:'1px solid #EDF2F8',borderBottom:'1px solid #F9FAFC',backgroundColor:'#F9FAFC'}

    let osSelected = this.state.osSelected

    // +++++++ typecve used in Ruledetails for API differentiation ++++++++++++++
     let typecve=""
     let policyPackPath = this.props.policyPackPath
      if(policyPackPath.indexOf("CVESCAN")!=-1){
       typecve="CVE"
      }
    //+++++++++++++++++++++++++++++++++++++++++ 
    
    let profilesSelected = this.props.profiles

    if (this.state.node.childCount > 0){
      if (this.state.node.childNodes != null) {
        childNodes = this.state.node.childNodes.map(function(node, index) {

          return <div key={index} style={nodeDivStyle}>
                  <div style={{marginLeft:'20px',marginRight:'20px'}} key={index}>
                    <TreeNode key={index} policyPackPath={policyPackPath} 
                      osSelected={osSelected} node={node} profiles={profilesSelected} 
                      root="NO" marginPx={marginPX} 
                      isEditable={this.props.isEditable}
                      SettingVariables={this.props.SettingVariables}
                      selectedArtifectSet={this.props.selectedArtifectSet}
                      saveSelectedArtifacts={this.props.saveSelectedArtifacts}
                      resetList={this.props.resetList}
                      />
                  </div>
                </div>

        }.bind(this));
        classObj = {
          "togglable": true,
          "togglable-down": this.state.visible,
          "togglable-up": !this.state.visible
        };
      }else if(this.state.isFetching){

        childNodes = <div style={{position:'relative',marginLeft:'20px',marginRight:'20px', height:'150px'}}>
                  <div style={{position:'absolute',top:70,left:150}}><SpinnyLogo/></div>
                 </div>
    
      }
    }else if (this.state.node.childCount === 0){
      if (this.state.node.childNodes != null) {
        let ruleNodeMarginPX = marginPX + 10
        let ruleNodeStyle={borderTop:'1px solid #EDF2F8',borderBottom:'1px solid #F9FAFC',backgroundColor:'#F9FAFC'}
        if(ruleNodeMarginPX === 30)
          ruleNodeStyle={borderTop:'1px solid #EDF2F8',borderBottom:'1px solid #FFFFFF',backgroundColor:'#FFFFFF'}
        else if(ruleNodeMarginPX === 40)
          ruleNodeStyle={borderTop:'1px solid #EDF2F8',borderBottom:'1px solid #F9FAFC',backgroundColor:'#F9FAFC'}

        let rulesList = this.state.node.childNodes.map(function(node, index) {
          return <div>
          <RuleNode 
              key={node.title} 
              node={node} 
              type={typecve}
              nodeDivStyle={nodeDivStyle} 
              bStyle={ruleNodeStyle} 
              marginPX={ruleNodeMarginPX}
              policyPackPath={policyPackPath}
              isEditable={this.props.isEditable}
              SettingVariables={this.props.SettingVariables}
              selectedArtifectSet={this.props.selectedArtifectSet}
              saveSelectedArtifacts={this.props.saveSelectedArtifacts}
              resetList={this.props.resetList}              
              />
          </div>
        }.bind(this));

         childNodes = <div>
                        <div style={nodeDivStyle}>
                        {rulesList}
                        {this.state.moreRulesToLoad?
                        
                        <div style={{textAlign:'right',marginRight:'20px'}}>
                          <a onClick={this.showMore}>Show more</a>
                        </div>
                        
                        :
                        null
                        }
                        </div>
                      </div>

      }else if(this.state.isFetching){

        childNodes = <div style={{position:'relative',marginLeft:'20px',marginRight:'20px', height:'150px'}}>
                  <div style={{position:'absolute',top:70,left:150}}><SpinnyLogo/></div>
                 </div>
      }
  }


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
    let checkBoxId = this.props.node.title;
    if(this.props.node.childCount != null){
      if(this.props.node.childCount >= 0){
        expandIcon =  <span style={{paddingRight:'20px'}}><Glyphicon style={iconStyle} glyph={expandCollapseIcon}/></span>
      }      
    }

    let title= this.props.node.title;
    let rootNode;
    if(this.props.root === 'NO'){
      rootNode =  (
      <div style={bStyle} key={this.state.node.title}>
        <h5 onClick={this.toggle} style={{marginLeft:marginPX,fontSize:'15px'}}>
          <Row>
            <Col xs={9} md={9} sm={9} lg={9} style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap',overflow: 'hidden'}}>
              {/*<input type="checkbox" id={checkBoxId} defaultChecked={true}/><label htmlFor={checkBoxId}/> &nbsp;*/}
              <a href="javascript:void(0)" style={{color:'#737684',textDecoration:'none'}} data-toggle="tooltip" title={title}>{title}</a>
            </Col>
            <Col xs={3} md={3} sm={3} lg={3} style={{textAlign: 'right'}}>
              {expandIcon}
            </Col>
          </Row>
        </h5>
      </div>)
     }else{
      /*
      rootNode =  (
        <div>
         {this.state.isFetching? <img style={{backgroundColor:'#F9FAFC',width:'150px',height:'150px',marginLeft:'50px',marginTop:'20px'}} src={loadingImage}/>:''}
        </div>
        )
      */
     }

    return (
      <div id="controlIdNodes">
        {rootNode}
        <div style={style} >
          <div className="child">{childNodes}</div>
        </div>
      </div>
    );
  }
})
