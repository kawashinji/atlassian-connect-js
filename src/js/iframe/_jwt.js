(this.AP || this._AP).define("_jwt", ["_base64"], function(base64){
    "use strict";

    function parseJwtIssuer(jwt) {
        return parseJwtClaims(jwt)['iss'];
    }

    function parseJwtClaims(jwt) {

        if (null === jwt || '' === jwt) {
            throw('Invalid JWT: must be neither null nor empty-string.');
        }

        var firstPeriodIndex = jwt.indexOf('.');
        var secondPeriodIndex = jwt.indexOf('.', firstPeriodIndex + 1);

        if (firstPeriodIndex < 0 || secondPeriodIndex <= firstPeriodIndex) {
            throw('Invalid JWT: must contain 2 period (".") characters.');
        }

        var encodedClaims = jwt.substring(firstPeriodIndex + 1, secondPeriodIndex);

        if (null === encodedClaims || '' === encodedClaims) {
            throw('Invalid JWT: encoded claims must be neither null nor empty-string.');
        }

        var claimsString = base64.decode(encodedClaims);
        return JSON.parse(claimsString);
    }

    function isJwtExpired(jwtString, skew){
        if(skew === undefined){
            skew = 60; // give a minute of leeway to allow clock skew
        }
        var claims = parseJwtClaims(jwtString),
        expires = 0,
        now = Math.floor(Date.now() / 1000); // UTC timestamp now

        if(claims && claims.exp){
            expires = claims.exp;
        }

        if( (expires - now) < skew){
            return true;
        }

        return false;

    }

    return {
        parseJwtIssuer: parseJwtIssuer,
        parseJwtClaims: parseJwtClaims,
        isJwtExpired: isJwtExpired
    };
});