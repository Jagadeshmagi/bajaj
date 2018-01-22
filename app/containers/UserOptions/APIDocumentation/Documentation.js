import React, {PropTypes} from 'react'
// const template = require('html-loader!./../../../constants/api.html')
import template from './../../../constants/api.html'

// const template = require('html-loader!./../../../constants/api.html')
// const template = require('html-loader!./api.html')
// const template = require('html-loader!./api.html')

const Documentation = React.createClass({

  render() {
    // console.log("templatetemplatetemplate", template)
    return(
      <div>
        <div dangerouslySetInnerHTML={{__html:template}}></div>
      </div>
    );
  }
});

export default Documentation
