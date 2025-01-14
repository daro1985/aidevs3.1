import { startServer } from './task19/serverService';

try {
   startServer();
} catch (error) {
  console.error('Server error:', error);
}
