// Sistema de Tradução com MyMemory API
const idiomas = {
  pt: 'pt-BR',
  en: 'en'
};

let idiomaAtual = localStorage.getItem('idioma') || 'pt';

const textosPagina = {
  pt: {
    inicio: 'Início',
    filmes: 'Filmes',
    pesquisar: 'Pesquisar...',
    buscar: 'Buscar',
    remover: 'Remover',
    saberMais: 'Saber Mais',
    ano: 'Ano',
    genero: 'Gênero',
    diretor: 'Diretor',
    sinopse: 'Sinopse',
    filmeEmDestaque: 'FILME EM DESTAQUE',
    filmesESeries: 'FILMES E SÉRIES',
    resultadosBusca: 'Resultados da busca',
    nenhumaBusca: 'Nenhuma busca feita',
    filmeNaoEncontrado: 'Filme não encontrado',
    nenhum: 'Nenhum',
  },
  
};


function obterTexto(chave) {
  return textosPagina[idiomaAtual]?.[chave] || textosPagina['pt'][chave];
}

async function traduzir(texto, idioma = idiomaAtual) {
  
  if (!texto || texto === 'N/A' || texto === 'None') return texto;
  
  try {
    const pairIdioma = idioma === 'pt' ? 'en|pt-BR' : 'pt-BR|en';
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${pairIdioma}`
    );
    
   
    const data = await response.json();
    console.log(data);
    
    if (data.responseStatus === 200 && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return texto;
  } catch (erro) {
    console.warn('Erro na tradução:', erro);
    return texto;
  }
}


async function traduzirFilme(filme, idioma = idiomaAtual) {
  if (idioma === 'en') {
   
    return filme;
  }
  
  try {
    const filmeTraduzido = { ...filme };
    
    if (filme.Genre && filme.Genre !== 'N/A') {
      filmeTraduzido.Genre = await traduzir(filme.Genre, idioma);
    }
    if (filme.Director && filme.Director !== 'N/A') {
      filmeTraduzido.Director = await traduzir(filme.Director, idioma);
    }
    
    return filmeTraduzido;
  } catch (erro) {
    console.warn('Erro ao traduzir filme:', erro);
    return filme;
  }
}


function alterarIdioma(novoIdioma) {
  idiomaAtual = novoIdioma;
  localStorage.setItem('idioma', novoIdioma);
  
  
  const btnPT = document.getElementById('btnPT');

  
  if (btnPT) btnPT.classList.toggle('ativo', novoIdioma === 'pt');

  

  window.location.reload();
}


function atualizarTextosPagina() {

const menuLinks = document.querySelectorAll('.menu a');

if (menuLinks[0]) menuLinks[0].textContent = obterTexto('inicio');
if (menuLinks[1]) menuLinks[1].textContent = obterTexto('filmes');
  const searchInputs = document.querySelectorAll('input[placeholder*="esquis"]');
  searchInputs.forEach(input => {
    input.placeholder = obterTexto('pesquisar');
  });
  
 
  const botoesBuscar = document.querySelectorAll('#btnHeader, #btnMain');
  botoesBuscar.forEach(btn => {
    btn.textContent = obterTexto('buscar');
  });
}


document.addEventListener('DOMContentLoaded', () => {

  const btnPT = document.getElementById('btnPT');
  const btnEN = document.getElementById('btnEN');
  
  if (btnPT) btnPT.classList.toggle('ativo', idiomaAtual === 'pt');
  if (btnEN) btnEN.classList.toggle('ativo', idiomaAtual === 'en');
  
  atualizarTextosPagina();
});
