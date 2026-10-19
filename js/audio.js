// Enhanced Audio, Speech Synthesis & Recognition, White Noise and Hands-Free Podcast Engine
class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.noiseNode = null;
    this.noiseGain = null;
    this.isWhiteNoisePlaying = false;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, delay = 0) {
    if (this.muted) return;
    this.resume();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + delay);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + delay);
      osc.stop(this.audioCtx.currentTime + delay + duration);
    } catch (e) {
      console.warn("playTone error", e);
    }
  }

  playCorrect() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.18, 0.12, idx * 0.06);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.playTone(155.56, 'triangle', 0.22, 0.15, 0);
    this.playTone(130.81, 'triangle', 0.28, 0.14, 0.12);
  }

  playComboStreak() {
    if (this.muted) return;
    // Energetic rising sweep
    [440, 554, 659, 880, 1108, 1318].forEach((f, idx) => {
      this.playTone(f, 'sine', 0.12, 0.14, idx * 0.04);
    });
  }

  playLevelUp() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.25, 0.14, idx * 0.08);
    });
  }

  playTick() {
    if (this.muted) return;
    this.playTone(800, 'triangle', 0.03, 0.03, 0);
  }

  playWarning() {
    if (this.muted) return;
    this.playTone(400, 'sawtooth', 0.08, 0.06, 0);
  }

  // --- EXAM AMBIENT WHITE NOISE GENERATOR (Web Audio API) ---
  toggleWhiteNoise() {
    if (this.isWhiteNoisePlaying) {
      this.stopWhiteNoise();
      return false;
    } else {
      this.startWhiteNoise();
      return true;
    }
  }

  startWhiteNoise() {
    this.resume();
    if (!this.audioCtx) return;

    try {
      this.stopWhiteNoise();
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate brown/pink noise (softer and more natural for exam room focus)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.audioCtx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Filter: warm low-pass acoustic
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      this.noiseGain = this.audioCtx.createGain();
      this.noiseGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

      this.noiseNode.connect(filter);
      filter.connect(this.noiseGain);
      this.noiseGain.connect(this.audioCtx.destination);

      this.noiseNode.start();
      this.isWhiteNoisePlaying = true;
    } catch (e) {
      console.warn("Error starting white noise", e);
    }
  }

  stopWhiteNoise() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (e) { }
      this.noiseNode = null;
    }
    this.isWhiteNoisePlaying = false;
  }
}

// Multi-Accent Rotating Speech Engine
class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.rate = 1.0;
    this.isSpeaking = false;
    this.accentCycle = ['en-US', 'en-GB', 'en-AU'];
    this.accentIndex = 0;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const populate = () => {
      this.voices = this.synth.getVoices();
    };
    populate();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populate;
    }
  }

  getBestVoice(lang, specificAccent = null) {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices();
    }

    if (lang === 'ja') {
      const jpVoices = this.voices.filter(v => v.lang.toLowerCase().startsWith('ja'));
      const naturalJp = jpVoices.find(v => v.name.includes('Kyoko') || v.name.includes('Otoya') || v.name.includes('Google') || v.name.includes('Natural'));
      return naturalJp || jpVoices[0] || null;
    }

    // English with specific accent rotation (US, UK, AU)
    const targetLang = specificAccent || this.getNextAccent();
    const candidates = this.voices.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLang.toLowerCase()));

    const premium = candidates.find(v =>
      v.name.includes('Natural') ||
      v.name.includes('Google') ||
      v.name.includes('Samantha') ||
      v.name.includes('Daniel') ||
      v.name.includes('Karen') ||
      v.name.includes('Zira') ||
      v.name.includes('David')
    );

    if (premium) return premium;
    if (candidates.length > 0) return candidates[0];

    // Fallback any English
    const fallbackEn = this.voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    return fallbackEn[0] || null;
  }

  getNextAccent() {
    const accent = this.accentCycle[this.accentIndex];
    this.accentIndex = (this.accentIndex + 1) % this.accentCycle.length;
    return accent;
  }

  speak(text, lang = 'en', rate = 1.0, onEnd = null, specificAccent = null) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate || this.rate;

      const voice = this.getBestVoice(lang, specificAccent);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Speech error", e);
      if (onEnd) onEnd();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

// Hands-Free Commute Podcast Loop (Radio Rảnh Tay)
class HandsFreePodcastManager {
  constructor() {
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.timer = null;
    this.onTrackChange = null;
  }

  setPlaylist(items) {
    this.playlist = items || [];
    this.currentIndex = 0;
  }

  start() {
    if (this.playlist.length === 0) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.playCurrentStep(1);
  }

