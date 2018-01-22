import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { navContainer, active, circle, navDescription} from './styles.css'
import { ModalContainer } from 'containers'
import { Glyphicon } from 'react-bootstrap'
import image from 'assets/CavirinLogoGreenWhite.png'

const divStyle = {
  height:'81px',
};

// Vertical Navbar

Navigation.propTypes = ActionLinks.propTypes =  {
  isAuthed: PropTypes.bool.isRequired,
  activeLink: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
}

const NavHome = React.createClass({
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  componentDidMount() {
    this.context.router.replace('startdashboard')
  },
  render () {
    return  null
  },
})

function NavItems(props) {
  //console.log('navitem link:'+props.linkName+' active:'+props.activeLink)
  return props.linkName === props.activeLink
  ?
      <li>
        <Link to={props.linkName} className={active}
            onClick={() => props.onClickHandler(props.linkName)} >
            <div style={{color: '#00C484', fontSize: 30}}>{props.icon}</div>
          <div className={navDescription}>
            {props.displayName}
          </div>
        </Link>
      </li>

  :
      <li>
        <Link to={props.linkName} onClick={() => props.onClickHandler(props.linkName)} >
          {props.icon}
          <div className={navDescription}>
            {props.displayName}
          </div>
        </Link>
      </li>
}

