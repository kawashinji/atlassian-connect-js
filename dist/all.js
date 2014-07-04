'use strict';(function(f){function g(a,d){var b=[],h=0,c=a.length;if(a&&0<a.length)for(;h<c;h+=1){var m=e(a[h]);b.push(m);if(b.length===c){for(var m=[],n=0;n<c;n+=1)m[n]=b[n].exports;d&&d.apply(f,m)}}else d&&d()}function e(a){return c[a]=c[a]||{name:a,exports:function(){function a(){var b=a.__target__;if(b)return b.apply(f,arguments)}return a}()}}var b=f._AP?_AP:f.RA=f.AP={},c={};b.define=function(a,d,b){var h=e(a),c;b||(b=d,d=[]);b&&(c="function"!==typeof b?function(){return b}:b,g(d,function(){var a=
c.apply(f,arguments);if(a){"function"===typeof a&&(h.exports.__target__=a);for(var d in a)a.hasOwnProperty(d)&&(h.exports[d]=a[d])}}))};b.require=function(a,d){g("string"===typeof a?[a]:a,d)}})(this);
AP.define("_util",function(){function f(b,c){var a,d;if(b)if(a=b.length,null!=a&&"function"!==typeof b)for(d=0;d<a&&!1!==c.call(b[d],d,b[d]);)d+=1;else for(d in b)if(b.hasOwnProperty(d)&&!1===c.call(b[d],d,b[d]))break}function g(b,c){b+="EventListener";c+="Event";return function(a,d,k){if(a[b])a[b](d,k,!1);else if(a[c])a[c]("on"+d,k)}}function e(){var b=this.console;if(b&&b.log){var c=[].slice.call(arguments);if(b.log.apply)b.log.apply(b,c);else{for(var a=0,d=c.length;a<d;a+=1)c[a]=JSON.stringify(c[a]);
b.log(c.join(" "))}return!0}}return{each:f,extend:function(b){var c=arguments,c=[].slice.call(c,1,c.length);f(c,function(a,d){f(d,function(a,d){b[a]=d})});return b},bind:g("add","attach"),unbind:g("remove","detach"),trim:function(b){return b&&b.replace(/^\s+|\s+$/g,"")},debounce:function(b,c){var a;return function(){var d=this,k=[].slice.call(arguments);a&&clearTimeout(a);a=setTimeout(function(){a=null;b.apply(d,k)},c||50)}},inArray:function(b,c,a){if(Array.prototype.indexOf)return Array.prototype.indexOf.call(c,
b,a);a>>>=0;for(var d=c.length>>>0;a<d;a+=1)if(c[a]===b)return a;return-1},isFunction:function(b){return"function"===typeof b},log:e,handleError:function(b){if(!e.apply(this,b&&b.message?[b,b.message]:[b]))throw b;},decodeQueryComponent:function(b){return null==b?null:decodeURIComponent(b.replace(/\+/g,"%20"))}}});
AP.define("_dollar",["_util"],function(f){var g=f.each,e=f.extend,b=window.document;return e(function(c,a){a=a||b;var d=[];if(c)if("string"===typeof c){var k=a.querySelectorAll(c);g(k,function(a,b){d.push(b)})}else 1===c.nodeType?d.push(c):c===window&&d.push(c);e(d,{each:function(a){g(this,a);return this},bind:function(a,d){this.each(function(b,c){f.bind(c,a,d)})},attr:function(a){var d;this.each(function(b,c){d=c[a]||c.getAttribute&&c.getAttribute(a);return!d});return d},removeClass:function(a){return this.each(function(d,
b){b.className&&(b.className=b.className.replace(new RegExp("(^|\\s)"+a+"(\\s|$)")," "))})},html:function(a){return this.each(function(d,b){b.innerHTML=a})},append:function(d){return this.each(function(b,c){var k=a.createElement(d.tag);g(d,function(d,b){"$text"===d?k.styleSheet?k.styleSheet.cssText=b:k.appendChild(a.createTextNode(b)):"tag"!==d&&(k[d]=b)});c.appendChild(k)})}});return d},f)});
(window.AP||window._AP).define("_events",["_dollar"],function(f){function g(a,d){this._key=a;this._origin=d;this._events={};this._any=[]}function e(a,d){for(var b=0;b<a.length;++b)try{a[b].apply(null,d)}catch(h){c(h.stack||h.message||h)}}var b=window,c=b.AJS&&b.AJS.log||b.console&&b.console.log||function(){},b=g.prototype;b.on=function(a,d){a&&d&&this._listeners(a).push(d);return this};b.once=function(a,d){var b=this,c=function(){b.off(a,c);d.apply(null,arguments)};this.on(a,c);return this};b.onAny=
function(a){this._any.push(a);return this};b.off=function(a,d){var b=this._events[a];if(b){var c=f.inArray(d,b);0<=c&&b.splice(c,1);0===b.length&&delete this._events[a]}return this};b.offAll=function(a){a?delete this._events[a]:this._events={};return this};b.offAny=function(a){var d=this._any;a=f.inArray(a,d);0<=a&&d.splice(a,1);return this};b.emit=function(a){return this._emitEvent(this._event.apply(this,arguments))};b._event=function(a){return{name:a,args:[].slice.call(arguments,1),attrs:{},source:{key:this._key,
origin:this._origin}}};b._emitEvent=function(a){var d=a.args.concat(a);e(this._listeners(a.name),d);e(this._any,[a.name].concat(d));return this};b._listeners=function(a){return this._events[a]=this._events[a]||[]};return{Events:g}});
(window.AP||window._AP).define("_base64",["_dollar"],function(f){function g(){this.buffer=[]}function e(a){this._input=a;this._index=-1;this._buffer=[]}function b(a){this._input=a;this._index=-1;this._buffer=[]}g.prototype.append=function(a){this.buffer.push(a);return this};g.prototype.toString=function(){return this.buffer.join("")};var c={codex:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(a){var d=new g;for(a=new e(a);a.moveNext();){var b=a.current;a.moveNext();
var c=a.current;a.moveNext();var l=a.current,f=b>>2,b=(b&3)<<4|c>>4,n=(c&15)<<2|l>>6,q=l&63;isNaN(c)?n=q=64:isNaN(l)&&(q=64);d.append(this.codex.charAt(f)+this.codex.charAt(b)+this.codex.charAt(n)+this.codex.charAt(q))}return d.toString()},decode:function(a){var d=new g;for(a=new b(a);a.moveNext();){var c=a.current;if(128>c)d.append(String.fromCharCode(c));else if(191<c&&224>c){a.moveNext();var h=a.current;d.append(String.fromCharCode((c&31)<<6|h&63))}else a.moveNext(),h=a.current,a.moveNext(),d.append(String.fromCharCode((c&
15)<<12|(h&63)<<6|a.current&63))}return d.toString()}};e.prototype={current:Number.NaN,moveNext:function(){if(0<this._buffer.length)return this.current=this._buffer.shift(),!0;if(this._index>=this._input.length-1)return this.current=Number.NaN,!1;var a=this._input.charCodeAt(++this._index);13==a&&10==this._input.charCodeAt(this._index+1)&&(a=10,this._index+=2);128>a?this.current=a:(127<a&&2048>a?this.current=a>>6|192:(this.current=a>>12|224,this._buffer.push(a>>6&63|128)),this._buffer.push(a&63|128));
return!0}};b.prototype={current:64,moveNext:function(){if(0<this._buffer.length)return this.current=this._buffer.shift(),!0;if(this._index>=this._input.length-1)return this.current=64,!1;var a=c.codex.indexOf(this._input.charAt(++this._index)),b=c.codex.indexOf(this._input.charAt(++this._index)),k=c.codex.indexOf(this._input.charAt(++this._index)),h=c.codex.indexOf(this._input.charAt(++this._index)),l=(k&3)<<6|h;this.current=a<<2|b>>4;64!=k&&this._buffer.push((b&15)<<4|k>>2);64!=h&&this._buffer.push(l);
return!0}};return{encode:function(a){return window.btoa?window.btoa(a):c.encode(a)},decode:function(a){return window.atob?window.atob(a):c.decode(a)}}});
(this.AP||this._AP).define("_uri",[],function(){function f(a){a&&(a=decodeURIComponent(a),a=a.replace(c.pluses," "));return a}function g(a){var b=c.uri_parser.exec(a||""),k={};"source protocol authority userInfo user password host port relative path directory file query anchor".split(" ").forEach(function(a,c){k[a]=b[c]||""});return k}function e(a){var b,k,h,f,e,n=[];if("undefined"===typeof a||null===a||""===a)return n;0===a.indexOf("?")&&(a=a.substring(1));b=a.toString().split(c.query_separator);
for(a=0;a<b.length;a++)k=b[a],h=k.indexOf("="),0!==h&&(f=decodeURIComponent(k.substring(0,h)),e=decodeURIComponent(k.substring(h+1).replace(/\+/g," ")),n.push(-1===h?[k,null]:[f,e]));return n}function b(a){this.uriParts=g(a);this.queryPairs=e(this.uriParts.query);this.hasAuthorityPrefixUserPref=null}var c={starts_with_slashes:/^\/+/,ends_with_slashes:/\/+$/,pluses:/\+/g,query_separator:/[&;]/,uri_parser:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/};
Array.prototype.forEach||(Array.prototype.forEach=function(a,b){for(var c=0,h=this.length;c<h;++c)a.call(b||this,this[c],c,this)});"protocol userInfo host port path anchor".split(" ").forEach(function(a){b.prototype[a]=function(b){"undefined"!==typeof b&&(this.uriParts[a]=b);return this.uriParts[a]}});b.prototype.hasAuthorityPrefix=function(a){"undefined"!==typeof a&&(this.hasAuthorityPrefixUserPref=a);return null===this.hasAuthorityPrefixUserPref?-1!==this.uriParts.source.indexOf("//"):this.hasAuthorityPrefixUserPref};
b.prototype.query=function(a){var b="",c;"undefined"!==typeof a&&(this.queryPairs=e(a));for(a=0;a<this.queryPairs.length;a++)c=this.queryPairs[a],0<b.length&&(b+="&"),null===c[1]?b+=c[0]:(b+=c[0],b+="=",c[1]&&(b+=encodeURIComponent(c[1])));return 0<b.length?"?"+b:b};b.prototype.getQueryParamValue=function(a){var b,c;for(c=0;c<this.queryPairs.length;c++)if(b=this.queryPairs[c],a===b[0])return b[1]};b.prototype.getQueryParamValues=function(a){var b=[],c,h;for(c=0;c<this.queryPairs.length;c++)h=this.queryPairs[c],
a===h[0]&&b.push(h[1]);return b};b.prototype.deleteQueryParam=function(a,b){var c=[],h,e,g,n;for(h=0;h<this.queryPairs.length;h++)e=this.queryPairs[h],g=f(e[0])===f(a),n=e[1]===b,(1!==arguments.length||g)&&(2!==arguments.length||g&&n)||c.push(e);this.queryPairs=c;return this};b.prototype.addQueryParam=function(a,b,c){3===arguments.length&&-1!==c?(c=Math.min(c,this.queryPairs.length),this.queryPairs.splice(c,0,[a,b])):0<arguments.length&&this.queryPairs.push([a,b]);return this};b.prototype.replaceQueryParam=
function(a,b,c){var h=-1,e,g;if(3===arguments.length){for(e=0;e<this.queryPairs.length;e++)if(g=this.queryPairs[e],f(g[0])===f(a)&&decodeURIComponent(g[1])===f(c)){h=e;break}this.deleteQueryParam(a,c).addQueryParam(a,b,h)}else{for(e=0;e<this.queryPairs.length;e++)if(g=this.queryPairs[e],f(g[0])===f(a)){h=e;break}this.deleteQueryParam(a);this.addQueryParam(a,b,h)}return this};"protocol hasAuthorityPrefix userInfo host port path query anchor".split(" ").forEach(function(a){var c="set"+a.charAt(0).toUpperCase()+
a.slice(1);b.prototype[c]=function(b){this[a](b);return this}});b.prototype.scheme=function(){var a="";this.protocol()?(a+=this.protocol(),this.protocol().indexOf(":")!==this.protocol().length-1&&(a+=":"),a+="//"):this.hasAuthorityPrefix()&&this.host()&&(a+="//");return a};b.prototype.origin=function(){var a=this.scheme();if("file://"==a)return a+this.uriParts.authority;this.userInfo()&&this.host()&&(a+=this.userInfo(),this.userInfo().indexOf("@")!==this.userInfo().length-1&&(a+="@"));this.host()&&
(a+=this.host(),this.port()&&(a+=":"+this.port()));return a};b.prototype.addTrailingSlash=function(){var a=this.path()||"";"/"!==a.substr(-1)&&this.path(a+"/");return this};b.prototype.toString=function(){var a,b=this.origin();this.path()?(a=this.path(),c.ends_with_slashes.test(b)||c.starts_with_slashes.test(a)?(b&&b.replace(c.ends_with_slashes,"/"),a=a.replace(c.starts_with_slashes,"/")):b+="/",b+=a):this.host()&&(this.query().toString()||this.anchor())&&(b+="/");this.query().toString()&&(0!==this.query().toString().indexOf("?")&&
(b+="?"),b+=this.query().toString());this.anchor()&&(0!==this.anchor().indexOf("#")&&(b+="#"),b+=this.anchor());return b};b.prototype.clone=function(){return new b(this.toString())};return{init:b}});
(this.AP||this._AP).define("_ui-params",["_dollar","_base64","_uri"],function(f,g,e){return{encode:function(b){return g.encode(JSON.stringify(b))},fromUrl:function(b){b=new e.init(b);b=b.getQueryParamValue("ui-params");return this.decode(b)},fromWindowName:function(b,c){b=b||window;var a=this.decode(b.name);return c?a?a[c]:void 0:a},decode:function(b){var c={};if(b&&0<b.length)try{c=JSON.parse(g.decode(b))}catch(a){console&&console.log&&console.log("Cannot decode passed ui params",b)}return c}}});
(this.AP||this._AP).define("_xdm","_events _base64 _uri _ui-params host/analytics host/_util".split(" "),function(f,g,e,b,c,a){function d(c,l,m){function n(a,b,c){try{u.postMessage(JSON.stringify({c:v,i:a,t:b,m:c}),s)}catch(d){C(d.message||d.toString())}}function q(a,b,c,d){var e=Math.floor(1E9*Math.random()).toString(16);G.add(e,c,d);n(e,"request",{n:a,a:b})}function z(a){try{var b=JSON.parse(a.data),c=b.i,d=b.c,e=b.t,h=b.m;a.source!==u&&a.origin.toLowerCase()===s&&d===v&&(u=a.source);if(a.source===
u&&a.origin.toLowerCase()===s&&d===v)if("request"===e){var f=h.n,g=h.a,k=D[f],l,q,m;if(k){l=function(a){n(c,"done",a)};q=function(a){n(c,"fail",a)};m=(g?g.length:0)<k.length;a=D;!0===p.isHost?(a=p,a.analytics&&a.analytics.trackBridgeMethod(f)):a.isHost=!1;try{m?k.apply(a,g.concat([l,q])):l(k.apply(a,g))}catch(z){q(z.message||z.toString())}}else A("Unhandled request:",b)}else if("done"===e||"fail"===e)G.invoke(e,c,h)||A("Unhandled response:",e,c,h)}catch(B){C(B.message||B.toString())}}function B(a){return function(){function b(){if(c.isFunction(d[d.length-
1]))return d.pop()}var d=[].slice.call(arguments),e,f;f=b();e=b();e||(e=f,f=void 0);q(a,d,e,f)}}function E(a){p.isActive()?z(a.originalEvent?a.originalEvent:a):c(window).unbind("message",E)}function w(a,b){return(new e.init(a)).getQueryParamValue(b)}function I(d){if(!d.container)throw Error("config.container must be defined");var e=document.createElement("iframe"),f="easyXDM_"+d.container+"_provider",g="";d.uiParams&&(g=b.encode(d.uiParams));c.extend(e,{id:f,name:g,frameBorder:"0"},d.props);e.setAttribute("rel",
"nofollow");c("#"+a.escapeSelector(d.container)).append(e);e.src=d.remote;return e}function A(){d.debug&&C.apply(x,["DEBUG:"].concat([].slice.call(arguments)))}function C(){var a=c.log||x.AJS&&x.AJS.log;a&&a.apply(x,arguments)}function J(a){if(null===a||""===a)throw"Invalid JWT: must be neither null nor empty-string.";var b=a.indexOf("."),c=a.indexOf(".",b+1);if(0>b||c<=b)throw'Invalid JWT: must contain 2 period (".") characters.';a=a.substring(b+1,c);if(null===a||""===a)throw"Invalid JWT: encoded claims must be neither null nor empty-string.";
a=g.decode(a);return JSON.parse(a)}var p,F,u,s,v,y,t,x=window,r=x.location.toString(),D=m.local||{};m=m.remote||[];var K=(new e.init(r)).origin(),G=function(){var a={};return{add:function(b,c,d){a[b]={done:c||null,fail:d||null,async:!!c}},invoke:function(b,c,d){var e;a[c]&&(a[c][b]?(a[c][b](d),e=!0):e=!a[c].async&&"fail"!==b,delete a[c]);return e}}}();/xdm_e/.test(r)?(u=x.parent,y="local",t=(l=w(r,"jwt"))?J(l).iss:w(r,"oauth_consumer_key"),null===t&&(t=Math.random()),t=y,s=w(r,"xdm_e").toLowerCase(),
v=w(r,"xdm_c"),l={isHost:!1,isActive:function(){return!0}}):(r=I(l),u=r.contentWindow,y=w(l.remote,"oauth_consumer_key")||w(l.remote,"jwt"),t=l.remoteKey,s=(new e.init(l.remote)).origin().toLowerCase(),v=l.channel,l={isHost:!0,iframe:r,uiParams:l.uiParams,destroy:function(){c(window).unbind("message",E);p.iframe&&(c(p.iframe).remove(),delete p.iframe)},isActive:function(){return c.contains(document.documentElement,p.iframe)}},c(r).on("ra.iframe.destroy",l.destroy));F=t+"|"+(k+=1);p=c.extend({id:F,
remoteOrigin:s,channel:v,addonKey:t},l);c.each(m,function(a,b){"number"===typeof a&&(a=b);p[a]=B(a)});var H=p.events=new f.Events(y,K);H.onAny(function(){var a=arguments[arguments.length-1],b=a.trace=a.trace||{},d=p.id+"|xdm";if(p.isHost&&!b[d]&&a.source.channel!==p.id||!p.isHost&&a.source.key===y)b[d]=!0,a=c.extend({},a),delete a.trace,A("Forwarding "+(p.isHost?"host":"addon")+" event:",a),q("_event",[a])});D._event=function(a){delete a.trace;this.isHost&&(a.source={channel:this.id||F,key:this.addonKey,
origin:this.remoteOrigin||s});A("Receiving as "+(this.isHost?"host":"addon")+" event:",a);H._emitEvent(a)};c(window).bind("message",E);return p}var k=0;return d});
AP.define("_rpc",["_dollar","_xdm"],function(f,g){var e=f.each,b=f.extend,c=f.isFunction,a={},d,k={},h=["init"],l={},m=[],n;return{extend:function(d){c(d)&&(d=d(a));b(k,d.apis);b(l,d.internals);h=h.concat(d.stubs||[]);var e=d.init;c(e)&&m.push(e);return d.apis},init:function(c){c=c||{};n||(e(k,function(a){h.push(a)}),d=this.rpc=new g(f,{},{remote:h,local:l}),d.init(),b(a,d),e(m,function(a,d){try{d(b({},c))}catch(e){f.handleError(e)}}),n=!0)}}});
AP.define("events",["_dollar","_rpc"],function(f,g){return g.extend(function(e){var b={};f.each("on once onAny off offAll offAny emit".split(" "),function(c,a){b[a]=function(){var c=e.events;c[a].apply(c,arguments);return b}});return{apis:b}})});
AP.define("env",["_dollar","_rpc"],function(f,g){var e=g.extend(function(b){return{apis:{getLocation:function(c){b.getLocation(c)},getUser:function(c){b.getUser(c)},getTimeZone:function(c){b.getTimeZone(c)},fireEvent:function(b,a){console.log("AP.fireEvent deprecated; will be removed in future version")},resize:f.debounce(function(c,a){var d=e.size(c,a,e.container());b.resize(d.w,d.h)},50),sizeToParent:f.debounce(function(){b.sizeToParent()},50)}}});return f.extend(e,{meta:function(b){if(0<=navigator.userAgent.indexOf("MSIE 8")){var c,
a=document.getElementsByTagName("meta");for(c=0;c<a.length;c++)if(a[c].getAttribute("name")==="ap-"+b)return a[c].getAttribute("content")}else return f("meta[name='ap-"+b+"']").attr("content")},container:function(){var b=f(".ac-content, #content");return 0<b.length?b[0]:document.body},localUrl:function(b){return this.meta("local-base-url")+(null==b?"":b)},size:function(b,c,a){b=null==b?"100%":b;a||(a=this.container());c?a=c:(c=Math.max(a.scrollHeight,document.documentElement.scrollHeight,a.offsetHeight,
document.documentElement.offsetHeight,a.clientHeight,document.documentElement.clientHeight),a===document.body?a=c:(a=Math.max(a.offsetHeight,a.clientHeight),0===a&&(a=c)));return{w:b,h:a}}})});
AP.define("request",["_dollar","_rpc"],function(f,g){function e(a){var d=c({},a),e=a.headers||{};delete d.headers;return c(d,{getResponseHeader:function(a){var c=null;a&&(a=a.toLowerCase(),b(e,function(b,d){if(b.toLowerCase()===a)return c=d,!1}));return c},getAllResponseHeaders:function(){var a="";b(e,function(b,c){a+=(a?"\r\n":"")+b+": "+c});return a}})}var b=f.each,c=f.extend;return g.extend(function(a){return{apis:{request:function(b,c){function f(){}var g,m;"object"===typeof b?c=b:c?c.url=b:c=
{url:b};g=c.success||f;delete c.success;m=c.error||f;delete c.error;a.request(c,function(a){return g(a[0],a[1],e(a[2]))},function(a){return m(e(a[0]),a[1],a[2])})}}}}).request});
AP.define("dialog",["_dollar","_rpc","_ui-params","_uri"],function(f,g,e,b){var c=Boolean(e.fromUrl(window.location.toString()).dlg),a;"1"===(new b.init(window.location.toString())).getQueryParamValue("dialog")&&(c=!0);g.extend(function(b){var e={};a={create:function(a){b.createDialog(a);return{on:function(a,c){b.events.once("dialog."+a,c)}}},close:function(a){b.events.emit("dialog.close",a);b.closeDialog()},isDialog:c,onDialogMessage:function(a,b){this.getButton(a).bind(b)},getButton:function(a){return{name:a,
enable:function(){b.setDialogButtonEnabled(a,!0)},disable:function(){b.setDialogButtonEnabled(a,!1)},toggle:function(){var b=this;b.isEnabled(function(c){b[c?"disable":"enable"](a)})},isEnabled:function(c){b.isDialogButtonEnabled(a,c)},bind:function(b){var c=e[a];c||(c=e[a]=[]);c.push(b)},trigger:function(){var b=this,c=!0,d=!0;f.each(e[a],function(a,e){d=e.call(b,{button:b,stopPropagation:function(){c=!1}});return c});return!!d}}}};return{internals:{dialogMessage:function(b){var d=!0;try{c?d=a.getButton(b).trigger():
f.handleError("Received unexpected dialog button event from host:",b)}catch(e){f.handleError(e)}return d}},stubs:["setDialogButtonEnabled","isDialogButtonEnabled","createDialog","closeDialog"]}});return a});AP.define("inline-dialog",["_dollar","_rpc"],function(f,g){var e;g.extend(function(b){e={hide:function(){b.hideInlineDialog()}};return{stubs:["hideInlineDialog"]}});return e});
AP.define("messages",["_dollar","_rpc"],function(f,g){var e=0;return g.extend(function(b){var c={};f.each("generic error warning success info hint".split(" "),function(a,d){c[d]=function(a,c,f){f=f||{};e++;f.id="ap-message-"+e;b.showMessage(d,a,c,f);return f.id}});c.clear=function(a){b.clearMessage(a)};return{apis:c,stubs:["showMessage","clearMessage"]}})});
AP.define("cookie",["_dollar","_rpc"],function(f,g){var e;g.extend(function(b){e={save:function(c,a,d){b.saveCookie(c,a,d)},read:function(c,a){b.readCookie(c,a)},erase:function(c){b.eraseCookie(c)}};return{stubs:["saveCookie","readCookie","eraseCookie"]}});return e});
AP.define("history",["_dollar","_rpc","_ui-params"],function(f,g,e){var b=[],c=e.fromWindowName(null,"historyState");return g.extend(function(a){return{apis:{getState:function(){return c},go:function(b){a.historyGo(b)},back:function(){return this.go(-1)},forward:function(){return this.go(1)},pushState:function(b){c=b;a.historyPushState(b)},replaceState:function(b){c=b;a.historyReplaceState(b)},popState:function(a){b.push(a)}},internals:{historyMessage:function(a){c=a.newURL;for(var e in b)try{b[e](a)}catch(g){f.log("History popstate callback exception: "+
g.message)}}},stubs:["historyPushState","historyGo","historyReplaceState"]}})});
(window.AP||window._AP).define("_resize_listener",["_dollar"],function(f){function g(e,b,c){var a="over"==b;e.addEventListener("OverflowEvent"in window?"overflowchanged":b+"flow",function(d){if(d.type==b+"flow"||0==d.orient&&d.horizontalOverflow==a||1==d.orient&&d.verticalOverflow==a||2==d.orient&&d.horizontalOverflow==a&&d.verticalOverflow==a)return d.flow=b,c.call(this,d)},!1)}return{addListener:function(e,b){var c="onresize"in e;if(!c&&!e._resizeSensor){f("head").append({tag:"style",type:"text/css",
$text:".ac-resize-sensor,.ac-resize-sensor>div {position: absolute;top: 0;left: 0;width: 100%;height: 100%;overflow: hidden;z-index: -1;}"});var a=e._resizeSensor=document.createElement("div");a.className="ac-resize-sensor";a.innerHTML='<div class="ac-resize-overflow"><div></div></div><div class="ac-resize-underflow"><div></div></div>';var d=0,k=0,h=a.firstElementChild.firstChild,l=a.lastElementChild.firstChild,m=function(a){var b=!1,c=e.offsetWidth;d!=c&&(h.style.width=c-1+"px",l.style.width=c+1+
"px",b=!0,d=c);c=e.offsetHeight;k!=c&&(h.style.height=c-1+"px",l.style.height=c+1+"px",b=!0,k=c);b&&a.currentTarget!=e&&(a=document.createEvent("Event"),a.initEvent("resize",!0,!0),e.dispatchEvent(a))};"static"===getComputedStyle(e).position&&(e.style.position="relative",e._resizeSensor._resetPosition=!0);g(a,"over",m);g(a,"under",m);g(a.firstElementChild,"over",m);g(a.lastElementChild,"under",m);e.appendChild(a);m({})}var n=e._flowEvents||(e._flowEvents=[]);-1==f.inArray(b,n)&&n.push(b);c||e.addEventListener("resize",
b,!1);e.onresize=function(a){f.each(n,function(b,c){c.call(e,a)})}}}});
AP.define("jira",["_dollar","_rpc"],function(f,g){var e,b,c={onSaveValidation:function(a){b=a},onSave:function(a){e=a},trigger:function(){var a=!0;f.isFunction(b)&&(a=b.call());return{valid:a,value:a?""+e.call():void 0}}},a=g.extend(function(a){return{apis:{getWorkflowConfiguration:function(b){a.getWorkflowConfiguration(b)},refreshIssuePage:function(){a.triggerJiraEvent("refreshIssuePage")}},internals:{setWorkflowConfigurationMessage:function(){return c.trigger()}},stubs:["triggerJiraEvent"]}});return f.extend(a,
{WorkflowConfiguration:c})});AP.define("confluence",["_dollar","_rpc"],function(f,g){return g.extend(function(e){return{apis:{saveMacro:function(b,c){e.saveMacro(b,c)},getMacroData:function(b){e.getMacroData(b)},getMacroBody:function(b){e.getMacroBody(b)},closeMacroEditor:function(){e.closeMacroEditor()}}}})});
AP.require("_dollar _rpc _resize_listener env request dialog jira".split(" "),function(f,g,e,b,c,a,d){function k(){b.getLocation(function(a){f("head").append({tag:"base",href:a,target:"_parent"})})}function h(){var a=document.createElement("meta"),b=document.head||document.getElementsByTagName("head")[0],c=!1;f("meta").each(function(a,b){if("X-UA-Compatible"===b.getAttribute("http-equiv"))return c=!0,!1});!1===c&&(a.setAttribute("http-equiv","X-UA-Compatible"),a.setAttribute("content","IE=edge"),
b.appendChild(a))}function l(){var b=a.isDialog?"10px 10px 0 10px":"0";f("head").append({tag:"style",type:"text/css",$text:"body {margin: "+b+" !important;}"})}g.extend({init:function(c){!1!==c.margin&&l(c);!0===c.base&&k(c);!1===c.injectRenderModeMeta&&void 0!==this.JSON||h();if(c.sizeToParent)b.sizeToParent();else if(!1!==c.resize){var d=c.resize;void 0===c.resize&&(d="auto");d="auto"===d?125:+d;0<=d&&60>d&&(d=60);!a.isDialog&&0<d?f.bind(window,"load",function(){var a;setInterval(function(){var c=
b.size();a&&a.w===c.w&&a.h===c.h||(b.resize(c.w,c.h),a=c)},d)}):f.bind(window,"load",function(){b.resize();var a=b.container();a?e.addListener(a,function(){b.resize()}):f.log("Your page should have a root block element with an ID called #content or class called .ac-content if you want your page to dynamically resize after the initial load.")})}}});f.extend(AP,b,d,{Meta:{get:b.meta},request:c,Dialog:a});var m={};(c=f("script[src*='/atlassian-connect/all']"))&&/\/atlassian-connect\/all(-debug)?\.js($|\?)/.test(c.attr("src"))&&
(c=c.attr("data-options"))&&f.each(c.split(";"),function(a,b){var c=f.trim;if(b=c(b)){var d=b.split(":"),e=c(d[0]),c=c(d[1]);e&&null!=c&&(m[e]="true"===c||"false"===c?"true"===c:c)}});g.init(m)});
