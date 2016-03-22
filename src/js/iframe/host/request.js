(function(define, AJS, $){
    "use strict";
    define("ac/request", ['connect-host'], function (_AP) {

        var xhrProperties = ["status", "statusText", "responseText"],
            xhrHeaders = ["Content-Type", "ETag"],
            requestHeadersWhitelist = [
                "If-Match", "If-None-Match"
            ],
            contextPath = null,
            experimentify = null,
            addFileUploadHeader = null;

        function setExperimentify(func) {
            if ($.isFunction(func)) {
                experimentify = func;
            } else {
                throw new Error("func must be a function");
            }
        }

        function handleMultipartRequest (ajaxOptions) {
            ajaxOptions.contentType = false;
            ajaxOptions.processData = false;

            if (ajaxOptions.data && typeof ajaxOptions.data === 'object') {
                var formData = new FormData();
                Object.keys(ajaxOptions.data).forEach(function (key) {
                    formData.append(key, ajaxOptions.data[key]);
                });
                ajaxOptions.data = formData;
            } else {
                throw new Error("For a Multipart request, data must to be an Object");
            }

            if ($.isFunction(addFileUploadHeader)) {
                ajaxOptions = addFileUploadHeader(ajaxOptions)
            }

            return ajaxOptions;
        }

        function setAddFileUploadHeader (func) {
            if ($.isFunction(func)) {
                addFileUploadHeader = func;
            } else {
                throw new Error("func must be a function");
            }
        }

        _AP.extend(function () {
            return {
                init: function(xdm){
                    contextPath = xdm.cp;
                },
                internals: {
                    request: function (args, success, error) {
                        // add the context path to the request url
                        var url = contextPath + args.url;
                        url = url.replace(/\/\.\.\//ig,''); // strip /../ from urls

                        // reduce the xhr object to the just bits we can/want to expose over the bridge
                        function toJSON (xhr) {
                            var json = {headers: {}};
                            // only copy key properties and headers for transport across the bridge
                            $.each(xhrProperties, function (i, v) { json[v] = xhr[v]; });
                            // only copy key response headers for transport across the bridge
                            $.each(xhrHeaders, function (i, v) { json.headers[v] = xhr.getResponseHeader(v); });
                            return json;
                        }
                        function done (data, textStatus, xhr) {
                            success([data, textStatus, toJSON(xhr)]);
                        }
                        function fail (xhr, textStatus, errorThrown) {
                            error([toJSON(xhr), textStatus, errorThrown]);
                        }

                        var headers = {};
                        $.each(args.headers || {}, function (k, v) { headers[k.toLowerCase()] = v; });
                        // Disable system ajax settings. This stops confluence mobile from injecting callbacks and then throwing exceptions.
                        // $.ajaxSettings = {};

                        // execute the request with our restricted set of inputs
                        var ajaxOptions = {
                            url: url,
                            type: args.type || "GET",
                            data: args.data,
                            dataType: "text", // prevent jquery from parsing the response body
                            contentType: args.contentType,
                            cache: (typeof args.cache !== "undefined") ? !!args.cache : undefined,
                            headers: {
                                // */* will undo the effect on the accept header of having set dataType to "text"
                                "Accept": headers.accept || "*/*",
                                // send the client key header to force scope checks
                                "AP-Client-Key": this.addonKey
                            }
                        };

                        if (ajaxOptions.contentType === "multipart/form-data") {
                            ajaxOptions = handleMultipartRequest(ajaxOptions);
                        }

                        $.each(requestHeadersWhitelist, function(index, header) {
                            if (headers[header.toLowerCase()]) {
                                ajaxOptions.headers[header] = headers[header.toLowerCase()];
                            }
                        });

                        // Set experimental API header
                        if (args.experimental === true) {
                            if ($.isFunction(experimentify)) {
                                ajaxOptions = experimentify(ajaxOptions);
                            } else {
                                console.log("Experimental api is not supported.");
                            }
                        }

                        $.ajax(ajaxOptions).then(done, fail);
                    }

                }
            };
        });

        return {
            setExperimentify: setExperimentify,
            setAddFileUploadHeader: setAddFileUploadHeader
        }

    });
})(define, AJS, AJS.$);