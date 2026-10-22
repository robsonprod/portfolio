// Contrato do conteúdo. en.ts e pt.ts precisam satisfazer este tipo:
// se faltar uma tradução, o build quebra.

export type Lang = 'en' | 'pt';

export type IconName =
  | 'server' | 'cloud' | 'monitor' | 'sparkles' | 'briefcase' | 'graduation' | 'globe'
  | 'mail' | 'linkedin' | 'github' | 'map-pin' | 'arrow-right' | 'external' | 'moon' | 'sun'
  | 'menu' | 'x' | 'send' | 'check' | 'code' | 'bot';

export interface FocusArea {
  icon: IconName;
  title: string;
  description: string;
  tags: string[];
}

export interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  client?: string;
  highlights: string[];
  stack: string[];
}

export interface Project {
  name: string;
  description: string;
  highlights: string[];
  tags: string[];
  repo: string; // vazio = ainda não publicado
  status: 'live' | 'in-progress' | 'planned';
}

export interface Content {
  meta: { title: string; description: string };
  nav: { home: string; experience: string; projects: string; contact: string; hire: string };
  a11y: { toggleTheme: string; toggleLang: string; openMenu: string; closeMenu: string; photo: string };
  home: {
    badge: string;
    hello: string;
    role: string;
    headline: string;
    intro: string;
    ctaHire: string;
    ctaExperience: string;
    highlights: { value: string; label: string }[];
    focusEyebrow: string;
    focusTitle: string;
    focusSubtitle: string;
    focus: FocusArea[];
    process: {
      eyebrow: string;
      title: string;
      subtitle: string;
      steps: { title: string; text: string; tools: string }[];
    };
    stackTitle: string;
    band: { title: string; text: string; button: string };
  };
  experience: {
    eyebrow: string;
    title: string;
    subtitle: string;
    clientLabel: string;
    jobs: Job[];
    skillsTitle: string;
    skills: { name: string; items: string[] }[];
    educationTitle: string;
    education: { title: string; institution: string; period: string }[];
    languagesTitle: string;
    languages: string[];
  };
  projects: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewCode: string;
    soon: string;
    status: Record<Project['status'], string>;
    items: Project[];
    moreTitle: string;
    moreText: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    channelsTitle: string;
    location: string;
    availability: string;
    form: {
      title: string;
      name: string;
      email: string;
      message: string;
      send: string;
      sending: string;
      sentTitle: string;
      sentText: string;
      error: string;
      rateLimited: string;
      errors: { name: string; email: string; message: string };
    };
  };
  footer: { built: string };
}
