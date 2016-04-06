Atlassian Connect JS
====================

The javascript library which backs [Atlassian Connect](http://connect.atlassian.com).

Based on [Simple XDM](https://bitbucket.org/atlassian/simple-xdm/)

Requirements
------------

- Node LTS (currently v4.4.2)
- NPM

Installation
------------

NPM install takes care of everything for you.

    npm install

Building
--------

To build the distribution:

    gulp

Running tests
-------------

We use [Karma](http://karma-runner.github.io/0.13/index.html) for running our [Jasmine](http://jasmine.github.io/) tests.

To run tests in watch mode:

    gulp karma

Running tests with saucelabs
----------------------------

Tests are automatically run in saucelabs from Bamboo. They run using all supported browsers. You can run these yourself as follows:

Set your saucelabs credentials using the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables.

Then run the tests using:

    SAUCE_LABS=true npm test

Alternatively you can enter suacelabs credentials at run time with:

    SAUCE_LABS=true SAUCE_USERNAME=XXXXX SAUCE_ACCESS_KEY=XXXXX npm test

Linting && Coding Style Checks
------------------------------

ACJS follows the Atlassian [Front-End Code Quality](https://extranet.atlassian.com/display/FED/The+Front-End+Code+Quality+%28FECQ%29+project) guidelines

    gulp lint

Point IntelliJ / Sublime / your editor of choice at the .eslintrc for linting as you edit.

Commands
--------

To see a wider range of gulp commands run:

    gulp --tasks

Dev loop
--------

To automatically re-create the dist directory on code change, run:

    gulp watch

To have your changes automatically loaded onto a running JIRA or Confluence instance, specify the path to your Atlassian
Connect plugin resource directory using the `deployPath` parameter, e.g.

    gulp deploy --deployPath=/tmp/resources

Contributing
------------
Contributions are welcome! However, the versions and branches of this project are in a state of flux. Before starting work,
please contact the Atlassian Connect team to ensure you understand the process you'll need to follow.

1. Create an issue in the [Atlassian Connect JavaScript API project](https://ecosystem.atlassian.net/browse/ACJS).
2. Create your feature branch off `master`.
    * Prefix your branch with `v5/` to have the build picked up by [the bamboo plan](https://ecosystem-bamboo.internal.atlassian.com/browse/CONNECT-JAM).
    * Include your issue key and a short description.
3. Push your changes, prefixing each commit message with the issue key.
4. Create a pull request against this repository.
5. If your changes will affect the functionality of the Connect plugin,
[create a feature branch on bamboo](https://ecosystem-bamboo.internal.atlassian.com/chain/admin/config/configureBranches.action?buildKey=CONNECT-CF)
and make sure the build is green against your ACJS branch. To make the build use your ACJS branch,
set the `maven.parameters` bamboo variable to `-Datlassian.connect-js.version=your-branch-name`.


Releasing a new version
------------------------
If you're an Atlassian developer and you wish to release a new version of Atlassian Connect JS for Atlassian products to use,
follow [this HOWTO](https://extranet.atlassian.com/display/ECO/HOW-TO%3A+Release+ACJS+for+products+to+use).


Compatibility
-------------
Atlassian Connect supports the following browsers:

- Chrome latest stable
- Firefox latest stable
- Safari latest stable (on OS X only)
- IE 10+
