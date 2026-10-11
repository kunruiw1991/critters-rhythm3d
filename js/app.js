(function () {
  'use strict';

  // Canvas roundRect fallback for older headless contexts
  if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      const rad = typeof r === 'number' ? r : (Array.isArray(r) ? r[0] || 0 : 0);
      this.moveTo(x + rad, y);
      this.arcTo(x + w, y, x + w, y + h, rad);
      this.arcTo(x + w, y + h, x, y + h, rad);
      this.arcTo(x, y + h, x, y, rad);
      this.arcTo(x, y, x + w, y, rad);
      this.closePath();
      return this;
    };
  }

  // 8 Selectable Smiling Critters
  const CRITTERS = [
    { id: 'catnap',     emoji: '🐱', color: 0x9c4dcc, accent: 0xe1bee7, icon: 'icons/catnap.jpg' },
    { id: 'dogday',     emoji: '🐶', color: 0xff8f00, accent: 0xffe082, icon: 'icons/dogday.jpg' },
    { id: 'picky',      emoji: '🐷', color: 0xf06292, accent: 0xf8bbd0, icon: 'icons/picky.jpg' },
    { id: 'craftycorn', emoji: '🦄', color: 0x26c6da, accent: 0xb2ebf2, icon: 'icons/craftycorn.jpg' },
    { id: 'kickin',     emoji: '🐥', color: 0xffeb3b, accent: 0xffff8d, icon: 'icons/kickin.jpg' },
    { id: 'bobby',      emoji: '🐻', color: 0xe53935, accent: 0xffcdd2, icon: 'icons/bobby.jpg' },
    { id: 'hoppy',      emoji: '🐰', color: 0x43a047, accent: 0xc8e6c9, icon: 'icons/hoppy.jpg' },
    { id: 'bubba',      emoji: '🐘', color: 0x1e88e5, accent: 0xbbdefb, icon: 'icons/bubba.jpg' }
  ];

  // 8 Distinct Starlight Concert Stages (every skyTop pair >= ΔE 18 apart, unique laser/arch colors & 3D prop sets)
  const STAGES = [
    {
      id: 1,
      emoji: '🌸',
      bpm: 108,
      duration: 36,
      noteSpeed: 17.5,
      rivalRate: 68,
      skyTop: 0xff66b2,
      skyBot: 0x3a0ca3,
      floorColor: 0x480ca8,
      archColor: 0xff99c8,
      laserColor: 0xffe66d,
      scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
      chart: [0, 1, 2, 1, 0, 2, 1, 1]
    },
    {
      id: 2,
      emoji: '🍭',
      bpm: 116,
      duration: 38,
      noteSpeed: 19.0,
      rivalRate: 84,
      skyTop: 0xd90429,
      skyBot: 0x3c096c,
      floorColor: 0x5a189a,
      archColor: 0xffca28,
      laserColor: 0xff70a6,
      scale: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33],
      chart: [2, 1, 0, 0, 1, 2, 2, 1]
    },
    {
      id: 3,
      emoji: '🌊',
      bpm: 122,
      duration: 40,
      noteSpeed: 20.5,
      rivalRate: 98,
      skyTop: 0x0077b6,
      skyBot: 0x03045e,
      floorColor: 0x023e8a,
      archColor: 0x00f5d4,
      laserColor: 0x90e0ef,
      scale: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25],
      chart: [0, 2, 1, 0, 2, 1, 2, 0]
    },
    {
      id: 4,
      emoji: '🌴',
      bpm: 128,
      duration: 42,
      noteSpeed: 22.0,
      rivalRate: 112,
      skyTop: 0xf77f00,
      skyBot: 0x1b4332,
      floorColor: 0x2d6a4f,
      archColor: 0x80ed99,
      laserColor: 0xfcbf49,
      scale: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46],
      chart: [1, 0, 1, 2, 0, 1, 2, 1]
    },
    {
      id: 5,
      emoji: '🔮',
      bpm: 134,
      duration: 44,
      noteSpeed: 23.5,
      rivalRate: 126,
      skyTop: 0x7209b7,
      skyBot: 0x10002b,
      floorColor: 0x240046,
      archColor: 0xe0aaff,
      laserColor: 0xb5179e,
      scale: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99],
      chart: [0, 0, 2, 2, 1, 0, 2, 1]
    },
    {
      id: 6,
      emoji: '🌋',
      bpm: 140,
      duration: 45,
      noteSpeed: 25.0,
      rivalRate: 140,
      skyTop: 0x9b2226,
      skyBot: 0x1d0200,
      floorColor: 0x370617,
      archColor: 0xff4800,
      laserColor: 0xffba08,
      scale: [261.63, 311.13, 349.23, 392.00, 466.16, 523.25],
      chart: [2, 0, 2, 1, 0, 2, 0, 1]
    },
    {
      id: 7,
      emoji: '❄️',
      bpm: 146,
      duration: 46,
      noteSpeed: 26.5,
      rivalRate: 154,
      skyTop: 0x4cc9f0,
      skyBot: 0x0b2545,
      floorColor: 0x134074,
      archColor: 0xffffff,
      laserColor: 0x72efdd,
      scale: [293.66, 349.23, 392.00, 440.00, 523.25, 587.33],
      chart: [1, 2, 0, 1, 2, 0, 1, 1]
    },
    {
      id: 8,
      emoji: '🌌',
      bpm: 154,
      duration: 48,
      noteSpeed: 28.0,
      rivalRate: 168,
      skyTop: 0x2b2d42,
      skyBot: 0x08070c,
      floorColor: 0x1a1423,
      archColor: 0xffd166,
      laserColor: 0xef476f,
      scale: [329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99],
      chart: [0, 1, 2, 0, 2, 1, 0, 2]
    }
  ];

  const LANE_X = [-4.0, 0.0, 4.0];
  const LANE_COLORS = [0xff1744, 0xffca28, 0x00b0ff];
  const HIT_Z = 6.2;
  const SPAWN_Z = -34.0;
  const DESPAWN_Z = 10.2;
  const PERFECT_WINDOW = 1.85;
  const GOOD_WINDOW = 3.45;

  const STORAGE_KEY = 'critters_rhythm3d_save_v1';

  let saveState = {
    unlockedStage: 1,
    stageStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
    selectedCritter: 'catnap'
  };

  function loadSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          saveState.unlockedStage = Math.max(1, Math.min(8, Number(parsed.unlockedStage) || 1));
          if (parsed.stageStars && typeof parsed.stageStars === 'object') {
            for (let i = 1; i <= 8; i++) {
              saveState.stageStars[i] = Math.max(0, Math.min(3, Number(parsed.stageStars[i]) || 0));
            }
          }
          if (parsed.selectedCritter && CRITTERS.some(c => c.id === parsed.selectedCritter)) {
            saveState.selectedCritter = parsed.selectedCritter;
          }
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  function writeSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
    } catch (e) {
      // Ignore storage errors
    }
  }

  loadSave();

  // Web Audio Synthesizer (deferred until first user gesture so zero console warnings)
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.melodyStep = 0;
      this.lastDingTime = 0;
    }

    ensureContext() {
      if (this.muted) return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    playSelectCritter(critterIdx) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const base = 392.0 * Math.pow(1.06, critterIdx % 8);
      [base, base * 1.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.055);
        gain.gain.setValueAtTime(0.14, now + i * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.055 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.055);
        osc.stop(now + i * 0.055 + 0.19);
      });
    }

    playStageLaunch() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 0.9, now + i * 0.045);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + i * 0.045 + 0.14);
        gain.gain.setValueAtTime(0.14, now + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.19);
      });
    }

    playFeverChime() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.038);
        gain.gain.setValueAtTime(0.13, now + i * 0.038);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.038 + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.038);
        osc.stop(now + i * 0.038 + 0.25);
      });
    }

    playCoinDing() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      if (now - this.lastDingTime < 0.045) return;
      this.lastDingTime = now;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.07);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.095);
    }

    playDrumHit(lane, quality, stageScale, noteType) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = lane === 0 ? 130 : (lane === 1 ? 195 : 160);
      osc.type = lane === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * 1.4, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.14);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);

      const scale = stageScale || STAGES[0].scale;
      const noteFreq = scale[this.melodyStep % scale.length] * (quality === 'perfect' ? 1.0 : 0.5);
      this.melodyStep++;

      const mOsc = ctx.createOscillator();
      const mGain = ctx.createGain();
      mOsc.type = noteType === 'star' ? 'sine' : 'triangle';
      mOsc.frequency.setValueAtTime(noteFreq, now);
      if (quality === 'perfect') {
        mOsc.frequency.setValueAtTime(noteFreq * 1.25, now + 0.06);
      }
      mGain.gain.setValueAtTime(0.16, now);
      mGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      mOsc.connect(mGain);
      mGain.connect(ctx.destination);
      mOsc.start(now);
      mOsc.stop(now + 0.23);

      // Distinct Star shimmer or Balloon pop/boing overtone
      if (noteType === 'star' || noteType === 'balloon') {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        if (noteType === 'star') {
          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(noteFreq * 2.0, now);
          subOsc.frequency.exponentialRampToValueAtTime(noteFreq * 3.0, now + 0.14);
        } else {
          subOsc.type = 'triangle';
          subOsc.frequency.setValueAtTime(220, now);
          subOsc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
        }
        subGain.gain.setValueAtTime(0.12, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.17);
      }
    }

    playMiss() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(72, now + 0.12);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }

    playPowerPedal(pedalIdx) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chords = [
        [392.00, 493.88, 587.33, 783.99],
        [440.00, 554.37, 659.25, 880.00],
        [329.63, 440.00, 523.25, 659.25]
      ][pedalIdx] || [440, 554, 659];

      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.13, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.30);
      });
    }

    playFanfare(win) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      if (win) {
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + idx * 0.1);
          gain.gain.setValueAtTime(0.16, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.34);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.36);
        });
      } else {
        // Comical sawtooth pitch-sliding Defeat Trombone (wah-wah-wah-waaah)
        const slideNotes = [
          { f0: 311.13, f1: 293.66, t: 0.00, d: 0.18 },
          { f0: 293.66, f1: 277.18, t: 0.20, d: 0.18 },
          { f0: 277.18, f1: 261.63, t: 0.40, d: 0.18 },
          { f0: 261.63, f1: 185.00, t: 0.60, d: 0.48 }
        ];
        slideNotes.forEach(s => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(s.f0, now + s.t);
          osc.frequency.linearRampToValueAtTime(s.f1, now + s.t + s.d);
          gain.gain.setValueAtTime(0.11, now + s.t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + s.t + s.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + s.t);
          osc.stop(now + s.t + s.d + 0.02);
        });
      }
    }
  }

  const sound = new SoundEngine();

  // DOM Elements
  const containerEl = document.getElementById('game-container');
  const canvas = document.getElementById('webgl-canvas');
  const startOverlayEl = document.getElementById('start-overlay');
  const startStageBadgeEl = document.getElementById('start-stage-badge');
  const startCritterGridEl = document.getElementById('start-critter-grid');
  const btnStartPlay = document.getElementById('btn-start-play');
  const startPlayIconsEl = document.getElementById('start-play-icons');
  const webglFallbackEl = document.getElementById('webgl-fallback');
  const critterRailEl = document.getElementById('critter-rail');
  const stageRailEl = document.getElementById('stage-rail');
  const centerHudEl = document.getElementById('center-hud');
  const liveStandingsEl = document.getElementById('live-standings');
  const songFillEl = document.getElementById('song-progress-fill');
  const feverFillEl = document.getElementById('fever-progress-fill');
  const comboBadgeEl = document.getElementById('combo-badge');
  const scoreBadgeEl = document.getElementById('score-badge');
  const bottomCockpitEl = document.getElementById('bottom-cockpit');
  const drumPadClusterEl = document.getElementById('drum-pad-cluster');
  const pedalClusterEl = document.getElementById('pedal-cluster');
  const podiumModalEl = document.getElementById('podium-modal');
  const podiumCrownEl = document.getElementById('podium-crown-banner');
  const podiumStarsEl = document.getElementById('podium-stage-stars');
  const podiumBarsEl = document.getElementById('podium-bars');
  const btnPodiumCritter = document.getElementById('btn-podium-critter');
  const btnPodiumRetry = document.getElementById('btn-podium-retry');
  const btnPodiumNext = document.getElementById('btn-podium-next');

  // Guarded Three.js / WebGL Initialization
  let renderer = null;
  const hasThreeR155 = Boolean(window.THREE && parseInt(window.THREE.REVISION, 10) >= 155);
  if (hasThreeR155) {
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      renderer = null;
    }
  }

  if (!renderer) {
    if (webglFallbackEl) webglFallbackEl.classList.remove('hidden');
    if (startOverlayEl) startOverlayEl.classList.add('hidden');
    return;
  }

  const initW = (containerEl && containerEl.clientWidth) || window.innerWidth;
  const initH = (containerEl && containerEl.clientHeight) || window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(initW, initH, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14082e);
  scene.fog = new THREE.FogExp2(0x14082e, 0.011);

  // Per-stage Sky Gradient CanvasTexture & Cached PMREM Environments
  const stageEnvCache = {};
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 2;
  skyCanvas.height = 256;
  const skyCtx = skyCanvas.getContext('2d');
  const skyGradientTexture = new THREE.CanvasTexture(skyCanvas);
  skyGradientTexture.colorSpace = THREE.SRGBColorSpace;

  function hexToCss(hex) {
    return '#' + ('000000' + (hex >>> 0).toString(16)).slice(-6);
  }

  function updateSkyGradient(skyTopHex, skyBotHex) {
    const grad = skyCtx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, hexToCss(skyTopHex));
    grad.addColorStop(0.58, hexToCss(skyBotHex));
    grad.addColorStop(1.0, hexToCss(skyBotHex));
    skyCtx.fillStyle = grad;
    skyCtx.fillRect(0, 0, 2, 256);
    skyGradientTexture.needsUpdate = true;
    scene.background = skyGradientTexture;
  }

  function getOrBuildStageEnv(stage) {
    if (stageEnvCache[stage.id]) {
      return stageEnvCache[stage.id];
    }
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(stage.skyTop);

    const topGeo = new THREE.PlaneGeometry(40, 40);
    const topMat = new THREE.MeshBasicMaterial({ color: stage.skyTop, side: THREE.DoubleSide });
    const skyPanel = new THREE.Mesh(topGeo, topMat);
    skyPanel.position.set(0, 15, 0);
    skyPanel.rotation.x = Math.PI / 2;
    envScene.add(skyPanel);

    const sideGeo = new THREE.PlaneGeometry(30, 30);
    const leftMat = new THREE.MeshBasicMaterial({ color: stage.archColor, side: THREE.DoubleSide });
    const neonLeft = new THREE.Mesh(sideGeo, leftMat);
    neonLeft.position.set(-15, 4, 0);
    neonLeft.rotation.y = Math.PI / 2;
    envScene.add(neonLeft);

    const rightMat = new THREE.MeshBasicMaterial({ color: stage.laserColor, side: THREE.DoubleSide });
    const neonRight = new THREE.Mesh(sideGeo, rightMat);
    neonRight.position.set(15, 4, 0);
    neonRight.rotation.y = Math.PI / 2;
    envScene.add(neonRight);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const rt = pmrem.fromScene(envScene, 0.04);
    pmrem.dispose();
    topGeo.dispose();
    topMat.dispose();
    sideGeo.dispose();
    leftMat.dispose();
    rightMat.dispose();

    stageEnvCache[stage.id] = rt.texture;
    return rt.texture;
  }

  function clearStageEnvCache() {
    Object.keys(stageEnvCache).forEach(k => {
      if (stageEnvCache[k] && stageEnvCache[k].dispose) {
        stageEnvCache[k].dispose();
      }
      delete stageEnvCache[k];
    });
  }

  const camera = new THREE.PerspectiveCamera(52, initW / initH, 0.5, 160);
  let cameraPreset = 0;
  const CAMERA_PRESETS = [
    { pos: new THREE.Vector3(0, 10.6, 17.8), look: new THREE.Vector3(0, 1.4, -5.5) },
    { pos: new THREE.Vector3(0, 13.5, 15.6), look: new THREE.Vector3(0, 0.9, -4.2) },
    { pos: new THREE.Vector3(0, 8.6, 19.2),  look: new THREE.Vector3(0, 1.8, -6.8) }
  ];
  const fittedCameraPos = new THREE.Vector3();
  const fittedCameraLook = new THREE.Vector3();

  // Balanced Physically-Correct Lights + Crisp Shadows
  const hemiLight = new THREE.HemisphereLight(0xff66b2, 0x480ca8, 1.15);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
  dirLight.position.set(7, 20, 12);
  dirLight.target.position.set(0, 0, -5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  dirLight.shadow.camera.near = 2;
  dirLight.shadow.camera.far = 56;
  dirLight.shadow.camera.left = -11;
  dirLight.shadow.camera.right = 11;
  dirLight.shadow.camera.top = 18;
  dirLight.shadow.camera.bottom = -28;
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.normalBias = 0.02;
  scene.add(dirLight);
  scene.add(dirLight.target);

  const stageSpotLeft = new THREE.PointLight(0xff99c8, 65, 42, 1.4);
  stageSpotLeft.position.set(-8.5, 8, -11);
  scene.add(stageSpotLeft);

  const stageSpotRight = new THREE.PointLight(0xffe66d, 65, 42, 1.4);
  stageSpotRight.position.set(8.5, 8, -11);
  scene.add(stageSpotRight);

  const drumZoneLight = new THREE.PointLight(0xffffff, 26, 24, 2.0);
  drumZoneLight.position.set(0, 5.8, HIT_Z);
  scene.add(drumZoneLight);

  // Radial Soft Contact Blob Shadow Texture
  const blobShadowTexture = (function createBlobShadowTex() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
    g.addColorStop(0.0, 'rgba(0, 0, 0, 0.72)');
    g.addColorStop(0.55, 'rgba(0, 0, 0, 0.35)');
    g.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();

  const sharedBlobShadowGeo = new THREE.CircleGeometry(1.28, 24);
  const sharedBlobShadowMat = new THREE.MeshBasicMaterial({
    map: blobShadowTexture,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    toneMapped: false
  });

  // LoadingManager + Instant Emoji CanvasTexture Fallback for all 8 Critter Portraits
  let assetsReady = false;
  const critterTextures = {};

  function buildEmojiFallbackTexture(critter) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = hexToCss(critter.color);
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = hexToCss(critter.accent);
    ctx.stroke();
    ctx.font = '136px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(critter.emoji, 128, 136);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function markAssetsReady() {
    assetsReady = true;
    if (btnStartPlay) {
      btnStartPlay.classList.remove('loading');
    }
    if (startPlayIconsEl) {
      startPlayIconsEl.textContent = '🥁 🌟 ▶️';
    }
  }

  const loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = () => {
    markAssetsReady();
  };
  setTimeout(markAssetsReady, 1400);

  const texLoader = new THREE.TextureLoader(loadingManager);
  CRITTERS.forEach(c => {
    const fallbackTex = buildEmojiFallbackTexture(c);
    critterTextures[c.id] = fallbackTex;

    texLoader.load(
      c.icon,
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        critterTextures[c.id] = loadedTex;
        idolActors.forEach(actor => {
          if (actor.critter && actor.critter.id === c.id) {
            actor.portraitMat.map = loadedTex;
            actor.portraitMat.needsUpdate = true;
          }
        });
      },
      undefined,
      () => {
        critterTextures[c.id] = fallbackTex;
      }
    );
  });

  // Highway & Concert Stage Construction
  const stageGroup = new THREE.Group();
  scene.add(stageGroup);

  const highwayGeo = new THREE.BoxGeometry(13.2, 0.5, 46);
  const highwayMat = new THREE.MeshStandardMaterial({
    color: 0x480ca8,
    roughness: 0.45,
    metalness: 0.18
  });
  const highwayMesh = new THREE.Mesh(highwayGeo, highwayMat);
  highwayMesh.position.set(0, -0.25, -13);
  highwayMesh.receiveShadow = true;
  stageGroup.add(highwayMesh);

  // 3 Rainbow Lane Tracks
  const laneStrips = [];
  const laneFlashTimers = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const stripMat = new THREE.MeshBasicMaterial({
      color: LANE_COLORS[i],
      transparent: true,
      opacity: 0.34,
      toneMapped: false
    });
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 44), stripMat);
    strip.rotation.x = -Math.PI / 2;
    strip.position.set(LANE_X[i], 0.01, -13);
    stageGroup.add(strip);
    laneStrips.push(strip);

    for (const side of [-1.62, 1.62]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.12, 44),
        new THREE.MeshBasicMaterial({ color: LANE_COLORS[i], toneMapped: false })
      );
      rail.position.set(LANE_X[i] + side, 0.06, -13);
      stageGroup.add(rail);
    }
  }

  // 3 Giant 3D Taiko Drum Target Pads at HIT_Z
  const drumTargets = [];
  for (let i = 0; i < 3; i++) {
    const padGroup = new THREE.Group();
    padGroup.position.set(LANE_X[i], 0.0, HIT_Z);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: LANE_COLORS[i],
      roughness: 0.32,
      metalness: 0.22,
      emissive: LANE_COLORS[i],
      emissiveIntensity: 0.22
    });
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.52, 1.65, 0.42, 32),
      bodyMat
    );
    body.position.y = 0.21;
    body.castShadow = true;
    body.receiveShadow = true;
    padGroup.add(body);

    const drumFace = new THREE.Mesh(
      new THREE.CylinderGeometry(1.22, 1.22, 0.46, 32),
      new THREE.MeshBasicMaterial({ color: 0xfff8e1, toneMapped: false })
    );
    drumFace.position.y = 0.21;
    padGroup.add(drumFace);

    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.58, 1.88, 32),
      new THREE.MeshBasicMaterial({
        color: LANE_COLORS[i],
        side: THREE.DoubleSide,
        toneMapped: false
      })
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.43;
    padGroup.add(outerRing);

    stageGroup.add(padGroup);
    drumTargets.push({
      group: padGroup,
      body,
      bodyMat,
      outerRing,
      squashY: 0,
      squashVel: 0,
      glowPulse: 0
    });
  }

  // Persistent 3D Magnet Vortex Aura (visible at HIT_Z across all 3 lanes while Pedal 0 state.magnetTimer > 0)
  const magnetVortexGroup = new THREE.Group();
  magnetVortexGroup.position.set(0, 0.46, HIT_Z);
  magnetVortexGroup.visible = false;

  const magnetMainMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false
  });
  const magnetMainArch = new THREE.Mesh(
    new THREE.RingGeometry(5.2, 6.0, 48),
    magnetMainMat
  );
  magnetMainArch.rotation.x = -Math.PI / 2;
  magnetVortexGroup.add(magnetMainArch);

  const magnetPadRings = [];
  const sharedMagnetSubGeo = new THREE.RingGeometry(1.85, 2.25, 32);
  for (let i = 0; i < 3; i++) {
    const subRing = new THREE.Mesh(sharedMagnetSubGeo, magnetMainMat);
    subRing.rotation.x = -Math.PI / 2;
    subRing.position.set(LANE_X[i], 0.04, 0);
    magnetVortexGroup.add(subRing);
    magnetPadRings.push(subRing);
  }
  stageGroup.add(magnetVortexGroup);

  // Expanding 3D Shockwave Ring Pool
  const SHOCKWAVE_POOL_SIZE = 12;
  const shockwavePool = [];
  const sharedShockwaveGeo = new THREE.RingGeometry(0.85, 1.05, 48);
  for (let i = 0; i < SHOCKWAVE_POOL_SIZE; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const mesh = new THREE.Mesh(sharedShockwaveGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    shockwavePool.push({
      active: false,
      mesh,
      mat,
      delay: 0,
      life: 0,
      maxLife: 0.32,
      startScale: 1.5,
      endScale: 4.2,
      vz: 0
    });
  }
  let nextShockwaveIdx = 0;

  function spawnShockwaveRing(x, y, z, colorHex, startScale, endScale, maxLife, delay, vz) {
    let slot = null;
    for (let i = 0; i < SHOCKWAVE_POOL_SIZE; i++) {
      const idx = (nextShockwaveIdx + i) % SHOCKWAVE_POOL_SIZE;
      if (!shockwavePool[idx].active) {
        slot = shockwavePool[idx];
        nextShockwaveIdx = (idx + 1) % SHOCKWAVE_POOL_SIZE;
        break;
      }
    }
    if (!slot) {
      slot = shockwavePool[nextShockwaveIdx];
      nextShockwaveIdx = (nextShockwaveIdx + 1) % SHOCKWAVE_POOL_SIZE;
    }
    slot.active = true;
    slot.delay = delay || 0;
    slot.life = 0;
    slot.maxLife = maxLife || 0.32;
    slot.startScale = startScale || 1.5;
    slot.endScale = endScale || 4.2;
    slot.vz = vz || 0;
    slot.mat.color.setHex(colorHex);
    slot.mat.opacity = slot.delay > 0 ? 0 : 0.92;
    slot.mesh.position.set(x, y, z);
    slot.mesh.scale.setScalar(slot.startScale);
    slot.mesh.visible = slot.delay <= 0;
  }

  // Concert Stage Backdrop Arches & Lasers
  const neonArches = [];
  for (let i = 0; i < 5; i++) {
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xff99c8,
      emissive: 0xff99c8,
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.55
    });
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(8.5 + i * 0.6, 0.22, 12, 48, Math.PI),
      archMat
    );
    arch.position.set(0, 0, -14 - i * 5.2);
    stageGroup.add(arch);
    neonArches.push(arch);
  }

  // Giant 3D Stage-Emoji Emblem Billboard above Center Stage Arch
  const stageEmblemCanvas = document.createElement('canvas');
  stageEmblemCanvas.width = 256;
  stageEmblemCanvas.height = 256;
  const stageEmblemCtx = stageEmblemCanvas.getContext('2d');
  const stageEmblemTex = new THREE.CanvasTexture(stageEmblemCanvas);
  stageEmblemTex.colorSpace = THREE.SRGBColorSpace;
  const stageEmblemMat = new THREE.SpriteMaterial({
    map: stageEmblemTex,
    transparent: true,
    toneMapped: false
  });
  const stageEmblemSprite = new THREE.Sprite(stageEmblemMat);
  stageEmblemSprite.position.set(0, 7.6, -15.5);
  stageEmblemSprite.scale.set(3.8, 3.8, 1);
  stageGroup.add(stageEmblemSprite);

  function updateStageEmblemBillboard(stage) {
    const ctx = stageEmblemCtx;
    ctx.clearRect(0, 0, 256, 256);
    const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
    g.addColorStop(0.0, hexToCss(stage.archColor));
    g.addColorStop(0.7, hexToCss(stage.skyTop));
    g.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = hexToCss(stage.laserColor);
    ctx.beginPath();
    ctx.arc(128, 128, 96, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = '118px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stage.emoji, 128, 134);
    stageEmblemTex.needsUpdate = true;
  }

  // Stage Laser Beams
  const laserBeams = [];
  for (let i = 0; i < 6; i++) {
    const beamMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xffe66d : 0xff99c8,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const beam = new THREE.Mesh(new THREE.ConeGeometry(1.4, 24, 12, 1, true), beamMat);
    beam.position.set((i - 2.5) * 4.0, 11, -18);
    beam.rotation.z = (i - 2.5) * 0.14;
    stageGroup.add(beam);
    laserBeams.push(beam);
  }

  // Pre-build 8 Distinct 3D Stage Scenery Prop Groups
  const stagePropGroups = [];
  const animatedStageProps = {
    petals: [],
    lollipops: [],
    waves: [],
    bubbles: [],
    palms: [],
    crystals: [],
    embers: [],
    snowflakes: [],
    planets: [],
    starfield: null
  };

  (function buildAll8StagePropSets() {
    for (let s = 0; s < 8; s++) {
      const grp = new THREE.Group();
      grp.visible = s === 0;
      stageGroup.add(grp);
      stagePropGroups.push(grp);
    }

    // Stage 1 (🌸 Sakura Meadow)
    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.5, 3.6, 10);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.7 });
    const crownGeo = new THREE.SphereGeometry(2.1, 14, 12);
    const sakuraMat = new THREE.MeshStandardMaterial({ color: 0xffb3c6, emissive: 0xff66b2, emissiveIntensity: 0.28, roughness: 0.4 });
    [[-8.2, -8], [8.2, -8], [-9.2, -19], [9.2, -19]].forEach(([x, z]) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      const tr = new THREE.Mesh(trunkGeo, trunkMat);
      tr.position.y = 1.8;
      const cr = new THREE.Mesh(crownGeo, sakuraMat);
      cr.position.y = 4.2;
      tree.add(tr, cr);
      stagePropGroups[0].add(tree);
    });
    const petalGeo = new THREE.CircleGeometry(0.28, 6);
    const petalMat = new THREE.MeshBasicMaterial({ color: 0xffccd5, side: THREE.DoubleSide, toneMapped: false });
    for (let i = 0; i < 24; i++) {
      const p = new THREE.Mesh(petalGeo, petalMat);
      p.position.set((Math.random() - 0.5) * 18, 2 + Math.random() * 9, -2 - Math.random() * 26);
      stagePropGroups[0].add(p);
      animatedStageProps.petals.push(p);
    }

    // Stage 2 (🍭 Candy Carnival)
    const stickGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.8, 8);
    const stickMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const candyGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.4, 20);
    const candyMats = [
      new THREE.MeshStandardMaterial({ color: 0xff4081, emissive: 0xff4081, emissiveIntensity: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0xffea00, emissive: 0xffca28, emissiveIntensity: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.35 })
    ];
    for (let i = 0; i < 6; i++) {
      const lolli = new THREE.Group();
      const side = i % 2 === 0 ? -7.6 : 7.6;
      lolli.position.set(side, 0, -4 - i * 4.5);
      const st = new THREE.Mesh(stickGeo, stickMat);
      st.position.y = 1.9;
      const head = new THREE.Mesh(candyGeo, candyMats[i % 3]);
      head.rotation.x = Math.PI / 2;
      head.position.y = 4.0;
      lolli.add(st, head);
      stagePropGroups[1].add(lolli);
      animatedStageProps.lollipops.push(head);
    }

    // Stage 3 (🌊 Coral Lagoon)
    const waveGeo = new THREE.TorusGeometry(1.8, 0.22, 10, 24, Math.PI);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, toneMapped: false });
    for (let i = 0; i < 6; i++) {
      const wv = new THREE.Mesh(waveGeo, waveMat);
      wv.position.set(i % 2 === 0 ? -7.8 : 7.8, 0.5, -5 - i * 4.5);
      wv.rotation.y = Math.PI / 2;
      stagePropGroups[2].add(wv);
      animatedStageProps.waves.push(wv);
    }
    const bubGeo = new THREE.SphereGeometry(0.32, 10, 10);
    const bubMat = new THREE.MeshBasicMaterial({ color: 0x90e0ef, transparent: true, opacity: 0.65, toneMapped: false });
    for (let i = 0; i < 24; i++) {
      const b = new THREE.Mesh(bubGeo, bubMat);
      b.position.set((Math.random() - 0.5) * 18, Math.random() * 9, -2 - Math.random() * 26);
      stagePropGroups[2].add(b);
      animatedStageProps.bubbles.push(b);
    }

    // Stage 4 (🌴 Tropical Sunset)
    const palmFrondGeo = new THREE.ConeGeometry(1.8, 0.9, 6);
    const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x52b788, emissive: 0x2d6a4f, emissiveIntensity: 0.3 });
    [[-8.0, -7], [8.0, -7], [-9.0, -18], [9.0, -18]].forEach(([x, z]) => {
      const palm = new THREE.Group();
      palm.position.set(x, 0, z);
      const tr = new THREE.Mesh(trunkGeo, trunkMat);
      tr.position.y = 2.0;
      const fr = new THREE.Mesh(palmFrondGeo, palmFrondMat);
      fr.position.y = 4.2;
      palm.add(tr, fr);
      stagePropGroups[3].add(palm);
      animatedStageProps.palms.push(fr);
    });
    const sunDisc = new THREE.Mesh(
      new THREE.CircleGeometry(7.5, 32),
      new THREE.MeshBasicMaterial({ color: 0xfcbf49, side: THREE.DoubleSide, toneMapped: false })
    );
    sunDisc.position.set(0, 8.5, -34);
    stagePropGroups[3].add(sunDisc);

    // Stage 5 (🔮 Mystic Amethyst Cavern)
    const crystalGeo = new THREE.OctahedronGeometry(1.1, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xe0aaff,
      emissive: 0x9d4edd,
      emissiveIntensity: 0.55,
      roughness: 0.15,
      metalness: 0.8
    });
    for (let i = 0; i < 8; i++) {
      const cr = new THREE.Mesh(crystalGeo, crystalMat);
      const side = i % 2 === 0 ? -7.8 : 7.8;
      cr.position.set(side, 2.2 + (i % 3) * 1.2, -3 - i * 3.8);
      cr.scale.set(0.8, 1.8, 0.8);
      stagePropGroups[4].add(cr);
      animatedStageProps.crystals.push(cr);
    }

    // Stage 6 (🌋 Magma Caldera)
    const volcGeo = new THREE.ConeGeometry(4.2, 7.5, 16);
    const volcMat = new THREE.MeshStandardMaterial({ color: 0x370617, emissive: 0x9b2226, emissiveIntensity: 0.25, roughness: 0.8 });
    [-10.5, 10.5].forEach(x => {
      const v = new THREE.Mesh(volcGeo, volcMat);
      v.position.set(x, 3.5, -22);
      stagePropGroups[5].add(v);
    });
    const emberGeo = new THREE.OctahedronGeometry(0.24, 0);
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xffba08, toneMapped: false });
    for (let i = 0; i < 24; i++) {
      const em = new THREE.Mesh(emberGeo, emberMat);
      em.position.set((Math.random() - 0.5) * 18, Math.random() * 9, -2 - Math.random() * 26);
      stagePropGroups[5].add(em);
      animatedStageProps.embers.push(em);
    }

    // Stage 7 (❄️ Aurora Glacier)
    const iceGeo = new THREE.ConeGeometry(1.0, 4.8, 6);
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0x90e0ef,
      emissive: 0x4cc9f0,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.7
    });
    for (let i = 0; i < 8; i++) {
      const sp = new THREE.Mesh(iceGeo, iceMat);
      sp.position.set(i % 2 === 0 ? -7.7 : 7.7, 2.4, -3 - i * 3.8);
      stagePropGroups[6].add(sp);
    }
    const snowGeo = new THREE.OctahedronGeometry(0.22, 0);
    const snowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    for (let i = 0; i < 28; i++) {
      const sn = new THREE.Mesh(snowGeo, snowMat);
      sn.position.set((Math.random() - 0.5) * 18, Math.random() * 10, -2 - Math.random() * 26);
      stagePropGroups[6].add(sn);
      animatedStageProps.snowflakes.push(sn);
    }

    // Stage 8 (🌌 Starlight Nebula)
    const planetGeo = new THREE.SphereGeometry(1.9, 18, 16);
    const planetMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xef476f, emissiveIntensity: 0.35 });
    const ringGeo = new THREE.RingGeometry(2.4, 3.4, 28);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06d6a0, side: THREE.DoubleSide, toneMapped: false });
    [[-8.8, 6.8, -20], [8.8, 7.4, -22]].forEach(([x, y, z]) => {
      const pl = new THREE.Mesh(planetGeo, planetMat);
      pl.position.set(x, y, z);
      const rg = new THREE.Mesh(ringGeo, ringMat);
      rg.rotation.x = Math.PI / 2.6;
      pl.add(rg);
      stagePropGroups[7].add(pl);
      animatedStageProps.planets.push(pl);
    });
    const starPositions = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 34;
      starPositions[i * 3 + 1] = 2 + Math.random() * 16;
      starPositions[i * 3 + 2] = -4 - Math.random() * 34;
    }
    const starPtsGeo = new THREE.BufferGeometry();
    starPtsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starPtsMat = new THREE.PointsMaterial({ color: 0xfff3b0, size: 0.45, toneMapped: false });
    const starField = new THREE.Points(starPtsGeo, starPtsMat);
    stagePropGroups[7].add(starField);
    animatedStageProps.starfield = starField;
  })();

  // 5 3D Dancing Critter Idols on Stage Pedestals
  const idolSlots = [
    { baseX: 0.0,   y: 1.0, z: -14.8, scale: 1.22 }, // Slot 0: Player Idol Center Stage
    { baseX: -4.1,  y: 0.7, z: -13.6, scale: 1.0  },
    { baseX: 4.1,   y: 0.7, z: -13.6, scale: 1.0  },
    { baseX: -6.6,  y: 0.45, z: -11.2, scale: 0.94 },
    { baseX: 6.6,   y: 0.45, z: -11.2, scale: 0.94 }
  ];

  const idolActors = [];
  const sharedPedestalGeo = new THREE.CylinderGeometry(1.45, 1.75, 1.2, 24);
  const sharedPedestalRingGeo = new THREE.TorusGeometry(1.55, 0.1, 10, 28);
  const sharedTorsoGeo = new THREE.SphereGeometry(0.92, 20, 16);
  const sharedMedallionGeo = new THREE.CircleGeometry(0.92, 28);
  const sharedRingGeo = new THREE.RingGeometry(0.92, 1.10, 28);
  const sharedOuterHaloGeo = new THREE.RingGeometry(1.10, 1.22, 28);

  const accGeos = {
    catEar: new THREE.ConeGeometry(0.32, 0.72, 12),
    dogEar: new THREE.BoxGeometry(0.34, 0.78, 0.18),
    pigEar: new THREE.ConeGeometry(0.34, 0.52, 10),
    unicornHorn: new THREE.ConeGeometry(0.22, 0.95, 12),
    chickenComb: new THREE.SphereGeometry(0.26, 10, 10),
    bearEar: new THREE.CylinderGeometry(0.36, 0.36, 0.18, 16),
    bunnyEar: new THREE.CylinderGeometry(0.18, 0.22, 1.18, 12),
    elephantEar: new THREE.CircleGeometry(0.56, 18)
  };
  const goldHornMat = new THREE.MeshBasicMaterial({ color: 0xffea00, toneMapped: false });
  const redCombMat = new THREE.MeshBasicMaterial({ color: 0xff1744, toneMapped: false });

  function rebuildCritterAccessories(actor, critter) {
    while (actor.accessoryGroup.children.length > 0) {
      actor.accessoryGroup.remove(actor.accessoryGroup.children[0]);
    }
    const earMat = actor.earMat;
    earMat.color.setHex(critter.color);

    const id = critter.id;
    if (id === 'catnap') {
      [-0.64, 0.64].forEach((x, idx) => {
        const ear = new THREE.Mesh(accGeos.catEar, earMat);
        ear.position.set(x, 0.95, -0.02);
        ear.rotation.z = idx === 0 ? 0.32 : -0.32;
        actor.accessoryGroup.add(ear);
      });
    } else if (id === 'dogday') {
      [-0.98, 0.98].forEach((x, idx) => {
        const ear = new THREE.Mesh(accGeos.dogEar, earMat);
        ear.position.set(x, 0.35, -0.02);
        ear.rotation.z = idx === 0 ? 0.42 : -0.42;
        actor.accessoryGroup.add(ear);
      });
    } else if (id === 'picky') {
      [-0.78, 0.78].forEach((x, idx) => {
        const ear = new THREE.Mesh(accGeos.pigEar, earMat);
        ear.position.set(x, 0.82, -0.02);
        ear.rotation.z = idx === 0 ? 0.65 : -0.65;
        actor.accessoryGroup.add(ear);
      });
    } else if (id === 'craftycorn') {
      const horn = new THREE.Mesh(accGeos.unicornHorn, goldHornMat);
      horn.position.set(0, 1.38, 0.02);
      actor.accessoryGroup.add(horn);
      [-0.68, 0.68].forEach((x, idx) => {
        const ear = new THREE.Mesh(accGeos.pigEar, earMat);
        ear.position.set(x, 0.85, -0.02);
        ear.rotation.z = idx === 0 ? 0.45 : -0.45;
        actor.accessoryGroup.add(ear);
      });
    } else if (id === 'kickin') {
      [-0.28, 0, 0.28].forEach((x, idx) => {
        const comb = new THREE.Mesh(accGeos.chickenComb, redCombMat);
        comb.position.set(x, 1.12 + (idx === 1 ? 0.12 : 0), 0.0);
        actor.accessoryGroup.add(comb);
      });
    } else if (id === 'bobby') {
      [-0.76, 0.76].forEach(x => {
        const ear = new THREE.Mesh(accGeos.bearEar, earMat);
        ear.rotation.x = Math.PI / 2;
        ear.position.set(x, 0.88, -0.03);
        actor.accessoryGroup.add(ear);
      });
    } else if (id === 'hoppy') {
      [-0.42, 0.42].forEach((x, idx) => {
        const ear = new THREE.Mesh(accGeos.bunnyEar, earMat);
        ear.position.set(x, 1.38, -0.02);
        ear.rotation.z = idx === 0 ? 0.12 : -0.12;
        actor.accessoryGroup.add(ear);
      });
    } else if (id === 'bubba') {
      [-1.12, 1.12].forEach(x => {
        const ear = new THREE.Mesh(accGeos.elephantEar, earMat);
        ear.position.set(x, 0.22, -0.04);
        actor.accessoryGroup.add(ear);
      });
    }
  }

  for (let i = 0; i < 5; i++) {
    const slot = idolSlots[i];
    const root = new THREE.Group();
    root.position.set(slot.baseX, slot.y, slot.z);
    root.scale.setScalar(slot.scale);

    const pedMat = new THREE.MeshStandardMaterial({
      color: i === 0 ? 0x6a1b9a : 0xffca28,
      roughness: 0.3,
      metalness: 0.55
    });
    const pedestal = new THREE.Mesh(sharedPedestalGeo, pedMat);
    pedestal.position.y = -0.6;
    pedestal.receiveShadow = true;
    root.add(pedestal);

    const pedRingMat = new THREE.MeshBasicMaterial({
      color: i === 0 ? 0x00f5d4 : 0xffffff,
      toneMapped: false
    });
    const pedRing = new THREE.Mesh(sharedPedestalRingGeo, pedRingMat);
    pedRing.rotation.x = Math.PI / 2;
    pedRing.position.y = -0.02;
    root.add(pedRing);

    const idolShadow = new THREE.Mesh(sharedBlobShadowGeo, sharedBlobShadowMat);
    idolShadow.rotation.x = -Math.PI / 2;
    idolShadow.position.set(0, 0.02, 0);
    idolShadow.scale.setScalar(0.82);
    root.add(idolShadow);

    const dancer = new THREE.Group();
    root.add(dancer);

    const torsoGroup = new THREE.Group();
    dancer.add(torsoGroup);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.15
    });
    const torso = new THREE.Mesh(sharedTorsoGeo, bodyMat);
    torso.position.y = 0.82;
    torso.castShadow = true;
    torsoGroup.add(torso);

    const headBillboard = new THREE.Group();
    headBillboard.position.set(0, 2.38, 0.82);
    dancer.add(headBillboard);

    const earMat = new THREE.MeshBasicMaterial({
      color: CRITTERS[i].color,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const accessoryGroup = new THREE.Group();
    headBillboard.add(accessoryGroup);

    const portraitMat = new THREE.MeshBasicMaterial({
      map: critterTextures[CRITTERS[i].id],
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const portrait = new THREE.Mesh(sharedMedallionGeo, portraitMat);
    portrait.position.set(0, 0, 0.02);
    headBillboard.add(portrait);

    const rimMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const rim = new THREE.Mesh(sharedRingGeo, rimMat);
    rim.position.set(0, 0, 0.03);
    headBillboard.add(rim);

    const haloMat = new THREE.MeshBasicMaterial({
      color: i === 0 ? 0x00f5d4 : CRITTERS[i].accent,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const halo = new THREE.Mesh(sharedOuterHaloGeo, haloMat);
    halo.position.set(0, 0, 0.035);
    headBillboard.add(halo);

    stageGroup.add(root);
    const actorObj = {
      root,
      dancer,
      torsoGroup,
      headBillboard,
      accessoryGroup,
      idolShadow,
      pedMat,
      pedRingMat,
      bodyMat,
      earMat,
      portraitMat,
      rimMat,
      haloMat,
      critter: CRITTERS[i],
      score: 0,
      isPlayer: i === 0,
      stunTimer: 0,
      stunMax: 2.2,
      cheerTimer: 0,
      spinTimer: 0,
      hopAmp: 0.42,
      jumpY: 0,
      jumpVy: 0,
      pitchAngle: 0,
      pitchVel: 0
    };
    rebuildCritterAccessories(actorObj, CRITTERS[i]);
    idolActors.push(actorObj);
  }

  // Pre-Allocated Note Pool with 3D Knock-Back Flight & Missed Tumble Physics
  const NOTE_POOL_SIZE = 36;
  const notePool = [];
  const sharedDrumNoteGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.52, 24);
  const sharedDrumTopGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.56, 24);
  const sharedStarNoteGeo = new THREE.OctahedronGeometry(1.22, 0);
  const sharedBalloonGeo = new THREE.SphereGeometry(1.35, 20, 16);

  const noteMaterials = [
    new THREE.MeshStandardMaterial({ color: LANE_COLORS[0], emissive: LANE_COLORS[0], emissiveIntensity: 0.24, roughness: 0.28, metalness: 0.22 }),
    new THREE.MeshStandardMaterial({ color: LANE_COLORS[1], emissive: LANE_COLORS[1], emissiveIntensity: 0.24, roughness: 0.28, metalness: 0.32 }),
    new THREE.MeshStandardMaterial({ color: LANE_COLORS[2], emissive: LANE_COLORS[2], emissiveIntensity: 0.24, roughness: 0.28, metalness: 0.22 })
  ];
  const drumTopWhiteMat = new THREE.MeshBasicMaterial({ color: 0xfff8e1, toneMapped: false });
  const starGoldMat = new THREE.MeshStandardMaterial({
    color: 0xffea00,
    emissive: 0xff9100,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.65
  });
  const balloonMat = new THREE.MeshStandardMaterial({
    color: 0xff4081,
    emissive: 0xd500f9,
    emissiveIntensity: 0.32,
    roughness: 0.25,
    metalness: 0.25
  });

  const NOTE_Y = 0.85;
  for (let i = 0; i < NOTE_POOL_SIZE; i++) {
    const group = new THREE.Group();
    group.visible = false;

    const visualRoot = new THREE.Group();
    group.add(visualRoot);

    const drumMesh = new THREE.Mesh(sharedDrumNoteGeo, noteMaterials[0]);
    drumMesh.castShadow = true;
    const drumTop = new THREE.Mesh(sharedDrumTopGeo, drumTopWhiteMat);
    drumMesh.add(drumTop);
    visualRoot.add(drumMesh);

    const starMesh = new THREE.Mesh(sharedStarNoteGeo, starGoldMat);
    starMesh.castShadow = true;
    visualRoot.add(starMesh);

    const balloonMesh = new THREE.Mesh(sharedBalloonGeo, balloonMat);
    balloonMesh.castShadow = true;
    visualRoot.add(balloonMesh);

    const shadowDisc = new THREE.Mesh(sharedBlobShadowGeo, sharedBlobShadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.set(0, -0.82, 0);
    group.add(shadowDisc);

    scene.add(group);
    notePool.push({
      active: false,
      state: 'approaching',
      group,
      visualRoot,
      shadowDisc,
      drumMesh,
      starMesh,
      balloonMesh,
      lane: 0,
      type: 'drum',
      x: 0,
      y: NOTE_Y,
      z: SPAWN_Z,
      vx: 0,
      vy: 0,
      vz: 0,
      angVx: 0,
      angVy: 0,
      angVz: 0,
      flyTime: 0,
      maxFlyTime: 0.44,
      recoilTimer: 0,
      hp: 1
    });
  }

  // Single-Draw-Call InstancedMesh Particle Burst Pool (160 instances, frustumCulled=false, ring-buffer recycled, exponential drag)
  const PARTICLE_POOL_SIZE = 160;
  const particlePool = [];
  let nextParticleIdx = 0;
  const sharedParticleGeo = new THREE.OctahedronGeometry(0.26, 0);
  const instancedParticleMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false
  });
  const particleInstancedMesh = new THREE.InstancedMesh(
    sharedParticleGeo,
    instancedParticleMat,
    PARTICLE_POOL_SIZE
  );
  particleInstancedMesh.frustumCulled = false;
  particleInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(particleInstancedMesh);

  const LANE_COLOR_OBJS = [
    new THREE.Color(LANE_COLORS[0]),
    new THREE.Color(LANE_COLORS[1]),
    new THREE.Color(LANE_COLORS[2])
  ];
  const SPARKLE_WHITE = new THREE.Color(0xffffff);
  const SPARKLE_GOLD = new THREE.Color(0xffea00);
  const dummyObj = new THREE.Object3D();
  const zeroMatrix = new THREE.Matrix4().makeScale(0, 0, 0);

  for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
    particleInstancedMesh.setMatrixAt(i, zeroMatrix);
    particleInstancedMesh.setColorAt(i, SPARKLE_GOLD);
    particlePool.push({
      active: false,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      rx: 0,
      ry: 0,
      baseScale: 1.0,
      life: 0,
      maxLife: 0.5
    });
  }
  particleInstancedMesh.instanceMatrix.needsUpdate = true;
  if (particleInstancedMesh.instanceColor) {
    particleInstancedMesh.instanceColor.needsUpdate = true;
  }

  function allocateParticleSlot() {
    for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
      const idx = (nextParticleIdx + i) % PARTICLE_POOL_SIZE;
      if (!particlePool[idx].active) {
        nextParticleIdx = (idx + 1) % PARTICLE_POOL_SIZE;
        return idx;
      }
    }
    const idx = nextParticleIdx;
    nextParticleIdx = (nextParticleIdx + 1) % PARTICLE_POOL_SIZE;
    return idx;
  }

  function spawn3DBurst(x, y, z, laneIndex, count, isPerfect) {
    const laneColor = LANE_COLOR_OBJS[Math.max(0, Math.min(2, laneIndex))] || SPARKLE_GOLD;
    const totalCount = isPerfect ? count + 4 : count;

    for (let s = 0; s < totalCount; s++) {
      const idx = allocateParticleSlot();
      const p = particlePool[idx];
      p.active = true;
      p.life = 0;
      const isBigGoldStar = Boolean(isPerfect && s >= count);
      p.maxLife = isBigGoldStar ? 0.56 : (0.40 + Math.random() * 0.18);
      p.baseScale = isBigGoldStar ? 1.55 : 0.95;
      p.x = x + (Math.random() - 0.5) * 0.45;
      p.y = y + (Math.random() - 0.5) * 0.25;
      p.z = z + (Math.random() - 0.5) * 0.45;
      p.rx = Math.random() * 3;
      p.ry = Math.random() * 3;

      const spreadAngle = ((s / Math.max(1, totalCount - 1)) - 0.5) * 1.6 + (Math.random() - 0.5) * 0.35;
      const lateralSpeed = 2.0 + Math.random() * 1.9;
      p.vx = Math.sin(spreadAngle) * lateralSpeed;
      p.vy = (isBigGoldStar ? 7.8 : 5.6) + Math.random() * 3.4;
      p.vz = -1.6 - Math.cos(spreadAngle) * (1.8 + Math.random() * 2.2);

      let cObj = laneColor;
      if (isBigGoldStar) {
        cObj = SPARKLE_GOLD;
      } else if (s % 10 === 3 || s % 10 === 7) {
        cObj = SPARKLE_WHITE;
      } else if (s % 10 === 9) {
        cObj = SPARKLE_GOLD;
      }
      particleInstancedMesh.setColorAt(idx, cObj);

      dummyObj.position.set(p.x, p.y, p.z);
      dummyObj.rotation.set(p.rx, p.ry, 0);
      dummyObj.scale.setScalar(p.baseScale);
      dummyObj.updateMatrix();
      particleInstancedMesh.setMatrixAt(idx, dummyObj.matrix);
    }

    particleInstancedMesh.instanceMatrix.needsUpdate = true;
    if (particleInstancedMesh.instanceColor) {
      particleInstancedMesh.instanceColor.needsUpdate = true;
    }
  }

  // Flying 3D Star Coins Pool
  const COIN_POOL_SIZE = 48;
  const coinPool = [];
  let nextCoinIdx = 0;

  const starCoinTexture = (function buildStarCoinTex() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
    g.addColorStop(0.0, '#fff9c4');
    g.addColorStop(0.65, '#ffca28');
    g.addColorStop(1.0, '#ff8f00');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.font = '72px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', 64, 68);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();

  const sharedCoinGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.12, 20);
  sharedCoinGeo.rotateX(Math.PI / 2);
  const sharedCoinMat = new THREE.MeshBasicMaterial({
    map: starCoinTexture,
    toneMapped: false
  });
  const coinInstancedMesh = new THREE.InstancedMesh(sharedCoinGeo, sharedCoinMat, COIN_POOL_SIZE);
  coinInstancedMesh.frustumCulled = false;
  coinInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(coinInstancedMesh);

  for (let i = 0; i < COIN_POOL_SIZE; i++) {
    coinInstancedMesh.setMatrixAt(i, zeroMatrix);
    coinPool.push({
      active: false,
      t: 0,
      duration: 0.58,
      p0x: 0, p0y: 0, p0z: 0,
      p1x: 0, p1y: 0, p1z: 0,
      p2x: 0, p2y: 0, p2z: 0,
      ry: 0,
      ptsShare: 0
    });
  }
  coinInstancedMesh.instanceMatrix.needsUpdate = true;

  const coinTargetWorldPos = new THREE.Vector3();
  function spawnFlyingStarCoins(startX, startY, startZ, count, totalPts) {
    idolActors[0].headBillboard.getWorldPosition(coinTargetWorldPos);
    const share = totalPts / Math.max(1, count);

    for (let c = 0; c < count; c++) {
      let slot = null;
      for (let i = 0; i < COIN_POOL_SIZE; i++) {
        const idx = (nextCoinIdx + i) % COIN_POOL_SIZE;
        if (!coinPool[idx].active) {
          slot = coinPool[idx];
          nextCoinIdx = (idx + 1) % COIN_POOL_SIZE;
          break;
        }
      }
      if (!slot) {
        slot = coinPool[nextCoinIdx];
        nextCoinIdx = (nextCoinIdx + 1) % COIN_POOL_SIZE;
      }

      slot.active = true;
      slot.t = -c * 0.035;
      slot.duration = 0.52 + (c % 3) * 0.06;
      slot.p0x = startX + (c - (count - 1) * 0.5) * 0.28;
      slot.p0y = startY + 0.35;
      slot.p0z = startZ;

      slot.p2x = coinTargetWorldPos.x;
      slot.p2y = coinTargetWorldPos.y;
      slot.p2z = coinTargetWorldPos.z;

      slot.p1x = startX * 0.55 + (c - (count - 1) * 0.5) * 0.65;
      slot.p1y = startY + 5.8 + (c % 2) * 0.9;
      slot.p1z = (startZ + coinTargetWorldPos.z) * 0.5;
      slot.ry = c * 0.8;
      slot.ptsShare = share;
    }
  }

  // Dual-Constraint Viewport & Camera Framing
  const projVec = new THREE.Vector3();
  const projVecLeft = new THREE.Vector3();
  const projVecRight = new THREE.Vector3();

  function projectToScreen(wx, wy, wz, w, h) {
    const vw = w || Math.max(1, (containerEl && containerEl.clientWidth) || window.innerWidth);
    const vh = h || Math.max(1, (containerEl && containerEl.clientHeight) || window.innerHeight);
    projVec.set(wx, wy, wz).project(camera);
    return {
      x: (projVec.x * 0.5 + 0.5) * vw,
      y: (-projVec.y * 0.5 + 0.5) * vh
    };
  }

  function fitCameraToViewport() {
    if (!renderer) return;
    const w = Math.max(1, (containerEl && containerEl.clientWidth) || window.innerWidth);
    const h = Math.max(1, (containerEl && containerEl.clientHeight) || window.innerHeight);
    renderer.setSize(w, h, false);

    const aspect = w / h;
    camera.aspect = aspect;

    const idolSpreadScale = aspect < 0.75 ? 0.78 : (aspect < 1.0 ? 0.88 : 1.0);
    for (let i = 0; i < 5; i++) {
      idolActors[i].root.position.x = idolSlots[i].baseX * idolSpreadScale;
    }

    const preset = CAMERA_PRESETS[cameraPreset];
    fittedCameraPos.copy(preset.pos);
    fittedCameraLook.copy(preset.look);

    const viewDir = new THREE.Vector3().subVectors(preset.pos, preset.look).normalize();
    const hitPoint = new THREE.Vector3(0, 0.2, HIT_Z);
    const depthAtHit = fittedCameraPos.distanceTo(hitPoint);

    const requiredHalfWidth = 6.35;
    const idealRadFov = 2 * Math.atan(requiredHalfWidth / Math.max(1.0, depthAtHit * aspect));
    const idealDegFov = THREE.MathUtils.radToDeg(idealRadFov);
    camera.fov = THREE.MathUtils.clamp(idealDegFov, 50, 74);

    const halfVFovRad = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const tanHalfHFov = Math.tan(halfVFovRad) * aspect;
    const minDepthForPads = requiredHalfWidth / Math.max(0.15, tanHalfHFov);
    if (minDepthForPads > depthAtHit) {
      const extraDist = minDepthForPads - depthAtHit + 1.2;
      fittedCameraPos.addScaledVector(viewDir, extraDist);
    }

    camera.position.copy(fittedCameraPos);
    camera.lookAt(fittedCameraLook);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const centerHudRect = centerHudEl ? centerHudEl.getBoundingClientRect() : null;
    const minTopScreenY = ((centerHudRect && centerHudRect.bottom > 0) ? centerHudRect.bottom : 84) + 10;

    const padClusterRect = drumPadClusterEl ? drumPadClusterEl.getBoundingClientRect() : null;
    const pedalClusterRect = pedalClusterEl ? pedalClusterEl.getBoundingClientRect() : null;

    for (let iter = 0; iter < 12; iter++) {
      const idolTopPt = projectToScreen(0, 5.2, -14.8, w, h);
      const spawnPt = projectToScreen(0, 1.8, SPAWN_Z, w, h);
      const highestStageScreenY = Math.min(idolTopPt.y, spawnPt.y);

      projVecLeft.set(LANE_X[0] - 1.8, -0.05, HIT_Z + 1.88).project(camera);
      projVecRight.set(LANE_X[2] + 1.8, -0.05, HIT_Z + 1.88).project(camera);
      const padLeftPx = (projVecLeft.x * 0.5 + 0.5) * w;
      const padRightPx = (projVecRight.x * 0.5 + 0.5) * w;
      const padFrontPt = projectToScreen(0, -0.05, HIT_Z + 1.88, w, h);

      let maxAllowedBottomY = h - 14;
      [padClusterRect, pedalClusterRect].forEach(rect => {
        if (rect && rect.width > 0 && rect.top > 0) {
          const overlapsX = rect.right >= padLeftPx + 6 && rect.left <= padRightPx - 6;
          if (overlapsX) {
            maxAllowedBottomY = Math.min(maxAllowedBottomY, rect.top - 12);
          }
        }
      });

      const topTooHigh = highestStageScreenY < minTopScreenY;
      const botTooLow = padFrontPt.y > maxAllowedBottomY;

      if (!topTooHigh && !botTooLow) break;

      if (topTooHigh && botTooLow) {
        fittedCameraPos.z += 1.05;
        fittedCameraPos.y += 0.35;
      } else if (topTooHigh) {
        fittedCameraLook.y += 0.48;
      } else if (botTooLow) {
        fittedCameraLook.y -= 0.35;
        fittedCameraPos.z += 0.45;
      }

      camera.position.copy(fittedCameraPos);
      camera.lookAt(fittedCameraLook);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
    }
  }

  // Screen-Anchored 2D Floating Pop
  const fxLayer = document.getElementById('fx-layer');
  function spawnFloatingEmoji(text, laneIdx, customZ) {
    if (!fxLayer) return;
    const el = document.createElement('div');
    el.className = 'fx-pop';
    el.textContent = text;

    const w = Math.max(1, (containerEl && containerEl.clientWidth) || window.innerWidth);
    const h = Math.max(1, (containerEl && containerEl.clientHeight) || window.innerHeight);
    const wx = LANE_X[Math.max(0, Math.min(2, laneIdx))] || 0;
    const wz = typeof customZ === 'number' ? customZ : HIT_Z;
    const pt = projectToScreen(wx, 1.55, wz, w, h);

    const clampedX = THREE.MathUtils.clamp(pt.x, 48, w - 48);
    const clampedY = THREE.MathUtils.clamp(pt.y, 72, h - 72);
    el.style.left = clampedX.toFixed(1) + 'px';
    el.style.top = clampedY.toFixed(1) + 'px';

    fxLayer.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 680);
  }

  // Active Game State
  const state = {
    started: false,
    contextLost: false,
    stageIndex: 0,
    elapsed: 0,
    duration: STAGES[0].duration,
    score: 0,
    displayedScore: 0,
    combo: 0,
    maxCombo: 0,
    fever: 0,
    feverActive: false,
    feverTimer: 0,
    magnetTimer: 0,
    encoreTimer: 0,
    blastTimer: 0,
    pedalCooldowns: [0, 0, 0],
    pedalMaxCooldowns: [8.0, 10.0, 12.0],
    laneLockout: [0, 0, 0],
    spawnTimer: 0,
    patternStep: 0,
    trauma: 0,
    camSpringY: 0,
    camSpringVelY: 0,
    camSpringPitch: 0,
    camSpringVelPitch: 0,
    camSpringRoll: 0,
    camSpringVelRoll: 0,
    finished: false,
    lastRank: 1,
    lastStars: 3
  };

  function getMotionScale() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 0.3;
    }
    return 1.0;
  }

  function addCameraImpact(traumaDelta, pitchVelImpulse, yVelImpulse, rollVelImpulse) {
    const m = getMotionScale();
    state.trauma = Math.min(1.0, state.trauma + traumaDelta);
    state.camSpringVelPitch += (pitchVelImpulse || 0) * m;
    state.camSpringVelY += (yVelImpulse || 0) * m;
    state.camSpringVelRoll += (rollVelImpulse || 0) * m;
  }

  function updateRailLockState() {
    if (!critterRailEl) return;
    const lockMidSong = state.started && !state.finished;
    critterRailEl.classList.toggle('locked-mid-song', lockMidSong);
  }

  function activateGameplayGate() {
    if (!state.started) {
      state.started = true;
      sound.ensureContext();
      sound.playStageLaunch();
      if (startOverlayEl) {
        startOverlayEl.classList.add('hidden');
      }
      updateRailLockState();
    }
  }

  function openCharacterPickerOverlay() {
    state.started = false;
    podiumModalEl.classList.add('hidden');
    if (startOverlayEl) {
      startOverlayEl.classList.remove('hidden');
    }
    startStage(state.stageIndex, false);
  }

  function spawnNextBeatPattern(stage) {
    const step = state.patternStep++;
    const chart = stage.chart || [0, 1, 2, 1];
    const lane = chart[step % chart.length];
    const isStar = step % 5 === 4;
    const isBalloon = step % 9 === 8;

    allocateNote(lane, isBalloon ? 'balloon' : (isStar ? 'star' : 'drum'));

    if (stage.id >= 3 && step % 6 === 3) {
      const lane2 = (lane + (stage.id % 2 === 0 ? 2 : 1)) % 3;
      allocateNote(lane2, 'drum');
    }
  }

  function allocateNote(lane, type) {
    for (let i = 0; i < NOTE_POOL_SIZE; i++) {
      const n = notePool[i];
      if (!n.active) {
        n.active = true;
        n.state = 'approaching';
        n.lane = lane;
        n.type = type;
        n.x = LANE_X[lane];
        n.y = NOTE_Y;
        n.z = SPAWN_Z;
        n.vx = 0;
        n.vy = 0;
        n.vz = 0;
        n.angVx = 0;
        n.angVy = 0;
        n.angVz = 0;
        n.flyTime = 0;
        n.maxFlyTime = 0.44;
        n.recoilTimer = 0;
        n.hp = type === 'balloon' ? 2 : 1;
        n.group.position.set(n.x, n.y, n.z);
        n.visualRoot.scale.setScalar(0.25);
        n.visualRoot.rotation.set(0, 0, 0);
        n.shadowDisc.position.set(0, -0.82, 0);
        n.shadowDisc.scale.setScalar(0.25);
        n.shadowDisc.visible = true;

        n.drumMesh.visible = type === 'drum';
        n.drumMesh.material = noteMaterials[lane];
        n.starMesh.visible = type === 'star';
        n.balloonMesh.visible = type === 'balloon';
        n.group.visible = true;
        return n;
      }
    }
    return null;
  }

  function releaseNote(n) {
    n.active = false;
    n.state = 'approaching';
    n.group.visible = false;
  }

  function launchNoteKnockback(n, lane) {
    n.state = 'flying';
    n.flyTime = 0;
    n.maxFlyTime = 0.44;
    n.vx = lane === 0 ? -2.6 : (lane === 2 ? 2.6 : (Math.random() - 0.5) * 2.4);
    n.vy = 10.2 + Math.random() * 2.2;
    n.vz = -7.8 - Math.random() * 2.5;
    n.angVx = 11.0;
    n.angVy = 14.0 * (lane === 0 ? -1 : 1);
    n.angVz = 8.5;
    n.shadowDisc.visible = false;
  }

  function triggerNoteMiss(n) {
    n.state = 'missed';
    n.vx = (n.lane - 1) * 1.2;
    n.vy = 2.2;
    n.vz = STAGES[state.stageIndex].noteSpeed * 0.85;
    n.angVx = 9.5;
    n.angVy = 4.0;
    n.angVz = 6.0;
    n.shadowDisc.visible = false;

    state.combo = 0;
    laneFlashTimers[n.lane] = 0.14;
    sound.playMiss();
    addCameraImpact(0.16, 0.06, -1.2, (n.lane - 1) * 0.06);
    spawnShockwaveRing(LANE_X[n.lane], 0.25, HIT_Z, 0xff1744, 1.3, 3.2, 0.26, 0, 0);
    spawnFloatingEmoji('💔', n.lane, HIT_Z);
    updateHUD();
  }

  function syncIdolRoster() {
    const playerCritter = CRITTERS.find(c => c.id === saveState.selectedCritter) || CRITTERS[0];
    const others = CRITTERS.filter(c => c.id !== playerCritter.id);
    const stageOffset = state.stageIndex % others.length;

    for (let i = 0; i < 5; i++) {
      const actor = idolActors[i];
      const critter = i === 0 ? playerCritter : others[(stageOffset + i - 1) % others.length];
      actor.critter = critter;
      actor.isPlayer = i === 0;
      actor.bodyMat.color.setHex(critter.color);
      actor.pedMat.color.setHex(i === 0 ? 0x6a1b9a : critter.accent);
      actor.pedRingMat.color.setHex(i === 0 ? 0x00f5d4 : 0xffffff);
      actor.haloMat.color.setHex(i === 0 ? 0x00f5d4 : critter.accent);
      actor.portraitMat.map = critterTextures[critter.id];
      actor.portraitMat.needsUpdate = true;
      rebuildCritterAccessories(actor, critter);
    }
  }

  function applyStageTheme(stage) {
    updateSkyGradient(stage.skyTop, stage.skyBot);
    scene.fog.color.setHex(stage.skyBot);
    scene.environment = getOrBuildStageEnv(stage);

    hemiLight.color.setHex(stage.skyTop);
    hemiLight.groundColor.setHex(stage.floorColor);
    highwayMat.color.setHex(stage.floorColor);
    stageSpotLeft.color.setHex(stage.archColor);
    stageSpotRight.color.setHex(stage.laserColor);

    neonArches.forEach((arch, idx) => {
      const c = idx % 2 === 0 ? stage.archColor : stage.laserColor;
      arch.material.color.setHex(c);
      arch.material.emissive.setHex(c);
    });
    laserBeams.forEach((beam, idx) => {
      beam.material.color.setHex(idx % 2 === 0 ? stage.laserColor : stage.archColor);
    });

    for (let i = 0; i < stagePropGroups.length; i++) {
      stagePropGroups[i].visible = (i === state.stageIndex);
    }
    updateStageEmblemBillboard(stage);

    if (startStageBadgeEl) {
      startStageBadgeEl.textContent = `${stage.id} ${stage.emoji} 🥁`;
    }
  }

  function renderCritterRail() {
    critterRailEl.innerHTML = '';
    CRITTERS.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'critter-pill' + (c.id === saveState.selectedCritter ? ' active' : '');
      btn.setAttribute('aria-label', c.emoji);
      const img = document.createElement('img');
      img.src = c.icon;
      img.alt = c.emoji;
      btn.appendChild(img);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectCritter(c.id);
      });
      critterRailEl.appendChild(btn);
    });

    if (startCritterGridEl) {
      startCritterGridEl.innerHTML = '';
      CRITTERS.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'start-critter-btn' + (c.id === saveState.selectedCritter ? ' active' : '');
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', c.id === saveState.selectedCritter ? 'true' : 'false');
        const img = document.createElement('img');
        img.src = c.icon;
        img.alt = c.emoji;
        const badge = document.createElement('span');
        badge.className = 'critter-corner-emoji';
        badge.textContent = c.emoji;
        btn.appendChild(img);
        btn.appendChild(badge);
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectCritter(c.id);
        });
        startCritterGridEl.appendChild(btn);
      });
    }
    updateRailLockState();
  }

  function renderStageRail() {
    stageRailEl.innerHTML = '';
    STAGES.forEach((st, idx) => {
      const unlocked = st.id <= saveState.unlockedStage;
      const stars = saveState.stageStars[st.id] || 0;
      const btn = document.createElement('button');
      btn.className = 'stage-pill' +
        (idx === state.stageIndex ? ' active' : '') +
        (unlocked ? '' : ' locked');
      const topSpan = document.createElement('span');
      topSpan.textContent = unlocked ? `${st.id}${st.emoji}` : `🔒${st.id}`;
      const starSpan = document.createElement('span');
      starSpan.className = 'stage-mini-stars';
      starSpan.textContent = stars > 0 ? '⭐'.repeat(stars) : '☆☆☆';
      btn.appendChild(topSpan);
      btn.appendChild(starSpan);
      btn.addEventListener('click', () => {
        if (unlocked) {
          selectStage(idx);
        }
      });
      stageRailEl.appendChild(btn);
    });
  }

  function getSortedStandings() {
    return idolActors.slice().sort((a, b) => b.score - a.score);
  }

  function renderLiveStandings() {
    const sorted = getSortedStandings();
    const rankMedals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    liveStandingsEl.innerHTML = '';
    sorted.forEach((actor, idx) => {
      const chip = document.createElement('div');
      chip.className = 'standing-chip' + (actor.isPlayer ? ' is-player' : '');
      const img = document.createElement('img');
      img.src = actor.critter.icon;
      img.alt = actor.critter.emoji;
      const txt = document.createElement('span');
      txt.textContent = `${rankMedals[idx]} ${Math.floor(actor.score)}`;
      chip.appendChild(img);
      chip.appendChild(txt);
      liveStandingsEl.appendChild(chip);
    });
  }

  const feverBarEl = document.getElementById('fever-progress-bar');
  const padEls = [
    document.getElementById('pad-0'),
    document.getElementById('pad-1'),
    document.getElementById('pad-2')
  ];

  function updatePadReadyHighlights() {
    const laneHasNoteInWindow = [false, false, false];
    if (!state.finished) {
      for (let i = 0; i < NOTE_POOL_SIZE; i++) {
        const n = notePool[i];
        if (n.active && n.state === 'approaching' && Math.abs(n.z - HIT_Z) <= GOOD_WINDOW) {
          laneHasNoteInWindow[n.lane] = true;
        }
      }
    }
    for (let l = 0; l < 3; l++) {
      if (padEls[l]) {
        padEls[l].classList.toggle('note-ready', laneHasNoteInWindow[l]);
      }
    }
  }

  function updateHUD() {
    const pct = Math.min(100, (state.elapsed / state.duration) * 100);
    songFillEl.style.width = pct.toFixed(1) + '%';

    const isFeverGlow = state.feverActive || state.encoreTimer > 0;
    const feverPct = state.feverActive
      ? Math.max(0, (state.feverTimer / 6.0) * 100)
      : Math.min(100, state.fever);
    feverFillEl.style.width = feverPct.toFixed(1) + '%';
    if (feverBarEl) {
      feverBarEl.classList.toggle('fever-active', isFeverGlow);
    }

    const mult = getScoreMultiplier();
    comboBadgeEl.textContent = isFeverGlow
      ? `🌈 ${state.combo} ×${mult}`
      : `🔥 ${state.combo}`;
    comboBadgeEl.classList.toggle('fever-active', isFeverGlow);
    scoreBadgeEl.textContent = `⭐ ${Math.round(state.displayedScore)}`;

    for (let i = 0; i < 3; i++) {
      const fillEl = document.getElementById(`pedal-fill-${i}`);
      const btnEl = document.getElementById(`pedal-${i}`);
      const cd = state.pedalCooldowns[i];
      const maxCd = state.pedalMaxCooldowns[i];
      const hPct = cd > 0 ? Math.min(100, (cd / maxCd) * 100) : 0;
      if (fillEl) fillEl.style.height = hPct.toFixed(0) + '%';
      if (btnEl) {
        const isBuff =
          (i === 0 && state.magnetTimer > 0) ||
          (i === 1 && state.encoreTimer > 0) ||
          (i === 2 && state.blastTimer > 0);
        btnEl.classList.toggle('ready', cd <= 0 && !isBuff);
        btnEl.classList.toggle('on-cooldown', cd > 0 && !isBuff);
        btnEl.classList.toggle('active-buff', isBuff);
      }
    }
    updatePadReadyHighlights();
  }

  function getScoreMultiplier() {
    let mult = 1;
    if (state.combo >= 20) mult = 3;
    else if (state.combo >= 8) mult = 2;
    if (state.feverActive) mult *= 2;
    if (state.encoreTimer > 0) mult *= 2;
    return mult;
  }

  // Hit & Pedal Mechanics with Full 3D Tactile Impact
  function registerNoteHit(note, quality) {
    const stage = STAGES[state.stageIndex];
    const lane = note.lane;
    const hitZ = note.z;
    const isPerfect = quality === 'perfect';

    state.combo++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;

    const basePts = note.type === 'balloon' ? 135 : (note.type === 'star' ? 115 : 80);
    const qualityMult = isPerfect ? 1.25 : 1.0;
    const mult = getScoreMultiplier();
    const pts = Math.round(basePts * qualityMult * mult);

    state.score += pts;
    idolActors[0].score = state.score;
    idolActors[0].cheerTimer = 0.48;
    idolActors[0].jumpVy = Math.max(idolActors[0].jumpVy, isPerfect ? 4.2 : 3.1);

    let triggeredFeverNow = false;
    if (!state.feverActive) {
      state.fever = Math.min(100, state.fever + (note.type === 'star' ? 18 : 10));
      if (state.fever >= 100) {
        state.feverActive = true;
        state.feverTimer = 6.0;
        triggeredFeverNow = true;
        spawnFloatingEmoji('🌈⚡×2', 1, HIT_Z);
      }
    }

    for (let i = 0; i < 3; i++) {
      if (state.pedalCooldowns[i] > 0) {
        state.pedalCooldowns[i] = Math.max(0, state.pedalCooldowns[i] - 0.35);
      }
    }

    sound.playDrumHit(lane, quality, stage.scale, note.type);
    if (triggeredFeverNow) {
      sound.playFeverChime();
    }

    drumTargets[lane].squashVel = -4.8;
    drumTargets[lane].glowPulse = 1.0;

    addCameraImpact(
      isPerfect ? 0.28 : 0.16,
      isPerfect ? -0.15 : -0.09,
      isPerfect ? -3.0 : -1.8,
      (lane - 1) * -0.14
    );

    if (isPerfect) {
      spawnShockwaveRing(LANE_X[lane], 0.26, hitZ, 0xffffff, 1.4, 4.4, 0.32, 0, 0);
      spawnShockwaveRing(LANE_X[lane], 0.27, hitZ, LANE_COLORS[lane], 1.2, 3.9, 0.32, 0.05, 0);
    } else {
      spawnShockwaveRing(LANE_X[lane], 0.26, hitZ, LANE_COLORS[lane], 1.3, 3.6, 0.28, 0, 0);
    }

    spawn3DBurst(LANE_X[lane], NOTE_Y + 0.25, hitZ, lane, isPerfect ? 12 : 7, isPerfect);
    const coinCount = (isPerfect ? 5 : 3) + Math.min(4, (mult - 1) * 2);
    spawnFlyingStarCoins(LANE_X[lane], NOTE_Y + 0.3, hitZ, coinCount, pts);

    const icon = isPerfect ? '🌟' : '✨';
    spawnFloatingEmoji(`${icon}+${pts}`, lane, hitZ);

    if (note.type === 'balloon' && note.hp > 1) {
      note.hp--;
      note.vz = -19.0;
      note.recoilTimer = 0.24;
      note.visualRoot.scale.setScalar(1.36);
    } else {
      launchNoteKnockback(note, lane);
    }
    updateHUD();
  }

  function hitLane(lane) {
    activateGameplayGate();
    if (state.finished || lane < 0 || lane > 2) return false;
    if (state.laneLockout[lane] > 0) return false;

    const padBtn = document.getElementById(`pad-${lane}`);
    if (padBtn) {
      padBtn.classList.add('pressed');
      setTimeout(() => padBtn.classList.remove('pressed'), 110);
    }
    drumTargets[lane].squashVel = -3.8;
    drumTargets[lane].glowPulse = 0.75;

    let bestNote = null;
    let bestDist = Infinity;
    for (let i = 0; i < NOTE_POOL_SIZE; i++) {
      const n = notePool[i];
      if (n.active && n.state === 'approaching' && n.lane === lane) {
        const dist = Math.abs(n.z - HIT_Z);
        if (dist < bestDist) {
          bestDist = dist;
          bestNote = n;
        }
      }
    }

    if (bestNote && bestDist <= GOOD_WINDOW) {
      const quality = bestDist <= PERFECT_WINDOW ? 'perfect' : 'good';
      registerNoteHit(bestNote, quality);
      return true;
    } else {
      state.combo = 0;
      state.laneLockout[lane] = 0.18;
      laneFlashTimers[lane] = 0.12;
      sound.playMiss();
      addCameraImpact(0.12, 0.05, -0.9, (lane - 1) * 0.05);
      spawnFloatingEmoji('💨', lane, HIT_Z);
      updateHUD();
      return false;
    }
  }

  function usePedal(pedalIdx) {
    activateGameplayGate();
    if (state.finished || pedalIdx < 0 || pedalIdx > 2) return false;
    if (state.pedalCooldowns[pedalIdx] > 0) return false;

    state.pedalCooldowns[pedalIdx] = state.pedalMaxCooldowns[pedalIdx];
    sound.playPowerPedal(pedalIdx);

    if (pedalIdx === 0) {
      // 🌪️ Auto-Catch Magnet Pedal: activates persistent 3D cyan vortex aura across all 3 lanes & pulls incoming notes!
      state.magnetTimer = 3.5;
      magnetVortexGroup.visible = true;
      addCameraImpact(0.32, -0.12, -2.4, 0.12);
      for (let l = 0; l < 3; l++) {
        spawnShockwaveRing(LANE_X[l], 0.28, HIT_Z, 0x00e5ff, 1.4, 4.5, 0.34, l * 0.03, 0);
        spawn3DBurst(LANE_X[l], 1.3, HIT_Z, 2, 6, false);
      }
      spawnFloatingEmoji('🌪️🧲', 0, HIT_Z);
    } else if (pedalIdx === 1) {
      // ⚡ 2x Fever Encore Pedal: triggers 3D Rainbow Fever stage transformation & 2x score multiplier!
      state.encoreTimer = 5.0;
      addCameraImpact(0.36, -0.14, -2.8, 0);
      for (let l = 0; l < 3; l++) {
        spawnShockwaveRing(LANE_X[l], 0.28, HIT_Z, 0xffea00, 1.4, 4.8, 0.36, l * 0.03, 0);
      }
      spawnFloatingEmoji('⚡🌈×2', 1, HIT_Z);
      spawn3DBurst(LANE_X[1], 1.4, HIT_Z, 1, 12, true);
    } else if (pedalIdx === 2) {
      // 💥 Mega Drumroll Blast Pedal: sorts active approaching notes by descending z (closest to HIT_Z first!)
      state.blastTimer = 0.65;
      addCameraImpact(0.65, -0.26, -5.2, 0.22);
      spawnShockwaveRing(0, 0.32, HIT_Z, 0xff4081, 2.2, 8.8, 0.55, 0, -38.0);
      for (let l = 0; l < 3; l++) {
        spawnShockwaveRing(LANE_X[l], 0.28, HIT_Z, LANE_COLORS[l], 1.5, 4.4, 0.34, 0, 0);
        drumTargets[l].squashVel = -4.2;
        drumTargets[l].glowPulse = 0.95;
      }

      const candidates = [];
      for (let i = 0; i < NOTE_POOL_SIZE; i++) {
        const n = notePool[i];
        if (n.active && n.state === 'approaching' && n.z > SPAWN_Z + 4) {
          candidates.push(n);
        }
      }
      candidates.sort((a, b) => b.z - a.z);

      const clearedCount = Math.min(4, candidates.length);
      for (let c = 0; c < clearedCount; c++) {
        const n = candidates[c];
        spawnShockwaveRing(LANE_X[n.lane], 0.28, n.z, LANE_COLORS[n.lane], 1.3, 4.0, 0.32, 0, 0);
        spawn3DBurst(LANE_X[n.lane], 1.2, n.z, n.lane, 8, true);
        launchNoteKnockback(n, n.lane);
      }

      const bonus = clearedCount * 95 + 120;
      state.score += bonus;
      idolActors[0].score = state.score;
      idolActors[0].jumpVy = Math.max(idolActors[0].jumpVy, 5.0);
      spawnFlyingStarCoins(LANE_X[2], 1.4, HIT_Z, 6, bonus);

      if (!state.feverActive) {
        state.fever = Math.min(100, state.fever + 20);
        if (state.fever >= 100) {
          state.feverActive = true;
          state.feverTimer = 6.0;
          sound.playFeverChime();
          spawnFloatingEmoji('🌈⚡×2', 1, HIT_Z);
        }
      }

      for (let r = 1; r < 5; r++) {
        idolActors[r].stunTimer = 2.2;
        idolActors[r].stunMax = 2.2;
        idolActors[r].pitchVel = -6.8;
        idolActors[r].jumpVy = 5.2;
      }
      spawnFloatingEmoji(`💥+${bonus}`, 2, HIT_Z);
    }
    updateHUD();
    return true;
  }

  function startStage(stageIdx, keepStarted) {
    state.stageIndex = Math.max(0, Math.min(STAGES.length - 1, stageIdx));
    const stage = STAGES[state.stageIndex];

    state.elapsed = 0;
    state.duration = stage.duration;
    state.score = 0;
    state.displayedScore = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.fever = 0;
    state.feverActive = false;
    state.feverTimer = 0;
    state.magnetTimer = 0;
    state.encoreTimer = 0;
    state.blastTimer = 0;
    magnetVortexGroup.visible = false;
    state.pedalCooldowns = [0, 0, 0];
    state.laneLockout = [0, 0, 0];
    state.spawnTimer = 60 / stage.bpm;
    state.patternStep = 0;
    state.trauma = 0;
    state.camSpringY = 0;
    state.camSpringVelY = 0;
    state.camSpringPitch = 0;
    state.camSpringVelPitch = 0;
    state.camSpringRoll = 0;
    state.camSpringVelRoll = 0;
    state.finished = false;
    if (keepStarted) {
      activateGameplayGate();
    } else {
      state.started = false;
      updateRailLockState();
    }

    for (let i = 0; i < NOTE_POOL_SIZE; i++) {
      releaseNote(notePool[i]);
    }
    for (let i = 0; i < SHOCKWAVE_POOL_SIZE; i++) {
      shockwavePool[i].active = false;
      shockwavePool[i].mesh.visible = false;
    }
    for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
      particlePool[i].active = false;
      particleInstancedMesh.setMatrixAt(i, zeroMatrix);
    }
    particleInstancedMesh.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < COIN_POOL_SIZE; i++) {
      coinPool[i].active = false;
      coinInstancedMesh.setMatrixAt(i, zeroMatrix);
    }
    coinInstancedMesh.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < 3; i++) {
      laneFlashTimers[i] = 0;
      drumTargets[i].squashY = 0;
      drumTargets[i].squashVel = 0;
      drumTargets[i].glowPulse = 0;
      drumTargets[i].group.scale.set(1, 1, 1);
    }
    if (fxLayer) {
      fxLayer.innerHTML = '';
    }
    if (!window.__rhythmOrientBound) {
      window.__rhythmOrientBound = true;
      window.addEventListener('orientationchange', () => {
        fitCameraToViewport();
        setTimeout(fitCameraToViewport, 80);
      });
    }

    for (let i = 0; i < 5; i++) {
      idolActors[i].score = 0;
      idolActors[i].stunTimer = 0;
      idolActors[i].cheerTimer = 0;
      idolActors[i].spinTimer = 0;
      idolActors[i].hopAmp = 0.42;
      idolActors[i].jumpY = 0;
      idolActors[i].jumpVy = 0;
      idolActors[i].pitchAngle = 0;
      idolActors[i].pitchVel = 0;
    }

    syncIdolRoster();
    applyStageTheme(stage);
    fitCameraToViewport();
    podiumModalEl.classList.add('hidden');

    const chart = stage.chart || [0, 1, 2];
    const n0 = allocateNote(chart[0], 'drum');
    const n1 = allocateNote(chart[1], 'star');
    const n2 = allocateNote(chart[2], 'drum');
    if (n0) { n0.z = -15.5; n0.group.position.z = n0.z; n0.visualRoot.scale.setScalar(1.0); n0.shadowDisc.scale.setScalar(1.0); }
    if (n1) { n1.z = -23.5; n1.group.position.z = n1.z; n1.visualRoot.scale.setScalar(1.0); n1.shadowDisc.scale.setScalar(1.0); }
    if (n2) { n2.z = -30.5; n2.group.position.z = n2.z; n2.visualRoot.scale.setScalar(0.88); n2.shadowDisc.scale.setScalar(0.88); }

    renderCritterRail();
    renderStageRail();
    renderLiveStandings();
    updateHUD();
  }

  function finishStage(forcedRank) {
    if (state.finished && !forcedRank) return;
    state.finished = true;
    updateRailLockState();

    const stage = STAGES[state.stageIndex];
    if (typeof forcedRank === 'number' && forcedRank >= 1 && forcedRank <= 5) {
      const baseScores = [4800, 4100, 3400, 2700, 1900];
      const rIdx = forcedRank - 1;
      idolActors[0].score = baseScores[rIdx];
      state.score = baseScores[rIdx];
      state.displayedScore = state.score;
      let slot = 0;
      for (let i = 1; i < 5; i++) {
        if (slot === rIdx) slot++;
        idolActors[i].score = baseScores[slot];
        slot++;
      }
    } else {
      state.displayedScore = state.score;
    }

    const sorted = getSortedStandings();
    const playerRank = sorted.findIndex(a => a.isPlayer) + 1;
    const starsEarned = playerRank === 1 ? 3 : (playerRank === 2 ? 2 : (playerRank === 3 ? 1 : 0));
    const qualified = playerRank <= 3;

    state.lastRank = playerRank;
    state.lastStars = starsEarned;

    if (qualified) {
      saveState.stageStars[stage.id] = Math.max(saveState.stageStars[stage.id] || 0, starsEarned);
      if (stage.id < 8 && saveState.unlockedStage < stage.id + 1) {
        saveState.unlockedStage = stage.id + 1;
      }
      writeSave();
    }

    if (qualified) {
      idolActors[0].cheerTimer = 2.4;
      idolActors[0].spinTimer = 0.65;
      idolActors[0].jumpVy = 5.4;
      for (let lane = 0; lane < 3; lane++) {
        spawnShockwaveRing(LANE_X[lane], 0.28, HIT_Z, LANE_COLORS[lane], 1.4, 4.2, 0.48, lane * 0.06, 0);
        spawn3DBurst(LANE_X[lane], 2.2, HIT_Z - 1.5, lane, 14, true);
      }
    } else {
      idolActors[0].stunTimer = 1.8;
      idolActors[0].stunMax = 1.8;
    }

    sound.playFanfare(qualified);
    renderStageRail();
    renderLiveStandings();
    updateHUD();
    showPodiumModal(sorted, playerRank, starsEarned, qualified);
  }

  function showPodiumModal(sorted, playerRank, starsEarned, qualified) {
    const rankBadges = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    const stepStars = ['⭐⭐⭐', '⭐⭐', '⭐', '💔', '💔'];
    const podiumCardEl = podiumModalEl.querySelector('.podium-card');
    if (podiumCardEl) {
      podiumCardEl.classList.toggle('victory-card', qualified);
      podiumCardEl.classList.toggle('defeat-card', !qualified);
    }

    podiumCrownEl.textContent = qualified
      ? `👑 ${rankBadges[playerRank - 1]} 🏆`
      : `😢 ${rankBadges[playerRank - 1]} 💔`;

    podiumStarsEl.textContent = starsEarned > 0
      ? '⭐'.repeat(starsEarned) + '☆'.repeat(3 - starsEarned)
      : '☆☆☆';

    podiumBarsEl.innerHTML = '';
    const heights = [128, 104, 86, 62, 48];
    const colors = ['#ffca28', '#b0bec5', '#ff8a65', '#5e35b1', '#3949ab'];

    sorted.forEach((actor, idx) => {
      const isStepQualified = idx < 3;
      const col = document.createElement('div');
      col.className = 'podium-column '
        + (isStepQualified ? 'qualified-step' : 'eliminated-step')
        + (actor.isPlayer ? ' is-player' : '');

      const img = document.createElement('img');
      img.className = 'podium-avatar';
      img.src = actor.critter.icon;
      img.alt = actor.critter.emoji;

      const plinth = document.createElement('div');
      plinth.className = 'podium-plinth';
      plinth.style.height = heights[idx] + 'px';
      plinth.style.background = colors[idx];
      plinth.innerHTML = `<span>${rankBadges[idx]}</span><span class="podium-step-stars">${stepStars[idx]}</span><span>${Math.floor(actor.score)}</span>`;

      col.appendChild(img);
      col.appendChild(plinth);
      podiumBarsEl.appendChild(col);
    });

    const canAdvance = qualified && state.stageIndex < STAGES.length - 1;
    btnPodiumNext.classList.toggle('hidden', !canAdvance);
    podiumModalEl.classList.remove('hidden');
  }

  function selectCritter(critterId) {
    const idx = CRITTERS.findIndex(c => c.id === critterId);
    if (idx === -1) return false;
    saveState.selectedCritter = critterId;
    writeSave();

    if (state.started && !state.finished) {
      startStage(state.stageIndex, false);
      if (startOverlayEl) startOverlayEl.classList.remove('hidden');
    } else {
      syncIdolRoster();
      renderCritterRail();
      renderLiveStandings();
    }

    sound.playSelectCritter(idx);
    idolActors[0].cheerTimer = 0.85;
    idolActors[0].spinTimer = 0.65;
    idolActors[0].jumpVy = 4.6;
    spawn3DBurst(idolActors[0].root.position.x, 3.2, idolActors[0].root.position.z + 1.2, idx % 3, 10, true);
    return true;
  }

  function selectStage(stageIdx) {
    if (stageIdx < 0 || stageIdx >= STAGES.length) return false;
    if (STAGES[stageIdx].id > saveState.unlockedStage) return false;
    startStage(stageIdx, state.started);
    return true;
  }

  // Simulation Step
  function stepSimulation(dt) {
    if (!state.started || state.finished || state.contextLost) return;

    const stage = STAGES[state.stageIndex];
    state.elapsed += dt;

    for (let i = 0; i < 3; i++) {
      if (state.pedalCooldowns[i] > 0) {
        state.pedalCooldowns[i] = Math.max(0, state.pedalCooldowns[i] - dt);
      }
      if (state.laneLockout[i] > 0) {
        state.laneLockout[i] = Math.max(0, state.laneLockout[i] - dt);
      }
    }

    if (state.feverActive) {
      state.feverTimer -= dt;
      if (state.feverTimer <= 0) {
        state.feverActive = false;
        state.fever = 0;
      }
    }
    if (state.magnetTimer > 0) state.magnetTimer = Math.max(0, state.magnetTimer - dt);
    if (state.encoreTimer > 0) state.encoreTimer = Math.max(0, state.encoreTimer - dt);
    if (state.blastTimer > 0) state.blastTimer = Math.max(0, state.blastTimer - dt);

    const beatInterval = 60 / stage.bpm;
    state.spawnTimer -= dt;
    while (state.spawnTimer <= 0 && state.elapsed < state.duration - 1.4) {
      spawnNextBeatPattern(stage);
      // Trigger periodic beat-synced hop bursts on un-stunned AI rivals so they visibly dance and jump to the beat
      const hopRivalIdx = 1 + (state.patternStep % 4);
      const hopRival = idolActors[hopRivalIdx];
      if (hopRival && hopRival.stunTimer <= 0) {
        hopRival.jumpVy = Math.max(hopRival.jumpVy, 2.8);
        hopRival.cheerTimer = Math.max(hopRival.cheerTimer, 0.35);
      }
      state.spawnTimer += beatInterval;
    }

    // Update Active Notes
    for (let i = 0; i < NOTE_POOL_SIZE; i++) {
      const n = notePool[i];
      if (!n.active) continue;

      if (n.state === 'flying') {
        n.flyTime += dt;
        if (n.flyTime >= n.maxFlyTime) {
          releaseNote(n);
          continue;
        }
        n.vy -= 24.0 * dt;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        n.z += n.vz * dt;
        n.group.position.set(n.x, n.y, n.z);
        n.visualRoot.rotation.x += n.angVx * dt;
        n.visualRoot.rotation.y += n.angVy * dt;
        n.visualRoot.rotation.z += n.angVz * dt;
        const shrink = Math.max(0.02, 1.0 - (n.flyTime / n.maxFlyTime));
        n.visualRoot.scale.setScalar(shrink * 1.15);
        continue;
      }

      if (n.state === 'missed') {
        n.vy -= 26.0 * dt;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        n.z += n.vz * dt;
        n.group.position.set(n.x, n.y, n.z);
        n.visualRoot.rotation.x += n.angVx * dt;
        n.visualRoot.rotation.z += n.angVz * dt;
        if (n.z > DESPAWN_Z + 3.5 || n.y < -3.0) {
          releaseNote(n);
        }
        continue;
      }

      if (n.recoilTimer > 0) {
        n.recoilTimer = Math.max(0, n.recoilTimer - dt);
        n.z += n.vz * dt;
        n.vz *= Math.exp(-8.5 * dt);
      } else {
        n.z += stage.noteSpeed * dt;
      }

      // Magnetic pull acceleration when Pedal 0 (🌪️) is active and note is within 4.5 units of HIT_Z
      if (state.magnetTimer > 0 && n.z < HIT_Z && (HIT_Z - n.z) <= 4.5) {
        n.z += stage.noteSpeed * 0.85 * dt;
        if (Math.random() < 0.35) {
          spawn3DBurst(n.x, n.y, n.z, 2, 1, false);
        }
      }

      n.group.position.set(n.x, n.y, n.z);

      const spawnProgress = THREE.MathUtils.clamp((n.z - SPAWN_Z) / 4.2, 0.25, 1.0);

      if (n.type === 'star') {
        n.starMesh.rotation.y += 4.2 * dt;
        n.starMesh.rotation.x += 2.1 * dt;
        n.visualRoot.scale.setScalar(spawnProgress);
      } else if (n.type === 'balloon') {
        const pulse = (1.0 + Math.sin(state.elapsed * 9.0 + i) * 0.12 + n.recoilTimer * 1.1) * spawnProgress;
        n.visualRoot.scale.setScalar(pulse);
      } else {
        n.drumMesh.rotation.y += 2.4 * dt;
        n.visualRoot.scale.setScalar(spawnProgress);
      }
      n.shadowDisc.scale.setScalar(spawnProgress);

      if (state.magnetTimer > 0 && Math.abs(n.z - HIT_Z) <= 0.95) {
        registerNoteHit(n, 'perfect');
        continue;
      }

      if (n.z > HIT_Z + GOOD_WINDOW) {
        triggerNoteMiss(n);
      }
    }

    const rivalBaseSpreads = [1.01, 0.96, 0.92, 0.87];
    for (let r = 1; r < 5; r++) {
      const actor = idolActors[r];
      if (actor.stunTimer > 0) {
        actor.stunTimer = Math.max(0, actor.stunTimer - dt);
      } else {
        // Multi-frequency rhythm phase so Rivals 1-4 dynamically swap ranks and trade leads
        const wave = 0.92
          + 0.16 * Math.sin(state.elapsed * (1.25 + r * 0.22) + r * 1.9)
          + 0.14 * Math.cos(state.elapsed * (0.68 + (5 - r) * 0.19) + r * 2.7);
        // Kid-friendly mercy rubber-banding: ease off on Stages 1-3 if player trails by > 400 pts; gently keep up on Stages 5-8 if player leads by > 900 pts
        let rubberBand = 1.0;
        const gap = actor.score - state.score;
        if (state.stageIndex < 3 && gap > 400) {
          rubberBand = 0.78;
        } else if (state.stageIndex >= 4 && gap < -900) {
          rubberBand = 1.05;
        }
        actor.score += stage.rivalRate * rivalBaseSpreads[r - 1] * wave * rubberBand * dt;
      }
    }

    if (Math.floor(state.elapsed * 4) !== Math.floor((state.elapsed - dt) * 4)) {
      renderLiveStandings();
    }
    updateHUD();

    if (state.elapsed >= state.duration) {
      finishStage();
    }
  }

  const worldHeadPos = new THREE.Vector3();
  function updateVisuals(dt, nowSec) {
    if (state.contextLost) return;

    // 1. Subtle Spring-Damped Camera Bounce (Zero Rotational Shake)
    if (state.trauma > 0) {
      state.trauma = Math.max(0, state.trauma - 2.4 * dt);
    }
    const springK = 180;
    const springC = 24;

    const accY = -springK * state.camSpringY - springC * state.camSpringVelY;
    state.camSpringVelY += accY * dt;
    state.camSpringY += state.camSpringVelY * dt;

    state.camSpringVelPitch = 0;
    state.camSpringPitch = 0;
    state.camSpringVelRoll = 0;
    state.camSpringRoll = 0;

    const motionScale = getMotionScale();
    const shakeStrength = state.trauma * state.trauma * motionScale;
    const offsetX = Math.sin(nowSec * 22.0) * 0.06 * shakeStrength;
    const offsetY = Math.cos(nowSec * 27.0) * 0.05 * shakeStrength;

    camera.position.set(
      fittedCameraPos.x + offsetX,
      fittedCameraPos.y + state.camSpringY * 0.35 + offsetY,
      fittedCameraPos.z
    );
    camera.lookAt(fittedCameraLook);

    // 2. 3D Rainbow Fever Stage Transformation & Lane Strip Recovery
    const stage = STAGES[state.stageIndex];
    const isRainbowFever = state.feverActive || state.encoreTimer > 0;

    if (isRainbowFever) {
      neonArches.forEach((arch, idx) => {
        const hue = (nowSec * 0.85 + idx * 0.16) % 1.0;
        arch.material.color.setHSL(hue, 1.0, 0.58);
        arch.material.emissive.setHSL(hue, 1.0, 0.55);
        arch.material.emissiveIntensity = 0.85;
      });
      laserBeams.forEach((beam, idx) => {
        const hue = (nowSec * 0.95 + idx * 0.14) % 1.0;
        beam.material.color.setHSL(hue, 1.0, 0.60);
        beam.material.opacity = 0.52;
      });
      drumZoneLight.color.setHSL((nowSec * 0.75) % 1.0, 0.85, 0.72);
    } else {
      neonArches.forEach((arch, idx) => {
        const c = idx % 2 === 0 ? stage.archColor : stage.laserColor;
        arch.material.color.setHex(c);
        arch.material.emissive.setHex(c);
        arch.material.emissiveIntensity = 0.55;
      });
      laserBeams.forEach((beam, idx) => {
        beam.material.color.setHex(idx % 2 === 0 ? stage.laserColor : stage.archColor);
        beam.material.opacity = 0.34;
      });
      drumZoneLight.color.setHex(0xffffff);
    }

    for (let i = 0; i < 3; i++) {
      if (laneFlashTimers[i] > 0) {
        laneFlashTimers[i] = Math.max(0, laneFlashTimers[i] - dt);
        laneStrips[i].material.color.setHex(0xff1744);
        laneStrips[i].material.opacity = 0.72;
      } else {
        laneStrips[i].material.color.setHex(LANE_COLORS[i]);
        laneStrips[i].material.opacity = isRainbowFever
          ? 0.48 + Math.sin(nowSec * 10.0 + i) * 0.12
          : 0.34;
      }
    }

    // 2b. Animate Persistent 3D Magnet Vortex Aura when Pedal 0 is active
    if (state.magnetTimer > 0) {
      magnetVortexGroup.visible = true;
      magnetMainArch.rotation.z = nowSec * 3.5;
      const mScale = 1.0 + Math.sin(nowSec * 9.0) * 0.08;
      magnetMainArch.scale.setScalar(mScale);
      magnetMainMat.opacity = 0.45 + Math.sin(nowSec * 11.0) * 0.18;
      for (let i = 0; i < 3; i++) {
        magnetPadRings[i].rotation.z = -nowSec * 5.0 * (i % 2 === 0 ? 1 : -1);
        magnetPadRings[i].scale.setScalar(1.0 + Math.cos(nowSec * 10.0 + i) * 0.12);
      }
    } else {
      magnetVortexGroup.visible = false;
    }

    // 3. Volume-Preserving Harmonic Squash-and-Rebound Spring on 3D Taiko Drum Pads
    for (let i = 0; i < 3; i++) {
      const t = drumTargets[i];
      const padAcc = -220.0 * t.squashY - 16.0 * t.squashVel;
      t.squashVel += padAcc * dt;
      t.squashY = THREE.MathUtils.clamp(t.squashY + t.squashVel * dt, -0.38, 0.32);

      const scaleY = Math.max(0.58, 1.0 + t.squashY);
      const scaleXZ = 1.0 - 0.5 * t.squashY;
      t.group.scale.set(scaleXZ, scaleY, scaleXZ);

      if (t.glowPulse > 0) {
        t.glowPulse = Math.max(0, t.glowPulse - dt * 4.5);
      }
      t.bodyMat.emissiveIntensity = 0.22 + t.glowPulse * 0.68;
      t.outerRing.rotation.z = nowSec * 1.5 * (i % 2 === 0 ? 1 : -1);
    }

    // 4. Update Expanding 3D Shockwave Rings
    for (let i = 0; i < SHOCKWAVE_POOL_SIZE; i++) {
      const sw = shockwavePool[i];
      if (!sw.active) continue;
      if (sw.delay > 0) {
        sw.delay -= dt;
        if (sw.delay <= 0) {
          sw.mesh.visible = true;
          sw.mat.opacity = 0.92;
        }
        continue;
      }
      sw.life += dt;
      if (sw.life >= sw.maxLife) {
        sw.active = false;
        sw.mesh.visible = false;
        continue;
      }
      const p = sw.life / sw.maxLife;
      const easeOut = 1.0 - Math.pow(1.0 - p, 3);
      const sc = sw.startScale + (sw.endScale - sw.startScale) * easeOut;
      sw.mesh.scale.setScalar(sc);
      sw.mesh.position.z += sw.vz * dt;
      sw.mat.opacity = 0.92 * (1.0 - p);
    }

    // 5. Animate 5 Critter Idols & Rival Pedestal Status Rings
    const danceClock = state.started ? state.elapsed : nowSec * 0.6;
    const beatPhase = (danceClock * (stage.bpm / 60)) * Math.PI;
    const viewH = Math.max(1, (containerEl && containerEl.clientHeight) || window.innerHeight);
    const halfVFovTan = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));

    // Find current #1 leading AI rival (slots 1..4) for Gold Crown Pedestal Ring
    let leadingRivalIdx = 1;
    let highestRivalScore = -1;
    for (let r = 1; r < 5; r++) {
      if (idolActors[r].score > highestRivalScore) {
        highestRivalScore = idolActors[r].score;
        leadingRivalIdx = r;
      }
    }

    for (let i = 0; i < 5; i++) {
      const actor = idolActors[i];
      if (actor.cheerTimer > 0) actor.cheerTimer = Math.max(0, actor.cheerTimer - dt);
      if (actor.spinTimer > 0) actor.spinTimer = Math.max(0, actor.spinTimer - dt);

      if (i > 0) {
        if (actor.stunTimer > 0) {
          const stunFlash = Math.sin(nowSec * 22.0) > 0 ? 0xff1744 : 0xff80ab;
          actor.pedRingMat.color.setHex(stunFlash);
        } else if (i === leadingRivalIdx && state.started && highestRivalScore > 0) {
          actor.pedRingMat.color.setHex(0xffea00);
        } else {
          actor.pedRingMat.color.setHex(0xffffff);
        }
      }

      const targetHopAmp = actor.cheerTimer > 0 || isRainbowFever ? 0.68 : 0.40;
      actor.hopAmp += (targetHopAmp - actor.hopAmp) * (1.0 - Math.exp(-12.0 * dt));

      if (actor.jumpY > 0 || actor.jumpVy !== 0) {
        actor.jumpVy -= 22.0 * dt;
        actor.jumpY += actor.jumpVy * dt;
        if (actor.jumpY <= 0) {
          actor.jumpY = 0;
          actor.jumpVy = 0;
        }
      }

      const pitchAcc = -160.0 * actor.pitchAngle - 14.0 * actor.pitchVel;
      actor.pitchVel += pitchAcc * dt;
      actor.pitchAngle += actor.pitchVel * dt;

      const hop = Math.abs(Math.sin(beatPhase + i * 0.7)) * actor.hopAmp + actor.jumpY;
      actor.dancer.position.y = hop;

      const spinAngle = actor.spinTimer > 0 ? (actor.spinTimer / 0.65) * Math.PI * 2 : 0;
      const stunEnv = actor.stunTimer > 0 ? Math.sin(Math.PI * (actor.stunTimer / actor.stunMax)) : 0;

      actor.torsoGroup.rotation.x = actor.pitchAngle;
      actor.torsoGroup.rotation.y = Math.sin(beatPhase * 0.5 + i) * 0.26 + spinAngle;
      actor.torsoGroup.rotation.z = stunEnv * Math.sin(nowSec * 18.0) * 0.28;
      actor.idolShadow.scale.setScalar(Math.max(0.42, 0.84 - hop * 0.28));

      actor.headBillboard.quaternion.copy(camera.quaternion);

      actor.headBillboard.getWorldPosition(worldHeadPos);
      const distToCam = Math.max(1.0, camera.position.distanceTo(worldHeadPos));
      const baseWorldRadius = 0.92 * idolSlots[i].scale;
      const projectedDiameterPx = (2 * baseWorldRadius / (distToCam * halfVFovTan)) * (viewH * 0.5);
      const targetMinPx = i === 0 ? 54 : 46;
      const scaleBoost = THREE.MathUtils.clamp(targetMinPx / Math.max(10, projectedDiameterPx), 1.0, 2.35);
      actor.headBillboard.scale.setScalar(scaleBoost);
    }

    // 6. Update Flying 3D Star Coins
    idolActors[0].headBillboard.getWorldPosition(coinTargetWorldPos);
    let anyCoinUpdated = false;
    for (let i = 0; i < COIN_POOL_SIZE; i++) {
      const c = coinPool[i];
      if (!c.active) continue;
      anyCoinUpdated = true;
      c.t += dt / c.duration;
      if (c.t < 0) {
        coinInstancedMesh.setMatrixAt(i, zeroMatrix);
        continue;
      }
      if (c.t >= 1.0) {
        c.active = false;
        coinInstancedMesh.setMatrixAt(i, zeroMatrix);
        state.displayedScore = Math.min(state.score, state.displayedScore + c.ptsShare);
        sound.playCoinDing();
        idolActors[0].jumpVy = Math.max(idolActors[0].jumpVy, 2.2);
        updateHUD();
        continue;
      }
      const u = c.t;
      const inv = 1.0 - u;
      const b0 = inv * inv;
      const b1 = 2.0 * inv * u;
      const b2 = u * u;

      const cx = b0 * c.p0x + b1 * c.p1x + b2 * coinTargetWorldPos.x;
      const cy = b0 * c.p0y + b1 * c.p1y + b2 * coinTargetWorldPos.y;
      const cz = b0 * c.p0z + b1 * c.p1z + b2 * coinTargetWorldPos.z;
      c.ry += 14.0 * dt;

      dummyObj.position.set(cx, cy, cz);
      dummyObj.rotation.set(0, c.ry, 0);
      dummyObj.scale.setScalar(1.0 - 0.38 * u);
      dummyObj.updateMatrix();
      coinInstancedMesh.setMatrixAt(i, dummyObj.matrix);
    }
    if (anyCoinUpdated) {
      coinInstancedMesh.instanceMatrix.needsUpdate = true;
    }
    if (state.displayedScore < state.score) {
      state.displayedScore = Math.min(state.score, state.displayedScore + 320 * dt);
      scoreBadgeEl.textContent = `⭐ ${Math.round(state.displayedScore)}`;
    }

    // 7. Animate Stage-Specific 3D Props
    const sIdx = state.stageIndex;
    if (sIdx === 0) {
      animatedStageProps.petals.forEach((p, idx) => {
        p.position.y -= dt * 1.8;
        p.position.x += Math.sin(nowSec * 2 + idx) * dt * 0.8;
        p.rotation.z += dt * 2.0;
        if (p.position.y < 0.2) p.position.y = 10.5;
      });
    } else if (sIdx === 1) {
      animatedStageProps.lollipops.forEach((head, idx) => {
        head.rotation.z = nowSec * 2.2 * (idx % 2 === 0 ? 1 : -1);
      });
    } else if (sIdx === 2) {
      animatedStageProps.waves.forEach((wv, idx) => {
        wv.position.y = 0.5 + Math.sin(nowSec * 3 + idx) * 0.35;
      });
      animatedStageProps.bubbles.forEach(b => {
        b.position.y += dt * 2.2;
        if (b.position.y > 10.5) b.position.y = 0.3;
      });
    } else if (sIdx === 3) {
      animatedStageProps.palms.forEach((fr, idx) => {
        fr.rotation.z = Math.sin(nowSec * 2.0 + idx) * 0.14;
      });
    } else if (sIdx === 4) {
      animatedStageProps.crystals.forEach((cr, idx) => {
        cr.rotation.y = nowSec * 1.8 + idx;
        cr.position.y = 2.2 + (idx % 3) * 1.1 + Math.sin(nowSec * 2.5 + idx) * 0.4;
      });
    } else if (sIdx === 5) {
      animatedStageProps.embers.forEach(em => {
        em.position.y += dt * 3.0;
        em.rotation.x += dt * 4.0;
        if (em.position.y > 10.5) em.position.y = 0.3;
      });
    } else if (sIdx === 6) {
      animatedStageProps.snowflakes.forEach((sn, idx) => {
        sn.position.y -= dt * 2.1;
        sn.position.x += Math.cos(nowSec * 1.8 + idx) * dt * 0.6;
        if (sn.position.y < 0.2) sn.position.y = 10.5;
      });
    } else if (sIdx === 7) {
      animatedStageProps.planets.forEach((pl, idx) => {
        pl.rotation.y = nowSec * 0.8 * (idx === 0 ? 1 : -1);
      });
      if (animatedStageProps.starfield) {
        animatedStageProps.starfield.rotation.y = nowSec * 0.12;
      }
    }

    laserBeams.forEach((beam, idx) => {
      beam.rotation.z = (idx - 2.5) * 0.14 + Math.sin(nowSec * 2.2 + idx) * 0.22;
    });

    // 8. Update InstancedMesh 3D Particle Pool with Exponential Air Drag
    let anyParticleUpdated = false;
    const dragFactor = Math.exp(-5.0 * dt);
    for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
      const p = particlePool[i];
      if (!p.active) continue;
      anyParticleUpdated = true;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        particleInstancedMesh.setMatrixAt(i, zeroMatrix);
        continue;
      }
      p.vx *= dragFactor;
      p.vz *= dragFactor;
      p.vy -= 14.5 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.rx += 6.0 * dt;
      p.ry += 6.0 * dt;
      const fade = Math.max(0.05, 1.0 - p.life / p.maxLife) * p.baseScale;
      dummyObj.position.set(p.x, p.y, p.z);
      dummyObj.rotation.set(p.rx, p.ry, 0);
      dummyObj.scale.setScalar(fade);
      dummyObj.updateMatrix();
      particleInstancedMesh.setMatrixAt(i, dummyObj.matrix);
    }
    if (anyParticleUpdated) {
      particleInstancedMesh.instanceMatrix.needsUpdate = true;
    }
  }

  // WebGL Context Lost / Restored Handlers
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    state.contextLost = true;
  }, false);

  canvas.addEventListener('webglcontextrestored', () => {
    state.contextLost = false;
    clearStageEnvCache();
    applyStageTheme(STAGES[state.stageIndex]);
    fitCameraToViewport();
  }, false);

  if (btnStartPlay) {
    btnStartPlay.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      activateGameplayGate();
    });
  }

  // Controls & Input Listeners
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const code = e.code;
    if (state.finished && (code === 'Enter' || code === 'Space')) {
      e.preventDefault();
      if (state.lastRank <= 3 && state.stageIndex < STAGES.length - 1) {
        startStage(state.stageIndex + 1, true);
      } else {
        startStage(state.stageIndex, true);
      }
      return;
    }
    if (!state.started && (code === 'Enter' || code === 'Space')) {
      e.preventDefault();
      activateGameplayGate();
      return;
    }
    if (code === 'ArrowLeft' || code === 'KeyA' || code === 'KeyJ') {
      e.preventDefault();
      hitLane(0);
    } else if (code === 'ArrowDown' || code === 'ArrowUp' || code === 'KeyS' || code === 'KeyW' || code === 'KeyK') {
      e.preventDefault();
      hitLane(1);
    } else if (code === 'ArrowRight' || code === 'KeyD' || code === 'KeyL') {
      e.preventDefault();
      hitLane(2);
    } else if (code === 'Digit1' || code === 'Numpad1') {
      e.preventDefault();
      usePedal(0);
    } else if (code === 'Digit2' || code === 'Numpad2' || code === 'Space') {
      e.preventDefault();
      usePedal(1);
    } else if (code === 'Digit3' || code === 'Numpad3') {
      e.preventDefault();
      usePedal(2);
    }
  });

  for (let i = 0; i < 3; i++) {
    const padEl = document.getElementById(`pad-${i}`);
    if (padEl) {
      padEl.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        hitLane(i);
      });
    }
    const pedalEl = document.getElementById(`pedal-${i}`);
    if (pedalEl) {
      pedalEl.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        usePedal(i);
      });
    }
  }

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  canvas.addEventListener('pointerdown', (e) => {
    activateGameplayGate();
    if (state.finished) return;
    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);
    for (let i = 0; i < 3; i++) {
      const hits = raycaster.intersectObject(drumTargets[i].group, true);
      if (hits.length > 0) {
        hitLane(i);
        return;
      }
    }
  });

  const btnCamera = document.getElementById('btn-camera');
  const CAMERA_BADGES = ['🎥1️⃣', '🎥2️⃣', '🎥3️⃣'];
  btnCamera.addEventListener('click', () => {
    cameraPreset = (cameraPreset + 1) % CAMERA_PRESETS.length;
    btnCamera.textContent = CAMERA_BADGES[cameraPreset];
    fitCameraToViewport();
  });

  const btnSound = document.getElementById('btn-sound');
  btnSound.addEventListener('click', () => {
    sound.muted = !sound.muted;
    btnSound.textContent = sound.muted ? '🔇' : '🔊';
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    startStage(state.stageIndex, true);
  });

  if (btnPodiumCritter) {
    btnPodiumCritter.addEventListener('click', () => {
      openCharacterPickerOverlay();
    });
  }

  btnPodiumRetry.addEventListener('click', () => {
    startStage(state.stageIndex, true);
  });

  btnPodiumNext.addEventListener('click', () => {
    if (state.lastRank <= 3 && state.stageIndex < STAGES.length - 1) {
      startStage(state.stageIndex + 1, true);
    }
  });

  window.addEventListener('resize', () => {
    fitCameraToViewport();
  });

  // Main Animation Loop
  let lastFrameTime = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
    lastFrameTime = now;

    stepSimulation(dt);
    updateVisuals(dt, now / 1000);
    if (!state.contextLost) {
      renderer.render(scene, camera);
    }
  }

  // Expose QA & Automation API on window.game
  window.game = {
    CRITTERS,
    STAGES,
    state,
    saveState,
    renderer,
    scene,
    camera,
    idolActors,
    drumTargets,
    magnetVortexGroup,
    notePool,
    shockwavePool,
    particlePool,
    coinPool,
    stagePropGroups,
    stageEmblemSprite,
    fitCameraToViewport,
    startGame: () => activateGameplayGate(),
    openCharacterPicker: () => openCharacterPickerOverlay(),
    hitLane,
    usePedal,
    selectCritter,
    selectStage,
    restartStage: () => startStage(state.stageIndex, true),
    forceFinish: (rank) => finishStage(rank),
    fastForward: (seconds, autoPlayMode) => {
      activateGameplayGate();
      const step = 0.025;
      const steps = Math.floor(seconds / step);
      for (let i = 0; i < steps && !state.finished; i++) {
        if (autoPlayMode === 'skilled') {
          for (let k = 0; k < NOTE_POOL_SIZE; k++) {
            const n = notePool[k];
            if (n.active && n.state === 'approaching' && Math.abs(n.z - HIT_Z) <= 0.85) {
              hitLane(n.lane);
            }
          }
          for (let p = 0; p < 3; p++) {
            if (state.pedalCooldowns[p] <= 0) usePedal(p);
          }
        }
        stepSimulation(step);
        updateVisuals(step, (performance.now() / 1000) + i * step);
      }
      state.displayedScore = state.score;
      updateHUD();
      if (!state.contextLost) {
        renderer.render(scene, camera);
      }
      return window.game.getState();
    },
    getState: () => ({
      started: state.started,
      assetsReady,
      stageId: STAGES[state.stageIndex].id,
      selectedCritter: saveState.selectedCritter,
      unlockedStage: saveState.unlockedStage,
      stageStars: Object.assign({}, saveState.stageStars),
      elapsed: state.elapsed,
      duration: state.duration,
      score: Math.floor(state.score),
      displayedScore: Math.round(state.displayedScore),
      combo: state.combo,
      trauma: state.trauma,
      fever: state.fever,
      feverActive: state.feverActive,
      magnetTimer: state.magnetTimer,
      encoreTimer: state.encoreTimer,
      blastTimer: state.blastTimer,
      finished: state.finished,
      lastRank: state.lastRank,
      lastStars: state.lastStars,
      geometries: renderer.info.memory.geometries,
      standings: getSortedStandings().map((a, idx) => ({
        rank: idx + 1,
        id: a.critter.id,
        isPlayer: a.isPlayer,
        score: Math.floor(a.score)
      }))
    })
  };

  // Boot Stage 1
  startStage(0, false);
  requestAnimationFrame(animate);
})();
