# Reconstrução dos Currículos e Progresso Acadêmico

## Objetivo

Reconstruir os nove currículos da aplicação a partir dos relatórios oficiais do CAGR, representar corretamente as regras de integralização específicas de cada curso, calcular progresso sem exigir todas as optativas e repopular somente a coleção `curricula` do Firestore.

## Escopo

O trabalho cobre Engenharia de Produção 2023.1, Engenharia Mecânica 2025.1, Engenharia Civil 2020.1, Engenharia Elétrica 2005.1, Engenharia Eletrônica 2009.2, Engenharia de Controle e Automação 2024.1, Engenharia Sanitária e Ambiental 2015.1, Engenharia Química 1991.1 e Engenharia de Materiais 2001.1.

Engenharia Eletrônica será corrigida de 2012.1 para 2009.2 porque o CAGR não retorna conteúdo curricular para 2012.1 e identifica 2009.2 como a matriz oficial do curso 235.

## Fontes e precedência

Os nove PDFs oficiais serão versionados em `data/curricula/sources/` junto com URL, curso, versão, data de captura e SHA-256. O volume atual dos documentos é de aproximadamente 692 KB.

Os relatórios do CAGR serão a fonte primária para disciplinas, componentes, códigos, fases, tipos, cargas, créditos, ementas, pré-requisitos, equivalências e observações. Quando um mesmo relatório contiver regras históricas conflitantes, prevalecerá a portaria vigente mais recente reproduzida no próprio relatório. Se a precedência não puder ser determinada, a geração será interrompida até que a portaria oficial correspondente seja verificada.

Correções necessárias por limitações de layout do PDF serão declaradas em arquivos JSON de ajustes. Cada ajuste conterá curso, versão, página, campo, valor extraído, valor adotado, fonte e justificativa. O gerador não fará correções silenciosas.

## Armazenamento local

Cada curso terá um JSON canônico em `src/data/curricula/<curso>/curriculum.json`. Os arquivos TypeScript de registro importarão esses JSONs e os exporão como `CurriculumData`. Os arquivos fragmentados de fases deixarão de ser a fonte de verdade.

Disciplinas reais terão identificador igual ao código oficial. Componentes curriculares sem código, como cargas de livre escolha, não serão cadastrados como disciplinas fictícias. Eles serão representados como requisitos de conclusão.

Cada disciplina manterá:

- código e identificador;
- nome integral;
- créditos e carga em H/A conforme o relatório;
- fase sugerida;
- tipo oficial;
- pré-requisitos com preservação da lógica de `e` e `ou`;
- equivalências com preservação da lógica de `e` e `ou`;
- ementa integral;
- carga de extensão quando declarada.

Pré-requisitos e equivalências deixarão de ser vetores planos. O modelo usará expressões tipadas para não perder a diferença entre alternativas e conjuntos obrigatórios.

## Requisitos de conclusão

`CurriculumData` receberá uma configuração explícita de integralização. Ela não será inferida pela quantidade de disciplinas cadastradas nem apenas pelo campo `type`.

A configuração conterá:

- códigos dos componentes que precisam ser concluídos individualmente;
- grupos eletivos com carga mínima própria;
- códigos elegíveis em cada grupo;
- fontes manuais para horas validadas fora do catálogo;
- limites por fonte ou subconjunto;
- carga total usada como denominador;
- metadados de estágio, TCC, extensão e atividades complementares quando forem requisitos separados.

As regras mínimas iniciais incluem:

| Curso | Regras eletivas principais |
|---|---|
| Automação | 432 H/A profissionalizantes e 36 H/A livres ou complementares |
| Civil | 432 H/A, com no máximo 54 H/A de atividades complementares |
| Elétrica | 432 H/A, com 288 H/A das áreas previstas e até 144 H/A livres ou complementares |
| Eletrônica | 720 H/A, com 576 H/A profissionalizantes e 144 H/A livres |
| Materiais | 198 H/A |
| Mecânica | 288 H/A, respeitando o limite conjunto do bloco especial e monitoria |
| Produção | Regras vigentes do relatório e da portaria mais recente, separando trilhas, livre escolha e extensão |
| Química | 216 H/A, com 162 H/A do rol e até 54 H/A de livre escolha |
| Sanitária | 162 H/A, com no mínimo 108 H/A do rol sugerido e até 54 H/A de livre escolha |

As cargas de extensão embutidas em disciplinas obrigatórias não serão contadas duas vezes. Componentes autônomos obrigatórios de extensão entrarão entre os requisitos fixos ou em grupo específico, conforme o relatório.

## Cálculo de progresso

O cálculo será uma função pura fora dos componentes React.

O progresso obrigatório será a soma das cargas dos componentes obrigatórios efetivamente concluídos. Optativas nunca compensarão um componente obrigatório pendente.

