import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table-2'
import {Header } from 'components/Header/Header'
import {CheckboxCell} from 'components/Table/Table'
import {IpAddressCell} from './ResourceIPAddressCell'
import {ResourceColumnChooserClass} from './ResourceColumnChooserCell'
// import {ActionLinks,ColumnChooserPopover} from 'components/Infrastructure/Resources'
import Dimensions from 'react-dimensions'
import ReactTooltip from 'react-tooltip'
import AutoComplete from 'material-ui/AutoComplete'
import Select from './src/Select';
import Creatable from './src/Creatable';
import AutoSearch from './autoSearch';

// import Creatable from './react-select/dist/react-select';
// import Creatable from 'react-select';
// import 'react-select/dist/react-select.css';

////
import TagsInput from 'react-tagsinput'

import Autosuggest from 'react-autosuggest'
////

function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

const DataTableContainer = React.createClass({
  getInitialState(){
    return{
      selected: [],
      recordHeight:40,
      tableHeight:640,
      isInfiniteLoading: false,
      previousY : 0,
      loadAmount: 20,
      lastIndex: null,
      top: true,
      increasing: false,
      filter:{},
      heightChev:null,
      columnsList:this.props.columnsList,
      reorder_column_index:-1,
      before_column_index:-1,
      after_column_index:-1
    }
  },

  ///////////////////////////////////////////////////
  // Infinite Scroll implementation - API
  ///////////////////////////////////////////////////
  componentWillReceiveProps(nextProps) {
    this.setState({
      list:nextProps.list,
      selected:nextProps.selected,
      all:nextProps.all,
      filter:nextProps.filter
    })
  },
  componentDidMount(){
    let heightWindow = window.innerHeight;
    let heightChev = heightWindow - 325;
    let elemLength = this.props.list.length;
    //  this.props.getDataList(elemLength+50, 50)
    // .then((resources) => {
    //   this.props.updateList(resources.data)
    //   this.setState({
    //     // list:resources,
    //     selected: [],
    //     heightChev: heightChev});
    // })
    //  .catch((error) => console.log("Error in getting resources list:"+error))
   },
   handleInfiniteLoad: function() {
     let elemLength = this.props.list.length;
    //  let newList = this.props.list;
    if(this.props.isInfiniteScroll){
      console.log("no infinite scrolling")

    }else{


       this.props.getDataList(elemLength+50, 50, this.state.filter)
       .then((newElements)=>{
         let newList = this.props.list;
         console.log("new API Called", elemLength+50, 50, this.state.filter, newElements)
         if(Array.isArray(newElements)){
           newList = this.props.list.concat(newElements);
         } else if (newElements !== null && typeof newElements === 'object') {
           console.log("goodness, this is an object =(")
           for (var item in newElements){
             console.log("goodness, this is an array? 0.o", item)
             if(Array.isArray(newElements[item])){
               console.log("goodness, this is an array! =)")
               newList = this.props.list.concat(newElements[item]);
             }
           }
         }
        //  let newList = this.props.list.concat(newElements);
         this.props.updateList(newList);
         this.setState({
             top: false,
             lastIndex: null
         })
       });
     }
    },
   onScrollEnd: function(scrollX, scrollY) {
       ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));
     const offset = 400;
     if (scrollY > 500) {
       this.setState({
         top:false,
         lastIndex:null
       });
     }
     if(this.state.recordHeight*(this.props.list.length-1)-this.state.tableHeight - offset <= scrollY ) {
       this.handleInfiniteLoad();
     } else {
       console.log("Scroll offset has not yet been met")
     }
  },
  /*
   * Column Reorder CallBack
   * @event : reorderColumn(column Selected for reorder)
   * @event : columnAfter(place selected column after this)
   * @event : columnBefore(place selected column before this)
   * Note   : only work while isReorderable is true in column
   *        Eg : <Column
                  columnKey="firstName"(Mandatory Field, its hould be same as case condition)
                  header={<Cell>First Name</Cell>}
                  cell={<TextCell data={dataList} />}
                  fixed={true}
                  width={columnWidths.firstName}
                  isReorderable={true}
                />
   */
     _onColumnReorderEndCallback(event) {
    var Reorder_Coulmn_index = -1;
    //@columnsList : contains list of column expect reorder column
    var columnsList = this.state.columnsList.filter((columnKey,i) => {
           if(columnKey.name !== event.reorderColumn)
       {
        if(columnKey.name===event.columnAfter)
        {
          this.setState({
             after_column_index: i,
         })
        }
        if(columnKey.name===event.columnBefore)
        {
          this.setState({
             before_column_index: i,
         })
        }
        return columnKey;
      }
      if(columnKey.name === event.reorderColumn)
      {
         this.setState({
             reorder_column_index: i,

         })

      }

    });
    if (event.columnAfter) {

      // Condition for handling only click , there is no reorder
      if(this.state.reorder_column_index-1!=this.state.before_column_index && this.state.reorder_column_index+1!=this.state.after_column_index)
      {
        // If reorder index is greater add removed element before
        if(this.state.reorder_column_index>this.state.after_column_index)
        {

          columnsList.splice(this.state.after_column_index, 0, this.state.columnsList[this.state.reorder_column_index]);

        }
        else //Else add removed element after
        {
          columnsList.splice(this.state.before_column_index, 0, this.state.columnsList[this.state.reorder_column_index]);

        }
      }
      else
      {
        columnsList.splice(this.state.reorder_column_index, 0, this.state.columnsList[this.state.reorder_column_index]);

      }


    }
    else{
      columnsList.push(this.state.columnsList[this.state.reorder_column_index])
    }
    // else {
    //   if (fixedColumns.indexOf(event.reorderColumn) !== -1) {
    //     columnsList.splice(fixedColumns.length - 1, 0, event.reorderColumn)
    //   } else {
    //     columnsList.push(event.reorderColumn);
    //   }
    // }
    // if(this.props.type=="ResourceTable")
    // {
    //   localStorage.setItem("ResourceTable1", JSON.stringify(columnsList))
    // }
    // if(this.props.type=="GroupTable")
    // {
    //   localStorage.setItem("GroupTable1", JSON.stringify(columnsList))
    // }
    
    this.setState({
      columnsList: columnsList
    });

  },
  /*
   * Column Resize CallBack
   * @newColumnWidth : New column width while scroling
   * @columnKey      : Columnname selected for resize
   * Note            : only work while isResizable is true in column
   *                   Eg : <Column
                              columnKey="firstName"(Mandatory Field, its hould be same as case condition)
                              header={<Cell>First Name</Cell>}
                              cell={<TextCell data={dataList} />}
                              fixed={true}
                              width={columnWidths.firstName}
                              isResizable={true}
                            />
   */
   _onColumnResizeEndCallback(newColumnWidth, columnKey) {
    //var Clist = localStorage.getItem("ResourceTable1")?JSON.parse(localStorage.getItem("ResourceTable1")):this.state.columnsList;
    var Clist = this.state.columnsList;
    
    
    var columnsList = Clist.filter((Key,i) => {

      // Reset default columnwidth with new columnwidth
      if(Key.name === columnKey)
      {
        Key.width = newColumnWidth;
      }
      return Key;
    });
    
     if(this.props.type=="ResourceTable")
    {
      
      //localStorage.setItem("ResourceTable", JSON.stringify(columnsList))
      localStorage.setItem("ResourceTable1", JSON.stringify(columnsList))
    }
    if(this.props.type=="GroupTable")
    {
      // localStorage.setItem("GroupTable", JSON.stringify(columnsList))
       localStorage.setItem("GroupTable1", JSON.stringify(columnsList))
    }
    console.log("RESIZE",columnsList)
    this.setState({
      columnsList: columnsList
    });
  },
  handleScrollClick() {
    this.setState({
      lastIndex:0,
      top: true
    })
  },
  render() {
    const {height, width, containerHeight, containerWidth, ...props} = this.props;
    let dataList = this.state.list? this.state.list:this.props.list;
    let lastScrollIndex = this.state.lastIndex;
    let heightChev = this.state.heightChev;
    var containerHeightUse, containerWidthUse
    if (this.props.large === "yes") {
      containerWidthUse = containerWidth + 110;
      containerHeightUse = containerHeight + 100;
    } else {
      containerWidthUse = containerWidth;
      containerHeightUse = containerHeight;
    }

    // Scroll To Top Logic begins here
    let scrollToTop
    if (dataList.length >= 51 && this.state.top === false) {
      scrollToTop = (
        <div>
             <Glyphicon style={{marginRight:"20px"}} onClick={this.handleScrollClick} glyph="menu-up"></Glyphicon>
        </div>
      )
    } else if (this.state.top === true) {
      scrollToTop = (<div></div>)
    }
    // Scroll To Top Logic ends here

     for(let i=0;i<dataList.length;i++){

     if(dataList[i].assetType=="aws"){
        dataList[i].assetType="AWS";
     }
     else if(dataList[i].assetType=="datacenter"){
        dataList[i].assetType="On-Prem";
     }
    }
      let selectedList = this.state.selected;
      let that = this;
    return (
    <div>
      <Row>
        <Col className="table-container" style={{marginLeft: "60px", marginRight:"60px", width:'1000px', height:heightChev}} xs={12} lg={12}>
          {this.props.checkBoxMatrix?
            <Table
              onScrollEnd={this.onScrollEnd}
              width={containerWidthUse}
              height={containerHeightUse}
              ref="resourcesTable"
              rowHeight={64}
              rowsCount={this.props.list.length}
              rowHeightGetter={this.props.rowHeightGetter}
              rowDropdownHeightGetter={this.props.rowDropdownHeightGetter}
              rowDropdownGetter={this.props.rowDropdownGetter}
              headerHeight={64}
              scrollToRow={this.state.lastIndex}
              onColumnReorderEndCallback={this._onColumnReorderEndCallback}
              isColumnReordering={false}
              onColumnResizeEndCallback={this._onColumnResizeEndCallback}
              isColumnResizing={false}
              headerHeight={80}
              {...this.props}
              >
              {this.state.columnsList.map(function(columnObject){
                let test = columnObject.name
                return that.props.getTableColumn(columnObject.name)
              })}
              {this.props.checkboxColumn}
              {this.props.checkboxColumn2}
              {this.props.checkboxColumn3}
              {this.props.checkboxColumn4}
              {this.props.checkboxColumn5}



              <Column
                align='center'
                header={<Cell>{}</Cell>}
                cell={<Cell>{}</Cell>}
                width={60}/>
            </Table>
            :
            <Table
              onScrollEnd={this.onScrollEnd}
              width={containerWidthUse}
              height={containerHeightUse}
              ref="resourcesTable"
              rowHeight={64}
              rowsCount={this.props.list.length}
              rowHeightGetter={this.props.rowHeightGetter}
              rowDropdownHeightGetter={this.props.rowDropdownHeightGetter}
              rowDropdownGetter={this.props.rowDropdownGetter}
              headerHeight={64}
              scrollToRow={this.state.lastIndex}
              onColumnReorderEndCallback={this._onColumnReorderEndCallback}
              isColumnReordering={false}
              onColumnResizeEndCallback={this._onColumnResizeEndCallback}
              isColumnResizing={false}
              {...this.props}
              >
              {this.props.checkboxColumn}
              {this.state.columnsList.map(function(columnObject){
                let test = columnObject.name
                return that.props.getTableColumn(columnObject.name)
              })}
              <Column
                align='center'
                header={<Cell>{}</Cell>}
                cell={<Cell>{}</Cell>}
                width={60}/>
            </Table>
          }
          <ReactTooltip />
        </Col>
        <Col style={{textAlign:"right", position: 'absolute', right:'15px', bottom:'0'}}>{scrollToTop}</Col>
      </Row>
    </div>
    )
  }
})

export default Dimensions(
  {
  getHeight: function(element) {
    return window.innerHeight - 305;
    // return window.innerHeight - 205;
  },
  getWidth: function(element) {
    let widthOffset = window.innerWidth < 680 ? 0 : 240;
    // let widthOffset = window.innerWidth < 680 ? 0 : 140;
    return window.innerWidth - widthOffset;
  }
}
)(DataTableContainer);
