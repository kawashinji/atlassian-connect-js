import api from './api';
import $ from '../dollar';

export default function () {
    return {
        init: function (state, xdm) {
            if(state.uiParams.isGeneral){
                // register for url hash changes to invoking history.popstate callbacks.
                $(window).on('hashchange', function(e){
                    api.hashChange(e.originalEvent, xdm.historyMessage);
                });
            }
        },
        internals: {
            historyPushState: function (url) {
                if(this.uiParams.isGeneral){
                    return api.pushState(url);
                } else {
                    AJS.log('History is only available to page modules');
                }
            },
            historyReplaceState: function (url) {
                if(this.uiParams.isGeneral){
                    return api.replaceState(url);
                } else {
                    AJS.log('History is only available to page modules');
                }
            },
            historyGo: function (delta) {
                if(this.uiParams.isGeneral){
                    return api.go(delta);
                } else {
                    AJS.log('History is only available to page modules');
                }
            }
        },
        stubs: ['historyMessage']
    };
}

