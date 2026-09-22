# Agronomia - Campus Curitibanos

## Responsabilidade do Diretório
Armazena a matriz curricular oficial da graduação em Agronomia da Universidade Federal de Santa Catarina (Campus Curitibanos), correspondente à Matriz 2021.2.

## Arquitetura
- `curriculum.json`: Estrutura canônica tipada conforme `CurriculumData` gerada a partir dos relatórios oficiais do CAGR.
- `index.ts`: Exportação do currículo validado em tempo de execução via `assertValidCurriculum`.
