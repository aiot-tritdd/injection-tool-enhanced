var isChrome = !browser,
  browser = browser || chrome,
  currDomain = currDomain || '',
  config = config || {
    domainInject: [],
    isEnable: !1,
    disablePRD: !1,
    disableGPRD: !1,
    disableSandbox: !1,
    disableGSandbox: !1,
  };

const resourceTypes = [
  'csp_report',
  'font',
  'image',
  'main_frame',
  'media',
  'object',
  'other',
  'ping',
  'script',
  'stylesheet',
  'sub_frame',
  'webbundle',
  'websocket',
  'webtransport',
  'xmlhttprequest',
];
const applyBlockSettings = () => {
  try {
    browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3, 4, 5, 6, 7],
    });
  } catch(e) {
    console.log(e);
  }
  config.isEnable &&
    browser.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 2,
          priority: 1,
          action: {type: config.disablePRD ? 'block' : 'allow'},
          condition: {
            urlFilter: '*connect.buyee.jp/*/main.js*',
            resourceTypes,
          },
        },
        {
          id: 3,
          priority: 2,
          action: {type: config.disablePRD ? 'block' : 'allow'},
          condition: {
            urlFilter: '*connect.myeeglobal.com/*/main.js*',
            resourceTypes,
          },
        },
      ],
      removeRuleIds: [2, 3],
    });

  config.isEnable &&
    browser.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 6,
          priority: 5,
          action: {type: config.disableGPRD ? 'block' : 'allow'},
          condition: {
            urlFilter: '*connect.gdxtag.com/*/main.js*',
            resourceTypes: resourceTypes,
          },
        },
      ],
      removeRuleIds: [6],
    });

  config.isEnable &&
    browser.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 4,
          priority: 3,
          action: {type: config.disableSandbox ? 'block' : 'allow'},
          condition: {
            urlFilter: '*connect.stg.buyee.jp/sandbox/*/main.js*',
            resourceTypes,
          },
        },
        {
          id: 5,
          priority: 4,
          action: {type: config.disableSandbox ? 'block' : 'allow'},
          condition: {
            urlFilter: '*connect.stg.myeeglobal.com/sandbox/*/main.js*',
            resourceTypes,
          },
        },
      ],
      removeRuleIds: [4, 5],
    });
  config.isEnable &&
    browser.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 7,
          priority: 6,
          action: {type: config.disableGSandbox ? 'block' : 'allow'},
          condition: {
            urlFilter: '*connect.stg.gdxtag.com/sandbox/*/main.js*',
            resourceTypes,
          },
        },
      ],
      removeRuleIds: [7],
    });
};
function setLabelStatus(status) {
  status
    ? $('#lbStatus')
      .text('◾️ Finish')
      .parent()
      .removeClass('btn-success')
      .addClass('btn-danger')
    : $('#lbStatus')
      .text('▶️ Start')
      .parent()
      .removeClass('btn-danger')
      .addClass('btn-success');
}
function getDomainTag() {
  var domainTag = {
    domain: $('#txtDomain').val(),
    jsPath: $('#txtJSPath').val(),
  };
  $('#txtDomain').val(''),
    $('#txtJSPath').val(''),
    showUrlSection('new', domainTag);
}
function showUrlSection(type, domainTag) {
  const section =
    '<div id="' +
    type +
    '" class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><span class="domainUrl">' +
    domainTag.domain +
    '</span><br><span class="jspath">' +
    domainTag.jsPath +
    '</span></div>';
  $('.list-domain .mCSB_container').prepend(section),
    $(section).on('click', function () {
      alert(section), window.close();
    });
}

function initPopup(conf) {
  console.log('Init popup'),
    $('#chkStatus').prop('checked', conf.isEnable),
    setLabelStatus(conf.isEnable),
    $('.list-domain .mCSB_container').html('');
  for(let domain = conf.domainInject, idx = domain.length - 1; idx >= 0; idx--)
    showUrlSection('index', domain[idx]);
  $('#disablePRD').prop('checked', conf.disablePRD);
  $('#disableGPRD').prop('checked', conf.disableGPRD);
  $('#disableSandbox').prop('checked', conf.disableSandbox);
  $('#disableGSandbox').prop('checked', conf.disableGSandbox);
}
function onError(err) {
  console.log(`Error: ${err}`);
}
function initialize() {
  (console.log('Run init - initialize popup.js'), isChrome)
    ? browser.storage.local.get(['config', 'currDomain', 'theme'], (storage) => {
      loadConfig(storage);
      loadTheme(storage.theme || 'spring');
    })
    : browser.storage.local.get(['config', 'currDomain', 'theme']).then((storage) => {
      loadConfig(storage);
      loadTheme(storage.theme || 'spring');
    }, onError);
}
function loadConfig(storage) {
  if(!storage.config) return;
  config = storage.config;
  currDomain = storage.currDomain;
  initPopup(config);
}

