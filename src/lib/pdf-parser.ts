export async function extractTextFromPdf(fileBuffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
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

    interface PositionedItem {
      str: string;
      x: number;
      y: number;
    }

    const rawItems: PositionedItem[] = [];
    for (const item of content.items) {
      if ("str" in item && typeof item.str === "string" && item.str.length > 0) {
        rawItems.push({
          str: item.str,
          x: item.transform[4],
          y: item.transform[5],
        });
      }
    }

    rawItems.sort((firstItem, secondItem) => secondItem.y - firstItem.y);

    const rows: PositionedItem[][] = [];
    let currentRow: PositionedItem[] = [];
    let currentY: number | null = null;

    for (const item of rawItems) {
      if (currentY === null) {
        currentRow.push(item);
        currentY = item.y;
      } else if (Math.abs(item.y - currentY) <= 3.5) {
        currentRow.push(item);
      } else {
        rows.push(currentRow);
        currentRow = [item];
        currentY = item.y;
      }
    }
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    const lines = rows
      .map((row) => {
        row.sort((firstItem, secondItem) => firstItem.x - secondItem.x);
        return row
          .map((item) => item.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
      })
      .filter((line) => line.length > 0);

    pageTexts.push(lines.join("\n"));
  }

  return pageTexts.join("\n\n");
}
