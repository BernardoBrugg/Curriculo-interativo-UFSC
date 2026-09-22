# Engenharia Quimica - Campus Florianópolis

## Responsabilidade do Diretório
Armazena a matriz curricular oficial da graduação em Engenharia Quimica da Universidade Federal de Santa Catarina (Campus Florianópolis), correspondente à Matriz 1991.1.

## Arquitetura
- `curriculum.json`: Estrutura canônica tipada conforme `CurriculumData` gerada a partir dos relatórios oficiais do CAGR.
- `index.ts`: Exportação do currículo validado em tempo de execução via `assertValidCurriculum`.
