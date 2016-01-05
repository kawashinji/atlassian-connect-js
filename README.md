Atlassian Connect JS
===

The javascript API for [Atlassian Connect](http://connect.atlassian.com/). This is the README for version 3.0,
which is the current version in use by Connect for JIRA and Confluence.


Requirements
------------
- Node.js 0.10


Installation
------------
NPM install takes care of everything for you.

    npm install


Building
--------
To build the distribution:

    grunt build


Running tests
-------------
We use [Karma](http://karma-runner.github.io/0.10/index.html) for running our [Qunit](http://qunitjs.com/) tests.

To run tests in watch mode:

    grunt test-debug

To run tests over the built distribution instead of the source files:

    grunt test-dist


Linting && Coding Style Checks
------------------------------
Atlassian Connect uses its own subset of the [JSHint](http://jshint.com) and [JSCS](https://github.com/mdevils/node-jscs) rules. To run both of these:

    grunt lint

To lint individual files as they are modified run:

    grunt watch:lint


Commands
--------
To see a wider range of Grunt commands run:

    grunt


Dev loop
------------------
To automatically re-create the dist directory on code change, run:

    grunt watch:compile

To have your changes automatically loaded onto a running JIRA or Confluence instance, specify the path to your Atlassian
Connect plugin resource directory using the `deployPath` parameter, e.g.

    grunt watch:deploy --deployPath=/path/to/AC-plugin/atlassian-connect/plugin/src/main/resources


Contributing
------------------------
Contributions are welcome! However, the versions and branches of this project are in a state of flux. Before starting work,
please contact the Atlassian Connect team to ensure you understand the process you'll need to follow.

1. Create an issue in the [Atlassian Connect JavaScript API project](https://ecosystem.atlassian.net/browse/ACJS).
2. Create your feature branch off `release/3.0.0-do-not-delete`.
    * Prefix your branch with `v3/` to have the build picked up by [the bamboo plan](https://ecosystem-bamboo.internal.atlassian.com/browse/CONNECT-CJF3).
    * Include your issue key and a short description.
3. Push your changes, prefixing each commit message with the issue key.
4. Create a pull request against this repository (make sure you target `release/3.0.0-do-not-delete`).
5. If your changes will affect the functionality of the Connect plugin, 
[create a feature branch on bamboo](https://ecosystem-bamboo.internal.atlassian.com/chain/admin/config/configureBranches.action?buildKey=CONNECT-CF)
and make sure the build is green against your ACJS branch. To make the build use your ACJS branch, 
set the `maven.parameters` bamboo variable to `-Datlassian.connect-js.version=your-branch-name`.


Releasing a new version
------------------------
1. Add a new version in [Atlassian Connect JS Releases](https://extranet.atlassian.com/display/ECO/ACJS+-+Releases).
2. Update `package.json` with the new version number.
3. After merging, create a new tag with the version number.
4. Update `package.json` in your `atlassian-connect` branch to match the new version and raise a PR.


Compatibility
-------------
Atlassian Connect supports the following browsers:

- Chrome latest stable
- Firefox latest stable
- Safari latest stable (on OS X only)
- IE 9 / 10