export default function getBooleanFeatureFlag(flagName) {
  if (AJS && AJS.DarkFeatures && AJS.DarkFeatures.isEnabled && AJS.DarkFeatures.isEnabled(flagName)) {
    return true;
  }

  const flagContent = window.featureFlags || (AJS && AJS.Meta && AJS.Meta.get && AJS.Meta.get('fe-feature-flags'));
  if (!flagContent) {
    return false;
  }

  let flagJson = {};
  try {
    flagJson = typeof flagContent === 'object' ? flagContent : JSON.parse(flagContent);
  } catch (err) {
    return false;
  }

  if (!flagJson[flagName] || typeof flagJson[flagName].value !== 'boolean') {
    return false;
  }
  return flagJson[flagName].value;
};