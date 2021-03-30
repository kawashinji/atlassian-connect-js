export default function getBooleanFeatureFlag(flagName) {
  if (AJS && AJS.DarkFeatures && AJS.DarkFeatures.isEnabled && AJS.DarkFeatures.isEnabled(flagName)) {
    return true;
  }

  const flagContent = window.featureFlags;
  if (!flagContent) {
    return false;
  }

  let flagJson = {};
  try {
    flagJson = JSON.parse(flagContent);
  } catch (err) {
    return false;
  }

  if (!flagJson[flagName] || typeof flagJson[flagName].value !== 'boolean') {
    return false;
  }
  return flagJson[flagName].value;
};