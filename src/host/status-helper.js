import $ from './dollar';

/**
 * Methods for showing the status of a connect-addon (loading, time'd-out etc)
 */

var statuses = {
  loading: {
    descriptionHtml: '<div class="small-spinner"></div>Loading add-on...'
  },
  'load-timeout': {
    descriptionHtml: '<div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?'
  },

  'load-error': {
    descriptionHtml: 'Add-on failed to load.'
  }
};

function hideStatuses($home) {
  // If there's a pending timer to show the loading status, kill it.
  if ($home.data('loadingStatusTimer')) {
    clearTimeout($home.data('loadingStatusTimer'));
    $home.removeData('loadingStatusTimer');
  }
  $home.find('.ap-status').addClass('hidden');
}

function showStatus($home, status) {
  hideStatuses($home);
  $home.closest('.ap-container').removeClass('hidden');
  $home.find('.ap-stats').removeClass('hidden');
  $home.find('.ap-' + status).removeClass('hidden');
  /* setTimout fixes bug in AUI spinner positioning */
  setTimeout(function () {
    var spinner = $home.find('.small-spinner', '.ap-' + status);
    if (spinner.length && spinner.spin) {
      spinner.spin({lines: 12, length: 3, width: 2, radius: 3, trail: 60, speed: 1.5, zIndex: 1});
    }
  }, 10);
}

//when an addon has loaded. Hide the status bar.
function showLoadedStatus($home) {
  hideStatuses($home);
}

function showLoadingStatus($home, delay) {
  if (!delay) {
    showStatus($home, 'loading');
  } else {
    // Wait a second before showing loading status.
    var timer = setTimeout(showStatus.bind(null, $home, 'loading'), delay);
    $home.data('loadingStatusTimer', timer);
  }
}

function showloadTimeoutStatus($home) {
  showStatus($home, 'load-timeout');
}

function showLoadErrorStatus($home) {
  showStatus($home, 'load-error');
}

function createStatusMessages() {
  var i;
  var stats = $('<div class="ap-stats" />');

  for (i in statuses) {
    var status = $('<div class="ap-' + i + ' ap-status hidden" />');
    status.append('<small>' + statuses[i].descriptionHtml + '</small>');
    stats.append(status);
  }
  return stats;
}

export default {
  createStatusMessages,
  showLoadingStatus,
  showloadTimeoutStatus,
  showLoadErrorStatus,
  showLoadedStatus
}