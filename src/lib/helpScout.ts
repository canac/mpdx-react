export interface BeaconFn {
  (method: string, options?: unknown, data?: unknown): void;
  readyQueue?: unknown[];
}

declare global {
  interface Window {
    Beacon: BeaconFn | undefined;
  }
}

// Create the beacon stub that will be used until the real HelpScout beacon loads
const readyQueue: unknown[] = [];
const beacon = (method: string, options?: unknown, data?: unknown) => {
  readyQueue.push({ method, options, data });
};
beacon.readyQueue = readyQueue;

export const initBeacon = () => {
  if (!window.Beacon) {
    window.Beacon = beacon;
  }
  callBeacon('init', process.env.BEACON_TOKEN);
};

export const callBeacon = (name: string, options?: unknown) => {
  if (!window.Beacon) {
    throw new Error('HelpScout beacon has not been initialized yet');
  }

  window.Beacon(name, options);
};

export const identifyUser = (id: string, email: string, name: string) => {
  callBeacon('identify', {
    id,
    email,
    name,
  });
};

export type SuggestionsVar =
  | 'HS_COACHING_SUGGESTIONS'
  | 'HS_CONTACTS_SUGGESTIONS'
  | 'HS_CONTACTS_CONTACT_SUGGESTIONS'
  | 'HS_HOME_SUGGESTIONS'
  | 'HS_REPORTS_SUGGESTIONS'
  | 'HS_TASKS_SUGGESTIONS';

export const suggestArticles = (envVar: SuggestionsVar) => {
  const articleIds = process.env[envVar];
  callBeacon('suggest', articleIds?.split(',') ?? []);
};

export type ArticleVar =
  | 'HS_COACHING_APPOINTMENTS_AND_RESULTS'
  | 'HS_COACHING_COMMITMENTS'
  | 'HS_COACHING_OUTSTANDING_RECURRING_COMMITMENTS'
  | 'HS_COACHING_OUTSTANDING_SPECIAL_NEEDS'
  | 'HS_COACHING_ACTIVITY'
  | 'HS_COACHING_ACTIVITY_SUMMARY';

export const showArticle = (envVar: ArticleVar) => {
  const articleId = process.env[envVar];
  if (articleId) {
    callBeacon('article', articleId);
  } else {
    callBeacon('open');
  }
};
