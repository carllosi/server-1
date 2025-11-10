import { getPostsApi, deletePostApi, updatePostApi } from "./fatchApi.js"; // incluindo .js

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const closeBtn = document.querySelector(".close");
modal.style.display = "none";

const imageGrid = document.querySelector(".image-grid");

// Função para buscar e exibir os dados do endpoint
async function getPosts() {
  const data = await getPostsApi();
  try {
    const postsList = data.map(item => {
      return `
        <article data-id="${item._id}" data-description="${item.descricao}">
          <figure>
            <img src="${item.imgUrl}" />
          </figure>
          <p>Usuário: ${item.usuario || 'Anônimo'}</p>
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Deletar</button>
        </article>
      `;
    }).join('');
    imageGrid.insertAdjacentHTML('beforeend', postsList);

    // Adicionando eventos de clique para cada imagem carregada
    addImageClickEvents();
    addEditEvents(); // adicionar evento de editar aos posts
    addDeleteEvents(); // adicionar evento de deletar aos posts
  } catch (error) {
    console.error("Erro ao popular página", error);
  }
}

// Função para adicionar os eventos de clique às imagens
function addImageClickEvents() {
    const images = document.querySelectorAll(".image-grid img");
    images.forEach(img => {
        img.addEventListener("click", function () {
            captionText.textContent = "";
            modal.style.display = "block";
            modalImg.src = this.src;

            const article = this.closest("article");
            const description = article ? article.dataset.description : '';
            const caption = description || this.alt;

            captionText.innerHTML = `<p>${caption}</p>`;
        });
    });
}

// Evento de fechar o modal
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// Fechar o modal clicando fora dele
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Função para adicionar eventos de editar aos posts
function addEditEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const postId = e.target.closest("article").dataset.id;
            const descricao = prompt("Digite a nova descrição do post:");
            const usuario = prompt("Digite o novo nome de usuário:");

            if (descricao && usuario) {
                try {
                    const updatedPost = await updatePostApi(postId, descricao, usuario);
                    if (updatedPost) {
                        console.log("Post atualizado com sucesso");

                        // Atualiza os dados do post na tela
                        const postElement = e.target.closest("article");
                        postElement.querySelector("p").textContent = `Usuário: ${usuario || 'Anônimo'}`;
                        postElement.dataset.description = descricao;
                    }
                } catch (err) {
                    console.error("Erro ao atualizar post:", err);
                }
            }
        });
    });
}

// Função para adicionar eventos de deletar aos posts
function addDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const postId = e.target.closest("article").dataset.id;
            try {
                const response = await deletePostApi(postId);
                if (response) {
                    // Remove o post da tela após deletar
                    const postElement = e.target.closest("article");
                    postElement.remove();
                    console.log("Post apagado");
                }
            } catch (err) {
                console.error("Erro ao apagar post:", err);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", getPosts); // já existente: carrega posts na grid
