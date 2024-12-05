import { PRNG, xorshift7 } from 'seedrandom';
import { free, choices } from './bingo.data';

export type CellData = {
  idx: number;
  col: number;
  row: number;
  checkbox: HTMLInputElement;
  label: HTMLSpanElement;
};

const INFO_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
</svg>
`;

export const TIMESTAMP_DIVISOR = 60_000;

const horizWins = [
  0b11111_00000_00000_00000_00000, 0b00000_11111_00000_00000_00000,
  0b00000_00000_11111_00000_00000, 0b00000_00000_00000_11111_00000,
  0b00000_00000_00000_00000_11111,
];
const vertWins = [
  0b10000_10000_10000_10000_10000, 0b01000_01000_01000_01000_01000,
  0b00100_00100_00100_00100_00100, 0b00010_00010_00010_00010_00010,
  0b00001_00001_00001_00001_00001,
];
const diagWins = [
  0b10000_01000_00100_00010_00001, 0b00001_00010_00100_01000_10000,
];
const checkWin = (checked: number, masks: number[]): number => {
  let bits = 0;
  for (let i = 0; i < masks.length; i++) {
    const mask = masks[i];
    if ((checked & mask) == mask) bits |= mask;
  }
  return bits;
};

export type SeedParams = {
  user: string;
  ts: string;
  checked: number;
};

const isValidUser = (str: string) => /^[a-z0-9][a-z0-9_]{3,24}$/i.test(str);
const isValidTimestamp = (ts: string) => {
  const int = parseInt(ts, 36);
  return int && int > 0;
};
const ALWAYS_CHECKED = 0b00000_00000_00100_00000_00000;
const isValidChecked = (bits: number) =>
  Number.isInteger(bits) &&
  bits >= 0 &&
  bits <= 0b11111_11111_11111_11111_11111 &&
  (bits & ALWAYS_CHECKED) === ALWAYS_CHECKED;

export const getParams = (): Partial<SeedParams> => {
  const sp = new URL(window.location.href).searchParams;

  const user = sp.get('u') ?? localStorage.getItem('user') ?? '';
  const ts = sp.get('t') ?? '';
  const checked = parseInt(sp.get('c') ?? '', 36);

  return {
    user: isValidUser(user) ? user : undefined,
    ts: isValidTimestamp(ts) ? ts : undefined,
    checked: isValidChecked(checked) ? checked : ALWAYS_CHECKED,
  };
};

export enum NewParamsFailure {
  UserCanceled,
  InvalidLogin,
}

export const isParams = (v: Partial<SeedParams>): v is SeedParams =>
  typeof v.user === 'string' && typeof v.ts === 'string';

export const setParams = ({ user, ts, checked }: SeedParams): SeedParams => {
  localStorage.setItem('user', user);

  const url = new URL(window.location.href);
  url.searchParams.set('u', user);
  url.searchParams.set('t', ts);
  url.searchParams.set('c', checked.toString(36));

  window.history.replaceState(null, '', url.toString());

  return { user, ts, checked };
};

export const newParams = (
  resetUser: boolean = false
): SeedParams | NewParamsFailure => {
  if (resetUser) localStorage.removeItem('user');

  const user =
    localStorage.getItem('user') ??
    prompt('Enter your Twitch username (not display name)')?.trim();

  if (!user) return NewParamsFailure.UserCanceled;
  if (!isValidUser(user)) return NewParamsFailure.InvalidLogin;

  return setParams({
    user,
    ts: Math.floor(Date.now() / TIMESTAMP_DIVISOR).toString(36),
    checked: ALWAYS_CHECKED,
  });
};

const shuffle = <T>(arr: T[], rng: PRNG): T[] => {
  let i = arr.length,
    j,
    temp;
  while (--i > 0) {
    j = Math.floor(rng.double() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

export class Bingo {
  private cells = new Map<HTMLElement, CellData>();
  private checked: number;

  private constructor(readonly el: HTMLElement, private sp: SeedParams) {
    this.checked = sp.checked;
  }

  private add(el: HTMLDivElement, refs: CellData) {
    this.cells.set(el, refs);
  }

  static init(el: HTMLElement, sp: SeedParams) {
    const rng = xorshift7(`${sp.user.toLowerCase()} ${sp.ts}`);
    const card = shuffle(choices.slice(), rng).slice(0, 24);

    const bingo = new Bingo(el, sp);

    el.querySelectorAll<HTMLDivElement>('div.cell').forEach((el, idx) => {
      const label = el.querySelector<HTMLSpanElement>('span.cell-label');
      if (!label) throw new Error('no span found');

      const checkbox = el.querySelector<HTMLInputElement>(
        'input[type=checkbox]'
      )!;
      if (!checkbox) throw new Error('no checkbox found');

      if (idx === 12) {
        label.textContent = free;
        checkbox.checked = true;
        checkbox.disabled = true;
      } else {
        const cell = card.pop();
        if (!cell) throw new Error('card size / document cell mismatch');

        // select randomly from mutually exclusive options
        const next = Array.isArray(cell)
          ? cell[Math.floor(rng.double() * cell.length)]
          : cell;

        label.textContent = next.title;
        const parent = label.closest('.cell');
        if (next.tip && parent) {
          const infoSpan = document.createElement('span');
          infoSpan.style.position = 'absolute';
          infoSpan.style.height = '1rem';
          infoSpan.style.width = '1rem';
          infoSpan.style.right = '2%';
          infoSpan.style.top = '2%';
          infoSpan.style.pointerEvents = 'none';
          infoSpan.innerHTML = INFO_ICON;
          parent.appendChild(infoSpan);

          tippy(parent, {
            content: next.tip,
            touch: ['hold', 500],
          });
        }

        checkbox.checked = checkbox.checked =
          (sp.checked & (1 << (24 - idx))) > 0;
      }

      const refs = {
        idx,
        col: idx % 5,
        row: Math.floor(idx / 5),
        checkbox,
        label,
      };
      bingo.add(el, refs);
    });

    bingo.updateWins();

    el.addEventListener('change', ev => {
      const target = ev.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.getAttribute('type') !== 'checkbox') return;
      bingo.onChanged(target);
    });
  }

  private onChanged(target: HTMLInputElement) {
    const wrap = target.closest<HTMLDivElement>('.grid.card div.cell');
    const refs = wrap && this.cells.get(wrap);
    if (!refs) return;

    const { idx } = refs;
    if (target.checked) {
      this.checked |= 1 << (24 - idx);
    } else {
      this.checked &=
        (~(1 << (24 - idx)) >>> 0) & 0b11111_11111_11111_11111_11111;
    }

    setParams({ ...this.sp, checked: this.checked });

    this.updateWins();
  }

  private updateWins() {
    const bits = this.checked;
    const horizBits = checkWin(bits, horizWins) | checkWin(bits, diagWins);
    const vertBits = checkWin(bits, vertWins) | checkWin(bits, diagWins);

    for (const [parent, refs] of this.cells.entries()) {
      const bit = 1 << (24 - refs.idx);
      if (horizBits & bit) {
        parent.classList.add('win-h');
      } else {
        parent.classList.remove('win-h');
      }

      if (vertBits & bit) {
        parent.classList.add('win-v');
      } else {
        parent.classList.remove('win-v');
      }
    }
  }
}
