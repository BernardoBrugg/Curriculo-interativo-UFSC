export interface CagrCatalogEntry {
  id: string;
  courseCode: string;
  courseName: string;
  campus: string;
  latestCurriculumCode: string;
  availableCurriculumCodes: string[];
  url: string;
}

interface CagrSession {
  cookieHeader: string;
  viewState: string;
  treeId: string;
}

interface TreeChildNode {
  id: string;
  text: string;
}

const cagrTreeUrl = "https://cagr.sistemas.ufsc.br/arvore.xhtml?treeid=30";
const cagrPostUrl = "https://cagr.sistemas.ufsc.br/arvore.xhtml";
const cagrReportBaseUrl = "https://cagr.sistemas.ufsc.br/relatorios/curriculoCurso";

const existingCourseSlugsByCode: Record<string, string> = {
  "220": "automacao",
  "201": "civil",
  "202": "eletrica",
  "235": "eletronica",
  "233": "materiais",
  "203": "mecanica",
  "237": "producao",
  "216": "quimica",
  "211": "sanitaria",
};

function normalizeString(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanCourseName(rawName: string): string {
  return rawName
    .replace(/^CAMPUS\s+[^,]+,\s*/i, "")
    .replace(/\s*-\s*Bacharelado$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanCampusName(rawCampus: string): string {
  return rawCampus
    .replace(/^Campus Universit[aá]rio\s*/i, "")
    .trim();
}

function generateSlug(rawCourseName: string, campus: string, courseCode: string, assignedSlugs: Set<string>): string {
  const existing = existingCourseSlugsByCode[courseCode];
  if (existing) {
    assignedSlugs.add(existing);
    return existing;
  }

  const cleanedCourse = cleanCourseName(rawCourseName);
  const baseSlug = normalizeString(cleanedCourse);

  if (!assignedSlugs.has(baseSlug)) {
    assignedSlugs.add(baseSlug);
    return baseSlug;
  }

  const campusSuffix = normalizeString(cleanCampusName(campus));
  const compoundSlug = `${baseSlug}-${campusSuffix}`;
  if (!assignedSlugs.has(compoundSlug)) {
    assignedSlugs.add(compoundSlug);
    return compoundSlug;
  }

  const codeSlug = `${compoundSlug}-${courseCode}`;
  assignedSlugs.add(codeSlug);
  return codeSlug;
}

function extractViewState(html: string): string {
  const match = html.match(/id="javax\.faces\.ViewState"\s+value="([^"]+)"/);
  if (!match) throw new Error("ViewState nao encontrado no CAGR");
  return match[1];
}

function extractCookieHeader(response: Response): string {
  const cookieHeaders = response.headers.getSetCookie?.() ?? [response.headers.get("set-cookie") ?? ""];
  const cookieMap = new Map<string, string>();
  for (const header of cookieHeaders) {
    const [pair] = header.split(";");
    const [key, value] = pair.split("=");
    if (key && value) cookieMap.set(key.trim(), value.trim());
  }
  return Array.from(cookieMap.entries()).map(([k, v]) => `${k}=${v}`).join("; ");
}

async function establishSession(): Promise<{ session: CagrSession; rootHtml: string }> {
  const response = await fetch(cagrTreeUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });
  if (!response.ok) throw new Error(`Falha ao conectar no CAGR: ${response.status}`);
  const rootHtml = await response.text();
  const session: CagrSession = {
    cookieHeader: extractCookieHeader(response),
    viewState: extractViewState(rootHtml),
    treeId: "30",
  };
  return { session, rootHtml };
}

async function expandNode(session: CagrSession, nodeActionParam: string): Promise<string> {
  const body = new URLSearchParams({
    form: "form",
    treeid: session.treeId,
    [nodeActionParam]: nodeActionParam,
    "form:arvore:input": "",
    "javax.faces.ViewState": session.viewState,
    AJAXREQUEST: "_viewRoot",
  });

  const response = await fetch(cagrPostUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Faces-Request": "partial/ajax",
      Cookie: session.cookieHeader,
      "User-Agent": "Mozilla/5.0",
    },
    body: body.toString(),
  });

  if (!response.ok) throw new Error(`Falha ao expandir no ${nodeActionParam}: ${response.status}`);
  return response.text();
}

