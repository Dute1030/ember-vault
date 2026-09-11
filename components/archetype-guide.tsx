import {jobArchetypes,archetypeDeck} from '@/lib/archetypes';
import {getCard,type Job} from '@/lib/game';
export function ArchetypeGuide({job,deck}:{job:Job;deck?:string[]}){
 return <section className="archetype-guide"><p>流派随抓牌形成，无需开局锁定。优先补齐启动牌与收益牌；多拿不同方向的终结牌会稀释组合。</p><div className="archetype-routes">{jobArchetypes(job).map(a=><article key={a.id}><h3>{a.name}</h3><p>{a.loop}</p><div><b>启动</b> {a.setup.map(k=>getCard(k).name).join(' · ')}</div><div><b>收益</b> {a.payoff.map(k=>getCard(k).name).join(' · ')}</div>{deck&&<div className="archetype-owned">当前牌组：启动 {archetypeDeck(deck,a.setup).length} 张 / 收益 {archetypeDeck(deck,a.payoff).length} 张<br/><small>数量包含重复牌，仅供构筑参考；升级可能改变启动条件，请查看牌面。</small></div>}<p className="archetype-risk">取舍：{a.risk}</p></article>)}</div></section>
}
