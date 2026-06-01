const apiKey = "dc8cac28";
const baseUrl = "https://www.omdbapi.com/";

const filmesPopulares = [
  "Avengers",
  "Batman",
  "Barbie",
  "Spider Man",
  "The Flash",
  "Harry Potter",
  "Frozen",
];


function ativarBotoes() {
  document.querySelectorAll(".btn-detalhes").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      verDetalhes(id);
    });
  });
}

async function carregarEmAlta() {
  const container = document.getElementById("moviesContainer");
  if (!container) return;

  container.innerHTML = "";

  for (let filme of filmesPopulares) {
    const res = await fetch(`${baseUrl}?apikey=${apiKey}&t=${filme}`);
    const data = await res.json();

    if (
      data.Response === "True" &&
      data.Poster &&
      data.Poster !== "N/A" &&
      data.Poster !== "null"
    ) {
      container.innerHTML += criarCard(data);
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
    container.innerHTML = "<p>Nenhuma busca feita</p>";
    return;
  }

  const res = await fetch(`${baseUrl}?apikey=${apiKey}&s=${busca}`);
  const data = await res.json();

  container.innerHTML = "";

  if (data.Search) {
    data.Search.forEach(filme => {
      if (
        !filme ||
        !filme.Poster ||
        filme.Poster === "N/A" ||
        filme.Poster === "null" ||
        !filme.Title
      ) return;

      container.innerHTML += criarCard(filme);
    });


    ativarBotoes();

  } else {
    container.innerHTML = "<p>Filme não encontrado</p>";
  }
}


function criarCard(filme) {
  const poster = (!filme.Poster || filme.Poster === "N/A")
    ? "../assets/imagens/sem-poster.png"
    : filme.Poster;

  return `
    <div class="movie-card">
      <img src="${poster}" onerror="this.src='../assets/imagens/sem-poster.png'">

      <h3>${filme.Title}</h3>

      <button class="btn-fav">
        <img src="../assets/img/icons-fav.png">
      </button>

      <button class="btn-detalhes" data-id="${filme.imdbID}">
        <img src="../assets/img/icons-search.png">
      </button>
    </div>
  `;
}


function verDetalhes(id) {
  localStorage.setItem("detalhe", id);
  window.location.href = "../pages/filmes.html";
}

carregarEmAlta();
configurarBusca();
mostrarResultados();