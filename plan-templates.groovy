plan(
        projectKey: 'CONNECT',
        key:'CJF3',
        name:'JavaScript API - 3.0 Feature branches',
        description:'Feature branches of atlassian-connect-js 3.0 against the develop branch of atlassian-connect-plugin'
) {
    commonPlanConfiguration()
    repository(name: 'Atlassian Connect JS 3.0')

    pollingTrigger(repositoryName: 'Atlassian Connect JS 3.0')
    stashNotification()
    notification(
            type: 'All Builds Completed',
            recipient: 'committers'
    )
    branchMonitoring(
            enabled: 'true',
            matchingPattern: '(v3)/.*',
            timeOfInactivityInDays: '14',
            notificationStrategy: 'INHERIT',
            remoteJiraBranchLinkingEnabled: 'true'
    )
    runTestsStage()
}