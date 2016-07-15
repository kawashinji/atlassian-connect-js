(function(define, AJS, $){
    "use strict";
    define("ac/request", ['connect-host'], function (_AP) {

        var xhrProperties = ["status", "statusText", "responseText"],
            xhrHeaders = ["Content-Type", "ETag"],
            requestHeadersWhitelist = [
                "If-Match", "If-None-Match"
            ],
            contextPath = null;

        function appendFormData(formData, key, value) {
            if (value._isBlob && value.blob && value.name) {
                formData.append(key, value.blob, value.name);
            } else {
                formData.append(key, value);
            }
            return formData;
        }

        function handleMultipartRequest (ajaxOptions) {
            ajaxOptions.contentType = false;
            ajaxOptions.processData = false;

            if (ajaxOptions.data && typeof ajaxOptions.data === "object") {
                var formData = new FormData();
                Object.keys(ajaxOptions.data).forEach(function (key) {
                    var formValue = ajaxOptions.data[key];

                    // map arrays into individual index entries
                    if (Array.isArray(formValue)) {
                        formValue.forEach(function (val, index) {
                            formData = appendFormData(formData, key + "[" + index + "]", val);
                        })
                    } else {
                        formData = appendFormData(formData, key, formValue);
                    }
                });
                ajaxOptions.data = formData;
            } else {
                throw new Error("For a Multipart request, data must to be an Object");
            }

            // Add XSRF bypass flag
            ajaxOptions.headers['X-Atlassian-Token'] = 'no-check';

            return ajaxOptions;
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
                            ajaxOptions.headers["X-ExperimentalApi"] = "opt-in";
                        }

                        $.ajax(ajaxOptions).then(done, fail);
                    }

                }
            };
        });
    });
})(define, AJS, AJS.$);