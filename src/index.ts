import './style.css';
import 'tippy.js/dist/tippy.css';

import tippy from 'tippy.js';
import { TextScaler } from './textscaler.js';
import { Bingo, TIMESTAMP_DIVISOR } from './bingo.js';
import { NewParamsFailure, SeedParams } from './params';

const initFit = () => {
  let lastDim: number;
  const minDim = () => {
    const rect = document.body.getBoundingClientRect();
    return Math.min(rect.width, rect.height);
  };
  const fit = TextScaler();
  const doResize = (nextDim: number) => {
    lastDim = nextDim;
    document
      .querySelectorAll<HTMLLabelElement>('.grid label.cell-inner')
      .forEach(fit);
  };
  window.addEventListener('resize', ev => {
    const curDim = minDim();
    const diff = Math.abs(curDim - lastDim);

    if (diff > 0) doResize(curDim);
  });
  doResize(minDim());
};

const assertId = (id: string): HTMLElement => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id '${id}' not found`);
  return el;
};

const initHeaderLinks = () => {
  const url = new URL(window.location.href);
  url.search = '';

  const wrap = assertId('header-link-wrap');
  wrap.querySelector('.new-card')?.setAttribute('href', url.toString());
  const resetUser = wrap.querySelector('.reset-user');
  if (resetUser) {
    resetUser.addEventListener('click', ev => {
      localStorage.removeItem('user');
    });
    resetUser.setAttribute('href', url.toString());
  }
};

const setBookmarking = () => {
  document.body.classList.remove('valid', 'invalid');
  document.body.classList.add('bookmarking');
};
document.addEventListener('DOMContentLoaded', () => {
  initHeaderLinks();

  window.addEventListener('popstate', ev => {
    if (ev.state !== 'bookmarking') window.location.reload();
    else setBookmarking();
  });
  assertId('bookmark-link').addEventListener('click', ev => {
    ev.preventDefault();
    ev.stopPropagation();

    const url = new URL(window.location.href);
    url.search = '';
    window.history.pushState('bookmarking', '', url.toString());

    setBookmarking();
  });

  const params = SeedParams.fromUrl() ?? SeedParams.create();

  let errorMessage: string | undefined = undefined;

  if (typeof params === 'number') {
    switch (params) {
      case NewParamsFailure.InvalidLogin:
        errorMessage =
          'The username you entered does not appear to be a valid Twitch username. Be sure to use your login name, not your display name.';
        break;
      case NewParamsFailure.UserCanceled:
        errorMessage =
          'You canceled the username prompt. You must enter a valid Twitch username to generate a unique card for your use.';
        break;
      default:
        errorMessage = `Unknown error code: ${params}`;
        break;
    }

    const el = assertId('error-wrap');
    el.textContent = errorMessage;
    document.body.classList.remove('valid');
    document.body.classList.add('invalid');
    return;
  }

  document.body.classList.remove('invalid');
  document.body.classList.add('valid');

  if (!params.mutable) {
    let note: string = 'This card is read-only. ';
    if (!params.isSavedUser) {
      const viewer = localStorage.getItem('user') ?? '(not set)';
      note += `It was generated for '${params.user}', but you are '${viewer}'.`;
    } else {
      note += `It was generated too long ago.`;
    }

    assertId('note-wrap').textContent = note;
    document.body.classList.add('note');
  }

  const bingoEl = assertId('bingo-card');

  Bingo.init(bingoEl, params);
  initFit();

  const genForSpan = assertId('generated-user');
  genForSpan.textContent = params.user;

  const date = params.ts;
  const genAt = Math.round(date.getTime() / 1000);

  let lastStr = '';

  const units: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [Infinity, 'day'],
  ];

  const human = (val: number): string => {
    if (val === 0) return 'just now';
    const suffix = val > 0 ? 'ago' : 'from now';
    val = Math.abs(val);

    for (const [n, label] of units) {
      if (val < n) {
        const approx = Math.round(val * 10) / 10;
        return `${approx} ${label}${approx !== 1 ? 's' : ''} ${suffix}`;
      }
      val /= n;
    }
    return '(error)';
  };

  const genOnSpan = assertId('generated-ts');
  const opts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const fmt = new Intl.DateTimeFormat(undefined, opts);
  tippy(genOnSpan, {
    content: fmt.format(date),
    touch: ['hold', 500],
  });

  const updateTime = () => {
    const now = Math.round(Date.now() / 1000);
    const diff = now - genAt;
    const newStr = human(diff);
    if (newStr !== lastStr) {
      lastStr = newStr;
      genOnSpan.textContent = newStr;
      if (diff > 3600 * 8 || diff < 0) {
        genOnSpan.classList.add('warning');
      }
    }
  };
  updateTime();
  setInterval(updateTime, 1000);
});
