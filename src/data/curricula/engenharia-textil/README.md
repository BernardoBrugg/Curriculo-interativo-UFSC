# Engenharia Têxtil - Campus Blumenau

## Responsabilidade do Diretório
Armazena a matriz curricular oficial da graduação em Engenharia Têxtil da Universidade Federal de Santa Catarina (Campus Blumenau), correspondente à Matriz 2021.1.

## Arquitetura
- `curriculum.json`: Estrutura canônica tipada conforme `CurriculumData` gerada a partir dos relatórios oficiais do CAGR.
- `index.ts`: Exportação do currículo validado em tempo de execução via `assertValidCurriculum`.
