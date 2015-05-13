import jwt from '../../src/common/jwt'
import base64 from '../../src/common/base64'

// returns a "valid enough" jwt token from an expired one.
function validTokenFromExpired(expiredToken){
    var decoded = jwt.parseJwtClaims(expiredToken),
    now = Math.floor(Date.now() / 1000) + 180; // UTC timestamp 3 minutes in the future
    decoded.exp = now;
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' + base64.encode(JSON.stringify(decoded)) + '.FRTxAG2Cq-a4vp9iaj0AYbGgGkiXSTAnrzu8C8AmihU';
}

QUnit.module('Jwt', {
    setup: function() {
        this.expiredJwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJxc2giOiJhYTE1ZGY4MGIzYWJiYmY4ZjQ4YTc0MGY2ZTJiNzQ2OGM0NDNmZWY4MGFmNzEzZGFhODRiMDE2YjFhMTdmNmJhIiwiaXNzIjoiamlyYTo1OTk3NWQ2Ny00Y2EwLTRlOWUtOTk2MC1kMWFhYWU3NmJiMzkiLCJleHAiOjE0MTE1MTA4NjksImlhdCI6MTQxMTUxMDY4OX0.FRTxAG2Cq-a4vp9iaj0AYbGgGkiXSTAnrzu8C8AmihU';
        this.currentJwtToken = validTokenFromExpired(this.expiredJwtToken);
    }
});


QUnit.test('parseJwtClaims fails if the jwt claim is empty', function (assert){
    try {
        jwt.parseJwtClaims('');
        assert.ok(false);
    } catch (e){
         assert.ok(true);
    }

});

QUnit.test('parseJwtClaims fails if the jwt claim is invalid', function (assert){
    try {
        jwt.parseJwtClaims('d32njio32njido23.d2l');
        assert.ok(false);
    } catch (e){
         assert.ok(true);
    }
});

QUnit.test('parseJwtClaims returns the expiration exp timestamp', function (assert){
    var jwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJxc2giOiJhYTE1ZGY4MGIzYWJiYmY4ZjQ4YTc0MGY2ZTJiNzQ2OGM0NDNmZWY4MGFmNzEzZGFhODRiMDE2YjFhMTdmNmJhIiwiaXNzIjoiamlyYTo1OTk3NWQ2Ny00Y2EwLTRlOWUtOTk2MC1kMWFhYWU3NmJiMzkiLCJleHAiOjE0MTE1MTA4NjksImlhdCI6MTQxMTUxMDY4OX0.FRTxAG2Cq-a4vp9iaj0AYbGgGkiXSTAnrzu8C8AmihU',
    claims = jwt.parseJwtClaims(jwtToken);
    assert.equal(claims.exp, 1411510869);
});

QUnit.test('isExpired returns false on new jwt token', function (assert){
    var isExp = jwt.isJwtExpired(this.currentJwtToken);
    assert.equal(isExp, false, "token is not expired");
});

QUnit.test('isExpired returns true on expired jwt token', function (assert){
    var isExp = jwt.isJwtExpired(this.expiredJwtToken);
    assert.ok(isExp, "token is expired");

});
