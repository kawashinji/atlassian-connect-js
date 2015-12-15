Atlassian Connect JS
===

-------

HIC SVNT DRACONES

![Dragon](Dragon.png)

The master branch of ACJS is currently undergoing reorganisation and clean-up

Any feature work for JIRA or Confluence should target release/3.0.0-do-not-delete

The information below is not guaranteed to be correct, please see the README in the aforementioned branch

-------

The javascript library which backs [Atlassian Connect](http://connect.atlassian.com).

Requirements
------------

- Java 1.7 - for building the soy templates.
- Node 0.10
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

We use [Karma](http://karma-runner.github.io/0.10/index.html) for running our [Qunit](http://qunitjs.com/) tests.

To run tests in watch mode:

    grunt test-debug

To run tests over the built distribution instead of the source files:

    grunt test-dist

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

Linting has not been re-introduced since the move from grunt to gulp. [An issue](https://ecosystem.atlassian.net/browse/ACJS-35) has been raised to track bringing it back.

In the meanwhile, you can still point IntelliJ / Sublime / your editor of choice at the .jshintrc for linting as you edit.

Commands
--------

To see a wider range of Grunt commands run:

    grunt

How do you get it?
------------------

CDN to come.

Dev loop
------------------

To automatically re-create the dist directory on code change, run:
    grunt watch:compile

To automatically re-package whilst developing for jira / confluence.

    cd /path/to/atlassian-connect-js
    npm link
    cd /path/to/atlassian-connect/plugin
    npm link atlassian-connect-js
    npm run watch

Releasing a new version
------------------------

1. Add a new version in [Atlassian Connect JS Releases](https://extranet.atlassian.com/display/ARA/Atlassian+Connect+JS+Releases).
2. Update `package.json` with the new version number.
3. Submit a PR targeting the `master` branch and, after merging, create a new tag with the version number.
4. Update `package.json` in your `atlassian-connect` branch to match the new version and raise a PR.
5. Raise similar PRs to move HipChat and Bitbucket to this new version of `atlassian-connect-js`.

Compatibility
-------------

Atlassian Connect supports the following browsers:

- Chrome latest stable
- Firefox latest stable
- Safari latest stable (on OS X only)
- IE 9 / 10
