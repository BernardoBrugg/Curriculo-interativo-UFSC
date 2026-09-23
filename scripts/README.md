# Automation Scripts (scripts)

## Responsabilidade do Diretório
Reúne as ferramentas de automação para download, extração, geração e validação contínua dos dados curriculares da UFSC a partir dos sistemas acadêmicos oficiais.

## Scripts Principais
- `crawl-cagr.ts`: Coleta e mapeia toda a árvore de cursos e versões curriculares no CAGR.
- `fetch-curricula-sources.ts`: Baixa os relatórios oficiais em PDF e gera as representações textuais.
- `extract-curriculum-rules.ts`: Extrai parâmetros, cargas horárias e observações de integralização.
- `generate-curricula.ts`: Processa e gera os arquivos `curriculum.json` tipados para cada curso.
- `seed-curricula.ts`: Publica as matrizes curriculares no Firestore com validação atômica e backup prévio.
- `ci-local.sh`: Portão de integração contínua local acionado antes de cada envio de código.
- `install-git-hooks.sh`: Ativa o hook de pre-push no repositório local.
