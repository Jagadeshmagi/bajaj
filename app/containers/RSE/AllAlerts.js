import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {blueBtn , btnPrimary, mytable, selectStyle} from 'sharedStyles/styles.css'
import {Button,Col, Form,OverlayTrigger ,Popover ,ControlLabel ,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {ResourceColumnChooserClass} from 'containers/Infrastructure/ResourceColumnChooserCell'
import DatePicker from 'react-bootstrap-date-picker'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import {AccessCell,ArrayLinkCell,ScoreCell,ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, GroupsCell} from 'components/Table/Table'
import {SpinnyLogo} from 'containers'
import moment from 'moment'
import TestTable from 'containers/Infrastructure/TestTable'
import {getAllAlerts,getListOfAccountsFilter} from 'helpers/alerts'
import DeleteAlert from './DeleteAlert'
import Joi from 'joi-browser'
import {AlertCountStatus} from './AlertCountStatus'
import EditAlert from 'containers/RSE/EditAlert'
import DisableAlert from './DisableAlert'
import EnableAlert from './EnableAlert'
import Select from 'react-select';


function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

function findIndex(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return i;
}



const AlertActionButtons = React.createClass({
  render: function () {
     const style={marginBottom: 15}
      let count = this.props.selectedList.length
      let selectedCount = this.props.selectedList.length
        let selectedAlert = {}
        let selectedAlerts = []

         let enableFlag=0,disableFlag=0,countenabled=0,countdisabled=0;

        if(selectedCount === 1){
          console.log('Count 1 ', this.props.selectedList, this.props.list)
          selectedAlert = findElement(this.props.list,"id",this.props.selectedList[0]);
          selectedAlerts.push(selectedAlert);

        }else if(selectedCount > 1){
            this.props.selectedList.map((id) => {
             let alertdata= findElement(this.props.list,"id",id)
              selectedAlerts.push(alertdata);
              if(alertdata && alertdata["active"]===true){
                countenabled = countenabled+1;


              }else{
                countdisabled=countdisabled + 1;

              }
            })
        }
       
        if(selectedCount==1){
         if(selectedAlerts[0] && selectedAlerts[0].active === true){
            enableFlag=0;
            disableFlag=1;
         }
         else{
            enableFlag=1;
            disableFlag=0;

         }
       
        }
        else {
           /*selectedAlerts.map((alert) => {
              if(alert["active"]===true){
                countenabled = countenabled+1;


              }else{
                countdisabled=countdisabled + 1;

              }


          })*/

           if(countdisabled==selectedCount){
            enableFlag=1;
            disableFlag=0;
           }else if(countenabled==selectedCount){
             disableFlag=1;
             enableFlag=0;
           }
           else{
            disableFlag=0;
            enableFlag=0;
           }

        }



        return(
        count > 0
        ?

          <div style={{paddingLeft: 20, paddingTop: 16,  fontSize: 18}}>
           { /*{totalGroupsCount} Groups &nbsp;*/}
            {count} Alerts selected: {' '}
            {count === 1 ? <span> <EditAlert selectedAlerts={selectedAlerts} refreshList={this.props.refreshList} removeFromSelected={this.props.removeFromSelected} /> {' '} | {' '}</span> : <noscript />}
            {count >= 1 && disableFlag==1 ? <span><DisableAlert selectedAlerts={selectedAlerts} refreshList={this.props.refreshList} removeFromSelected={this.props.removeFromSelected}>Disable</DisableAlert> {' '} | {' '}</span>:<noscript />}
            {count >= 1 && enableFlag ==1 ? <span><EnableAlert selectedAlerts={selectedAlerts} refreshList={this.props.refreshList} removeFromSelected={this.props.removeFromSelected}>Disable</EnableAlert> {' '} | {' '}</span>:<noscript />}
            {count>=1? <span><DeleteAlert selectedAlerts={selectedAlerts} removeAlert={this.props.removeAlert}/></span>:<noscript />}

          </div>
          :
          <noscript />
        )




  }
})

const FilterSelection = React.createClass({
  getInitialState(){
    return{
      accountValue:"",
      stateValue:"",
      severityValue:"",
      accounts:[],
      states:[],
      severities:[],
    }
  },
  componentDidMount(){
    this.setState({accounts: this.props.accounts,states:this.props.states,severities:this.props.severities});

  
  },

  componentWillReceiveProps(nextProps){
    if(nextProps.accounts!==this.props.accounts){
       this.setState({accounts: nextProps.accounts});
    }
    if(nextProps.states!== this.props.states){
        this.setState({states:nextProps.states})
    }
    if(nextProps.severities!== this.props.severities){
       this.setState({severities:nextProps.severities})
    }
  },
  onState(e){
 
    this.setState({stateValue:e},function(){

      this.props.stateChange(this.state.stateValue);
    })

  },
  onSeverity(e){

    this.setState({severityValue:e},function(){
      this.props.severityChange(this.state.severityValue);
    })

  },
  onAcccount(e){
    
    this.setState({accountValue:e},function(){
      this.props.accountChange(this.state.accountValue);
    })

  },
  render: function () {
    let selectStyle1 = { border:'1px solid #4C58A4', height:38,fontSize: 18,color:'#4C58A4', marginLeft: 8,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:0, width:'165px',backgroundSize: '6px 6px,6px 6px, 2.5em 2.5em'}
    return (
      <div style={{display:'flex',justifyContent:'flex-end'}} className="pull-right">
      <span style={{marginRight:10}}>
          <Select  className="dropdownFilter"
                  placeholder={<i>Accounts</i>}
                  name=""
                  inputProps={{"id":"acccounts"}}
                  value={this.state.accountValue}
                  options={this.state.accounts}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}            
                  onChange={this.onAcccount}/>
       </span>
       <span style={{marginRight:10}}>

          <Select  className="dropdownFilter"
                  placeholder={<i>State</i>}
                  name=""
                  inputProps={{"id":"state"}}
                  value={this.state.stateValue}
                  options={this.state.states}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}            
                  onChange={this.onState}/>
        </span>
        <span>
            <Select  className="dropdownFilter"
                  placeholder={<i>Severity</i>}
                  name=""
                  inputProps={{"id":"severity"}}
                  value={this.state.severityValue}
                  options={this.state.severities}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}            
                  onChange={this.onSeverity}/>
        </span>


       {/*} <select className={selectStyle} style={selectStyle1} id="policyPack" onChange={this.props.accountChange}>
        <option value="">Accounts</option>

          {this.state.accounts.map((option) => {
             
              return(<option key={option.label} value={option.value}>{option.label}</option>)
            }
          )}

        </select>*/}
        


       {/* <select className={selectStyle} style={selectStyle1} id="group" onChange={this.props.stateChange}>
          <option value="">State</option>
          <option value="ON">ON</option>
          <option value="OFF">OFF</option>
        </select>*/}
        {/*<select className={selectStyle} style={selectStyle1} id="group" onChange={this.props.severityChange}>
          <option value="">Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>

        </select> */}
      </div>
    )
  }
})



