// import React, {PropTypes} from 'react'
// import ReactDOM from 'react-dom'
// import {connect } from 'react-redux'
// import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
// import {spacer} from 'sharedStyles/styles.css'
// import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange} from './styles.css'
// import {Table,Column, Cell} from 'fixed-data-table'
// import {Header } from 'components/Header/Header'
// import Dimensions from 'react-dimensions'
// import ReactTooltip from 'react-tooltip'
// import AutoComplete from 'material-ui/AutoComplete'
// import Select from './src/Select';
// import Creatable from './src/Creatable';
//
//
// const AutoSearch = React.createClass({
//   getInitialState(){
//     return {
//         value: '',
//         test:[],
//         suggestions: [],
//         multiValue:[],
//         multi: true,
//         value: '',
//         inside: false,
//         option:[],
//         sample: [
//             { label: 'Global', value: 1, clearableValue: false },
//             { label: 'OS', value: 2, clearableValue: false },
//             { label: 'Env', value: 3, clearableValue: false },
//             { label: 'Tag', value: 4, clearableValue: false },
//             { label: 'Accessiblity', value: 5, clearableValue: false }
//         ],
//         sample2: [
//           {
//           name:"Global",
//             value: [
//               { label: 'Global:OS', value: 21, clearableValue: false },
//               { label: 'Global:Group', value: 22, clearableValue: false },
//               { label: 'Global:Tag', value: 23, clearableValue: false },
//               { label: 'Global:Env', value: 24, clearableValue: false },
//               { label: 'Global:Test Status', value: 25, clearableValue: false },
//               { label: 'Global:Compliance Status', value: 26, clearableValue: false }
//             ]
//           },
//           {
//           name:"OS",
//           value: [
//             { label: 'OS:Linux', value: 31, clearableValue: false },
//             { label: 'OS:Ubuntu', value: 32, clearableValue: false },
//             { label: 'OS:Windows', value: 33, clearableValue: false }
//             ]
//           },
//           {
//           name:"Env",
//           value: [
//             { label: 'Env:OnPrem', value: 41, clearableValue: false },
//             { label: 'Env:AWS', value: 42, clearableValue: false }
//           ]
//           },
//           {
//           name:"Tag",
//           value: [
//             { label: 'Tag:Dev', value: 51, clearableValue: false },
//             { label: 'Tag:Prod', value: 52, clearableValue: false },
//             { label: 'Tag:QA', value: 53, clearableValue: false },
//           ]
//           },
//           {
//           name:"Accessiblity",
//           value: [
//             { label: 'Accessiblity:Yes', value: 61, clearableValue: false },
//             { label: 'Accessiblity:No', value: 62, clearableValue: false }
//           ]
//           }
//         ]
//       };
//   },
//   handleChange (values) {
//     this.setState({values})
//   },
//   componentDidMount() {
//     this.props.getDataTags("AllResources")
//     .then((tags) => {
//       console.log("tagsTAGS:", tags.values.values, tags.values.tags);
//       this.setState({sample: tags.values.tags, option:tags.values.tags, sample2: tags.values.values});
//       // Set tags to local storage
//       if(!localStorage.getItem('searchTags')){
//         localStorage.setItem('searchTags', JSON.stringify(tags.values.tags))
//       }
//       if(!localStorage.getItem('searchSuggestions')){
//         localStorage.setItem('searchSuggestions', JSON.stringify(tags.values.values))
//       }
//     })
//     .catch((error) => console.log("Error in getting resources list:"+error))
//   },
//   findElement(arr, propName, propValue) {
//     for (let i=0; i < arr.length; i++)
//       if (arr[i].name == propValue)
//         return arr[i];
//   },
//   updateValue (newValue, deleted) {
//     console.log("onChange is called and this is the new value ", newValue, deleted, this.state.test, this.state.inside)
//         this.setState({
//         value: newValue,
//        }, (test)=>{
//          if (this.state.value) {
//            console.log("THINGS ARE STARTING TO MAKE SENSE", this.state.value )
//           this.searchOnEnter(newValue, deleted)
//         }
//       });
//     if(this.state.inside){
//        this.setState({
//        option: this.state.sample,
//        inside: false
//      });
//     }
//   },
//   onInputChange(newValue) {
//      if (this.state.inside === false && newValue && newValue[newValue.length-1] === ":") {
//        let findBy = newValue.slice(0, newValue.length-1)
//        let colObj = this.findElement(this.state.sample2, name, findBy);
//        let value = colObj.values;
//        this.setState({
//         option:value,
//         inside:true
//       });
//     }
//   },
//   searchOnEnter(newValue, deleted){
//     // var newValue = 2
//     console.log("Raw search values", this.state.value, newValue)
//     // console.log("Raw search values", this.state.value, newItem, value)
//     var key, value;
//     if (newValue.length > 0) {
//       var newItem = newValue[newValue.length-1].value
//       if (newItem){
//         for (var i = 0; i < newItem.length; i++) {
//            if (newItem[i] === ":") {
//              key = newItem.slice(0, i);
//             value = newItem.slice(i+1, newItem.length)
//             console.log("key! Value!", key, value)
//           }
//         }
//       }
//     } else {
//       console.log("VERIFICATION ", key, value)
//     }
//     this.props.searchNow(key, value, deleted);
//   },
//   onFocus(event, value) {
//     let newValue = value.label
//     this.onInputKeyDown(event, newValue)
//     this.onInputChange(newValue);
//     if (this.state.inside === false && newValue[newValue.length-1] === ":") {
//       let findBy = newValue.slice(0, newValue.length-1)
//       let colObj = this.findElement(this.state.sample2, name, findBy);
//       let value = colObj.values;
//       this.setState({
//         option:value,
//         inside:true
//       });
//     }
//   },
//   onInputKeyDown(event, newValue) {
//      if (this.state.inside === true && event.keyCode === 9 || event.keyCode === 13 || event.type === 'focus') {
//       var updateValue = newValue + ":";
//        if (this.state.inside === true) {
//         this.setState({
//           inside:false,
//           option:this.state.sample,
//         });
//       }
//     } else if (this.state.inside === false && event.keyCode === 9 || event.keyCode === 13 || event.type === 'focus') {
//       this.setState({
//         inside:false,
//         option:this.state.sample,
//       });
//     }
//   },
//   render (selectProps) {
//     let option=this.state.option;
//     let multiValue=this.state.multiValue;
//     let multi=this.state.multi;
//     let value=this.state.value;
//     return (
//       <div>
//         <Row>
//           <Col lg={12}>
//             <FormGroup controlId="searches" className="searches">
//               <InputGroup style={{marginRight:"60px"}}>
//                 <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
//                      <Creatable style={{border:"0", width:"1000"}}
//                       {...selectProps}
//                         onInputKeyDown={this.onInputKeyDown}
//                         name="form-field-name"
//                         placeholder="Search for Tags..."
//                         value={this.state.value}
//                         options={option}
//                         onChange={this.updateValue}
//                         customOptions={true}
//                         delimiter={"/"}
//                         joinValues={true}
//                         onInputChange={this.onInputChange}
//                         multi={multi}
//                         allowCreate={true}
//                     />
//                </InputGroup>
//             </FormGroup>
//           </Col>
//         </Row>
//       </div>
//   )}
// });
// export default AutoSearch


