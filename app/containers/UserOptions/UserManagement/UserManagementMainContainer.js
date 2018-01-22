import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import { Grid, Row, Col, Button} from 'react-bootstrap'
import {Header} from 'components'
import {hmenu, active} from './styles.css'
import {blueBtn, spacer} from 'sharedStyles/styles.css'
import TagButtonMenu from 'components/TagButton/TagButtonMenu'
import ErrorMessages from 'constants/ErrorMessages';
import {checkUsage}from 'helpers/context'

const UserManagementMainContainer = React.createClass({
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      activeTab: '#/usermanagement/userInfoTab'
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
   this.setState({ activeTab: newActiveTab})
  },

   componentWillReceiveProps(nextProps,nextState){
    let currLocation = window.location.href;
    let parArr = currLocation.split("?")[0].split("#")[1];
    let newActiveTab="#"+parArr;
    this.setState({ activeTab: newActiveTab})
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
      {linkName:'/usermanagement/userInfoTab', displayName:'User Info'},
      {linkName:'/usermanagement/UserManagementTab', displayName:'User Management'},
      {linkName:'/usermanagement/roleManagementTab', displayName:'Role Management'},
      // {linkName:'/usermanagement/pptest', displayName:'Policy Pack Search Test'}

    ]
    let posstyle = { position: 'relative', top:30, left: 0,
      width: '154px',
      float: 'right',
      margin: 'auto'
  }
    return (
      <div>
        <Header name="User Management" />
        <Grid fluid>
          <Row>
            <Col pullRight style={{marginLeft: '60%', marginRight:75, marginTop:50}}>
            </Col>
          </Row>
        </Grid>
        <div className="container-fluid" style={{marginLeft: 60, marginRight:75 }}>
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

export default UserManagementMainContainer
