# Git Hooks (.githooks)

## Responsabilidade do Diretório
Contém githooks versionados do repositório para garantir que nenhum push ou commit seja realizado com quebras de integridade, lints inválidos ou testes falhando.

## Hooks Disponíveis
- `pre-push`: Dispara automaticamente a suíte de verificação local (`scripts/ci-local.sh`) antes de enviar alterações para o repositório remoto.

## Instalação
Para ativar os hooks localmente:
```bash
./scripts/install-git-hooks.sh
```
Ou executando `npm run hooks:install`.
