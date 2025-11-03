export function termToDays(termKey:string){
  if(termKey==='7d') return 7
  if(termKey==='14d') return 14
  if(termKey.endsWith('m')){
    const m = Number(termKey.replace('m',''))
    if(!isNaN(m)) return m*30
  }
  return 30
}
export function addDaysISO(days:number){
  const d = new Date()
  d.setDate(d.getDate()+days)
  return d.toISOString()
}
export const TERM_OPTIONS = [
  {key:'7d', label:'7 days'},
  {key:'14d', label:'14 days'},
  {key:'1m', label:'1 month'},
  {key:'2m', label:'2 months'},
  {key:'3m', label:'3 months'},
  {key:'4m', label:'4 months'},
  {key:'5m', label:'5 months'},
  {key:'6m', label:'6 months'},
  {key:'7m', label:'7 months'},
  {key:'8m', label:'8 months'},
  {key:'9m', label:'9 months'},
  {key:'10m', label:'10 months'},
  {key:'11m', label:'11 months'},
  {key:'12m', label:'12 months'},
]
