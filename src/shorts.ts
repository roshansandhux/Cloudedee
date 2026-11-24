// 9:16 Shorts / Reels cut from episodes. Times are seconds into the episode.
export type ShortDef = {id: string; episode: string; from: number; to: number; hook?: string};

export const SHORTS: ShortDef[] = [{id: 'ep00-short1', episode: 'ep00', from: 4, to: 14, hook: 'When the test puppet finds out...'}];