Cada grupo eletivo somará somente disciplinas elegíveis e horas manuais associadas ao grupo. A contribuição será limitada primeiro pelos limites das fontes e depois pela carga mínima do grupo. Horas excedentes não aumentarão o percentual.

O numerador será a soma do progresso dos componentes fixos e dos grupos. O denominador será a soma das cargas exigidas pelos mesmos requisitos e deverá coincidir com a carga total oficial. Qualquer divergência impedirá a geração e o seed.

O aluno alcançará 100% somente quando todos os componentes fixos e todos os mínimos dos grupos forem satisfeitos. Não será necessário concluir todas as disciplinas disponíveis no catálogo optativo.

O painel deixará de apresentar o tamanho integral do catálogo como se fosse a quantidade de disciplinas necessárias. Ele mostrará o progresso geral e o detalhamento dos requisitos relevantes para o curso.

## Persistência do progresso

Os status existentes continuarão em `users/<uid>/curricula/<courseId>.statuses`, indexados pelo código da disciplina. Códigos preservados manterão o progresso atual.

O documento receberá `requirementHours`, um mapa de identificador de requisito para horas validadas manualmente. A ausência desse campo será normalizada como mapa vazio, sem migração destrutiva.

Status referentes a códigos removidos da matriz permanecerão armazenados, mas serão ignorados pelo cálculo e pela interface. A repopulação dos currículos não escreverá na coleção `users`.

## Extração e validação

Um gerador determinístico produzirá os JSONs canônicos a partir das fontes versionadas. Linhas sem classificação inequívoca, códigos duplicados, nomes truncados, relações inválidas ou regras sem precedência definida causarão falha.

A validação verificará:

- schema e tipagem;
- unicidade de identificadores;
- correspondência entre código e identificador;
- referências de requisitos e relações;
- preservação da lógica de pré-requisitos e equivalências;
- cargas e créditos não negativos;
- contagem e hashes esperados por fonte;
- ausência de ementas vazias quando o relatório apresentar ementa;
- soma dos componentes de integralização igual à carga total;
- classificação completa de todos os componentes oficiais.

## Testes

O desenvolvimento seguirá TDD. A função de progresso terá casos para:

- todas as obrigatórias sem o mínimo optativo resultarem em menos de 100%;
- todas as obrigatórias e os mínimos exatos resultarem em 100%;
- uma obrigatória pendente impedir 100% mesmo com optativas excedentes;
- uma hora abaixo do mínimo de um grupo impedir 100%;
- excesso de horas não ultrapassar o limite do grupo;
- fontes manuais respeitarem seus limites;
- a mesma disciplina não ser contada em dois grupos;
- extensão embutida não ser somada duas vezes.

Cada currículo terá testes de contrato para versão, carga total, códigos, grupos e regras de integralização. Também haverá testes do normalizador do Firestore para compatibilidade com documentos antigos sem `requirementHours`.

## Repopulação do Firestore

O script de seed será restaurado e ampliado. Por padrão ele executará somente validação e pré-visualização. A escrita exigirá uma opção explícita de aplicação e credencial administrativa.

Antes da escrita, o script exportará os documentos existentes da coleção `curricula` para um backup local com timestamp. Em seguida validará os nove payloads e os gravará em um único batch. Nenhum documento da coleção `users` será lido, alterado ou removido.

Após o commit do batch, o script relerá os nove documentos e comparará seus hashes canônicos com os dados locais. Uma divergência fará a execução terminar com erro e informará quais documentos não coincidem.

## Tratamento de falhas

Falhas de download, extração, ambiguidade, schema, integridade, autenticação, backup, escrita ou leitura posterior interromperão o fluxo com mensagem específica e código de saída diferente de zero.

O seed não fará escrita parcial. O backup será concluído antes do batch e a validação completa ocorrerá antes de qualquer mutação externa.

## Fora do escopo

- apagar ou reescrever progresso de usuários;
- inferir aproveitamentos individuais, dispensas ou migrações entre matrizes sem informação do aluno;
- cadastrar todas as disciplinas extracurriculares da UFSC;
- atualizar automaticamente os currículos quando o CAGR mudar;
- alterar autenticação, perfis ou preferências.

## Critérios de aceite

- Os nove currículos locais correspondem às fontes oficiais versionadas.
- Engenharia Eletrônica usa a matriz oficial 2009.2 e 4644 H/A.
- Todos os requisitos variáveis por curso estão explícitos e testados.
- Nenhuma quantidade de optativas excedentes substitui uma obrigatória.
- É possível atingir 100% sem concluir o catálogo optativo inteiro.
- A aplicação passa em testes, typecheck, lint e build.
- Os nove documentos do Firestore coincidem com os hashes locais após o seed.
- Dados de usuários permanecem inalterados.
