import React, {PropTypes} from 'react'
import {Button, Grid, Row, Col,Popover,OverlayTrigger} from 'react-bootstrap'
import {blueBtn, btnPrimary, paddingThirty, spacer} from 'sharedStyles/styles.css'
import { BarChart, PieChart } from 'react-d3-components'
import {EmptyStateLogos, Header} from 'components'
import ErrorMessages from 'constants/ErrorMessages';
import {checkUsage}from 'helpers/context'

const MySevirityChart = React.createClass({
  propTypes: {
    high: PropTypes.number.isRequired,
    med: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    selectedProfile: PropTypes.string.isRequired,
  },
  tooltipPie: function(x, y) {
    return y.toString();
  },
  render: function () {
    const scale = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484']);
    let data = {
        label: this.props.description,
        values: [ {x: 'Low ',    y: this.props.low},
                  {x: 'Medium',    y: this.props.med},
                  {x: 'High',   y: this.props.high},
                 ]
    };
    let sort = null; // d3.ascending, d3.descending, func(a,b) { return a - b; }, etc...
    let style = {textAlign: 'center'}
    let arrow = ''
    if (this.props.description === this.props.selectedProfile) {
      //arrow='V'
      style = {textAlign: 'center', backgroundColor: 'White'}

    }
    return (
      <div>
        <PieChart
                data={data}
                width={370}
                height={220}
                colorScale={scale}
                radius={60}
                tooltipHtml={this.tooltipPie}
                tooltipOffset={{top: 175, left: 200}}
                innerRadius={0}
                margin={{top: 0, bottom: 10, left: 30, right: 30}}
                sort={sort}
                />

      </div>
    )
  }
})


const ComplianceStart = React.createClass({
    render: function () {
      const scale = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484']);
      let data = [
        {
        label: 'Low',
        values: [{x: '07/16/2016', y: 10}, {x: '07/17/2016', y: 4}, {x: '07/18/2016', y: 13},

            ]
        },
        {
        label: 'Med',
        values: [{x: '07/16/2016', y: 6}, {x: '07/17/2016', y: 8}, {x: '07/18/2016', y: 5},

            ]
        },
        {
        label: 'High',
        values: [{x: '07/16/2016', y: 6}, {x: '07/17/2016', y: 8}, {x: '07/18/2016', y: 5},


          ]
        },
        {
        label: 'Passed',
        values: [{x: '07/16/2016', y: 14}, {x: '07/17/2016', y: 4}, {x: '07/18/2016', y: 11},


          ]
        },
      ]
      let bgstyle = { backgroundColor: 'White'}
      return (
        <div style={{marginLeft: 20,marginTop: 50}}>
          <Grid><Row>
           <Col xs={6} style={bgstyle}>
            <h3 style={{color: 'lightGrey'}}>RISK SECURITY AND COMPLIANCE SUMMARY</h3>
            <BarChart
                    groupedBars
                    data={data}
                    width={600}
                    colorScale={scale}
                    height={220}
                    margin={{top: 10, bottom: 50, left: 30, right: 50}}/>
          </Col>
          <Col xs={5} style={{backgroundColor:'White', marginLeft: 50}}>
              <h3 style={{color: 'lightGrey'}}>RESULT DETAILS</h3>
              <MySevirityChart style={{paddingLeft: 50}} high={230} low={390} med={400}
                    description='HIPPA' selectedProfile='HIPAA' />
          </Col>
          </Row></Grid>
        </div>
    )
  }
})


const Intro = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr ><td style={{textAlign: 'center',  fontWeight: 'bold', color: '#454855', paddingBottom: 10}}>
                    WANT TO CHECK YOUR CURRENT SECURITY POSTURE?</td></tr>
                  <tr><td style={{textAlign: 'center', color: '#737684'}}>Your system’s risk, security and compliance summary, failures and severity levels</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>will be visible at-a-glance here. </td></tr>
        </tbody>
      </table>
    )
  }
})


const DashboardStart = React.createClass({

  redirectToWizard(){
   checkUsage()
   .then((response) =>{
      if(response !== null && response.data.output !== null && response.data.output === "time_completed")
      {
        Alert.show(ErrorMessages.LICENSE_EXPIRED);
      }else if(response !== null && response.data.output !== null && response.data.output === "instance_completed")
      {
        Alert.show(ErrorMessages.MAX_RESOURCES);
      }
      else{
        window.location = '#/cloud/'+ -1;
      }
   })
   .catch((error) => {
      window.location = '#/cloud/'+ -1;
   })
  },
  render: function () {
  let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:300,height:140,paddingLeft:20,padding:10}

   const discoverandTestButtonHover = (
    <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popover-basic'>
      You are just one step away from running your first assess! All you have to do is select policy packs that you would like us to assess for risk, security and compliance.
    </Popover>
    );
    return (
      <div style={{position:'relative', marginBottom:40}}>
        <Header name='Dashboard'/>
        <Intro />
        <ComplianceStart />
        <div style={{marginTop: 80}} ></div>
        <EmptyStateLogos color='#00C484' hrefColor='#4C58A4'/>
        <div style={{marginTop: 80}} ></div>
        <table style={{width: '100%'}}><tbody>
        <tr><td style={{textAlign: 'center'}}>Discover resources and assess for risk, security and compliance</td></tr>
        <tr><td style={{textAlign: 'center'}}>
        <OverlayTrigger placement="right" overlay={discoverandTestButtonHover}>
          <Button onClick={this.redirectToWizard} bsStyle='primary' bsSize='large' className={btnPrimary} style={{borderRadius: 0, marginTop: 20,marginBottom: 20}}>
          Continue Discovering and Assessing
          </Button>
         </OverlayTrigger>
          </td></tr></tbody></table>
      <div style={{position: 'absolute', bottom: -2, textAlign:'right', width: '95%', backgroundColor: '#F9FAFC'}}>
          <a href="#/dashboard"> skip </a>
      </div>
      </div>
    )
  },
})

export default DashboardStart
