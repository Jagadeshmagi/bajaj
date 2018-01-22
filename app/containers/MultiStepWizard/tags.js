 import React, { Component, PropTypes } from 'react'
 import {Button,ButtonGroup} from 'react-bootstrap'
 import {spanstyle,divstyle} from './styles.css'


 const Tags = React.createClass ({  
  getInitialState() {
   return {    
      newname:"",
      tagList:["analytics","applications","production","business mgmnt","vendor management","graphical product" ],
  		}
	},
  texthandler:function(y){
	 if(y.target.value!="")
	 {
    var a=y.target.value.split(',');
    if(a!=""){
      this.setState({newname:a});
    }
	 }
	 else
	 	this.setState({newname:""});
  },

  addhandler :function(){
	 if(this.state.newname!="")
	 {
	 	  var Labels = this.state.tagList.slice();
      this.state.newname.map(function(x){
        Labels.push(x);
      })
          
      this.setState({tagList:Labels}) ;
      tagn.value="";
      this.state.newname="";
	 	  console.log("tagList  "+this.state.tagList);
      this.props.getTagList(this.state.tagList);
	 }

 },
 removeTag(e){
    let tagVal = e.target.id;
    const index = this.state.tagList.indexOf(tagVal)
    let newList = this.state.tagList.slice();
    if (index > -1)
    {
      newList.splice(index,1);
    }
    this.setState({tagList: newList})
  },   
  render() {
  	const tagsdata =(
  	
      <div className={divstyle} style={{width:'326px'}}>
      {
        this.state.tagList.map(function(tag, index)
        { 
          return (
          <span className={spanstyle} key={index}>
          <Button style={{color:'white',borderRadius:2,backgroundColor:'#4C58A4',opacity:0.7}}>
            {tag} &nbsp; <a href="javascript:void(0)" id={tag} style={{color:'white'}} onClick={this.removeTag}>x</a>
          </Button>{'  '}
          </span> 
          )
        }.bind(this))
      }
      </div>
    );
    
 
  return (
  
      <div>
      <h3 style={{fontSize:'15px'}}><strong> SET TAGS</strong></h3> 
       <div>{tagsdata}</div>
      <h3 style={{fontSize:'15px',fontWeight:'500'}}> Add New Tag</h3>
		  <div className="wrapper">
        <input placeholder='Enter tag names' style={{border:'1px solid #4C58A4',padding:'12px',width:258,height:40}} id="tagn" type="text" onChange = {this.texthandler}/>
        <button style={{border:'1px solid #4C58A4',width:68,height:40,backgroundColor:'#4C58A4',color:'white'}} onClick={this.addhandler}>Create</button>
		  </div>
      <br /><br />
      </div>
	  

  );
}    
})  

export {Tags}


