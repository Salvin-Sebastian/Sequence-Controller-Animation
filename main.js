const shapes = [
  document.getElementById('shape-0'),
  document.getElementById('shape-1'),
  document.getElementById('shape-2'),
  document.getElementById('shape-3'),
  document.getElementById('shape-4')
];

const playBtn = document.getElementById('play-btn');
const patternSelect = document.getElementById('pattern-select');
let isAnimating = false;

// We dynamically generate keyframes so the drop-shadow matches the shape's specific color variable
function getPopKeyframes(element) {
  // Get the computed color variable from CSS
  const style = getComputedStyle(element);
  const color = style.getPropertyValue('--clr').trim() || '#fff';
  
  return [
    { 
      transform: 'translate3d(0, 0, 0) scale(1) rotateX(0) rotateY(0) rotateZ(0)', 
      filter: `drop-shadow(0 0 0 rgba(0,0,0,0)) brightness(1)`,
      borderRadius: 'inherit'
    },
    { 
      // The peak of the jump: flips completely in 3D, scales up, morphs to a circle, and glows intensely
      transform: 'translate3d(0, -60px, 100px) scale(1.4) rotateX(180deg) rotateY(180deg) rotateZ(45deg)', 
      filter: `drop-shadow(0 20px 25px ${color}) brightness(1.6)`,
      borderRadius: '50%',
      offset: 0.5 
    },
    { 
      // Landing back into position, completing a 360 degree 3D rotation
      transform: 'translate3d(0, 0, 0) scale(1) rotateX(360deg) rotateY(360deg) rotateZ(0)', 
      filter: `drop-shadow(0 0 0 rgba(0,0,0,0)) brightness(1)`,
      borderRadius: 'inherit'
    }
  ];
}

const popTiming = {
  duration: 750, // Longer duration to appreciate the 3D flip
  iterations: 1,
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring-like bounce easing
};

// Play step helper
async function playStep(elements) {
  if (!Array.isArray(elements)) {
    elements = [elements];
  }
  
  const promises = elements.map(el => {
    // Generate custom keyframes for this specific element to use its color
    const keyframes = getPopKeyframes(el);
    return el.animate(keyframes, popTiming).finished;
  });
  
  return Promise.all(promises);
}

// Sequencing patterns
async function sequenceLinear() {
  for (let i = 0; i < shapes.length; i++) {
    await playStep(shapes[i]);
  }
}

async function sequenceReverse() {
  for (let i = shapes.length - 1; i >= 0; i--) {
    await playStep(shapes[i]);
  }
}

async function sequenceCenter() {
  await playStep(shapes[2]);
  await playStep([shapes[1], shapes[3]]);
  await playStep([shapes[0], shapes[4]]);
}

async function sequenceRandom() {
  const indices = [0, 1, 2, 3, 4];
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (const idx of indices) {
    await playStep(shapes[idx]);
  }
}

// Button click handler
playBtn.addEventListener('click', async () => {
  if (isAnimating) return;
  isAnimating = true;
  
  // Cool button state during animation
  playBtn.style.opacity = '0.7';
  playBtn.style.transform = 'scale(0.95)';
  playBtn.querySelector('.btn-text').textContent = 'Sequence Active...';

  const pattern = patternSelect.value;
  
  try {
    if (pattern === 'linear') {
      await sequenceLinear();
    } else if (pattern === 'reverse') {
      await sequenceReverse();
    } else if (pattern === 'center') {
      await sequenceCenter();
    } else if (pattern === 'random') {
      await sequenceRandom();
    }
  } catch (error) {
    console.error('Animation error:', error);
  } finally {
    isAnimating = false;
    playBtn.style.opacity = '1';
    playBtn.style.transform = '';
    playBtn.querySelector('.btn-text').textContent = 'Initiate Sequence';
  }
});
