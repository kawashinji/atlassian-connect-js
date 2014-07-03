Atlassian Connect JS
===

The javascript source for atlassian connect

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

How do you get it?
------------------

CDN to come.


Compatibility
-------------

Atlassian Connect supports the following browsers:

- Chrome latest stable
- Firefox latest stable
- Safari latest stable (on OS X only)
- IE 9 / 10
