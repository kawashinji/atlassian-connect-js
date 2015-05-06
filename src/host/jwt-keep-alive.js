import $ from './dollar';
import jwt from '../common/jwt';

function updateUrl (config){
    var promise = $.Deferred(function(defer){
        var contentPromise = window._AP.contentResolver.resolveByParameters({
            addonKey: config.addonKey,
            moduleKey: config.moduleKey,
            productContext: config.productContext,
            uiParams: config.uiParams,
            width: config.width,
            height: config.height,
            classifier: 'json'
        });

        contentPromise.done(function(data){
            var values = JSON.parse(data);
            defer.resolve(values.src);
        });
    });

    return promise;
}

export default {
    updateUrl,
    isExpired: jwt.isJwtExpired
}