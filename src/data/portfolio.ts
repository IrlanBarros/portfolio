import type { ImageMetadata } from 'astro';
import planeja from '../../assets/images/projects/projeta-ufca.png';
import ilarica from '../../assets/images/projects/ilarica/ilarica-home-client.png';
import restaurant from '../../assets/images/projects/ilarica/ilarica-restaurant.png';
import flowcount from '../../assets/images/projects/flow-count/flowcount-montagem-gabinete.jpeg';
import nail from '../../assets/images/projects/nail-manager.png';

// Fonte editorial: docs/profile-source.md. Não confundir o progresso do visitante
// com competências, resultados ou conquistas profissionais do autor.
export const profile = {
  name: 'Irlan Barros',
  fullName: 'Francisco Irlan de Oliveira Barros',
  role: 'Desenvolvedor full stack',
  areas: 'Engenharia de software · Sistemas embarcados',
  description: 'Desenvolvedor full stack e graduando em Ciência da Computação pela UFCA. Construo aplicações que conectam fundamentos da computação a problemas reais.',
  about: 'Sou graduando em Ciência da Computação pela Universidade Federal do Cariri, com experiência em desenvolvimento web e atuação no ensino de robótica. Meus projetos conectam fundamentos da computação a problemas de planejamento acadêmico, gestão de serviços e automação.',
  approach: 'Gosto de organizar regras de negócio, integrar sistemas e construir aplicações cujo comportamento possa ser compreendido e verificado. Separação de responsabilidades, testes e documentação fazem parte desse processo.',
  interests: 'Quero aprofundar meu trabalho em arquitetura e qualidade de software, ferramentas para educação, integração entre aplicações e dispositivos e uso de LLMs no apoio à pesquisa em engenharia de software.',
  linkedin: 'https://www.linkedin.com/in/irlan-barros-55a83924b/',
  github: 'https://github.com/IrlanBarros', // Perfil identificado nos repositórios do README.
  email: 'irlanbarros100@gmail.com',
  resume: '/documents/irlan-barros-curriculo.pdf',
};

export type Category = 'Web' | 'Sistemas embarcados' | 'Pesquisa' | 'Desktop & algoritmos';
export interface Project {
  slug: string;
  number: string;
  name: string;
  subtitle: string;
  category: Category;
  status: string;
  description: string;
  tech: string[];
  problem: string;
  architecture: string;
  solution: string[];
  evidence: string;
  participation: string;
  image?: ImageMetadata;
  imageAlt?: string;
  gallery?: { image: ImageMetadata; alt: string }[];
  repository?: string;
  demo?: string;
  diagram: string[];
  accent: 'green' | 'amber' | 'violet' | 'blue';
}

