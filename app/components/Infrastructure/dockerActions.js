import React, {PropTypes} from 'react'
import {Cell} from 'fixed-data-table'
import {deleteDockerImageByLabel} from 'helpers/docker'
import {CreateGroup} from 'containers'
import {DeleteImages} from 'containers'
import {ScanDocker} from 'containers'




export const ColumnChooserPopover = React.createClass({
  handleChange(e){
    this.props.changeHandler(e.target.id)
  },
  render() {
    let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: '#FFF',
        width : 200,
        borderRadius: 0,
        zIndex: 100,
        fontSize: 14,
    }
    return (

      <Popover style={style} placement="bottom" id="columnsPopover">
        <div className="pull-right"><a href="javascript:void(0)" style={{fontSize:'18px'}} onClick={this.props.closeHandler}>x</a><br/></div>
        <div>&nbsp;</div>
        { this.props.columnsList.map((item) =>
          { return  (
              <div style={{marginTop:'5px'}} key={item.name}>
                <input type='checkbox' id={item.name} defaultChecked={item.show} onChange={this.handleChange}/>
                <label htmlFor={item.name}> {item.displayText}</label>
              </div>
          )}
        )}
      </Popover>

    );
  },
});



export const ActionLinksForDocker = React.createClass({
  render:function() 
  { 
    const {selectedImages, imageCount, numSelected, ...props} = this.props;
    const style={marginBottom: 15}
    let separator = ''
    let totalCount = imageCount
    if(totalCount === 0){
      return <div style={style}>0 Image</div>
    }
    if (numSelected === 1) {
       separator = ' | '
    }
    return(
    numSelected === 0
    ?
     <div style={style}>
        <a href='javascript: void(0)'  onClick={() => this.props.getDockerByImages('ALL')} >{totalCount} Image(s)</a>&nbsp;
       
      </div>
    :
      <div style={style}>
        {totalCount} Images &nbsp;
        {numSelected} Selected:&nbsp;{' '}
      
        {numSelected === 1 ? 
         
            <ScanDocker 
              list={this.props.list} 
              selectedIds={this.props.selectedImages}
              refreshList={this.props.refreshList}
              refreshedit={this.props.refreshedit} />

          : <noscript />
        }    
        
         {separator}
          <DeleteImages 
          list={this.props.list} 
          selectedIds={this.props.selectedImages}
          refreshList={this.props.refreshList}
          refreshSelected={this.props.refreshSelected}
         />
     
      </div>
    )
    
  }
})


