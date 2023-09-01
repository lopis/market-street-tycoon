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

// export const woah = (i) => {
//   var n=2e4;
//   if (i > n) return null;
//   return Math.sin(i*0.0006*Math.sin(0.009*i)+Math.sin(i/400))*(n-i)/n*0.5;
// }

// export const haow = i => {
//   var n=2e4;
//   if (i > n) return null;
//   i = n - i
//   return Math.sin(i*0.0006*Math.sin(0.009*i)+Math.sin(i/400))*(n-i)/n*0.5;
// }

let a: AudioContext;
let noise: AudioBufferSourceNode | null;
const musicVolume = 0.3;
const duration = 0.2;

// Sound player
export const playSound = (fn: Function) => {
  if (!a || !noise) return;
  const buffer = a.createBuffer(1,96e3,48e3);
  const data = buffer.getChannelData(0);
  for (let i=96e3; i--;) data[i] = fn(i);
  const source = a.createBufferSource();
  source.buffer = buffer;
  source.connect(a.destination);
  source.start();
};

const noiseBuffer = () => {
  var bufferSize = a.sampleRate * duration;
  var buffer = a.createBuffer(1, bufferSize, a.sampleRate);
  var output = buffer.getChannelData(0);

  for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

const playNote = (note: number, time: number, frequency: number) => {
  // notes.forEach((note, time) => {
    const osc = a.createOscillator();
    const gain = a.createGain();
    const bandpass = new BiquadFilterNode(a, {
      type: "bandpass",
      frequency: 1200,
    });
    osc.type = 'sawtooth';
    osc.connect(gain);
    gain.connect(bandpass).connect(a.destination);
    gain.gain.setValueAtTime(0.01, time);
    let gap = 0.8;
    gain.gain.linearRampToValueAtTime(musicVolume, time + duration*gap);
    gain.gain.setValueAtTime(musicVolume, time + duration*gap);
    gain.gain.setValueAtTime(musicVolume, time + duration*(1.5 - gap));
    gain.gain.linearRampToValueAtTime(0.01, time + duration*1.45);
    osc.frequency.value = frequency / 1.06 ** note;

    // the noise
    noise = new AudioBufferSourceNode(a, {
      buffer: noiseBuffer(),
    });
    const noiseFilter = a.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(time, 500);
    const noiseGain = a.createGain();
    noiseGain.gain.setValueAtTime(0.01, time);
    gap = 0.47;
    noiseGain.gain.linearRampToValueAtTime(musicVolume, time + duration*gap);
    noiseGain.gain.setValueAtTime(musicVolume, time + duration*gap);
    noiseGain.gain.setValueAtTime(musicVolume, time + duration*(0.9 - gap));
    noiseGain.gain.linearRampToValueAtTime(0.01, time + duration*1);
    noise
    .connect(noiseFilter)
    .connect(noiseGain)
    .connect(a.destination);
    noise.start();

    osc.start(time);
    osc.stop(time + duration*1.5);
  // })
};

const initNoise = () => {
  const context = new AudioContext();
  noise = new AudioBufferSourceNode(context, {
    buffer: noiseBuffer(),
  });
  noise.connect(context.destination);
  noise.start();
};

const notes: number[] = [];
[4, 6, 3, 7].forEach((baseNote, i) => {
  let loops = 8;
  while (loops) {
    if (i == 3 && loops < 5) {
      if (loops < 4) {
        notes.push(99, 99);
      } else if (loops < 5) {
        notes.push(baseNote, 99);
      }
    } else {
      notes.push(baseNote, baseNote - 4);
    }
    loops--;
  }
});

let musicIsPlaying = true;
let currentNoteIndex = 0;
let startTime = 0;
let baseFrequency = 440;

const scheduleNextNote = () => {
  if (!musicIsPlaying) return;
  if (startTime + currentNoteIndex * duration < a.currentTime) {
    playNote(notes[currentNoteIndex], startTime + currentNoteIndex * duration, baseFrequency);
    currentNoteIndex++;
    if (currentNoteIndex == notes.length) {
      startTime = a.currentTime + duration;
      currentNoteIndex = 0;
    }
  }
  // Using setTimeout instead of requestAnimationFrame otherwise it stops when window is not focused.
  setTimeout(scheduleNextNote, 10);
};

const startMusicLoop = () => {
  a = new AudioContext();
  startTime = a.currentTime;
  scheduleNextNote();
};

export const initAudio = () => {
  startMusicLoop();
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
