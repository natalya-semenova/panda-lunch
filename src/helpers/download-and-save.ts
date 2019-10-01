import fetch from 'node-fetch';
import { curry } from 'ramda';
import saveToFile from './save-to-file';

const downloadAndSave = curry((file: string, url: string) => {
  fetch(url)
    .then((res) => res.buffer())
    .then((body) => {
      saveToFile(body, file);

      return file;
    })
    .catch((e) => {
      console.log('Fetching file failed:\t', e);
    });
});

export default downloadAndSave;
