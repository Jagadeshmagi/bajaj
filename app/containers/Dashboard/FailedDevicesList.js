import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import {Table, Column, Cell} from 'fixed-data-table';
import {failedDeviceCount} from 'helpers/dashboard'
import moment from 'moment'

class FailedDevicesList extends React.Component {
  constructor(props) {
  super(props);
  this.state={
      tableData:[ ]
    }
  }

  componentDidMount(){
    let deviceId = []
    let widowLocation = window.location.href
    let result1= widowLocation.slice(widowLocation.indexOf('failed-devices-list/') + 20)
    let result2 = result1.indexOf('?')
    let finalResult = result1.slice(result2)
    let myresult = result1.slice(0, - finalResult.toString().length)
    deviceId.push(myresult)

    console.log('Find Array',myresult)
    
    /****** Get failed Device Count ***********/
    failedDeviceCount(deviceId)
    .then((data) => {
      this.setState({tableData:data.output})
      console.log('responce responce responce', data.output)
    })
    .catch((error) => console.log("Error in getting data", error))
  }

  render() {
    const rows = this.state.tableData
    let navColorStyle = {
      backgroundColor: '#00C484', border: 0, borderRadius: 0,
      marginBottom: 0, paddingTop: 10,
      color: 'white', fontSize: 24, height: 80, textAlign: 'center', marginBottom:20}

    return(
      <div>
        <div style={navColorStyle}>
          <div style={{display:'inline-block', float:'left', paddingLeft:15}}>
            <svg style={{align:'center'}}  width="60px" height="60px"  viewBox="656 156 288 288" version="1.1" >
              <g id="Group-2" stroke="none" strokeWidth="5" fill="none" fillRule="evenodd" transform="translate(660.000000, 160.000000)">
                <path d="M238.529268,238.300807 C213.343231,263.458971 178.555888,279.020052 140.127469,279.020052 C63.2799069,279.020052 0.978093317,216.784994 0.978093317,139.999073 C0.978093317,63.2177865 63.2799069,0.978094172 140.127469,0.978094172 C189.701753,0.978094172 233.213762,26.8684345 257.861755,65.845283" id="Stroke-1" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
                <path d="M193.088648,192.956335 C179.516946,206.51088 160.773525,214.893845 140.072736,214.893845 C98.6757973,214.893845 65.0990531,181.357351 65.0990531,139.993976 C65.0990531,98.6306005 98.6757973,65.0941063 140.072736,65.0941063 C161.752209,65.0941063 181.284143,74.2926611 194.971803,88.9871786" id="Stroke-3" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
                <path d="M158.681646,140 C158.681646,150.231944 150.383705,158.536131 140.128396,158.536131 C129.89164,158.536131 121.575146,150.231944 121.575146,140 C121.575146,129.768056 129.89164,121.463869 140.128396,121.463869 C150.383705,121.463869 158.681646,129.768056 158.681646,140 L158.681646,140 Z" id="Stroke-5" stroke="#FFFFFF" strokeWidth="8"></path>
                <path d="M279.504121,139.995366 C279.504121,155.35255 267.045614,167.799562 251.674246,167.799562 C236.302878,167.799562 223.844371,155.35255 223.844371,139.995366 C223.844371,124.642816 236.302878,112.19117 251.674246,112.19117 C267.045614,112.19117 279.504121,124.642816 279.504121,139.995366 L279.504121,139.995366 Z" id="Stroke-7" stroke="#FFFFFF" strokeWidth="8"></path>
                <path d="M153.19174,153.046655 L238.527413,238.298954" id="Stroke-9" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
            </svg>
          </div>
          <div style={{paddingTop:15}}>Failed Devices List</div>
        </div>

        <div className='row' style={{margin:0}}>
          <div className='tableWrapper' style={{margin:'0 auto'}}>
            <Table
              rowHeight={50}
              rowsCount={this.state.tableData.length}
              width={1200}
              height={400}
              margin={'0 auto'}
              headerHeight={50}>
              <Column
                header={<Cell>ASSET TYPE</Cell>}
                cell={({rowIndex}) => (
                  <Cell style={{textAlign:'center'}}>
                    {this.state.tableData[rowIndex].assettype == 'ONPREM' ? 'On-prem' : this.state.tableData[rowIndex].assettype}
                  </Cell>
                )}
                width={170}
              />
              <Column
                header={<Cell>CREATED (UTC)</Cell>}
                cell={({rowIndex}) => {
                let createdTime = this.state.tableData[rowIndex].createtime
                if(createdTime === null || createdTime === "null" || createdTime=== undefined)
                  createdTime = '-';
                else{
                  createdTime = moment.utc(createdTime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                }
                return(
                <Cell>
                  {createdTime}
                </Cell>
                )}}
                width={200}
              />
              <Column
                header={<Cell>IP ADDRESS</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {this.state.tableData[rowIndex].ipaddress}
                  </Cell>
                )}
                width={200}
              />
              <Column
                header={<Cell>STATUS</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {this.state.tableData[rowIndex].test_status.charAt(0) + this.state.tableData[rowIndex].test_status.slice(1).toLowerCase()}
                  </Cell>
                )}
                width={170}
              />
              <Column
                header={<Cell>LAST MODIFIED (UTC)</Cell>}
                cell={({rowIndex}) => {
                let modifyTime = this.state.tableData[rowIndex].modifytime
                  if(modifyTime === null || modifyTime === "null" || modifyTime=== undefined)
                    modifyTime = '-';
                  else{
                    modifyTime = moment.utc(modifyTime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                  }
                return(
                  <Cell>
                    {modifyTime}
                  </Cell>
                )}}
                width={200}
              />
              <Column
                header={<Cell>GROUP NAMES</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {this.state.tableData[rowIndex].groupnames}
                  </Cell>
                )}
                width={260}
              />
            </Table>
          </div>
        </div>
      </div>
    )
 }
}

export default FailedDevicesList
