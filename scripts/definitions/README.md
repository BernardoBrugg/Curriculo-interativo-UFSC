# Scripts - Módulo de Definições de Currículos (scripts/definitions)

## Responsabilidade do Diretório
Este diretório isola e modulariza as regras de integralização curricular e metadados de cada curso da UFSC utilizado na geração de dados estáticos para o aplicativo.

## Arquitetura Interna
- **`types.ts`**: Contratos de tipos (`CurriculumDefinition`) e funções utilitárias puras para manipulação e filtragem de disciplinas (`courseIdsBetween`, `catalogueSource`, `manualSource`, `requirement`, etc.).
- **`defaults.ts`**: Gerador inteligente de regras padrão baseado na carga horária total e disciplinas obrigatórias para cursos sem regras personalizadas.
- **`ctc-trindade.ts`**: Regras detalhadas das Engenharias e Computação do Campus Florianópolis (Trindade).
- **`joinville.ts`**: Regras das engenharias do Centro Tecnológico de Joinville (CTJ).
- **`blumenau.ts`**: Regras dos cursos de graduação do Campus Blumenau.
- **`ararangua.ts`**: Regras dos cursos de graduação do Campus Araranguá.
- **`curitibanos.ts`**: Regras dos cursos de graduação do Campus Curitibanos.
- **`florianopolis-outros.ts`**: Regras dos cursos dos centros CCS, CSE, CFH, CCE, CCB, CED, CCJ e EaD.
- **`index.ts`**: Ponto único de agregação e resolução de definições curriculares.

## Fluxo de Dados
1. O gerador `scripts/generate-curricula.ts` consulta `getCurriculumDefinition(id, rule)`.
2. Se houver definição especializada, ela é retornada.
3. Caso contrário, `buildDefaultDefinition(rule)` calcula a distribuição automática entre obrigatórias e optativas.
