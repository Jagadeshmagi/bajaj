import React from 'react'
import {Navbar, Col, Button, Row, FormGroup, Glyphicon, InputGroup, FormControl,Popover,OverlayTrigger} from 'react-bootstrap';
import {blueBtn , btnPrimary, mytable, selectStyle} from 'sharedStyles/styles.css'
import {BarChart,  tickFormat} from 'react-d3-components'
import {input, legend, low, medium, high, passed} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import ScrollableDataTable from "containers/DataTable/ScrollableDataTable"
import { ReportHeader, ReportTitle} from './ReportCommon'
import {getDiscoveryWorklog} from 'helpers/context'
import {ResourceColumnChooserClass} from 'containers/Infrastructure/ResourceColumnChooserCell'
import AttributeConstants from 'constants/AttributeConstants'
import {AccessCell,ArrayLinkCell,ScoreCell, ScoreCell2, ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, TooltipDataCell, CollapsedRowsCell, PolicyNameCell, RemediationCell} from 'components/Table/Table'
import moment from 'moment'
import {AlertDetails} from './AlertDetails'
import {generateReportTable, getReportMeta,getalertDataStatistics} from 'helpers/alerts'
import ReactTooltip from 'react-tooltip'
import ReactDOM from 'react-dom'
import {AlertReports} from 'components/Table/Table'
import {sevcircle,triangleup,diamond } from './styles.css'
import {SpinnyLogo} from 'containers'

function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

export function MetaItem(props) {
 let data=props.desc

 let symbol =props.desc;
  if(props.desc=="Low"|| props.desc=="low"){
    symbol= <div><div className={sevcircle}> </div>&nbsp;&nbsp;Low</div>
  }
  else if(props.desc=="Medium"|| props.desc=="medium"){
   symbol= <div><div className={triangleup}> </div>&nbsp;&nbsp;Medium</div>
  }
  else if(props.desc=="High"|| props.desc=="high"){
    symbol=  <div><div className={diamond}> </div>&nbsp;&nbsp;High</div>

  }
   
 return (
   <tr>
     <td style={{textAlign: 'left', fontWeight: 'bold',paddingRight:'20px',fontSize:17}}>{props.title}: </td>
     <td style={{textAlign: 'left',fontSize:17}}>{symbol}</td>
   </tr>
   )
}


function AlertReportMeta (props) {

  return (
    <table style={{marginTop:40,marginLeft:60,marginRight:50}}>
      <tbody>
        <MetaItem  title='Alert Name'   desc={props.name}  />
        <br />
        <MetaItem title='Description' desc={props.Description}/>
        <br />
        <MetaItem title='Rationale'   desc= {props.Rational}/>
        <br />
        <MetaItem title='Severity'   desc= {props.Severity}/>
        <br />

      </tbody>
    </table>
  )
}


let myCountArray=[], countAr = [],newSortArray=[];

