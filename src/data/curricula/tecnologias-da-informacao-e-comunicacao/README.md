# Tecnologias da Informação e Comunicação - Campus Araranguá

## Responsabilidade do Diretório
Armazena a matriz curricular oficial da graduação em Tecnologias da Informação e Comunicação da Universidade Federal de Santa Catarina (Campus Araranguá), correspondente à Matriz 2017.1.

## Arquitetura
- `curriculum.json`: Estrutura canônica tipada conforme `CurriculumData` gerada a partir dos relatórios oficiais do CAGR.
- `index.ts`: Exportação do currículo validado em tempo de execução via `assertValidCurriculum`.
