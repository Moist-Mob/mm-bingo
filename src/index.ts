import { TextScaler } from './textscaler.js';
import {
  Bingo,
  getParams,
  isParams,
  newParams,
  NewParamsFailure,
  TIMESTAMP_DIVISOR,
} from './bingo.js';

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

document.addEventListener('DOMContentLoaded', () => {
  initHeaderLinks();

  const envParams = getParams();
  const freshParams = isParams(envParams) ? envParams : newParams();

  let errorMessage: string | undefined = undefined;

  if (typeof freshParams === 'number') {
    switch (freshParams) {
      case NewParamsFailure.InvalidLogin:
        errorMessage =
          'The username you entered does not appear to be a valid Twitch username. Be sure to use your login name, not your display name.';
        break;
      case NewParamsFailure.UserCanceled:
        errorMessage =
          'You canceled the username prompt. You must enter a valid Twitch username to generate a unique card for your use.';
        break;
    }

    const el = assertId('error-wrap');
    el.textContent = errorMessage;
    document.body.classList.add('invalid');
    return;
  }

  document.body.classList.add('valid');

  const bingoEl = assertId('bingo-card');

  Bingo.init(bingoEl, freshParams);
  initFit();

  const genForSpan = assertId('generated-user');
  genForSpan.textContent = freshParams.user;

  const genOnSpan = assertId('generated-ts');
  const date = new Date(parseInt(freshParams.ts, 36) * TIMESTAMP_DIVISOR);
  const opts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const fmt = new Intl.DateTimeFormat(undefined, opts);
  genOnSpan.textContent = fmt.format(date);
});
