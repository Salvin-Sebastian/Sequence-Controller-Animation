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

const alices = [
  document.getElementById("alice1"),
  document.getElementById("alice2"),
  document.getElementById("alice3")
];

const selector = document.getElementById("pattern-select");
const playBtn = document.getElementById("play-btn");
const btnText = playBtn.querySelector(".btn-text");

// Helper to reset animations
function resetAlices() {
  alices.forEach(alice => {
    if(!alice) return;
    // Cancel any ongoing Web Animations
    alice.getAnimations().forEach(anim => anim.cancel());
    alice.classList.remove('active');
  });
}

// Wrap animation in a helper to add glow class
async function playAnimation(element) {
  if(!element) return;
  element.classList.add('active');
  const animation = element.animate(aliceTumbling, aliceTiming);
  await animation.finished;
  element.classList.remove('active');
}

async function runSequence() {
  const mode = selector.value;
  
  // Disable button during animation
  playBtn.disabled = true;
  if (btnText) btnText.textContent = "Sequence Active...";
  
  resetAlices();

  try {
    if (mode === 'linear') {
      await playAnimation(alices[0]);
      await playAnimation(alices[1]);
      await playAnimation(alices[2]);
    } 
    else if (mode === 'reverse') {
      await playAnimation(alices[2]);
      await playAnimation(alices[1]);
      await playAnimation(alices[0]);
    } 
    else if (mode === 'random') {
      const shuffled = [...alices].sort(() => Math.random() - 0.5);
      for (const alice of shuffled) {
        await playAnimation(alice);
      }
    } 
    else if (mode === 'center') {
      await playAnimation(alices[1]);
      await Promise.all([playAnimation(alices[0]), playAnimation(alices[2])]);
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(`Sequence error: ${error}`);
    }
  } finally {
    // Re-enable button
    playBtn.disabled = false;
    if (btnText) btnText.textContent = "Initiate Sequence";
  }
}

playBtn.addEventListener('click', runSequence);
