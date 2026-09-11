import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '余烬地牢 · EMBER VAULT', description: '像素风卡牌 Roguelike。三个职业，一条无法回头的地牢之路。' };
export default function RootLayout({children}: {children: React.ReactNode}) {return <html lang="zh-CN" className="dark"><body>{children}</body></html>}
