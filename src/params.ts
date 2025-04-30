import { ALWAYS_CHECKED, TIMESTAMP_DIVISOR } from './bingo';

export enum NewParamsFailure {
  UserCanceled,
  InvalidLogin,
}

const posInt = (v: string): number | null => {
  const int = parseInt(v, 36);
  if (isNaN(int) || int <= 0) return null;

  const reencoded = int.toString(36);
  return reencoded === v ? int : null;
};

const parseUser = (qv: string | null) => {
  if (typeof qv !== 'string') return null;
  return /^[a-z0-9_]{4,24}$/i.test(qv) ? qv : null;
};

const parseTimestamp = (qv: string | null): Date | null => {
  if (typeof qv !== 'string') return null;

  const epoch = posInt(qv);
  if (epoch === null) return epoch;

  return new Date(epoch * TIMESTAMP_DIVISOR);
};

const isValidChecked = (bits: number) =>
  Number.isInteger(bits) &&
  bits >= 0 &&
  bits <= 0b11111_11111_11111_11111_11111 &&
  (bits & ALWAYS_CHECKED) === ALWAYS_CHECKED;

const parseChecked = (qv: string | null): number | null => {
  if (typeof qv !== 'string') return null;

  const bits = posInt(qv);
  if (bits === null) return null;

  return isValidChecked(bits) ? bits : null;
};

export class SeedParams {
  readonly user: string;
  readonly ts: Date;
  readonly mutable: boolean;

  private checked: number;

  private constructor({
    user,
    ts,
    checked,
    mutable,
  }: {
    user: string;
    ts: Date;
    checked: number;
    mutable: boolean;
  }) {
    this.user = user;
    this.ts = ts;
    this.checked = checked;
    this.mutable = mutable;

    this.updateUrl();
  }

  private updateUrl() {
    if (!this.mutable) return;

    const { user, ts, checked } = this;

    localStorage.setItem('user', user);

    const url = new URL(window.location.href);
    url.searchParams.set('u', user);
    url.searchParams.set(
      't',
      Math.floor(ts.getTime() / TIMESTAMP_DIVISOR).toString(36)
    );
    url.searchParams.set('c', checked.toString(36));

    window.history.replaceState(null, '', url.toString());

    return { user, ts, checked };
  }

  static fromUrl(): SeedParams | null {
    const sp = new URL(window.location.href).searchParams;

    const user = parseUser(sp.get('u'));
    const ts = parseTimestamp(sp.get('t'));
    const checked = parseChecked(sp.get('c'));

    if (user === null || ts === null || checked === null) return null;

    const mutable = localStorage.getItem('user') === user;

    return new SeedParams({ user, ts, checked, mutable });
  }

  static create(resetUser: boolean = false) {
    if (resetUser) localStorage.removeItem('user');

    let save: boolean = false;
    let maybeUser = localStorage.getItem('user');

    if (!maybeUser) {
      maybeUser =
        prompt('Enter your Twitch username (not display name)')?.trim() ?? null;
      if (!maybeUser) return NewParamsFailure.UserCanceled;
      save = true;
    }

    const user = parseUser(maybeUser);
    if (!user) return NewParamsFailure.InvalidLogin;

    if (save) localStorage.setItem('user', user);

    const ts = new Date(
      Math.floor(Date.now() / TIMESTAMP_DIVISOR) * TIMESTAMP_DIVISOR
    );
    const checked = ALWAYS_CHECKED;

    return new SeedParams({ user, ts, checked, mutable: true });
  }

  isChecked(cell: number): boolean {
    return (this.checked & (1 << (24 - cell))) > 0;
  }

  setChecked(cell: number, checked: boolean): boolean {
    if (!Number.isInteger(cell) || cell < 0 || cell > 24) return false;

    if (checked) {
      this.checked |= 1 << (24 - cell);
    } else {
      this.checked &=
        (~(1 << (24 - cell)) >>> 0) & 0b11111_11111_11111_11111_11111;
    }

    this.updateUrl();
    return true;
  }

  checkedBits(): number {
    return this.checked;
  }
}
