import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import { blueBtn , btnPrimary, mytable, selectStyle, navbar,modalDialogClassDash, modalDialogClassDashLarge, hrStyle,hrStyleInDash, toolTipStyle} from 'sharedStyles/styles.css'
import {Col, Row, Grid, Button, Modal, ControlLabel, FormGroup, Popover, OverlayTrigger, FormControl} from 'react-bootstrap'
import {addUserModalHeader, modalCloseStyle, footerDivContainer, userModal, modalContainer} from './styles.css'
// import {addIntegrationModalHeader, modalCloseStyle, footerDivContainer, integrationModal, modalContainer} from './styles.css'
import {editUser, getUserById} from 'helpers/user'
import AttributeConstants from '../../../constants/AttributeConstants'
import Select from 'react-select'
import _ from 'lodash'




import ResetPassword from './ResetPassword'

const UserInfo = React.createClass({
  getInitialState(){
    return{
      // usersList:[{id:"2", name:"test2", type:"aws",description:"testingnngngngn", created:"a long time ago"}],
      usersList:[],
      userNumber: 0,
      apiKey:'',
      apiUserStatus:'',
      apiUserDescription:'',
      loadingDiv:true,
      bordercolc:'thin solid #4C58A4',
      userDepartmentList:[
        {label:"IT", value:"IT"},
        {label:"Finance", value:"Finance"},
        {label:"DevSecOps", value:"DevSecOps"},
        {label:"CISO office", value:"CISO office"},
      ],
      userTimeZoneList:[
        {label: "PT	Pacific Time	UTC -8:00 / -7:00", value:"PT	Pacific Time	UTC -8:00 / -7:00"},
        {label: "MT	Mountain Time	UTC -7:00 / -6:00", value:"MT	Mountain Time	UTC -7:00 / -6:00"},
        {label: "CT	Central Time	UTC -6:00 / -5:00", value:"CT	Central Time	UTC -6:00 / -5:00"},
        {label: "ET	Eastern Time	UTC -5:00 / -4:00", value:"ET	Eastern Time	UTC -5:00 / -4:00"}
      ],
      // userTimeZoneList:[
      //   {label: "ACDT  Australian Central Daylight Savings Time  UTC+10:30", value:"ACDT  Australian Central Daylight Savings Time  UTC+10:30"},
      //   {label: "ACST  Australian Central Standard Time  UTC+09:30", value:"ACST  Australian Central Standard Time  UTC+09:30"},
      //   {label: "ACT Acre Time UTC-05", value:"ACT Acre Time UTC-05"},
      //   {label: "ACT ASEAN Common Time UTC+06:30 - UTC+09", value:"ACT ASEAN Common Time UTC+06:30 - UTC+09"},
      //   {label: "ADT Atlantic Daylight Time  UTC-03", value:"ADT Atlantic Daylight Time  UTC-03"},
      //   {label: "AEDT  Australian Eastern Daylight Savings Time  UTC+11", value:"AEDT  Australian Eastern Daylight Savings Time  UTC+11"},
      //   {label: "AEST  Australian Eastern Standard Time  UTC+10", value:"AEST  Australian Eastern Standard Time  UTC+10"},
      //   {label: "AFT Afghanistan Time  UTC+04:30", value:"AFT Afghanistan Time  UTC+04:30"},
      //   {label: "AKDT  Alaska Daylight Time  UTC-08", value:"AKDT  Alaska Daylight Time  UTC-08"},
      //   {label: "AKST  Alaska Standard Time  UTC-09", value:"AKST  Alaska Standard Time  UTC-09"},
      //   {label: "AMST  Amazon Summer Time (Brazil)[1]  UTC-03", value:"AMST  Amazon Summer Time (Brazil)[1]  UTC-03"},
      //   {label: "AMT Amazon Time (Brazil)[2] UTC-04", value:"AMT Amazon Time (Brazil)[2] UTC-04"},
      //   {label: "AMT Armenia Time  UTC+04", value:"AMT Armenia Time  UTC+04"},
      //   {label: "ART Argentina Time  UTC-03", value:"ART Argentina Time  UTC-03"},
      //   {label: "AST Arabia Standard Time  UTC+03", value:"AST Arabia Standard Time  UTC+03"},
      //   {label: "AST Atlantic Standard Time  UTC-04", value:"AST Atlantic Standard Time  UTC-04"},
      //   {label: "AWST  Australian Western Standard Time  UTC+08", value:"AWST  Australian Western Standard Time  UTC+08"},
      //   {label: "AZOST Azores Summer Time  UTC±00", value:"AZOST Azores Summer Time  UTC±00"},
      //   {label: "AZOT  Azores Standard Time  UTC-01", value:"AZOT  Azores Standard Time  UTC-01"},
      //   {label: "AZT Azerbaijan Time UTC+04", value:"AZT Azerbaijan Time UTC+04"},
      //   {label: "BDT Brunei Time UTC+08", value:"BDT Brunei Time UTC+08"},
      //   {label: "BIOT  British Indian Ocean Time UTC+06", value:"BIOT  British Indian Ocean Time UTC+06"},
      //   {label: "BIT Baker Island Time UTC-12", value:"BIT Baker Island Time UTC-12"},
      //   {label: "BOT Bolivia Time  UTC-04", value:"BOT Bolivia Time  UTC-04"},
      //   {label: "BRST  Brasilia Summer Time  UTC-02", value:"BRST  Brasilia Summer Time  UTC-02"},
      //   {label: "BRT Brasilia Time UTC-03", value:"BRT Brasilia Time UTC-03"},
      //   {label: "BST Bangladesh Standard Time  UTC+06", value:"BST Bangladesh Standard Time  UTC+06"},
      //   {label: "BST Bougainville Standard Time[3] UTC+11", value:"BST Bougainville Standard Time[3] UTC+11"},
      //   {label: "BST British Summer Time (British Standard Time from Feb 1968 to Oct 1971) UTC+01", value:"BST British Summer Time (British Standard Time from Feb 1968 to Oct 1971) UTC+01"},
      //   {label: "BTT Bhutan Time UTC+06", value:"BTT Bhutan Time UTC+06"},
      //   {label: "CAT Central Africa Time UTC+02", value:"CAT Central Africa Time UTC+02"},
      //   {label: "CCT Cocos Islands Time  UTC+06:30", value:"CCT Cocos Islands Time  UTC+06:30"},
      //   {label: "CDT Central Daylight Time (North America) UTC-05", value:"CDT Central Daylight Time (North America) UTC-05"},
      //   {label: "CDT Cuba Daylight Time[4] UTC-04", value:"CDT Cuba Daylight Time[4] UTC-04"},
      //   {label: "CEST  Central European Summer Time (Cf. HAEC) UTC+02", value:"CEST  Central European Summer Time (Cf. HAEC) UTC+02"},
      //   {label: "CET Central European Time UTC+01", value:"CET Central European Time UTC+01"},
      //   {label: "CHADT Chatham Daylight Time UTC+13:45", value:"CHADT Chatham Daylight Time UTC+13:45"},
      //   {label: "CHAST Chatham Standard Time UTC+12:45", value:"CHAST Chatham Standard Time UTC+12:45"},
      //   {label: "CHOT  Choibalsan Standard Time  UTC+08", value:"CHOT  Choibalsan Standard Time  UTC+08"},
      //   {label: "CHOST Choibalsan Summer Time  UTC+09", value:"CHOST Choibalsan Summer Time  UTC+09"},
      //   {label: "CHST  Chamorro Standard Time  UTC+10", value:"CHST  Chamorro Standard Time  UTC+10"},
      //   {label: "CHUT  Chuuk Time  UTC+10", value:"CHUT  Chuuk Time  UTC+10"},
      //   {label: "CIST  Clipperton Island Standard Time UTC-08", value:"CIST  Clipperton Island Standard Time UTC-08"},
      //   {label: "CIT Central Indonesia Time  UTC+08", value:"CIT Central Indonesia Time  UTC+08"},
      //   {label: "CKT Cook Island Time  UTC-10", value:"CKT Cook Island Time  UTC-10"},
      //   {label: "CLST  Chile Summer Time UTC-03", value:"CLST  Chile Summer Time UTC-03"},
      //   {label: "CLT Chile Standard Time UTC-04", value:"CLT Chile Standard Time UTC-04"},
      //   {label: "COST  Colombia Summer Time  UTC-04", value:"COST  Colombia Summer Time  UTC-04"},
      //   {label: "COT Colombia Time UTC-05", value:"COT Colombia Time UTC-05"},
      //   {label: "CST Central Standard Time (North America) UTC-06", value:"CST Central Standard Time (North America) UTC-06"},
      //   {label: "CST China Standard Time UTC+08", value:"CST China Standard Time UTC+08"},
      //   {label: "ACST  Central Standard Time (Australia) UTC+09:30", value:"ACST  Central Standard Time (Australia) UTC+09:30"},
      //   {label: "ACDT  Central Summer Time (Australia) UTC+10:30", value:"ACDT  Central Summer Time (Australia) UTC+10:30"},
      //   {label: "CST Cuba Standard Time  UTC-05", value:"CST Cuba Standard Time  UTC-05"},
      //   {label: "CT  China time  UTC+08", value:"CT  China time  UTC+08"},
      //   {label: "CVT Cape Verde Time UTC-01", value:"CVT Cape Verde Time UTC-01"},
      //   {label: "CWST  Central Western Standard Time (Australia) unofficial  UTC+08:45", value:"CWST  Central Western Standard Time (Australia) unofficial  UTC+08:45"},
      //   {label: "CXT Christmas Island Time UTC+07", value:"CXT Christmas Island Time UTC+07"},
      //   {label: "DAVT  Davis Time  UTC+07", value:"DAVT  Davis Time  UTC+07"},
      //   {label: "DDUT  Dumont d'Urville Time UTC+10", value:"DDUT  Dumont d'Urville Time UTC+10"},
      //   {label: "DFT AIX specific equivalent of Central European Time[5] UTC+01", value:"DFT AIX specific equivalent of Central European Time[5] UTC+01"},
      //   {label: "EASST Easter Island Summer Time UTC-05", value:"EASST Easter Island Summer Time UTC-05"},
      //   {label: "EAST  Easter Island Standard Time UTC-06", value:"EAST  Easter Island Standard Time UTC-06"},
      //   {label: "EAT East Africa Time  UTC+03", value:"EAT East Africa Time  UTC+03"},
      //   {label: "ECT Eastern Caribbean Time (does not recognise DST) UTC-04", value:"ECT Eastern Caribbean Time (does not recognise DST) UTC-04"},
      //   {label: "ECT Ecuador Time  UTC-05", value:"ECT Ecuador Time  UTC-05"},
      //   {label: "EDT Eastern Daylight Time (North America) UTC-04", value:"EDT Eastern Daylight Time (North America) UTC-04"},
      //   {label: "AEDT  Eastern Summer Time (Australia) UTC+11", value:"AEDT  Eastern Summer Time (Australia) UTC+11"},
      //   {label: "EEST  Eastern European Summer Time  UTC+03", value:"EEST  Eastern European Summer Time  UTC+03"},
      //   {label: "EET Eastern European Time UTC+02", value:"EET Eastern European Time UTC+02"},
      //   {label: "EGST  Eastern Greenland Summer Time UTC±00", value:"EGST  Eastern Greenland Summer Time UTC±00"},
      //   {label: "EGT Eastern Greenland Time  UTC-01", value:"EGT Eastern Greenland Time  UTC-01"},
      //   {label: "EIT Eastern Indonesian Time UTC+09", value:"EIT Eastern Indonesian Time UTC+09"},
      //   {label: "EST Eastern Standard Time (North America) UTC-05", value:"EST Eastern Standard Time (North America) UTC-05"},
      //   {label: "AEST  Eastern Standard Time (Australia) UTC+10", value:"AEST  Eastern Standard Time (Australia) UTC+10"},
      //   {label: "FET Further-eastern European Time UTC+03", value:"FET Further-eastern European Time UTC+03"},
      //   {label: "FJT Fiji Time UTC+12", value:"FJT Fiji Time UTC+12"},
      //   {label: "FKST  Falkland Islands Summer Time  UTC-03", value:"FKST  Falkland Islands Summer Time  UTC-03"},
      //   {label: "FKT Falkland Islands Time UTC-04", value:"FKT Falkland Islands Time UTC-04"},
      //   {label: "FNT Fernando de Noronha Time  UTC-02", value:"FNT Fernando de Noronha Time  UTC-02"},
      //   {label: "GALT  Galapagos Time  UTC-06", value:"GALT  Galapagos Time  UTC-06"},
      //   {label: "GAMT  Gambier Islands UTC-09", value:"GAMT  Gambier Islands UTC-09"},
      //   {label: "GET Georgia Standard Time UTC+04", value:"GET Georgia Standard Time UTC+04"},
      //   {label: "GFT French Guiana Time  UTC-03", value:"GFT French Guiana Time  UTC-03"},
      //   {label: "GILT  Gilbert Island Time UTC+12", value:"GILT  Gilbert Island Time UTC+12"},
      //   {label: "GIT Gambier Island Time UTC-09", value:"GIT Gambier Island Time UTC-09"},
      //   {label: "GMT Greenwich Mean Time UTC±00", value:"GMT Greenwich Mean Time UTC±00"},
      //   {label: "GST South Georgia and the South Sandwich Islands  UTC-02", value:"GST South Georgia and the South Sandwich Islands  UTC-02"},
      //   {label: "GST Gulf Standard Time  UTC+04", value:"GST Gulf Standard Time  UTC+04"},
      //   {label: "GYT Guyana Time UTC-04", value:"GYT Guyana Time UTC-04"},
      //   {label: "HADT  Hawaii-Aleutian Daylight Time UTC-09", value:"HADT  Hawaii-Aleutian Daylight Time UTC-09"},
      //   {label: "HAEC  Heure Avancée d'Europe Centrale francised name for CEST UTC+02", value:"HAEC  Heure Avancée d'Europe Centrale francised name for CEST UTC+02"},
      //   {label: "HAST  Hawaii-Aleutian Standard Time UTC-10", value:"HAST  Hawaii-Aleutian Standard Time UTC-10"},
      //   {label: "HKT Hong Kong Time  UTC+08", value:"HKT Hong Kong Time  UTC+08"},
      //   {label: "HMT Heard and McDonald Islands Time UTC+05", value:"HMT Heard and McDonald Islands Time UTC+05"},
      //   {label: "HOVST Khovd Summer Time UTC+08", value:"HOVST Khovd Summer Time UTC+08"},
      //   {label: "HOVT  Khovd Standard Time UTC+07", value:"HOVT  Khovd Standard Time UTC+07"},
      //   {label: "ICT Indochina Time  UTC+07", value:"ICT Indochina Time  UTC+07"},
      //   {label: "IDT Israel Daylight Time  UTC+03", value:"IDT Israel Daylight Time  UTC+03"},
      //   {label: "IOT Indian Ocean Time UTC+03", value:"IOT Indian Ocean Time UTC+03"},
      //   {label: "IRDT  Iran Daylight Time  UTC+04:30", value:"IRDT  Iran Daylight Time  UTC+04:30"},
      //   {label: "IRKT  Irkutsk Time  UTC+08", value:"IRKT  Irkutsk Time  UTC+08"},
      //   {label: "IRST  Iran Standard Time  UTC+03:30", value:"IRST  Iran Standard Time  UTC+03:30"},
      //   {label: "IST Indian Standard Time  UTC+05:30", value:"IST Indian Standard Time  UTC+05:30"},
      //   {label: "IST Irish Standard Time[6]  UTC+01", value:"IST Irish Standard Time[6]  UTC+01"},
      //   {label: "IST Israel Standard Time  UTC+02", value:"IST Israel Standard Time  UTC+02"},
      //   {label: "JST Japan Standard Time UTC+09", value:"JST Japan Standard Time UTC+09"},
      //   {label: "KGT Kyrgyzstan time UTC+06", value:"KGT Kyrgyzstan time UTC+06"},
      //   {label: "KOST  Kosrae Time UTC+11", value:"KOST  Kosrae Time UTC+11"},
      //   {label: "KRAT  Krasnoyarsk Time  UTC+07", value:"KRAT  Krasnoyarsk Time  UTC+07"},
      //   {label: "KST Korea Standard Time UTC+09", value:"KST Korea Standard Time UTC+09"},
      //   {label: "LHST  Lord Howe Standard Time UTC+10:30", value:"LHST  Lord Howe Standard Time UTC+10:30"},
      //   {label: "LHST  Lord Howe Summer Time UTC+11", value:"LHST  Lord Howe Summer Time UTC+11"},
      //   {label: "LINT  Line Islands Time UTC+14", value:"LINT  Line Islands Time UTC+14"},
      //   {label: "MAGT  Magadan Time  UTC+12", value:"MAGT  Magadan Time  UTC+12"},
      //   {label: "MART  Marquesas Islands Time  UTC-09:30", value:"MART  Marquesas Islands Time  UTC-09:30"},
      //   {label: "MAWT  Mawson Station Time UTC+05", value:"MAWT  Mawson Station Time UTC+05"},
      //   {label: "MDT Mountain Daylight Time (North America)  UTC-06", value:"MDT Mountain Daylight Time (North America)  UTC-06"},
      //   {label: "MET Middle European Time Same zone as CET UTC+01", value:"MET Middle European Time Same zone as CET UTC+01"},
      //   {label: "MEST  Middle European Summer Time Same zone as CEST UTC+02", value:"MEST  Middle European Summer Time Same zone as CEST UTC+02"},
      //   {label: "MHT Marshall Islands  UTC+12", value:"MHT Marshall Islands  UTC+12"},
      //   {label: "MIST  Macquarie Island Station Time UTC+11", value:"MIST  Macquarie Island Station Time UTC+11"},
      //   {label: "MIT Marquesas Islands Time  UTC-09:30", value:"MIT Marquesas Islands Time  UTC-09:30"},
      //   {label: "MMT Myanmar Standard Time UTC+06:30", value:"MMT Myanmar Standard Time UTC+06:30"},
      //   {label: "MSK Moscow Time UTC+03", value:"MSK Moscow Time UTC+03"},
      //   {label: "MST Malaysia Standard Time  UTC+08", value:"MST Malaysia Standard Time  UTC+08"},
      //   {label: "MST Mountain Standard Time (North America)  UTC-07", value:"MST Mountain Standard Time (North America)  UTC-07"},
      //   {label: "MUT Mauritius Time  UTC+04", value:"MUT Mauritius Time  UTC+04"},
      //   {label: "MVT Maldives Time UTC+05", value:"MVT Maldives Time UTC+05"},
      //   {label: "MYT Malaysia Time UTC+08", value:"MYT Malaysia Time UTC+08"},
      //   {label: "NCT New Caledonia Time  UTC+11", value:"NCT New Caledonia Time  UTC+11"},
      //   {label: "NDT Newfoundland Daylight Time  UTC-02:30", value:"NDT Newfoundland Daylight Time  UTC-02:30"},
      //   {label: "NFT Norfolk Time  UTC+11", value:"NFT Norfolk Time  UTC+11"},
      //   {label: "NPT Nepal Time  UTC+05:45", value:"NPT Nepal Time  UTC+05:45"},
      //   {label: "NST Newfoundland Standard Time  UTC-03:30", value:"NST Newfoundland Standard Time  UTC-03:30"},
      //   {label: "NT  Newfoundland Time UTC-03:30", value:"NT  Newfoundland Time UTC-03:30"},
      //   {label: "NUT Niue Time UTC-11", value:"NUT Niue Time UTC-11"},
      //   {label: "NZDT  New Zealand Daylight Time UTC+13", value:"NZDT  New Zealand Daylight Time UTC+13"},
      //   {label: "NZST  New Zealand Standard Time UTC+12", value:"NZST  New Zealand Standard Time UTC+12"},
      //   {label: "OMST  Omsk Time UTC+06", value:"OMST  Omsk Time UTC+06"},
      //   {label: "ORAT  Oral Time UTC+05", value:"ORAT  Oral Time UTC+05"},
      //   {label: "PDT Pacific Daylight Time (North America) UTC-07", value:"PDT Pacific Daylight Time (North America) UTC-07"},
      //   {label: "PET Peru Time UTC-05", value:"PET Peru Time UTC-05"},
      //   {label: "PETT  Kamchatka Time  UTC+12", value:"PETT  Kamchatka Time  UTC+12"},
      //   {label: "PGT Papua New Guinea Time UTC+10", value:"PGT Papua New Guinea Time UTC+10"},
      //   {label: "PHOT  Phoenix Island Time UTC+13", value:"PHOT  Phoenix Island Time UTC+13"},
      //   {label: "PHT Philippine Time UTC+08", value:"PHT Philippine Time UTC+08"},
      //   {label: "PKT Pakistan Standard Time  UTC+05", value:"PKT Pakistan Standard Time  UTC+05"},
      //   {label: "PMDT  Saint Pierre and Miquelon Daylight time UTC-02", value:"PMDT  Saint Pierre and Miquelon Daylight time UTC-02"},
      //   {label: "PMST  Saint Pierre and Miquelon Standard Time UTC-03", value:"PMST  Saint Pierre and Miquelon Standard Time UTC-03"},
      //   {label: "PONT  Pohnpei Standard Time UTC+11", value:"PONT  Pohnpei Standard Time UTC+11"},
      //   {label: "PST Pacific Standard Time (North America) UTC-08", value:"PST Pacific Standard Time (North America) UTC-08"},
      //   {label: "PST Philippine Standard Time  UTC+08", value:"PST Philippine Standard Time  UTC+08"},
      //   {label: "PYST  Paraguay Summer Time (South America)[7] UTC-03", value:"PYST  Paraguay Summer Time (South America)[7] UTC-03"},
      //   {label: "PYT Paraguay Time (South America)[8]  UTC-04", value:"PYT Paraguay Time (South America)[8]  UTC-04"},
      //   {label: "RET Réunion Time  UTC+04", value:"RET Réunion Time  UTC+04"},
      //   {label: "ROTT  Rothera Research Station Time UTC-03", value:"ROTT  Rothera Research Station Time UTC-03"},
      //   {label: "SAKT  Sakhalin Island time  UTC+11", value:"SAKT  Sakhalin Island time  UTC+11"},
      //   {label: "SAMT  Samara Time UTC+04", value:"SAMT  Samara Time UTC+04"},
      //   {label: "SAST  South African Standard Time UTC+02", value:"SAST  South African Standard Time UTC+02"},
      //   {label: "SBT Solomon Islands Time  UTC+11", value:"SBT Solomon Islands Time  UTC+11"},
      //   {label: "SCT Seychelles Time UTC+04", value:"SCT Seychelles Time UTC+04"},
      //   {label: "SDT Samoa Daylight Time UTC-10", value:"SDT Samoa Daylight Time UTC-10"},
      //   {label: "SGT Singapore Time  UTC+08", value:"SGT Singapore Time  UTC+08"},
      //   {label: "SLST  Sri Lanka Standard Time UTC+05:30", value:"SLST  Sri Lanka Standard Time UTC+05:30"},
      //   {label: "SRET  Srednekolymsk Time  UTC+11", value:"SRET  Srednekolymsk Time  UTC+11"},
      //   {label: "SRT Suriname Time UTC-03", value:"SRT Suriname Time UTC-03"},
      //   {label: "SST Samoa Standard Time UTC-11", value:"SST Samoa Standard Time UTC-11"},
      //   {label: "SST Singapore Standard Time UTC+08", value:"SST Singapore Standard Time UTC+08"},
      //   {label: "SYOT  Showa Station Time  UTC+03", value:"SYOT  Showa Station Time  UTC+03"},
      //   {label: "TAHT  Tahiti Time UTC-10", value:"TAHT  Tahiti Time UTC-10"},
      //   {label: "THA Thailand Standard Time  UTC+07", value:"THA Thailand Standard Time  UTC+07"},
      //   {label: "TFT Indian/Kerguelen  UTC+05", value:"TFT Indian/Kerguelen  UTC+05"},
      //   {label: "TJT Tajikistan Time UTC+05", value:"TJT Tajikistan Time UTC+05"},
      //   {label: "TKT Tokelau Time  UTC+13", value:"TKT Tokelau Time  UTC+13"},
      //   {label: "TLT Timor Leste Time  UTC+09", value:"TLT Timor Leste Time  UTC+09"},
      //   {label: "TMT Turkmenistan Time UTC+05", value:"TMT Turkmenistan Time UTC+05"},
      //   {label: "TRT Turkey Time UTC+03", value:"TRT Turkey Time UTC+03"},
      //   {label: "TOT Tonga Time  UTC+13", value:"TOT Tonga Time  UTC+13"},
      //   {label: "TVT Tuvalu Time UTC+12", value:"TVT Tuvalu Time UTC+12"},
      //   {label: "ULAST Ulaanbaatar Summer Time UTC+09", value:"ULAST Ulaanbaatar Summer Time UTC+09"},
      //   {label: "ULAT  Ulaanbaatar Standard Time UTC+08", value:"ULAT  Ulaanbaatar Standard Time UTC+08"},
      //   {label: "USZ1  Kaliningrad Time  UTC+02", value:"USZ1  Kaliningrad Time  UTC+02"},
      //   {label: "UTC Coordinated Universal Time  UTC±00", value:"UTC Coordinated Universal Time  UTC±00"},
      //   {label: "UYST  Uruguay Summer Time UTC-02", value:"UYST  Uruguay Summer Time UTC-02"},
      //   {label: "UYT Uruguay Standard Time UTC-03", value:"UYT Uruguay Standard Time UTC-03"},
      //   {label: "UZT Uzbekistan Time UTC+05", value:"UZT Uzbekistan Time UTC+05"},
      //   {label: "VET Venezuelan Standard Time  UTC-04", value:"VET Venezuelan Standard Time  UTC-04"},
      //   {label: "VLAT  Vladivostok Time  UTC+10", value:"VLAT  Vladivostok Time  UTC+10"},
      //   {label: "VOLT  Volgograd Time  UTC+04", value:"VOLT  Volgograd Time  UTC+04"},
      //   {label: "VOST  Vostok Station Time UTC+06", value:"VOST  Vostok Station Time UTC+06"},
      //   {label: "VUT Vanuatu Time  UTC+11", value:"VUT Vanuatu Time  UTC+11"},
      //   {label: "WAKT  Wake Island Time  UTC+12", value:"WAKT  Wake Island Time  UTC+12"},
      //   {label: "WAST  West Africa Summer Time UTC+02", value:"WAST  West Africa Summer Time UTC+02"},
      //   {label: "WAT West Africa Time  UTC+01", value:"WAT West Africa Time  UTC+01"},
      //   {label: "WEST  Western European Summer Time  UTC+01", value:"WEST  Western European Summer Time  UTC+01"},
      //   {label: "WET Western European Time UTC±00", value:"WET Western European Time UTC±00"},
      //   {label: "WIT Western Indonesian Time UTC+07", value:"WIT Western Indonesian Time UTC+07"},
      //   {label: "WST Western Standard Time UTC+08", value:"WST Western Standard Time UTC+08"},
      //   {label: "YAKT  Yakutsk Time  UTC+09", value:"YAKT  Yakutsk Time  UTC+09"},
      //   {label: "YEKT  Yekaterinburg Time  UTC+05", value:"YEKT  Yekaterinburg Time  UTC+05"}
      // ],
      savedTimeZone:"",
      savedDepartment:"",
      savedFirst:"",
      savedLast:"",
      savedTitle:"",
      userOption :'User',
      showPwdDescription:"Show characters",
      passType:"password",
      desc:"",
      userFirstName:"",
      userLastName:"",
      userTitle:"",
      userRole:"",
      userEmail:"",
      userTimeZone:"",
      userDepartment:"",
      UserInfo: {
            // "id": 0,
            // "email": "admin@mail.me",
            // "username": "administrator",
            // "password": "cavirin123",
            // "created": 1500458235514,
            // "roles": "ROLE_ADMIN",
            // "modified": 1500514411151,
            // "active": true
        }
      }
  },
  componentDidMount(){
     //get count of users
     let userId = localStorage.getItem('userID');
     console.log("localStorage.getItem('userID');", userId)

     getUserById(userId)
      .then(
      (users) =>  {
        console.log("localStorage.getItem('userID');1", users)

        this.setState({
          UserInfo: users,
          userFirstName:users.firstName,
          userLastName:users.lastName,
          userTitle:users.title,
          userRole:users.roles,
          userEmail:users.email,
          userTimeZone:users.timezone,
          userDepartment:users.department

          // loadingDiv:false
        },(res)=>{console.log("this.state.UserInfo", this.state)});
      }
     )
    .catch((error) => console.log("Error in getCredentialsList in container:" + error))

  },
  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     usersList:nextProps.usersList
  //   })
  // },

// onChange={this.saveDepartment}

update(itemSaved) {
  console.log(itemSaved, "this is the item saved")
  let userInfo={}
  let userId = localStorage.getItem('userID');
  // "username":"test4",
  // "password":"password",
  // "email":"test@email.com",
  // "roles": "ROLE_ADMIN",
  // "active": "TRUE",
  // "title": "title",
  // "department": "department",
  // "timezone": "PST",
  // "firstName": "Kevin",
  // "lastName": "Duffey"
  userInfo.username = this.state.userUsername
  userInfo.firstName = this.state.userFirstName
  userInfo.lastName = this.state.userLastName
  // userInfo.password = this.state.userFirstName
  userInfo.title = this.state.userTitle
  userInfo.roles = this.state.userRole
  userInfo.email = this.state.userEmail
  userInfo.timezone = this.state.userTimeZone
  userInfo.department = this.state.userDepartment

  // console.log("tempUserInfotempUserInfotempUserInfotempUserInfo", this.props.selectedUserIds[0], userInfo)

  if (userInfo) {
    var that = this;
      editUser(userId, userInfo)
      .then((response)=>{
        console.log("new user info", userInfo)
        let update = {};
        update[itemSaved] = "Saved!"
        that.setState(update, ()=>{
          setTimeout(function(){
            update[itemSaved] = ""
           that.setState(update);
           }, 3000)
        })
      })
      .catch((error)=>{
        console.log("error from updating user", error)
      })
  }

},

debouncedSave: _.debounce(function(e) {
  this.update(e)
}, 1500),

saveFirst(e){
  let that = this;
  this.setState({
    userFirstName:e.target.value
  }, ()=>{
    this.debouncedSave("savedFirst");
  })
},

saveLast(e){
  let that = this;
  this.setState({
    userLastName:e.target.value
  }, ()=>{
    // setTimeout(function(){
      this.debouncedSave("savedLast")
    // }, 2000)
  })
},

saveTitle(e){
  let that = this;
  this.setState({
    userTitle:e.target.value
  }, ()=>{
    // setTimeout(function(){
      this.debouncedSave("savedTitle")
    // }, 2000)
  })
},

saveDepartment(e){
  let that = this;
  this.setState({
    userDepartment:e
  }, ()=>{
    // setTimeout(function(){
      this.debouncedSave("savedDepartment")
    // }, 2000)
  })
},

  saveTimezone(value){
    let that = this;
    this.setState({
      userTimeZone:value
    }, ()=>{
      // setTimeout(function(){
        this.debouncedSave("savedTimeZone")
      // }, 2000)
    })
  },
  showToolTip(){
    document.getElementById('tootTipId').style.visibility="visible";
  },
  hideToolTip(){
    document.getElementById('tootTipId').style.visibility="hidden";
  },
  render() {

    let profileSVG = (<svg width="240px" height="240px" display="block" style={{margin:"auto", position:"relative", top:"10%", bottom:"90%"}} viewBox="0 0 34 34" version="1.1">
        <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Group-3" transform="translate(1.000000, 1.000000)">
                <circle id="Oval-6" stroke="#FFFFFF" fill-opacity="0.3" fill="#D8D8D8" cx="16" cy="16" r="16"></circle>
                <path d="M19.1550404,24.4269952 L19.1550404,23.908489 C20.2184177,22.9721469 21.1074011,21.6255463 21.5338154,20.0483782 C21.5423224,20.0483782 21.6125053,20.0527081 21.6220757,20.0527081 C22.9353467,20.0527081 23.2735006,17.2761562 23.2735006,16.8604853 C23.2735006,16.4458968 23.3245427,14.785378 21.9953211,14.785378 C24.8536793,6.88330043 17.2888133,3.71380958 11.6029349,7.76227126 C9.25818801,7.76227126 9.07316036,11.2738247 9.93449596,14.785378 C8.60740111,14.785378 8.66163335,16.4458968 8.66163335,16.8604853 C8.66163335,17.2761562 8.96788601,20.0527081 10.2822203,20.0527081 C10.2843471,20.0527081 10.410889,20.0505432 10.4130157,20.0505432 C10.8383667,21.6201339 11.7113994,22.9613222 12.7747767,23.8987467 L12.7747767,24.4269952 C12.7747767,25.3048836 12.6503615,26.7045255 8.33943003,27.4990632 C7.4281157,27.666847 6.61675883,27.9850951 6,28.3823639 C8.74032327,30.6414921 12.1952361,32 15.9957465,32 C19.7930668,32 23.2607401,30.6436571 26,28.3888588 C25.3864313,27.9937549 24.5059549,27.6733419 23.604211,27.4990632 C19.3049766,26.6623089 19.1550404,25.3048836 19.1550404,24.4269952" id="Fill-1" fill="#FFFFFF"></path>
            </g>
        </g>
    </svg>)
    console.log("this.state.userFirstName", this.state.userFirstName)
    let list = this.state.usersList;
    console.log("listlistlist", list, this.state.userNumber)
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:220,height:120,paddingLeft:5,paddingBottom:0,paddingRight:0,paddingTop:10}
    let posstyle = {  position: 'relative', top:40, left: 0,
      width: '200px',
      float: 'left',
      textAlign:"center",
      marginLeft: '70' }

    return (
      <span className={modalContainer}>
        <Row style={{backgroundColor: "white", marginRight:"60px", marginLeft:"60px", marginTop:"60px", paddingTop:"30"}}>
          <Col lg={4}>
            <div style={{height:"300", width:"300", backgroundColor:"lightgray", marginTop:"30", marginLeft:"40"}}>{profileSVG}</div>

            <span style={{position:'relative'}}>
              <Button onMouseOver={this.showToolTip} onMouseOut={this.hideToolTip} bsSize='large' style={posstyle} className={blueBtn} >Upload Image</Button>
              <div id="tootTipId" className={toolTipStyle} style={{width:115, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:95, left:-160, padding:'6px 4px', borderRadius:3}}>Coming Soon</div>
            </span>

          </Col>
          <Col lg={8}>
            <FormGroup  controlId="userLabel" style={{marginTop:"20px"}}>
             <span className="col-lg-12" style={{marginLeft:"-17px"}}>
               <ControlLabel key={this.state.userFirstName} style={{fontSize:'15px',fontWeight:500, marginLeft:'60'}}>First Name</ControlLabel>&nbsp; <span style={{color:'#00C484'}}>{this.state.savedFirst}</span>
             </span>
               <FormControl type="text"
                   name="GroupLabel"
                   onChange={this.saveFirst}
                   value={this.state.userFirstName?this.state.userFirstName:""}
                   style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0, marginLeft:"60px"}}
                     />
            </FormGroup>
            <FormGroup  controlId="userLabel" style={{marginTop:"20px"}}>
             <span className="col-lg-12" style={{marginLeft:"-17px"}}>
               <ControlLabel style={{fontSize:'15px',fontWeight:500, marginLeft:'60'}}>Last Name</ControlLabel>&nbsp; <span style={{color:'#00C484'}}>{this.state.savedLast}</span>
             </span>
               <FormControl type="text"
                   name="GroupLabel"
                   onChange={this.saveLast}
                   value={this.state.userLastName?this.state.userLastName:""}
                   style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0, marginLeft:"60px"}}
                     />
            </FormGroup>
            <FormGroup  controlId="userLabel" style={{marginTop:"20px"}}>
             <span className="col-lg-12" style={{marginLeft:"-17px"}}>
               <ControlLabel style={{fontSize:'15px',fontWeight:500, marginLeft:'60'}}>Title</ControlLabel>&nbsp; <span style={{color:'#00C484'}}>{this.state.savedTitle}</span>
             </span>
               <FormControl type="text"
                   name="GroupLabel"
                   onChange={this.saveTitle}
                   value={this.state.userTitle?this.state.userTitle:""}
                   style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0, marginLeft:"60px"}}
                     />
            </FormGroup>
            <FormGroup  controlId="userLabel" style={{marginTop:"20px"}}>
             <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Role</ControlLabel>
               <FormControl type="text"
                   name="GroupLabel"
                   disabled={true}
                   value={this.state.userRole?AttributeConstants.ROLES[this.state.userRole] || this.state.userRole:""}
                   style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0, marginLeft:"60px"}}
                     />
            </FormGroup>
            <FormGroup controlId="userLabel" style={{marginTop:"20px", marginLeft:"60"}}>
              <span className="col-lg-12" style={{marginLeft:"-17px"}}>
                <ControlLabel style={{fontWeight:500,padding:'0'}}>Department </ControlLabel>&nbsp; <span style={{color:'#00C484'}}>{this.state.savedDepartment}</span>
              </span>

               <Select placeholder={<i>Select Department</i>}
                 name=""
                 value={this.state.userDepartment?this.state.userDepartment:""}
                 options={this.state.userDepartmentList}
                 searchable={true}
                 multi={false}
                 clearable={false}
                 allowCreate={false}
                 onChange={this.saveDepartment}/>

               {/*<select
                 className={selectStyle}
                 id="userTypeid"
                 placeholder= "Select Department"
                 style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0}}
                 onChange={this.saveDepartment}
                 value={this.state.userDepartment?this.state.userDepartment:""}>
               {
                 this.state.userDepartmentList.map((item) =>
                 {
                   return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                 }
                 )}
               </select>*/}
            </FormGroup>
            <FormGroup  controlId="userLabel" style={{marginTop:"20px"}}>
             <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Email</ControlLabel>
               <FormControl type="text"
                   name="GroupLabel"
                   disabled={true}
                   value={this.state.userEmail?this.state.userEmail:""}
                   style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0, marginLeft:"60px"}}
                     />
            </FormGroup>
            <FormGroup controlId="userLabel" style={{marginTop:"20px", marginLeft:"60"}}>
              <span className="col-lg-12" style={{marginLeft:"-17px"}}>
                <ControlLabel style={{fontWeight:500,padding:'0'}}>Time Zone </ControlLabel>&nbsp; <span style={{color:'#00C484'}}>{this.state.savedTimeZone}</span>
              </span>

                 <Select id="timezone"  placeholder={<i>Select Timezone</i>}
                   name=""
                   value={this.state.userTimeZone?this.state.userTimeZone:""}
                   options={this.state.userTimeZoneList}
                   searchable={true}
                   multi={false}
                   clearable={false}
                   allowCreate={false}
                   onChange={this.saveTimezone}/>
              </FormGroup>

            {/*<Button onClick={this.openUserModal}
            bsSize='large' style={posstyle} className={blueBtn} >Reset Password</Button>*/}
            <ResetPassword/>
            {/*}<Button href='JavaScript: void(0)' onClick={this.openUserModal}
              bsStyle='primary' bsSize='large' className={btnPrimary}
              style={{borderRadius: 0, marginTop: 60,marginBottom: 20,width:'300px', marginLeft:"60", marginBottom:"30"}}>
                Reset
            </Button>
            <Button href='JavaScript: void(0)' onClick={this.openUserModal}
              bsStyle='primary' bsSize='large' className={btnPrimary}
              style={{borderRadius: 0, marginTop: 60,marginBottom: 20,width:'300px', marginLeft:"60", marginBottom:"30"}}>
                Save
            </Button>*/}
          </Col>
        </Row>

       </span>
        )
      },
    }
  )

export default UserInfo
