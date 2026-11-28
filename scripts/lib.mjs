// Shared rules for the deals list. No dependencies. Everything that touches
// submitted text lives here so it can be tested without the network.

export const YEAR = 2026;
export const BLACK_FRIDAY = '2026-11-27';
export const CYBER_MONDAY = '2026-11-30';
// A deal must be running at some point in the Black Friday sale weeks to be listed.
// Sales that started early or run on into December are welcome.
export const WINDOW_START = '2026-11-16';
export const WINDOW_END = '2026-12-07';
export const MAX_DEAL_DAYS = 60;

export const CATEGORIES = [
  { id: 'ai', name: 'AI tools', blurb: 'Coding assistants, model APIs, agents, AI app builders' },
  { id: 'media', name: 'AI video, image and voice', blurb: 'Video, image and voice generation, with or without an API' },
  { id: 'dev', name: 'Developer tools', blurb: 'Editors, Git, APIs, testing, debugging, monitoring' },
  { id: 'hosting', name: 'Hosting and cloud', blurb: 'VPS, serverless, CDN, domains, deployment' },
  { id: 'data', name: 'Databases and backend', blurb: 'Databases, auth, queues, search, backend services' },
  { id: 'email', name: 'Email', blurb: 'Sending, testing and email marketing' },
  { id: 'design', name: 'Design and UI', blurb: 'UI kits, components, icons, design tools' },
  { id: 'starter', name: 'Starter kits', blurb: 'Code templates that get a product shipped sooner' },
  { id: 'marketing', name: 'SEO and marketing', blurb: 'SEO, analytics, social and messaging tools' },
  { id: 'learn', name: 'Courses and books', blurb: 'Courses, books and certifications for engineers' },
  { id: 'productivity', name: 'Productivity', blurb: 'Tasks, notes, meetings, focus' },
  { id: 'desktop', name: 'Mac and desktop apps', blurb: 'Utilities a developer keeps open all day' },
  { id: 'security', name: 'Security', blurb: 'Scanning, secrets, sign-in, privacy' },
  { id: 'other', name: 'Other', blurb: 'Useful to developers and not covered above' },
];

export const RELATIONS = [
  'I built it or work on it',
  'I am a customer or user',
  'I found it and have no relation to it',
];

const SHORTENERS = new Set([
  'bit.ly', 't.co', 'tinyurl.com', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rebrand.ly', 'cutt.ly',
  'shorturl.at', 'tiny.cc', 'lnkd.in', 'rb.gy', 't.ly', 'dub.sh', 'dub.co', 'short.io', 'bl.ink',
  'geni.us', 'amzn.to', 'fas.st', 'smarturl.it', 'linktr.ee', 'bio.link', 'v.gd', 's.id',
]);

const AFFILIATE_HOSTS = [
  'shareasale.com', 'awin1.com', 'awin.com', 'impact.com', 'impactradius.com', 'pxf.io', 'sjv.io',
  'prf.hn', 'partnerstack.com', 'grsm.io', 'go2cloud.org', 'jdoqocy.com', 'tkqlhce.com',
  'dpbolvw.net', 'anrdoezrs.net', 'kqzyfj.com', 'linksynergy.com', 'clickbank.net', 'hop.clickbank.net',
  'refersion.com', 'tapfiliate.com', 'lemonsqueezy.com/affiliate', 'firstpromoter.com', 'rewardful.com',
  'skimresources.com', 'viglink.com', 'tradedoubler.com', 'avantlink.com', 'pepperjam.com',
];

// Query parameters that only exist to credit a referrer. They are stripped
// from the stored link so every listed link is the vendor's clean page.
const TRACKING_PARAMS = /^(utm_.+|ref|refs|referral|referrer|ref_?id|aff|aff_?id|affiliate|affiliate_?id|via|fpr|lmref|partner|partner_?id|irclickid|clickid|gclid|fbclid|msclkid|mc_cid|mc_eid|sscid|tap_[as]|rfsn|a_aid|a_bid)$/i;

