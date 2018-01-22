import React, { PropTypes } from 'react'
import {sprite, spriteServicenow, spriteBmc, spritePagerduty, spriteSlack, spriteJiraservicedesk} from './styles.css'
import { Header } from 'components/Header/Header'
import { imgtrans } from 'assets/imgTrans.gif'


export default function Connector (props) {
  let spriteimg = require('assets/spritesheet.png');
  let style={ backgroundImage: 'url(' + spriteimg + ')' }

  return (
    <div>
      <Header name='Connector' />
      <div style={{paddingLeft: 30}}>
        <div style={{ width:300, heigh: 150 }}>
          <img className={spriteServicenow}  style={style} src={imgtrans} />
        </div>
        <div style={{ width:300, heigh: 150 }}>
          <img className={spriteBmc}
              style={{ backgroundImage: 'url(' + spriteimg + ')'}} src={imgtrans} />
        </div>
        <div style={{ width:300, heigh: 150 }}>
            <img className={spritePagerduty}
              style={{ backgroundImage: 'url(' + spriteimg + ')'}} src={imgtrans} />
        </div>
        <div style={{ width:300, heigh: 150 }}>
          <img className={spriteSlack}
              style={{ backgroundImage: 'url(' + spriteimg + ')'}} src={imgtrans} />
        </div>
        <div style={{ width:300, heigh: 150 }}>
          <img className={spriteJiraservicedesk}
            style={{ backgroundImage: 'url(' + spriteimg + ')'}} src={imgtrans} />
        </div>
      </div>
    </div>
  )
}