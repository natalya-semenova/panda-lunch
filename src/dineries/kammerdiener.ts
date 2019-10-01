import { JSDOM } from 'jsdom';

import downloadAndSave from '@/helpers/download-and-save';


const URL = 'https://kammerdiener.wien/speisekarte/';
const menuSelector = 'img[title^="speisekarte"]';

export default function getKammerdiener() {
  return JSDOM.fromURL(URL)
    .then(({ window }) => Array.from(
        window.document.querySelectorAll(menuSelector),
        (item: HTMLImageElement) => item.src,
      ).map((e, idx) => downloadAndSave(`kammerdiener-${idx}.png`, e)),
    )
    .then(p => Promise.all(p));
}