const BANNED = [
  { reason: 'gambling', re: /\b(casino|sportsbook|sports ?betting|betting|bookmaker|online poker|slot machines?|roulette|blackjack|lottery|lotto|wager(ing)?|gambl\w*)\b/i },
  { reason: 'adult content', re: /\b(porn\w*|xxx|nsfw|escorts?|onlyfans|adult (content|videos?|toys?|site)|camgirls?|sex ?(toys?|chat|cam)|hentai)\b/i },
  { reason: 'general retail such as clothing, watches, beauty or household goods. It is for software and tools that developers and founders use', re: /\b(clothing|clothes|apparel|garments?|fashion|menswear|womenswear|sneakers|footwear|handbags?|jewell?ery|wrist ?watch(es)?|luxury watch(es)?|smart ?watch(es)? (sale|deals?)|perfumes?|fragrances?|cosmetics|makeup|skincare|mattress(es)?|furniture|home decor|kitchenware|appliances|groceries|toys)\b/i },
  { reason: 'crypto or get-rich schemes', re: /\b(airdrops?|presale|pre-sale|token sale|memecoins?|shitcoins?|pump (and|&) dump|guaranteed (returns?|profits?|income)|double your (money|crypto|bitcoin)|forex signals?|trading signals?|passive income bot|mlm|ponzi|yield farming|staking rewards|nft (drop|mint))\b/i },
];

const today = () => new Date().toISOString().slice(0, 10);

