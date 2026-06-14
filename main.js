const aliceTumbling = [
  { transform: 'rotate(0) scale(1)', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5)) brightness(1)' },
  { transform: 'rotate(360deg) scale(0)', filter: 'drop-shadow(0 0 30px rgba(167, 139, 250, 0.8)) brightness(1.5)' }
];

const aliceTiming = {
  duration: 1000,
  iterations: 1,
  fill: 'forwards',
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Bouncy easing
};

const alice1 = document.querySelector("#alice1");
const alice2 = document.querySelector("#alice2");
const alice3 = document.querySelector("#alice3");
const alices = [alice1, alice2, alice3];

const selector = document.querySelector("#sequence-selector");
const playBtn = document.querySelector("#play-button");

// Helper to reset animations
function resetAlices() {
  alices.forEach(alice => {
    // Cancel any ongoing Web Animations
    alice.getAnimations().forEach(anim => anim.cancel());
    alice.classList.remove('active');
  });
}

// Wrap animation in a helper to add glow class
async function playAnimation(element) {
  element.classList.add('active');
  const animation = element.animate(aliceTumbling, aliceTiming);
  await animation.finished;
  element.classList.remove('active');
}

async function runSequence() {
  const mode = selector.value;
  
  // Disable button during animation
  playBtn.disabled = true;
  playBtn.textContent = "Sequence Active...";
  
  resetAlices();

  try {
    if (mode === 'linear') {
      // Linear Matrix (L → R)
      await playAnimation(alice1);
      await playAnimation(alice2);
      await playAnimation(alice3);
    } 
    else if (mode === 'reverse') {
      // Reverse Echo (R → L)
      await playAnimation(alice3);
      await playAnimation(alice2);
      await playAnimation(alice1);
    } 
    else if (mode === 'random') {
      // Quantum Chaos (Random)
      const shuffled = [...alices].sort(() => Math.random() - 0.5);
      for (const alice of shuffled) {
        await playAnimation(alice);
      }
    } 
    else if (mode === 'nova') {
      // Nova Core (Center Out)
      await playAnimation(alice2);
      await Promise.all([playAnimation(alice1), playAnimation(alice3)]);
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(`Sequence error: ${error}`);
    }
  } finally {
    // Re-enable button
    playBtn.disabled = false;
    playBtn.textContent = "Initiate Sequence";
  }
}

playBtn.addEventListener('click', runSequence);
