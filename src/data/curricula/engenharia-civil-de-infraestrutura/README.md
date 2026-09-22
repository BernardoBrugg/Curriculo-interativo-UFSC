# Engenharia Civil de Infraestrutura - Campus Joinville

## Responsabilidade do Diretório
Armazena a matriz curricular oficial da graduação em Engenharia Civil de Infraestrutura da Universidade Federal de Santa Catarina (Campus Joinville), correspondente à Matriz 2025.1.

## Arquitetura
- `curriculum.json`: Estrutura canônica tipada conforme `CurriculumData` gerada a partir dos relatórios oficiais do CAGR.
- `index.ts`: Exportação do currículo validado em tempo de execução via `assertValidCurriculum`.
