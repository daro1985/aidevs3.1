import { startServer } from './task19/serverService';

try {
  await startServer();
} catch (error) {
  console.error('Server error:', error);
}
