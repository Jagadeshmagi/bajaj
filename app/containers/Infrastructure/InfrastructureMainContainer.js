import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import { Grid, Row, Col, Button} from 'react-bootstrap'
import {Header} from 'components'
import {hmenu, active} from './styles.css'
import {blueBtn, spacer} from 'sharedStyles/styles.css'
import TagButtonMenu from 'components/TagButton/TagButtonMenu'
import ErrorMessages from 'constants/ErrorMessages';
import {checkUsage}from 'helpers/context'

const InfrastructureMainContainer = React.createClass({
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      activeTab: '#/infrastructure/allresources'
    }
  },
  onItemClick: function(e)  {
    //console.log('InfMain'+e.target.hash)
    this.setState({ activeTab: e.target.hash})
  },

  componentDidMount: function(){
    //this.context.router.replace('infrastructure/allresources')
    let currLocation = window.location.href;
    let parArr = currLocation.split("?")[0].split("#")[1];
    let newActiveTab="#"+parArr;
    if(newActiveTab=='#/infrastructure/dockerTab'){
      this.setState({activeTab:'#/infrastructure/allresources'})
    }
    else this.setState({ activeTab: newActiveTab})
  },

   componentWillReceiveProps(nextProps,nextState){
    let currLocation = window.location.href;
    let parArr = currLocation.split("?")[0].split("#")[1];
    let newActiveTab="#"+parArr;
    if(newActiveTab=='#/infrastructure/dockerTab'){
      this.setState({activeTab:'#/infrastructure/allresources'})
    }
    else this.setState({ activeTab: newActiveTab})
  },

  redirectToWizard(){
   checkUsage()
   .then((response) =>{
      if(response !== null && response.data.output !== null && response.data.output === "time_completed")
      {
        Alert.show(ErrorMessages.LICENSE_EXPIRED);
      }else if(response !== null && response.data.output !== null && response.data.output === "instance_completed")
      {
        Alert.show(ErrorMessages.MAX_RESOURCES);
      }
      else{
        window.location = '#/cloud/'+ -1;
      }
   })
   .catch((error) => {
      window.location = '#/cloud/'+ -1;
   })
  },

  render() {
    let tagNames = [
      {linkName:'/infrastructure/allresources', displayName:'All Resources'},
      {linkName:'/infrastructure/mygroups', displayName:'My Groups'},
      {linkName:'/infrastructure/credentials', displayName:'Credentials'},
      {linkName:'/infrastructure/scheduleAndNotifications', displayName:'Schedule and Notifications'}
    ]
    let posstyle = { position: 'relative', top:30, left: 0,
      width: '154px',
      float: 'right',
      margin: 'auto',
      paddingLeft:'10px'
  }
    return (
      <div >
        <Header name="Infrastructure" />
        <Grid fluid><Row><Col pullRight style={{marginLeft: '60%', marginRight:75 }}>

          <Button onClick={this.redirectToWizard} bsSize='large' style={posstyle} className={blueBtn} >
            Discover & Assess
          </Button>

        </Col></Row></Grid>
      <div style={{marginLeft: 60, marginRight:75 }}>
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

export default InfrastructureMainContainer
