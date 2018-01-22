import React, {PropTypes} from 'react'
import {spacer} from 'sharedStyles/styles.css'
import {CreateCredentials,EditCredentials,DeleteCredentials} from 'containers'

const CredentialsActions = React.createClass({
  render:function() 
{ 
  let totalCredentialsCount = this.props.totalCredsCount  
  console.log("Total Credentials Count "+totalCredentialsCount)   
  let credentialsSelected = this.props.slectedCreds
  console.log(" Credentials selected ids are "+credentialsSelected)   
  let numSelected = 0
  if(credentialsSelected != null){
    numSelected = credentialsSelected.length;
  }

  // const style={marginBottom: 15}
  let separator = ''
  if (numSelected === 1) {
     separator = ' | '
  }
  

  return(
  numSelected === 0
  ?
    <div>
     {totalCredentialsCount} Credentials :{'  '}
     <CreateCredentials totalCredsCount={this.props.totalCredsCount} refreshCredentialsList={this.props.refreshCredentialsList}/>
    </div>
  :
  <div>
    {totalCredentialsCount} Credentials {numSelected} selected:{'  '}
    <CreateCredentials  totalCredsCount={this.props.totalCredsCount} refreshCredentialsList={this.props.refreshCredentialsList}/> {'  '}
    {numSelected === 1 ?
    <div style={{display:'inline-block'}}>
          {separator}
          <EditCredentials editCredId={this.props.slectedCreds} 
          refreshCredentialsList={this.props.refreshCredentialsList}
           removeFromSelected={this.props.removeFromSelected}
           label={this.props.selectedCredName}/>
          {separator}
          <DeleteCredentials 
            selectedCredIds={this.props.slectedCreds}
            refreshCredentialsList={this.props.refreshCredentialsList} 
            removeFromSelected={this.props.removeFromSelected}
            selectedCredName={this.props.selectedCredName}/> 
    </div>
      : <noscript/>
  }
  {numSelected > 1 ?
    <div style={{display:'inline-block'}}>
    {'|'}
      <DeleteCredentials 
            refreshCredentialsList={this.props.refreshCredentialsList} 
            removeFromSelected={this.props.removeFromSelected}
            selectedCredIds={this.props.slectedCreds}/>
      </div>
      : <noscript/>
      }
  </div>
  )
}
})

export default CredentialsActions
