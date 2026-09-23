# Workflows do GitHub Actions (.github/workflows)

## Responsabilidade do Diretório
Armazena as definições declarativas em YAML dos fluxos de trabalho de integração e entrega contínua do projeto.

## Arquitetura Interna
- `ci.yml`: Pipeline principal acionado em commits e pull requests. Executa jobs paralelos de verificação estática (lint, types, validação de shell scripts, conformidade de diretórios e políticas de código), suíte completa de testes com Vitest, simulação de seed curricular e build de produção Next.js.
