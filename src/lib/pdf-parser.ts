export async function extractTextFromPdf(fileBuffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(fileBuffer),
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdf = await loadingTask.promise;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    let lastY: number | null = null;
    let pageString = "";

    for (const item of content.items) {
      if ("str" in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageString += "\n";
        } else if (pageString.length > 0 && !pageString.endsWith("\n") && !pageString.endsWith(" ")) {
          pageString += " ";
        }
        pageString += item.str;
        lastY = item.transform[5];
      }
    }
    pageTexts.push(pageString);
  }

  return pageTexts.join("\n\n");
}
