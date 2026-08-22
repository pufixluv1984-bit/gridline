export type Driver = { id:string; first:string; last:string; team:string; color:string };
export const drivers: Driver[] = [
 {id:'norris',first:'Lando',last:'Norris',team:'McLaren',color:'#ff8000'}, {id:'piastri',first:'Oscar',last:'Piastri',team:'McLaren',color:'#ff8000'},
 {id:'leclerc',first:'Charles',last:'Leclerc',team:'Ferrari',color:'#e8002d'}, {id:'hamilton',first:'Lewis',last:'Hamilton',team:'Ferrari',color:'#e8002d'},
 {id:'verstappen',first:'Max',last:'Verstappen',team:'Red Bull Racing',color:'#3671c6'}, {id:'hadjar',first:'Isack',last:'Hadjar',team:'Red Bull Racing',color:'#3671c6'},
 {id:'russell',first:'George',last:'Russell',team:'Mercedes',color:'#27f4d2'}, {id:'antonelli',first:'Kimi',last:'Antonelli',team:'Mercedes',color:'#27f4d2'},
 {id:'albon',first:'Alex',last:'Albon',team:'Williams',color:'#64c4ff'}, {id:'sainz',first:'Carlos',last:'Sainz',team:'Williams',color:'#64c4ff'},
 {id:'hulkenberg',first:'Nico',last:'Hulkenberg',team:'Audi',color:'#00302a'}, {id:'bortoleto',first:'Gabriel',last:'Bortoleto',team:'Audi',color:'#00302a'},
 {id:'alonso',first:'Fernando',last:'Alonso',team:'Aston Martin',color:'#229971'}, {id:'stroll',first:'Lance',last:'Stroll',team:'Aston Martin',color:'#229971'},
 {id:'gasly',first:'Pierre',last:'Gasly',team:'Alpine',color:'#0093cc'}, {id:'colapinto',first:'Franco',last:'Colapinto',team:'Alpine',color:'#0093cc'},
 {id:'ocon',first:'Esteban',last:'Ocon',team:'Haas',color:'#b6babd'}, {id:'bearman',first:'Oliver',last:'Bearman',team:'Haas',color:'#b6babd'},
 {id:'lawson',first:'Liam',last:'Lawson',team:'Racing Bulls',color:'#6692ff'}, {id:'lindblad',first:'Arvid',last:'Lindblad',team:'Racing Bulls',color:'#6692ff'},
 {id:'perez',first:'Sergio',last:'Perez',team:'Cadillac',color:'#ffd100'}, {id:'bottas',first:'Valtteri',last:'Bottas',team:'Cadillac',color:'#ffd100'}
];
export const defaultGrid = () => drivers.slice(0,10);
