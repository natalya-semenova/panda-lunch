import { JSDOM } from 'jsdom';

import {
  addDays,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import {
  format,
} from 'date-fns/fp';


const URL = 'http://www.albatros-catering.at/sky-lunch/wochen-speiseplan/';
const menuSelector = 'strong > a';

const formatDate = format('dd.MM.yyyy');
const date = new Date();
const weekStart = startOfDay(startOfWeek(date, {weekStartsOn: 1}));
const start = formatDate(weekStart);
const end = formatDate(addDays(weekStart, 4));


export default function getSky() {
  return JSDOM.fromURL(URL)
    .then(({ window }) => {
      const { href } = window.document.querySelector(menuSelector);

      return {
        href,
        name: `sky-${start}-${end}.pdf`,
      };
    });
}
