import { JSDOM } from 'jsdom';

import downloadAndSave from '@/helpers/download-and-save';


const URL = 'https://www.baobar.at/menu';
const menuSelector = 'img[alt="MENU_BAOBAR_AC.jpg"]';

const saveBaobar = downloadAndSave('baobar.png');

export default function getBaobar() {
  return JSDOM.fromURL(URL)
    .then(({ window }) => {
      const { src } = window.document.querySelector(menuSelector);

      return src
        .replace(/w_(\d{3})/, 'w_$10')
        .replace(/h_(\d{2})/, 'h_$10')
        .replace(',blur_2', '');
    })
    .then(saveBaobar);
}
