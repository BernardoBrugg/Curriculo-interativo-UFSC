# App Router Layer (src/app)

## Responsabilidade do Diretório
Define a estrutura de roteamento da aplicação web baseada no Next.js App Router, incluindo visualização de cursos, perfil do usuário, rotas da API e página inicial.

## Estrutura de Rotas
- `page.tsx`: Página inicial pública com busca dinâmica e filtros por campus.
- `[course]/`: Visualização interativa da grade curricular e progresso do curso selecionado.
- `profile/`: Gestão de perfil, histórico e preferências do usuário.
- `api/`: Endpoints de servidor (autenticação, recuperação de senha e envio de feedback).
- `app/`: Ponto de entrada legado redirecionado para a experiência principal.
