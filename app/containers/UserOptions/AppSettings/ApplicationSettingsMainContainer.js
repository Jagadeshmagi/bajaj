import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import { Grid, Row, Col, Button} from 'react-bootstrap'
import {Header} from 'components'
import {hmenu, active} from 'containers/UserOptions/styles.css'
import {blueBtn, spacer} from 'sharedStyles/styles.css'
import TagButtonMenu from 'components/TagButton/TagButtonMenu'

const ApplicationSettingsMainContainer = React.createClass({
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      activeTab: '#/applicationSettings/about'
    }
  },
  onItemClick: function(e)  {
    //console.log('InfMain'+e.target.hash)
    this.setState({ activeTab: e.target.hash})
  },

  componentDidMount: function(){
    //this.context.router.replace('applicationSettings/ipAddressConfig')
   let currLocation = window.location.href;
   let parArr = currLocation.split("?")[0].split("#")[1];
   let newActiveTab="#"+parArr;
   this.setState({ activeTab: newActiveTab})
  },

   componentWillReceiveProps(nextProps,nextState){
   // this.context.router.replace('applicationSettings/ipAddressConfig')
    let currLocation = window.location.href;
    let parArr = currLocation.split("?")[0].split("#")[1];
    let newActiveTab="#"+parArr;
    this.setState({ activeTab: newActiveTab})
  },

  render() {
    let tagNames = [
      {linkName:'/applicationSettings/about', displayName:'About'},
     /* {linkName:'/applicationSettings/ipAddressConfig', displayName:'IP Address Config'},
      {linkName:'', displayName:'Logs Management'},
      {linkName:'', displayName:'Upgrade'}*/
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

export default ApplicationSettingsMainContainer