const ComplianceBarChart = React.createClass({
  getInitialState(){
    return {
      select: "day",
      barChartWidth:'',
      statisticsData:this.props.statisticsData
      //[{"count":10,"total":0,"startTime":"2017-06-28T05:20:26.275Z","endTime":"2017-06-28T13:20:26.275Z"},{"count":20,"total":0,"startTime":"2017-06-28T13:20:26.275Z","endTime":"2017-06-28T21:20:26.275Z"},{"count":30,"total":0,"startTime":"2017-06-28T21:20:26.275Z","endTime":"2017-06-29T05:20:26.275Z"},{"count":10,"total":0,"startTime":"2017-06-28T21:20:26.275Z","endTime":"2017-06-29T05:20:26.275Z"}]
      //this.props.statisticsData
    }
  },
  dynamicChartWidth(){
    
      let dataCount = this.state.statisticsData.length;
      
      let dataForLabel=[];
      let weakday='';
      let xvalue='';
      let count=0;
    
    if(this.state.statisticsData.length>0){
        weakday=moment.utc(this.state.statisticsData[0].startTime).format('ddd');
        xvalue=weakday+' '+moment.utc(this.state.statisticsData[0].startTime).date()
              
        dataForLabel.push(xvalue)
        
    }
    for (let j=1;j<this.state.statisticsData.length;j++){
      let grapgdata=this.state.statisticsData[j]
     
       let t= moment.utc(grapgdata.startTime)
       let t1=moment.utc(grapgdata.startTime).format('h A');
       let a1=moment.utc(grapgdata.startTime).format('ddd');
      
       
      if(weakday==a1){
       

         xvalue=t1;
        
      }
      else{
        weakday=a1;
        xvalue=a1+' '+t.date();
       
      }
      
       dataForLabel.push(xvalue)

      }

      let xlabel= d3.selectAll('.x').selectAll('.tick').data(dataForLabel).select('text').text(function(d)  { return d; })

      
      this.setState({barChartWidth:dataCount*46,statisticsData:this.state.statisticsData});
      
      

   },
    componentWillReceiveProps(nextProps,nextState){
      if(this.props.statisticsData!=nextProps.statisticsData){
        this.setState({statisticsData:nextProps.statisticsData},function(){
           d3.selectAll('g').selectAll('.tick').select('text').style("font-size", "9px")
           d3.selectAll('g').selectAll('.tick').select('text').style("font-weight", "600")
              

          d3.selectAll(".bar").style("fill", function(d) { return "#FFC300"; });
          setTimeout(this.dynamicChartWidth,100);
         // if(nextProps.statisticsData.length>10){
          //to make x axiz label slant
         /* d3.selectAll('.x').selectAll('.tick').select('text').style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", function(d) {
                return "rotate(-65)"
                });*/
           // }

        })
      }
    },
  componentWillMount(){

 		d3.selectAll(".bar").style("fill", function(d) { return "#FFC300"; });

    this.setState({statisticsData:this.props.statisticsData})
  },
  selectChangeHandler(event){
    console.log("This was selected   ", event.target.value)
    this.setState({
      select:event.target.value
    })
  },
  tooltipBar(x, y0, y, total) {
      return y;
    },
    render: function () {

     let dataLength = 0;
 
      if(this.state.statisticsData && (this.state.statisticsData.length>0))
         dataLength = this.state.statisticsData.length;

      //const scale = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484']);
    //const scale =d3.scale.linear().range('red');
     //var color=d3.select(this).attr('fill','red')
      let barChartWidthVar=this.state.barChartWidth
      d3.selectAll(".bar").style("fill", function(d) { return "#FFC300"; });

      // chart.attr("fill",'#666666')

      
      

      setTimeout(function (){
        var vis = d3.selectAll('.tick line')
        var yis = d3.selectAll('.domain')
        // console.log("THIS IS THE VIS. WHAT IS IT?????", vis)
        yis.attr("stroke","#f9fafc")
        vis.each(function(d,i) {
          let findYAxis = d3.select(this).attr("x2")
          if(findYAxis!=0){
            d3.select(this).attr("x2","200%").attr("stroke",'#d5deec')
          }
        });
      }, 500);


     /* var dataG2 = [{
          label: 'somethingA',
          values: [{x: '', y: 20}, {x: '', y: 10}, {x: '', y: 10},{x: 'SomethingD', y: 10},{x: 'SomethingE', y: 15},{x: 'SomethingF', y:18}]
      }];*/
        var dataG2 = [{

          values: []
        }];
    // const xScale = scaleLinear().range([0, 1000]);
   // const yScale = d3.scaleLinear().range([500, 0]);

    // Scale the range of the data
    //xScale.domain([0, 1]);
   // yScale.domain([0, 1]);
   let maxValue=0;
   this.state.statisticsData.map((grapgdata)=>{

  
    if(maxValue<=grapgdata.count){
        maxValue=grapgdata.count
      }
  

  })
  let tickValue=1;

  if(maxValue<4){
    tickValue=maxValue

  }
  else{

    for (let i=4;i<=maxValue;i++){
      if(maxValue%i==0){
        tickValue=i;
        break;
      }
    }
  }

  // var xScale = d3.scale.linear().domain([0, 6]).range([0, 6]);
 //var yScale = d3.scale.linear().domain([0, maxValue]).range([280,0]);
 //var colorScale={ d3.scale.linear().domain([0,200]).range(['#fff','#000'])}

    let weakday='';
    let xvalue='';
    let count=0;
    let data2={};
     
    /*if(this.state.statisticsData.length>0){
        weakday=moment(this.state.statisticsData[0].startTime).format('ddd');
        xvalue=weakday+' '+moment.utc(this.state.statisticsData[0].startTime).date()
        if(this.state.statisticsData[0].count=="null"||this.state.statisticsData[0].count==null){
          count=0;
        }
        else{
          count=this.state.statisticsData[0].count
        }
         data2["x"]=xvalue;
        // data1["x"]=xvalue;
        data2["y"]=count;
        dataG2[0]["values"].push(data2)
    }*/



  //to display x axis label with data and time
    this.state.statisticsData.map((grapgdata)=>{
      let count=0;
      if(grapgdata.count=="null"||grapgdata.count==null){
        count=0;
      }
      else{
        count=grapgdata.count
      }

        let data1={}
       let t= moment.utc(grapgdata.startTime)
       let t1=moment(grapgdata.startTime).format('DD[@]hh A');

       //let t2=t1.meridiem();
        let actualtime=t.hour();
        let dayvalue=t.day();
        let xvalue="";
        if(actualtime>=12)
        {
          actualtime=actualtime - 12+"P.M";
          xvalue=dayvalue+"@"+actualtime;
        }
        else{
          actualtime=actualtime+"A.M"
          xvalue=dayvalue+"@"+actualtime;
        }

       // data1["x"]=grapgdata.startTime;
        data1["x"]=t1;
        myCountArray.push(count)
       
        data1["y"]=count;
        dataG2[0]["values"].push(data1)

      })

    //code for adding dummy count value 10 to get the proper tick value and hiding that dummy value
    let dd={}
    if(maxValue==1||maxValue==2||maxValue==3||maxValue==4){
      dd["x"]="";
      dd["y"]=10;
      dataG2[0]["values"].push(dd)


       var vis1 = d3.selectAll('.bar')
      
        vis1.each(function(d,i) {
          if(i==dataG2[0]["values"].length-1){
          

            //d3.select(this).style("fill","white")
            // d3.select(this).style("opacity","0")
             d3.select(this).style("display","none")
         
          }
        });
        var yis1=  d3.selectAll('g').selectAll('.tick');
         yis1.each(function(d1,i1) {
          
          if(d3.select(this).select('text')[0][0].innerHTML==""){
          
           d3.select(this).select('Line').attr('y2','0')
           
         
          }
        });
      
    }
  //code for adding dummy count value 10 to get the proper tick value and hiding that dummy value

newSortArray = myCountArray.sort(function(a, b){return b-a})
       console.log('myCountArray', newSortArray)
     if(newSortArray.length > 0){        
       if(newSortArray[0]>4 ){
        countAr = []
        countAr.push(5)
      }else {
        countAr = []
        countAr.push(newSortArray[0])      
      }
     }

     // d3.svg.axis().tickFormat(function(d) {console.log("what the hell"); return parseInt(d, 10) ; });
// d3.format(".0%");
/*var yScale = d3.scale.linear()
    .domain([0,maxValue]).range([280,0]);
    var yAxis1 = d3.svg.axis().scale(yScale).orient("left").tickFormat(function(d){alert("what the hell"); return parseInt(d, 10) ;});*/
//alert(d3.svg.axis().scale(yRange).orient("left"))

 
  

     /*for (let j=1;j<this.state.statisticsData.length;j++){
      let grapgdata=this.state.statisticsData[j]
      if(grapgdata.count=="null"||grapgdata.count==null){
        count=0;
      }
      else{
        count=grapgdata.count
      }


        let data1={}
       let t= moment.utc(grapgdata.startTime)
       let t1=moment.utc(grapgdata.startTime).format('h A');
       let a1=moment.utc(grapgdata.startTime).format('ddd');
       
       
      if(weakday==a1){
       

         xvalue=t1;
        
      }
      else{
        weakday=a1;
        xvalue=a1+' '+t.date();
       
      }
      
      

       //let t2=t1.meridiem();

       // data1["x"]=grapgdata.startTime;
        data1["x"]=xvalue;
        // data1["x"]=xvalue;
        data1["y"]=count;
        dataG2[0]["values"].push(data1)

      }*/


           
     // let yscale='linear'
    /* var yScale = d3.scale.linear()
      .domain([0, d3.max(20)])
      .range([0, 500]);
      */

      return (
        <div style={{marginTop: 40, height:430}}>
            <Col xs={12} style={{backgroundColor: '#F9FAFC',paddingLeft:55}}>
              <p style={{fontSize:18 ,textAlign:'center',fontWeight: 'bold', marginBottom:60}} >ALERT TIMELINE</p>

              {(dataLength>0)?
              <div>
              <div style={{minWidth:750,height:310,overflow:'auto',marginBottom:15,width:1120}}>



                	<BarChart
                   width={this.state.barChartWidth}
                  // yScale={yScale}
                   barPadding={0.75}
                   //strokeWidth={18}
                   yAxis={{tickArguments: [5],tickFormat:d3.format("d"),tickDirection: 'horizontal'}}
                  data={dataG2}
                  tooltipHtml={this.tooltipBar}
                  height={280}
                  margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
                </div>


                  </div>
                 :<div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{marginTop:'100px',textAlign:'center'}}>No data available for the selected alert</div>}

            </Col>

        </div>
    )
  }
})