  pause() {
    this.isPaused = true;
    window.speechEngine.stop();
    if (this.timer) clearTimeout(this.timer);
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.playCurrentStep(1);
    }
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    window.speechEngine.stop();
    if (this.timer) clearTimeout(this.timer);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    if (this.isPlaying) this.playCurrentStep(1);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    if (this.isPlaying) this.playCurrentStep(1);
  }

  playCurrentStep(step) {
    if (!this.isPlaying || this.isPaused) return;
    const item = this.playlist[this.currentIndex];
    if (!item) return;

    if (this.onTrackChange) {
      this.onTrackChange({
        item,
        index: this.currentIndex,
        total: this.playlist.length,
        step
      });
    }

    const isJp = !!item.kanji || item.track === 'JLPT';
    const lang = isJp ? 'ja' : 'en';

    if (step === 1) {
      // Step 1: Read original word/term at 1.0x speed
      const targetText = isJp ? (item.kanji || item.audioText || item.word) : (item.word || item.audioText);
      window.speechEngine.speak(targetText, lang, 1.0, () => {
        // Step 2: 3 seconds pause for mental recall
        this.timer = setTimeout(() => {
          this.playCurrentStep(3);
        }, 2800);
      });
    } else if (step === 3) {
      // Step 3: Read Vietnamese meaning & memory tip in Vietnamese
      const viText = `Nghĩa là: ${item.meaningVi || item.translationVi || ''}. ${item.trapNote ? 'Lưu ý bẫy: ' + item.trapNote : ''}`;
      window.speechEngine.speak(viText, 'vi', 1.05, () => {
        this.timer = setTimeout(() => {
          this.playCurrentStep(4);
        }, 800);
      });
    } else if (step === 4) {
      // Step 4: Read example sentence (1.1x speed)
      const exampleText = isJp ? (item.exampleJp || '') : (item.exampleEn || '');
      if (exampleText) {
        window.speechEngine.speak(exampleText, lang, 1.1, () => {
          this.timer = setTimeout(() => {
            this.next();
          }, 1500);
        });
      } else {
        this.timer = setTimeout(() => {
          this.next();
        }, 1500);
      }
    }
  }
}

// Shadowing & Speech Recognition Engine
class ShadowingRecognitionEngine {
  constructor() {
    const SpeechRecClass = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    this.recognition = SpeechRecClass ? new SpeechRecClass() : null;
    this.isRecording = false;
    this.onResult = null;
    this.targetSentence = "";
    this.lang = "en-US";
    this.init();
  }

  init() {
    if (!this.recognition) {
      console.warn("SpeechRecognition not available in this browser");
      return;
    }
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const spoken = (finalTranscript || interimTranscript).trim();
      const analysis = this.compareTranscripts(this.targetSentence, spoken);

      if (this.onResult) {
        this.onResult({
          spoken,
          isFinal: !!finalTranscript,
          ...analysis
        });
      }
    };

    this.recognition.onerror = (e) => {
      this.isRecording = false;
      console.warn("Speech recognition error", e);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };
  }

  start(targetSentence, lang = 'en-US', onResult = null) {
    if (!this.recognition) return false;
    this.targetSentence = targetSentence;
    this.lang = lang;
    this.recognition.lang = lang;
    this.onResult = onResult;

    try {
      this.recognition.start();
      this.isRecording = true;
      return true;
    } catch (e) {
      console.warn("Recognition start failed", e);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isRecording) {
      try {
        this.recognition.stop();
      } catch (e) { }
    }
    this.isRecording = false;
  }

  compareTranscripts(target, spoken) {
    const cleanWord = w => w.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim();
    const targetWords = target.split(/\s+/).map(cleanWord).filter(Boolean);
    const spokenWords = spoken.split(/\s+/).map(cleanWord).filter(Boolean);

    let matches = 0;
    const diffTokens = target.split(/\s+/).map(origWord => {
      const cleaned = cleanWord(origWord);
      const isHit = spokenWords.includes(cleaned);
      if (isHit) matches++;
      return {
        word: origWord,
        matched: isHit
      };
    });

    const fluencyScore = targetWords.length > 0 ? Math.min(100, Math.round((matches / targetWords.length) * 100)) : 0;

    return {
      fluencyScore,
      tokens: diffTokens,
      matches,
      totalWords: targetWords.length
    };
  }
}

// Global Instances
window.soundEngine = new SoundEngine();
window.speechEngine = new SpeechEngine();
window.podcastManager = new HandsFreePodcastManager();
window.shadowingEngine = new ShadowingRecognitionEngine();
