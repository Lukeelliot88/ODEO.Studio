let samplesSets = [[], [], []];
let animations = [];
let currentSetIndex = 0;
let audioContextResumed = false;

// Brighter Color Palettes for animations
const colorPalettes = [
  ["#E46A43", "#9B8E32", "#BD96AD", "#DBF585", "#86BEEB"], // Modern Set 1
  ["#86BEEB", "#DBF585", "#9B8E32", "#BD96AD", "#E46A43"], // Modern Set 2
  ["#86BEEB", "#BD96AD", "#E46A43", "#DBF585", "#9B8E32"], // Modern Set 3
];

// Background Colors
const backgroundColors = [
  "#E3E4D7", // Light background for Set 1
  "#EDCCB4", // Deep background for Set 2
  "#444B37", // Dark background for Set 3
];

// Function to resume the audio context when user interacts with the page
function resumeAudioContext() {
  if (!audioContextResumed && getAudioContext().state !== 'running') {
    getAudioContext().resume().then(() => {
      console.log('Audio Context resumed on user interaction.');
      audioContextResumed = true;
    });
  }
}

// Preload function to load all the sounds
function preload() {
  const loadSounds = (prefix, start, end, index) => {
    for (let i = start; i <= end; i++) {
      samplesSets[index].push(
        loadSound(
          `${prefix}_${i}.aac`,  // Make sure the file extensions are correct (.aac)
          () => {
            console.log(`Loaded ${prefix}_${i}.m4a`);
          },
          (err) => {
            console.error(`Failed to load ${prefix}_${i}.m4a`, err);
          }
        )
      );
    }
  };

  loadSounds("1st", 0, 9, 0);
  loadSounds("2nd", 11, 20, 1);
  loadSounds("3rd", 21, 30, 2);
}

// Setup function where we initialize everything
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(RGB, 255);
  textAlign(CENTER, CENTER);
  textSize(24);
}

// Draw function is repeatedly called
function draw() {
  background(backgroundColors[currentSetIndex]);
  animations.forEach((anim) => anim.draw());
  animations = animations.filter((anim) => anim.alpha > 0); // Remove faded-out animations
}

// Touch or click event to trigger audio context and interactions
function touchStarted() {
  resumeAudioContext();
  handleInteraction(touches[0].x);
}

function mousePressed() {
  resumeAudioContext();
  handleInteraction(mouseX);
}

function keyPressed() {
  if (key >= "0" && key <= "9") {
    const index = parseInt(key);
    playAnimation(index);
  } else if (key === " ") {
    toggleAnimationSet(); // Toggle set with space bar
  }
}

function handleInteraction(x) {
  const index = floor(map(x, 0, width, 0, 11)); // Map to 11 blocks (0-9 + toggle)

  if (index === 10) {
    toggleAnimationSet(); // Toggle set if touching the last block
  } else if (index >= 0 && index < 10) {
    playAnimation(index); // Play animation corresponding to the block
  }
}

function playAnimation(index) {
  const samples = samplesSets[currentSetIndex];
  const colors = colorPalettes[currentSetIndex];
  const animationClass = Animations[index];

  if (animationClass) {
    resumeAudioContext(); // Ensure audio context is resumed before playing sound
    samples[index].play();
    const newAnim = new animationClass(random(colors));
    animations.push(newAnim);
    if (animations.length > 10) animations.shift(); // Limit animations
  } else {
    console.error(`Animation class for index ${index} is undefined.`);
  }
}

function toggleAnimationSet() {
  currentSetIndex = (currentSetIndex + 1) % 3;
  animations = []; // Clear current animations on toggle
}

// Base Animation Class
class BaseAnimation {
  constructor(color) {
    this.color = color;
    this.alpha = 255;
    this.fadeRate = 2; // Fade out rate
  }

  fadeOut() {
    this.alpha = max(0, this.alpha - this.fadeRate);
  }

  fillWithAlpha() {
    fill(`${this.color}${hex(this.alpha, 2)}`);
  }
}

// Your animation classes (Anim_0, Anim_1, etc.) would go here, unchanged.

// Map keys to animations
const Animations = {
  0: Anim_0,
  1: Anim_1,
  2: Anim_2,
  3: Anim_3,
  4: Anim_4,
  5: Anim_5,
  6: Anim_6,
  7: Anim_7,
  8: Anim_8,
  9: Anim_9,
};

// Resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Function to detect if the user is on a computer
function isComputer() {
  return !/Mobi|Android/i.test(navigator.userAgent);
}
