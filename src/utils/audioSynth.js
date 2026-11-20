// Web Audio API Synthesizer for traditional Thai festival ambient music
// No external MP3 files needed; completely self-contained and instant.

class FestivalAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.intervalId = null;
    this.waterNoiseNode = null;
    this.gainNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Master volume
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // River water ambient stream sound
    this.startWaterSound();

    // Traditional Thai pentatonic scale notes (Ranat Ek / Khlui Thai flute style)
    // Key of D Thai pentatonic: D4, E4, F#4, A4, B4, D5, E5
    const thaiScale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00];
    
    // Melodic pattern playing gentle notes
    const playNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      const noteFreq = thaiScale[Math.floor(Math.random() * thaiScale.length)];
      const duration = 1.2 + Math.random() * 1.5;
      
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      
      // Warm flute/bell-like timbre with sine + triangle harmonic
      osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);
      
      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.15);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      
      osc.connect(noteGain);
      noteGain.connect(this.gainNode);
      
      osc.start(now);
      osc.stop(now + duration + 0.1);
    };

    this.intervalId = setInterval(playNote, 700);
  }

  startWaterSound() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Pink noise generation for water ripples
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like gentle river water
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const waterGain = this.ctx.createGain();
    waterGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(waterGain);
    waterGain.connect(this.gainNode);

    whiteNoise.start();
    this.waterNoiseNode = whiteNoise;
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.waterNoiseNode) {
      try {
        this.waterNoiseNode.stop();
      } catch (e) {}
      this.waterNoiseNode = null;
    }
  }

  playVoteBell() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    // Play cheerful chime sound on voting
    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.9);
    });
  }
}

export const festivalAudio = new FestivalAudioSynth();
