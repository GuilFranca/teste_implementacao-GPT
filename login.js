// Lista de usuários pré-definidos
const usuarios = [
    { usuario: "admin", senha: "1234" },
    { usuario: "user1", senha: "senha1" },
    { usuario: "user2", senha: "senha2" }
];

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMsg = document.getElementById("error-msg");

    // Verifica se o usuário e senha existem na lista
    let usuarioEncontrado = usuarios.find(u => u.usuario === username && u.senha === password);

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogado", username); // Salva o usuário logado
        alert("Login bem-sucedido!");
        window.location.href = "dashboard.html"; // Redireciona
    } else {
        errorMsg.textContent = "Usuário ou senha incorretos!";
    }
}

// ⚠ Proteção contra inspeção
document.addEventListener("contextmenu", event => event.preventDefault()); // Bloqueia botão direito
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && (event.key === "u" || event.key === "U" || event.key === "s" || event.key === "S")) {
        event.preventDefault();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "I") {
        event.preventDefault();
    }
    if (event.key === "F12") {
        event.preventDefault();
    }
});

// Bloqueia o console do navegador
setInterval(() => {
    console.log = function () { };
    console.warn = function () { };
    console.error = function () { };
}, 1000);