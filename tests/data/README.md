# Testes de Contratos Curriculares (tests/data)

## Responsabilidade do Diretório
Garante a integridade e conformidade de todos os dados curriculares mapeados no repositório contra as matrizes oficiais da UFSC.

## Arquitetura Interna
- `curricula-contract.test.ts`: Itera sobre todos os currículos registrados no catálogo e valida se códigos, nomes, fases, horas e requisitos atendem estritamente aos esquemas de tipos do sistema.

## Execução
```bash
npm test tests/data
```
