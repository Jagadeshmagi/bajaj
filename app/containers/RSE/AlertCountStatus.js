import React from 'react'
import {Cell} from 'fixed-data-table'
import {Glyphicon,ProgressBar} from 'react-bootstrap'
import {getAlertCount} from 'helpers/alerts'
import moment from 'moment'


export const AlertCountStatus = React.createClass({
  getInitialState() {
    return {
     Id: this.props.alert.id,
     from:'-',
     to:'-',
      count: 0,
      LastSeen:'-'
    };
  },
  componentWillMount(){

    console.log("polling? reRenderStatus", this.props.reRenderStatus)
    this.setState({id:this.props.alert.id,from:this.props.fromDate,to:this.props.toDate},function(){
       this.getCountValue()
    })
   

   
  },
  componentWillReceiveProps(nextProps,nextState){
    if (nextProps.toDate != this.props.toDate||nextProps.fromDate != this.props.fromDate){
       this.setState({id:this.props.alert.id,from:nextProps.fromDate,to:nextProps.toDate},function(){
       this.getCountValue()
    })


    }
     

  },
  /*componentWillReceiveProps(nextProps,nextState){
    // if (nextProps.reRenderStatus != this.props.reRenderStatus) {
      console.log("reRenderStatus changed", nextProps.group)
      // if(nextProps.reRenderStatus){
      if (nextProps.reRenderStatus != this.props.reRenderStatus) {
        // this.getScore();
        console.log("reRenderStatus is true")
        this.setState({statusText:nextProps.group.discovery_status})
        if(nextProps.group.discovery_status !== "COMPLETED"){
          this.getDiscoveryStatus()
        } else if (nextProps.group.discovery_status == "COMPLETED"){
          // this.getScore();
        }
      }

      if(nextProps.group.discovery_status != this.props.group.discovery_status){
        if(nextProps.group.discovery_status === "COMPLETED"){
            // this.getScore();
        }
        // this.setState({statusText:nextProps.group.discovery_status})
        else if(nextProps.group.discovery_status !== "COMPLETED"){
          this.getDiscoveryStatus()
        }
        this.setState({statusText:nextProps.group.discovery_status})
      }
    // }
  },*/
  getCountValue(){
    
 
    let Id = this.props.alert.id

    if(Id > 0){
    getAlertCount(this.state.id,this.state.from,this.state.to)
      .then((data) => {
      
       
        if(data.alert){
          this.setState({count:data.alert})
        }
         if(data.lastseen){
         
         
          let value= moment.utc(data.lastseen).format('MM[/]DD[/]YYYY [@] HH[:]mm');
        
          this.setState({LastSeen:value})
        }
       
      })
      .catch((error) => console.log("Error in getAssetGroupStatus:" + error))
    }
  },
 
  render() {
    
    
       /* setTimeout(()=>{
          {this.getDiscoveryStatus()}
        }, 2000);*/
   
      
        if(this.props.forCount){
          return (
         <div>{this.state.count}</div>
         );
        }
        else{
           return (
          <div>{this.state.LastSeen}</div>
          );
        }
     
    }
  
});