export const projects: Project[] = [
  {
    slug: 'planeja-ufca', number: '01', name: 'Planeja UFCA', subtitle: 'Mais clareza para a próxima escolha.',
    category: 'Web', status: 'Versão funcional', accent: 'green',
    description: 'Horários, matrizes curriculares e progresso acadêmico em um só lugar. Uma plataforma independente para planejar a vida na universidade.',
    tech: ['React', 'TypeScript', 'Python', 'Beautiful Soup', 'Vitest', 'pytest'],
    problem: 'Organizar as escolhas de disciplinas exige conciliar horários, pré-requisitos e o próprio progresso acadêmico.',
    architecture: 'A aplicação funciona sem backend permanente. O histórico acadêmico é processado no navegador, mediante autorização, e a coleta de dados públicos é feita em Python. O frontend e os parsers possuem testes.',
    solution: ['Detecção de conflitos de horário e consulta de pré-requisitos.', 'Recomendações baseadas em regras para apoiar o planejamento.', 'Exportação do planejamento em PDF e CSV.', 'Processamento local do histórico acadêmico autorizado pelo estudante.'],
    evidence: 'Projeto de minha autoria, com versão funcional disponível. Não há métricas de uso ou impacto informadas na fonte.',
    participation: 'Projeto de minha autoria.', image: planeja, imageAlt: 'Tela real do Planeja UFCA com seleção de disciplinas e planejamento acadêmico.',
    repository: 'https://github.com/IrlanBarros/planeja-ufca', demo: 'https://planejaufca.pages.dev',
    diagram: ['Dados públicos · Python', 'Planejamento · React', 'Histórico no navegador', 'Exportação · PDF / CSV'],
  },
  {
    slug: 'ilarica', number: '02', name: 'iLarica', subtitle: 'Da cantina ao próximo pedido.',
    category: 'Web', status: 'Piloto em desenvolvimento', accent: 'amber',
    description: 'Clientes e cantinas conectados por cardápios, gestão de produtos e acompanhamento de pedidos para retirada presencial.',
    tech: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'React', 'TypeScript', 'Docker Compose'],
    problem: 'Conectar a consulta de cardápios ao acompanhamento de pedidos e à operação das cantinas, com foco inicial na retirada presencial.',
    architecture: 'O domínio, os casos de uso e a infraestrutura têm responsabilidades separadas. Testes cobrem regras de negócio, APIs e restrições de acesso entre clientes e estabelecimentos.',
    solution: ['Catálogo e carrinho de compras.', 'Gestão de produtos, estoque e horários das cantinas.', 'Acompanhamento de pedidos no escopo de retirada presencial.', 'Testes de APIs e de acesso entre diferentes perfis.'],
    evidence: 'Em desenvolvimento, com escopo de piloto. A fonte não informa resultados de implantação.',
    participation: 'Projeto apresentado no portfólio; a divisão de autoria não está detalhada na fonte.',
    image: ilarica, imageAlt: 'Tela real do iLarica com cardápio e produtos de uma cantina.',
    gallery: [{ image: restaurant, alt: 'Interface do estabelecimento no iLarica.' }],
    diagram: ['Interface · React', 'Casos de uso · FastAPI', 'Domínio', 'Persistência · PostgreSQL'],
  },
  {
    slug: 'flowcount', number: '03', name: 'FlowCount', subtitle: 'Do sinal físico ao dado confiável.',
    category: 'Sistemas embarcados', status: 'Protótipo em equipe', accent: 'blue',
    description: 'Contagem de peças em uma linha de produção, com firmware orientado a estados e eventos transmitidos por MQTT.',
    tech: ['C', 'ESP32-S3', 'ESP-IDF', 'FreeRTOS', 'MQTT'],
    problem: 'Contar peças em uma linha de produção e encaminhar os eventos a um sistema central, tratando oscilações do sinal e bloqueios do sensor.',
    architecture: 'Uma máquina de estados valida as passagens pelo sensor. Os eventos são organizados em fila e enviados por MQTT. Testes de host exercitam o firmware sem exigir a placa conectada.',
    solution: ['Validação de passagens e tratamento de oscilações do sinal.', 'Identificação de bloqueios no sensor.', 'Fila de eventos e transmissão MQTT.', 'Testes de contagem, comunicação, temporização e sinalização.'],
    evidence: 'Protótipo desenvolvido em equipe. A integração com o servidor permite visualizar os dados no Grafana.',
    participation: 'Integrante da equipe. A fonte não delimita contribuições individuais.',
    image: flowcount, imageAlt: 'Fotografia do protótipo FlowCount montado em um gabinete com visor e indicadores.',
    repository: 'https://github.com/joaohenriquebitu/FlowCount.git',
    diagram: ['Sensor', 'Estados · ESP32-S3', 'Fila · MQTT', 'Servidor · Grafana'],
  },
  {
    slug: 'blockchain-research', number: '04', name: 'Blockchain & LLMs', subtitle: 'Evidência antes de conclusão.',
    category: 'Pesquisa', status: 'Pesquisa em desenvolvimento', accent: 'violet',
    description: 'Ferramentas experimentais para investigar padrões de projeto em blockchain a partir de discussões de projetos open source.',
    tech: ['Python', 'LLMs', 'pytest'],
    problem: 'Investigar padrões de projeto em blockchain em discussões de issues e pull requests de projetos open source, com rastreabilidade dos registros analisados.',
    architecture: 'Blockchain Pattern LLM Verification combina classificação hierárquica com LLMs, validação de respostas estruturadas, registro de evidências e checkpoints. web3blockset-sampling prepara e audita o corpus para amostragem aleatória estratificada.',
    solution: ['Classificação hierárquica e validação de respostas estruturadas.', 'Registro de evidências e retomada por checkpoints.', 'Preparação e auditoria do corpus.', 'Amostragem aleatória estratificada e exportação rastreável.'],
    evidence: 'Pesquisa em desenvolvimento. A validação metodológica está pendente e o sorteio definitivo da amostra ainda não foi executado. Não são apresentados artigos publicados nem resultados conclusivos.',
    participation: 'Ferramentas de experimentação em pesquisa apresentadas no README.',
    diagram: ['Issues & pull requests', 'Auditoria do corpus', 'Amostragem estratificada', 'Classificação com LLMs'],
  },
  {
    slug: 'nail-manager', number: '05', name: 'Nail Manager', subtitle: 'Organização para quem cria.',
    category: 'Desktop & algoritmos', status: 'Aplicação desktop', accent: 'violet',
    description: 'Agenda, clientes, serviços e finanças para profissionais de manicure e nail design.',
    tech: ['Java', 'JavaFX', 'SQLite', 'Apache PDFBox'],
    problem: 'Reunir a organização de atendimentos, clientes, serviços e movimentações financeiras de profissionais de manicure e nail design.',
    architecture: 'A aplicação separa domínio, casos de uso, persistência e apresentação. Interfaces de repositório desacoplam as regras de negócio do acesso ao banco de dados.',
    solution: ['Agenda e gestão de clientes e serviços.', 'Políticas de desconto.', 'Consulta de fluxo de caixa.', 'Relatórios exportáveis em PDF.'],
    evidence: 'Aplicação desktop com código disponível no repositório. A fonte não informa métricas de adoção.',
    participation: 'Projeto apresentado no portfólio.', image: nail, imageAlt: 'Tela real de entrada do Nail Manager, com identidade roxa e formulário de acesso.',
    repository: 'https://github.com/IrlanBarros/nail-manager.git',
    diagram: ['Interface · JavaFX', 'Casos de uso', 'Repositórios · SQLite', 'Relatórios · PDFBox'],
  },
  {
    slug: 'pokegrafo', number: '06', name: 'PokeGrafo', subtitle: 'Algoritmos em uma nova jornada.',
    category: 'Desktop & algoritmos', status: 'Projeto acadêmico em equipe', accent: 'amber',
    description: 'Uma simulação interativa para explorar percursos, caminhos mínimos e movimentação em um grafo ponderado.',
    tech: ['Python', 'Tkinter', 'pytest'],
    problem: 'Aplicar conceitos da disciplina de Algoritmos em Grafos da UFCA em uma simulação interativa com regras de movimentação.',
    architecture: 'O projeto implementa lista de adjacência, heap mínimo, Dijkstra, BFS e DFS sem bibliotecas prontas de grafos. Há testes dos algoritmos e do domínio.',
    solution: ['Percursos em grafo com BFS e DFS.', 'Caminhos mínimos com Dijkstra e heap mínimo.', 'Simulação interativa com Python e Tkinter.', 'Testes dos algoritmos e das regras do domínio.'],
    evidence: 'Projeto em equipe da disciplina de Algoritmos em Grafos. Minha contribuição documentada abrange DFS e a identificação do vértice mais distante.',
    participation: 'DFS e identificação do vértice mais distante.',
    repository: 'https://github.com/Aqu4tro/PokeGrafo',
    diagram: ['Grafo ponderado', 'Percursos · BFS / DFS', 'Caminhos · Dijkstra', 'Simulação · Tkinter'],
  },
];

