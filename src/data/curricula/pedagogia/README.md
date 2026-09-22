# Pedagogia - Campus Florianópolis

## Responsabilidade do Diretório
Armazena a matriz curricular oficial da graduação em Pedagogia da Universidade Federal de Santa Catarina (Campus Florianópolis), correspondente à Matriz 2009.1.

## Arquitetura
- `curriculum.json`: Estrutura canônica tipada conforme `CurriculumData` gerada a partir dos relatórios oficiais do CAGR.
- `index.ts`: Exportação do currículo validado em tempo de execução via `assertValidCurriculum`.
