const shapes = [
  document.getElementById('shape-0'),
  document.getElementById('shape-1'),
  document.getElementById('shape-2'),
  document.getElementById('shape-3'),
  document.getElementById('shape-4')
];

const playBtn = document.getElementById('play-btn');
const patternSelect = document.getElementById('pattern-select');

// Reset function to clear ongoing animations
function resetShapes() {
  shapes.forEach(shape => {
    if(!shape) return;
    shape.getAnimations().forEach(anim => anim.cancel());
  });
}

function getPopKeyframes(element) {
  const style = getComputedStyle(element);
  const color = style.getPropertyValue('--clr').trim() || '#fff';
  
  return [
    { 
      transform: 'translate3d(0, 0, 0) scale(1) rotateX(0)', 
      filter: `drop-shadow(0 0 0 rgba(0,0,0,0)) brightness(1)`,
      borderRadius: 'inherit'
    },
    { 
      transform: 'translate3d(0, -60px, 100px) scale(1.3) rotateX(180deg)', 
      filter: `drop-shadow(0 20px 25px ${color}) brightness(1.6)`,
      borderRadius: '50%',
      offset: 0.5 
    },
    { 
      transform: 'translate3d(0, 0, 0) scale(1) rotateX(360deg)', 
      filter: `drop-shadow(0 0 0 rgba(0,0,0,0)) brightness(1)`,
      borderRadius: 'inherit'
    }
  ];
}

const popTiming = {
  duration: 800,
  iterations: 1,
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
};

async function playStep(elements) {
  if (!Array.isArray(elements)) elements = [elements];
  const promises = elements.map(el => {
    if(!el) return Promise.resolve();
    const keyframes = getPopKeyframes(el);
    return el.animate(keyframes, popTiming).finished;
  });
  return Promise.all(promises);
}

async function sequenceLinear() {
  for (let i = 0; i < shapes.length; i++) await playStep(shapes[i]);
}

async function sequenceReverse() {
  for (let i = shapes.length - 1; i >= 0; i--) await playStep(shapes[i]);
}

async function sequenceCenter() {
  await playStep(shapes[2]);
  await playStep([shapes[1], shapes[3]]);
  await playStep([shapes[0], shapes[4]]);
}

async function sequenceRandom() {
  const indices = [0, 1, 2, 3, 4];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (const idx of indices) await playStep(shapes[idx]);
}

playBtn.addEventListener('click', async () => {
  if (playBtn.disabled) return;
  
  playBtn.disabled = true;
  playBtn.querySelector('.btn-text').textContent = 'Sequence Active...';
  
  resetShapes();
  const pattern = patternSelect.value;
  
  try {
    if (pattern === 'linear') await sequenceLinear();
    else if (pattern === 'reverse') await sequenceReverse();
    else if (pattern === 'center') await sequenceCenter();
    else if (pattern === 'random') await sequenceRandom();
  } catch (error) {
    if (error.name !== 'AbortError') console.error('Animation error:', error);
  } finally {
    playBtn.disabled = false;
    playBtn.querySelector('.btn-text').textContent = 'Initiate Sequence';
  }
});
