   import React, { Component, PropTypes } from 'react'
   import {WizHeader} from './WizardHeader'
   import AssetDetails from './AssetDetails'

   class MultiStepWizard extends React.Component {
     render() {
      let containerStyle={paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%'}
       return (
         <div style={containerStyle} className="container">
           <WizHeader name="Discover Resources & Assess for Risk, Security and Compliance"
             routeParams={this.props.params}
             />
           <AssetDetails id={this.props.params.assetgroupId}/>
         </div>

         )
      }
   }
   export default MultiStepWizard
