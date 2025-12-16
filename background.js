const storageCache = {},
  initStorageCache = getAllStorageSyncData().then((e) => {
    Object.assign(storageCache, e);
  });
function getAllStorageSyncData() {
  return new Promise((e, t) => {
    chrome.storage.sync.get(null, (a) => {
      if (chrome.runtime.lastError) return t(chrome.runtime.lastError);
      e(a);
    });
  });
}
chrome.action.onClicked.addListener(async (e) => {
  try {
    await initStorageCache;
  } catch (e) {}
}),
  chrome.action.onClicked.addListener(async (e) => {
    try {
      await initStorageCache;
    } catch (e) {}
  }),
  // chrome.webNavigation.onCompleted.addListener(), // DISABLED - was called with no callback
  chrome.storage.onChanged.addListener((e, t) => {
    if ('sync' === t && e.options?.newValue) {
      let t = Boolean(e.options.newValue.debug);
      console.log('enable debug mode?', t), setDebugMode(t);
    }
  });