/** Collapse to one safe line of plain text. Applied to every stored field. */
export function clean(value, max = 200) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩﻿]/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[<>`]/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}

/** Escape text for a Markdown table cell. */
export function md(value) {
  return clean(value, 400).replace(/([\\|*_~\[\]#])/g, '\\$1');
}

// ---------------------------------------------------------------------------
// One deal, one file: deals/<id>.yml. Flat `key: value` lines, nothing nested, so a person
// can fill one in on GitHub's own edit page and no YAML library is needed to read it.

/** The only path a submission may add. The file name, without .yml, is the deal's id. */
export const DEAL_FILE = /^deals\/([a-z0-9][a-z0-9-]{0,80})\.yml$/;
export const MAX_DEAL_FILE_BYTES = 4000;
// What a submitter fills in, then what only the maintainer or the review sets.
const SUBMITTED_KEYS = ['name', 'url', 'category', 'discount', 'code', 'starts', 'ends', 'description', 'image', 'logo', 'relation'];
const KEPT_KEYS = ['added', 'submitter', 'source', 'own', 'noutm'];

/** Read a deal file into { key: value }. Unknown keys, comments and repeats are ignored. */
export function parseDealFile(text) {
  const out = {};
  for (const raw of String(text ?? '').replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_]+)\s*:(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    if (!(SUBMITTED_KEYS.includes(key) || KEPT_KEYS.includes(key)) || key in out) continue;
    let value = m[2].trim();
    const quoted = value.match(/^(["'])(.*)\1$/);
    if (quoted) value = quoted[2];
    out[key] = value;
  }
  return out;
}

const relationFrom = (text) => {
  const t = clean(text, 80).toLowerCase();
  if (/^i (built|made|work)/.test(t)) return RELATIONS[0];
  if (/^i (use|am a customer)/.test(t)) return RELATIONS[1];
  if (/^(no relation|none|i found)/.test(t)) return RELATIONS[2];
  return clean(text, 80);
};
const categoryFrom = (text) => {
  const t = clean(text, 60).toLowerCase();
  return CATEGORIES.find((c) => c.id === t || c.name.toLowerCase() === t);
};

/**
 * The fields of a submission, from a parsed deal file. Only what a submitter may set is read:
 * a file that arrives claiming `own: true` or an `added` date has those lines ignored.
 */
export function fieldsFromFile(file) {
  const get = (k) => file[k] ?? '';
  return {
    name: clean(get('name'), 80),
    url: get('url').split(/\s+/)[0] ?? '',
    category: categoryFrom(get('category'))?.name ?? clean(get('category'), 60),
    discount: clean(get('discount'), 80),
    code: clean(get('code'), 60),
    starts: clean(get('starts'), 20),
    ends: clean(get('ends'), 20),
    description: clean(get('description'), 220),
    relation: relationFrom(get('relation')),
    image: (get('image').split(/\s+/)[0] ?? '').trim(),
    logo: (get('logo').split(/\s+/)[0] ?? '').trim(),
  };
}

/** A listed deal, from a file already in the repository. These files are trusted. */
export function dealFromFile(id, file) {
  const get = (k) => clean(file[k] ?? '', 400);
  return {
    id,
    name: get('name'),
    url: (file.url ?? '').trim(),
    category: categoryFrom(file.category)?.id ?? 'other',
    discount: get('discount'),
    code: get('code'),
    starts: get('starts'),
    ends: get('ends'),
    description: get('description'),
    image: (file.image ?? '').trim(),
    logo: (file.logo ?? '').trim(),
    relation: get('relation'),
    added: get('added'),
    submitter: get('submitter'),
    source: get('source'),
    ...(file.own === 'true' ? { own: true } : {}),
    ...(file.noutm === 'true' ? { noutm: true } : {}),
  };
}

/** Write a deal back as a file, always in the same order. */
export function serializeDeal(deal) {
  const one = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();
  const lines = [
    `name: ${one(deal.name)}`,
    `url: ${one(deal.url)}`,
    `category: ${CATEGORIES.find((c) => c.id === deal.category)?.name ?? 'Other'}`,
    `discount: ${one(deal.discount)}`,
    `code: ${one(deal.code)}`,
    `starts: ${one(deal.starts)}`,
    `ends: ${one(deal.ends)}`,
    `description: ${one(deal.description)}`,
    `image: ${one(deal.image)}`,
    `logo: ${one(deal.logo)}`,
    `relation: ${one(deal.relation)}`,
  ];
  for (const k of ['added', 'submitter', 'source']) if (deal[k]) lines.push(`${k}: ${one(deal[k])}`);
  if (deal.own) lines.push('own: true');
  if (deal.noutm) lines.push('noutm: true');
  return lines.map((l) => l.trimEnd()).join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// The other way in: the "Submit a deal" issue form, for people who would rather not touch a file.

/** Parse the body GitHub writes for an Issue Form into { heading: value }. */
export function parseIssueForm(body) {
  const out = {};
  const text = String(body ?? '').replace(/\r\n?/g, '\n');
  const parts = text.split(/^### +(.+?) *$/m);
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i].trim().toLowerCase();
    let value = (parts[i + 1] ?? '').trim();
    if (/^_no response_$/i.test(value) || /^none$/i.test(value)) value = '';
    out[key] = value;
  }
  return out;
}

/** Map form headings to the fields of a deal. */
export function fieldsFromForm(form) {
  const get = (name) => form[name] ?? '';
  return {
    name: clean(get('product name'), 80),
    url: get('deal url').split(/\s+/)[0] ?? '',
    category: clean(get('category'), 60),
    discount: clean(get('discount'), 80),
    code: clean(get('coupon code'), 60),
    starts: clean(get('start date'), 20),
    ends: clean(get('end date'), 20),
    description: clean(get('what is it'), 220),
    relation: clean(get('your relation to the product'), 80),
    image: (get('image link').split(/\s+/)[0] ?? '').trim(),
    logo: (get('logo link').split(/\s+/)[0] ?? '').trim(),
  };
}

/** Is this issue a deal submission? GitHub does not always put the form's label on an issue from
 *  someone outside the repository, so the form's own shape counts too: the title and the headings. */
export const isFormSubmission = (issue, label = 'deal-submission') =>
  (issue.labels ?? []).some((l) => (l.name ?? l) === label) || (/^deal:/i.test(issue.title || '') && /^### Deal URL/m.test(issue.body || ''));

/** What the "Add your deal" link opens in GitHub's editor. */
export const DEAL_TEMPLATE = `# Add your Black Friday deal. It is free.
#
# 1. Rename this file to your product, for example acme-cli.yml
#    (lowercase letters, digits and dashes).
# 2. Fill in the lines below. Leave code, image and logo empty if you have none.
# 3. Click "Commit changes", then "Create pull request". That is all.
#
# discount is 60 characters or fewer, for example: 40% off annual plans
# category is one of: ${CATEGORIES.map((c) => c.name).join(' | ')}
# relation is one of: I built it | I use it | No relation
# dates look like 2026-11-27. Leave ends empty if the deal has no end date.

name:
url:
category:
discount:
code:
starts:
ends:
description:
image:
logo:
relation:
`;
/** Opens GitHub's "new file" page under deals/ with the template filled in. For someone without
 *  write access GitHub forks the repository and turns the commit into a pull request. */
export const submitUrl = (repo) => `https://github.com/${repo}/new/main/deals?filename=your-product.yml&value=${encodeURIComponent(DEAL_TEMPLATE).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)}`;

function isIsoDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

const days = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

const hostMatches = (host, list) =>
  list.some((h) => host === h.split('/')[0] || host.endsWith(`.${h.split('/')[0]}`));

/**
 * Check a URL without touching the network.
 * Returns { ok, url (cleaned), host, problems[], rejected }.
 */
export function checkUrl(raw) {
  const problems = [];
  let u;
  try {
    u = new URL(String(raw ?? '').trim());
  } catch {
    return { ok: false, problems: ['The deal URL is not a valid link. Use the full address, starting with https://'] };
  }
  if (u.protocol !== 'https:') problems.push('The deal URL must start with https://');
  if (u.username || u.password) problems.push('The deal URL must not contain a username or password.');
  if (u.port && u.port !== '443') problems.push('The deal URL must use the standard https port.');
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  const bare = host.replace(/^\[|\]$/g, '');
  if (
    /^(\d{1,3}\.){3}\d{1,3}$/.test(bare) || bare.includes(':') || !bare.includes('.') ||
    /(^|\.)(localhost|local|internal|lan|home|test|example|invalid|onion)$/.test(bare)
  ) {
    return { ok: false, rejected: 'The deal URL must be a public website, not an IP address or a local host.', problems: [] };
  }
  if (SHORTENERS.has(host)) {
    return { ok: false, rejected: `Link shorteners are not accepted (${host}). Please submit the seller's own page.`, problems: [] };
  }
  if (hostMatches(host, AFFILIATE_HOSTS)) {
    return { ok: false, rejected: `Affiliate network links are not accepted (${host}). Please submit the seller's own page.`, problems: [] };
  }
  const stripped = [];
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING_PARAMS.test(key)) {
      u.searchParams.delete(key);
      stripped.push(key);
    }
  }
  u.hash = '';
  return { ok: problems.length === 0, url: u.href, host, problems, stripped };
}

