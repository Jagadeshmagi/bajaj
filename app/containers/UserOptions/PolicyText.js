import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {ReportHeader} from '../../components/Report/ReportCommon'
import Policy from './Policy'
import {Copy} from './Instructions'


const PolicyContainers = React.createClass({
  render(){
    return (
      <div>
        <ReportHeader name={"Policy"} />
        <Row>
          <Col lg={3}></Col>
          <Col lg={6} style={{margin:"10px 0px"}}>
              <Copy
                textAreaHeight={200}
                showText={"Show Policy"}
                requiredText={Policy.policy}
              />
          </Col>
        </Row>
        <Row style={{paddingBottom:-10}}>
          <Col lg={3}></Col>
          <Col lg={6}>
            <div><pre style={{backgroundColor:"#EEF0F5", color:"#4C58A4", border:"none"}}>{Policy.policy}</pre></div>
          </Col>
          <Col lg={3}></Col>
        </Row>
      </div>
    )
	}
})

export default PolicyContainers
