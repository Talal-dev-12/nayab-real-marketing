export default function superFlowEffect({ swiper, on, extendParams }: any) {
  extendParams({
    superFlowEffect: {
      fragments: 3,
      fragmentBorderWidth: 2,
      fragmentBlur: false,
      contentOffset: 5,
      contentScale: 1.2,
      scaleDuration: 4000,
      mainImageScale: 1.1,
      level1Scale: 1.15,
      level2Scale: 1.2,
      level3Scale: 1.25,
    },
  });

  let prevActiveIndex: number | null = null;
  let fragmentsCreated = false;

  const getIndex = (slide: HTMLElement) =>
    swiper.params.loop ||
    (swiper.params.virtual && swiper.virtual && swiper.params.virtual.enabled)
      ? parseInt(slide.getAttribute('data-swiper-slide-index') || '0', 10)
      : Array.from(swiper.slides).indexOf(slide);

  const getSlideElements = (slide: HTMLElement) => {
    const container = slide.querySelector('.super-flow-fragments');
    const children = container
      ? ([...Array.from(container.children)] as HTMLElement[])
      : [];
    const idx1 = [0, 1, 6, 7];
    const idx2 = [2, 3, 8, 9];
    const idx3 = [4, 5, 10, 11];
    return {
      allFragments: children,
      level1Fragments: idx1.map((i) => children[i]).filter(Boolean),
      level2Fragments: idx2.map((i) => children[i]).filter(Boolean),
      level3Fragments: idx3.map((i) => children[i]).filter(Boolean),
    };
  };

  const tVal = (val: number | string = 0) =>
    swiper.isHorizontal() ? `translate(${val}, 0)` : `translate(0, ${val})`;

  /* ─── setTranslate: position every slide ─── */
  const onSetTranslate = () => {
    if (!swiper.slides || !swiper.slides.length) return;
    const { slides } = swiper;
    const rtl = swiper.rtlTranslate;
    const size = swiper.size;
    const dir = rtl ? -1 : 1;

    for (let i = 0; i < slides.length; i += 1) {
      const slide = slides[i] as HTMLElement;
      const slideIdx = getIndex(slide);
      const image = slide.querySelector('.super-flow-image') as HTMLElement;
      const fragments = slide.querySelector('.super-flow-fragments') as HTMLElement;
      const content = slide.querySelector('.super-flow-content') as HTMLElement;
      const { level1Fragments, level2Fragments, level3Fragments } =
        getSlideElements(slide);
      const progress = (slide as any).progress;

      let slideT: number;
      let imgScale = 1;
      let imgT = 0;
      let fragScale = 1;
      let fragT = 0;
      let contentT = 0;
      let l1 = 0;
      let l2 = 0;
      let l3 = 0;

      if (progress <= 0) {
        contentT = -swiper.params.superFlowEffect.contentOffset * dir;
        slideT = size * progress + swiper.translate * dir;
        imgScale = 1.1 - 0.1 * Math.min(1, Math.abs(progress));
        imgT = 20 * dir * Math.min(1, Math.abs(progress));
        fragScale = 0.95 + 0.05 * Math.min(1, Math.abs(progress));
        l1 = 30 * dir * Math.min(1, Math.abs(progress));
        l2 = 20 * dir * Math.min(1, Math.abs(progress));
        l3 = 10 * dir * Math.min(1, Math.abs(progress));
      } else {
        slideT =
          (swiper.translate - Math.min(progress, 1) * size * 0.09 * dir) * dir;
        imgScale = 1.1;
        fragT = 5 * Math.min(1, Math.abs(progress));
        fragScale = 0.95;
      }
      if (rtl) slideT = -slideT;

      if (image) image.style.transform = `scale(${imgScale}) ${tVal(imgT + '%')}`;
      if (fragments)
        fragments.style.transform = `scale(${fragScale}) ${tVal(fragT + '%')}`;

      if (slideIdx !== prevActiveIndex) {
        if (content) content.style.transform = tVal(`${contentT}%`);
        level1Fragments.forEach((f) => (f.style.transform = tVal(l1 + '%')));
        level2Fragments.forEach((f) => (f.style.transform = tVal(l2 + '%')));
        level3Fragments.forEach((f) => (f.style.transform = tVal(l3 + '%')));
      }

      slide.style.transform = tVal(slideT + 'px');
      slide.style.zIndex = String(slides.length - i);
    }
  };

  /* ─── setTransition ─── */
  const onSetTransition = (duration: number) => {
    if (!swiper.slides || !swiper.slides.length) return;
    const { slides } = swiper;

    for (let i = 0; i < slides.length; i += 1) {
      const slide = slides[i] as HTMLElement;
      const slideIdx = getIndex(slide);
      let extra = '';
      if (slideIdx !== prevActiveIndex) {
        extra =
          ', .super-flow-image img, .super-flow-fragment, .super-flow-fragment-border, .super-flow-content';
      }
      [
        slide,
        ...Array.from(
          slide.querySelectorAll(`.super-flow-fragments, .super-flow-image${extra}`)
        ),
      ].forEach((el: any) => {
        el.style.transitionDuration = `${duration}ms`;
      });
    }

    /* Manually fire transitionend for virtualTranslate so Autoplay keeps ticking */
    if (swiper.params.virtualTranslate && duration > 0) {
      let fired = false;
      const activeSlide = slides[swiper.activeIndex] as HTMLElement | undefined;
      if (!activeSlide) return;

      const handler = (e: Event) => {
        if (fired || !swiper || swiper.destroyed) return;
        if (e.target !== activeSlide) return;
        fired = true;
        activeSlide.removeEventListener('transitionend', handler);
        swiper.animating = false;
        swiper.wrapperEl.dispatchEvent(
          new CustomEvent('transitionend', { bubbles: true, cancelable: true })
        );
      };
      activeSlide.addEventListener('transitionend', handler);
      // Safety timeout: if no CSS transition fires, unblock after duration + buffer
      setTimeout(() => {
        if (!fired && swiper && !swiper.destroyed) {
          fired = true;
          activeSlide.removeEventListener('transitionend', handler);
          swiper.animating = false;
          swiper.wrapperEl.dispatchEvent(
            new CustomEvent('transitionend', { bubbles: true, cancelable: true })
          );
        }
      }, duration + 100);
    }
  };

  /* ─── clip-path fragment generation ─── */
  const clipStore: { left: number[][]; right: number[][] } = { left: [], right: [] };

  const getClipPath = (side: string, index: number, bw: number) => {
    let p1 = 0;
    let p2 = 0;
    if (side === 'left') {
      if (index === 0) {
        p1 = 20 + Math.random() * 5;
        p2 = 5 + Math.random() * 5;
        clipStore.left.push([p1, p2]);
      } else if (index === 1) {
        p1 = 5 + Math.random() * 5;
        p2 = 10 + Math.random() * 10;
      } else {
        p1 = (clipStore.left[0]?.[0] ?? 20) - Math.random() * 10;
        p2 = (clipStore.left[0]?.[1] ?? 5) - Math.random() * 5;
      }
    } else {
      if (index === 0) {
        p1 = 5 + Math.random() * 5;
        p2 = 20 + Math.random() * 10;
        clipStore.right.push([p1, p2]);
      } else if (index === 1) {
        p1 = 10 + Math.random() * 10;
        p2 = 5 + Math.random() * 5;
      } else {
        p1 = (clipStore.right[0]?.[0] ?? 5) - Math.random() * 5;
        p2 = (clipStore.right[0]?.[1] ?? 20) - Math.random() * 10;
      }
    }
    const pts =
      side === 'left'
        ? [[0, 0], [p1, 0], [p2, 100], [0, 100]]
        : [[100, 0], [100 - p1, 0], [100 - p2, 100], [100, 100]];
    const border =
      side === 'left'
        ? `polygon(${pts.map((p) => `calc(${p[0]}% + ${bw}px) ${p[1]}%`).join(',')})`
        : `polygon(${pts.map((p) => `calc(${p[0]}% - ${bw}px) ${p[1]}%`).join(',')})`;
    const image = `polygon(${pts.map((p) => `${p[0]}% ${p[1]}%`).join(',')})`;
    return { borderClipPath: border, imageClipPath: image };
  };

  const createFragments = () => {
    if (fragmentsCreated) return;
    fragmentsCreated = true;
    const bw = swiper.params.superFlowEffect.fragmentBorderWidth;
    const blur = swiper.params.superFlowEffect.fragmentBlur;
    const isHor = swiper.isHorizontal();
    const rtl = swiper.rtlTranslate;

    swiper.el
      .querySelectorAll('.super-flow-image')
      .forEach((imgWrapper: HTMLElement) => {
        const img = imgWrapper.querySelector(
          'img:not(.super-flow-fragment)'
        ) as HTMLImageElement | null;
        if (!img) return;
        // Remove any old fragments (safety)
        imgWrapper
          .querySelectorAll('.super-flow-fragment, .super-flow-fragment-border, .super-flow-fragments')
          .forEach((el: Element) => el.remove());

        const flip = Math.random() > 0.5;
        const rand = (5 + Math.random() * 4) / 2;
        const base = isHor
          ? rtl
            ? [[flip ? rand : 0, 0], [100, 0], [100, 100], [flip ? 0 : rand, 100]]
            : [[0, 0], [flip ? 100 - rand : 100, 0], [flip ? 100 : 100 - rand, 100], [0, 100]]
          : [[0, 0], [100, 0], [100, flip ? 100 - rand : 100], [0, flip ? 100 : 100 - rand]];
        imgWrapper.style.clipPath = `polygon(${base.map((p) => `${p[0]}% ${p[1]}%`).join(',')})`;

        const container = document.createElement('div');
        container.classList.add('super-flow-fragments');
        imgWrapper.appendChild(container);

        const count = Math.min(Math.max(0, swiper.params.superFlowEffect.fragments), 3);
        // Reset clip store per image
        clipStore.left = [];
        clipStore.right = [];
        for (const side of ['left', 'right']) {
          for (let i = 0; i < count; i += 1) {
            const fragImg = img.cloneNode(true) as HTMLElement;
            const fragBorder = document.createElement('div');
            fragImg.classList.add('super-flow-fragment');
            fragBorder.classList.add('super-flow-fragment-border');
            const { borderClipPath, imageClipPath } = getClipPath(side, i, bw);
            fragBorder.style.clipPath = borderClipPath;
            fragImg.style.clipPath = imageClipPath;
            if (blur) fragImg.style.filter = `blur(${i + 1}px)`;
            container.appendChild(fragBorder);
            container.appendChild(fragImg);
          }
        }
      });
  };

  /* ─── Active-slide scale zoom ─── */
  const resetInactiveSlides = () => {
    if (!swiper.slides) return;
    const activeRealIdx = swiper.params.loop ? swiper.realIndex : swiper.activeIndex;
    swiper.slides.forEach((slide: HTMLElement) => {
      if (getIndex(slide) !== activeRealIdx) {
        slide
          .querySelectorAll('img, .super-flow-fragment, .super-flow-fragment-border')
          .forEach((el: any) => {
            el.style.transitionDuration = '0ms';
            el.style.transform = '';
          });
      }
    });
  };

  const applyScaleTransitions = () => {
    if (!swiper.slides || !swiper.slides.length) return;
    const activeSlide = swiper.slides[swiper.activeIndex] as HTMLElement | undefined;
    if (!activeSlide) return;

    const activeIdx = getIndex(activeSlide);
    const dir = swiper.rtlTranslate ? -1 : 1;
    if (activeIdx === prevActiveIndex) return;
    prevActiveIndex = activeIdx;

    const p = swiper.params.superFlowEffect;
    const mainImg = activeSlide.querySelector('.super-flow-image > img') as HTMLElement;
    const content = activeSlide.querySelector('.super-flow-content') as HTMLElement;
    const { allFragments, level1Fragments, level2Fragments, level3Fragments } =
      getSlideElements(activeSlide);

    // Step 1: instantly reset to starting position
    if (mainImg) {
      mainImg.style.transitionDuration = '0ms';
      mainImg.style.transitionTimingFunction = 'linear';
      mainImg.style.transform = `${tVal()} scale(1)`;
    }
    if (content) {
      content.style.transitionDuration = '0ms';
      content.style.transitionTimingFunction = 'linear';
      content.style.transform = tVal(`${-p.contentOffset * dir}%`);
    }
    allFragments.forEach((f) => {
      f.style.transitionDuration = '0ms';
      f.style.transform = tVal();
    });

    // Force reflow so the browser registers the 0ms state
    void activeSlide.offsetWidth;

    // Step 2: animate to zoomed state
    if (mainImg) {
      mainImg.style.transitionDuration = `${p.scaleDuration}ms`;
      mainImg.style.transitionTimingFunction = 'linear';
      mainImg.style.transform = `${tVal()} scale(${p.mainImageScale})`;
    }
    if (content) {
      content.style.transitionDuration = `${p.scaleDuration}ms`;
      content.style.transitionTimingFunction = 'linear';
      content.style.transform = `${tVal(`${p.contentOffset * dir}%`)} scale(${p.contentScale})`;
    }
    allFragments.forEach((f) => {
      f.style.transitionDuration = `${p.scaleDuration}ms`;
      f.style.transitionTimingFunction = 'linear';
    });
    level1Fragments.forEach((f) => (f.style.transform = `${tVal()} scale(${p.level1Scale})`));
    level2Fragments.forEach((f) => (f.style.transform = `${tVal()} scale(${p.level2Scale})`));
    level3Fragments.forEach((f) => (f.style.transform = `${tVal()} scale(${p.level3Scale})`));
  };

  /* ─── Event bindings ─── */
  let touchEndFired = false;

  on('beforeInit', () => {
    if (swiper.params.effect !== 'super-flow') return;
    swiper.classNames.push(`${swiper.params.containerModifierClass}super-flow`);
    const overwrites = {
      virtualTranslate: true,
      centeredSlides: false,
      slidesPerGroup: 1,
      slidesPerView: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
    };
    Object.assign(swiper.params, overwrites);
    Object.assign(swiper.originalParams, overwrites);
  });

  on('init', () => {
    createFragments();
    // Use a small delay so looped clones are ready
    requestAnimationFrame(() => {
      prevActiveIndex = null; // force first application
      onSetTranslate();
      applyScaleTransitions();
    });
  });

  on('touchEnd', () => {
    touchEndFired = true;
    requestAnimationFrame(() => (touchEndFired = false));
  });

  on('transitionStart', () => {
    if (!touchEndFired) applyScaleTransitions();
  });

  on('transitionEnd', () => {
    resetInactiveSlides();
    applyScaleTransitions();
  });

  on('setTranslate', () => {
    if (swiper.params.effect === 'super-flow') onSetTranslate();
  });

  on('setTransition', (_s: any, duration: any) => {
    if (swiper.params.effect === 'super-flow') onSetTransition(duration);
  });
}
