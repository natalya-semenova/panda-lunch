import fs from 'fs';
import path from 'path';

interface IOnSaveMessages {
  ok: string;
  error: string;
}

export default function saveToFile(data: any, file: string, absolutePath: boolean = false, messages?: IOnSaveMessages) {
  let fileName = file;

  if (!absolutePath) {
    fileName = path.join(__dirname, fileName);
  }

  fs.writeFile(fileName, data, (error) => {
    if (error) {
      console.error(messages ? `messages.error\t${error}` : `Saving file ${fileName} failed:\t${error}`);
    } else {
      console.error(messages ? 'messages.ok\t${error}' : `Saving file ${fileName} succeeded 😊`);
    }
  });
}
