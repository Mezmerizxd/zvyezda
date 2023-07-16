import { Accounts } from '@prisma/client';

export const accounts: Accounts[] = [
  {
    id: '1',
    email: 'developer@zvyezda.com',
    username: 'Developer',
    password: 'zvyezda',
    token: null,
    tokenExp: null,
    role: 'DEVELOPER',
    avatar: null,
    biography: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