import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import Dimensions from 'react-dimensions'
import ReactTooltip from 'react-tooltip'
import AutoComplete from 'material-ui/AutoComplete'
import Select from './src/Select';
import Creatable from './src/Creatable';
import * as _ from 'underscore'

function transformOptions(options) {
  // console.log("optionsoptionsoptionsoptions", options)
  const option = (value, label, render, tagGroup, disabled = false) => ({value, label, render, tagGroup, disabled});

  return options.reduce((acc, o) => {
    // console.log("ooooooooooooooooooooooo", o.tagGroup)
    const parent = option(o.value, o.label, (<strong style={{color: '#000'}}>{o.label}</strong>), o.tagGroup, true);
    const children = o.children.map(c => option(c.value, c.label, <div style={{paddingLeft: 10}}>{c.label}</div>, c.tagGroup));
    // console.log("acc.concat(parent).concat(children)", acc.concat(parent).concat(children))
    return acc.concat(parent).concat(children);
  }, []);
}

var ops = [{
  label: 'Black',
  value: 'black',
}, {
  label: 'Primary Colors',
  options: [{
    label: 'Yellow',
    value: 'yellow'
  }, {
    label: 'Red',
    value: 'red'
  }, {
    label: 'Blue',
    value: 'blue'
  }]
}, {
  label: 'Secondary Colors',
  options: [{
    label: 'Orange',
    value: 'orange'
  }, {
    label: 'Purple',
    options: [{
      label: 'Light Purple',
      value: 'light_purple'
    }, {
      label: 'Medium Purple',
      value: 'medium_purple'
    }, {
      label: 'Dark Purple',
      value: 'dark_purple'
    }]
  }, {
    label: 'Green',
    value: 'green'
  }]
}, {
  label: 'White',
  value: 'white',
}];

