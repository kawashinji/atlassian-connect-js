// Temporary for KITKAT-1905 fix. Copy-paste from:
// https://bitbucket.org/atlassian/atlassian-connect-js/pull-requests/220/acjs-1028-add-feature-flag-to-analytics/diff

export default function getFeatureFlag(flagName, defaultValue) {
  const flagMeta = document.querySelector('meta[name="ajs-fe-feature-flags"]');
  if (!flagMeta) {
    return defaultValue;
  }

  const flagContent = flagMeta.getAttribute('content');
  if (!flagContent) {
    return defaultValue;
  }

  let flagJson = {};
  try {
    flagJson = JSON.parse(flagContent);
  } catch (err) {
    return defaultValue;
  }

  if (!flagJson[flagName] || typeof flagJson[flagName].value !== 'boolean') {
    return defaultValue;
  }
  return flagJson[flagName].value;
};