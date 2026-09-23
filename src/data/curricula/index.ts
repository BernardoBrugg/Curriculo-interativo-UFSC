import { CurriculumData } from "@/types/curriculum";
import { curriculum as administracao } from "./administracao";
import { curriculum as agronomia } from "./agronomia";
import { curriculum as agronomia_florianopolis } from "./agronomia-florianopolis";
import { curriculum as animacao } from "./animacao";
import { curriculum as antropologia } from "./antropologia";
import { curriculum as arquitetura_e_urbanismo } from "./arquitetura-e-urbanismo";
import { curriculum as arquivologia } from "./arquivologia";
import { curriculum as artes_cenicas } from "./artes-cenicas";
import { curriculum as biblioteconomia } from "./biblioteconomia";
import { curriculum as ciencia_da_informacao } from "./ciencia-da-informacao";
import { curriculum as ciencia_de_dados } from "./ciencia-de-dados";
import { curriculum as ciencia_e_tecnologia } from "./ciencia-e-tecnologia";
import { curriculum as ciencia_e_tecnologia_de_alimentos } from "./ciencia-e-tecnologia-de-alimentos";
import { curriculum as ciencias_biologicas } from "./ciencias-biologicas";
import { curriculum as ciencias_contabeis } from "./ciencias-contabeis";
import { curriculum as ciencias_da_computacao } from "./ciencias-da-computacao";
import { curriculum as ciencias_economicas } from "./ciencias-economicas";
import { curriculum as ciencias_sociais } from "./ciencias-sociais";
import { curriculum as cinema } from "./cinema";
import { curriculum as design } from "./design";
import { curriculum as design_de_produto } from "./design-de-produto";
import { curriculum as direito } from "./direito";
import { curriculum as ead_administracao_publica } from "./ead-administracao-publica";
import { curriculum as ead_ciencias_biologicas } from "./ead-ciencias-biologicas";
import { curriculum as ead_filosofia } from "./ead-filosofia";
import { curriculum as ead_fisica } from "./ead-fisica";
import { curriculum as ead_historia } from "./ead-historia";
import { curriculum as ead_letras_libras } from "./ead-letras-libras";
import { curriculum as ead_letras_lingua_espanhola } from "./ead-letras-lingua-espanhola";
import { curriculum as ead_letras_lingua_portuguesa } from "./ead-letras-lingua-portuguesa";
import { curriculum as ead_licenciatura_em_educacao_escolar_quilombola } from "./ead-licenciatura-em-educacao-escolar-quilombola";
import { curriculum as ead_matematica } from "./ead-matematica";
import { curriculum as educacao_do_campo } from "./educacao-do-campo";
import { curriculum as educacao_fisica } from "./educacao-fisica";
import { curriculum as enfermagem } from "./enfermagem";
import { curriculum as engenharia_aeroespacial } from "./engenharia-aeroespacial";
import { curriculum as engenharia_automotiva } from "./engenharia-automotiva";
import { curriculum as civil } from "./civil";
import { curriculum as engenharia_civil_de_infraestrutura } from "./engenharia-civil-de-infraestrutura";
import { curriculum as engenharia_de_alimentos } from "./engenharia-de-alimentos";
import { curriculum as engenharia_de_aquicultura } from "./engenharia-de-aquicultura";
import { curriculum as engenharia_de_computacao } from "./engenharia-de-computacao";
import { curriculum as engenharia_de_controle_e_automacao } from "./engenharia-de-controle-e-automacao";
import { curriculum as automacao } from "./automacao";
import { curriculum as engenharia_de_energia } from "./engenharia-de-energia";
import { curriculum as engenharia_de_materiais } from "./engenharia-de-materiais";
import { curriculum as materiais } from "./materiais";
import { curriculum as producao } from "./producao";
import { curriculum as engenharia_de_producao_cv_el_mec } from "./engenharia-de-producao-cv-el-mec";
import { curriculum as engenharia_de_transporte_e_logistica } from "./engenharia-de-transporte-e-logistica";
import { curriculum as eletrica } from "./eletrica";
import { curriculum as eletronica } from "./eletronica";
import { curriculum as engenharia_ferroviaria_e_metroviaria } from "./engenharia-ferroviaria-e-metroviaria";
import { curriculum as engenharia_florestal } from "./engenharia-florestal";
import { curriculum as mecanica } from "./mecanica";
import { curriculum as engenharia_mecatronica } from "./engenharia-mecatronica";
import { curriculum as engenharia_naval } from "./engenharia-naval";
import { curriculum as quimica } from "./quimica";
import { curriculum as sanitaria } from "./sanitaria";
import { curriculum as engenharia_textil } from "./engenharia-textil";
import { curriculum as farmacia } from "./farmacia";
import { curriculum as filosofia } from "./filosofia";
import { curriculum as fisica } from "./fisica";
import { curriculum as fisioterapia } from "./fisioterapia";
import { curriculum as fonoaudiologia } from "./fonoaudiologia";
import { curriculum as geografia } from "./geografia";
import { curriculum as geologia } from "./geologia";
import { curriculum as historia } from "./historia";
import { curriculum as jornalismo } from "./jornalismo";
import { curriculum as letras_libras } from "./letras-libras";
import { curriculum as letras_lingua_portuguesa } from "./letras-lingua-portuguesa";
import { curriculum as letras_linguas_estrangeiras } from "./letras-linguas-estrangeiras";
import { curriculum as licenciatura_em_matematica } from "./licenciatura-em-matematica";
import { curriculum as matematica } from "./matematica";
import { curriculum as medicina } from "./medicina";
import { curriculum as medicina_curitibanos } from "./medicina-curitibanos";
import { curriculum as medicina_florianopolis } from "./medicina-florianopolis";
import { curriculum as medicina_veterinaria } from "./medicina-veterinaria";
import { curriculum as meteorologia } from "./meteorologia";
import { curriculum as museologia } from "./museologia";
import { curriculum as nutricao } from "./nutricao";
import { curriculum as oceanografia } from "./oceanografia";
import { curriculum as odontologia } from "./odontologia";
import { curriculum as pedagogia } from "./pedagogia";
import { curriculum as povos_indigenas_do_sul_da_mata_atlantica } from "./povos-indigenas-do-sul-da-mata-atlantica";
import { curriculum as psicologia } from "./psicologia";
import { curriculum as quimica_blumenau } from "./quimica-blumenau";
import { curriculum as quimica_florianopolis } from "./quimica-florianopolis";
import { curriculum as relacoes_internacionais } from "./relacoes-internacionais";
import { curriculum as servico_social } from "./servico-social";
import { curriculum as sistemas_de_informacao } from "./sistemas-de-informacao";
import { curriculum as tecnologias_da_informacao_e_comunicacao } from "./tecnologias-da-informacao-e-comunicacao";
import { curriculum as zootecnia } from "./zootecnia";