function saveRule(closeWindow = false) {
  $('#chkStatus').is(':checked');
  var rules = [];
  let jspath = $('.jspath');
  $('.domainUrl').each(function (domainUrl) {
    rules.push({domain: $(this).text(), jsPath: $(jspath[domainUrl]).text()});
  }),
    console.log(rules),
    (config.domainInject = rules),
    browser.storage.local.set({config}),
    closeWindow && window.close();
}

browser.tabs.query({currentWindow: true, active: true}, function (tabs) {
  if (tabs[0] && tabs[0].url && !tabs[0].url.startsWith('chrome://')) {
    try {
      const url = new URL(tabs[0].url);
      currDomain = url.hostname;
      // Pre-fill if empty
      const $domainInput = $('#txtDomain');
      if (!$domainInput.val()) {
        $domainInput.val(currDomain);
      }
    } catch (e) {
      console.error('Invalid URL:', tabs[0].url);
    }
  }
});

// Theme Management Functions
const themeIcons = {
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
  spring: '🌸',
  christmas: '🎄'
};

function loadTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  const icon = themeIcons[themeName] || '🌸';
  $('.theme-icon').text(icon);
}

function saveTheme(themeName) {
  browser.storage.local.set({ theme: themeName });
  loadTheme(themeName);
}

// Function to display scraped items from Local Storage
function displayScrapedItems() {
  browser.tabs.query({active: true, currentWindow: true}, function (tabs) {
    if(!tabs[0]) {
      showError('No active tab found');
      return;
    }

    // Execute script in the page to get bc_items from localStorage
    browser.scripting.executeScript(
      {
        target: {tabId: tabs[0].id},
        func: function () {
          try {
            const bcItems = localStorage.getItem('bc_items');
            return bcItems ? JSON.parse(bcItems) : null;
          } catch(e) {
            return {error: e.message};
          }
        },
      },
      function (results) {
        if(browser.runtime.lastError) {
          showError(
            'Error accessing page: ' + browser.runtime.lastError.message
          );
          return;
        }

        if(!results || !results[0]) {
          showError('Could not retrieve data from page');
          return;
        }

        const data = results[0].result;

        if(data && data.error) {
          showError('Error reading localStorage: ' + data.error);
          return;
        }

        renderScrapedItems(data);
      }
    );
  });
}

function showError(message) {
  const container = $('#scrapedItemsContainer');
  const list = $('#scrapedItemsList');

  container.show();
  list.html('<div class="scraped-items-error">' + message + '</div>');
  $('#itemCount').text('0');
}

