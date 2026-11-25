// 9:16 Shorts / Reels cut from episodes. Times are seconds into the episode.
// cta: id of a line in src/generated/voices/finshorts.json – adds an end card where Finn says it ("check the full video").
export type ShortDef = {id: string; episode: string; from: number; to: number; hook?: string; cta?: string; ctaText?: string};

const CTA = {cta: 'cta1', ctaText: 'Want to learn more? Check out the full video on YouTube!'};

export const SHORTS: ShortDef[] = [
  {id: 'ep00-short1', episode: 'ep00', from: 4, to: 14, hook: 'When the test puppet finds out...'},
  {id: 'fin02-short1', episode: 'fin02', from: 0, to: 27.5, hook: 'Your $6 latte really costs $14?! ☕', ...CTA},
  {id: 'fin02-short2', episode: 'fin02', from: 170.2, to: 222.4, hook: 'Banks call my grandma a DEADBEAT 👵💳', ...CTA},
];
