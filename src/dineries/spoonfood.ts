import { JSDOM } from 'jsdom';
import {
  join,
  map,
  mapObjIndexed,
  mergeAll,
  pipe,
  values,
  zipObj,
 } from 'ramda';

const URL = 'https://www.spoonfood.at/';
const blockSelector = '.collection-item-2.sekundar.w-dyn-item';
const itemSelector = '.paragraph.speisenkarte';
const priceSelector = '.paragraph.preis:not(.spalte):not(.w-dyn-bind-empty)';
const titleSelector = 'h1';

const getValues = (node, selector) => Array.from(node.querySelectorAll(selector), (e: HTMLElement) => e.textContent).filter(e => e !== '');

interface IMenuItem {
  [key: string]: string;
}

interface IMenu {
  [key: string]: IMenuItem;
}

const handleItem = pipe(
  mapObjIndexed((v, k) => `🥄 ${k} 💰 ${v}`),
  values,
  join('\n'),
);
const formatMenu = pipe(
  mapObjIndexed((v, k) => `\n 🍜 **${k}**\n\n${handleItem(v)}`),
  values,
  join('\n'),
);

export default function getSpoon(): Promise<string> {
  return JSDOM.fromURL(URL, { pretendToBeVisual: true })
    .then(({ window }: { window: Window }): IMenu => {
      return mergeAll(Array.from(window.document.querySelectorAll(blockSelector), (node: HTMLDivElement) => {
        const title = node.querySelector(titleSelector).innerHTML;
        const items = getValues(node, itemSelector);
        const prices = getValues(node, priceSelector);

        return {
          [title]: zipObj(items, prices),
        };
      }));
    })
    .then(formatMenu);
}
