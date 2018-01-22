import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import {Header} from 'components'
import {blueBtn, spacer} from 'sharedStyles/styles.css'
import {container} from './styles.css'
import TagButtonMenu from 'components/TagButton/TagButtonMenu'


const ReportContainer = React.createClass({
  getInitialState: function() {
    return {
      activeTab: '#/report/allreports',
    }
  },
  onItemClick: function(e)  {
    //console.log('InfMain'+e.target.hash)
    this.setState({ activeTab: e.target.hash})
  },
  render() {
    let tagNames = [
      {linkName:'/report/allreports', displayName:'All Reports'},
      //{linkName:'/report/archived', displayName:'Archived'},
     ]
    let posstyle = { position: 'relative', top: 30, left: 0 }
    //console.log(tagNames)
    return (
      <div >
        <Header name='Reports'/>
        <div >
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
      </div>
    )
  },
})

export default ReportContainer