export const sections = [
  { id: 'sobre', label: 'Sobre mim', exploration: 'Perfil', number: '01' },
  { id: 'projetos', label: 'Projetos', exploration: 'Missões', number: '02' },
  { id: 'habilidades', label: 'Habilidades', exploration: 'Competências', number: '03' },
  { id: 'trajetoria', label: 'Experiência e formação', exploration: 'Trajetória', number: '04' },
  { id: 'pesquisa', label: 'Pesquisa', exploration: 'Laboratório', number: '05' },
  { id: 'contato', label: 'Contato', exploration: 'Próxima conexão', number: '06' },
];

export const experience = [
  { period: 'JAN 2026 — ATUAL', title: 'Professor de robótica', organization: 'Instituto José Bernardino', kind: 'Ensino', description: 'Ensino de robótica para turmas do 5º ao 9º ano do Ensino Fundamental.', tech: ['Robótica', 'Educação'] },
  { period: 'OUT 2024 — OUT 2025', title: 'Desenvolvedor Full Stack', organization: 'Grupo Intra de Ensino e Pesquisa a Distância', kind: 'Desenvolvimento', description: 'Desenvolvimento e manutenção de aplicações web, interfaces e infraestrutura.', tech: ['PHP', 'Laravel', 'CodeIgniter', 'MySQL', 'Vue', 'React', 'Docker', 'GitHub Actions'] },
  { period: 'MAR 2024 — SET 2024', title: 'Desenvolvedor web bolsista', organization: 'BRISA Sociedade para o Desenvolvimento da T.I.', kind: 'Desenvolvimento', description: 'Desenvolvimento de aplicações web com atenção à segurança e às boas práticas.', tech: ['Laravel', 'MySQL', 'Bootstrap'] },
  { period: 'AGO 2023 — AGO 2024', title: 'Extensionista voluntário', organization: 'Pensamento Computacional · UFCA', kind: 'Extensão', description: 'Elaboração de atividades e exercícios de lógica matemática e programação para estudantes do Ensino Médio.', tech: ['Lógica', 'Programação', 'Educação'] },
];

