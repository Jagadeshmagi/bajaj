import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import { Grid, Row, Col, Button} from 'react-bootstrap'
import {Header} from 'components'
import {hmenu, active} from './styles.css'
import {blueBtn, spacer} from 'sharedStyles/styles.css'
import TagButtonMenu from 'components/TagButton/TagButtonMenu'
import ErrorMessages from 'constants/ErrorMessages';
import {checkUsage}from 'helpers/context'

const ApplicationSettings = React.createClass({
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
   this.setState({ activeTab: newActiveTab})
  },

   componentWillReceiveProps(nextProps,nextState){
    let currLocation = window.location.href;
    let parArr = currLocation.split("?")[0].split("#")[1];
    let newActiveTab="#"+parArr;
    this.setState({ activeTab: newActiveTab})
  },

  

  render() {
    let tagNames = [
      {linkName:'/infrastructure/mygroups', displayName:'About'},
      {linkName:'/infrastructure/mygroups', displayName:'IP Address Config'},
      {linkName:'/infrastructure/credentials', displayName:'Logs Management'},
      {linkName:'/infrastructure/scheduleAndNotifications', displayName:'Upgrade'}
    ]
    let posstyle = { position: 'relative', top:30, left: 0,
      width: '154px',
      float: 'right',
      margin: 'auto',
      visibility:'hidden'
  }
    return (
      <div >
        <Header name="Application Settings" />
        <Grid fluid><Row><Col pullRight style={{marginLeft: '60%', marginRight:75 }}>
          <Button bsSize='large' style={posstyle} className={blueBtn} >
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

export default ApplicationSettings
