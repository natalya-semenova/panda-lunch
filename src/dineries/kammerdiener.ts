import { JSDOM } from 'jsdom';

import downloadToBuffer from '@/helpers/download-to-buffer';


const URL = 'https://kammerdiener.wien/speisekarte/';
const menuSelector = 'img[title^="speisekarte"]';

export default function getKammerdiener() {
  return JSDOM.fromURL(URL)
    .then(({ window }) => Array.from(
        window.document.querySelectorAll(menuSelector),
        (item: HTMLImageElement) => item.src,
      ).map(downloadToBuffer),
    )
    .then(p => Promise.all(p));
}
