import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import { blueBtn , btnPrimary, mytable, selectStyle, navbar,modalDialogClassDash, modalDialogClassDashLarge, hrStyle,hrStyleInDash} from 'sharedStyles/styles.css'
import {Col, Row, Grid, Button, Modal, ControlLabel, FormGroup, Popover, OverlayTrigger, FormControl} from 'react-bootstrap'
import {addUserModalHeader, modalCloseStyle, footerDivContainer, userModal, modalContainer} from './styles.css'
import {getUserById, resetPassword} from 'helpers/user'
import Joi from 'joi-browser'

const ResetPassword = React.createClass({
  getInitialState(){
    let show = this.props.show === true?this.props.show:false
    return{
      showUser:show,
      disable:true,

      pwOld:"",
      pwNew1:"",
      pwNew2:"",

      pwOld_error:"Please enter your current password ",
      pwNew1_error:"Please enter a new password ",
      pwNew2_error:"Please reenter the new password",

      pwOldValid:false,
      pwNew1Valid:false,
      pwNew2Valid:false,

      pwOld_validation:"",
      pwNew1_validation:"",
      pwNew2_validation:"",

      tooltippwOld:"",
      tooltippwNew1:"",
      tooltippwNew2:"",

      bordercolpwOld:"thin solid #4C58A4",
      bordercolpwNew1:"thin solid #4C58A4",
      bordercolpwNew2:"thin solid #4C58A4",
      }
  },
  // componentDidMount(){
  //   if (this.props.login){
  //     this.setState({showUser:true})
  //   }
  // },
  componentWillReceiveProps(nextProps){
    console.log("nextPropsnextPropsnextProps", nextProps)
    if (nextProps.show != this.props.show){
      this.setState({
        showUser:nextProps.show
      })
    }
  },

  openUserModal(){
    this.setState({showUser:true})
  },

  closeUser() {
    this.setState({
      showUser:false,
      disable:true,

      pwOld:"",
      pwNew1:"",
      pwNew2:"",

      pwOld_error:"Please enter your current password ",
      pwNew1_error:"Please enter a new password ",
      pwNew2_error:"Please reenter the new password",

      pwOldValid:false,
      pwNew1Valid:false,
      pwNew2Valid:false,

      pwOld_validation:"",
      pwNew1_validation:"",
      pwNew2_validation:"",

      tooltippwOld:"",
      tooltippwNew1:"",
      tooltippwNew2:"",

      bordercolpwOld:"thin solid #4C58A4",
      bordercolpwNew1:"thin solid #4C58A4",
      bordercolpwNew2:"thin solid #4C58A4",
    });

    // if(this.props.login){
    //   this.props.resetComplete()
    // }
  },

  handleOld(e){
    this.setState({
      pwOld:e.target.value
    })
  },
  handleNew1(e){
    this.setState({
      pwNew1:e.target.value
    }, ()=>{
      if(this.state.pwNew2.length>1){
        this.checkPWMatch()
      }
    })
  },
  handleNew2(e){
    this.setState({
      pwNew2:e.target.value
    }, ()=>{this.checkPWMatch()})
  },

  handleOldBlur(){
    // awesome logix =D to make awesome pw
    // pwOld
    let pwOld_schema = {
        "Current Password": Joi.string().min(5).max(32).required(),
    };
    let result = Joi.validate({"Current Password": this.state.pwOld}, pwOld_schema)
    if (result.error) {
      console.log("pwOldresult.error", result.error)
        this.refs.pwOld.show();
        this.setState({pwOld_error : result.error.details[0].message, pwOld_validation: 'error'})
        this.state.pwOldValid=false;
        this.state.bordercolpwOld='thin solid #FF444D';
        this.state.labeltoolheight=55;
        this.setState({tooltippwOld:"hover"});
    } else {
        this.refs.pwOld.hide();
        this.setState({tooltippwOld:false});
        this.setState({pwOld_error: '', pwOld_validation : 'success'})
        this.state.pwOldValid=true;
        this.state.bordercolpwOld='thin solid #00C484';
    }
  },
  handleNew1Blur(){
    if(this.state.pwNew1){
      this.checkpwNew1();
    }
  },

  checkpwNew1(){
    //   var pattern = new RegExp(/^([a-zA-Z0-9_-]){12,51}$/);
    //   var pattern = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{11,31}$/);
  var pattern = new RegExp(/^[a-zA-Z0-9~@$*()_!=[\]/,.?:; -]{11,31}$/);
  var result = pattern.test(this.state.pwNew1)
  console.log(result, "this is the result")
  if (result){
    // this.setState({
    //   pwNew1Valid:true
    // })
    this.refs.pwNew1.hide();
    this.setState({tooltippwNew1:false});
    this.setState({pwNew1_error: '', pwNew1_validation : 'success'})
    this.state.pwNew1Valid=true;
    this.state.bordercolpwNew1='thin solid #00C484';
  } else {
    this.refs.pwNew1.show();
    this.setState({
      pwNew1_error : `New Password must be at least 12 characters long and cannot contain the following: # % ^ + { } | \ ' " > < \``,
      pwNew1_validation: 'error'})
    this.state.pwNew1Valid=false;
    this.state.bordercolpwNew1='thin solid #FF444D';
    this.state.labeltoolheight=55;
    this.setState({tooltippwNew1:"hover"});
  }
},

//   checkpwNew1(){
// // ~@$*()-_=![]:;?/,.
//     //  ~ @ # $ ^ & * ( ) - _ + = [ ] { } | \ , . ? : # % ^ + { } | \ ' " > < `
//   // var pattern = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{11,31}$/);
//   // var pattern = new RegExp(/^[a-zA-Z0-9]*$/);
//   var pattern = new RegExp(/^([a-zA-Z0-9_-]){12,51}$/);
//   var result = pattern.test(this.state.pwNew1)
//   if (result){
//     // this.setState({
//     //   pwNew1Valid:true
//     // })
//     this.refs.pwNew1.hide();
//     this.setState({tooltippwNew1:false});
//     this.setState({pwNew1_error: '', pwNew1_validation : 'success'})
//     this.state.pwNew1Valid=true;
//     this.state.bordercolpwNew1='thin solid #00C484';
//   } else {
//     this.refs.pwNew1.show();
//     this.setState({
//       pwNew1_error : `New Password must be alphanumeric and must contain at least 12 characters.`,
//       pwNew1_validation: 'error'})
//     this.state.pwNew1Valid=false;
//     this.state.bordercolpwNew1='thin solid #FF444D';
//     this.state.labeltoolheight=55;
//     this.setState({tooltippwNew1:"hover"});
//   }
// },

  checkPWMatch(){
    console.log("golden =)", this.state.pwNew1, this.state.pwNew2, this.state.pwNew1Valid, this.state.pwOldValid)
    if(this.state.pwNew1 && this.state.pwNew2 && this.state.pwNew1Valid && this.state.pwOldValid){
      console.log("golden =)")
      if(this.state.pwNew1 === this.state.pwNew2){
        console.log("golden =)")
        this.setState({
          disable:false
        })
        this.refs.pwNew2.hide();
        this.setState({tooltippwNew2:false});
        this.setState({pwNew2_error: '', pwNew2_validation : 'success'})
        this.state.pwNew2valid=true;
        this.state.bordercolpwNew2='thin solid #00C484';
      } else {
        this.refs.pwNew2.show();
        this.setState({pwNew2_error : "New Password must match", pwNew2_validation: 'error'})
        this.state.pwNew2valid=false;
        this.state.bordercolpwNew2='thin solid #FF444D';
        this.state.labeltoolheight=55;
        this.setState({tooltippwNew2:"hover"});
        this.setState({
          disable:true
        })
      }
    }
  },

  updatePW(){
    // if(this.props.login){
    //   this.props.checkFirstLogin();
    // }
    let userId = localStorage.getItem('userID');
    let passwordPayload = {
      old:this.state.pwOld,
      new:this.state.pwNew1
    };
    resetPassword(userId, passwordPayload)
      .then((response)=>{
        console.log("PW reset success ", response)
        this.closeUser();
        if(this.props.login){
          this.props.checkFirstLogin(passwordPayload.new);
          // dispatch(authUser(user.uid))

        }
      })
      .catch((error)=>{
        // alert("Invalid. Try again")
        let errorMessage = "";
        if (error.data){
          if (error.data.message.slice(0,17) === "Provided password"){
            errorMessage = "Provided password doesnt match password in database."
            this.setState({pwOld_error : errorMessage, pwOld_validation: 'error'}, ()=>{
              this.refs.pwOld.show();
            })
            this.state.pwOldValid=false;
            this.state.bordercolpwOld='thin solid #FF444D';
            this.state.labeltoolheight=55;
            this.setState({tooltippwOld:"hover"});
          } else if (error.data.message.slice(0,21) === "Provided old password"){
            errorMessage = "New Password should be different from old password."
            this.setState({pwNew1_error : errorMessage, pwNew1_error_validation: 'error'}, ()=>{
              this.refs.pwNew1.show();
            })
            this.state.pwNew1Valid=false;
            this.state.bordercolpwNew1='thin solid #FF444D';
            this.state.labeltoolheight=55;
            this.setState({tooltippwNew1:"hover"});
          }
        } else {
          errorMessage = "Error in resetting password."
          this.setState({pwOld_error : errorMessage, pwOld_validation: 'error'}, ()=>{
            this.refs.pwOld.show();
          })
          this.state.pwOldValid=false;
          this.state.bordercolpwOld='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltippwOld:"hover"});
        }

        // this.setState({pwOld_error : errorMessage, pwOld_validation: 'error'})
        // this.state.pwOldValid=false;
        // this.state.bordercolpwOld='thin solid #FF444D';
        // this.state.labeltoolheight=55;
        // this.setState({tooltippwOld:"hover"});
      })
  },

  render() {

    const tooltippwOld = (
      <Popover style={{height:"auto", minHeight:"7%", color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.pwOld_error}</Popover>
    );
    const tooltippwNew1 = (
      <Popover style={{height:"auto", minHeight:"7%", color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.pwNew1_error}</Popover>
    );
    const tooltippwNew2 = (
      <Popover style={{height:"auto", minHeight:"7%", color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.pwNew2_error}</Popover>
    );

    let list = this.state.sList;
    console.log("listlistlist", list, this.state.Number)
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:220,height:120,paddingLeft:5,paddingBottom:0,paddingRight:0,paddingTop:10}
    let posstyle = {  position: 'relative', top:40, left: 0,
      width: '200px',
      float: 'left',
      textAlign:"center",
      marginLeft: '70' }

    return (
      <span className={modalContainer}>
            {this.props.login?"":<Button href='JavaScript: void(0)' onClick={this.openUserModal}
              bsStyle='primary' bsSize='large' className={btnPrimary}
              style={{borderRadius: 0, marginTop: 60,marginBottom: 20,width:'300px', marginLeft:"60", marginBottom:"30"}}>
                Change Password
            </Button>}
        <Modal
          show={this.state.showUser}
                 onHide={this.closeUser}
                 dialogClassName={userModal}
                 backdrop='static'
                 keyboard={false}
                 style={{width:'900'}}

          aria-labelledby="contained-modal-title"
          dialogClassName={modalDialogClassDash}
          backdrop='static' >
          <form style={{border: '1px solid Navy'}}>
            <div style={{marginTop:'25px',paddingLeft:'15px'}}>
            <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
              <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} style={{fontSize:27, top:12, right:26, transform: 'scale(1.3,0.9)'}} onClick={this.closeUser}>X</a>
              <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'Reset Password'}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{width:'500'}}>
              <FormGroup controlId="formpwOld" validationState={this.state.pwOld_validation}>
                <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Current Password</ControlLabel></Col>
                  <OverlayTrigger ref="pwOld" trigger={this.state.tooltippwOld} placement="right" overlay={tooltippwOld}>
                    <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.bordercolpwOld}}
                      type="password" name="groupname" placeholder="Enter Current Password"
                      onBlur={this.handleOldBlur}
                      onChange={this.handleOld}/>
                    </OverlayTrigger>
                  </FormGroup>
              <FormGroup controlId="formpwNew1" validationState={this.state.pwNew1_validation}>
                <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>New Password</ControlLabel></Col>
                  <OverlayTrigger ref="pwNew1" trigger={this.state.tooltippwNew1} placement="right" overlay={tooltippwNew1}>
                    <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.bordercolpwNew1}}
                      type="password" name="groupname" placeholder="Enter New Password"
                      onBlur={this.handleNew1Blur}
                      onChange={this.handleNew1}/>
                    </OverlayTrigger>
                  </FormGroup>
              <FormGroup controlId="formpwNew2" validationState={this.state.pwNew2_validation}>
                <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Re-Enter Password</ControlLabel></Col>
                  <OverlayTrigger ref="pwNew2" trigger={this.state.tooltippwNew2} placement="right" overlay={tooltippwNew2}>
                    <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.bordercolpwNew2}}
                      type="password" name="groupname" placeholder="Re-Enter Password"
                      onChange={this.handleNew2}/>
                    </OverlayTrigger>
                  </FormGroup>
            </Modal.Body>
            <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
              {this.props.login?"":<span><Button className={blueBtn} onClick={this.closeUser}>Cancel</Button>&nbsp;&nbsp;&nbsp;</span>}
              <Button bsStyle='primary' className={btnPrimary} onClick={this.updatePW}
                disabled={this.state.disable}
                style={{borderRadius: 0}}>
                Save
              </Button>
            </Modal.Footer>
           </div>
          </form>
         </Modal>
       </span>
        )
      },
    }
  )

export default ResetPassword
