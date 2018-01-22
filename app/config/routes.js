import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { MainContainer, HomeContainer, AuthenticateContainer,
    Dashboard, LogoutContainer, CredentialsListContainer,GroupsListContainer,
    ScheduleListContainer, Dockertab,ResourcesContainer,
    InfrastructureMainContainer ,PolicyPacks,DockerPolicyPacks, ScheduleTests,MultiStepWizard,
    ConnectorContainer, ReportContainer, AllReports, DashboardStart,WelcomeScreen, RSEContainer, AllAlerts,AlertRules,
    IntegrationTable,PolicyPacksWithoutFooter,CredentialsStart,AllDockerReports, ScheduleInfo, CloudTable, PolicyText,
    UserManagementMainContainer, BillingInformationMainContainer,BillingInformation, UserInfo, UserManagement, RoleManagement, pptest, Documentation,
    ApplicationSettingsMainContainer, CreateAlert, About,IPAddressConfig, SessionTimeoutContainer, FailedDevicesList, CustomPolicyMainContainer, CustomPolicyPacks, CustomPolicies} from 'containers'

import { PolicyStart, Report, ReportDetail, CloudReportDetail, DeviceDetails,DockerReportDetail, GroupsResources,AlertReport,AssetGroupReport} from 'components'

export default function getRoutes (checkAuth) {
  return (
    <Router history={hashHistory}>
      <Route path='assetGroupReport/:worklogId' component ={AssetGroupReport}  onEnter={checkAuth}/>
      <Route path='cloud/:assetgroupId'         component ={MultiStepWizard} onEnter={checkAuth}/>
      <Route path='scheduleInfo'         component ={ScheduleInfo} onEnter={checkAuth}/>
      <Route path='policyPacks/:assetgroupId'   component ={PolicyPacks}     onEnter={checkAuth}/>
      <Route path='dockerpolicyPacks/:imageId'   component ={DockerPolicyPacks}     onEnter={checkAuth}/>
      <Route path='scheduleTests/:assetgroupId' component ={ScheduleTests}   onEnter={checkAuth}/>
      <Route path='createalert' component ={CreateAlert} onEnter={checkAuth}/>
      <Route path='reportdetail/:worklogId'  component ={ReportDetail} />
      <Route path='dockerReportdetail/:worklogId'  component ={DockerReportDetail} />
      <Route path='groupsResourcesDetails/:groupId/:groupName'  component ={GroupsResources} />
      <Route path='failed-devices-list/:faildId'  component ={FailedDevicesList} />
      <Route path='policytext'  component={PolicyText} onEnter={checkAuth}/>
      <Route path='cloudReportdetail/:worklogId'  component ={CloudReportDetail} />
      <Route path='devicedetail/:worklogId/:resourceId'  component ={DeviceDetails} />
      <Route path='welcomeScreen' component ={WelcomeScreen}    onEnter={checkAuth}/>
      <Route path='AlertReport/:alertId'  component={AlertReport} onEnter={checkAuth}/>
        <Route path='Documentation'  component={Documentation} onEnter={checkAuth}/>

      <IndexRoute component={AuthenticateContainer} onEnter={checkAuth}/>
      <Route path='auth'      component={AuthenticateContainer} />
      <Route path='/' component={MainContainer} onEnter={checkAuth}>

        <Route path='addcloud'  component={CloudTable} onEnter={checkAuth}/>
        <Route path='billingInformation' component={BillingInformationMainContainer} onEnter={checkAuth}>
          <Route path='billingInfoDetails' component={BillingInformation} onEnter={checkAuth}/>
        </Route>
        <Route path='usermanagement' component={UserManagementMainContainer} onEnter={checkAuth}>
          <Route path='userInfoTab' component={UserInfo} onEnter={checkAuth}/>
          <Route path='UserManagementTab' component={UserManagement} onEnter={checkAuth}/>
          <Route path='roleManagementTab' component={RoleManagement} onEnter={checkAuth}/>
          <Route path='pptest' component={pptest} onEnter={checkAuth}/>

        </Route>

        <Route path='applicationSettings' component={ApplicationSettingsMainContainer} onEnter={checkAuth}>
          <Route path='ipAddressConfig'  component={IPAddressConfig} onEnter={checkAuth}/>
          <Route path='about'  component={About} onEnter={checkAuth}/>
        </Route>
        <Route path='infrastructure' component={InfrastructureMainContainer} onEnter={checkAuth} >

            <Route path='allresources'  component={ResourcesContainer} onEnter={checkAuth}/>
            <Route path='dockerTab'     component={Dockertab} onEnter={checkAuth}/>
            <Route path='cloud'         component={MultiStepWizard} onEnter={checkAuth}/>
            <Route path='credentials'   component={CredentialsListContainer} onEnter={checkAuth}/>
            <Route path='mygroups'      component={GroupsListContainer} onEnter={checkAuth}/>
            <Route path='scheduleAndNotifications'      component={ScheduleListContainer} onEnter={checkAuth}/>
        </Route>
        <Route path='policyPacksInfo' component={PolicyPacksWithoutFooter} onEnter={checkAuth}/>
        <Route path='startdashboard' component={DashboardStart} onEnter={checkAuth}/>
        <Route path='dashboard' component={Dashboard} onEnter={checkAuth}/>
        <Route path='connector' component={ConnectorContainer} onEnter={checkAuth} />
        <Route path='rse' component={RSEContainer} onEnter={checkAuth} >
            <Route path='allalerts'  component={AllAlerts} onEnter={checkAuth}/>
            <Route path='alertRules'  component={AlertRules} onEnter={checkAuth}/>
            <Route path='integrations'  component={IntegrationTable} onEnter={checkAuth}/>
        </Route>
        <Route path='scriptedPolicy' component={CustomPolicyMainContainer} onEnter={checkAuth} >
            <Route path='customPolicyPacks'  component={CustomPolicyPacks} onEnter={checkAuth}/>
            <Route path='customPolicies'  component={CustomPolicies} onEnter={checkAuth}/>
        </Route>
        <Route path='policy' component={PolicyStart} onEnter={checkAuth} />
        <Route path='report' component={ReportContainer} onEnter={checkAuth} >
            <Route path='allreports'  component={AllReports} onEnter={checkAuth}/>
            <Route path='alldockerreports'  component={AllDockerReports} onEnter={checkAuth}/>

        </Route>
        <Route path='logout'    component={LogoutContainer} />
        <Route path='sessionTimeout' component={SessionTimeoutContainer} />
      </Route>
    </Router>
  )
}
