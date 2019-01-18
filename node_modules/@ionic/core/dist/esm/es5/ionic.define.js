
// Ionic: Custom Elements Define Library, ES Module/es5 Target

import { defineCustomElement } from './ionic.core.js';
import { COMPONENTS } from './ionic.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, COMPONENTS, opts);
}
