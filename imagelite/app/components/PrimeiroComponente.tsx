'use client';

interface PrimeiroComponenteProps {
  // Defina as propriedades do componente aqui, se necessário
  mensagem?: string;
  mesagemBotao?: string; // Propriedade opcional
}

export const PrimeiroComponente = ({ mensagem, mesagemBotao }: PrimeiroComponenteProps) => {

  // function clique() { 
  //   console.log('Você clicou no botão!');  //   alert('Você clicou no botão!');
  // }

  const clique = () => {
    console.log('Você clicou no botão!');
    alert(mesagemBotao); 
  }
  
  return(
    <div> 
      <h1>Primeiro Componente</h1>
      <p>{mensagem}</p>
      <button onClick={clique}>Clique aqui!</button>

    </div>
  );
} 