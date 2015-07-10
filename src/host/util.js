function escapeSelector(s) {
    if (!s) {
        throw new Error('No selector to escape');
    }
    return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

export default {escapeSelector}