import React from 'react'
import ReactDOM from 'react-dom'
import {Cell} from 'fixed-data-table'
import {Button,Col,Overlay,Popover} from 'react-bootstrap'

export const IpAddressCell = ({rowIndex, data, col,container, ...props}) => {
    let cellData = data[rowIndex][col]
    /*
    if(data[rowIndex]['assetType'] === 'Aws')
      cellData = data[rowIndex]['privateIpAddress']
    */
    return(
    <Cell  {...props}>
      <IPClass data={cellData} container={container}/>
    </Cell>
)}

export const IPClass = React.createClass({
  getInitialState() {
    return { show: false };
  },
  toggle() {
    this.setState({ show: !this.state.show });
  },
  render() {

    return (
      <div style={{position: 'relative' }}>
        <a ref="ipLink" onClick={this.toggle}>{this.props.data}</a>
        <Overlay
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement="bottom"
          container = {this.props.container}
          containerPadding={50}
          target={() => ReactDOM.findDOMNode(this.refs.ipLink)}
        >
          <DeviceDetailsPopover close={this.toggle}/>
        </Overlay>
      </div>
    );
  },
});


export const DeviceDetailsPopover = React.createClass({
  render() {
    let style = {
        ...this.props.style,
        position: 'absolute',
        maxWidth:'100%',
        backgroundColor: '#FFF',
        borderRadius: 0,
        width:1145,
        zIndex: 2,
        fontSize: 14,
    }
    return (
      <Popover style={style} arrowOffsetLeft={50} placement="bottom" id="devicePopover">
       <div className="pull-right"><a href="javascript:void(0)" style={{fontSize:'18px'}} onClick={this.props.close}>x</a></div>
       <div>
          <Col xs={3}>
            <h4>Configuration</h4>
            Start using this tool once you discover resources.We run automated compliance checks for you.
            You will get quick visibility into your entire sytsem's security status.
          </Col>
          <Col xs={3}>
           <h4>Policy pack</h4>
            Start using this tool once you discover resources.We run automated compliance checks for you.
            You will get quick visibility into your entire sytsem's security status.           
          </Col>
          <Col xs={3}>
           <h4>Compliance</h4>
            Start using this tool once you discover resources.We run automated compliance checks for you.
            You will get quick visibility into your entire sytsem's security status.           
          </Col>
          <Col xs={3}>
           <h4>Tests</h4>
            Start using this tool once you discover resources.We run automated compliance checks for you.
            You will get quick visibility into your entire sytsem's security status.           
          </Col> 
                  
       </div>
       <div><Col xs={12}><hr/></Col></div>
       <div className="pull-right">
          <Button style={{marginTop:'-10px',marginBottom:'5px'}}>View details</Button>
       </div>
      </Popover>
    );
  },
});
