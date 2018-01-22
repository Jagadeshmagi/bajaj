import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {blueBtn} from 'sharedStyles/styles.css'
import {Col, Button} from 'react-bootstrap'
import {AddCustomPolicies} from 'containers'


const CustomPoliciesActions = React.createClass({

  render: function () {
      let count = this.props.slectedCustomPolicies.length
      console.log("selected length "+this.props.slectedCustomPolicies, count)
      return (
        <span>
          <p style={{paddingTop: 10, paddingBottom: 10}}>
             {this.props.totalCustomPoliciesCount} Custom Policies: {' '}
             <AddCustomPolicies
               selectedCustomPoliciesIds={this.props.slectedCustomPolicies}
               refreshCustomPoliciesList={this.props.refreshCustomPoliciesList}
               removeFromSelected={this.props.removeFromSelected}
               selectedCustomPoliciesName={this.props.selectedCustomPoliciesName}/>
          </p>
        </span>
      )
    }
})

export default CustomPoliciesActions


// import React, { PropTypes } from 'react'
// import {AlertTable} from 'containers'
// import {blueBtn} from 'sharedStyles/styles.css'
// import {Col, Button} from 'react-bootstrap'
// import {AddCustomPolicies} from 'containers'
//
//
// const CustomPoliciesActions = React.createClass({
//
//   render: function () {
//       let count = this.props.slectedCustomPolicies.length
//       console.log("selected length "+this.props.slectedCustomPolicies, count)
//       return (count > 0 )
//       ? <p style={{paddingTop: 10, paddingBottom: 10}}>
//             {this.props.totalCustomPoliciesCount} Custom Policies {count} selected: {' '}
//             {count == 1 ?
//               <span>
//                 <AddCustomPolicies
//                   selectedCustomPoliciesIds={this.props.slectedCustomPolicies}
//                   refreshCustomPoliciesList={this.props.refreshCustomPoliciesList}
//                   removeFromSelected={this.props.removeFromSelected}
//                   selectedCustomPoliciesName={this.props.selectedCustomPoliciesName}/> | {' '}
//               </span>
//             :<noscript/>}
//             <AddCustomPolicies
//               selectedCustomPoliciesIds={this.props.slectedCustomPolicies}
//               refreshCustomPoliciesList={this.props.refreshCustomPoliciesList}
//               removeFromSelected={this.props.removeFromSelected}
//               selectedCustomPoliciesName={this.props.selectedCustomPoliciesName}/>
//         </p>
//       :
//       <p style={{paddingTop: 10, paddingBottom: 10}}>
//          {this.props.totalCustomPoliciesCount} Custom Policies
//       </p>
//   }
// })
//
// export default CustomPoliciesActions
