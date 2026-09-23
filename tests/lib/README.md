# Testes de Biblioteca e Lógica de Negócio (tests/lib)

## Responsabilidade do Diretório
Centraliza os testes unitários da camada de domínio, algoritmos de cálculo, validações de entrada, parsers e adaptadores de armazenamento.

## Arquitetura Interna
- `cagr-transcript-parser.test.ts`: Testa a extração de disciplinas e notas do histórico em PDF do CAGR.
- `curriculum-progress.test.ts`: Valida a computação de carga horária cumprida, pendente e progresso percentual.
- `curriculum-validation.test.ts`: Verifica regras de validação para modelos curriculares.
- `firestore-progress.test.ts` & `local-progress.test.ts`: Validam as operações de sincronização remota e persistência local no navegador.
- `email-templates.test.ts` & `password-policy.test.ts`: Testam fluxos de autenticação, relatórios periódicos e formatação de mensagens.

## Execução
```bash
npm test tests/lib
```
