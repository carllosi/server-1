const API_URL_BASE = "http://127.0.0.1:3000";

export const getPostsApi = async () => {
    try {
        const response = await fetch(`${API_URL_BASE}/posts`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar os posts: ", error);
    }
};

// 🔹 POST - Enviar um novo post
export const uploadApi = async (imagem, descricao, usuario) => {
    try {
        const form = new FormData();
        form.append('image', imagem);
        form.append('descricao', descricao);
        form.append('usuario', usuario);
        const response = await fetch(`${API_URL_BASE}/upload`, {
            method: "POST",
            body: form
        });
        if (!response.ok) {
            throw new Error("Erro ao enviar o post");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar os posts: ", error);
    }
};

// 🔹 PUT - Atualizar um post
export const updatePostApi = async (id, descricao, usuario) => {
    try {
        const body = { descricao, usuario };
        const response = await fetch(`${API_URL_BASE}/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("Erro ao atualizar post");
        return await response.json();
    } catch (error) {
        console.error("Erro ao atualizar post:", error);
    }
};

// 🔹 DELETE - Apagar um post
export const deletePostApi = async (id) => {
    try {
        const response = await fetch(`${API_URL_BASE}/posts/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Erro ao deletar post");
        return await response.json();
    } catch (error) {
        console.error("Erro ao deletar post:", error);
    }
};