function ActionLinks ({isAuthed, activeLink, onClickHandler, dashboardLink}) {
  //console.log('actionLinks:'+activeLink)

   let logoBackGround = {backgroundColor: '#00C484', paddingLeft: 0, height: 80}
   let imgstyle = { width: 30, height: 30}
   let headerLink = '#'+dashboardLink;
   //let headerLink = 'javascript:void(0)'
   return isAuthed === true
    ? <ul>
        <li style={logoBackGround}><a href={headerLink}>
          <svg style={{align:'center'}}  width="60px" height="60px"  viewBox="656 156 288 288" version="1.1" >
               <g id="Group-2" stroke="none" strokeWidth="5" fill="none" fillRule="evenodd" transform="translate(660.000000, 160.000000)">
                <path d="M238.529268,238.300807 C213.343231,263.458971 178.555888,279.020052 140.127469,279.020052 C63.2799069,279.020052 0.978093317,216.784994 0.978093317,139.999073 C0.978093317,63.2177865 63.2799069,0.978094172 140.127469,0.978094172 C189.701753,0.978094172 233.213762,26.8684345 257.861755,65.845283" id="Stroke-1" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
                <path d="M193.088648,192.956335 C179.516946,206.51088 160.773525,214.893845 140.072736,214.893845 C98.6757973,214.893845 65.0990531,181.357351 65.0990531,139.993976 C65.0990531,98.6306005 98.6757973,65.0941063 140.072736,65.0941063 C161.752209,65.0941063 181.284143,74.2926611 194.971803,88.9871786" id="Stroke-3" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
                <path d="M158.681646,140 C158.681646,150.231944 150.383705,158.536131 140.128396,158.536131 C129.89164,158.536131 121.575146,150.231944 121.575146,140 C121.575146,129.768056 129.89164,121.463869 140.128396,121.463869 C150.383705,121.463869 158.681646,129.768056 158.681646,140 L158.681646,140 Z" id="Stroke-5" stroke="#FFFFFF" strokeWidth="8"></path>
                <path d="M279.504121,139.995366 C279.504121,155.35255 267.045614,167.799562 251.674246,167.799562 C236.302878,167.799562 223.844371,155.35255 223.844371,139.995366 C223.844371,124.642816 236.302878,112.19117 251.674246,112.19117 C267.045614,112.19117 279.504121,124.642816 279.504121,139.995366 L279.504121,139.995366 Z" id="Stroke-7" stroke="#FFFFFF" strokeWidth="8"></path>
                <path d="M153.19174,153.046655 L238.527413,238.298954" id="Stroke-9" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"></path>
               </g>
            </svg>

        </a></li>
        <NavItems
             activeLink={activeLink}
             onClickHandler={onClickHandler}
             linkName={dashboardLink}
             displayName='Dashboard'
             icon={
                <svg width="32px" height="32px" viewBox="70 168 32 32" version="1.1" >
                    <g id="Group-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(70.000000, 168.000000)">
                        <g id="Group-5" transform="translate(1.000000, 15.000000)" stroke="#00C484" strokeWidth="2">
                            <path d="M26,0 L30,0" id="Stroke-1"></path>
                            <path d="M4,0 L0,0" id="Stroke-3"></path>
                        </g>
                        <path d="M7.828,8.828 L5,6" id="Stroke-6" stroke="#00C484" strokeWidth="2"></path>
                        <path d="M25.828,6 L23,8.828" id="Stroke-7" stroke="#00C484" strokeWidth="2"></path>
                        <path d="M16,5 L16,1" id="Stroke-8" stroke="#00C484" strokeWidth="2"></path>
                        <path d="M16,17 L16,9" id="Stroke-10" stroke="#00C484" strokeWidth="2"></path>
                        <g id="Group-17">
                            <path d="M16,0 C7.164,0 0,7.163 0,16 C0,24.837 7.164,32 16,32 C24.836,32 32,24.837 32,16 C32,7.163 24.836,0 16,0 M16,2 C23.72,2 30,8.28 30,16 C30,23.72 23.72,30 16,30 C8.28,30 2,23.72 2,16 C2,8.28 8.28,2 16,2" id="Fill-11" fill="#00C484"></path>
                            <path d="M2,22 L30,22" id="Stroke-13" stroke="#00C484" strokeWidth="2"></path>
                            <path d="M20.7273,21.6136 C20.7273,18.8526 18.7123,16.6136 16.2273,16.6136 C13.7423,16.6136 11.7273,18.8526 11.7273,21.6136" id="Stroke-15" stroke="#00C484" strokeWidth="2"></path>
                        </g>
                    </g>
                </svg>
                                       }
             />

        <NavItems
             activeLink={activeLink}
             onClickHandler={onClickHandler}
             linkName='/infrastructure/allresources'
             displayName='Infrastructure'
             icon={
                <svg width="33px" height="34px" viewBox="66 251 33 34" version="1.1">
                    <g id="Group-3" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(69.000000, 253.000000)">
                        <polygon id="Stroke-1" stroke="#00C484" strokeWidth="2" points="13.892 0 0 7.363 13.892 14.727 27.785 7.363"></polygon>
                        <polyline id="Stroke-3" stroke="#00C484" strokeWidth="2" points="7.126 11 0 14.777 13.892 22.141 27.784 14.777 20.657 11"></polyline>
                        <polyline id="Stroke-5" stroke="#00C484" strokeWidth="2" points="7.021 19 0 22.723 13.891 30.086 27.784 22.723 20.762 19"></polyline>
                    </g>
                </svg>
             }
             />

        <NavItems
             activeLink={activeLink}
             onClickHandler={onClickHandler}
             linkName='/policy'
             displayName='Policy Pack'
             icon={
                <svg width="33px" height="33px" viewBox="273 169 33 33" version="1.1">
                    <g id="Policy_icon" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(274.000000, 170.000000)">
                        <polygon id="Stroke-1" stroke="#00C484" strokeWidth="2" points="0 30 5 30 5 21 0 21"></polygon>
                        <path d="M5,28 C7,28 9,30 11,30 L29,30 C30,30 33.187,26 19,26 C14.219,26 12,25 12,25" id="Stroke-3" stroke="#00C484" strokeWidth="2" strokeLinecap="round"></path>
                        <path d="M5,22 C7,22 8,21 11,21 C14,21 20,21.5 20,25.5" id="Stroke-4" stroke="#00C484" strokeWidth="2"></path>
                        <polyline id="Stroke-5" stroke="#00C484" strokeWidth="2" points="17.2871 22 30.0001 22 30.0001 7 23.0001 0 13.0001 0 13.0001 21"></polyline>
                        <polyline id="Stroke-6" stroke="#00C484" strokeWidth="2" points="23 0 23 7 30 7"></polyline>
                    </g>
                </svg>}
             />
         <NavItems
              activeLink={activeLink}
              onClickHandler={onClickHandler}
              linkName='/scriptedPolicy/customPolicies'
              displayName='Custom'
              icon={
                 <svg width="33px" height="33px" viewBox="273 169 33 33" version="1.1">
                     <g id="Policy_icon" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(274.000000, 170.000000)">
                         <polygon id="Stroke-1" stroke="#00C484" strokeWidth="2" points="0 30 5 30 5 21 0 21"></polygon>
                         <path d="M5,28 C7,28 9,30 11,30 L29,30 C30,30 33.187,26 19,26 C14.219,26 12,25 12,25" id="Stroke-3" stroke="#00C484" strokeWidth="2" strokeLinecap="round"></path>
                         <path d="M5,22 C7,22 8,21 11,21 C14,21 20,21.5 20,25.5" id="Stroke-4" stroke="#00C484" strokeWidth="2"></path>
                         <polyline id="Stroke-5" stroke="#00C484" strokeWidth="2" points="17.2871 22 30.0001 22 30.0001 7 23.0001 0 13.0001 0 13.0001 21"></polyline>
                         <polyline id="Stroke-6" stroke="#00C484" strokeWidth="2" points="23 0 23 7 30 7"></polyline>
                     </g>
                 </svg>}
              />


        <NavItems
             activeLink={activeLink}
             onClickHandler={onClickHandler}
             linkName='/report/allreports'
             displayName='Reports'
             icon={
                <svg width="33px" height="31px" viewBox="274 253 33 31" version="1.1">
                    <g id="Group-4" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(275.000000, 255.000000)" strokeLinecap="round">
                        <path d="M11,24 C13.209,24 15,25.791 15,28 L15,20 L15,18.162 L15,6 C15,3.791 13.209,2 11,2 L0,2 L0,24 L11,24 L11,24 Z" id="Stroke-1" stroke="#00C484" strokeWidth="2"></path>
                        <path d="M25.999,2 L30,2 L30,24 L21.583,24 L19,24 C16.791,24 15,25.791 15,28" id="Stroke-3" stroke="#00C484" strokeWidth="2"></path>
                        <path d="M15,6 C15,3.791 16.791,2 19,2 L20,2" id="Stroke-5" stroke="#00C484" strokeWidth="2"></path>
                        <polygon id="Stroke-7" stroke="#00C484" strokeWidth="2" points="26 10.999 23.001 9.001 20 10.999 20 0 26 0"></polygon>
                    </g>
                </svg>
             }
             />

        <li style={divStyle}><NavItems
             activeLink={activeLink}
             onClickHandler={onClickHandler}
             linkName='/rse/allalerts'
             displayName='RSE'
             icon={
               <svg width="39px" height="29px" viewBox="267 337 39 29" version="1.1">
                   <g id="Group-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(268.000000, 338.000000)">
                       <polygon id="Stroke-1" stroke="#00C484" strokeWidth="2" points="23.1428571 26 28.2857143 26 28.2857143 4.33333333 23.1428571 4.33333333"></polygon>
                       <polygon id="Stroke-1" stroke="#00C484" strokeWidth="2" points="15.4285714 26 20.5714286 26 20.5714286 7.7037037 15.4285714 7.7037037"></polygon>
                       <polygon id="Stroke-1" stroke="#00C484" strokeWidth="2" points="7.71428571 26 12.8571429 26 12.8571429 11.5555556 7.71428571 11.5555556"></polygon>
                       <polygon id="Stroke-1" stroke="#00C484" strokeWidth="2" points="0 26 5.14285714 26 5.14285714 14.9259259 0 14.9259259"></polygon>
                       <polygon id="Stroke-1" stroke="#00C484" strokeWidth="2" points="30.8571429 26 36 26 36 0 30.8571429 0"></polygon>
                   </g>
               </svg>
             }
             /></li>

           {/*}<li style={divStyle}><Link to='/logout' onClick={onClickHandler}>
          <svg width="26px" height="26px" viewBox="421 401 26 26" version="1.1">
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(421.000000, 401.000000)">
                  <path d="M13,0 C5.82,0 0,5.82 0,13 C0,20.18 5.82,26 13,26 C20.18,26 26,20.18 26,13 C26,5.82 20.18,0 13,0 M24,13 C24,19.065 19.065,24 13,24 C6.935,24 2,19.065 2,13 C2,6.935 6.935,2 13,2 C19.065,2 24,6.935 24,13 Z" id="Fill-1" fill="#00C484"></path>
                  <polyline id="Stroke-3" stroke="#00C484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="13 5.5059 13 13.9999 19 13.9999"></polyline>
              </g>
          </svg>
          <div className={navDescription}>
            {'Logout'}
          </div>
        </Link></li>*/}
      </ul>
    :
      <noscript />

}

export default function Navigation ({isAuthed, activeLink, onClickHandler, dashboardLink }) {
  //console.log('Navigation:'+activeLink);
  return isAuthed === true
    ? <nav className={navContainer}>
         <ActionLinks isAuthed={isAuthed} activeLink={activeLink} onClickHandler={onClickHandler} dashboardLink={dashboardLink} />
      </nav>
    :
      <NavHome />
}
