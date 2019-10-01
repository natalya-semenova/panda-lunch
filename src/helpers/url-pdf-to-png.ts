import { createCanvas } from 'canvas';
import pdfjsLib from 'pdfjs-dist';
import saveToFile from './save-to-file';

interface ICanvasAndContext {
  canvas: any;
  context: any;
}

class NodeCanvasFactory {
  public create(width: number, height: number): ICanvasAndContext {
    const canvas = createCanvas(width, height);

    return {
      canvas,
      context: canvas.getContext('2d'),
    };
  }

  public reset(canvasAndContext: ICanvasAndContext, width: number, height: number): void {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  public destroy(canvasAndContext: ICanvasAndContext): void {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

export default function savePng(url: string, pngFile: string) {
  console.log('url', url);

  return pdfjsLib.getDocument(url).promise.then((pdfDocument) => {
    pdfDocument.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvasFactory = new NodeCanvasFactory();
      const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
      const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport,
        canvasFactory,
      };

      page.render(renderContext).promise.then(() => {
        const image = canvasAndContext.canvas.toBuffer();
        saveToFile(image, pngFile);
      });
    });
  });
}