export const curriculaRegistry: Record<string, CurriculumData> = {
  "administracao": administracao,
  "agronomia": agronomia,
  "agronomia-florianopolis": agronomia_florianopolis,
  "animacao": animacao,
  "antropologia": antropologia,
  "arquitetura-e-urbanismo": arquitetura_e_urbanismo,
  "arquivologia": arquivologia,
  "artes-cenicas": artes_cenicas,
  "biblioteconomia": biblioteconomia,
  "ciencia-da-informacao": ciencia_da_informacao,
  "ciencia-de-dados": ciencia_de_dados,
  "ciencia-e-tecnologia": ciencia_e_tecnologia,
  "ciencia-e-tecnologia-de-alimentos": ciencia_e_tecnologia_de_alimentos,
  "ciencias-biologicas": ciencias_biologicas,
  "ciencias-contabeis": ciencias_contabeis,
  "ciencias-da-computacao": ciencias_da_computacao,
  "ciencias-economicas": ciencias_economicas,
  "ciencias-sociais": ciencias_sociais,
  "cinema": cinema,
  "design": design,
  "design-de-produto": design_de_produto,
  "direito": direito,
  "ead-administracao-publica": ead_administracao_publica,
  "ead-ciencias-biologicas": ead_ciencias_biologicas,
  "ead-filosofia": ead_filosofia,
  "ead-fisica": ead_fisica,
  "ead-historia": ead_historia,
  "ead-letras-libras": ead_letras_libras,
  "ead-letras-lingua-espanhola": ead_letras_lingua_espanhola,
  "ead-letras-lingua-portuguesa": ead_letras_lingua_portuguesa,
  "ead-licenciatura-em-educacao-escolar-quilombola": ead_licenciatura_em_educacao_escolar_quilombola,
  "ead-matematica": ead_matematica,
  "educacao-do-campo": educacao_do_campo,
  "educacao-fisica": educacao_fisica,
  "enfermagem": enfermagem,
  "engenharia-aeroespacial": engenharia_aeroespacial,
  "engenharia-automotiva": engenharia_automotiva,
  "civil": civil,
  "engenharia-civil-de-infraestrutura": engenharia_civil_de_infraestrutura,
  "engenharia-de-alimentos": engenharia_de_alimentos,
  "engenharia-de-aquicultura": engenharia_de_aquicultura,
  "engenharia-de-computacao": engenharia_de_computacao,
  "engenharia-de-controle-e-automacao": engenharia_de_controle_e_automacao,
  "automacao": automacao,
  "engenharia-de-energia": engenharia_de_energia,
  "engenharia-de-materiais": engenharia_de_materiais,
  "materiais": materiais,
  "producao": producao,
  "engenharia-de-producao-cv-el-mec": engenharia_de_producao_cv_el_mec,
  "engenharia-de-transporte-e-logistica": engenharia_de_transporte_e_logistica,
  "eletrica": eletrica,
  "eletronica": eletronica,
  "engenharia-ferroviaria-e-metroviaria": engenharia_ferroviaria_e_metroviaria,
  "engenharia-florestal": engenharia_florestal,
  "mecanica": mecanica,
  "engenharia-mecatronica": engenharia_mecatronica,
  "engenharia-naval": engenharia_naval,
  "quimica": quimica,
  "sanitaria": sanitaria,
  "engenharia-textil": engenharia_textil,
  "farmacia": farmacia,
  "filosofia": filosofia,
  "fisica": fisica,
  "fisioterapia": fisioterapia,
  "fonoaudiologia": fonoaudiologia,
  "geografia": geografia,
  "geologia": geologia,
  "historia": historia,
  "jornalismo": jornalismo,
  "letras-libras": letras_libras,
  "letras-lingua-portuguesa": letras_lingua_portuguesa,
  "letras-linguas-estrangeiras": letras_linguas_estrangeiras,
  "licenciatura-em-matematica": licenciatura_em_matematica,
  "matematica": matematica,
  "medicina": medicina,
  "medicina-curitibanos": medicina_curitibanos,
  "medicina-florianopolis": medicina_florianopolis,
  "medicina-veterinaria": medicina_veterinaria,
  "meteorologia": meteorologia,
  "museologia": museologia,
  "nutricao": nutricao,
  "oceanografia": oceanografia,
  "odontologia": odontologia,
  "pedagogia": pedagogia,
  "povos-indigenas-do-sul-da-mata-atlantica": povos_indigenas_do_sul_da_mata_atlantica,
  "psicologia": psicologia,
  "quimica-blumenau": quimica_blumenau,
  "quimica-florianopolis": quimica_florianopolis,
  "relacoes-internacionais": relacoes_internacionais,
  "servico-social": servico_social,
  "sistemas-de-informacao": sistemas_de_informacao,
  "tecnologias-da-informacao-e-comunicacao": tecnologias_da_informacao_e_comunicacao,
  "zootecnia": zootecnia,
};

