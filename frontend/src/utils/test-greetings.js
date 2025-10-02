// Test script to demonstrate different greetings
import { getPersonalizedGreeting } from './greetings.js';

console.log('=== Time-based Greeting Examples ===\n');

// Simulate different times of day
const testTimes = [
  { hour: 8, label: 'Morning (8 AM)' },
  { hour: 14, label: 'Afternoon (2 PM)' },
  { hour: 19, label: 'Evening (7 PM)' },
  { hour: 23, label: 'Night (11 PM)' }
];

testTimes.forEach(({ hour, label }) => {
  // Mock the current hour for testing
  const originalGetHours = Date.prototype.getHours;
  Date.prototype.getHours = () => hour;
  
  const greeting = getPersonalizedGreeting('Amit Mohan');
  
  console.log(`${label}:`);
  console.log(`  ${greeting.greeting} ${greeting.emoji}`);
  console.log(`  ${greeting.message}`);
  console.log('');
  
  // Restore original function
  Date.prototype.getHours = originalGetHours;
});

console.log('=== Current Time Greeting ===');
const currentGreeting = getPersonalizedGreeting('Amit Mohan');
console.log(`${currentGreeting.greeting} ${currentGreeting.emoji}`);
console.log(currentGreeting.message);
