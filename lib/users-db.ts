import fs from 'fs';
import path from 'path';
import { User } from '@/types';

const dataPath = path.join(process.cwd(), 'lib', 'users.json');

export function getUsers(): User[] {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read users', error);
    return [];
  }
}

export function saveUsers(users: User[]) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Failed to save users', error);
  }
}
