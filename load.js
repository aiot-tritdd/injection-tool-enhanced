'use strict';
function initializeLoad() {
  if (
    (console.log('Run init - load.js'), document.currentScript.getAttribute('jsPath'))
  ) {
    document.currentScript.getAttribute('jsPath').split(';').forEach(path => {
      var scriptElement = document.createElement('script');
      scriptElement.setAttribute('charset', 'UTF-8');

      if (/myeeglobal.com/.test(path)) scriptElement.setAttribute('id', 'mc-script');
      if (/gdxtag.com/.test(path)) scriptElement.setAttribute('id', 'gc-script');
      if (/buyee.jp/.test(path)) scriptElement.setAttribute('id', 'bc-script');

      scriptElement.onerror = function() {
        console.error('[JS-Injection] Failed to load script:', path);
      };

      (scriptElement.src = path),
        console.log('load.js: ', scriptElement.src, scriptElement),
        document.head.appendChild(scriptElement);
    });
  }
}
initializeLoad();