/** A stable key for spotting the same deal twice. */
export function dedupeKey(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    return host + u.pathname.replace(/\/+$/, '').toLowerCase();
  } catch {
    return String(url);
  }
}

export function slug(name) {
  return clean(name, 80).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'deal';
}

export function checkDiscount(text) {
  const t = text.trim();
  if (t.length < 2) return 'Say what the discount is, for example "40% off annual plans".';
  if (t.length > 60) return 'Keep the discount to 60 characters or fewer.';
  const percents = [...t.matchAll(/(\d+(?:\.\d+)?)\s*%/g)].map((m) => Number(m[1]));
  if (percents.some((p) => p <= 0 || p > 100)) return 'A percentage discount must be between 1 and 100.';
  if (percents.some((p) => p === 100) && !/free/i.test(t)) {
    return 'A 100% discount needs the word "free" and what is free, for example "100% off: free for the first year".';
  }
  const hasAmount = percents.length > 0 || /[$€£₹]\s?\d|\d\s?(usd|eur|gbp|inr)\b/i.test(t);
  const hasWord = /\b(free|lifetime|off|bogo|half price|months?|years?|credits?|bundle|upgrade)\b/i.test(t);
  if (!hasAmount && !hasWord) return 'State the discount as a number, for example "40% off" or "$50 off the yearly plan".';
  return null;
}

