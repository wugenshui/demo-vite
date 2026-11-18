(function (root) {
  'use strict';

  // ---------- 口型定义 ----------
  // open: 张嘴幅度  width: 嘴宽  round: 圆唇  teeth: 露齿  press: 抿唇  smile: 嘴角上扬
  const VISEMES = {
    rest: { open: 0,    width: 0.45, round: 0,   teeth: 0,   press: 0,   smile: 0.15 },
    A:    { open: 1,    width: 0.6,  round: 0.1, teeth: 0.5, press: 0,   smile: 0.1 },
    O:    { open: 0.7,  width: 0.3,  round: 0.8, teeth: 0.2, press: 0,   smile: 0 },
    E:    { open: 0.5,  width: 0.65, round: 0,   teeth: 0.8, press: 0,   smile: 0.2 },
    I:    { open: 0.22, width: 0.85, round: 0,   teeth: 1,   press: 0,   smile: 0.5 },
    U:    { open: 0.18, width: 0.15, round: 1,   teeth: 0,   press: 0,   smile: 0 },
    M:    { open: 0,    width: 0.42, round: 0,   teeth: 0,   press: 1,   smile: 0 },
    F:    { open: 0.12, width: 0.55, round: 0,   teeth: 1,   press: 0.3, smile: 0.1 },
    S:    { open: 0.18, width: 0.62, round: 0,   teeth: 1,   press: 0,   smile: 0.2 },
  };
  const VISEME_NAMES = {
    rest: '闭嘴', A: '啊 (大张)', O: '哦 (圆张)', E: '呃 (半张)', I: '衣 (扁咧)',
    U: '乌 (撅嘴)', M: '双唇闭合 b/p/m', F: '咬唇 f', S: '齿音 z/c/s/d/t…',
  };
  const PARAM_KEYS = Object.keys(VISEMES.rest);

  // ---------- 文本 → 口型时间轴 ----------
  const SYLLABLE_MS = 240;
  const SYLLABLE_GAP_MS = 20;
  const DIGIT_PINYIN = ['ling', 'yi', 'er', 'san', 'si', 'wu', 'liu', 'qi', 'ba', 'jiu'];
  const FINAL_SPECIAL = {
    ao: ['A', 'U'], iao: ['I', 'A', 'U'], ian: ['I', 'E'], ong: ['O', 'U'],
    iong: ['I', 'O', 'U'], ui: ['U', 'E', 'I'], iu: ['I', 'O', 'U'], un: ['U', 'E'],
  };
  const VOWEL_VISEME = { a: 'A', o: 'O', e: 'E', i: 'I', u: 'U' };

  function splitPinyin(py) {
    const m = py.match(/^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?(.*)$/);
    let initial = m[1] || '';
    let final = m[2];
    if (initial === 'y') {
      if (!/^[iu]/.test(final)) final = 'i' + final;
      initial = '';
    } else if (initial === 'w') {
      if (!final.startsWith('u')) final = 'u' + final;
      initial = '';
    }
    return [initial, final.replace(/ü|v/g, 'u')];
  }

  function finalVisemes(final) {
    if (FINAL_SPECIAL[final]) return FINAL_SPECIAL[final];
    const out = [];
    for (const ch of final) {
      const v = VOWEL_VISEME[ch];
      if (v && out[out.length - 1] !== v) out.push(v);
    }
    return out.length ? out : ['E'];
  }

  function initialViseme(initial) {
    if (/^[bpm]$/.test(initial)) return 'M';
    if (initial === 'f') return 'F';
    if (/^(zh|ch|sh|[rzcsjqxdtnl])$/.test(initial)) return 'S';
    return null;
  }

  function syllableSegments(py) {
    const [initial, final] = splitPinyin(py);
    const segs = [];
    let budget = SYLLABLE_MS - SYLLABLE_GAP_MS;
    const iv = initialViseme(initial);
    if (iv) {
      segs.push({ v: iv, d: budget * 0.28 });
      budget *= 0.72;
    }
    const vs = finalVisemes(final);
    const weights = vs.map((_, i) => (vs.length > 1 && i === 0 ? 0.6 : 1));
    const sum = weights.reduce((a, b) => a + b, 0);
    vs.forEach((v, i) => segs.push({ v, d: (budget * weights[i]) / sum }));
    segs.push({ v: 'rest', d: SYLLABLE_GAP_MS });
    return segs;
  }

  function letterSegments(ch) {
    const c = ch.toLowerCase();
    if (VOWEL_VISEME[c]) return [{ v: VOWEL_VISEME[c], d: 110 }];
    if ('bpm'.includes(c)) return [{ v: 'M', d: 80 }];
    if ('fv'.includes(c)) return [{ v: 'F', d: 80 }];
    if ('wq'.includes(c)) return [{ v: 'U', d: 80 }];
    if (c === 'y') return [{ v: 'I', d: 90 }];
    return [{ v: 'S', d: 70 }];
  }

  function charPinyinList(text) {
    const chars = Array.from(text);
    if (root.pinyinPro) {
      const list = root.pinyinPro.pinyin(text, { type: 'all', toneType: 'none' });
      if (list.length === chars.length) return list.map((x) => ({ ch: x.origin, py: x.isZh ? x.pinyin : '' }));
    }
    return chars.map((ch) => ({ ch, py: /[\u4e00-\u9fff]/.test(ch) ? 'da' : '' }));
  }

  // 返回 { segments: [{start,end,v,charIndex,py}], charStart: Map<charIndex,ms>, total, chars }
  function buildTimeline(text) {
    const list = charPinyinList(text);
    const segments = [];
    const charStart = new Map();
    let t = 0;
    let charIndex = 0; // UTF-16 下标，与 SpeechSynthesis 的 charIndex 对齐

    for (const { ch, py } of list) {
      let segs;
      let label = py;
      if (py) {
        segs = syllableSegments(py);
      } else if (/[0-9]/.test(ch)) {
        label = DIGIT_PINYIN[+ch];
        segs = syllableSegments(label);
      } else if (/[a-zA-Z]/.test(ch)) {
        segs = letterSegments(ch);
        label = ch;
      } else if (/[，,、；;：:]/.test(ch)) {
        segs = [{ v: 'rest', d: 250 }];
      } else if (/[。.！!？?…\n]/.test(ch)) {
        segs = [{ v: 'rest', d: 420 }];
      } else if (/\s/.test(ch)) {
        segs = [{ v: 'rest', d: 60 }];
      } else {
        segs = [];
      }

      charStart.set(charIndex, t);
      for (const s of segs) {
        segments.push({ start: t, end: t + s.d, v: s.v, charIndex, py: label });
        t += s.d;
      }
      charIndex += ch.length;
    }
    charStart.set(charIndex, t);
    return { segments, charStart, total: t, chars: list.map((x) => x.ch) };
  }

  function timeOfChar(tl, idx) {
    for (let i = idx; i <= idx + 4; i++) {
      if (tl.charStart.has(i)) return tl.charStart.get(i);
    }
    return null;
  }

  function segmentAt(tl, t) {
    const segs = tl.segments;
    let lo = 0;
    let hi = segs.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (t < segs[mid].start) hi = mid - 1;
      else if (t >= segs[mid].end) lo = mid + 1;
      else return segs[mid];
    }
    return null;
  }

  // 按句切分，规避 Chrome 长文本中断，同时每句开头都能重新对齐
  function splitChunks(text) {
    const chunks = [];
    const re = /[^。！？!?；;\n]+[。！？!?；;\n]*|[。！？!?；;\n]+/g;
    let m;
    while ((m = re.exec(text))) {
      if (m[0].trim()) chunks.push({ text: m[0], offset: m.index });
    }
    return chunks;
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  // ---------- 声音 ----------
  const synth = root.speechSynthesis || null;
  const FEMALE_VOICE = /Xiaoxiao|Xiaoyi|Xiaochen|Xiaohan|晓晓|晓伊|Huihui|慧慧|Yaoyao|瑶瑶/i;
  const MALE_VOICE = /Yunxi|Yunjian|Yunyang|Yunze|云希|云健|云扬|云泽|Kangkang|康康/i;

  function voiceScore(v) {
    let s = 0;
    if (/^zh[-_]CN/i.test(v.lang)) s += 100;
    else if (/^zh/i.test(v.lang)) s += 50;
    if (/Xiaoxiao|晓晓/i.test(v.name)) s += 30;
    if (/Natural|Online/i.test(v.name)) s += 20;
    return s;
  }

  function chineseVoices() {
    if (!synth) return [];
    return synth
      .getVoices()
      .filter((v) => /^zh/i.test(v.lang))
      .sort((a, b) => voiceScore(b) - voiceScore(a));
  }

  // 朗读页面展示用：有中文声音只列中文，没有就列全部
  function listVoices() {
    if (!synth) return [];
    const zh = chineseVoices();
    return zh.length ? zh : synth.getVoices();
  }

  // pref: SpeechSynthesisVoice | 'female' | 'male' | 'default' | 'silent' | 音色名片段
  function resolveVoice(pref) {
    if (pref === 'silent') return null;
    if (pref && typeof pref === 'object') return pref;
    const zh = chineseVoices();
    if (!zh.length) return null;
    if (pref === 'female') return zh.find((v) => FEMALE_VOICE.test(v.name)) || zh[0];
    if (pref === 'male') return zh.find((v) => MALE_VOICE.test(v.name)) || zh[0];
    if (typeof pref === 'string' && pref && pref !== 'default') {
      return zh.find((v) => v.name.includes(pref)) || zh[0];
    }
    return zh[0];
  }

  // ---------- 播放器：语音 + 时间轴同步 ----------
  const START_TIMEOUT_MS = 4000;
  const END_GRACE_MS = 6000;

  const player = {
    session: 0,
    tl: null,
    t: 0,
    speed: 1,
    limit: 0,
    playing: false,
    silent: false,
    external: false,
    audio: null,
    audioTimer: null,
    lastSync: null,
    resolve: null,
    hooks: { onStart() {}, onEnd() {} },

    detachAudio() {
      if (this.audioTimer) {
        clearTimeout(this.audioTimer);
        this.audioTimer = null;
      }
      const audio = this.audio;
      this.audio = null;
      this.external = false;
      if (!audio) return;
      audio.onended = null;
      audio.onerror = null;
      try { audio.pause(); } catch (e) { /* 已经停了 */ }
      audio.removeAttribute('src');
      audio.src = '';
    },

    playExternal(session, audioUrl) {
      const audio = new Audio();
      this.audio = audio;
      this.external = true;
      this.silent = false;
      this.limit = this.tl ? this.tl.total : Infinity;
      const applyDuration = () => {
        if (session !== this.session || !this.tl || !this.tl.total) return;
        const ms = Number.isFinite(audio.duration) ? audio.duration * 1000 : 0;
        if (ms > 0) this.speed = ms / this.tl.total;
      };
      let failed = false;
      const fail = () => {
        if (failed || session !== this.session) return;
        failed = true;
        this.detachAudio();
        this.speed = this.rate || 1;
        this.goSilent(session);
      };
      audio.onended = () => {
        if (session === this.session) this.finish();
      };
      audio.onerror = fail;
      audio.src = audioUrl;
      const tick = () => {
        if (session !== this.session || !this.playing || !this.external) return;
        const dur = audio.duration;
        if (dur && this.tl && this.tl.total) {
          this.t = Math.min(this.tl.total, (audio.currentTime / dur) * this.tl.total);
        }
        this.audioTimer = setTimeout(tick, 40);
      };
      audio.play().then(() => {
        if (session !== this.session) return;
        applyDuration();
        tick();
      }).catch(fail);
    },

    speak(text, { voice = null, rate = 1, pitch = 1, audioUrl = null } = {}) {
      this.stop();
      const session = ++this.session;
      this.tl = buildTimeline(text);
      this.t = 0;
      this.speed = rate;
      this.rate = rate;
      this.lastSync = null;
      this.playing = true;
      this.silent = !audioUrl && (!voice || !synth);
      this.voice = voice;
      this.hooks.onStart(this.tl);
      const done = new Promise((resolve) => (this.resolve = resolve));

      if (audioUrl) {
        this.playExternal(session, audioUrl);
        return done;
      }

      if (this.silent) {
        this.goSilent(session);
        return done;
      }

      const chunks = splitChunks(text);
      if (!chunks.length) {
        this.finish();
        return done;
      }
      this.limit = 0;
      let started = false;
      // 在线语音可能因断网等原因迟迟不开始或不触发 onend，用定时器兜底，保证调用方总能等到结果
      setTimeout(() => {
        if (session !== this.session || started || this.silent) return;
        console.warn('语音迟迟没有开始，切换为静音演示');
        synth.cancel();
        this.goSilent(session);
      }, START_TIMEOUT_MS);
      setTimeout(() => {
        if (session !== this.session || !this.playing) return;
        synth.cancel();
        this.finish();
      }, (this.tl.total / rate) * 2 + END_GRACE_MS);

      chunks.forEach((c, i) => {
        const u = new SpeechSynthesisUtterance(c.text);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = rate;
        u.pitch = pitch;
        const nextOffset = i + 1 < chunks.length ? chunks[i + 1].offset : text.length;
        u.onstart = () => {
          if (session !== this.session) return;
          started = true;
          this.limit = timeOfChar(this.tl, nextOffset) ?? this.tl.total;
          this.sync(c.offset, true);
        };
        u.onboundary = (e) => {
          if (session !== this.session || e.name === 'sentence') return;
          this.sync(c.offset + e.charIndex, false);
        };
        if (i === chunks.length - 1) {
          u.onend = () => session === this.session && this.finish();
        }
        u.onerror = (e) => {
          if (session !== this.session || e.error === 'interrupted' || e.error === 'canceled') return;
          console.warn('语音合成出错，切换为静音演示：', e.error);
          if (synth) synth.cancel();
          this.goSilent(session);
        };
        synth.speak(u);
      });
      return done;
    },

    sync(charIdx, isChunkStart) {
      const target = timeOfChar(this.tl, charIdx);
      if (target == null) return;
      const now = performance.now();
      if (!isChunkStart && this.lastSync) {
        const realDt = now - this.lastSync.real;
        const tlDt = target - this.lastSync.tl;
        if (realDt > 150 && tlDt > 0) {
          const measured = tlDt / realDt;
          this.speed = clamp(this.speed * 0.6 + measured * 0.4, this.rate * 0.5, this.rate * 2.5);
        }
      }
      this.t = target;
      this.lastSync = { real: now, tl: target };
    },

    // 静音播放：动画帧在后台标签页会暂停，用定时器保证按估算时长结束
    goSilent(session) {
      this.silent = true;
      this.limit = Infinity;
      const remaining = Math.max(0, (this.tl.total - this.t) / this.speed);
      setTimeout(() => session === this.session && this.playing && this.finish(), remaining + 100);
    },

    settle(result) {
      const resolve = this.resolve;
      this.resolve = null;
      if (resolve) resolve(result);
    },

    finish() {
      if (this.audioTimer) {
        clearTimeout(this.audioTimer);
        this.audioTimer = null;
      }
      if (this.audio) {
        this.audio.onended = null;
        this.audio.onerror = null;
        try { this.audio.pause(); } catch (e) { /* 播放已经结束 */ }
        this.audio = null;
      }
      this.external = false;
      this.playing = false;
      this.tl = null;
      this.hooks.onEnd(true);
      this.settle('done');
    },

    stop() {
      this.session++;
      const wasPlaying = this.playing;
      if (synth && wasPlaying && !this.external) synth.cancel();
      this.detachAudio();
      this.playing = false;
      this.tl = null;
      if (wasPlaying) this.hooks.onEnd(false);
      this.settle('interrupted');
    },

    // 返回当前段（无则 null）
    update(dt) {
      if (!this.playing || !this.tl) return null;
      if (!this.external) this.t = Math.min(this.t + dt * this.speed, this.limit);
      if (this.silent && this.t >= this.tl.total) {
        this.finish();
        return null;
      }
      if (!this.external && this.t >= this.limit) return null;
      return segmentAt(this.tl, this.t);
    },
  };

  // ---------- SVG 形象 ----------
  const AVATAR_SVG = `<svg id="avatar" viewBox="0 0 400 480" aria-label="数字人">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fdeef4" />
      <stop offset="100%" stop-color="#dfe6ff" />
    </linearGradient>
    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff4ec" />
      <stop offset="100%" stop-color="#ffe2d1" />
    </linearGradient>
    <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4a3346" />
      <stop offset="100%" stop-color="#2b1d2c" />
    </linearGradient>
    <linearGradient id="hairFrontGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5a3f55" />
      <stop offset="100%" stop-color="#3a2738" />
    </linearGradient>
    <linearGradient id="irisGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a1a4a" />
      <stop offset="55%" stop-color="#6a4fd6" />
      <stop offset="100%" stop-color="#b9c8ff" />
    </linearGradient>
    <radialGradient id="blushGrad">
      <stop offset="0%" stop-color="#ff8fa6" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#ff8fa6" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="lipGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4a7ae" />
      <stop offset="100%" stop-color="#e98893" />
    </linearGradient>
    <clipPath id="eyeClipL"><ellipse cx="152" cy="236" rx="22" ry="21" /></clipPath>
    <clipPath id="eyeClipR"><ellipse cx="248" cy="236" rx="22" ry="21" /></clipPath>
    <clipPath id="mouthClip">
      <path id="mouthClipPath" d="" />
    </clipPath>
  </defs>

  <rect width="400" height="480" fill="url(#bgGrad)" />
  <circle cx="60" cy="80" r="40" fill="#ffffff" opacity="0.35" />
  <circle cx="345" cy="120" r="26" fill="#ffffff" opacity="0.4" />
  <circle cx="330" cy="380" r="50" fill="#ffffff" opacity="0.25" />
  <circle cx="80" cy="330" r="18" fill="#ffffff" opacity="0.35" />

  <g id="head">
    <!-- 后发 -->
    <path d="M72,205 C60,105 128,55 200,55 C272,55 340,105 328,205
             C336,300 348,400 362,480 L38,480 C52,400 64,300 72,205 Z" fill="url(#hairGrad)" />

    <!-- 脖子与衣服 -->
    <path d="M174,340 L226,340 L230,410 L170,410 Z" fill="#ffe2d1" />
    <path d="M174,350 C190,372 210,372 226,350 L226,368 C210,385 190,385 174,368 Z" fill="#f2c4ae" opacity="0.7" />
    <path d="M50,480 C58,428 118,404 172,398 L228,398 C282,404 342,428 350,480 Z" fill="#fbfcff" />
    <path d="M172,398 L200,436 L228,398 L250,402 L200,458 L150,402 Z" fill="#33407a" />
    <path d="M186,438 L200,448 L214,438 L214,456 L200,448 L186,456 Z" fill="#ff7b9c" />
    <circle cx="200" cy="448" r="4" fill="#e85d82" />

    <!-- 脸 -->
    <path d="M88,212 C88,298 140,366 200,386 C260,366 312,298 312,212
             C312,128 262,92 200,92 C138,92 88,128 88,212 Z" fill="url(#skinGrad)" />
    <!-- 腮红 -->
    <ellipse cx="128" cy="288" rx="26" ry="13" fill="url(#blushGrad)" />
    <ellipse cx="272" cy="288" rx="26" ry="13" fill="url(#blushGrad)" />
    <path d="M118,284 l6,-6 M126,286 l6,-6 M134,288 l6,-6" stroke="#ff8fa6" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
    <path d="M262,288 l6,-6 M270,286 l6,-6 M278,284 l6,-6" stroke="#ff8fa6" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />

    <!-- 眉毛 -->
    <g id="brows">
      <path d="M130,200 Q152,190 176,197" stroke="#4a3346" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M224,197 Q248,190 270,200" stroke="#4a3346" stroke-width="3.5" stroke-linecap="round" fill="none" />
    </g>

    <!-- 眼睛 -->
    <g id="eyeL">
      <ellipse cx="152" cy="236" rx="22" ry="21" fill="#ffffff" />
      <g clip-path="url(#eyeClipL)">
        <g class="iris">
          <ellipse cx="153" cy="238" rx="15" ry="19" fill="url(#irisGrad)" />
          <ellipse cx="153" cy="236" rx="7" ry="10" fill="#1a0f2e" />
          <ellipse cx="153" cy="248" rx="9" ry="4" fill="#d6e0ff" opacity="0.5" />
          <circle cx="147" cy="228" r="5.5" fill="#ffffff" />
          <circle cx="160" cy="246" r="2.5" fill="#ffffff" />
        </g>
        <path d="M128,218 C140,224 166,224 176,218 L176,212 L128,212 Z" fill="#000000" opacity="0.08" />
      </g>
      <path d="M126,230 C132,212 168,208 180,224" stroke="#2b1d2c" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <path d="M126,230 L119,222 M130,222 L123,214" stroke="#2b1d2c" stroke-width="2.5" stroke-linecap="round" />
      <path d="M138,256 Q152,260 166,256" stroke="#b07d8a" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6" />
    </g>
    <g id="eyeR">
      <ellipse cx="248" cy="236" rx="22" ry="21" fill="#ffffff" />
      <g clip-path="url(#eyeClipR)">
        <g class="iris">
          <ellipse cx="247" cy="238" rx="15" ry="19" fill="url(#irisGrad)" />
          <ellipse cx="247" cy="236" rx="7" ry="10" fill="#1a0f2e" />
          <ellipse cx="247" cy="248" rx="9" ry="4" fill="#d6e0ff" opacity="0.5" />
          <circle cx="241" cy="228" r="5.5" fill="#ffffff" />
          <circle cx="254" cy="246" r="2.5" fill="#ffffff" />
        </g>
        <path d="M224,218 C234,224 260,224 272,218 L272,212 L224,212 Z" fill="#000000" opacity="0.08" />
      </g>
      <path d="M274,230 C268,212 232,208 220,224" stroke="#2b1d2c" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <path d="M274,230 L281,222 M270,222 L277,214" stroke="#2b1d2c" stroke-width="2.5" stroke-linecap="round" />
      <path d="M234,256 Q248,260 262,256" stroke="#b07d8a" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6" />
    </g>

    <!-- 鼻子 -->
    <path d="M198,284 Q202,290 206,287" stroke="#e0a283" stroke-width="2" stroke-linecap="round" fill="none" />

    <!-- 嘴 -->
    <g id="mouth">
      <path id="mouthOuter" d="" fill="url(#lipGrad)" />
      <path id="mouthInner" d="" fill="#8a2f45" stroke="#7a2a3c" stroke-width="1.4" stroke-linejoin="round" />
      <g clip-path="url(#mouthClip)">
        <ellipse id="tongue" cx="200" cy="330" rx="10" ry="5" fill="#f07c8e" />
        <rect id="teethTop" x="185" y="315" width="30" height="5" rx="2" fill="#ffffff" />
        <rect id="teethBottom" x="185" y="330" width="30" height="5" rx="2" fill="#f6f2f4" />
      </g>
    </g>

    <!-- 刘海与鬓发 -->
    <path d="M86,232 C76,140 128,86 200,84 C274,84 326,140 314,234
             C306,196 296,176 284,162 L276,204 C266,176 252,156 236,144 L226,192
             C214,166 200,150 186,142 L172,196 C164,170 154,156 142,150 L128,212
             C120,196 110,184 102,176 C94,194 89,212 86,232 Z" fill="url(#hairFrontGrad)" />
    <path d="M90,196 C70,262 70,350 96,430 C104,390 108,338 108,290 C104,256 98,224 90,196 Z" fill="url(#hairFrontGrad)" />
    <path d="M310,196 C330,262 330,350 304,430 C296,390 292,338 292,290 C296,256 302,224 310,196 Z" fill="url(#hairFrontGrad)" />
    <path d="M140,112 C165,100 200,98 222,100" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.12" />
    <path d="M196,86 C188,64 200,48 218,46 C206,56 202,70 206,86" fill="#3a2738" />
    <!-- 发饰 -->
    <g transform="translate(276,112) rotate(20)">
      <ellipse cx="-10" cy="0" rx="11" ry="7" fill="#ff8fab" />
      <ellipse cx="10" cy="0" rx="11" ry="7" fill="#ff8fab" />
      <circle cx="0" cy="0" r="5" fill="#ff6f96" />
    </g>
  </g>
</svg>`;

  function mouthPaths(p) {
    const cx = 200;
    const cy = 322;
    let hw = 12 + p.width * 13;
    hw *= 1 - 0.25 * p.round;
    const openH = p.open * 24;
    const ui = openH * 0.3;
    const li = openH * 0.7;
    const k = 0.55 + 0.4 * p.round;
    const cornerY = cy - p.smile * 3;
    const hwi = hw * 0.9;

    const inner =
      `M${cx - hwi},${cornerY} C${cx - hwi * k},${cy - ui} ${cx + hwi * k},${cy - ui} ${cx + hwi},${cornerY} ` +
      `C${cx + hwi * k},${cy + li} ${cx - hwi * k},${cy + li} ${cx - hwi},${cornerY}Z`;

    const uo = ui + 3 - p.press * 1;
    const lo = li + 4.5 - p.press * 1.5;
    const ho = hw + 2;
    const outer =
      `M${cx - ho},${cornerY} C${cx - ho * 0.7},${cy - uo} ${cx - ho * 0.25},${cy - uo - 1.5} ${cx},${cy - uo + 1} ` +
      `C${cx + ho * 0.25},${cy - uo - 1.5} ${cx + ho * 0.7},${cy - uo} ${cx + ho},${cornerY} ` +
      `C${cx + ho * 0.75},${cy + lo * 1.25} ${cx - ho * 0.75},${cy + lo * 1.25} ${cx - ho},${cornerY}Z`;

    return { cx, cy, hw, hwi, ui, li, inner, outer };
  }

  // ---------- 挂载与动画 ----------
  const cur = { ...VISEMES.rest };
  let speakingNow = false;
  const voiceListeners = [];

  function mount(container, { subtitleEl = null, visemeEl = null, pinyinEl = null, avatar = 'live2d' } = {}) {
    const doc = root.document;
    container.classList.add('avatar-box');
    container.innerHTML =
      '<canvas id="live2dCanvas" hidden></canvas>' +
      '<div id="live2dTip" class="live2d-tip" hidden></div>' +
      AVATAR_SVG;

    const q = (id) => container.querySelector('#' + id);
    const el = {
      svg: q('avatar'), head: q('head'), brows: q('brows'), eyeL: q('eyeL'), eyeR: q('eyeR'),
      mouthOuter: q('mouthOuter'), mouthInner: q('mouthInner'), mouthClipPath: q('mouthClipPath'),
      teethTop: q('teethTop'), teethBottom: q('teethBottom'), tongue: q('tongue'),
      irises: container.querySelectorAll('.iris'),
    };

    function renderMouth(p) {
      const { cx, hw, hwi, ui, li, inner, outer } = mouthPaths(p);
      el.mouthInner.setAttribute('d', inner);
      el.mouthClipPath.setAttribute('d', inner);
      el.mouthOuter.setAttribute('d', outer);

      const topY = 322 - ui * 0.75;
      el.teethTop.setAttribute('x', cx - hw);
      el.teethTop.setAttribute('width', hw * 2);
      el.teethTop.setAttribute('y', topY - 3);
      el.teethTop.setAttribute('height', 3 + 4 * p.teeth);
      el.teethTop.setAttribute('opacity', p.teeth);

      const bottomY = 322 + li * 0.75;
      el.teethBottom.setAttribute('x', cx - hw);
      el.teethBottom.setAttribute('width', hw * 2);
      el.teethBottom.setAttribute('y', bottomY - 3 * p.teeth);
      el.teethBottom.setAttribute('height', 6);
      el.teethBottom.setAttribute('opacity', p.teeth * 0.6);

      el.tongue.setAttribute('cy', bottomY);
      el.tongue.setAttribute('rx', hwi * 0.6);
      el.tongue.setAttribute('ry', 3 + li * 0.35);
    }

    function setEyeOpen(g, cy, s) {
      g.setAttribute('transform', `matrix(1,0,0,${s},0,${cy * (1 - s)})`);
    }

    // 字幕：UTF-16 下标 → 字符序号
    let utf16Map = [];
    let lastHighlight = -2;

    function highlightChar(listIdx, allDone) {
      if (!subtitleEl || (listIdx === lastHighlight && !allDone)) return;
      lastHighlight = listIdx;
      const spans = subtitleEl.children;
      for (let i = 0; i < spans.length; i++) {
        spans[i].className = allDone || i < listIdx ? 'done' : i === listIdx ? 'now' : '';
      }
    }

    player.hooks.onStart = (tl) => {
      utf16Map = [];
      tl.chars.forEach((ch, i) => {
        for (let k = 0; k < ch.length; k++) utf16Map.push(i);
      });
      lastHighlight = -2;
      if (!subtitleEl) return;
      subtitleEl.innerHTML = '';
      tl.chars.forEach((ch) => {
        const span = doc.createElement('span');
        span.textContent = ch === '\n' ? ' ' : ch;
        subtitleEl.appendChild(span);
      });
    };
    player.hooks.onEnd = (completed) => highlightChar(-1, completed);

    const SMOOTH_MS = 45;
    let lastFrame = performance.now();
    let nextBlink = lastFrame + 2000;
    let blinkStart = -1;
    const gaze = { x: 0, y: 0, tx: 0, ty: 0, next: 0 };
    let lastVisemeKey = '';
    let alive = true;

    function frame(now) {
      if (!alive) return;
      const dt = Math.min(50, now - lastFrame);
      lastFrame = now;

      const seg = player.update(dt);
      speakingNow = player.playing;
      const key = seg ? seg.v : 'rest';
      const target = VISEMES[key];
      const a = 1 - Math.exp(-dt / SMOOTH_MS);
      for (const k of PARAM_KEYS) cur[k] += (target[k] - cur[k]) * a;
      renderMouth(cur);

      if (key !== lastVisemeKey) {
        if (visemeEl) visemeEl.textContent = VISEME_NAMES[key];
        lastVisemeKey = key;
      }
      if (seg) {
        if (pinyinEl) pinyinEl.textContent = seg.py || '-';
        highlightChar(utf16Map[seg.charIndex] ?? -1, false);
      }

      // 眨眼
      if (now > nextBlink && blinkStart < 0) blinkStart = now;
      let eye = 1;
      if (blinkStart >= 0) {
        const p = (now - blinkStart) / 160;
        if (p >= 1) {
          blinkStart = -1;
          nextBlink = now + 2000 + Math.random() * 3000;
        } else {
          eye = Math.max(0.08, Math.abs(1 - 2 * p));
        }
      }
      setEyeOpen(el.eyeL, 236, eye);
      setEyeOpen(el.eyeR, 236, eye);

      // 视线微动
      if (now > gaze.next) {
        gaze.tx = (Math.random() - 0.5) * 6;
        gaze.ty = (Math.random() - 0.5) * 3;
        gaze.next = now + 1200 + Math.random() * 2500;
      }
      gaze.x += (gaze.tx - gaze.x) * 0.08;
      gaze.y += (gaze.ty - gaze.y) * 0.08;
      el.irises.forEach((g) => g.setAttribute('transform', `translate(${gaze.x},${gaze.y})`));

      // 说话时眉毛和头部的轻微律动
      el.brows.setAttribute('transform', `translate(0,${-cur.open * 4})`);
      const sway = Math.sin(now / 900) * 1.2 + (player.playing ? Math.sin(now / 260) * cur.open * 1.5 : 0);
      el.head.setAttribute('transform', `rotate(${sway} 200 360) translate(0,${-cur.open * 1.5})`);

      root.requestAnimationFrame(frame);
    }
    root.requestAnimationFrame(frame);

    if (synth && synth.addEventListener) {
      synth.addEventListener('voiceschanged', () => voiceListeners.forEach((fn) => fn(listVoices())));
    }

    DigitalHuman.unmount = () => {
      alive = false;
      player.stop();
      player.hooks.onStart = () => {};
      player.hooks.onEnd = () => {};
      if (DigitalHuman.live2d && typeof DigitalHuman.live2d.destroy === 'function') {
        DigitalHuman.live2d.destroy();
      }
      container.innerHTML = '';
      container.classList.remove('avatar-box');
    };

    const live2d = DigitalHuman.live2d;
    if (live2d) {
      live2d.attach({ canvas: q('live2dCanvas'), svg: el.svg, tip: q('live2dTip') });
      // Live2D 加载前不要露出 SVG 卡通兜底
      if (avatar === 'live2d') el.svg.toggleAttribute('hidden', true);
      return live2d.use(avatar);
    }
    return Promise.resolve('svg');
  }

  // ---------- 对外接口 ----------
  const DigitalHuman = {
    mount,

    // 说完返回 'done'，被打断返回 'interrupted'
    say(text, { voice = 'default', rate = 1, pitch = 1, audioUrl = null } = {}) {
      if (audioUrl) return player.speak(String(text), { audioUrl, rate, pitch });
      return player.speak(String(text), { voice: resolveVoice(voice), rate, pitch });
    },

    stop() {
      player.stop();
    },

    isSpeaking() {
      return player.playing;
    },

    voices: listVoices,
    resolveVoice,

    onVoicesChanged(fn) {
      voiceListeners.push(fn);
    },

    // 当前平滑后的口型参数，供 Live2D 等其他形象读取
    mouth() {
      return { ...cur, speaking: speakingNow };
    },

    setAvatar(kind) {
      return DigitalHuman.live2d ? DigitalHuman.live2d.use(kind) : Promise.resolve('svg');
    },

    live2d: null,
    hasPinyin: () => !!root.pinyinPro,
    buildTimeline,
  };

  root.DigitalHuman = DigitalHuman;
  if (typeof module !== 'undefined' && module.exports) module.exports = DigitalHuman;
})(typeof window !== 'undefined' ? window : globalThis);
