function VentasCounter() { 
  let ventas = 0;                       // variable común 
  
  const registrar = () => { 
    ventas = ventas + 1; 
    console.log('ventas ahora vale', ventas); 
  }; 
  
  return ( 
    <div className='card p-3'> 
      <h5>Ventas del día: {ventas}</h5> 
      <button className='btn btn-primary' onClick={registrar}>+1</button> 
    </div> 
  ); 
} 
export default VentasCounter; 