export const education = [
  { period: '2023 — EM ANDAMENTO', title: 'Ciência da Computação', organization: 'Universidade Federal do Cariri', detail: 'Bacharelado' },
  { period: '2020 — 2022', title: 'Redes de Computadores', organization: 'EEEP Otília Correia Saraiva', detail: 'Curso técnico' },
];

export const skillGroups = [
  { name: 'Linguagens', code: '01', skills: ['PHP', 'Python', 'TypeScript', 'JavaScript', 'Java', 'C'] },
  { name: 'Desenvolvimento web', code: '02', skills: ['React', 'Vue', 'Laravel', 'CodeIgniter', 'FastAPI', 'Integração de APIs'] },
  { name: 'Dados & persistência', code: '03', skills: ['MySQL', 'PostgreSQL', 'SQLite', 'SQLAlchemy', 'Alembic'] },
  { name: 'Engenharia de software', code: '04', skills: ['Orientação a objetos', 'Modelagem de domínio', 'Separação em camadas', 'Casos de uso', 'pytest', 'Vitest'] },
  { name: 'Infraestrutura', code: '05', skills: ['Docker', 'Docker Compose', 'GitHub Actions'] },
  { name: 'Sistemas embarcados', code: '06', skills: ['ESP32', 'ESP-IDF', 'FreeRTOS', 'MQTT', 'Máquinas de estados'] },
  { name: 'Experimentação em pesquisa', code: '07', skills: ['LLMs', 'Validação de dados', 'Amostragem estratificada', 'Rastreabilidade'] },
];

// Só associa habilidades quando há evidência explícita no README.
export const skillProjectLinks: Record<string, string[]> = {
  'ESP32': ['flowcount'], 'Máquinas de estados': ['flowcount'],
  'Modelagem de domínio': ['ilarica', 'nail-manager'],
  'Separação em camadas': ['ilarica', 'nail-manager'],
  'Casos de uso': ['ilarica', 'nail-manager'],
  'Validação de dados': ['blockchain-research'],
  'Amostragem estratificada': ['blockchain-research'],
  'Rastreabilidade': ['blockchain-research'],
};

export function relatedProjects(skill: string) {
  return projects.filter(p => p.tech.includes(skill) || skillProjectLinks[skill]?.includes(p.slug));
}

export const achievements = [
  { id: 'project', title: 'Primeira missão', description: 'Abra um estudo de caso.' },
  { id: 'skills', title: 'Conexões descobertas', description: 'Explore uma competência.' },
  { id: 'research', title: 'Espírito investigador', description: 'Conheça o laboratório de pesquisa.' },
  { id: 'avatars', title: 'Outras perspectivas', description: 'Experimente três estilos de avatar.' },
  { id: 'complete', title: 'Jornada completa', description: 'Visite as seis seções principais.' },
];
