import type { Contact } from '../types';

export const mockContacts: Contact[] = [
  {
    id: 'joao',
    name: 'João',
    email: 'joao@email.com',
    status: 'online',
    addedAt: '2026-01-15',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    email: 'carlos@email.com',
    status: 'online',
    addedAt: '2026-02-10',
  },
  {
    id: 'pedro',
    name: 'Pedro',
    email: 'pedro@email.com',
    status: 'offline',
    addedAt: '2026-03-05',
  },
  {
    id: 'maria',
    name: 'Maria',
    email: 'maria@email.com',
    status: 'away',
    addedAt: '2026-04-20',
  },
  {
    id: 'ana',
    name: 'Ana',
    email: 'ana@email.com',
    status: 'busy',
    addedAt: '2026-05-12',
  },
  {
    id: 'lucas',
    name: 'Lucas',
    email: 'lucas@email.com',
    status: 'online',
    addedAt: '2026-06-08',
  },
];

export const mockChannels = [
  {
    id: 'equipe-operacional',
    name: 'Equipe Operacional',
    description: 'Comunicação da equipe',
    icon: 'radio-outline',
    members: [
      'ronaldo',
      'joao',
      'carlos',
      'pedro',
      'maria',
      'ana',
      'lucas',
      'user1',
      'user2',
      'user3',
      'user4',
      'user5',
    ],
    createdBy: 'ronaldo',
    createdAt: '2026-01-01',
  },
  {
    id: 'familia',
    name: 'Família',
    description: 'Canal privado da família',
    icon: 'people-outline',
    members: ['ronaldo', 'joao', 'maria', 'ana'],
    createdBy: 'ronaldo',
    createdAt: '2026-02-01',
  },
  {
    id: 'seguranca',
    name: 'Segurança',
    description: 'Canal da equipe de segurança',
    icon: 'shield-outline',
    members: ['ronaldo', 'carlos', 'pedro', 'lucas'],
    createdBy: 'carlos',
    createdAt: '2026-03-15',
  },
];
