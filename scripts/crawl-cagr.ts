import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { crawlCagrCatalog } from "./lib/cagr-tree-crawler";

async function main(): Promise<void> {
  process.stdout.write("Iniciando varredura da arvore do CAGR...\n");
  const catalog = await crawlCagrCatalog();
  const outputPath = resolve(process.cwd(), "data/curricula/catalog.json");
  await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  process.stdout.write(`Catalogados ${catalog.length} cursos com sucesso em: ${outputPath}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
