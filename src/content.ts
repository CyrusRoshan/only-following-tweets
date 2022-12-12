import { getStyleChanges } from './stylechanges';

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

const observer = new MutationObserver((mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type !== 'childList') {
      console.log(`Mutation of type ${mutation.type}, skipping..`);
      continue;
    }

    for (const node of mutation.addedNodes) {
      if (!(node instanceof Element)) {
        continue;
      }
      const dataId = node.getAttribute('data-testid');
      if (dataId === 'cellInnerDiv') {
        hideAllUnfollowedTweets();
        return;
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

let styleChanges = {};
getStyleChanges().then((changes) => {
  styleChanges = changes;
});

const TWEET_SELECTOR = `[data-testid="cellInnerDiv"]`;
const SOCIAL_CONTEXT_SELECTOR = `[data-testid="socialContext"]`; // the reason a tweet was shown in timeline, i.e.: you weren't following the tweeter.

function hideAllUnfollowedTweets() {
  const notFollowedTweetContexts = [
    ...document.querySelectorAll(
      `${TWEET_SELECTOR} ${SOCIAL_CONTEXT_SELECTOR}`,
    ),
  ];

  notFollowedTweetContexts.map((tweetContext) => {
    const tweet = tweetContext.closest(TWEET_SELECTOR) as HTMLElement;

    for (const key in styleChanges) {
      tweet.style[key] = styleChanges[key];
    }
    console.log('Hid not-followed tweet', tweet);
  });
}
