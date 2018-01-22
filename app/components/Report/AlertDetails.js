import React, { PropTypes } from 'react'
import {Modal,ControlLabel} from 'react-bootstrap'
import {modalContainer,deleteDialogClass,infoCircle, modal,headerContainerForEdit,modstyle} from './styles.css'
import {modalCloseBtnStyle,mytable } from 'sharedStyles/styles.css'
import {customModal} from 'sharedStyles/customCSS.css'

import {getAlertReportDetails} from 'helpers/alerts'
import ScrollableDataTableInModal from "containers/DataTable/ScrollableDataTableInModal"
import {Table,Column, Cell} from 'fixed-data-table'
import {SpinnyLogo} from 'containers'

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

 export const AlertDetails = React.createClass({
  getInitialState() {
    return {
      show: false,

      rule: {},
      list:[],
       columnsList:[
        {name:'eventlogs', displayText:'EVENT LOGS', show:true, columnName: "Event Logs", width:100},
        {name:'details', displayText:'', show:true, columnName: "Details", width:500},
        {name:'dummy',displayText:'', show:true, columnName: "", width:30}
      ],
      startTime:this.props.starttime,
      endTime:this.props.endtime,
      type:this.props.type,
      loadingDiv:true

    };
  },
  getAlertList(start,end,{}){
    let alertId=this.props.alertId
    let startdate = this.props.starttime
    let enddate = this.props.endtime
    this.setState({loadingDiv:true})
    /*let slicedStartTime = startdate.slice(0,11)
    let zeroTime = '00:00:00.000Z'
    let actuanStartTime = slicedStartTime.concat(zeroTime)
    console.log('Myyyyyyyyyyyyyyyy - >'+ this.props.endtime, this.state.endTime)*/
    getAlertReportDetails(alertId,startdate,enddate,0,50)
    .then((nodes) => {
      let newList =[]
      nodes.map((val,key)=>{
        newList.push(val)        
      })
      this.setState({list:newList,loadingDiv:false})
    })
    .catch((error) => console.log("Error in getting the getPolicyPackRules"))

  },
 /* getRuleDetails(){
    if(this.props.ruleId){
      console.log("ruleid is defined")
       if(this.props.type!=null&&this.props.type!=""&&this.props.type==="CVE"){

        getRuleDetailsForDocker(this.props.ruleId)
        .then((ruleObj) => {
          this.setState({rule:ruleObj})
        })
        .catch((error) => console.log("Error in getting rule details:" + error))
      }
      else{
        getRuleDetails(this.props.ruleId)
        .then((ruleObj) => {
          this.setState({rule:ruleObj})
        })
        .catch((error) => console.log("Error in getting rule details:" + error))
      }

    }else if(this.props.rule){
      console.log("ruleid is NOT defined")
      this.setState({rule:this.props.rule})
    }
  },*/
  closeModal() {
    this.setState({showModal: false});
  },
  openModal(){
    
   // this.getRuleDetails();
   this.setState({showModal: true });
   if(this.props.type=="AWSLambda"){
    
      this.setState({list:this.props.alertdata,loadingDiv:false})

   }else{
    
     this.getAlertList(0,50,{});
   }

  },
  rowHeightGetter(index) {
   /* if(JSON.stringify(this.state.list[index]).length<=1000){
      return 280
    }else if(JSON.stringify(this.state.list[index]).length<=1200 && JSON.stringify(this.state.list[index]).length>1000){
      return 300
    }
    else if(JSON.stringify(this.state.list[index]).length<=1500 && JSON.stringify(this.state.list[index]).length>1200){
      return 520
    }
    else if(JSON.stringify(this.state.list[index]).length<=2000 && JSON.stringify(this.state.list[index]).length>1500){
      return 700
    }
    else if(JSON.stringify(this.state.list[index]).length<=3000 && JSON.stringify(this.state.list[index]).length>2000){
      return 900
    }
    else if(JSON.stringify(this.state.list[index]).length>3000){
      return 2100
    }    */
    var actualHeight=(JSON.stringify(this.state.list[index]).length/146)*24;
    return actualHeight;

    //return JSON.stringify(this.state.list[index]).length>1500?520:280;
  },
  getTableColumn(colName){
    let colObj = findElement(this.state.columnsList,"name",colName);
    if(colObj != null && colObj["show"]){
      switch(colName){
          case 'eventlogs' :
            return <Column
              flexGrow={8}
                header={()=>{
                 /* let headingdata="EVENT ID";
                  if(this.state.list[0]["eventID"]){
                      headingdata="EVENT ID"
                  }else{
                    headingdata="TIME STAMP"
                  }*/
                  return(
                  <Cell style={{marginLeft:50}}>TIME STAMP</Cell>
                  )
                }}
                cell={({rowIndex, ...props}) => {
                 /* let rowData="";
                    if(this.state.list[rowIndex]["eventID"]){
                        rowData=this.state.list[rowIndex]["eventID"]
                    }else{
                      rowData=this.state.list[rowIndex]['@timestamp']
                    }*/

                    return(
                    <Cell {...props}>
                      <div style={{fontSize:15}}> {this.state.list[rowIndex]["@timestamp"]}</div>
                    </Cell>
                    )}}

              width={235} />
          case 'details' :
            return <Column
              align='left'
              flexGrow={8}
               header={<Cell style={{marginLeft:340}}>RECORDS</Cell>}
              cell={({rowIndex, ...props}) => {
                /*let vari=JSON.stringify(this.state.list[rowIndex])
                let value=vari.substring(1,vari.length-1)*/

                let myArray=[];
    
               for (var key in this.state.list[rowIndex]) {
                  let resultVal = JSON.stringify(this.state.list[rowIndex][key])
                  let resultValue = resultVal.replace(/\"/g, "")
                  // let myresult2 = myresult1.replace(/\{/g, "")
                  // let myresult3 = myresult2.replace(/\}/g, "")

                  let myResultValue = ' '+'<b>'+key +'</b>'+ ' : ' + resultValue+' '
                  myArray.push(myResultValue)
                  myArray.toString()
               }
                   return(
                    <Cell {...props}>
                      <div style={{fontSize:15,wordBreak:'break-all'}} dangerouslySetInnerHTML={{__html:myArray}}></div>
                    </Cell>

                    )}}
              width={965}  />
            case 'dummy' :
            return <Column
              flexGrow={1}
              
             

                width={30} />
          default :
            return {}
            }
     }
   },
  render() {
    let padding =  "30px"
    /*let rule = this.state.rule;
    let padding = this.props.padding || "30px"
    let cceid="";
    let isCceid=false;
   /* if(rule.cceid){
      cceid=rule.cceid;
    }*/
  /*  if(rule.cceid){
      if(rule.cceid.length>0){
        if(rule.cceid[0].startsWith('CVE')){
          isCceid=true;
          for(let i=0;i<rule.cceid.length;i++){
            cceid+=cceid===""?"https://nvd.nist.gov/vuln/detail/"+rule.cceid[i]:","+"https://nvd.nist.gov/vuln/detail/"+rule.cceid[i]
          }
        }else if(rule.cceid[0].startsWith('CCE')){
          //cceid = rule.cceid
          for(let i=0;i<rule.cceid.length;i++){
            cceid+=cceid===""?rule.cceid[i]:","+rule.cceid[i]
          }
        }else{
          cceid='-';
        }
      }
      else{
        cceid='-';
      }
    }else{
      cceid='-';
    }*/
    return (
    <span   >
      <a href='JavaScript: void(0)' style={{textDecoration:'none', fontSize:14, fontStyle:'italic', paddingRight:10}} onClick={this.openModal}>
        &nbsp;&nbsp;
      <b>View all events</b>
      </a>
      <Modal
        show={this.state.showModal}
        onHide={this.closeDelete}
        aria-labelledby="contained-modal-title"
        className="modal fade right"
        dialogClassName={deleteDialogClass}
        >

        <Modal.Header style={{marginRight:5, padding:0}} className={modstyle}>
         <a style={{textDecoration:'none', marginTop:-8}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>X</a>
            <br/>
          <Modal.Title id="contained-modal-title"
                style={{fontSize: 18, fontWeight:'bold', color: '#454855',border:0,  padding:'0px 21px 9px', marginTop:-7}}>{"EVENT LOGS :"}</Modal.Title>

        </Modal.Header>

        <Modal.Body style={{padding:0,border:0}}>
         {this.state.loadingDiv?
          <div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
            <SpinnyLogo />
          </div>
          :


        <ScrollableDataTableInModal
          large = "no"
          columnsList={this.state.columnsList}
          getTableColumn={this.getTableColumn}
          list={this.state.list}
          getDataList={this.getAlertList}
          width={1240}
          height={550}
          margin={{top:0, bottom: 0, left: 0, right: 0}}
          moreRowHeight={true}
          rowHeightGetter={this.rowHeightGetter}
        />
      }

           


        </Modal.Body>

      </Modal>
    </span>
    );
  },
 })
