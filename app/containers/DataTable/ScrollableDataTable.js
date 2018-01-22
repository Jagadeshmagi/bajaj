import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {Col,Glyphicon,Row} from 'react-bootstrap'
import {Table,Column, Cell} from 'fixed-data-table-2'
import Dimensions from 'react-dimensions'
import ReactTooltip from 'react-tooltip'

const ScrollableDataTable = React.createClass({
  getInitialState(){
    return{
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
  componentDidMount(){
    let heightWindow = window.innerHeight;
    let heightChev = heightWindow - 325;
    this.setState({heightChev: heightChev});
  },
  handleInfiniteLoad: function() {

     let elemLength = this.props.list.length;

     this.props.getDataList(elemLength+50, 50, this.props.filter)
     this.setState({
        top: false,
        lastIndex: null
     })


/*       this.props.getDataList(elemLength+50, 50, this.props.filter).then((newElements)=>{
         console.log(elemLength+50, 50, this.props.filter)
         let newList = this.props.list.concat(newElements);
         this.props.updateList(newList);
         this.setState({
             top: false,
             lastIndex: null
         })
       });*/

   },
   onScrollEnd: function(scrollX, scrollY) {
    //  if (ReactDOM.findDOMNode(this.refs.valueDiv)) {
       ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));
    //  }
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
    var columnsList = this.state.columnsList.filter((Key,i) => {
    
      // Reset default columnwidth with new columnwidth
      if(Key.name === columnKey)
      {
        Key.width = newColumnWidth;
      }
      return Key;
    });
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
    const {height, width, containerHeight, containerWidth,rowHeight, ...props} = this.props;
    let dataList = this.props.list;
    let lastScrollIndex = this.state.lastIndex;
    let heightChev = this.state.heightChev;
    let rowHeightUse=64;


    var containerHeightUse, containerWidthUse
    if (this.props.large === "yes") {
      containerWidthUse = containerWidth + 110;
     containerHeightUse = containerHeight + 230;
    } else {
      containerWidthUse = containerWidth;
      containerHeightUse = containerHeight;
    }

    if(this.props.moreRowHeight)
    { 
      rowHeightUse = 145;
      containerWidthUse = containerWidth + 130;
    }


    // Scroll To Top Logic begins here
    let scrollToTop
    if (dataList.length >= 51 && this.state.top === false) {
      scrollToTop = (
        <Glyphicon onClick={this.handleScrollClick} glyph="menu-up"></Glyphicon>
      )
    } else if (this.state.top === true) {
      scrollToTop = (<div></div>)
    }

    // Scroll To Top Logic ends here
    let that = this;
    return (
    <div >

        <div style={{marginLeft: "60px",marginRight: "60px",width:'1000px', height:heightChev}}>
          <Table
            onColumnReorderEndCallback={this._onColumnReorderEndCallback}
            isColumnReordering={false}
            onColumnResizeEndCallback={this._onColumnResizeEndCallback}
            isColumnResizing={false}
            onScrollEnd={this.onScrollEnd}
            width={containerWidthUse}
            height={containerHeightUse}
            ref="resourcesTable"
            rowHeight={rowHeightUse}
            rowsCount={this.props.list.length}
            rowHeightGetter={this.props.rowHeightGetter}
            headerHeight={64}
            scrollToRow={this.state.lastIndex}
            {...this.props}
            >
            {this.props.checkboxColumn}
            {this.state.columnsList.map(function(columnObject){
              let test = columnObject.name
              return that.props.getTableColumn(columnObject.name)
            })}
            {this.props.attributeChooserColumn}
            <Column
            flexGrow={0.2}
            width={10}
            />
          </Table>

          <ReactTooltip />
        </div>
        <div style={{float:'right'}}>{scrollToTop}</div>


    </div>
    )
  }
})

export default Dimensions(
  {
  getHeight: function(element) {
    return window.innerHeight - 305;
  },
  getWidth: function(element) {
    let widthOffset = window.innerWidth < 680 ? 0 : 240;
    return window.innerWidth - widthOffset;
  }
}
)(ScrollableDataTable);
