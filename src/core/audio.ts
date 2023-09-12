// export const warning = (i) => {
//   var n=2e4;
//   if (i > n) return null;
//   return Math.sin(i/20 - Math.sin(i/100)*Math.sin(i/61))  *Math.sin(2 * i / 2e4 * Math.PI) * 0.5;
// }

// export const notification = (i) => {
//   var n=8e3;
//   if (i > n) return null;
//   return Math.sin(i/5 - Math.sin(i/2))  *Math.sin(i / (n/2) * Math.PI) * 0.2;
// }

// const t = (i: number, n: number) => (n-i)/n;

// export const arrowKeySound = (i: number) => {
//   const n = 0.44e4;
//   const freq = 1.04;
//   if (i > n) return null;
//   const q = 0.5 * Math.pow(t(i, n), 0.5);
//   return (Math.pow(i, freq) & 98) ? q : -q;
// };

// export const haow = i => {
//   var n=2e4;
//   if (i > n) return null;
//   i = n - i
//   return Math.sin(i*0.0006*Math.sin(0.009*i)+Math.sin(i/400))*(n-i)/n*0.5;
// }

let a: AudioContext;
let b: AudioContext;
let noise: AudioBufferSourceNode | null;
const musicVolume = 0.3;
const noiseVolume = 0.3;
const duration = 0.25;

// Sound player
// export const playSound = (fn: (i: number) => number | null) => {
//   if (!b) {
//     b = new AudioContext();
//   }
//   const buffer = b.createBuffer(1,96e3,48e3);
//   const data = buffer.getChannelData(0);
//   for (let i=96e3; i--;) data[i] = fn(i) || 0;
//   const source = b.createBufferSource();
//   source.buffer = buffer;
//   source.connect(b.destination);
//   source.start();
// };

const noiseBuffer = () => {
  const bufferSize = a.sampleRate * duration;
  const buffer = a.createBuffer(1, bufferSize, a.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

const playNote = (actx: AudioContext, note: number, time: number): OscillatorNode => {
  const osc = actx.createOscillator();
  const gain = actx.createGain();
  const bandpass = actx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(800, time);
  osc.type = 'square';
  osc.connect(gain);
  gain.connect(bandpass).connect(actx.destination);
  gain.gain.setValueAtTime(0.001, time);
  const gap = 0.8;
  gain.gain.linearRampToValueAtTime(musicVolume, time + duration*gap);
  gain.gain.setValueAtTime(musicVolume, time + duration*gap);
  gain.gain.setValueAtTime(musicVolume, time + duration*(1.5 - gap));
  gain.gain.linearRampToValueAtTime(0.01, time + duration*1.5);
  const frequency = 440 / 1.06 ** note;
  osc.frequency.setValueAtTime(frequency, time);

  return osc;
};

const playGameNote = (note: number, time: number) => {
  const osc = playNote(a, note, time);

  // the noise
  noise = a.createBufferSource();
  noise.buffer = noiseBuffer();
  const noiseFilter = a.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(500, time);
  const noiseGain = a.createGain();
  noiseGain.gain.setValueAtTime(0.01, time);
  const gap = 0.47;
  noiseGain.gain.exponentialRampToValueAtTime(noiseVolume, time + duration*gap);
  noiseGain.gain.setValueAtTime(noiseVolume, time + duration*(0.9 - gap));
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + duration*1);
  noise
  .connect(noiseFilter)
  .connect(noiseGain)
  .connect(a.destination);
  noise.start();

  osc.start(time);
  osc.stop(time + duration*1.5);
};

// const initNoise = () => {
//   const context = new AudioContext();
//   noise = new AudioBufferSourceNode(context, {
//     buffer: noiseBuffer(),
//   });
//   noise.connect(context.destination);
//   noise.start();
// };

const notes: number[] = [];

// Notes are sequencial, but include the
// middle notes (e.g. piano black keys)
const frequencies = {
  'E': -5,
  'F': -4,
  'G': -2,
  'a': 0,
  'b': 2,
  'c': 3,
  'd': 5,
  'e': 7,
  '-': -999,
};

('GddGdd' +
'GccGcc' +
'GeeGee' +
'FddFdd' +
'EaaGdd' +
'Gddadd' +
'Gddadd' +
'GdbG--').split('').forEach((letter) => {
  // @ts-ignore
  const note = frequencies[letter];
  notes.push(-note);
});

let musicIsPlaying = true;
let currentNoteIndex = 0;
let startTime = 0;

const scheduleNextNote = (repeat = false) => {
  if (!musicIsPlaying) return;
  if (startTime + currentNoteIndex * duration < a.currentTime) {
    /** @ts-ignore */
    playGameNote(notes[currentNoteIndex], startTime + currentNoteIndex * duration);
    currentNoteIndex++;
    if (currentNoteIndex == notes.length) {
      if (!repeat) return;
      startTime = a.currentTime + duration;
      currentNoteIndex = 0;
    }
  }
  // Using setTimeout instead of requestAnimationFrame otherwise it stops when window is not focused.
  setTimeout(scheduleNextNote, duration);
};

export const stopMarketMusic = () => {
  musicIsPlaying = false;
};

export const startMarketMusic = (repeat = false) => {
  a = new AudioContext();
  startTime = a.currentTime;
  currentNoteIndex = 0;
  startTime = 0;
  musicIsPlaying = true;
  scheduleNextNote(repeat);
};

export const keySound = (note: number) => {
  if (!b) {
    b = new AudioContext();
  }
  const time = b.currentTime;
  const osc = playNote(b, note, time);
  osc.start(time);
  osc.stop(time + duration);
};

// export const toggleSoundEffects = () => {
//   if (noise) {
//     noise.stop();
//     noise = null;
//   } else {
//     startNoiseLoop(true);
//   }
//   // _sound.classList.toggle('off', !noise);
// };

// export const toggleMusic = () => {
//   if (musicIsPlaying) {
//     musicIsPlaying = false;
//   } else {
//     musicIsPlaying = true;
//     startTime = a.currentTime - currentNoteIndex * duration;
//     scheduleNextNote();
//   }
//   // _music.classList.toggle('off', !musicIsPlaying);
// };
