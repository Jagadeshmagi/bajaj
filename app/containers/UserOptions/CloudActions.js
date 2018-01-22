import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {blueBtn} from 'sharedStyles/styles.css'
import {Col, Button} from 'react-bootstrap'
import {IntegrationTable, AddIntegration} from 'containers'
import {verifyPDconnection, addIntegration, getAllIntegrations} from 'helpers/integration'
import {DeleteCloud, AddCloud} from 'containers'

const CloudActions = React.createClass({

  render: function () {
      let count = this.props.slectedIntegrations.length
      let edit
      if(count === 1){
        edit = (
          <span>
          <AddCloud
            edit={true}
            updateCloud={this.props.updateCloud}
            selectedIntegrationIds={this.props.slectedIntegrations}
            refreshCloudsList={this.props.refreshIntegrationsList}
            removeFromSelected={this.props.removeFromSelected}
            selectedIntegrationName={this.props.selectedIntegrationName}/> | &nbsp;</span>
        )
      } else {
        edit = ""
      }
      console.log("this.props.slectedIntegrations "+this.props.selectedIntegrationName, this.props.slectedIntegrations)
      return (count > 0 )
      ? <p style={{marginLeft:"-35", paddingTop: 10, paddingBottom: 15}}>
            {this.props.totalIntegrationCount} Cloud Accounts {count} selected: {' '}
            {edit}
            <DeleteCloud
              selectedIntegrationIds={this.props.slectedIntegrations}
              refreshCloudsList={this.props.refreshIntegrationsList}
              removeFromSelected={this.props.removeFromSelected}
              selectedIntegrationName={this.props.selectedIntegrationName}/>
        </p>
      :
      <p style={{marginLeft:"-35", paddingTop: 10, paddingBottom: 15}}>
         {this.props.totalIntegrationCount} Cloud Accounts
      </p>
  }
})

export default CloudActions
