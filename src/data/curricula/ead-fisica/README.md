# EaD - Física - Campus Florianópolis (Educação a Distância)

## Responsabilidade do Diretório
Armazena a matriz curricular oficial da graduação em EaD - Física da Universidade Federal de Santa Catarina (Campus Florianópolis (Educação a Distância)), correspondente à Matriz 2017.1.

## Arquitetura
- `curriculum.json`: Estrutura canônica tipada conforme `CurriculumData` gerada a partir dos relatórios oficiais do CAGR.
- `index.ts`: Exportação do currículo validado em tempo de execução via `assertValidCurriculum`.
