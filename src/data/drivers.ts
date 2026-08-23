export type Driver = { id:string; number:number; first:string; last:string; team:string; color:string };
export const drivers: Driver[] = [
 {id:'norris',number:1,first:'Lando',last:'Norris',team:'McLaren',color:'#ff8000'}, {id:'piastri',number:81,first:'Oscar',last:'Piastri',team:'McLaren',color:'#ff8000'},
 {id:'russell',number:63,first:'George',last:'Russell',team:'Mercedes',color:'#27f4d2'}, {id:'antonelli',number:12,first:'Kimi',last:'Antonelli',team:'Mercedes',color:'#27f4d2'},
 {id:'verstappen',number:3,first:'Max',last:'Verstappen',team:'Red Bull Racing',color:'#3671c6'}, {id:'hadjar',number:6,first:'Isack',last:'Hadjar',team:'Red Bull Racing',color:'#3671c6'},
 {id:'leclerc',number:16,first:'Charles',last:'Leclerc',team:'Ferrari',color:'#e8002d'}, {id:'hamilton',number:44,first:'Lewis',last:'Hamilton',team:'Ferrari',color:'#e8002d'},
 {id:'albon',number:23,first:'Alex',last:'Albon',team:'Williams',color:'#64c4ff'}, {id:'sainz',number:55,first:'Carlos',last:'Sainz',team:'Williams',color:'#64c4ff'},
 {id:'lindblad',number:41,first:'Arvid',last:'Lindblad',team:'Racing Bulls',color:'#6692ff'}, {id:'lawson',number:30,first:'Liam',last:'Lawson',team:'Racing Bulls',color:'#6692ff'},
 {id:'stroll',number:18,first:'Lance',last:'Stroll',team:'Aston Martin',color:'#229971'}, {id:'alonso',number:14,first:'Fernando',last:'Alonso',team:'Aston Martin',color:'#229971'},
 {id:'ocon',number:31,first:'Esteban',last:'Ocon',team:'Haas',color:'#b6babd'}, {id:'bearman',number:87,first:'Oliver',last:'Bearman',team:'Haas',color:'#b6babd'},
 {id:'hulkenberg',number:27,first:'Nico',last:'Hulkenberg',team:'Audi',color:'#00302a'}, {id:'bortoleto',number:5,first:'Gabriel',last:'Bortoleto',team:'Audi',color:'#00302a'},
 {id:'gasly',number:10,first:'Pierre',last:'Gasly',team:'Alpine',color:'#0093cc'}, {id:'colapinto',number:43,first:'Franco',last:'Colapinto',team:'Alpine',color:'#0093cc'},
 {id:'perez',number:11,first:'Sergio',last:'Perez',team:'Cadillac',color:'#ffd100'}, {id:'bottas',number:77,first:'Valtteri',last:'Bottas',team:'Cadillac',color:'#ffd100'}
];
export const defaultGrid = () => drivers.slice(0,10);