const AlertFilterSelector = React.createClass({
  getInitialState: function(){
    return {
      // valueFrom: '',
      // valueTo: '2016-11-23T14:48:00+00:00',
      valueFrom: "",
      valueTo: "",
      fromValid:false,
      toValid:false,
      dateValid: false,
      showDateError: false,
      beforeTodayTo: true,
      beforeTodayFrom: true
    }
  },
  componentDidMount(){
    this.setState({
      valueFrom:this.props.fromDate,
      valueTo:this.props.toDate
    })

  },
  componentWillReceiveProps(nextProps) {
    if(this.state.valueFrom != nextProps.fromDate){
      this.setState({
        valueFrom:nextProps.fromDate
      })
    }
    if(this.state.valueTo != nextProps.toDate){
      this.setState({
        valueTo:nextProps.toDate
      })
    }
  },
  handleChangeFrom: function(value) {
    var today = moment().startOf('day')
    var tomorrow= today.add('day', 1)
    var beforeToday = moment(value).isBefore(tomorrow)
    let from_schema = {from: Joi.string().required()}
    let result = Joi.validate({from: value}, from_schema)

    this.setState({
      beforeTodayFrom: beforeToday
    })

    if (!value || result.error) {

      this.setState({
        valueFrom: value,
        fromValid:false
      }, ()=>{console.log("this.state.fromValidthis.state.fromValid =P", this.state.fromValid); this.checkDateValid()});
    } else {
      this.setState({
        valueFrom: value,
        fromValid:true
      }, ()=>{console.log("this.state.fromValidthis.state.fromValid", this.state.fromValid); this.checkDateValid()});
    }
    this.props.fromDateChange(value)
  },
  handleChangeTo: function(value) {
    var today = moment().startOf('day')
    var tomorrow= today.add('day', 1)
    var beforeToday = moment(value).isBefore(tomorrow)
    console.log("whaaawhaaawhaaawhaaa", beforeToday)
    // value is an ISO String.
    let to_schema = {to: Joi.string().required()}
    let result = Joi.validate({to: value}, to_schema)
    this.setState({
      beforeTodayTo: beforeToday
    })
    if (!value || result.error) {
      this.setState({
        valueTo: value,
        toValid:false
      }, ()=>{console.log("this.state.toValidthis.state.toValid", this.state.toValid); this.checkDateValid()});
    } else {
      this.setState({
        valueTo: value,
        toValid:true
      }, ()=>{console.log("this.state.toValidthis.state.toValid", this.state.toValid); this.checkDateValid()});
    }
    this.props.toDateChange(value)
  },
  checkDateValid(){
    console.log("this.state.fromValid && this.state.toValid", this.state.valueFrom, this.state.valueTo)
    console.log("this.state.fromValid && this.state.toValid", this.state.fromValid, this.state.toValid, this.state.valueFrom, this.state.valueTo, this.state.valueFrom < this.state.valueTo)
    // if(this.state.fromValid && this.state.toValid){
      if(this.state.valueFrom <= this.state.valueTo){
        this.setState({
          dateValid:true,
          showDateError:false
        });
      } else {
        this.setState({
          showDateError:true
        });
      }
    // } else {
    //   this.setState({
    //     dateValid:false
    //   });
    //   if(this.state.valueFrom < this.state.valueTo) {
    //     this.setState({
    //       dateValid:false
    //     });
    //   } else {
    //     this.setState({
    //       showDateError:false
    //     });
    //   }
    // }
  },
  render: function () {
    let errorMessage;
    if(this.state.showDateError){
      // errorMessage = (<div>Please select a "To" date that is later that is later than the "From" date</div>)
      errorMessage = (<span style={{color:"red", marginLeft:"40px"}}>"To" date must be later than "From" date</span>)
    } if (!this.state.beforeTodayTo || !this.state.beforeTodayFrom) {
      errorMessage = (<span style={{color:"red", marginLeft:"40px"}}>"To" and "From" need to be before current date</span>)
    } if (this.state.showDateError && !this.state.beforeTodayTo || this.state.showDateError && !this.state.beforeTodayFrom) {
      errorMessage = (<span style={{color:"red", marginLeft:"40px"}}>"To" date must be later than "From" date and before current date</span>)
    }

     return (
      <div className="container-fluid col-lg-12 col-sm-12 col-md-12 col-xs-12">
          <div className="col-lg-5 col-sm-5 col-md-5 col-xs-5">
            <Form inline>
              <FormGroup className="datePick" controlId="formInlineName">
                <span style={{color:'#737685', paddingRight: 5}}>From</span>
                {' '}
                <DatePicker value={this.state.valueFrom} onChange={this.handleChangeFrom} />
              </FormGroup>
              {' '}&nbsp;&nbsp;&nbsp;
              <FormGroup className="datePick" controlId="formInlineEmail">
                <span style={{color:'#737685', paddingRight: 5}}>To</span>
                {' '}
                <DatePicker value={this.state.valueTo} onChange={this.handleChangeTo} />
              </FormGroup>
            </Form>
            {errorMessage}
          </div>
           <div style={{paddingTop:4, paddingRight:45}} className="col-lg-7 col-sm-7 col-md-7 col-xs-7">
            <FilterSelection
              accountChange={this.props.accountChange}
              stateChange={this.props.stateChange}
              severityChange={this.props.severityChange}
              accounts={this.props.accounts}
              states={this.props.states}
              severities={this.props.severities} />
            
          </div>
        </div>

    )
  }
})