export const GroupedOptionsField = React.createClass({
  displayName: 'GroupedOptionsField',
  propTypes: {
    delimiter: React.PropTypes.string,
    label: React.PropTypes.string,
    multi: React.PropTypes.bool,
  },

  getInitialState () {
    return {
      value: null,
    };
  },

  onChange(value) {
    this.setState({ value });
    console.log('Option Groups Select value changed to', value);
  },

  render () {
    return (
      <div className="section">
        <h3 className="section-heading">{this.props.label}</h3>
        <Select
          onChange={this.onChange}
          options={ops}
          placeholder="Select a color"
          value={this.state.value} />
      </div>
    );
  }
});

var options = [
  { value: 'AWS TAGS', label: 'AWS TAGS', tagGroup:"AWS", children: [
    { value: 'Global', label: 'Global', tagGroup:"AWSGLOBAL"},
    { value: 'OS', label: 'OS', tagGroup:"AWSOS"}
  ]},
  { value: 'GLOBAL TAGS', label: 'GLOBAL TAGS', tagGroup:"GLOBAL", children: [
    { value: 'OS', label: 'OS', tagGroup:"GLOBALOS"},
    { value: 'Tag', label: 'Tag', tagGroup:"GLOBALTAG"}
  ]},
];

// var options = [
//    { value: 'AWS TAGS', label: 'AWS TAGS', tagGroup:"AWS", children: [
//    { value: 'AWS TAGS', label: 'AWS TAGS', children: [
//    { value: 'Global', label: 'Global', tagGroup:"AWSGLOBAL"},
//     { value: 'OS', label: 'OS', tagGroup:"AWSOS"}
//   ]},
//    { value: 'GLOBAL TAGS', label: 'GLOBAL TAGS', tagGroup:"GLOBAL", children: [
//    { value: 'GLOBAL TAGS', label: 'GLOBAL TAGS', children: [
//     { value: 'OS', label: 'OS', tagGroup:"GLOBALOS"},
//     { value: 'Tag', label: 'Tag', tagGroup:"GLOBALTAG"}
//   ]},
// ];

