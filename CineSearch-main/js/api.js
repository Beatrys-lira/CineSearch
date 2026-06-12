const apiKey = "dc8cac28";
const baseUrl = "https://www.omdbapi.com/";

const filmesPopulares = [
  "The super Mario galaxy Movie",
  "michael",
  "project hail mary",
  "the devil wears prada 2",
  "scream 7",
  "supergirl",
  "hoppers"
];

const catalogoFilmes = [
  "Avatar",
  "Titanic",
  "Inception",
  "The Dark Knight",
  "Interstellar",
  "Oppenheimer",
  "Dune",
  "Top Gun: Maverick",
  "Joker",
  "Barbie",
  "Deadpool",
  "The Batman",
  "John Wick",
  "The Matrix",
  "Gladiator",
  "The Shawshank Redemption",
  "Forrest Gump",
  "Fight Club",
  "Spider-Man",
  "Avengers: Endgame",
  "Iron Man",
  "Doctor Strange",
  "Black Panther",
  "Shrek",
  "Toy Story",
  "Frozen",
  "Moana",
  "Coco",
  "Inside Out",
  "How to Train Your Dragon"
];

function ativarBotoes() {
  document.querySelectorAll(".btn-detalhes").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      verDetalhes(id);
    });
  });
}

function verDetalhes(id) {
  localStorage.setItem("detalhe", id);

  const caminho = window.location.pathname.includes("/pages/")
    ? "filmes.html"
    : "pages/filmes.html";

  window.location.href = caminho;
}

async function criarCard(filme) {
  const poster =
    !filme.Poster || filme.Poster === "N/A"
      ? "../assets/imagens/sem-poster.png"
      : filme.Poster;

  return `
    <div class="movie-card">
      <img src="${poster}" onerror="this.src='../assets/imagens/sem-poster.png'">

      <h3>${filme.Title}</h3>

      <div class="botoes-container">
        <button class="btn-detalhes" data-id="${filme.imdbID || ""}">
          <p>${obterTexto("saberMais")}</p>
        </button>
      </div>
    </div>
  `;
}

async function carregarEmAlta() {
  const container = document.getElementById("moviesContainer");

  if (!container) return;

  container.innerHTML = "";

  for (const filme of filmesPopulares) {
    const res = await fetch(`${baseUrl}?apikey=${apiKey}&t=${filme}`);
    const data = await res.json();

    if (
      data.Response === "True" &&
      data.Poster &&
      data.Poster !== "N/A" &&
      data.Poster !== "null"
    ) {
      container.innerHTML += await criarCard(data);
    }
  }

  ativarBotoes();
}

async function carregarCatalogo() {
  const populares = document.getElementById("popularesContainer");

  if (!populares) return;

  populares.innerHTML = "";

  for (const titulo of catalogoFilmes) {
    try {
      const res = await fetch(
        `${baseUrl}?apikey=${apiKey}&t=${encodeURIComponent(titulo)}`
      );

      const data = await res.json();

      if (!data || data.Response !== "True") continue;

      populares.innerHTML += await criarCard(data);

    } catch (e) {
      console.warn("Erro ao carregar título", titulo, e);
    }
  }

  ativarBotoes();
}

function configurarBusca() {
  const inputHeader = document.getElementById("searchHeader");
  const inputMain = document.getElementById("filme");
  const btnHeader = document.getElementById("btnHeader");
  const btnMain = document.getElementById("btnMain");

  if (!inputHeader || !inputMain) return;

  inputHeader.addEventListener("input", () => {
    inputMain.value = inputHeader.value;
  });

  inputMain.addEventListener("input", () => {
    inputHeader.value = inputMain.value;
  });

  function buscar(valor) {
    if (!valor) return;

    localStorage.setItem("busca", valor);
    window.location.href = "./pages/detalhes.html";
  }

  btnHeader.onclick = () => buscar(inputHeader.value);
  btnMain.onclick = () => buscar(inputMain.value);
}

async function mostrarResultados() {
  const container = document.getElementById("resultados");

  if (!container) return;

  const busca = localStorage.getItem("busca");

  if (!busca) {
    container.innerHTML = `<p>${obterTexto("nenhumaBusca")}</p>`;
    return;
  }

  const res = await fetch(`${baseUrl}?apikey=${apiKey}&s=${busca}`);
  const data = await res.json();

  container.innerHTML = "";

  if (data.Search) {
    for (const item of data.Search) {
      if (!item || !item.imdbID) continue;

      try {
        const resDetalhe = await fetch(
          `${baseUrl}?apikey=${apiKey}&i=${item.imdbID}`
        );

        const filmeCompleto = await resDetalhe.json();

        if (
          !filmeCompleto ||
          !filmeCompleto.Poster ||
          filmeCompleto.Poster === "N/A" ||
          filmeCompleto.Poster === "null" ||
          !filmeCompleto.Title
        ) {
          continue;
        }

        container.innerHTML += await criarCard(filmeCompleto);

      } catch (e) {
        console.warn("Erro ao buscar detalhe do filme", e);
      }
    }

    ativarBotoes();

  } else {
    container.innerHTML = `<p>${obterTexto("filmeNaoEncontrado")}</p>`;
  }
}

carregarEmAlta();
carregarCatalogo();
configurarBusca();
mostrarResultados();
ativarBotoes();