/** Removes console logs when loaded locally.
 * This does not affect the host page, because content
 * scripts are isolated.
 */
const DEV_MODE = !chrome.runtime.getManifest().update_url;
if (!DEV_MODE) {
  for (const key in console) {
    console[key] = () => {};
  }
}

console.log('hello world');
