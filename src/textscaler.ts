export type TextScalerConfig = {
  min: number;
  max: number;
  scaledown: number; // pseudo-padding
};
export const TextScaler = (opts: TextScalerConfig = {} as any) => {
  const min = opts.min ?? 0.35;
  const max = opts.max ?? 4;
  const scaledown = opts.scaledown ?? 0.95;

  return (el: HTMLElement) => {
    let cur = min;
    let step = (max - min) / 2;

    // set the font size to min. creep up
    // incrementally until the content overflows.
    // if it does overflow, we have one non-breaking
    // word that's too wide at that size. when done,
    // we have the "largest" size our font can get
    // without overflowing horizontally
    for (let i = 0; i < 10; i++) {
      el.style.fontSize = cur + step + 'rem';
      if (el.scrollWidth <= el.clientWidth) cur += step;
      step = step / 2;
    }
    // since scrollWidth doesn't account for
    // overflowing padding, we reduce the max
    // we found a little so that we don't wind
    // up using the full width for a long word
    const trueMax = Math.max(min, cur * scaledown);

    cur = min;
    step = (trueMax - min) / 2;
    el.style.height = 'auto';

    // now do the vertical axis the same way, checking
    // scrollHeight this time.
    for (let i = 0; i < 10; i++) {
      el.style.fontSize = cur + step + 'rem';
      if (el.scrollHeight <= el.clientHeight) cur += step;
      step = step / 2;
    }
    el.style.height = '';
    el.style.fontSize = cur * scaledown + 'rem';
  };
};
