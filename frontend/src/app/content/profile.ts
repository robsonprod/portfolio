// Dados que não mudam com o idioma.
export const PROFILE = {
  name: 'Robson Azevedo',
  initials: 'RA',
  photo: '/img/profile.jpg', // coloque sua foto em public/img/profile.jpg (quadrada, >= 600px)
  // E-mail separado em partes e montado só no navegador: não aparece no HTML pré-renderizado (anti-scraping).
  emailParts: ['rbsazevedo', 'gmail.com'] as const,
  links: {
    linkedin: 'https://www.linkedin.com/in/robson-azevedo-56499223',
    github: '', // ex.: 'https://github.com/seu-usuario'
  },
  stack: [
    'LangChain', 'OpenSpec', 'Claude Code', 'MCP', 'RAG', 'Python',
    'Java', 'Kotlin', 'Spring Boot', 'Apache Kafka', 'AWS', 'Terraform', 'Kubernetes',
    'Docker', 'DynamoDB', 'PostgreSQL', 'Cassandra', 'Redis', 'Angular', 'TypeScript', 'Next.js',
  ],
};
