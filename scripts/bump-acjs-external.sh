#!/bin/bash

TOKEN=$1
PACKAGE_VERSION=$2
BITBUCKET_BUILD_NUMBER=$3
USERNAME=ssakpal

# Confluence settings
ATLASSIAN_CONNECT_PATH=./scripts/atlassian-connect
ATLASSIAN_CONNECT_URL=https://${USERNAME}:${TOKEN}@bitbucket-mirror-au.internal.atlassian.com/scm/stash/ac/atlassian-connect.git
ATLASSIAN_CONNECT_BRANCH_NAME=inno-week/bump-acjs-${BITBUCKET_BUILD_NUMBER}

# Confluence
mkdir ${ATLASSIAN_CONNECT_PATH}
cd ${ATLASSIAN_CONNECT_PATH}
git init
git remote add origin ${ATLASSIAN_CONNECT_URL}

# Select files to checkout
git config core.sparseCheckout true
echo "/pom.xml" >> .git/info/sparse-checkout
echo "/jsapi-v5" >> .git/info/sparse-checkout
cat .git/info/sparse-checkout

# Pull selected files
git pull ${ATLASSIAN_CONNECT_URL}
git checkout -b ${ATLASSIAN_CONNECT_BRANCH_NAME}

echo "Bumping ACJS version in atlassian-connect/pom.xml ...."
xmlstarlet edit -L -N "x=http://maven.apache.org/POM/4.0.0" -u "//x:atlassian.connect-js-v5.version" -v ${PACKAGE_VERSION} pom.xml # alternative XPath = /x:project/x:properties/x:atlassian.connect-js-v5.version
# TODO: See if a more generic namespace is available for the command above

# Update version in jsapi-v5


# Cleanup
cd ../../
rm -rf ${ATLASSIAN_CONNECT_PATH}