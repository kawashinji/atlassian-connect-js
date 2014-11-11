(function(){

    require(["_jwt", "_base64"], function(jwt, base64) {

        // returns a "valid enough" jwt token from an expired one.
        function validTokenFromExpired(expiredToken){
            var decoded = jwt.parseJwtClaims(expiredToken),
            now = Math.floor(Date.now() / 1000) + 180; // UTC timestamp 3 minutes in the future
            decoded.exp = now;
            return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' + base64.encode(JSON.stringify(decoded)) + '.FRTxAG2Cq-a4vp9iaj0AYbGgGkiXSTAnrzu8C8AmihU';
        }

        module('Jwt', {
            setup: function() {
                this.expiredJwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJxc2giOiJhYTE1ZGY4MGIzYWJiYmY4ZjQ4YTc0MGY2ZTJiNzQ2OGM0NDNmZWY4MGFmNzEzZGFhODRiMDE2YjFhMTdmNmJhIiwiaXNzIjoiamlyYTo1OTk3NWQ2Ny00Y2EwLTRlOWUtOTk2MC1kMWFhYWU3NmJiMzkiLCJleHAiOjE0MTE1MTA4NjksImlhdCI6MTQxMTUxMDY4OX0.FRTxAG2Cq-a4vp9iaj0AYbGgGkiXSTAnrzu8C8AmihU';
                this.currentJwtToken = validTokenFromExpired(this.expiredJwtToken);
            }
        });


        test('parseJwtClaims fails if the jwt claim is empty', function (){
            try {
                jwt.parseJwtClaims('');
                ok(false);
            } catch (e){
                 ok(true);
            }

        });

        test('parseJwtClaims fails if the jwt claim is invalid', function (){
            try {
                jwt.parseJwtClaims('d32njio32njido23.d2l');
                ok(false);
            } catch (e){
                 ok(true);
            }
        });

        test('parseJwtClaims returns the expiration exp timestamp', function (){
            var jwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJxc2giOiJhYTE1ZGY4MGIzYWJiYmY4ZjQ4YTc0MGY2ZTJiNzQ2OGM0NDNmZWY4MGFmNzEzZGFhODRiMDE2YjFhMTdmNmJhIiwiaXNzIjoiamlyYTo1OTk3NWQ2Ny00Y2EwLTRlOWUtOTk2MC1kMWFhYWU3NmJiMzkiLCJleHAiOjE0MTE1MTA4NjksImlhdCI6MTQxMTUxMDY4OX0.FRTxAG2Cq-a4vp9iaj0AYbGgGkiXSTAnrzu8C8AmihU',
            claims = jwt.parseJwtClaims(jwtToken);
            equal(claims.exp, 1411510869);
        });

        test('isExpired returns false on new jwt token', function (){
            var isExp = jwt.isJwtExpired(this.currentJwtToken);
            equal(isExp, false, "token is not expired");
        });

        test('isExpired returns true on expired jwt token', function (){
            var isExp = jwt.isJwtExpired(this.expiredJwtToken);
            ok(isExp, "token is expired");

        });


    });

})();
