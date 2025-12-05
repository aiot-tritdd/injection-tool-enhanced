var domainMap,
  isChrome = isChrome || !browser,
  browser = browser || chrome,
  config = config || { domainInject: [], isEnable: !1 },
  jsPath = '';
function loadConfig(cfg) {
  cfg.config &&
    ((config = cfg.config),
    (domainMap = new Map()),
    [...config.domainInject].forEach((domainTag) => {
      domainMap.set(domainTag.domain, domainTag.jsPath);
    }));
}
function onError(err) {
  console.log(`Error: ${err}`);
}
function initializeInject() {
  (console.log('Run init - initializeInject'), isChrome)
    ? browser.storage.local.get('config', (cfg) => {
        loadConfig(cfg),
          (jsPath = [...config.domainInject].filter(a => a.domain == document.location.host).map(a => a.jsPath).join(';')/*domainMap.get(document.location.host)*/),
          injectCode(chrome.runtime.getURL('/load.js'));
      })
    : browser.storage.local.get('config').then((cfg) => {
        loadConfig(cfg),
          (jsPath = [...config.domainInject].filter(a => a.domain == document.location.host).map(a => a.jsPath).join(';')/*domainMap.get(document.location.host)*/),
          injectCode(chrome.runtime.getURL('/load.js'));
      }, onError);
}
const nullthrows = (e) => {
  if (null == e) throw new Error('it\'s a null');
  return e;
};
function injectCode(jspath) {
  if (!jsPath) return;
  let scrElement = document.createElement('script');
  scrElement.setAttribute('charset', 'UTF-8');
  (scrElement.src = jspath),
    config.isEnable && scrElement.setAttribute('jsPath', jsPath),
    (scrElement.onload = function () {
      console.log('script injected'), this.remove();
    }),
    nullthrows(document.head || document.documentElement).appendChild(scrElement);
}

browser && browser.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.type) {
      case 'getDomain':
        browser.storage.local.set({
          currDomain: window.location.host,
        });
      break;
    }
  }
);

initializeInject();
