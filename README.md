Atlassian Connect JS
====================

The javascript library which backs [Atlassian Connect](https://developer.atlassian.com/cloud/jira/platform/getting-started-with-connect).

Based on [Simple XDM](https://bitbucket.org/atlassian/simple-xdm/)

![Bitbucket Pipelines build status](https://img.shields.io/bitbucket/pipelines/atlassian/atlassian-connect-js/master)

Hello API example
-----------------------

Modules allow you to expose new connect API's to add-on iframes.
```javascript
connectHost.defineModule('example', {
    sayHello: function(name){ alert('hello ' + name); }
});
```

An add-on may now call:
```javascript
AP.example.sayHello('fred');
```
which will create an alert with "hello fred"


Hello event example
-----------------------

Events are used when a callback needs to be called multiple times.
```javascript
var eventName = 'hello';
// addonFilter can be a filter function or object to match against add-ons (a blank object denotes sending to all add-ons).
var addonFilter = {
    addon_key: 'my-addon',
    key: 'my-module-key'
};
var eventData = {
    name: 'fred'
};
connectHost.broadcastEvent(eventName, addonFilter, eventData);
```

An addon may listen with:
```javascript
AP.register({
    hello: function(name){ alert('hello ' + name); }
});
```
which will create an alert with "hello fred"


Listening to keystrokes example
-------------------------------
Keyboard events are only sent to the currently focused frame. To allow a more seamless experience for users we allow a convenient way to listen for events inside an iframe.

```javascript
var extension_id = 'addon_key__module_key__ab1j4';
var escapeKeyKeycode = 27;
var keymodifiers = [];
function callback(data) {
    /** data = {
    * extension_id: addon_key__module_key__ab1j4
    * addon_key
    * key
    * keycode: 27
    * modifiers: []
    * }
    */

    alert(data.keycode + ' key pressed inside add-on iframe');
}
// an iframe must load before you can bind to it.
connectHost.onIframeEstablished(function(extension){
    connectHost.onKeyEvent(extension.extension_id, escapeKeyKeycode, callback);
});
```

Advanced Modules
-----------------------
Some times you need a more complex API than simple RPC -> callback.
You can define a Class module which will create a proxy class in the add-on.

```javascript
class Foo {
    constructor(foo) {
        this.foo = foo;
    }
    getFoo(cb) {
        if (typeof cb === 'function') {
            cb(this.foo);
        }
    }
};
host.defineModule('moduleWithClass', {
    foo: {
        constructor: Foo, // Class must be destructured in API spec
        getFoo: Foo.prototype.getFoo
    }
});
```

The addon can then use the proxy to call methods on an instance of your host class:
```javascript
var bar = AP.moduleWithClass.foo('bar');
bar.getFoo(function (foo) {
    console.log(foo);
});
```

Lifecycle
---------

* connectHost.onIframeEstablished - a callback triggered when an iframe successfully contacts the parent page.
* connectHost.onIframeUnload - a callback triggered when window.onunload is called inside the iframe.
* connectHost.destroy - call this to clean up destroyed connect add-ons - helpful for SPA web apps that need to free memory.


JWT and the content resolver
---

There are instances when a connect add-on is created but the URL is unknown (or if you use JWT, that it's expired).

In these instances you can register a function to delegate to. Connect will call this function and wait before creating the iframe until it has responded - usually requiring your application to callback to your server.
The example below uses jQuery promises, but any promise library should work (note: jQuery.ajax also returns a promise).

```javascript
function contentResolver(extension) {
  var promise = jQuery.Deferred(function(defer){
    // do some work here, then resolve to what would be passed to connectHost.create
    defer.resolve({
      url: 'the full iframe url from the server',
      addon_key: 'my-addon-key',
      key: 'my-module-key',
      options: {} // same options as connectHost.create({options:{}})
    });
  }).promise();
  return promise;
}

connectHost.registerContentResolver.resolveByExtension(contentResolver);
```

Analytics
---

You can expose an analytics event reciever as follows:

```javascript
define('ac/analytics', () => {
    return {
        emitGasV3: (eventType, eventData) => {
            console.log('this is an alaytics event', eventType, eventData);
        }
    };
});
```

Requirements
------------

- Node LTS (currently v8.x)
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

We use [Karma](https://karma-runner.github.io/latest/index.html) for running our [Jasmine](https://jasmine.github.io/) tests.

To run tests in watch mode:

    npm run karma

Running tests with saucelabs
----------------------------

Tests are automatically run in Sauce Labs from Bitbucket Pipelines. They run using all supported browsers. You can run these yourself as follows:

Set your Sauce Labs credentials using the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables.

Then run the tests using:

    SAUCE_LABS=true npm test

Alternatively you can enter Sauce Labs credentials at run time with:

    SAUCE_LABS=true SAUCE_USERNAME=XXXXX SAUCE_ACCESS_KEY=XXXXX npm test

Linting && Coding Style Checks
------------------------------

ACJS follows the Atlassian Front-End Code Quality guidelines.

    npm run lint

Point IntelliJ / Sublime / your editor of choice at the .eslintrc for linting as you edit.

Code Coverage
-------------

We use [Istanbul](https://istanbul.js.org/) for code coverage statistics.

To run tests and generate coverage results:

    COVERAGE=true npm run karma-ci

Then point your browser at:

    file:///<path to atlassian-connect-js>/coverage/index.html

Commands
--------

To see a wider range of gulp commands run:

    gulp --tasks

Dev loop
--------

To automatically re-create the dist directory on code change, run:

    gulp watch

To have your changes automatically loaded onto a locally running JIRA or Confluence instance, first make sure that you
include `-Dconnect-js-v5=true` in your command to start the product. Then you can deploy the contents of your dist directory:

    gulp deploy

By default, this will deploy to the v5 resources directory inside your local `atlassian-connect` project, i.e.
`/<path/to/my/projects>/atlassian-connect/jsapi-v5/src/main/resources/v5`. Changes will be automatically picked up by the
running product.

Contributing
------------
Contributions are welcome! However, the versions and branches of this project are in a state of flux. Before starting work,
please contact the Atlassian Connect team to ensure you understand the process you'll need to follow.

1. Create an issue in the [Atlassian Connect JavaScript API project](https://ecosystem.atlassian.net/browse/ACJS).
2. Create your feature branch off `master`.
    * Include your issue key and a short description.
3. Push your changes.
4. Create a pull request against this repository.
5. If your changes will affect the functionality of the Connect plugin,
[create a feature branch on bamboo](https://ecosystem-bamboo.internal.atlassian.com/chain/admin/config/configureBranches.action?buildKey=CONNECT-CF)
and make sure the build is green against your ACJS branch. To make the build use your ACJS branch,
set the `maven.parameters` bamboo variable to `-Datlassian.connect-js.version=your-branch-name`.


Releasing a new version
------------------------
Please ensure you have the latest master, then use:

    npm run release

To ensure that the local node_modules are cleaned before releasing


If you're an Atlassian developer and you wish to release a new version of Atlassian Connect JS for Atlassian products to use,
follow [this HOWTO](https://hello.atlassian.net/wiki/spaces/ECO/pages/144776697/HOW-TO+Release+ACJS+for+products+to+use).


Compatibility
-------------
Atlassian Connect supports the following browsers:

- Chrome latest stable
- Firefox latest stable
- Safari latest stable (on OS X only)
