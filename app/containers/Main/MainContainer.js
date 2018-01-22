import React , { PropTypes } from 'react'
import { Navigation} from 'components'
import { connect } from 'react-redux'
import AlertComponent from 'components/Common/AlertComponent'

/****
Add Inactive Links End Path here in the array,
if you dnt want to make the left side bar active for the url added
Example Path : http://localhost:8080/#/applicationSettings/about?_k=qj2hto
Then Add --- applicationSettings/about to the array
****/
var InactiveLinks = [ "addcloud",
                      "usermanagement/userInfoTab",
                      "billingInformation/billingInfoDetails",
                      "applicationSettings/about",
                    ]
function containsAny(str, substrings) {
    for (var i = 0; i != substrings.length; i++) {
       var substring = substrings[i];
       if (str.indexOf(substring) != - 1) {
         return substring;
       }
    }
    return null; 
}
const MainContainer = React.createClass({
  propTypes: {
    isAuthed: PropTypes.bool.isRequired,
  },
  getInitialState: function() {
    return {
      activeLink: '/startdashboard',
    }
  },
  componentWillMount: function() {
    
    let currLocation = window.location.href;
    let parArr = currLocation.split("?")[0].split("#")[1];
    if(parArr.indexOf("infrastructure")>-1){
      this.setState({activeLink:'/infrastructure/allresources'})
    }else if(parArr.indexOf("report")>-1){
      this.setState({activeLink:'/report/allreports'})
    }else if(parArr.indexOf("rse")>-1){
      this.setState({activeLink:'/rse/allalerts'})
    }
    else{
       this.setState({activeLink:parArr})    
    }
    //this.setState({activeLink: '/startdashboard'})
    
  },
  componentWillReceiveProps(){
    //Condition for make side bar inactive for other links
    if(containsAny(window.location.href,InactiveLinks)!=null)
    {
      this.setState({activeLink:''}) 
    }

  },


  onNavItemClick: function(clickedLink)  {
    console.log('inMainOnClick:'+clickedLink)
    //console.log('in main onNavItemClick:'+e.target.hash)
    if (typeof clickedLink != 'undefined' ) {
      console.log('defined')
      this.setState({ activeLink: clickedLink})
      // reset for next time dashboard load
      if ('/logout' === clickedLink)
        this.setState({activeLink: '/startdashboard'})
      
    } else {
      console.log('undefined'+clickedLink)
      this.setState({activeLink: '/startdashboard'})
    }

  },

  render () {
    let dashboardLink = '/dashboard'
    if(!this.props.context.dashboardSetup){
      dashboardLink = '/startdashboard'
    }
    return (
      <table width='100%' >
        <tbody>
        <tr>
          <td >
            <span>
              <Navigation isAuthed = {this.props.isAuthed}
                          activeLink = {this.state.activeLink}
                          onClickHandler = {this.onNavItemClick}
                          dashboardLink = {dashboardLink}   />
            </span>
          </td>
          <td width='99%'>
            <span>
              {this.props.children}
              <AlertComponent ref={(a) => global.Alert = a}/>
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    )
  },
})

export default connect(
  ({users,context}) => ({isAuthed: users.isAuthed,context:context})
)(MainContainer)
