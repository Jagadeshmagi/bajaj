import React from 'react'
import {Glyphicon,Col, Row} from 'react-bootstrap'
import {RuleDetails} from './RuleDetails'
import {findElement,findIndex} from 'javascripts/util.js'


export const RuleNode = React.createClass({
  getInitialState(){
    return{
      clickedEdit:false,
      editedValue:[],
      editText:"Edit",
      linkColor:'red',
      closeText:"Close"
    }
  },
  shouldComponentUpdate(nextProps,nextState) {
    return ((nextProps.node.title !== this.props.node.title)
      || (nextState.clickedEdit !== this.state.clickedEdit)
      || (nextState.editedValue !== this.state.editedValue))
  },
  handleClickEdit(){
    //this.setState({linkColor:"#00C484"})
    let newList=[];
    this.props.node.variables.map(function(vars){
      newList.push(Object.assign({}, findElement(this.props.selectedArtifectSet,"artifact_name",vars)))
    }.bind(this))
    this.setState({editedValue:newList},function(){
      this.setState({clickedEdit:true,editText:"SAVE",closeText:"Close",linkColor:"#0000A0"})
    })
  },
 
  handleClickSave(e){
    this.setState({linkColor:'#8b0000'})
    this.setState({clickedEdit:false,editText:"Edit",closeText:"Close"})
    this.props.SettingVariables(this.state.editedValue)
  },
  handleClose(){
    this.setState({clickedEdit:false,editText:"Edit",closeText:"Close",linkColor:"red"})

  },
  inputchanged(ev){
    this.setState({closeText:"Save",linkColor:"#00C484"})
    let id=ev.target.id
    let inx = findIndex(this.state.editedValue,"artifact_name",id)
    let newSelectedSet = this.state.editedValue.slice();
    let newVariable = newSelectedSet[inx]
    newVariable.value =ev.target.value
    newSelectedSet.splice(inx,1,newVariable)
    this.setState({editedValue:newSelectedSet})
  },
  reset(evr){
    let id=parseInt(evr.target.id)
    let newSelectedSet = this.state.editedValue.slice();
    let propname = newSelectedSet[id].artifact_name
    newSelectedSet[id].value = findElement(this.props.resetList,"artifact_name",propname).value
    this.setState({editedValue:newSelectedSet})
  }, 
  render() {
    let title= this.props.node.title;
    let id =  this.props.node.id;
    let checkBoxId = this.props.node.id;
 
    let policyPackPath = this.props.policyPackPath
    let isEditable=this.props.isEditable
    
    let editRule ={marginBottom:8,marginTop:15,marginLeft:20,width:480, display:'none',"overflow-x":"hidden","overflow-y":"auto"}
    if(this.state.clickedEdit){editRule.display='block'} else{editRule.display='none'}   
 
    return (
    <div>
      <div style={{marginLeft:'20px',marginRight:'20px'}}>
      <div style={this.props.bStyle}>
        <h5 style={{marginLeft:this.props.marginPX,fontSize:'15px'}}>
          <Row>
            <Col xs={9} md={9} sm={9} lg={9} style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap',overflow: 'hidden'}}>
              {/*<input type="checkbox" id={checkBoxId} defaultChecked={true}/><label htmlFor={checkBoxId}/>&nbsp;*/}
              <a href="javascript:void(0)" style={{color:'#737684',textDecoration:'none'}} data-toggle="tooltip" title={title}>{title}</a>
            </Col>
            <Col xs={3} md={3} sm={3} lg={3} style={{textAlign: 'right'}}>
              <div style={{display:'inline-block'}}>
                  {isEditable&&this.props.node.variables&&this.props.node.variables.length>0?
                    <div  style={{display:'inline-block'}}>
                        {this.state.editText==="Edit"?

                          <a style={{fontSize:12,color:this.state.linkColor,cursor: "pointer"}} onClick={this.handleClickEdit}>EDIT</a>
                          :
                          <div>
                            {this.state.closeText=="Close"?
                               <a style={{fontSize:12,color:this.state.linkColor,cursor: "pointer"}} onClick={this.handleClose}>Close</a>
                               :
                              <a style={{fontSize:12,color:this.state.linkColor,cursor: "pointer"}}  onClick={this.handleClickSave}>SAVE</a>
                            }
                          </div>
                        }
                    </div>
                    :
                    <noscript />
                  }
                  <RuleDetails key={id} ruleId={id} type={this.props.type}/>
              </div>             
            </Col>
          </Row>
        </h5>
      </div>
      </div>
{/**/}
        <div style={editRule}>
         {/* <hr style={{marginTop:3,width:483,marginLeft:18}}/>*/}
          <div style={{paddingLeft:50}}>
 
             {this.state.editedValue.map((v,k)=>{
                return(
                  <div  className="row" style={{ 'white-space': 'nowrap', width:'100%',marginLeft:0,marginBottom:10}}>
                   <div style={{textAlign:'right',width:'50%', display:"inline-block" ,marginRight:20}}>
                   {v.artifact_name} : &nbsp;
                   
                   
                   </div>
                   <div style={{width:'35%', marginLeft:-20,display:"inline-block"}}> 
                    <input type="text" key={v.artifact_name} name={v.artifact_name} id={v.artifact_name} value={v.value} style={{width:'100%'}} onChange={this.inputchanged}/>
                   </div>
                   <div style={{width:'15%', display:"inline-block"}}>
                    <div id="refresh" style={{margin:'12px 10px', paddingLeft:'5px',cursor:'pointer'}}>
                      <a id={k} onClick={this.reset}> Reset</a>
                      {/*<a onClick={this.refreshList}> <img src={refreshIcon1} alt="refreshIcon"/></a>*/}
                    </div>
                   </div>
                  </div>
                )
            })
           }
          </div>    
                
{/**/}
        </div>
      </div>
    );
  },
})