/**
 * Deterministic review of one submission.
 * @returns {{ verdict: 'approve'|'reject'|'needs-info', reasons: string[], deal?: object }}
 */
export function review(fields, existing = [], now = today()) {
  const reasons = [];
  const f = fields;

  // Hard rejections first: a banned kind of product, or a link we never list.
  const haystack = `${f.name} ${f.description} ${f.discount} ${f.url}`;
  for (const b of BANNED) {
    if (b.re.test(haystack)) return { verdict: 'reject', reasons: [`This list does not carry ${b.reason}.`] };
  }
  const link = checkUrl(f.url);
  if (link.rejected) return { verdict: 'reject', reasons: [link.rejected] };

  if (!f.url) reasons.push('Add the deal URL.');
  else reasons.push(...link.problems);

  if (f.name.length < 2) reasons.push('Add the product name.');
  if (f.name.length > 60) reasons.push('Keep the product name to 60 characters or fewer.');

  const category = CATEGORIES.find((c) => c.name.toLowerCase() === f.category.toLowerCase());
  if (!category) reasons.push(`Pick a category from the list: ${CATEGORIES.map((c) => c.name).join(', ')}.`);

  const discountProblem = checkDiscount(f.discount);
  if (discountProblem) reasons.push(discountProblem);

  if (f.code && !/^[A-Za-z0-9][A-Za-z0-9_\-]{1,29}$/.test(f.code)) {
    reasons.push('The coupon code should be 2 to 30 letters, digits, hyphens or underscores. Leave it empty if no code is needed.');
  }

  if (f.description.length < 15) reasons.push('Describe what the product is in one plain sentence (at least 15 characters).');
  if (f.description.length > 160) reasons.push('Keep the description to 160 characters or fewer.');

  if (!RELATIONS.some((r) => r.toLowerCase() === f.relation.toLowerCase())) {
    reasons.push('Say how you are related to the product.');
  }

  const startOk = isIsoDate(f.starts);
  // The end date is optional: plenty of sales only say "limited time". Left empty, or filled with
  // words and no digits, the deal has no end date and comes off the list when the sale window
  // closes (see status below). Something with digits that is not a real date is asked about,
  // because that is a typo and not a deal without an end.
  const noEnd = !/\d/.test(f.ends);
  const endOk = noEnd || isIsoDate(f.ends);
  if (!startOk) reasons.push('Give the start date as YYYY-MM-DD, for example 2026-11-27.');
  if (!endOk) reasons.push('The end date does not read as a date. Write it as YYYY-MM-DD, for example 2026-12-04, or leave it empty if the deal has no end date.');
  if (startOk && noEnd && f.starts > WINDOW_END) {
    return { verdict: 'reject', reasons: [`This list is for Black Friday ${YEAR} deals, so a deal has to be running at some point in the sale weeks around it. These dates fall outside that.`] };
  }
  if (startOk && endOk && !noEnd) {
    if (f.ends < f.starts) reasons.push('The end date is before the start date.');
    else if (f.ends < now) return { verdict: 'reject', reasons: [`This deal ended on ${f.ends}. Only live or upcoming deals are listed.`] };
    else if (f.starts > WINDOW_END || f.ends < WINDOW_START) {
      return { verdict: 'reject', reasons: [`This list is for Black Friday ${YEAR} deals, so a deal has to be running at some point in the sale weeks around it. These dates fall outside that.`] };
    } else if (days(f.starts, f.ends) > MAX_DEAL_DAYS) {
      reasons.push(`A Black Friday deal should not run longer than ${MAX_DEAL_DAYS} days. Check the dates.`);
    }
  }

  if (link.ok) {
    const key = dedupeKey(link.url);
    const twin = existing.find((d) => dedupeKey(d.url) === key || d.name.toLowerCase() === f.name.toLowerCase());
    if (twin) return { verdict: 'reject', reasons: [`${twin.name} is already on the list.`] };
  }

  // The image is optional. A link that is given has to be a plain public https link.
  let image = '';
  if (f.image) {
    const pic = checkUrl(f.image);
    if (pic.rejected || !pic.ok) reasons.push('The image link must be a public https link to a png, jpg or webp image. Fix it, or leave the field empty and we will use the image from your page.');
    else image = pic.url;
  }

  // The logo is optional too, and held to the same rule.
  let logo = '';
  if (f.logo) {
    const pic = checkUrl(f.logo);
    if (pic.rejected || !pic.ok) reasons.push('The logo link must be a public https link to a png, jpg or webp image. Fix it, or leave the field empty and we will use the icon from your site.');
    else logo = pic.url;
  }

  if (reasons.length) return { verdict: 'needs-info', reasons };

  return {
    verdict: 'approve',
    reasons: [],
    deal: {
      id: slug(f.name),
      name: f.name,
      url: link.url,
      category: category.id,
      discount: f.discount,
      code: f.code,
      starts: f.starts,
      ends: noEnd ? '' : f.ends,
      description: f.description.replace(/[.\s]+$/, ''),
      relation: f.relation,
      image,
      logo,
    },
  };
}