export const getCurriculum = (courseId: string): CurriculumData | undefined => {
  return curriculaRegistry[courseId];
};

export interface AvailableCourseItem {
  id: string;
  name: string;
  description: string;
  campus: string;
}

export const availableCourses: AvailableCourseItem[] = [
  { id: "administracao", name: "Administração", description: "Matriz 2023.1", campus: "Florianópolis" },
  { id: "agronomia", name: "Agronomia", description: "Matriz 2021.2", campus: "Curitibanos" },
  { id: "agronomia-florianopolis", name: "Agronomia", description: "Matriz 2025.1", campus: "Florianópolis" },
  { id: "animacao", name: "Animação", description: "Matriz 2016.1", campus: "Florianópolis" },
  { id: "antropologia", name: "Antropologia", description: "Matriz 2010.1", campus: "Florianópolis" },
  { id: "arquitetura-e-urbanismo", name: "Arquitetura e Urbanismo", description: "Matriz 2026.1", campus: "Florianópolis" },
  { id: "arquivologia", name: "Arquivologia", description: "Matriz 2026.1", campus: "Florianópolis" },
  { id: "artes-cenicas", name: "Artes Cênicas", description: "Matriz 2013.1", campus: "Florianópolis" },
  { id: "biblioteconomia", name: "Biblioteconomia", description: "Matriz 2016.1", campus: "Florianópolis" },
  { id: "ciencia-da-informacao", name: "Ciência da Informação", description: "Matriz 2026.1", campus: "Florianópolis" },
  { id: "ciencia-de-dados", name: "Ciência de Dados", description: "Matriz 2026.1", campus: "Florianópolis" },
  { id: "ciencia-e-tecnologia", name: "Ciência e Tecnologia", description: "Matriz 2025.1", campus: "Joinville" },
  { id: "ciencia-e-tecnologia-de-alimentos", name: "Ciência e Tecnologia de Alimentos", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "ciencias-biologicas", name: "Ciências Biológicas", description: "Matriz 2006.1", campus: "Florianópolis" },
  { id: "ciencias-contabeis", name: "Ciências Contábeis", description: "Matriz 2019.1", campus: "Florianópolis" },
  { id: "ciencias-da-computacao", name: "Ciências da Computação", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "ciencias-economicas", name: "Ciências Econômicas", description: "Matriz 2019.1", campus: "Florianópolis" },
  { id: "ciencias-sociais", name: "Ciências Sociais", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "cinema", name: "Cinema", description: "Matriz 2015.1", campus: "Florianópolis" },
  { id: "design", name: "Design", description: "Matriz 2022.1", campus: "Florianópolis" },
  { id: "design-de-produto", name: "Design de Produto", description: "Matriz 2019.1", campus: "Florianópolis" },
  { id: "direito", name: "Direito", description: "Matriz 2023.1", campus: "Florianópolis" },
  { id: "ead-administracao-publica", name: "EaD - Administração Pública", description: "Matriz 2017.1", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-ciencias-biologicas", name: "EaD - Ciências Biológicas", description: "Matriz 2017.1", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-filosofia", name: "EaD - Filosofia", description: "Matriz 2017.1", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-fisica", name: "EaD - Física", description: "Matriz 2017.1", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-historia", name: "EaD - História", description: "Matriz 2025.1", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-letras-libras", name: "EaD - Letras - LIBRAS", description: "Matriz 2020.2", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-letras-lingua-espanhola", name: "EaD - Letras - Língua Espanhola", description: "Matriz 2011.1", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-letras-lingua-portuguesa", name: "EaD - Letras - Língua Portuguesa", description: "Matriz 2017.1", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-licenciatura-em-educacao-escolar-quilombola", name: "EaD - Licenciatura em Educação Escolar Quilombola", description: "Matriz 2025.1", campus: "Florianópolis (Educação a Distância)" },
  { id: "ead-matematica", name: "EaD - Matemática", description: "Matriz 2025.2", campus: "Florianópolis (Educação a Distância)" },
  { id: "educacao-do-campo", name: "Educação do Campo", description: "Matriz 2009.2", campus: "Florianópolis" },
  { id: "educacao-fisica", name: "Educação Física", description: "Matriz 2006.1", campus: "Florianópolis" },
  { id: "enfermagem", name: "Enfermagem", description: "Matriz 2022.1", campus: "Florianópolis" },
  { id: "engenharia-aeroespacial", name: "Engenharia Aeroespacial", description: "Matriz 2025.1", campus: "Joinville" },
  { id: "engenharia-automotiva", name: "Engenharia Automotiva", description: "Matriz 2025.1", campus: "Joinville" },
  { id: "civil", name: "Engenharia Civil", description: "Matriz 2020.1", campus: "Florianópolis" },
  { id: "engenharia-civil-de-infraestrutura", name: "Engenharia Civil de Infraestrutura", description: "Matriz 2025.1", campus: "Joinville" },
  { id: "engenharia-de-alimentos", name: "Engenharia de Alimentos", description: "Matriz 1991.1", campus: "Florianópolis" },
  { id: "engenharia-de-aquicultura", name: "Engenharia de Aquicultura", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "engenharia-de-computacao", name: "Engenharia de Computação", description: "Matriz 2020.1", campus: "Araranguá" },
  { id: "engenharia-de-controle-e-automacao", name: "Engenharia de Controle e Automação", description: "Matriz 2023.2", campus: "Blumenau" },
  { id: "automacao", name: "Engenharia de Controle e Automação", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "engenharia-de-energia", name: "Engenharia de Energia", description: "Matriz 2025.1", campus: "Araranguá" },
  { id: "engenharia-de-materiais", name: "Engenharia de Materiais", description: "Matriz 2023.1", campus: "Blumenau" },
  { id: "materiais", name: "Engenharia de Materiais", description: "Matriz 2001.1", campus: "Florianópolis" },
  { id: "producao", name: "Engenharia de Produção", description: "Matriz 2023.1", campus: "Florianópolis" },
  { id: "engenharia-de-producao-cv-el-mec", name: "Engenharia de Produção Cv/El/Mec", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "engenharia-de-transporte-e-logistica", name: "Engenharia de Transporte e Logística", description: "Matriz 2025.1", campus: "Joinville" },
  { id: "eletrica", name: "Engenharia Elétrica", description: "Matriz 2005.1", campus: "Florianópolis" },
  { id: "eletronica", name: "Engenharia Eletrônica", description: "Matriz 2009.2", campus: "Florianópolis" },
  { id: "engenharia-ferroviaria-e-metroviaria", name: "Engenharia Ferroviária e Metroviária", description: "Matriz 2025.1", campus: "Joinville" },
  { id: "engenharia-florestal", name: "Engenharia Florestal", description: "Matriz 2021.1", campus: "Curitibanos" },
  { id: "mecanica", name: "Engenharia Mecânica", description: "Matriz 2025.1", campus: "Florianópolis" },
  { id: "engenharia-mecatronica", name: "Engenharia Mecatrônica", description: "Matriz 2025.1", campus: "Joinville" },
  { id: "engenharia-naval", name: "Engenharia Naval", description: "Matriz 2025.1", campus: "Joinville" },
  { id: "quimica", name: "Engenharia Quimica", description: "Matriz 1991.1", campus: "Florianópolis" },
  { id: "sanitaria", name: "Engenharia Sanitária e Ambiental", description: "Matriz 2015.1", campus: "Florianópolis" },
  { id: "engenharia-textil", name: "Engenharia Têxtil", description: "Matriz 2021.1", campus: "Blumenau" },
  { id: "farmacia", name: "Farmácia", description: "Matriz 2022.1", campus: "Florianópolis" },
  { id: "filosofia", name: "Filosofia", description: "Matriz 2006.1", campus: "Florianópolis" },
  { id: "fisica", name: "Física", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "fisioterapia", name: "Fisioterapia", description: "Matriz 2016.1", campus: "Araranguá" },
  { id: "fonoaudiologia", name: "Fonoaudiologia", description: "Matriz 2024.2", campus: "Florianópolis" },
  { id: "geografia", name: "Geografia", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "geologia", name: "Geologia", description: "Matriz 2018.1", campus: "Florianópolis" },
  { id: "historia", name: "História", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "jornalismo", name: "Jornalismo", description: "Matriz 2020.1", campus: "Florianópolis" },
  { id: "letras-libras", name: "Letras - LIBRAS", description: "Matriz 2012.1", campus: "Florianópolis" },
  { id: "letras-lingua-portuguesa", name: "Letras - Língua Portuguesa", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "letras-linguas-estrangeiras", name: "Letras - Línguas Estrangeiras", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "licenciatura-em-matematica", name: "Licenciatura em Matemática", description: "Matriz 2023.1", campus: "Blumenau" },
  { id: "matematica", name: "Matemática", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "medicina", name: "Medicina", description: "Matriz 2025.1", campus: "Araranguá" },
  { id: "medicina-curitibanos", name: "Medicina", description: "Matriz 2025.1", campus: "Curitibanos" },
  { id: "medicina-florianopolis", name: "Medicina", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "medicina-veterinaria", name: "Medicina Veterinária", description: "Matriz 2023.1", campus: "Curitibanos" },
  { id: "meteorologia", name: "Meteorologia", description: "Matriz 2026.1", campus: "Florianópolis" },
  { id: "museologia", name: "Museologia", description: "Matriz 2016.1", campus: "Florianópolis" },
  { id: "nutricao", name: "Nutrição", description: "Matriz 2025.1", campus: "Florianópolis" },
  { id: "oceanografia", name: "Oceanografia", description: "Matriz 2008.1", campus: "Florianópolis" },
  { id: "odontologia", name: "Odontologia", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "pedagogia", name: "Pedagogia", description: "Matriz 2009.1", campus: "Florianópolis" },
  { id: "povos-indigenas-do-sul-da-mata-atlantica", name: "Povos Indígenas do Sul da Mata Atlântica", description: "Matriz 2022.1", campus: "Florianópolis" },
  { id: "psicologia", name: "Psicologia", description: "Matriz 2010.1", campus: "Florianópolis" },
  { id: "quimica-blumenau", name: "Química", description: "Matriz 2023.1", campus: "Blumenau" },
  { id: "quimica-florianopolis", name: "Química", description: "Matriz 2021.1", campus: "Florianópolis" },
  { id: "relacoes-internacionais", name: "Relações Internacionais", description: "Matriz 2009.1", campus: "Florianópolis" },
  { id: "servico-social", name: "Serviço Social", description: "Matriz 2013.2", campus: "Florianópolis" },
  { id: "sistemas-de-informacao", name: "Sistemas de Informação", description: "Matriz 2011.1", campus: "Florianópolis" },
  { id: "tecnologias-da-informacao-e-comunicacao", name: "Tecnologias da Informação e Comunicação", description: "Matriz 2017.1", campus: "Araranguá" },
  { id: "zootecnia", name: "Zootecnia", description: "Matriz 2024.1", campus: "Florianópolis" },
];
