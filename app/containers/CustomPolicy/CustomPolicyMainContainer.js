import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import { Grid, Row, Col, Button} from 'react-bootstrap'
import {Header} from 'components'
import {hmenu, active} from './styles.css'
import {blueBtn, spacer} from 'sharedStyles/styles.css'
import TagButtonMenu from 'components/TagButton/TagButtonMenu'
import {checkUsage}from 'helpers/context'
import {getCustomPoliciesList} from 'helpers/scriptedPolicy'


const CustomPolicyMainContainer = React.createClass({
  /*contextTypes: {
    router: PropTypes.object.isRequired,
  },*/
  getInitialState: function() {
    return {
      activeTab: '#/scriptedPolicy/customPolicyPacks',
      customPolicyPacksList:[],
      loadingDiv:true
    }
  },
  onItemClick: function(e)  {
    this.setState({ activeTab: e.target.hash})
  },

  componentDidMount: function(){
    //this.context.router.replace('infrastructure/allresources')
    this.activeTabChanges();
  },

  componentWillReceiveProps(nextProps,nextState){
    this.activeTabChanges();
  },

  refreshCustomPolicyPacksList(){
    this.setState({loadingDiv:true})
    this.getCustomPoliciesList();
  },
  activeTabChanges(){
    let currLocation = window.location.href;
    let parArr = currLocation.split("?")[0].split("#")[1];
    let newActiveTab="#"+parArr;
    this.setState({activeTab: newActiveTab},function(){
      if(this.state.activeTab==="#/scriptedPolicy/customPolicyPacks"){
        this.getCustomPoliciesList();
      }
   })
  },

  getCustomPoliciesList(){
      getCustomPoliciesList()
      .then(
        (customPolicyPacks) =>  {
          this.setState({
            customPolicyPacksList:customPolicyPacks.output,
            loadingDiv:false
          });
      })
      .catch((error) => console.log("Error in getCustomPoliciesList in container:" + error))
    },

  render() {
    let tagNames = [
      {linkName:'/scriptedPolicy/customPolicies', displayName:'Custom Policies'},
      {linkName:'/scriptedPolicy/customPolicyPacks', displayName:'Custom Policy Packs'},

    ]
    let posstyle = { position: 'relative', top:30, left: 0,
      width: '154px',
      float: 'right',
      margin: 'auto'
  }

    return (
      <div>
        <Header name="Custom Policies" />
        <div style={{marginLeft: 60, marginRight:75, marginTop: 60}}>
          <TagButtonMenu
              activeTab={this.state.activeTab}
              onItemClick={this.onItemClick}
              tagNames={tagNames}
          />
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  },
})

export default CustomPolicyMainContainer
