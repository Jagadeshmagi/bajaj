import React, {PropTypes} from 'react'
import { modalContainer } from './styles.css'
import { blueBtn, btnPrimary, deleteDialogClass, modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel ,Col} from 'react-bootstrap'
import {stopDiscovery} from 'helpers/discovery'
let reqMethod = 'POST';

const GenerateReport = React.createClass({
  getInitialState(){
    return{
      showModal: false,
      isGenerating: false,
      reportType:"PDF"
    }
  },
  closeModal() {
    this.setState({showModal: false});
  },
  openModal(){
    this.setState({showModal: true });
  },
  generatePDF(){
     let downloadLink 
    if(this.props.selectedPolicyPack!=''){
      //++++++ Policypack filter applied ++++++++++++
      let selectedPolicyPack = this.props.selectedPolicyPack.substring(1,this.props.selectedPolicyPack.length-1)
      downloadLink = NetworkConstants.API_SERVER+'/report/download?worklogId='+this.props.report.worklogid+'&policypack='+selectedPolicyPack+'&reporttype='+this.state.reportType+'&assettype='+this.props.report.assetType;  
    }else
    {
      reqMethod = 'GET'
      if(this.props.report.assetType!='IMAGE' && this.props.report.assetType!='image'){
         if(this.state.reportType=="EXCEL")
          downloadLink=NetworkConstants.NODEJS_SERVER+'report/download/'+this.props.report.worklogid+'?type=xls'
        else
           downloadLink=NetworkConstants.NODEJS_SERVER+'report/download/'+this.props.report.worklogid+'?type=pdf'
      }else{
        reqMethod = 'POST'
        let appliedPolicypacks=this.props.report.policygroups
        let appPolicyPacks = appliedPolicypacks.join();
        downloadLink=NetworkConstants.API_SERVER+'/report/download?worklogId='+this.props.report.worklogid+'&policypack='+appPolicyPacks+'&reporttype='+this.state.reportType+'&assettype='+this.props.report.assetType;
      }
    }
    this.closeModal();
     var filename = "Pulsar Report-"+this.props.report.worklogid+".pdf";    
      if(this.state.reportType=="EXCEL")
      {
        filename = "Pulsar Report-"+this.props.report.worklogid+".xls";   
      }
   // e.preventDefault();
    var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

                     
                var disposition = this.getResponseHeader('Content-Disposition');

                 if (disposition) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches !== null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                } 
                var linkelem = document.createElement('a');
                try {

                    var blob = new Blob([this.response], { type: 'application/octet-stream' });                        

                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        //   IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."

                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var downloadUrl = URL.createObjectURL(blob);
//alert(downloadUrl);
                        if (filename) { 

                            // use HTML5 a[download] attribute to specify filename
                            var a = document.createElement("a");

                            // safari doesn't support this yet
                            if (typeof a.download === 'undefined') {
                               console.log("LINE NUMBER 72")
                                window.location = downloadUrl;
                            } else {
                               console.log("LINE NUMBER 74")
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.target = "_blank";
                                a.click();
                            }
                        } else {
                             console.log("LINE NUMBER 81")
                            window.location = downloadUrl;
                        }
                    }   

                } catch (ex) {
                    console.log(ex);
                }
      //document.getElementById("demo").innerHTML = this.getResponseHeader('Content-Disposition');
    }
  };
  var accessToken = localStorage.getItem('accessToken');
  xhttp.open(reqMethod,downloadLink, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("authorization", 'Bearer ' + accessToken);
  //xhttp.setRequestHeader("authorization", "Bearer 043b5fa7-8df2-4909-aab5-2b414243e800");
  xhttp.responseType = 'blob';
  xhttp.send();
  reqMethod = 'POST'
  },
   handleReportType(e){
    this.setState({reportType:e.target.value})
  },
  render() {
    let close = () => this.setState({ show: false});
    let style = {
      ...this.props.style,
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid Navy',
      borderRadius: 0,
      marginTop: 200,
      width:500,
    }
    console.log('reportType '+this.props.report)

    let downloadLink 
    if(this.props.selectedPolicyPack!=''){
      let selectedPolicyPack = this.props.selectedPolicyPack.substring(1,this.props.selectedPolicyPack.length-1)
      downloadLink = NetworkConstants.API_SERVER+'/report/download?worklogId='+this.props.report.worklogid+'&policypack='+selectedPolicyPack+'&reporttype='+this.state.reportType+'&assettype='+this.props.report.assetType;  
    }else{
      let appliedPolicypacks=this.props.report.policygroups
      let appPolicyPacks = appliedPolicypacks.join();
      console.log("appPolicyPacks"+appPolicyPacks)
      downloadLink=NetworkConstants.API_SERVER+'/report/download?worklogId='+this.props.report.worklogid+'&policypack='+appPolicyPacks+'&reporttype='+this.state.reportType+'&assettype='+this.props.report.assetType;
    }
    console.log('reqMethod '+reqMethod)
    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.openModal}>
          Generate Report
        </a>
        {this.state.isGenerating?
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
          >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'GENERATE REPORT'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Generating report. Please wait...</p>
          </Modal.Body>
        </Modal>
          :
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>X</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'GENERATE REPORT'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px'}}>
            <div style={{marginLeft:'15px'}}>

            <input checked={this.state.reportType==="PDF"?true:false} type="radio" value="PDF" id="PDF" name="reportType" onChange={this.handleReportType}/>
            <label htmlFor="PDF"> &nbsp;&nbsp;&nbsp;PDF </label>    
            <br/>
            <input checked={this.state.reportType==="EXCEL"?true:false} type="radio" value="EXCEL" id="EXCEL" name="reportType" onChange={this.handleReportType}/>
            <label htmlFor="EXCEL"> &nbsp;&nbsp;&nbsp;EXCEL </label>  
            </div>    
             {/* <FormGroup controlId="formGroupEmail">
                <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Send report to</ControlLabel></Col>
                <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,}}
                  type="text" name="email" placeholder="Enter email" />
              </FormGroup>*/}
            
         </Modal.Body>
         <Modal.Footer style={{marginRight:35,marginBottom:5,borderTop:0}}>
          <form action={downloadLink} >
            <Button className={blueBtn} onClick={this.closeModal}>Cancel</Button>
            <Button type="button" bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.generatePDF}>Done</Button>          
          </form>
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})

export default GenerateReport