const AlertReport = React.createClass({

  getInitialState(){
    return{
     assetGroupId:'',
      policyPacks:[],
      totalPoliciesCount:0,
      groups:[],
      list:[],
      noOfAlerts:0,
      controlFamilies:[],
      asset:{},
      statisticsData:[],
      score:0,
      analyst:'',
      reportName:'',
      dockerType:'',
      reportGeneratedEndTime:'',
      assessmentCompleted:'',
      columnChooserShow:false,
      columnsList:[
        {name:'time',displayText:'Time',displayHeaderText:'TIME',show:true,columnName: "TIME", width:"130"},
        {name:'account',displayText:'Account',displayHeaderText:'ACCOUNT',show:true,columnName: "ACCOUNT", width:"130"},
        {name:'details',displayText:'Details',displayHeaderText:'DETAILS',show:true,columnName: "DETAILS", width:"250"},
        ],
      select:"day",
      selectedPolicyPack:'',
      selectedState:'',
      selectedSeverity:'',
      selectedGroup:'',
      selectedControlFamily:'',
      filters:{},
      alertId:this.props.routeParams.alertId,
      starttime:this.props.location.query.starttime,
      endtime:this.props.location.query.endtime,
      timestamp:[],
      startTimeAlertDetail:[],
      endTimeAlertDetail:[],
      metaName:'',
      metaDesc:'',
      metaRational:'',
      metaSeverity:'',
      accountName:'',
      loadingDiv:true,
      type:""
    }
  },
   contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  componentDidMount(){

    d3.selectAll(".bar").style("fill", function(d) { return '#FFC300'; });
    d3.selectAll(".bar").style("width", function(d) { return 20; });
    this.setState({loadingDiv:true})

    generateReportTable(this.state.alertId, this.state.starttime, this.state.endtime)
    .then((responce) =>  {
      let newList = this.state.list.concat(responce);
      this.setState({list:newList,noOfAlerts:responce.length})

   
      console.log('I am in sucess of REPORT Table '+ JSON.stringify(this.state.list[0].record['@timestamp']))
      let timestampValue
      responce.map((val,key)=>{
        timestampValue = moment(val.record['@timestamp']).utc().format('MM[/]DD[/]YYYY [@] HH[:]mm[:]ss')
        this.state.timestamp.push(timestampValue)
        let resultStart=this.state.startTimeAlertDetail.slice()
        let resultEnd=this.state.endTimeAlertDetail.slice()
        resultStart.push(val.startTime)
        resultEnd.push(val.record['@timestamp'])

        this.setState({startTimeAlertDetail:resultStart, endTimeAlertDetail:resultEnd})

      
      })
      console.log('==========> '+ this.state.startTimeAlertDetail, this.state.endTimeAlertDetail)
      let startTimeAlertDetail = this.state.list[0].startTime
      let timestampAlertDetail = this.state.list[0].record['@timestamp']

      this.setState({starttime:startTimeAlertDetail, endtime:timestampAlertDetail,loadingDiv:false})
    })
    .catch((error) => {
      this.setState({loadingDiv:false})
      console.log("Error in generating report table in RSE:" + error)
    })

    /*calling Helper to Display Meta data*/
    getReportMeta(this.state.alertId)
    .then((responce) =>  {
      this.setState(
        {
          metaName:responce.name,
          metaDesc:responce.description,
          metaRational:responce.rationale,
          metaSeverity:responce.severity,
          accountName:responce.accountName,
          type:responce.type })
      console.log('I am in getReportMeta sucess'+ JSON.stringify(responce.record['@timestamp']))
    })
    .catch((error) => console.log("Error in generating report table in RSE:" + error))


    //to populate graph data
    getalertDataStatistics(this.state.alertId,this.state.starttime, this.state.endtime)
    .then((response) =>  {
      this.setState(
        {
          statisticsData:response
        })

    })
    .catch((error) => console.log("Error in generating report getalertDataStatistics in RSE:" + error))





  },
  componentWillReceiveProps(nextProps,nextState){
      if(this.props.statisticsData!=nextProps.statisticsData){
        this.setState({statisticsData:nextProps.statisticsData},function(){
          d3.selectAll(".bar").style("fill", function(d) { return "#FFC300 "; });
         setTimeout(this.dynamicChartWidth,100);
        })
      }
   },

  columnChooserToggle() {
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
  },
  getDataOnScroll(start,end,filter){
   /* getScanTable(start,end)
    .then((resultsList) =>  {
       let newList = this.state.list.concat(resultsList.scanschedulesview);
       this.updateList(newList);
    })
    .catch((resultListError) => console.log("Error in fetchReportsList:" + JSON.stringify(resultListError)))*/
  },
  updateList(newList){
    this.setState({list:newList});
  },

  columnDisplayChangeHandler(colName){
    let newColumnsList = [];
    this.state.columnsList.forEach(function(col){
      if(col.name === colName){
        newColumnsList.push({...col,show:!col.show});
      }else{
        newColumnsList.push(col);
      }
    })
    this.setState({columnsList:newColumnsList})
  },

  getTableColumn: function(colName){

      //let refreshDetailsProp = this.props.refreshDetails;
      let colObj = findElement(this.state.columnsList,"name",colName);

      if(colObj != null && colObj["show"]){

        switch(colName){


           case 'time' :

          return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={1}
              align="center"
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {this.state.timestamp[rowIndex]}
                </Cell>
              )}
              width={120} />

          case 'account' :
          return  <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={1}
              align="center"
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {this.state.accountName}
                </Cell>
              )}

              width={90} />


         case 'details' :
            // let alertsText = JSON.stringify(this.state.list[rowIndex].record)
            return <Column
              header={<Cell>{colObj.displayHeaderText}</Cell>}
              flexGrow={2}
              align="left"
              cell={ <AlertReports data={this.state.list}
                                   col="details"
                                   startTimeAlertDetail={this.state.startTimeAlertDetail}
                                   endTimeAlertDetail={this.state.endTimeAlertDetail} 
                                   alertId={this.state.alertId} 
                                   type={this.state.type}/>}
              // cell={<AlertReports data={this.state.list[rowIndex].record} col="imageName" />}
              width={650} />

          default :
            return {}
        }
     }
   },


  render(){

  return (
    <div>
      <div style={{fontWeight:600}}><ReportHeader name='Alert Report'/></div>
      <div style={{minHeight:500}}>
      <AlertReportMeta name={this.state.metaName}
      					Description={this.state.metaDesc}
      					Rational = {this.state.metaRational}
      					Severity={this.state.metaSeverity}/>


      <ComplianceBarChart

          statisticsData={this.state.statisticsData}

          />
    </div>
    <div style={{position:'relative'}}>
         {this.state.loadingDiv?
          <div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
            <SpinnyLogo />
          </div>
          :
          <div>
           <div style={{height:70}}>
                <Col xs={4} style={{paddingTop:20,paddingLeft:55}}>
                  <p style={{fontSize: 20, fontWeight: 'bold', marginLeft:8}}>
                   {this.state.noOfAlerts} Alerts
                  </p>
                </Col>
            </div>
        <div id="policies" style={{marginBottom:'20px'}}>

            <ScrollableDataTable
              columnsList={this.state.columnsList}
              getTableColumn={this.getTableColumn}
              // attributeChooserColumn ={<Column
              //       header={<Cell><ResourceColumnChooserClass
              //           toggle={this.columnChooserToggle}
              //           columnShow={this.state.columnChooserShow}
              //           container={this.refs.resourcesTable}
              //           columnsList={this.state.columnsList}
              //           changeHandler={this.columnDisplayChangeHandler}/>
              //       </Cell>}
              //       cell={({rowIndex, ...props}) => (
              //         <Cell {...props}>
              //           {''}
              //         </Cell>
              //       )}
              //       width={100} />}
              list={this.state.list}
              getDataList={this.getDataOnScroll}
              updateList={this.state.updateList}
              filter={this.state.filter}
              // width={1170}
              moreRowHeight={true}
            />
          </div>

        </div>
      }
    </div>
    </div>
   )}
})

export default (AlertReport)
