export type StyleKey = keyof CSSStyleDeclaration;
export type StyleChanges = Partial<Record<StyleKey, string>>;

export function applyStyleChanges(
  element: HTMLElement,
  styleChanges: StyleChanges,
) {
  for (const key in styleChanges) {
    element.style[key] = styleChanges[key];
  }
}

const defaultChanges = {
  // display = 'none'
  opacity: '0.3',
  filter: 'blur(1px) grayscale(70%)',
};

const KEY = 'styleChanges';
export async function getStyleChanges() {
  const resp = await chrome.storage.sync.get(KEY);
  const changes = resp[KEY];
  return changes ?? defaultChanges;
}

export async function setStyleChanges(styleChanges: StyleChanges) {
  await chrome.storage.sync.set({ [KEY]: styleChanges });
}