function renderScrapedItems(items) {
  const container = $('#scrapedItemsContainer');
  const list = $('#scrapedItemsList');

  container.show();

  if(!items) {
    list.html(
      '<div class="no-items-message">No scraped items found in bc_items</div>'
    );
    $('#itemCount').text('0');
    return;
  }

  let itemsArray;
  if(Array.isArray(items)) {
    // If it's already an array
    itemsArray = items;
  } else if(typeof items === 'object') {
    // If it's an object, convert to array
    itemsArray = Object.values(items);
  } else {
    list.html(
      '<div class="no-items-message">Invalid data format for scraped items</div>'
    );
    $('#itemCount').text('0');
    return;
  }

  if(itemsArray.length === 0) {
    list.html(
      '<div class="no-items-message">No scraped items found in bc_items</div>'
    );
    $('#itemCount').text('0');
    return;
  }

  $('#itemCount').text(itemsArray.length);

  let html = '';
  itemsArray.forEach(function (item, index) {
    html += '<div class="scraped-item">';
    html += '  <div class="scraped-item-header">';

    // Image
    if(item.image) {
      html +=
        '    <img src="' +
        item.image +
        '" class="scraped-item-image" onerror="this.style.display=\'none\'">';
    } else {
      html += '    <div class="scraped-item-image"></div>';
    }

    html += '    <div class="scraped-item-main">';
    html +=
      '      <div class="scraped-item-title">' +
      (item.title || 'Untitled') +
      '</div>';
    html +=
      '      <div class="scraped-item-price">¥' +
      (item.price || '0') +
      '</div>';
    html += '    </div>';
    html += '  </div>';

    // Description
    if(item.description && item.description.trim()) {
      html += '  <div style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 12px; line-height: 1.4; color: #495057;">';
      html += '    ' + item.description.substring(0, 150);
      if(item.description.length > 150) html += '...';
      html += '  </div>';
    }

    // Details Grid
    html += '  <div class="scraped-item-details">';
    html += '    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">';

    // Seller info
    if(item.seller) {
      html += '      <div class="scraped-item-details-row"><strong>Seller:</strong> ' + item.seller + '</div>';
    }
    if(item.seller_id !== undefined) {
      html += '      <div class="scraped-item-details-row"><strong>Seller ID:</strong> ' + item.seller_id + '</div>';
    }

    // Stock status
    if(item.has_stock !== undefined) {
      const stockText = item.has_stock ? '<span style="color: #28a745;">✓ In Stock</span>' : '<span style="color: #dc3545;">✗ Out of Stock</span>';
      html += '      <div class="scraped-item-details-row"><strong>Stock:</strong> ' + stockText + '</div>';
    }
    if(item.is_limited !== undefined) {
      const limitedText = item.is_limited ? '<span style="color: #dc3545;">⚠ Yes</span>' : 'No';
      html += '      <div class="scraped-item-details-row"><strong>Limited:</strong> ' + limitedText + '</div>';
    }

    // Quantity info
    if(item.quantity) {
      html += '      <div class="scraped-item-details-row"><strong>Quantity:</strong> ' + item.quantity + '</div>';
    }
    if('max_quantity' in item) {
      html += '      <div class="scraped-item-details-row"><strong>Max Qty:</strong> ' + item.max_quantity + '</div>';
    }

    // Code and service
    if(item.code) {
      html += '      <div class="scraped-item-details-row"><strong>Code:</strong> ' + item.code + '</div>';
    }
    if(item.service_type) {
      html += '      <div class="scraped-item-details-row"><strong>Service:</strong> ' + item.service_type + '</div>';
    }

    // Other fields
    if(item.has_option_stock !== undefined) {
      html += '      <div class="scraped-item-details-row"><strong>Has Options:</strong> ' + (item.has_option_stock ? 'Yes' : 'No') + '</div>';
    }
    if(item.unavailable !== undefined) {
      html += '      <div class="scraped-item-details-row"><strong>Available:</strong> ' + (item.unavailable === "0" ? 'Yes' : 'No') + '</div>';
    }
    if(item.category_ids && item.category_ids.length > 0) {
      html += '      <div class="scraped-item-details-row" style="grid-column: 1 / -1;"><strong>Categories:</strong> ' + item.category_ids.join(', ') + '</div>';
    }

    // Image link (full width)
    if(item.image) {
      html += '      <div class="scraped-item-details-row" style="grid-column: 1 / -1;"><strong>Image:</strong> <a href="' + item.image + '" class="scraped-item-url" target="_blank" style="word-break: break-all;">' + item.image + '</a></div>';
    }

    html += '    </div>';

    // Variations (Collapsible)
    if(item.variations && item.variations.length > 0) {
      html += '    <div class="variations-section" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e9ecef;">';
      html += '      <div class="variations-toggle" data-index="' + index + '" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: #f8f9fa; border-radius: 4px; font-weight: 600; user-select: none;">';
      html += '        <span><span class="toggle-icon" style="display: inline-block; width: 12px;">▶</span> Variations (' + item.variations.length + ')</span>';
      html += '      </div>';
      html += '      <div class="variations-content" style="display: none; margin-top: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; max-height: 220px; overflow-y: auto;">';

      item.variations.forEach(function (variation, vIndex) {
        html += '        <div style="padding: 6px 8px; margin-bottom: 4px; background: white; border-radius: 4px; display: flex; gap: 8px; font-size: 13px;">';
        html += '          <strong style="color: #495057; min-width: 60px;">' + (variation.key || 'Key') + ':</strong>';
        html += '          <span style="color: #212529;">' + (variation.value || 'N/A') + '</span>';
        html += '        </div>';
      });

      html += '      </div>';
      html += '    </div>';
    }

    // URL (full width at bottom)
    if(item.url) {
      html += '    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e9ecef;">';
      html += '      <strong>URL:</strong> <a href="' + item.url + '" class="scraped-item-url" target="_blank">' + item.url + '</a>';
      html += '    </div>';
    }

    html += '  </div>';
    html += '</div>';
  });

  list.html(html);

  // Attach click handlers to variation toggles (after HTML is inserted)
  $('.variations-toggle').on('click', function() {
    const $toggle = $(this);
    const $content = $toggle.next('.variations-content');
    const $icon = $toggle.find('.toggle-icon');

    // Toggle visibility
    if ($content.is(':visible')) {
      $content.slideUp(200);
      $icon.text('▶');
    } else {
      $content.slideDown(200);
      $icon.text('▼');
    }
  });
}

