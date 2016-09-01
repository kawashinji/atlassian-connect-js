import Meta from 'src/plugin/meta';

describe('meta', () => {
  beforeEach(()=> {
    var apMetaTag = document.createElement('meta');
    var otherMetaTag = document.createElement('meta');
    var contentlessMetaTag = document.createElement('meta');
    apMetaTag.setAttribute('name', 'ap-test-meta');
    apMetaTag.setAttribute('content', 'some content');
    otherMetaTag.setAttribute('name', 'other-meta');
    otherMetaTag.setAttribute('content', 'some other content');
    contentlessMetaTag.setAttribute('name', 'ap-contentless-meta');
    document.head.appendChild(apMetaTag);
    document.head.appendChild(otherMetaTag);
    document.head.appendChild(contentlessMetaTag);
  });
  describe('getMeta', () => {
    it('should return content of existing meta tags', () => {
      expect(Meta.getMeta('test-meta')).toEqual('some content');
    });

    it('should return undefined for non-existent meta tags', () => {
      expect(Meta.getMeta('non-existent')).not.toBeDefined();
    });

    it('should only get meta tags that are prefixed with ap', () => {
      expect(Meta.getMeta('other-meta')).not.toBeDefined();
    });

    it('should return null when content of meta tag is not defined', () => {
      expect(Meta.getMeta('contentless-meta')).toBeNull();
    });
  });

  describe('localUrl', () => {
    beforeEach(() => {
      var localUrlMetaTag = document.createElement('meta');
      localUrlMetaTag.id = 'localUrlMetaTag';
      localUrlMetaTag.setAttribute('name', 'ap-local-base-url');
      localUrlMetaTag.setAttribute('content', 'https://connect.atlassian.com');
      document.body.appendChild(localUrlMetaTag);
    });

    afterEach(() => {
      var el = document.getElementById('localUrlMetaTag');
      if (el) {
        el.parentNode.removeChild(el);
      }
    });

    it('gets the correct local base url', () => {
      expect(Meta.localUrl()).toEqual('https://connect.atlassian.com');
    });

    it('gets the correct local base url appended with the path', () => {
      expect(Meta.localUrl('/some-path')).toEqual('https://connect.atlassian.com/some-path');
    });

    it('returns undefined when local base url meta tag does not exist', () => {
      var el = document.getElementById('localUrlMetaTag');
      el.parentNode.removeChild(el);
      expect(Meta.localUrl()).not.toBeDefined();
    });

    it('returns undefined when local base url meta tag does not exist (with path)', () => {
      var el = document.getElementById('localUrlMetaTag');
      el.parentNode.removeChild(el);
      expect(Meta.localUrl('some-path')).not.toBeDefined();
    });
  });
});