const AlertsInitialState = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>You currently have no alerts available</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>Would you like to add a new alert?</td></tr>
          <tr><td style={{textAlign: 'center'}}>
            <Button href={'#/createalert'} bsStyle='primary' bsSize='large' className={btnPrimary} style={{borderRadius: 0, marginTop: 20,marginBottom: 20,width:'300px'}}>
                Create New Alert
            </Button>
          </td></tr>
        </tbody>
      </table>
    )
  }
})

const AllAlerts = React.createClass({
  getInitialState(){
    return{
      accounts:[],
      states:[{label:"State",value:""},{label:"ON",value:"on"},{label:"OFF",value:"off"}],
      severities:[{label:"Severity",value:""},{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}],
      loading:false,
      selectedList: [],
      selectAll:false,
      fromDate:'',
      toDate:'',
      filterList:{},
      list:[],
      noOfAlerts:true,
      selected: [],
      columnsList:[
        {name:'name', displayText:'Alert', show:true, columnName: "ALERT NAME", width:150},
        {name:'description', displayText:'Description', show:true, columnName: "DESCRIPTION", width:120},
        {name:'accounts', displayText:'Accounts', show:true, columnName: "ACCOUNTS", width:120},
        {name:'triggered', displayText:'Triggered', show:true, columnName: "TRIGGERED", width:150},
        {name:'state', displayText:'State', show:true, columnName: "STATE", width:130},
        {name:'severity', displayText:'Severity', show:true, columnName: "SEVERITY", width:100},
        {name:'notification', displayText:'Notification', show:false,  columnName: "NOTIFICATION", width:130,},
        {name:'lastseen', displayText:'Last seen', show:false, columnName: "LAST SEEN", width:250},
        {name:'servicename', displayText:'Service Name', show:false, columnName: "SERVICE NAME", width:130}
      ],
      all:false,
      dataLoad:true,
      selectedaccount:"",
      selectedseverity:"",
      selectedstate:""

    }
  },
   contextTypes: {
    router: PropTypes.object.isRequired,
  },
  refreshList(){
   this.setState({list:[]},function(){
    getAllAlerts()
    .then((alert) => {

      if(alert){
        this.setState({
          list:alert
        },function(){
          console.log("list***********"+JSON.stringify(this.state.list))
        })
      }
    })
    .catch((error) => console.log("Error in getting images list:"+error))
   })
  },
 componentDidMount () {
    let toDate = new Date();
    let currentDate = new Date();
    let fromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
    // alert(fromDate.toISOString())
    let newFromDate =  fromDate.toISOString().slice(0,11).concat('00:00:00.000Z')
    // alert(newFromDate)
    let newTodate=toDate.toISOString().slice(0,11).concat('11:59:59.000Z')
    //this.setState({toDate:toDate.toISOString(),fromDate:newFromDate})
    this.setState({toDate:newTodate,fromDate:newFromDate})

    this.setState({selected: []});
    let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })
   this.setState({dataLoad:true})
    getAllAlerts()
    .then((alert) => {

      if(alert){
        this.setState({list:[]},function(){
          this.setState({list:alert,
          dataLoad:false
        },function(){
          if(this.state.list.length>0)
            this.setState({noOfAlerts:false})
          else
            this.setState({noOfAlerts:true})
          console.log("list***********"+JSON.stringify(this.state.list))
        })
        })
      }
    })
    .catch((error) => console.log("Error in getting images list:"+error))



    getListOfAccountsFilter()
    .then((res)=>{
        console.log("success get accounts")
        let acclist=[]
         let acc={};
          acc.label="Accounts"
          acc.value=""
          acclist.push(acc)
        res.map((ac)=>{
         acc={}
         
          acc.label = ac.cloudtrailaccount
          acc.value = ac.cloudtrailaccount
           acclist.push(acc)

        })
        this.setState({accounts:acclist},function(){
          console.log("this.state.accounts",this.state.accounts)
        })
    })
    .catch((er)=>{

      console.log("failed get accounts")

    })


    /* let toDate = new Date();
    let currentDate = new Date();
    //let fromDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    let fromDate = new Date();

    this.setState({toDate:toDate.toISOString(),fromDate:fromDate.toISOString()},function(){

    })*/
  },
  columnChooserToggle() {
    console.log("goodness gracious")
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
  },
  columnDisplayChangeHandler(colName){
    console.log("THIS CHANGE THING IS ALSO CALLED")
    console.log(this.state.columnsList)
    let newColumnsList = [];
    let that=this;
    this.state.columnsList.forEach(function(col){
      // console.log("INSIDE FOREACH STATEMENT", col.name, colName)
      if(col.name === colName){
        newColumnsList.push({...col,show:!col.show});
        that.setState({columnsList:newColumnsList})
        console.log("INSIDE CORRECT if STATEMENT", col.name, colName, newColumnsList, that.state.columnsList)
      }
      else{
        newColumnsList.push(col);
        console.log("INSIDE if STATEMENT")
      }
    })
    // this.setState({columnsList:newColumnsList})
    console.log("AFTER STATEMENT", this.state.columnsList)
  },
  selectAllHandler(){
   /* if(!this.state.all){
      this.setState({dataLoad:false});
    }*/
    this.setState({all:!this.state.all},
      (res)=>{
        console.log("this.state.all ", this.state.all, this.state.selected)
        if(this.state.all === true){
         getAllAlerts()
         .then((alert) => {

           let selectList = [];
              alert.map((r) =>
             {
               selectList.push(r.id)
             })
           this.setState({
             selected: selectList,
             list:alert,
          }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
         })
          .catch((error) => console.log("Error in getting resources list:"+error))
        } else if (this.state.all === false){
          this.setState({
            selected: []
          })
        }
      })
  },
  updateList(newList){
    console.log("PRE___________", this.state.list, newList)
    this.setState({
      list:newList
    }, (res)=>{console.log("POST___________", this.state.list)})
  },
 /* getAlertsList(scan){
    var start = this.state.list.length+50
    if(scan){
      start = 50
    }
    this.setState({reRenderStatus:false});
    this.setState({list:[]},function(){
      getAllAlerts()
      .then(
        (data) =>  {
          if(data){
            this.setState({list:data}
              // , ()=>{this.updateDiscoveryStatus("11,Completed:34,Total:125")}
              // , ()=>{this.updateDiscoveryStatus({name: "notification", length: 106, processId: 4729, channel: "resourcescan", payload: "Scan Completed for worklogResourceID:5,assetgroupID:5,ScansCompleted:30,TotalScans:30"})}

            );
            this.setState({reRenderStatus:true, loadingDiv:false});
          } else {
            this.setState({list:data});
            this.setState({reRenderStatus:true, loadingDiv:false});
          }
        }
       )
      .catch((error) => console.log("Error in getAssetGroupsList in container:" + error))
    })
  },*/
  /*updateCountAndLastseen(id, count,lastseen){
     let newList = this.state.list.slice();
    let reportInx = -1;
    for (var i=0; i < this.state.list.length; i++)
      if (this.state.list[i]["id"] == id)
        reportInx = findIndex(this.state.list, "id", id)


    if(reportInx > -1){
      newList[reportInx].triggered=count;
      newList[reportInx].lastseen=lastseen;
      this.setState({list:[]},function(){
        this.setState({list:newList})
      });
    }



  },
*/



  getTableColumn: function(colName){
      let colObj = findElement(this.state.columnsList,"name",colName);
      let dataList = this.state.list;
      if(colObj != null && colObj["show"]){
        switch(colName){
          case 'name' :
            return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="name"
              header={<Cell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ALERT NAME</Cell>}
              flexGrow={3}

              cell={({rowIndex, ...props}) => {

                   let detailLink = '#AlertReport/'+dataList[rowIndex]["id"]+'?starttime='+this.state.fromDate+'&endtime='+this.state.toDate
                     if(dataList[rowIndex]["active"]&&dataList[rowIndex]["active"]!=null&&dataList[rowIndex]["active"]==true){
                      return(
                        <Cell {...props}>
                          <a href={detailLink} target='_blank' title='Report'>{dataList[rowIndex]["name"]}</a>
                        </Cell>
                      )
                    }
                    else{

                      return(
                        <Cell {...props}>
                          {dataList[rowIndex]["name"]}
                        </Cell>
                      )

                    }

                   }
                  }


             width={colObj['width']} />

            case 'description' :
              return <Column
                isReorderable={true}
                isResizable={true}
                columnKey="description"
                align='center'
                header={<Cell>DESCRIPTION</Cell>}
                flexGrow={3}
                cell={({rowIndex, ...props}) => (
                      <Cell {...props}>
                       {dataList[rowIndex]["description"]}
                      </Cell>
                      )}
                width={colObj['width']}  />
            case 'accounts' :
              return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="accounts"
              align='center'
              header={<Cell>ACCOUNTS</Cell>}
              flexGrow={2}

              cell={({rowIndex, ...props}) => {
                let acountname="";

                  if(!dataList[rowIndex]["accountName"]||dataList[rowIndex]["accountName"]==null||dataList[rowIndex]["accountName"]==''){
                      acountname= "-"
                  }
                  else{
                    acountname= dataList[rowIndex]["accountName"]
                  }

                      return(
                        <Cell {...props}>
                         {acountname}
                        </Cell>
                      )
                    }

              }
            
              width={colObj['width']}  />
              case 'triggered':
              return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="triggered"
              align='center'
              header={<Cell>TRIGGERED</Cell>}
              flexGrow={3}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                  <AlertCountStatus key={rowIndex} alert={dataList[rowIndex]}  forCount={true} fromDate={this.state.fromDate} toDate={this.state.toDate}/>
               </Cell>
               )}
              width={colObj['width']}/>

             case 'state':
              return <Column
                isReorderable={true}
                isResizable={true}
                columnKey="state"
                align='center'
                header={<Cell>STATE</Cell>}
                flexGrow={4}
                cell={({rowIndex, ...props}) => {
                  let stateValue="";
                  let styleColor='green'

                    if(dataList[rowIndex]["active"]&&dataList[rowIndex]["active"]!=null&&dataList[rowIndex]["active"]==true){
                        stateValue= 'ON'
                        styleColor='green'
                    }
                    else{
                      stateValue= 'OFF'
                      styleColor='red'
                    }

                        return(
                          <Cell {...props}>
                           <span style={{color:styleColor}}>{stateValue}</span>
                          </Cell>
                        )
                      }

                }
                width={colObj['width']}  />
            case 'severity' :
              return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="severity"
              align='center'
              header={<Cell>SEVERITY</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {
                let sever="";
                if(dataList[rowIndex]["severity"]=="low")
                  sever="Low"
                else if(dataList[rowIndex]["severity"]=="medium")
                  sever="Medium";

                else if(dataList[rowIndex]["severity"]=="high")
                   sever="High";
                  return(

                    <Cell {...props}>
                      { sever}
                    </Cell>
                    )
              }}

              width={colObj['width']}  />

                case 'notification':
                return <Column
                isReorderable={true}
                isResizable={true}
                columnKey="notification"
                align='center'
                header={<Cell>NOTIFICATION</Cell>}
                flexGrow={4}
                cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                     -
                    </Cell>
                    )}
                width={colObj['width']}  />
                case 'lastseen':
                return <Column
                isReorderable={true}
                isResizable={true}
                columnKey="lastseen"
                align='center'
                header={<Cell>LAST SEEN(UTC)</Cell>}
                flexGrow={5}
                 cell={({rowIndex, ...props}) => (
                 <Cell {...props}>

                    <AlertCountStatus key={rowIndex} alert={dataList[rowIndex]}  forCount={false} fromDate={this.state.fromDate} toDate={this.state.toDate}/>

                 </Cell>
                 )}
                width={colObj['width']}  />
                case 'servicename':
                return <Column
                isReorderable={true}
                isResizable={true}
                columnKey="servicename"
                align='center'
                header={<Cell>SERVICE NAME</Cell>}
                flexGrow={4}
                cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      { dataList[rowIndex]["serviceName"]}
                    </Cell>
                    )}
                width={colObj['width']}  />
              default :
                return {}
        }
     }
   },
