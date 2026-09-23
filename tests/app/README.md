# Testes de Interface e Componentes (tests/app)

## Responsabilidade do Diretório
Contém a suíte de testes de interface baseada em React Testing Library e Vitest, cobrindo os principais componentes de visualização e modais de interação da aplicação.

## Arquitetura Interna
- `cagr-import-modal.test.tsx`: Valida o modal de upload e processamento do histórico analítico CAGR.
- `course-detail-modal.test.tsx`: Testa a exibição detalhada de disciplinas, requisitos e equivalências.
- `curriculum-grid.test.tsx`: Valida a renderização da grade curricular interativa por fases.
- `progress-dashboard.test.tsx`: Testa o painel de estatísticas, horas e progresso do estudante.

## Execução
```bash
npm test tests/app
```
