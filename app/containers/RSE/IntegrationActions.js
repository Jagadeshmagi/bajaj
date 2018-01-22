import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {blueBtn} from 'sharedStyles/styles.css'
import {Col, Button} from 'react-bootstrap'
import {IntegrationTable, AddIntegration} from 'containers'
import {verifyPDconnection, addIntegration, getAllIntegrations} from 'helpers/integration'
import {DeleteIntegration, EditIntegration} from 'containers'

const IntegrationActions = React.createClass({

  render: function () {
      let count = this.props.slectedIntegrations.length
      console.log("selected length "+this.props.slectedIntegrations, count)
      return (count > 0 )
      ? <p style={{paddingTop: 10}}>
            {this.props.totalIntegrationCount} Integration {count} selected: {' '}
            {count == 1 ?
              <span>
                <EditIntegration 
                  selectedIntegrationIds={this.props.slectedIntegrations}
                  refreshIntegrationsList={this.props.refreshIntegrationsList} 
                  removeFromSelected={this.props.removeFromSelected}
                  selectedIntegrationName={this.props.selectedIntegrationName}/> | {' '}
              </span>
            :<noscript/>}
            <DeleteIntegration 
              selectedIntegrationIds={this.props.slectedIntegrations}
              refreshIntegrationsList={this.props.refreshIntegrationsList} 
              removeFromSelected={this.props.removeFromSelected}
              selectedIntegrationName={this.props.selectedIntegrationName}/>
        </p>
      :
      <p style={{paddingTop: 10, paddingBottom: 10}}>
         {this.props.totalIntegrationCount} Integration
      </p>
  }
})

export default IntegrationActions