import React, {PropTypes} from 'react'
import {Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Modal,Button, Row} from 'react-bootstrap'
import {TextCell,LinkCell,CredCheckboxCell} from 'components/Table/Table'
import {spacer} from 'sharedStyles/styles.css'
import getCredentialsList from 'helpers/credentials'
import {progress, mytable,centeredContainer} from 'sharedStyles/styles.css'
import { CredentialHeader } from 'components'
import {deleteCredential} from 'helpers/credentials'
import {CreateCredentials,EditCredentials,DeleteCredentials,CredentialsActions,CredentialsStart} from 'containers'
import {credContainer} from './styles.css'
import {SpinnyLogo} from 'containers'
import {Table,Column, Cell} from 'fixed-data-table'
import TestTable from 'containers/Infrastructure/TestTable'
import {findElement} from 'javascripts/util.js'

const CredIntro = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr ><td style={{textAlign: 'center',  fontWeight: 'bold', color: '#454855', paddingBottom: 10}}>
                    Ready to create new credentials ?</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>By adding new credentials</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>you will be able to run discovery and assessment. </td></tr>
        </tbody>
      </table>
    )
  }
})

const CredentialsListContainer = React.createClass({
getInitialState(){
  return{
    clist:[],
    selectedCredId:[],
    selected: [],
    loadingDiv:true,
    all:false,
    selectedCredName:"",
    columnsList:[
        {name:'label', show:true, displayText: "LABEL", width:"150"},
        {name:'usage', show:true, displayText: "USAGE", width:"150"},
        {name:'type', show:true, displayText: "TYPE", width:"150"},
        {name:'username', show:true, displayText: "USERNAME", width:"150"}
    ],
  }
},

componentDidMount(){
  getCredentialsList()
    .then(
      (credentials) =>  {
        this.setState({clist:credentials,
          loadingDiv:false});
      }
     )
    .catch((error) => console.log("Error in getCredentialsList in container:" + error))
},

refreshCredentialsList(){
  this.setState({loadingDiv:true})
  getCredentialsList()
    .then(
      (credentials) =>  {
        this.setState({clist:credentials,
          loadingDiv:false});
      }
     )
    .catch((error) => console.log("Error in getCredentialsList in container:" + error))
},

selectAllHandler(){
    if(!this.state.all){
      this.setState({dataLoad:true});
    }
    this.setState({all:!this.state.all},
      (res)=>{
        if(this.state.all === true){
           let selectList = [];
              this.state.clist.map((r) =>
             {
               selectList.push(r.id)
             })
           this.setState({
             selectedCredId: selectList,
          }, (res)=>{});
        } else if (this.state.all === false){
          this.setState({
            selectedCredId: []
          })
        }
      })
  },


/*selectAllHandler(){
  let selectList = [];
  if(this.state.selectedCredId.length < this.state.clist.length){
    this.state.clist.map((r) => 
    {
      selectList.push(r.id)
    })
  }
  this.setState({selectedCredId: selectList})
},*/


  selections(e)
  {  
    let chkVal = parseInt(e.target.id);
    const index = this.state.selectedCredId.indexOf(chkVal)
    let newList = this.state.selectedCredId.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({ selectedCredId: newList,
                    selectedCredName:e.target.name})
  },

  removeFromSelected(id){
    console.log('Inside remove from Selected.Id is '+id)
    let newList = this.state.selectedCredId.slice();
    const index = this.state.selectedCredId.indexOf(id)
    if(index > -1){
      newList.splice(index,1);
      this.setState({selectedCredId: newList});
    }
  },

  fetchCredentials(upadtedCredentials){
   this.setState({clist:upadtedCredentials});
  },

  updateList(newList){
      this.setState({
        clist:newList
      }, (res)=>{console.log("POST___________", this.state.clist)})
    },


getTableColumn: function(colName){
      let colObj = findElement(this.state.columnsList,"name",colName);
      let dataList = this.state.clist;
      if(colObj != null && colObj["show"]){
        switch(colName){
          
          case 'label' :
            return <Column
             align='center'
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {dataList[rowIndex]["label"]}
                    </Cell>
                    )}

             width={50} />
            
            case 'usage' :
            return <Column
              align='center'
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {dataList[rowIndex]["usage"]}
                    </Cell>
                    )}
              width={75} />


          case 'type' :
            return <Column
             align='center'
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {dataList[rowIndex]["credentialType"]}
                    </Cell>
                    )}
              width={90}/>

            case 'username' :
            return <Column
             align='center'
              header={<Cell>{colObj.displayText}</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {dataList[rowIndex]["username"]}
                    </Cell>
                    )}
              width={100}  />
          default :
            return {}
        }
     }
   },

render() {
  let dataList = this.state.clist;
  let selectedList = this.state.selectedCredId;
  if(!this.state.loadingDiv && this.state.clist.length<1){
    return(<div>
        <CredIntro />
        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <td style={{textAlign: 'center'}}>
                <CreateCredentials totalCredsCount={this.state.clist.length} refreshCredentialsList={this.refreshCredentialsList} />
              </td>
            </tr>
          </tbody>
        </table>
     
      
      </div>
      )}
else{
  return (
    <div>
      <div className={credContainer}>
        {this.state.loadingDiv?
          <div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
            <SpinnyLogo />
          </div>
        :
        <div>
          <Row style={{margin:'30px 0 0 -4px'}}>
            <Col xs={12}>
               {/* <FormGroup controlId="search" className="search">
                  <InputGroup style={{marginRight:"60px"}}>
                    <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                    <FormControl type="text" placeholder="Search or filter  here..."/>
                  </InputGroup>
                </FormGroup>*/}
            </Col>
          </Row>
          <Row style={{height:30, marginLeft:15}}>
            <div className="pull-left">
              <CredentialsActions 
                totalCredsCount={this.state.clist.length} 
                slectedCreds={this.state.selectedCredId} 
                refreshCredentialsList={this.refreshCredentialsList} 
                removeFromSelected={this.removeFromSelected}
                selectedCredName={this.state.selectedCredName}/>
            </div>
          </Row>
          <Row  style={{margin:'10px 0 0 -60px'}}>
          <Col xs={12} lg={12}>
            <TestTable
                columnsList={this.state.columnsList}
                getTableColumn={this.getTableColumn}
                list={this.state.clist}
                selected={this.state.selected}
                updateList = {this.updateList}
                onClickHandler={this.selections}
                selectAllHandler={this.selectAllHandler}
                all={this.state.all}
                large = "no"
                isInfiniteScroll="isInfiniteScroll"  // Used when there is no infinite scroll
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
                      <CredCheckboxCell
                        {...props}
                        selectedList={selectedList}
                        data={dataList} col="id" 
                        ref={(node) => {
                          let allData;
                          allData= node}}
                        onClickHandler={this.selections} />
                        )}
                        width={50}
                    />
                 }
              />
          </Col>
        </Row>
        </div>}
      </div>
    </div>
  )}
  }
})

export default CredentialsListContainer

    