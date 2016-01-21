function prefixCookie (addonKey, name){
    if (!addonKey || addonKey.length === 0) {
        throw new Error('addon key must be defined on cookies');
    }

    if (!name || name.length === 0) {
        throw new Error('Name must be defined');
    }
    return addonKey + '$$' + name;
}

module.exports = {
  prefixCookie
};