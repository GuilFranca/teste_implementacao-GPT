// Verifica se o usuário está autenticado
let usuarioLogado = localStorage.getItem("usuarioLogado");

if (!usuarioLogado) {
    window.location.href = "index.html"; // Redireciona para o login se não estiver logado
} else {
    document.getElementById("username").textContent = usuarioLogado; // Exibe o nome do usuário
}

function logout() {
    localStorage.removeItem("usuarioLogado"); // Remove a autenticação
    window.location.href = "index.html"; // Retorna ao login
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


const blackout = document.getElementById("blackoutScreen");
const video = document.getElementById("videoPlayer");

// 🔹 1. Bloquear PrintScreen e atalhos de captura
document.addEventListener("keydown", function (event) {
    if (event.key === "PrintScreen") {
        blackout.style.display = "block"; // Ativa a tela preta
        setTimeout(() => { blackout.style.display = "none"; }, 5000); // Volta ao normal após 5s
        event.preventDefault(); // Bloqueia a ação de PrintScreen
    }

    // Bloqueia atalhos comuns de captura de tela no Windows (Snipping Tool)
    if ((event.ctrlKey && event.key === "s") ||  // Ctrl + S (Salvar página)
        (event.ctrlKey && event.key === "p") ||  // Ctrl + P (Imprimir página)
        (event.metaKey && event.key === "s") ||  // Cmd + S (Mac)
        (event.metaKey && event.key === "p")) {  // Cmd + P (Mac)
        event.preventDefault();
        alert("A captura de tela está bloqueada!");
    }
});


const videoPlayer = document.getElementById('videoPlayer');
const overlay = document.getElementById('overlay');

// Função para detectar se a tela está sendo gravada
async function detectScreenCapture() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());

        // Se a tela estiver sendo gravada, escurece o vídeo ou pausa
        overlay.style.display = 'block';
        videoPlayer.pause();
        alert('Gravação de tela detectada. O vídeo foi pausado.');
    } catch (error) {
        console.error('Erro ao detectar gravação de tela:', error);
    }
}


// Opcional: Pausar o vídeo se o usuário tentar tirar uma captura de tela
document.addEventListener('keydown', (event) => {
    if (event.key === 'PrintScreen' || (event.ctrlKey && event.key === 'p')) {
        videoPlayer.pause();
        overlay.style.display = 'block';
        alert('Captura de tela detectada. O vídeo foi pausado.');
    }
});


// Configuração do DRM (Widevine)
const drmConfig = {
    initDataTypes: ['cenc'],
    videoCapabilities: [
        {
            contentType: 'video/mp4; codecs="avc1.64001e"',
            robustness: 'SW_SECURE_DECODE' // Nível de segurança
        }
    ]
};

// Verifica se o navegador suporta DRM
if (navigator.requestMediaKeySystemAccess) {
    navigator.requestMediaKeySystemAccess('com.widevine.alpha', [drmConfig])
        .then((mediaKeySystemAccess) => {
            return mediaKeySystemAccess.createMediaKeys();
        })
        .then((mediaKeys) => {
            videoPlayer.setMediaKeys(mediaKeys);
        })
        .catch((error) => {
            console.error('Erro ao configurar DRM:', error);
        });
} else {
    console.error('Seu navegador não suporta DRM.');
}