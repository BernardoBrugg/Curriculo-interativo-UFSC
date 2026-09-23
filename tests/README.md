# Test Suite (tests)

## Responsabilidade do Diretório
Centraliza a suíte automatizada de testes do projeto, contendo testes unitários, testes de componentes React, testes de integração de contratos curriculares e checagens de integridade do repositório.

## Estrutura
- `app/`: Testes de componentes de interface e modais de interação.
- `data/`: Testes de contrato dos 93 cursos da UFSC contra seus relatórios oficiais.
- `lib/`: Testes unitários para cálculos de progresso, navegação, validação de currículos e persistência.
- `scripts/`: Testes de automação para os parsers do CAGR e fluxo de seed do Firestore.
- `push-gate-check.sh`: Verificação de integridade dos git hooks e pipeline local.
- `project-guidance-check.sh`: Auditoria estrita da política de zero comentários, documentação de diretórios e arquivos ignorados.
