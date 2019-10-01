import {
  endOfWeek,
  startOfWeek,
} from 'date-fns';
import {
  format,
  getWeek,
  getYear,
} from 'date-fns/fp';

import urlPdfToPng from '@/helpers/url-pdf-to-png';

const menuDraft = o =>
  `http://www.albatros-catering.at/wp-content/uploads/${o.year}/${o.month}/Wochenspeiseplan-WO-${o.week}-von-${o.start}-bis-${o.end}.pdf`;

const formatDate = format('dd.MM.yyyy');
const formatMonth = format('MM');

export default function getSky() {
  const date = new Date();
  const week = getWeek(date);
  const weekStart = startOfWeek(date, {weekStartsOn: 1});
  const start = formatDate(weekStart);
  const end = formatDate(endOfWeek(date, {weekStartsOn: 6}));

  return urlPdfToPng(menuDraft({
    year: getYear(weekStart),
    month: formatMonth(weekStart),
    start,
    end,
    week,
  }), 'skylunch.png');
}
