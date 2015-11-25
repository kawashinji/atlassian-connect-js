commonPlanConfiguration() {
    permissions() {
        loggedInUser(permissions: 'read')
    }
    notification(
            type: 'Change of Build Status',
            recipient: 'watchers'
    )
}

pollingTrigger(['repositoryName']) {
    trigger(
            type: 'polling',
            strategy: 'periodically',
            frequency: '60'
    ) {
        repository(name: '#repositoryName')
    }
}

hipChatNotification() {
    notification(
            type: 'Failed Builds and First Successful',
            recipient: 'hipchat',
            apiKey: '${bamboo.atlassian.hipchat.apikey.password}',
            notify: 'false',
            room: 'Atlassian Connect Cloud Team'
    )
}

stashNotification() {
    notification(
            type: 'All Builds Completed',
            recipient: 'stash'
    )
}

runTestsStage() {
    stage(
            name: 'Run Tests'
    ) {
        job(
                key:'QUNIT',
                name:'QUnit tests'
        ) {
            commonRequirements()
            checkoutDefaultRepositoryTask()
            setupVncTask()
            npmInstallTask()
            npmRunTestsTask()
            task(
                    type:'jUnitParser',
                    final:'true',
                    resultsDirectory:'**/test-reports/*.xml')
        }
    }
}

commonRequirements() {
    requirement(
            key: 'os',
            condition: 'equals',
            value: 'Linux'
    )
    requirement(
            key: 'system.builder.command.Bash',
            condition: 'exists'
    )
}

checkoutDefaultRepositoryTask() {
    task(
            type: 'checkout',
            description: 'Checkout Default Repository',
            cleanCheckout: 'true'
    )
}

npmInstallTask() {
    task(
            type: 'npm',
            description:'Install dependencies',
            command:'install',
            executable:'Node.js 0.10'
    )
}

npmRunTestsTask() {
    task(
            type: 'npm',
            description:'Run tests',
            command:'test',
            executable:'Node.js 0.10',
            environmentVariables:'DISPLAY=:20'
    )
    
}

setupVncTask() {
    task(
            type: 'script',
            description: 'VNC Script Setup',
            scriptBody: '''

#!/bin/bash

function killVnc {
VNC_PID_FILE=`echo $HOME/.vnc/*:20.pid`
if [ -n "$VNC_PID_FILE" -a -f "$VNC_PID_FILE" ]; then
vncserver -kill :20 >/dev/null 2>&1
if [ -f  "$VNC_PID_FILE" ]; then
VNC_PID=`cat $VNC_PID_FILE`
echo "Killing VNC pid ($VNC_PID) directly..."
kill -9 $VNC_PID
vncserver -kill :20 >/dev/null 2>&1

if [ -f  "$VNC_PID_FILE" ]; then
echo "Failed to kill vnc server"
exit -1
fi
fi
fi
rm -f /tmp/.X11-unix/X20
rm -f /tmp/.X20-lock
}

displayEnv() {

echo "---------------------------------------------"
echo "Displaying Environment Variables"
	echo "---------------------------------------------"
	env
	echo "---------------------------------------------"
}

echo starting vncserver

killVnc

#echo vncserver :20
vncserver :20 >/dev/null 2>&1
echo vncserver started on :20

displayEnv

# Move the mouse pointer out of the way
# echo Moving mouse pointer to 10 10.
# xwarppointer abspos 10 10

'''
    )
}