/** What kind of image is this, judged by its first bytes and never by its name or declared type. */
export function sniffImage(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length >= 12 && String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP') return 'webp';
  return null;
}
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Is a deal live, upcoming or over on a given day? */
export function status(deal, now = today()) {
  // A deal with no stated end date drops off when the sale window closes.
  if ((deal.ends || WINDOW_END) < now) return 'ended';
  if (deal.starts && deal.starts > now) return 'upcoming';
  return 'live';
}

export function shortDate(iso) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

// ---------------------------------------------------------------------------
// Links out to sellers say where the visitor came from.

/**
 * Adds our utm tags to a seller's link. The stored link stays clean; this runs when the
 * README is written. Any utm tags already on the link are replaced, the rest of the query
 * and the fragment are kept, and anything that is not a web link is returned untouched.
 */
export function utm(url, { source = 'dev.express', medium = 'github', campaign = `black-friday-${YEAR}` } = {}) {
  let u;
  try { u = new URL(url); } catch { return url; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return url;
  for (const k of [...u.searchParams.keys()]) if (/^utm_/i.test(k)) u.searchParams.delete(k);
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', medium);
  u.searchParams.set('utm_campaign', campaign);
  return u.href;
}

// ---------------------------------------------------------------------------
// Replies the bot posts on a submission.

const MAINTAINER = { linkedin: 'https://www.linkedin.com/in/mesingh9', x: 'https://x.com/meSingh9' };
export const anchor = (name) => name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ /g, '-');
const login = (s) => (/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(s || '') ? `@${s} ` : '');
const bullets = (items) => items.map((r) => `- ${r}`).join('\n');
// encodeURIComponent leaves ! ' ( ) * alone; a stray bracket would end a Markdown link early.
const enc = (v) => encodeURIComponent(v).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

// The website. With this empty, replies link to the README only and offer no badge.
export const SITE_URL = 'https://dev.express/black-friday/';
/** A link into the site that says where the visitor came from: the README or a reply (github), a badge, or a share. */
export function inbound(url, source, fragment = '') {
  let u;
  try { u = new URL(url); } catch { return url; }
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', 'referral');
  u.searchParams.set('utm_campaign', `black-friday-${YEAR}`);
  u.hash = fragment;
  return u.href;
}
const BADGE_IMG = 'https://dev.express/badges/listed-on-dev-express-dark.svg';
/** The badge for a seller's own website, and the same thing for a README. */
export const BADGE_HTML = (id = '', site = SITE_URL) => `<a href="${inbound(site, 'badge', id ? `deal-${id}` : '').replace(/&/g, '&amp;')}"><img src="${BADGE_IMG}" alt="Listed on dev.express" height="54"></a>`;
export const BADGE_MD = (id = '', site = SITE_URL) => `[![Listed on dev.express](${BADGE_IMG})](${inbound(site, 'badge', id ? `deal-${id}` : '')})`;

