import React from 'react'
import {mytable, blueBtn} from 'sharedStyles/styles.css'
import { Glyphicon, ProgressBar, Button} from 'react-bootstrap'

export default function AlertTable(props) {
  let posstyle = { 
      position: 'absolute', 
      top:-15, 
      right: 0,
      width: '154px',
      float: 'right',
      margin: 'auto'
  }
  return (
    <div style={{margin:'10px 70px 0 60px', position:'relative'}}>
      <Button style={posstyle} className={blueBtn} bsSize='large'>Create New Alert</Button>
     
    </div>
  )
}