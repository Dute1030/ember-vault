import type {Game} from './game.ts';
export const MUSIC_TRACKS={explore:{src:'/audio/embers-loop.wav',name:'余烬回廊'},battle:{src:'/audio/battle-loop.wav',name:'刀锋交错'},boss:{src:'/audio/boss-loop.wav',name:'王座审判'},shop:{src:'/audio/shop-loop.wav',name:'铜币与灯火'},rest:{src:'/audio/rest-loop.wav',name:'火旁小憩'}};
export type MusicScene=keyof typeof MUSIC_TRACKS;
export function musicScene(game:Game|null):MusicScene{if(!game)return 'explore';if(game.phase==='battle')return game.route[game.floor]?.[game.lane]==='boss'?'boss':'battle';if(game.phase==='shop')return 'shop';if(['camp','reward','won'].includes(game.phase))return 'rest';return 'explore'}