function parseCampusNodes(html: string): TreeChildNode[] {
  const campusNodes: TreeChildNode[] = [];
  const regex = /id="(form:arvore:arvore[^":]+::lazyTreeNode)"[^>]*>.*?id="\1:text"[^>]*>\s*([^<]+)</gs;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const rawId = match[1];
    const text = match[2].trim();
    if (text.toLowerCase().includes("campus")) {
      campusNodes.push({
        id: rawId.replace("::lazyTreeNode", "::j_id84").replace(/\\x2D/g, "-"),
        text,
      });
    }
  }
  return campusNodes;
}

function parseCourseNodes(xml: string): TreeChildNode[] {
  const courseNodes: TreeChildNode[] = [];
  const regex = /id="(form:arvore:[^":]+:arvore[^":]+::lazyTreeNode)"[^>]*>.*?id="\1:text"[^>]*>\s*([^<]+)</gs;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    const rawId = match[1];
    const text = match[2].trim();
    if (!text.toLowerCase().includes("campus universitário")) {
      courseNodes.push({
        id: rawId.replace("::lazyTreeNode", "::j_id84").replace(/\\x2D/g, "-"),
        text,
      });
    }
  }
  return courseNodes;
}

function parseCurriculaForNode(xml: string, nodeActionParam: string): { courseCode: string; curriculumCodes: string[] } | null {
  const baseId = nodeActionParam.replace("::j_id84", "");
  const startIndex = xml.indexOf(baseId);
  if (startIndex < 0) return null;

  let endIndex = xml.length;
  const nextNodeRegex = /<table[^>]+class="rich-tree-node"[^>]+id="([^"]+)"/g;
  nextNodeRegex.lastIndex = startIndex + 20;
  let match: RegExpExecArray | null;
  while ((match = nextNodeRegex.exec(xml)) !== null) {
    if (!match[1].startsWith(`${baseId}:`)) {
      endIndex = match.index;
      break;
    }
  }

  const section = xml.slice(startIndex, endIndex);
  const curriculaMap = new Map<string, Set<string>>();
  for (const item of section.matchAll(/relatorios\/curriculoCurso\?curso=(\d+)&amp;curriculo=(\d+)/g)) {
    const courseCode = item[1];
    const curriculumCode = item[2];
    const set = curriculaMap.get(courseCode) ?? new Set<string>();
    set.add(curriculumCode);
    curriculaMap.set(courseCode, set);
  }

  if (curriculaMap.size === 0) return null;
  const [courseCode, set] = Array.from(curriculaMap.entries())[0];
  const curriculumCodes = Array.from(set).sort((a, b) => Number(b) - Number(a));
  return { courseCode, curriculumCodes };
}

export async function crawlCagrCatalog(): Promise<CagrCatalogEntry[]> {
  const initial = await establishSession();
  const campusCount = parseCampusNodes(initial.rootHtml).length;
  const catalog: CagrCatalogEntry[] = [];
  const assignedSlugs = new Set<string>();
  const processedCourses = new Set<string>();

  for (let campusIndex = 0; campusIndex < campusCount; campusIndex += 1) {
    const { session, rootHtml } = await establishSession();
    const campusNodes = parseCampusNodes(rootHtml);
    const campus = campusNodes[campusIndex];
    if (!campus) continue;

    process.stdout.write(`\nRastreando ${campus.text}...\n`);
    const campusXml = await expandNode(session, campus.id);
    const courseNodes = parseCourseNodes(campusXml);

    for (const courseNode of courseNodes) {
      const courseXml = await expandNode(session, courseNode.id);
      const parsedCurricula = parseCurriculaForNode(courseXml, courseNode.id);
      if (!parsedCurricula) continue;

      const { courseCode, curriculumCodes } = parsedCurricula;
      const deduplicationKey = `${courseCode}-${campus.text}`;
      if (processedCourses.has(deduplicationKey)) continue;
      processedCourses.add(deduplicationKey);

      const latestCurriculumCode = curriculumCodes[0];
      const courseName = cleanCourseName(courseNode.text);
      const id = generateSlug(courseName, campus.text, courseCode, assignedSlugs);

      catalog.push({
        id,
        courseCode,
        courseName,
        campus: cleanCampusName(campus.text),
        latestCurriculumCode,
        availableCurriculumCodes: curriculumCodes,
        url: `${cagrReportBaseUrl}?curso=${courseCode}&curriculo=${latestCurriculumCode}`,
      });
      process.stdout.write(`  + [${courseCode}] ${courseName} (Matriz ${latestCurriculumCode})\n`);
    }
  }

  return catalog.sort((a, b) => a.courseName.localeCompare(b.courseName, "pt-BR"));
}
