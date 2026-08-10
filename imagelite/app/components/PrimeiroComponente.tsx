'use client';

export function PrimeiroComponente(){

  function clique() { 
    console.log('Você clicou no botão!');
    alert('Você clicou no botão!');
  }

  return(
    <div> 
      <h1>Primeiro Componente</h1>
      <button onClick={clique}>Clique aqui!</button>

    </div>
  );
} 