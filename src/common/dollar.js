var $;
if (process.env.ENV === 'host') {
  $ = require('../host/dollar');
} else {
  $ = require('../plugin/dollar');
}

export default $;