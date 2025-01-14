import { startServer } from './task19/serverService.ts';

try {
   startServer();
} catch (error) {
  console.error('Server error:', error);
}