/** Share text for a listed deal. Built from cleaned, capped fields only. */
export function shareText(deal) {
  const name = clean(deal.name, 60);
  const offer = clean(deal.discount, 60);
  return `${name} is on the dev.express Black Friday list: ${offer}${deal.code ? ` with code ${clean(deal.code, 30)}` : ''}.`;
}

/**
 * @param {{verdict:string, reasons:string[], deal?:object}} action
 * @param {{repo:string, site?:string, user?:string}} ctx
 * `action.kind` is 'pr' for a pull request and 'issue' for the form.
 */
export function comment(action, { repo, site = SITE_URL, user = '' }) {
  const viaPr = action.kind === 'pr';
  const repoUrl = `https://github.com/${repo}`;
  const hi = login(user);

  if (action.verdict === 'approve') {
    const d = action.deal;
    const home = site ? inbound(site, 'share') : repoUrl;
    const row = `${repoUrl}#${anchor(d.categoryName)}`;
    const card = site ? inbound(site, 'github', `deal-${d.id}`) : '';
    const text = shareText(d);
    const x = `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(home)}`;
    const li = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(home)}`;
    return [
      `${hi}**${md(d.name)} is live.** 🎉 ${viaPr ? 'Your pull request is merged, which also makes you a contributor to the list. ' : ''}Thanks for adding it.`,
      '',
      `See it in the [README](${row})${card ? ` and on [the site](${card})` : ''}.`,
      '',
      '**Two small favours**',
      '',
      `- ⭐ [Star the repo](${repoUrl}). It is how other developers find these deals.`,
      `- 📣 Share it: [post on X](${x}) · [share on LinkedIn](${li})`,
      '',
      'No pressure, your listing stays either way.',
      '',
      ...(site ? [
        '**Your badge**, for your website:',
        '',
        BADGE_HTML(d.id, site),
        '',
        '```html',
        BADGE_HTML(d.id, site),
        '```',
        '',
        'Prefer Markdown, or a light version? Both are in the [README](' + repoUrl + '#listed-here-take-the-badge).',
        '',
      ] : []),
      `👋 Say hello to the maintainer, Mandeep Singh, on [LinkedIn](${MAINTAINER.linkedin}) or [X](${MAINTAINER.x}).`,
    ].join('\n');
  }

  if (action.verdict === 'reject') {
    return [
      `${hi}thanks for sending this in. It is not one for this list, and here is why:`,
      '',
      bullets(action.reasons),
      '',
      'The list is for software and tools that developers, founders and AI builders use, linked straight to the seller. If we got this wrong, reply here and it will get another look. A different deal is always welcome.',
    ].join('\n');
  }

  if (action.verdict === 'hold') {
    return [
      `${hi}thanks, this is nearly in. 👀 Everything looks right, but the link would not open automatically:`,
      '',
      bullets(action.reasons),
      '',
      'It gets opened in a normal browser next, usually within the hour, and listed if the offer is there. There is nothing you need to do.',
    ].join('\n');
  }

  return [
    `${hi}thanks for the submission, it is nearly there. ✏️ A few details need a fix before it can go live:`,
    '',
    bullets(action.reasons),
    '',
    viaPr
      ? 'To fix it, edit your file here: open the **Files changed** tab above, click the three dots on the file, then **Edit file**, and commit to the same branch. It gets looked at again automatically, so there is no need to open a new pull request.'
      : 'To fix it, edit this issue: the three dots at the top right of your post, then **Edit**. It gets looked at again automatically, so there is no need to open a new issue.',
  ].join('\n');
}
