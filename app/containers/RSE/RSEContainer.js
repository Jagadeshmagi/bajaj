import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import { Grid, Row, Col, Button} from 'react-bootstrap'
import {Header} from 'components'
import {hmenu, active} from './styles.css'
import {blueBtn, spacer} from 'sharedStyles/styles.css'
import TagButtonMenu from 'components/TagButton/TagButtonMenu'
import {checkUsage}from 'helpers/context'
import {IntegrationActions, AddIntegration, IntegrationTable} from 'containers'
import {verifyPDconnection, addIntegration, getAllIntegrations} from 'helpers/integration'

const RSEContainer = React.createClass({
  /*contextTypes: {
    router: PropTypes.object.isRequired,
  },*/
  getInitialState: function() {
    return {
      activeTab: '#/rse/allalerts',
      integrationsList:[],
      pdIntegrated:false,
      slackIntegrated:false,
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

  refreshIntegrationsList(){
    console.log("refresh called in RSE Container")
    this.setState({loadingDiv:true})
    this.getIntegrationsList();
  },
  activeTabChanges(){
    let currLocation = window.location.href;
    let parArr = currLocation.split("?")[0].split("#")[1];
    let newActiveTab="#"+parArr;
    this.setState({activeTab: newActiveTab},function(){
      if(this.state.activeTab==="#/rse/integrations"){
        this.getIntegrationsList();
      }
   })
  },

  getIntegrationsList(){
      getAllIntegrations()
      .then(
        (integrations) =>  {
          this.setState({integrationsList:integrations.output,
            loadingDiv:false}, function()
            {
              console.log("Integrations List1 in RSE container"+this.state.integrationsList.length)
              if(this.state.integrationsList.length>0)
               {
                 this.state.integrationsList.map((integrationsList) =>
                  {
                   if(integrationsList.name==='pagerduty')
                    {
                      this.setState({pdIntegrated:true},function(){
                        console.log("pd exists "+this.state.pdIntegrated)
                      })
                    }else if(integrationsList.name==='slack'){
                      this.setState({slackIntegrated:true},function(){
                        console.log('slack exists'+this.state.slackIntegrated)
                      })
                    }
                  })//map
               }//list length
               else{
                //++++++++++++ Empty List ++++++++++++
                  this.setState({pdIntegrated:false,
                                 slackIntegrated:false
                                },function(){
                    console.log("Integration exists "+this.state.pdIntegrated+" "+this.state.slackIntegrated)
                  })
               }
            });//setState
      })
      .catch((error) => console.log("Error in getIntegrationsList in container:" + error))
    },

  render() {
    let tagNames = [
      {linkName:'/rse/allalerts', displayName:'All Alerts'},
      {linkName:'/rse/integrations', displayName:'Integrations'},

    ]
    let posstyle = { position: 'relative', top:30, left: 0,
      width: '154px',
      float: 'right',
      margin: 'auto'
  }

  if(this.state.pdIntegrated || this.state.slackIntegrated){posstyle.visibility='visible'}else{posstyle.visibility='hidden'}
    return (
      <div>
        <Header name="Risk Signaling Engine" />
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

export default RSEContainer
