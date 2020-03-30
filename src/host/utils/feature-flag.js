export default function getBooleanFeatureFlag(flagName) {
  if (AJS && AJS.DarkFeatures && AJS.DarkFeatures.isEnabled && AJS.DarkFeatures.isEnabled(flagName)) {
    return true;
  }

  const flagMeta = document.querySelector('meta[name="ajs-fe-feature-flags"]');
  if (!flagMeta) {
    return false;
  }

  const flagContent = flagMeta.getAttribute('content');
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