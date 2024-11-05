let samplesSets = [[], [], []];
let animations = [];
let currentSetIndex = 0;

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

function resumeAudioContext() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume().then(() => {
            console.log('Audio Context resumed on iOS');
        });
    }
}

function playSilentAudio() {
    const silence = new p5.SoundFile();
    silence.playMode('sustain');
    silence.play();
    silence.stop();
}

function preload() {
 playSilentAudio(); 
  const loadSounds = (prefix, start, end, index) => {
    for (let i = start; i <= end; i++) {
      samplesSets[index].push(
        loadSound(
          `${prefix}_${i}.mp3`,
          () => {
            console.log(`Loaded ${prefix}_${i}.mp3`);
          },
          (err) => {
            console.error(`Failed to load ${prefix}_${i}.mp3`, err);
          }
        )
      );
    }
  };

  loadSounds("1st", 0, 9, 0);
  loadSounds("2nd", 11, 20, 1);
  loadSounds("3rd", 21, 30, 2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(RGB, 255);
  textAlign(CENTER, CENTER);
  textSize(24);
  resumeAudioContext();
}



function draw() {
  background(backgroundColors[currentSetIndex]);
  animations.forEach((anim) => anim.draw());
  animations = animations.filter((anim) => anim.alpha > 0); // Remove faded-out animations
}

let isFirstInteraction = true;

function touchStarted() {
  if (isFirstInteraction) {
        reinitializeAudio();
        isFirstInteraction = false;
    }
  handleInteraction(touches[0].x);
  resumeAudioContext();
}

function reinitializeAudio() {
    samplesSets.forEach((set) => {
        set.forEach((sample) => {
            sample.stop();
            sample.play();
            sample.stop(); 
        });
    });
    console.log('Audio reinitialized on first interaction');
}

function mousePressed() {
  if (isComputer()) {
    handleInteraction(mouseX);
  }
  resumeAudioContext();
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
  resumeAudioContext();
  const samples = samplesSets[currentSetIndex];
  const colors = colorPalettes[currentSetIndex];
  const animationClass = Animations[index];

  if (animationClass) {
    resumeAudioContext();
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

// Animation Classes
class Anim_0 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.size = 20;
    this.angle = random(TWO_PI);
  }

  draw() {
    this.fillWithAlpha();
    const x = width / 2 + 100 * cos(this.angle);
    const y = height / 2 + 100 * sin(this.angle);
    ellipse(x, y, this.size, this.size);
    this.size += 5;
    this.angle += 0.1;
    this.fadeOut();
  }
}

class Anim_1 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.size = 20; // Start larger
  }

  draw() {
    this.fillWithAlpha();
    rect(width / 4, height / 2 - 25, this.size, 100);
    this.size += 5; // Faster increase
    this.fadeOut();
  }
}

class Anim_2 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.angle = 0;
    this.size = 300; // Start larger
  }

  draw() {
    this.fillWithAlpha();
    push();
    translate(width / 2, height / 2);
    rotate(this.angle);
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
    this.angle += 0.1; // Increased rotation speed
    this.fadeOut();
  }
}

class Anim_3 extends BaseAnimation {
  constructor(color) {
    super(color);
  }

  draw() {
    this.fillWithAlpha();
    rect(0, 0, width, height);
    this.fadeOut();
  }
}

class Anim_4 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.posy = height + 50; // Starting position
  }

  draw() {
    this.fillWithAlpha();
    rect(0, this.posy - 50, width, 70);
    this.posy *= 0.9; // Faster descent
    this.fadeOut();
  }
}

class Anim_5 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.posy = height + 50;
  }

  draw() {
    this.fillWithAlpha();
    rect(0, this.posy - 50, width, 50);
    rect(0, height - this.posy, width, 50);
    this.posy *= 0.95; // Faster downward movement
    this.fadeOut();
  }
}

class Anim_6 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.size = 80; // Maintain size
    this.x = random(width);
    this.y = random(height);
  }

  draw() {
    this.fillWithAlpha();
    ellipse(this.x, this.y, this.size, this.size);
    this.fadeOut();
  }
}

class Anim_7 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.angle = 0;
    this.size = 100; // Start larger
    this.amplitude = 50; // Increased amplitude for more dynamic movement
  }

  draw() {
    this.fillWithAlpha();
    const x = width / 2 + this.size * cos(this.angle);
    const y =
      height / 2 +
      this.size * sin(this.angle) +
      this.amplitude * sin(frameCount * 0.1);
    ellipse(x, y, this.size * 1.5, this.size * 1.5); // Bigger ellipses
    this.angle += 0.1; // Increased rotation speed
    this.size += 0.5; // Slightly faster size increase
    this.fadeOut();
  }
}

class Anim_8 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.height = 0;
  }

  draw() {
    this.fillWithAlpha();
    noStroke();
    rect(0, height / 2 - this.height / 2, width, this.height);
    this.height = min(this.height + 6, height); // Faster growth
    this.fadeOut();
  }
}

class Anim_9 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.x = -width;
    this.speed = 70; // Faster speed
    this.alpha = 255;
    this.hasCovered = false;
    this.isActive = true;
  }

  draw() {
    if (!this.isActive) return;

    noStroke();
    this.fillWithAlpha();

    if (!this.hasCovered) {
      rect(this.x, 0, width, height);
      this.x += this.speed * 0.1; // Faster transition speed
      if (this.x >= 0) {
        this.hasCovered = true;
      }
    } else {
      this.alpha = max(0, this.alpha - 4); // Faster fade out
      if (this.alpha === 0) {
        this.isActive = false;
      } else {
        fill(255, this.alpha);
        rect(0, 0, width, height);
      }
    }
  }
}

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Function to detect if the user is on a computer
function isComputer() {
  return !/Mobi|Android/i.test(navigator.userAgent);
}
