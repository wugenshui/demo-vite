(() => {
  'use strict';

  // 绝对路径：vue-router 在 /call/:id 下相对路径会解析错
  const MODEL_URL = '/digital-human/models/hiyori/Hiyori.model3.json';
  const DigitalHuman = window.DigitalHuman;

  let canvas = null;
  let svg = null;
  let tip = null;
  let app = null;
  let model = null;
  let loading = null;
  let sizeObserver = null;

  function destroyApp() {
    if (sizeObserver) {
      sizeObserver.disconnect();
      sizeObserver = null;
    } else {
      window.removeEventListener('resize', layout);
    }
    if (app) {
      try {
        app.destroy(true, { children: true, texture: false, baseTexture: false });
      } catch (e) { /* ignore */ }
      app = null;
    }
    model = null;
    loading = null;
  }

  function setVisible(elem, visible) {
    elem.toggleAttribute('hidden', !visible);
  }

  function showTip(text) {
    tip.textContent = text;
    setVisible(tip, !!text);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  // 把口型参数映射为 Live2D 标准参数：
  // ParamMouthOpenY 0~1 张嘴；ParamMouthForm -1(撅/抿) ~ 1(咧嘴笑)
  function applyMouth(core) {
    const m = DigitalHuman.mouth();
    const open = clamp(m.open * (1 - m.press), 0, 1);
    const form = clamp(m.smile * 2 + m.width * 0.6 - m.round * 1.2 - 0.3, -1, 1);
    core.setParameterValueById('ParamMouthOpenY', open);
    core.setParameterValueById('ParamMouthForm', form);
    if (m.speaking) {
      core.addParameterValueById('ParamBrowLY', m.open * 0.25);
      core.addParameterValueById('ParamBrowRY', m.open * 0.25);
      core.addParameterValueById('ParamAngleY', m.open * 3);
    }
  }

  function parentSize() {
    const parent = canvas && canvas.parentElement;
    if (!parent) return { w: 0, h: 0 };
    return { w: parent.clientWidth, h: parent.clientHeight };
  }

  // 选场景时 stage 是 display:none。若此时创建 PIXI（0×0 WebGL），
  // 之后再 resize 也经常画不出模型，必须等父容器有真实尺寸再初始化。
  function waitForParentSize(timeoutMs) {
    const limit = timeoutMs == null ? 120000 : timeoutMs;
    const ready = () => {
      const { w, h } = parentSize();
      return w >= 2 && h >= 2;
    };
    if (ready()) return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (ro) ro.disconnect();
        window.removeEventListener('resize', onResize);
        resolve();
      };
      const onResize = () => {
        if (ready()) finish();
      };
      const timer = setTimeout(finish, limit);
      let ro = null;
      if (typeof ResizeObserver !== 'undefined' && canvas && canvas.parentElement) {
        ro = new ResizeObserver(onResize);
        ro.observe(canvas.parentElement);
      }
      window.addEventListener('resize', onResize);
    });
  }

  function layout() {
    if (!app || !model || !canvas) return false;
    const { w, h } = parentSize();
    if (w < 2 || h < 2) return false;
    if (typeof app.resize === 'function') app.resize();
    else app.renderer.resize(w, h);
    const sw = app.screen.width || w;
    const sh = app.screen.height || h;
    const scale = (sh * 3) / model.internalModel.height;
    model.scale.set(scale);
    model.anchor.set(0.5, 0);
    model.position.set(sw / 2, -sh * 0.12);
    return true;
  }

  function watchParentSize() {
    if (sizeObserver || !canvas || !canvas.parentElement) return;
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', layout);
      return;
    }
    sizeObserver = new ResizeObserver(() => layout());
    sizeObserver.observe(canvas.parentElement);
  }

  async function load() {
    if (loading) return loading;
    loading = (async () => {
      if (location.protocol === 'file:') {
        throw new Error('Live2D 模型需要通过本地服务器打开：双击项目里的 start.bat（或运行 node server.js）。');
      }
      if (!window.PIXI || !PIXI.live2d || !window.Live2DCubismCore) {
        throw new Error('Live2D 运行库没有加载成功，请运行 node scripts/download-live2d.js 重新下载。');
      }

      showTip('正在加载 Live2D 模型…');
      await waitForParentSize();
      const { w, h } = parentSize();
      if (w < 2 || h < 2) {
        throw new Error('形象区域尚未显示，稍后再试');
      }

      setVisible(canvas, true);
      app = new PIXI.Application({
        view: canvas,
        width: w,
        height: h,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
        resizeTo: canvas.parentElement,
      });

      model = await PIXI.live2d.Live2DModel.from(MODEL_URL, { autoInteract: true });
      app.stage.addChild(model);

      model.internalModel.on('beforeModelUpdate', () => applyMouth(model.internalModel.coreModel));
      model.on('pointertap', () => model.motion('TapBody'));
      model.interactive = true;

      watchParentSize();
      layout();
      showTip('');
    })().catch((e) => {
      loading = null;
      throw e;
    });
    return loading;
  }

  // 返回实际生效的形象：'live2d' 或 'svg'
  // 加载中不闪 SVG（太突兀），只留渐变底 + 文案提示。
  async function use(kind) {
    if (!canvas) return 'svg';
    if (kind === 'live2d') {
      setVisible(svg, false);
      setVisible(canvas, false);
      try {
        await load();
        if (!layout()) throw new Error('形象区域尺寸无效');
        setVisible(svg, false);
        setVisible(canvas, true);
        app.start();
        return 'live2d';
      } catch (e) {
        if (location.protocol !== 'file:') console.error(e);
        loading = null;
        showTip(
          location.protocol === 'file:'
            ? '想看 Live2D 模型：双击项目里的 start.bat，会自动用本地服务器打开页面。'
            : e.message
        );
        setVisible(svg, false);
        setVisible(canvas, false);
        if (app) app.stop();
        return 'none';
      }
    }
    showTip('');
    setVisible(svg, true);
    setVisible(canvas, false);
    if (app) app.stop();
    return 'svg';
  }

  DigitalHuman.live2d = {
    attach(els) {
      // 路由切换会换掉 host DOM；旧 PIXI 绑在已卸载 canvas 上，必须重建
      if (canvas && els.canvas && canvas !== els.canvas) destroyApp();
      canvas = els.canvas;
      svg = els.svg;
      tip = els.tip;
    },
    use,
    // 通话页从隐藏切到可见时由 UI 调用，唤醒可能卡在 waitForParentSize 的加载
    relayout: layout,
    destroy: destroyApp,
  };
})();
