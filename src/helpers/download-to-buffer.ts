import fetch from 'node-fetch';


const downloadToBuffer = (url: string): Promise<Buffer> => {
  return fetch(url)
    .then((res) => res.buffer());
};

export default downloadToBuffer;