// Function to clear scraped items from Local Storage
function clearScrapedStorage() {
  if (!confirm('Are you sure you want to clear bc_items from Local Storage?')) {
    return;
  }

  browser.tabs.query({active: true, currentWindow: true}, function (tabs) {
    if(!tabs[0]) {
      alert('No active tab found');
      return;
    }

    // Execute script in the page to remove bc_items from localStorage
    browser.scripting.executeScript(
      {
        target: {tabId: tabs[0].id},
        func: function () {
          try {
            localStorage.removeItem('bc_items');
            return {success: true};
          } catch(e) {
            return {error: e.message};
          }
        },
      },
      function (results) {
        if(browser.runtime.lastError) {
          alert('Error accessing page: ' + browser.runtime.lastError.message);
          return;
        }

        if(!results || !results[0]) {
          alert('Could not clear storage');
          return;
        }

        const data = results[0].result;

        if(data && data.error) {
          alert('Error clearing localStorage: ' + data.error);
          return;
        }

        // Show success message in the list
        const container = $('#scrapedItemsContainer');
        const list = $('#scrapedItemsList');

        container.show();
        list.html('<div class="clear-success-message">✓ Storage cleared successfully!</div>');
        $('#itemCount').text('0');

        // Hide the message after 2 seconds
        setTimeout(function() {
          list.html('<div class="no-items-message">No scraped items found in bc_items</div>');
          setTimeout(function() {
            container.hide();
          }, 500);
        }, 2000);
      }
    );
  });
}

$(function () {
  $('#chkStatus').change(function () {
    var status = $(this).is(':checked');
    setLabelStatus(status),
      (config.isEnable = status),
      browser.storage.local.set({config}),
      applyBlockSettings();
  }),
    $('#disablePRD').change(function () {
      (config.disablePRD = $(this).is(':checked')),
        browser.storage.local.set({config}),
        applyBlockSettings();
    }),
    $('#disableGPRD').change(function () {
      (config.disableGPRD = $(this).is(':checked')),
        browser.storage.local.set({config}),
        applyBlockSettings();
    }),
    $('#disableSandbox').change(function () {
      (config.disableSandbox = $(this).is(':checked')),
        browser.storage.local.set({config}),
        applyBlockSettings();
    }),
    $('#disableGSandbox').change(function () {
      (config.disableGSandbox = $(this).is(':checked')),
        browser.storage.local.set({config}),
        applyBlockSettings();
    }),
    $('#txtDomain')
      .keypress(function (event) {
        13 == event.key && (getDomainTag(), event.preventDefault());
      })
      .focus(function () {
        if(!this.value) this.value = currDomain;
      }),
    $('#btnAdd').on('click', function () {
      getDomainTag();
    }),
    $('#btnReset').on('click', function () {
      if(!confirm('Are you sure to clear inject list?')) return;
      (config = {domainInject: [], isEnable: !0}),
        browser.storage.local.set({config}),
        initPopup(config);
    }),
    $('#btnSave').click(saveRule),
    $('#btnCancel').click(function () {
      initPopup(config), window.close();
    }),
    // Show Scraped Items button handler
    $('#btnShowScrapedItems').on('click', function () {
      displayScrapedItems();
    }),
    // Clear Storage button handler
    $('#btnClearStorage').on('click', function () {
      clearScrapedStorage();
    }),
    // Theme Switcher handlers
    $('#btnThemeSwitcher').on('click', function(e) {
      e.stopPropagation();
      $('#themeDropdown').toggle();
    }),
    $('.theme-option').on('click', function() {
      const theme = $(this).data('theme');
      saveTheme(theme);
      $('#themeDropdown').hide();
    }),
    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.theme-switcher').length) {
        $('#themeDropdown').hide();
      }
    });
}),
  $(window).on('load', function () {
    initialize(),
      $('.list-domain').mCustomScrollbar({
        theme: 'dark',
        scrollbarPosition: 'outside',
      });
  });
