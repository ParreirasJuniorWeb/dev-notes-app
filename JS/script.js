// Seleção de elementos HTML do Objeto DOM

// container onde ficarão todos os blocos de notas 
// que serão gerados via JS
const notesContainer = document.querySelector("#notes-container");

// campo de entrada ( input ) para adionar novas notas
const noteInput = document.querySelector("#note-content");

// botão adicionar notas
const addNoteBtn = document.querySelector(".add-note");

// botão para a mudança de modos de exibição do website 
const toggleModeBtn = document.querySelector("#toggleMode");

// Campo de entrada para buscar dentre as notas
const searchInput = document.querySelector("#search-input");

//botão de exportar para arquivo .csv
const exportBtn = document.querySelector("#export-notes");

// Funções 

// Variáveis globais 

 // Lista de URLs de imagens que serão usadas como background
    const imagesList = [
        "../images/tomas-kirvela-w3Je41OpVRI-unsplash.jpg",
        "../images/marvin-van-beek-liuWJ2EHDnY-unsplash.jpg",
        "../images/ai-generated-8143521.png",
        "../images/course-4663835.jpg",
        "../images/tonnel-yarkii-svechenie-perspektiva-3d-136235.jpeg",
        "../images/fon-46236.jpeg",
        "../images/fon-36189.jpeg",
        "../images/fon-32981.jpeg",
        "../images/fon-33063.jpeg",
        "../images/cvety-fon-rasteniya-6044.jpeg",
        "../images/abstrakciya-fon-32419.jpeg",
        "../images/abstract-shari-poverkhnost-raznotsvetnii-fon-150337.jpeg",
        "../images/abstract-linii-svet-fon-temnii-156048.jpeg",
        "../images/3d-splav-fon-temnii-135964.jpeg",
        "../images/3d-soti-svechenie-obem-91330.jpeg",
    ];

    // Índice inicial para acompanhar qual imagem está sendo exibida
    let indiceAtual = 0;

// Função para mudar a cada renderização a imagem de fundo do site
// Função para mudar o background do body
function changeBackgroundImage() {

    // Seleciona o body
    const body = document.body;
    
    // Atualiza o background-image
    body.classList.add("rotate-scale-up-ver-normal");
    body.style.backgroundImage = `url(${imagesList[indiceAtual]})`;
    body.style.backgroundSize = 'cover';       // Faz a imagem cobrir todo o body
    body.style.backgroundPosition = 'center';  // Centraliza a imagem
    body.style.transition = 'background-image 0.5s ease-in-out'; // Transição suave

    // Atualiza o índice, reiniciando se necessário
    indiceAtual = (indiceAtual + 1) % imagesList.length;
};

// Toggle Mode light to dark 

function toggleMode() {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    document.body.classList.toggle("darkMode");

    const modeIcon = toggleModeBtn.querySelector("i.bi");
    modeIcon.classList.toggle("bi-sun");
    modeIcon.classList.toggle("bi-moon");


    // Salva no localStorage para manter a preferência
      
    localStorage.setItem("theme", newTheme);
};

// Carrega o tema salvo ao abrir a página
    (function loadTheme() {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme);

        if(savedTheme === "dark") {
            // Adicionando od efeitos ao background e body
            document.body.classList.toggle("darkMode");
            
            const modeIcon = toggleModeBtn.querySelector("i.bi");
            modeIcon.classList.toggle("bi-sun");
            modeIcon.classList.toggle("bi-moon");
        }
      }
    })();

// Obter do localStorage as notes já salvas e exibilas 
function showNotes() {

    cleanNotes();
    // Chama a função para limpar/excluir 
    // todos os elementos HTML na tela gerados a partit do JS.

    getNotes().forEach(note => {
        createNote(
            note.id,
            note.content,
            note.fixed
        );
    });
};

function cleanNotes() {

    // Limpar tados as notas (excluir os elementos HTML já inseridos)
    // da nossa área de exibição (estrutura HTML)

    notesContainer.replaceChildren([]);
    // Faz com que exclua todos os elementos já inseridos 
    // dentro do objeto notesConatiner
};

const addNote = () => {

    const notes = getNotes();

    // Criar uma representação/abstração das notas

    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false,
    };

    // Levar os dados do Objeto Note para o HTML Object DOM

    createNote(
        noteObject.id, 
        noteObject.content,
        noteObject.fixed
    );
    
    // Guardar no ArrayList para salvar no localStorage e manipular quantidades 
    // e status / statísticas das notas.

    notes.push(noteObject);

    // Salva no localStorage cada uma das notas = Objeto de nota ( noteObject )
    saveNotes(notes);
};


