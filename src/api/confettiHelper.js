import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  // Center blast
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
  });
  
  // Side cannons after a tiny delay
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899']
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899']
    });
  }, 150);
};

export const triggerLevelUpConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 45 * (timeLeft / duration);
    
    // Confetti showers from both sides
    confetti({ 
      ...defaults, 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
    });
    confetti({ 
      ...defaults, 
      particleCount, 
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
    });
  }, 250);
};
