const apiKey = "dc8cac28";
const baseUrl = "https://www.omdbapi.com/";

async function carregarDetalhes() {
  const container = document.getElementById("detalheFilme");

  const id = localStorage.getItem("detalhe");

  if (!id) {
    container.innerHTML = "<p>Filme não encontrado</p>";
    return;
  }

  const res = await fetch(`${baseUrl}?apikey=${apiKey}&i=${id}`);
  const data = await res.json();

  mostrarDetalhes(data);
}

function mostrarDetalhes(filme) {
    
  const container = document.getElementById("detalheFilme");

  const poster = (!filme.Poster || filme.Poster === "N/A")
    ? "../assets/imagens/sem-poster.png"
    : filme.Poster;

  container.innerHTML = `
    <div class="detalhe-card">
      <img src="${poster}" onerror="this.src='../assets/imagens/sem-poster.png'">

      <div>
        <h1>${filme.Title}</h1>
        <p><strong>Ano:</strong> ${filme.Year}</p>
        <p><strong>Gênero:</strong> ${filme.Genre}</p>
        <p><strong>Diretor:</strong> ${filme.Director}</p>
        <p><strong>Sinopse:</strong> ${filme.Plot}</p>
      </div>
    </div>
  `;
  
}

carregarDetalhes();