onClickHandler(e) {
    console.log("BAM!")
    let chkVal = parseInt(e.target.id);
    const index = this.state.selected.indexOf(chkVal)
    let newList = this.state.selected.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({selected: newList})
  },
  fromDateChange(value){
    let sendValue = value.slice(0,11).concat('00:00:00.000Z')
    
    this.setState({fromDate:sendValue},function(){
      this.constructFilter();
    });
  },
  toDateChange(value){
    let endValue=value.slice(0,11).concat('11:59:59.000Z')
    this.setState({toDate:endValue},function(){
      this.constructFilter();
    });
  },
   accountChange(dataacc){
   
    this.setState({selectedaccount:dataacc},function(){
      this.constructFilter();
    });
  },
  stateChange(datast){
    this.setState({selectedstate:datast},function(){
      this.constructFilter();
    });
  },
  severityChange(datasv){
     this.setState({selectedseverity:datasv},function(){
      this.constructFilter();
    });
  },
   constructFilter(){
   // let filters = {};
     this.applyFilter()

    /*if(this.state.fromDate != null && this.state.fromDate !== ''){
      filters["startdate"] = this.state.fromDate;
    }
    if(this.state.toDate != null && this.state.toDate !== ''){
      filters["enddate"] = this.state.toDate;
    }
    if(this.state.selectedPolicyPack != null && this.state.selectedPolicyPack !== ''){
      filters["policypacks"] = this.state.selectedPolicyPack.split(',');
    }
    if(this.state.selectedGroup != null && this.state.selectedGroup !== ''){
      filters["groups"]= this.state.selectedGroup.split(',');
    }

    this.setState({filterList:filters},function(){
      this.applyFilter()
    });*/
  },
  applyFilter(){
    
    //this.setState({dataLoad:true})
     getAllAlerts(this.state.selectedseverity,this.state.selectedstate,this.state.selectedaccount)
    .then((alert) => {

      if(alert){
        this.setState({
          list:alert,
         // dataLoad:false,
          selectedList:[]
        },function(){
          console.log("list***********"+JSON.stringify(this.state.list))
        })
      }
    })
    .catch((error) => console.log("Error in getting images list:"+error))

   /* console.log("apply filter called: "+JSON.stringify(this.state.filterList));
    getReportsMainList(50,50,this.state.filterList)
    .then((reports) =>  {
        this.setState({list:[] },function(){
          this.setState({list:reports.assessments,
          reportsCount:reports.filterCount,
          selectedList:[]});
    })
    })
    .catch((error) => console.log("Error in getReportsMainList in container:" + error))*/
  },
  /*onClickHandler(rowIndex) {
    const index = this.state.selected.indexOf(rowIndex)
    if (index == -1)
    {
      this.state.selected.push(rowIndex)
    } else {
      this.state.selected.splice(index,1)
    }
    this.setState({selected: this.state.selected})
    //console.log(this.state.selected)
  },*/

 /*  refreshDetails(key,workLogStr){
    let index =findIndex(this.state.list,"id",key);
    if (index !== -1) {
      let newList = this.state.list.slice();
      newList[index].status = workLogStr;
      this.setState({list:newList});
    }
  },*/
  removeAlert(alertId){

    //remove report from selected list
    this.removeFromSelected(alertId)

    //remove report from the list
    let reportInx = -1;
    for (var i=0; i < this.state.list.length; i++)
      if (this.state.list[i]["id"] == alertId)
        reportInx = findIndex(this.state.list, "id", alertId)

    let newList = this.state.list.slice();
    if(reportInx > -1){
      newList.splice(reportInx,1);
      this.setState({list:[]},function(){
        this.setState({list:newList})
      });
    }

  },
  removeFromSelected(alertId){
    

    let newList = this.state.selected.slice();
    const index = this.state.selected.indexOf(alertId)
    if(index > -1){
      newList.splice(index,1);
      this.setState({selected: newList});
    }
  },
  showAlert(msg){
    Alert.show(msg);
  },
  reloadList(){
    this.applyFilter();
  },
  getOnScroll(){

  },
  handleCreateNew(){
    let resultPath='/createalert'
    this.context.router.replace(resultPath);
  },
  render() {


    let dataList = this.state.list;
    let selectedList = this.state.selected;

    console.log("in all alert")
    let selectStyle1 = { border:'1px solid #4C58A4', height:40,fontSize: 18,color:'#4C58A4', marginLeft: 8,paddingTop:0,paddingBottom:0,paddingLeft:10,paddingRight:0, width:'165px',lineHeight:'2.3em'}
    let posstyle = {
      position: 'absolute',
      top:-70,
      right: 80,
      width: '154px',
      float: 'right',
      margin: 'auto'
  }
    return (
      <div>
     {(this.state.dataLoad)?
      <div style={{marginTop:280}}><SpinnyLogo /></div>
      : 
      <div>
     {!this.state.noOfAlerts?
      <div>
        <div style={{ position:'relative'}}>
            <Button style={posstyle} className={blueBtn} bsSize='large' onClick={this.handleCreateNew}>Create New Alert</Button>
        </div>
      {/*<div className="container-fluid">
        <Row style={{marginLeft:'60px',marginRight:'60px',marginTop:30}}>
          <FormGroup controlId="search" className="search">
            <InputGroup style={{marginRight:"60px", marginTop:"5=50px"}}>
              <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
              <FormControl type="text" placeholder="Search for Alerts"  />
            </InputGroup>
          </FormGroup>
        </Row>
      </div>*/}
        <div className="container-fluid">
        <Row style={{height:50, marginTop:30,marginBottom:10,marginRight:0,marginLeft:17}}>
          <AlertFilterSelector
           fromDate={this.state.fromDate}
           toDate={this.state.toDate}
           fromDateChange={this.fromDateChange}
           toDateChange={this.toDateChange}
           accountChange={this.accountChange}
           stateChange={this.stateChange}
           severityChange={this.severityChange}
           accounts={this.state.accounts}
           states={this.state.states}
           severities={this.state.severities}
           />

        </Row>
        </div>
        <div className="container-fluid">
        <Row>
          <Col xs={6} style={{paddingLeft:41, height:50}}>
            <AlertActionButtons alertCount={this.state.list.length}
                                selectedList={this.state.selected}
                                list={this.state.list}
                                reloadList={this.reloadList}
                                showAlert={this.showAlert}
                                removeAlert={this.removeAlert}
                                refreshList={this.refreshList}
                                removeFromSelected={this.removeFromSelected}
                                />
          </Col>
          <Col xs={6} style={{height:50}}>
           <div style={{display: 'flex',justifyContent:'flex-end', position:'absolute', top:-0, right:65, margin:'10px 0'}}>

            <div id="refresh" style={{margin:'9px 10px', cursor:'pointer'}}>
              <a onClick={this.refreshList}> <Glyphicon style={{color:'#4e56a0', fontSize:"19"}} glyph="glyphicon glyphicon-refresh" /></a>
              {/*<a onClick={this.refreshList}> <img src={refreshIcon1} alt="refreshIcon"/></a>*/}
            </div>
            <div style={{margin:'0px 5px', cursor:'pointer'}}>
              <ResourceColumnChooserClass
                toggle={this.columnChooserToggle}
                columnShow={this.state.columnChooserShow}
                container={this.refs.resourcesTable}
                columnsList={this.state.columnsList}
                changeHandler={this.columnDisplayChangeHandler}
              />
            </div>
            </div>
          </Col>
        </Row>
        </div>
        <div className="container-fluid">
        <Row>
        <Col xs={12} lg={12} style={{marginLeft:-20}}>
          <TestTable
            columnsList={this.state.columnsList}
            getTableColumn={this.getTableColumn}
            list={this.state.list}
            selected={this.state.selected}
            updateList = {this.updateList}
            onClickHandler={this.onClickHandler}
            selectAllHandler={this.selectAllHandler}
            all={this.state.all}
            getDataList={this.getOnScroll}
            isInfiniteScroll="isInfiniteScroll"  //should be chnaged to once scrolling is done getDataList={getAllAlerts}

            checkboxColumn={
              <Column
                ref="column"
                header={
                  <Cell>
                  <input type='checkbox' id="selectAllChk" className="chkAll"
                  checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                  onClick={this.selectAllHandler}
                  ref={input => {
                      if (input) {
                        input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                      }
                    }}
                  />
                  <label htmlFor="selectAllChk"></label>
                  </Cell>
                }
                cell={props =>(
                  <CheckboxCell
                    {...props}
                    selectedList={selectedList}
                    data={dataList} col="id"
                    ref={(node) => {
                      let allData;
                      allData= node}}
                    onClickHandler={this.onClickHandler} />
                    )}
                    width={50}
                  />
              }
          />
        </Col>
      </Row>
      </div>
    </div>
    : 
      <AlertsInitialState />
    }
    </div>
   }

  </div>
    )
  },
})

export default AllAlerts
