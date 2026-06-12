const apiKey = "dc8cac28";
const baseUrl = "https://www.omdbapi.com/";

async function carregarDetalhes() {
  const container = document.getElementById("detalheFilme");

  const id = localStorage.getItem("detalhe");

  if (!id) {
    container.innerHTML = `<p>${obterTexto('filmeNaoEncontrado')}</p>`;
    return;
  }

  const res = await fetch(`${baseUrl}?apikey=${apiKey}&i=${id}`);
  const data = await res.json();

  mostrarDetalhes(data);
}

async function mostrarDetalhes(filme) {
    
  const container = document.getElementById("detalheFilme");

  const poster = (!filme.Poster || filme.Poster === "N/A")
    ? "../assets/imagens/sem-poster.png"
    : filme.Poster;

  let genre = filme.Genre;
  let director = filme.Director;
  let plot = filme.Plot;
  
  if (idiomaAtual === 'pt') {
    if (genre && genre !== 'N/A') genre = await traduzir(genre, 'pt');
    if (director && director !== 'N/A') director = await traduzir(director, 'pt');
    if (plot && plot !== 'N/A') plot = await traduzir(plot, 'pt');
  }
console.log("Original:", filme.Plot);
console.log("Traduzido:", plot);
  container.innerHTML = `
    <div class="detalhe-card">
      <img src="${poster}" onerror="this.src='../assets/imagens/sem-poster.png'">

      <div>
        <h1>${filme.Title}</h1>
        <p><strong>${obterTexto('ano')}:</strong> ${filme.Year}</p>
        <p><strong>${obterTexto('genero')}:</strong> ${genre || obterTexto('nenhum')}</p>
        <p><strong>${obterTexto('diretor')}:</strong> ${director || obterTexto('nenhum')}</p>
        <p><strong>${obterTexto('sinopse')}:</strong> ${plot}</p>
      </div>
    </div>
  `;
  
}


carregarDetalhes();