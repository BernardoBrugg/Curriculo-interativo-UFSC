# Testes de Scripts de Automação (tests/scripts)

## Responsabilidade do Diretório
Valida as rotinas de automação, pipelines de ingestão de dados curriculares e seed no banco de dados.

## Arquitetura Interna
- `cagr-curriculum-parser.test.ts`: Testa o parser de páginas de currículo do CAGR, incluindo divisão de fases e extração de pré-requisitos.
- `curricula-seed.test.ts`: Valida a orquestração do script de seed com suporte a dry-run e geração de backups.

## Execução
```bash
npm test tests/scripts
```
