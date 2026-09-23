# Script Support Libraries (scripts/lib)

## Responsabilidade do Diretório
Contém módulos utilitários e parsers especializados utilizados pelas ferramentas de automação do diretório `scripts/`.

## Módulos
- `cagr-tree-crawler.ts`: Navegador automatizado da estrutura RichFaces/JSF da árvore do CAGR.
- `cagr-curriculum-parser.ts`: Parser de relatórios acadêmicos em formato texto, com suporte a ementas, pré-requisitos, equivalências e horas de extensão.
- `curricula-seed.ts`: Adaptador desacoplado para orquestração de backup e carga atômica de dados no Firestore.
