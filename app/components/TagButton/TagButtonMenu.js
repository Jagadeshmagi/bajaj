import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import {hmenu, active} from './styles.css'
import {blueBtn, spacer} from 'sharedStyles/styles.css'

TagButtonMenu.propTypes = {
  activeTab:   PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired,
  tagNames:    PropTypes.arrayOf(PropTypes.shape({
        linkName: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired
  }).isRequired).isRequired
}

function HmenuItem(props)
{
  let hash='#'
  let newLink = hash.concat(props.linkName)
  //console.log('Hemnuitem link:'+newLink+' active:'+props.activeLink)
  return newLink === props.activeLink
  ?
      <li>
        <Link to={props.linkName} className={active} onClick={props.onClickHandler} >
            {props.displayName}
        </Link>
      </li>

  :
      <li>
        <Link to={props.linkName} style={{color:"#ACB3B7", fontWeight:"semi-bold"}}onClick={props.onClickHandler} >
            {props.displayName}
        </Link>
      </li>
}

export default function TagButtonMenu({activeTab, onItemClick, tagNames}) {
  //console.log(tagNames)
  return (
    <div style={{marginTop: 20}} >
        <div className={hmenu}>
          <ul>
            {tagNames.map(function(tagName, index) {
                return <HmenuItem key={index}  linkName={tagName.linkName}
                        activeLink={activeTab}
                        onClickHandler = {onItemClick}
                        displayName= {tagName.displayName}
                      />;
            })}
          </ul>
        </div>
    </div>
  )
}
