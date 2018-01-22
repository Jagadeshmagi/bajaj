import React, { PropTypes } from 'react'
import {Glyphicon,Col, Row} from 'react-bootstrap'
import loadingImage from 'assets/Loading_icon.gif'

export const PolicyPacksProfiles = React.createClass ({
  getInitialState(){
    return{
      visible: true,
      profilesList:[],
      displayStatus:'',
      multiSelect:'',
      profileCount:'',
      selectedProfiles:[]
    }
  },

  componentDidMount(){

      this.setState({multiSelect:this.props.rootNode.multiselect,
        profilesList:this.props.rootNode.profiles},function(){
          if(this.props.selectedProfilesList.length == 0){
            if(this.state.multiSelect===0|| this.state.multiSelect===2){
              this.setState({selectedProfiles:this.props.rootNode.profiles},function(){
                this.props.setPolicyProfiles(this.state.selectedProfiles);
              })
            }
            else if(this.state.multiSelect===1){
              let newList=[]
              newList.push(this.props.rootNode.profiles[0])
              this.setState({selectedProfiles:newList},function(){
                this.props.setPolicyProfiles(this.state.selectedProfiles);
              })
            }
            this.setState({profileCount:this.props.rootNode.profiles.length})
          }else{
            this.setState({selectedProfiles:this.props.selectedProfilesList,
                          profileCount:this.props.rootNode.profiles.length});
          }
        })
  },

  componentWillReceiveProps(nextProps){
    if(nextProps.rootNode !== this.props.rootNode){

      this.setState({multiSelect:nextProps.rootNode.multiselect,
        profilesList:nextProps.rootNode.profiles},function(){
          this.setState({profileCount:nextProps.rootNode.profiles.length})

          this.setState({selectedProfiles:nextProps.selectedProfilesList},function(){

            if(nextProps.selectedProfilesList.length === 0){
                if(nextProps.rootNode.multiselect===0|| nextProps.rootNode.multiselect===2){
                  this.setState({selectedProfiles:nextProps.rootNode.profiles},function(){
                    this.props.setPolicyProfiles(nextProps.rootNode.profiles);
                  })
                }
                else if(nextProps.rootNode.multiselect===1){
                  let newList=[]
                  newList.push(nextProps.rootNode.profiles[0])
                  this.setState({selectedProfiles:newList},function(){
                    this.props.setPolicyProfiles(newList);
                  })
                }
            }else{
                this.setState({selectedProfiles:nextProps.selectedProfilesList});
            }
          });

        })
    }
  
  },

  toggle(){
    this.setState({visible: !this.state.visible});
  },

  handleSelectionChange: function (changeEvent) {
    let newList=[]
    newList.push(changeEvent.target.id)
     this.setState({selectedProfiles:newList});
     this.props.setPolicyProfiles(newList)
    },

  handleCheckBoxChange:function(e){
    let chkVal = e.target.id;
    const index = this.state.selectedProfiles.indexOf(chkVal)
    let newList = this.state.selectedProfiles.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({selectedProfiles: newList},function(){
      this.props.setPolicyProfiles(newList)
    })
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
    let profileDivs
    let profiles = this.state.profilesList

    if(this.state.profileCount!=0){

    if(this.props.rootNode.multiselect === 0){
      profileDivs =  profiles.map(function(profile, index) {
         let profileName=profile
        if(profile.length>25){
          profileName=profile.substring(0,25)
          profileName=profileName.concat('...')
        }
      return <div key={index} style={{marginTop:'10px'}} className="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                <input type="checkbox" id={profile} checked={(this.state.selectedProfiles.indexOf(profile) != -1)?true:false}/>
                  <label style={{fontWeight:'500'}} htmlFor={profile} title={profile}> &nbsp; {profileName}
                  </label>
              </div>
      }.bind(this));
    }

    else if(this.props.rootNode.multiselect === 1){
      profileDivs =  profiles.map(function(profile, index) {
          let profileName=profile
          if(profile.length>25){
            profileName=profile.substring(0,25)
            profileName=profileName.concat('...')
          }
          return  <div style={{marginTop:'10px'}} key={index} className="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <input type="radio" id={profile} name={profile} value={profile}
                      checked={(this.state.selectedProfiles.indexOf(profile) != -1)?true:false}
                      onChange={this.handleSelectionChange}/>
                    <label style={{fontWeight:'500'}} htmlFor={profile} title={profile}> &nbsp; {profileName}
                    </label>
                  </div>
      }.bind(this));
    }

    else if(this.props.rootNode.multiselect === 2){
      profileDivs =  profiles.map(function(profile, index) {
        let profileName=profile
        if(profile.length>25){
          profileName=profile.substring(0,25)
          profileName=profileName.concat('...')
        }
        return  <div style={{marginTop:'10px'}} key={index} className="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                  <input type="checkbox" id={profile} checked={(this.state.selectedProfiles.indexOf(profile) != -1)?true:false}
                    onChange={this.handleCheckBoxChange}/>
                  <label style={{fontWeight:'500'}} htmlFor={profile} title={profile}> &nbsp; {profileName}
                  </label>
                </div>
      }.bind(this));
    }      
    return (
      <div style={{margin:'10px 0px 10px 0px'}}>
       <h5 onClick={this.toggle} style={{marginLeft:'30px',fontSize:'15px'}}>
        <Row>
          <Col xl={11} md={10} sm={9} style={{fontSize:'15px',fontWeight:'bold'}}>
            {this.state.profileCount} Profiles
          </Col>
          <Col xl={1} md={2} sm={3} style={{textAlign: 'right'}}>
            {expandIcon}
          </Col>
        </Row>
         </h5>
        {this.state.visible?
          <div id="profileDivs" style={{marginTop:'10px',marginBottom:'25px',marginLeft:'10px'}}
            className="col-lg-12 col-xs-12 col-sm-12 col-md-12">
            {profileDivs}
          </div>
        :null
        }
      </div>
    );}
    else{
      return(
        null
      )
    }
  }
})