const AutoSearch = React.createClass({
  getInitialState(){
    return {
        value: '',
        searchInput: '',
        test:[],
        suggestions: [],
        multiValue:[],
        multi: true,
        value: '',
        inside: false,
        dropdownPosition:{},
        option:[],
        sample: [
            { label: 'Global', value: 1, clearableValue: false },
            { label: 'OS', value: 2, clearableValue: false },
            { label: 'Env', value: 3, clearableValue: false },
            { label: 'Tag', value: 4, clearableValue: false },
            { label: 'Accessiblity', value: 5, clearableValue: false }
        ],
        sample2: [
          {
          name:"Global",
            value: [
              { label: 'Global:OS', value: 21, clearableValue: false },
              { label: 'Global:Group', value: 22, clearableValue: false },
              { label: 'Global:Tag', value: 23, clearableValue: false },
              { label: 'Global:Env', value: 24, clearableValue: false },
              { label: 'Global:Test Status', value: 25, clearableValue: false },
              { label: 'Global:Compliance Status', value: 26, clearableValue: false }
            ]
          },
          {
          tagGroup: 'GLOBALOS',
          values: [
            { label: 'GLOBAL:OS:Li nux', value: 'GLOBAL:OS:Li nux', tagGroup: 'GLOBAL', inner:true},
            { label: 'GLOBAL:OS:Ubu ntu', value: 'GLOBAL:OS:Ubu ntu', tagGroup: 'GLOBAL', inner:true },
            { label: 'GLOBAL:OS:Wind ows', value: 'GLOBAL:OS:Wind ows', tagGroup: 'GLOBAL', inner:true }
            ]
          },
          {
          tagGroup: 'GLOBALTAG',
          values: [
            { label: 'GLOBAL:TAG:Li nux', value: 'GLOBAL:TAG:Li nux', tagGroup: 'GLOBAL', inner:true},
            { label: 'GLOBAL:TAG:Ubu ntu', value: 'GLOBAL:TAG:Ubu ntu', tagGroup: 'GLOBAL', inner:true },
            { label: 'GLOBAL:TAG:Wind ows', value: 'GLOBAL:TAG:Wind ows', tagGroup: 'GLOBAL', inner:true }
            ]
          },
          {
          tagGroup: 'AWSOS',
          values: [
            { label: 'AWS:OS:Linux', value: 'AWS:OS:Linux', tagGroup: 'AWS', inner:true },
            { label: 'AWS:OS:Ubuntu', value: 'AWS:OS:Ubuntu', tagGroup: 'AWS', inner:true },
            { label: 'AWS:OS:Windows', value: 'AWS:OS:Windows', tagGroup: 'AWS', inner:true }
            ]
          },
          {
          tagGroup: 'AWSGLOBAL',
          values: [
            { label: 'AWS:GLOBAL:Linux', value: 'AWS:GLOBAL:Linux', tagGroup: 'AWS', inner:true },
            { label: 'AWS:GLOBAL:Ubuntu', value: 'AWS:GLOBAL:Ubuntu', tagGroup: 'AWS', inner:true },
            { label: 'AWS:GLOBAL:Windows', value: 'AWS:GLOBAL:Windows', tagGroup: 'AWS', inner:true }
            ]
          },
          // {
          //   "name":"OS",
          //   "values":[
          //     {"label":"OS:10.0.163.81","value":"OS:10.0.163.81"},
          //     {"label":"OS:10.101.10.1","value":"OS:10.101.10.1"},
          //     {"label":"OS:10.101.10.10","value":"OS:10.101.10.10"},
          //     {"label":"OS:10.101.10.100","value":"OS:10.101.10.100"},
          //     {"label":"OS:10.101.10.101","value":"OS:10.101.10.101"},
          //     {"label":"OS:10.101.10.102","value":"OS:10.101.10.102"},
          //     {"label":"OS:10.101.10.103","value":"OS:10.101.10.103"},
          //     {"label":"OS:10.101.10.104","value":"OS:10.101.10.104"},
          //     {"label":"OS:10.101.10.105","value":"OS:10.101.10.105"},
          //     {"label":"OS:10.101.10.106","value":"OS:10.101.10.106"},
          //     {"label":"OS:10.101.10.107","value":"OS:10.101.10.107"},
          //     {"label":"OS:10.101.10.108","value":"OS:10.101.10.108"},
          //     {"label":"OS:10.101.10.109","value":"OS:10.101.10.109"}
          //   ]
          // },
          {
          name:"Env",
          value: [
            { label: 'Env:OnPrem', value: 41, clearableValue: false },
            { label: 'Env:AWS', value: 42, clearableValue: false }
          ]
          },
          {
          name:"Tag",
          value: [
            { label: 'Tag:Dev', value: 51, clearableValue: false },
            { label: 'Tag:Prod', value: 52, clearableValue: false },
            { label: 'Tag:QA', value: 53, clearableValue: false },
          ]
          },
          {
          name:"Accessiblity",
          value: [
            { label: 'Accessiblity:Yes', value: 61, clearableValue: false },
            { label: 'Accessiblity:No', value: 62, clearableValue: false }
          ]
          }
        ]
      };
  },
  handleChange (values) {
    this.setState({values})
  },
  componentDidMount() {
    var searchInput = document.getElementsByName('importantInput')

    this.setState({
      searchInput: searchInput[0]
    })
    searchInput[0].addEventListener('input', function () {
      console.log("searchInputsearchInputsearchInputsearchInput", searchInput)
      var coordinates = getCaretCoordinates(this, this.selectionEnd);
      console.log("coordinates.top", coordinates.top);
      console.log("coordinates.left", coordinates.left);
    })
    var SearchType = "AllResources";
    if(this.props.type!=undefined)
    {
      SearchType = this.props.type;
    }
    this.props.getDataTags(SearchType)
    .then((tags) => {
      // console.log("tagsTAGS:", JSON.stringify(tags.values.values), tags.values.tags);
      this.setState({
        sample: tags.values.tags,
        option:tags.values.tags, sample2: tags.values.values});
      // Set tags to local storage
      if(!localStorage.getItem('searchTags')){
        localStorage.setItem('searchTags', JSON.stringify(tags.values.tags))
      }
      if(!localStorage.getItem('searchSuggestions')){
        localStorage.setItem('searchSuggestions', JSON.stringify(tags.values.values))
      }
    })
    .catch((error) => console.log("Error in getting resources list:"+error))
  },
  findElement(arr, propName, propValue) {
    for (let i=0; i < arr.length; i++)
      if (arr[i].tagGroup == propValue)
        return arr[i];
  },
  findDeleted(newValue, oldValue){
    for (var key in oldValue) {
      if (!newValue[key]){
        return oldValue[key]
      } else {
        console.log("This one is not deleted: ", newValue[key])
      }
    }

  },
  updateValue (newValue, deleted) {
    let deletedValue
    if(deleted){
      deletedValue = this.findDeleted(newValue, this.state.value)
      console.log("onChange is called and this is the deleted new value ", deletedValue
      // , newValue, deleted, this.state.test, this.state.inside
    );
    }
        this.setState({
        value: newValue,
       }, (test)=>{
         if (this.state.value) {
           console.log("THINGS ARE STARTING TO MAKE SENSE", this.state.value, newValue, deletedValue, deleted)
          this.searchOnEnter(newValue, deletedValue, deleted)
        }
      });
    if(this.state.inside){
       this.setState({
       option: this.state.sample,
       inside: false
     });
    }
  },
  onInputChange(newValue, tagGroup) {
    console.log("finding new values ", newValue, tagGroup)
     if (this.state.inside === false && newValue && newValue[newValue.length-1] === ":") {
       let findBy = newValue.slice(0, newValue.length-1)
       let colObj = this.findElement(this.state.sample2, tagGroup, tagGroup);
       let value = colObj.values;
       console.log("valuevaluealuevaluevaluevaluealuevalue ", value)
       this.setState({
        option:value,
        inside:true
      }, (res)=>{console.log("optionoption ", this.state.option)});
    }
  },
  calculateNewDropdownPosition(){
    var rect = this.state.searchInput.getBoundingClientRect();
    this.setState({
      dropdownPosition: (rect)
    })

  },
  searchOnEnter(newValue, deletedValue, deleted){
    console.log("IS THIS CALLED CONSISTANTLY???", newValue, deletedValue, deleted)
    this.calculateNewDropdownPosition()

    if(deleted){
      console.log("what happens when delete happend????", newValue, deletedValue, deleted)
      this.props.deleteNow(newValue, deletedValue, deleted);
    } else {
      // var newValue = 2
      console.log("Raw search values", this.state.value, newValue)
      // console.log("Raw search values", this.state.value, newItem, value)
      var key, value;
      if (newValue.length > 0) {
        var newItem = newValue[newValue.length-1].value
        console.log("newValuenewValuenewValue ", newValue)
        var tag = newValue[newValue.length-1].tagGroup
        if (newItem){
          if(newValue[newValue.length-1].scanTimeStart){
            key = "GLOBAL:LASTSCAN"
            value = {
              scanTimeStart: newValue[newValue.length-1].scanTimeStart,
              scanTimeEnd: newValue[newValue.length-1].scanTimeEnd
            }
          } else {
            for (var i = 0; i < newItem.length; i++) {
               if (newItem[i] === ":") {
                 key = newItem.slice(0, i);
                value = newItem.slice(i+1, newItem.length)
                console.log("key! Value!", key, value)
              }
            }
          }
        }
      } else {
        console.log("VERIFICATION ", key, value)
      }
      console.log("this.props.searchNow(key, value, tag, deleted)", key, value, tag, deleted)
      this.props.searchNow(newValue, key, value, tag, deleted);
    }
  },
  onFocus(event, value) {
    let newValue = value.label;
    this.onInputKeyDown(event, newValue)
    this.onInputChange(newValue, value.tagGroup);
    if (this.state.inside === false && newValue[newValue.length-1] === ":") {
      let findBy = newValue.slice(0, newValue.length-1)
      let colObj = this.findElement(this.state.sample2, name, findBy);
      let value = colObj.values;
      this.setState({
        option:value,
        inside:true
      });
    }
  },
  onInputKeyDown(event, newValue, tagGroup) {
    // this.calculateNewDropdownPosition()

     if (this.state.inside === true && event.keyCode === 9 || event.keyCode === 13 || event.type === 'focus') {
      var updateValue = newValue + ":";
       if (this.state.inside === true) {
        this.setState({
          inside:false,
          option:this.state.sample,
        });
      }
    } else if (this.state.inside === false && event.keyCode === 9 || event.keyCode === 13 || event.type === 'focus') {
      this.setState({
        inside:false,
        option:this.state.sample,
      });
    }
  },

  optionRenderer(){
    if (!this.state.inside){
      option => option.render
    } else {
      console.log("hihi =)")
    }
  },
  render (selectProps) {
    let option=this.state.option;
    let multiValue=this.state.multiValue;
    let multi=this.state.multi;
    let value=this.state.value;
    let search;
    if (!this.state.inside){
      search = (<Creatable style={{border:"0", width:"1000"}}
        {...selectProps}
          position={this.state.dropdownPosition}
          offSet={this.props.offSet || 200}
          ref="searches"
          onInputKeyDown={this.onInputKeyDown}
          name="form-field-name"
          placeholder="Search for Tags..."
          value={this.state.value}
          options={option}
          onChange={this.updateValue}
          customOptions={true}
          delimiter={"/"}
          joinValues={true}
          onInputChange={this.onInputChange}
          multi={multi}
          allowCreate={true}
          options={this.state.inside?option:transformOptions(this.state.option)}
          optionRenderer={option => option.render}
      />)
    } else {
      search = (<Creatable style={{border:"0", width:"1000"}}
        {...selectProps}
          position={this.state.dropdownPosition}
          offSet={this.props.offSet}
          ref="searches"
          onInputKeyDown={this.onInputKeyDown}
          name="form-field-name"
          placeholder="Search for Tags..."
          value={this.state.value}
          options={option}
          onChange={this.updateValue}
          customOptions={true}
          delimiter={"/"}
          joinValues={true}
          onInputChange={this.onInputChange}
          multi={multi}
          allowCreate={true}
          options={this.state.inside?option:transformOptions(this.state.option)}
      />)
    }
    return (
      <div>
        <Row>
          <Col lg={12}>
            <FormGroup controlId="searches" className="searches">
              <InputGroup style={{marginRight:"60px"}}>
                <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                  {search}
               </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </div>
  )}
});
export default AutoSearch