function generateId() {
    // Gerar um ID único para cada bloco de notas

    return Math.floor(Math.random() * 5000);
}

function createNote(id, content, fixed) {
    // Função apenas para manipular o HTML Object DOM

    const element = document.createElement("div");

    element.classList.add("note");

    const textarea = document.createElement("textarea");

    textarea.value = content;

    textarea.placeholder = "Adicione algum texto..."

    element.appendChild(textarea);

    notesContainer.appendChild(element);

    noteInput.value = "";

    // Pin Icon

    const pinIcon = document.createElement("i");

    pinIcon.classList.add(...["bi", "bi-pin"]);

    element.appendChild(pinIcon);

    // Delete Icon

    const deleteIcon = document.createElement("i");

    deleteIcon.classList.add(...["bi", "bi-x-lg"]);

    element.appendChild(deleteIcon);

    // Duplicar Icon
    
    const duplicateIcon = document.createElement("i");

    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);

    element.appendChild(duplicateIcon);

    if(fixed) {
        element.classList.add("fixed");
    }

    // Eventos do Elementos criados a partir do JS

    element.querySelector("textarea").addEventListener(
        "keyup",
        (e) => {

            const noteContent = e.target.value;

            updateNote(id, noteContent);
        }
    );

    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id);
    });

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, element);
    });

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        copyNote(id);
    });

    // Statistics Note
    document.querySelector("#totalNotes").textContent = totalNotes();
    document.querySelector("#totalNotesPined").textContent = totalFixedNotes();
}

// Marked Notes 

function toggleFixNote(id) {

    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);

    showNotes();
};

// Delete Notes 

function deleteNote(id, element) {

    const notes = getNotes().filter((note) => note.id !== id);

    saveNotes(notes);

    notesContainer.removeChild(element);
};

function copyNote(id) {

    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];
    // Filtra os elementos dentro do ArrayList 
    // a partir de uma condição de entrada

    // A função .filter() cria outro ArrayList 
    // a partir dos dados do ArrayList original, porém aplicado o filtro...

    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false
    };

    createNote(
        noteObject.id, 
        noteObject.content, 
        noteObject.fixed
    );

    notes.push(noteObject);

    saveNotes(notes);

    showNotes();
};

const totalNotes = () => {
    const notes = getNotes();

    const totalNotes = notes.length;
    console.log(totalNotes);

    return totalNotes;
};

const totalFixedNotes = () => {
    const notes = getNotes();

    const totalFixedNotes = notes.filter((note) => note.fixed);

    return totalFixedNotes.length;
};

function updateNote(id, newContent) {

    const notes = getNotes();

    const targetNote = notes.filter(
        (note) => note.id === id
    )
    [0];

    targetNote.content = newContent;

    saveNotes(notes);
};

function searchNotes(search) {

    const searchResults = getNotes().filter(
        (note) => note.content.includes(search));
    
    if(search !== "") {

        cleanNotes();

        searchResults.forEach((note) => createNote(
            note.id,
            note.content,
            note.fixed
        ));

        return;
    }
    
    cleanNotes();

    showNotes();
};

function exportData() {

    const notes = getNotes();

    // separa o dado por , quebra linha \n

    const csvString = [
        ["ID", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ]
    .map((e) => e.join(","))
    .join("\n");

    const element = document.createElement("a");

    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

    element.target = "_blank";

    element.download = "notes.csv";

    element.click();
};

// Local Storage Funções

function getNotes() {

    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));
    // ordenando a lista com pesos nas notes

    return orderedNotes;
};

function saveNotes(notesList) {

    localStorage.setItem("notes", JSON.stringify(notesList));
};

// Eventos JS

addNoteBtn.addEventListener("click", () => {
    addNote();
});

// Mudar de Theme
toggleModeBtn.addEventListener("click", toggleMode);

// Evento de busca pela nota digitada no campo
searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value;

    searchNotes(search);
});

noteInput.addEventListener("keydown", (e) => {

    if(e.key === "Enter") {

        addNote();
    }
});

exportBtn.addEventListener("click", () => exportData);

window.addEventListener("load", () => {
    // Executa a função a cada 2000ms (2 segundos)
    setInterval(changeBackgroundImage, 12000);
});

// Inicialização 
showNotes();