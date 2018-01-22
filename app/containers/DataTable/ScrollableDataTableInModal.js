import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {Col,Glyphicon,Row} from 'react-bootstrap'
import {Table,Column, Cell} from 'fixed-data-table-2'
import Dimensions from 'react-dimensions'
import ReactTooltip from 'react-tooltip'

const ScrollableDataTableInModal = React.createClass({
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
      heightChev:null
    }
  },

  ///////////////////////////////////////////////////
  // Infinite Scroll implementation - API
  ///////////////////////////////////////////////////
  componentDidMount(){
    let heightWindow = window.innerHeight;
    let heightChev = heightWindow - 115;
    console.log('my window getHeight '+ heightWindow, heightChev)
    this.setState({heightChev: heightChev});
  },
  handleInfiniteLoad: function() {
    console.log("handleInfiniteLoad in rules");
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
  handleScrollClick() {
    this.setState({
      lastIndex:0,
      top: true
    })
  },
  render() {
    const {height, width, containerHeight, containerWidth, ...props} = this.props;
    let dataList = this.props.list;
    let lastScrollIndex = this.state.lastIndex;
    let heightChev = this.state.heightChev;
    let rowcorrectHeight=64;
    let headerHeightUse = 64;

    var containerHeightUse, containerWidthUse
    if (this.props.large === "yes") {
      containerWidthUse = containerWidth + 110;
     containerHeightUse = containerHeight + 230;
    } else {
      containerWidthUse = containerWidth;
      containerHeightUse = containerHeight;
    }
    if(this.props.moreRowHeight){

      headerHeightUse=50,
      rowcorrectHeight=64

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

        <div style={{height:heightChev}}>
          <Table
            onScrollEnd={this.onScrollEnd}
            width={containerWidthUse}
            height={containerHeightUse}
            ref="resourcesTable"
            rowHeight={rowcorrectHeight}
            rowsCount={this.props.list.length}
            rowHeightGetter={this.props.rowHeightGetter}
            headerHeight={headerHeightUse}
            scrollToRow={this.state.lastIndex}
            {...this.props}
            >
            {this.props.checkboxColumn}
            {this.props.columnsList.map(function(columnObject){
              let test = columnObject.name
              return that.props.getTableColumn(columnObject.name)
            })}
            {this.props.attributeChooserColumn}
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
)(ScrollableDataTableInModal);
