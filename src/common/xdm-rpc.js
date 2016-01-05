import events from './events';
import jwt from './jwt';
import uri from './uri';
import uiParams from './ui-params';
import simpleXdm from 'simple-xdm/dist/host';
import $ from './dollar';

function XdmRpc($, config, bindings) {

    var extension = {
        addon_key: config.remoteKey,
        key: config.moduleKey,
        url: config.remote
    };

    Object.getOwnPropertyNames(bindings.local).forEach(function (name) {
        if(typeof bindings.local[name] === "object") {
            simpleXdm.defineModule(name, bindings.local[name]);
        }
    });
    var create = simpleXdm.create(extension, function(extension_id){
        console.log('i initd', extension_id);
    });


    //create iframe tag
    var props = $.extend({frameBorder: '0'}, config.props, create);
    props.id = 'easyXDM_' + config.container + '_provider';
    
    var iframe = $("<iframe />").attr(props)[0];
    iframe.setAttribute('rel', 'nofollow');

    $('body').append(iframe);
    $(iframe).trigger('ra.iframe.create');

}   


export default XdmRpc;