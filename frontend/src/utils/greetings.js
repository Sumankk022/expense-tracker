// Utility function to get time-based greeting
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good Morning',
      emoji: '🌅',
      message: 'Start your day with financial awareness!',
      timeOfDay: 'morning'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good Afternoon',
      emoji: '☀️',
      message: 'Keep track of your midday expenses!',
      timeOfDay: 'afternoon'
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good Evening',
      emoji: '🌆',
      message: 'Review your day\'s spending!',
      timeOfDay: 'evening'
    };
  } else {
    return {
      greeting: 'Good Night',
      emoji: '🌙',
      message: 'Time to rest and plan for tomorrow!',
      timeOfDay: 'night'
    };
  }
};

// Get personalized greeting with user name
export const getPersonalizedGreeting = (userName = 'Suman K K') => {
  const { greeting, emoji, message, timeOfDay } = getTimeBasedGreeting();
  
  // Add more personalized messages based on time of day
  const personalizedMessages = {
    morning: [
      'Start your day with financial awareness!',
      'Plan your expenses for the day ahead!',
      'Morning is the perfect time to review your budget!'
    ],
    afternoon: [
      'Keep track of your midday expenses!',
      'How\'s your spending going today?',
      'Afternoon check-in on your financial goals!'
    ],
    evening: [
      'Review your day\'s spending!',
      'Evening reflection on your expenses!',
      'Time to wrap up and plan for tomorrow!'
    ],
    night: [
      'Time to rest and plan for tomorrow!',
      'Night time - perfect for budget planning!',
      'End your day with financial peace of mind!'
    ]
  };
  
  const randomMessage = personalizedMessages[timeOfDay][Math.floor(Math.random() * personalizedMessages[timeOfDay].length)];
  
  return {
    greeting: `${greeting}, ${userName}`,
    emoji,
    message: randomMessage,
    timeOfDay
  };
};
