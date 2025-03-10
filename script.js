// Dados de exemplo, agora cada produto é um objeto com nome e preço
const allProducts = [
    { name: "Produto 1", price: 10.00 },
    { name: "Produto 2", price: 15.50 },
    { name: "Produto 3", price: 12.30 },
    { name: "Produto 4", price: 20.00 },
    { name: "Produto 5", price: 30.00 },
    { name: "Produto 6", price: 25.00 },
    { name: "Produto 7", price: 18.00 },
    { name: "Produto 8", price: 22.50 },
    { name: "Produto 9", price: 19.00 },
    { name: "Produto 10", price: 40.00 },
    { name: "Produto 11", price: 11.00 },
    { name: "Produto 12", price: 13.00 },
    { name: "Produto 13", price: 17.00 },
    { name: "Produto 14", price: 21.00 },
    { name: "Produto 15", price: 50.00 }
];

let filteredProducts = [...allProducts]; // Array filtrado com base na pesquisa
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Carrinho de compras armazenado no localStorage
const itemsPerPage = 5; // Quantidade de itens por página
let currentPage = 1; // Página inicial

// Função para exibir produtos
function showProducts(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);

    const productList = document.getElementById('product-list');
    productList.innerHTML = pageProducts.map((product, index) => {
        const productIndex = start + index;
        const isInCart = cart.some(item => item.product.name === product.name);
        return `
        <div>
            <p>${product.name}</p>
            <p>R$ ${product.price.toFixed(2)}</p>
            <label>
                <input type="checkbox" class="hidden-checkbox" id="checkbox-${productIndex}" onchange="toggleCart(${productIndex}, this.checked)" ${isInCart ? 'checked' : ''}>
                Adicionar ao Carrinho
            </label>
        </div>
    `;
    }).join('');
}

// Função para criar a barra de paginação
function createPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Limpa a paginação existente

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;

        // Adiciona evento de clique na página
        pageLink.addEventListener('click', function (event) {
            event.preventDefault();
            currentPage = i;
            showProducts(currentPage);
            createPagination();
        });

        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
}

// Função para lidar com a pesquisa
function handleSearch() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query)
    );
    currentPage = 1; // Sempre volta para a primeira página após a pesquisa
    showProducts(currentPage);
    createPagination();
}

// Função para adicionar ao carrinho (via checkbox)
function toggleCart(productIndex, checked) {
    const product = allProducts[productIndex];

    if (checked) {
        // Adiciona ao carrinho
        const existingItem = cart.find(item => item.product.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1; // Aumenta a quantidade
        } else {
            cart.push({ product, quantity: 1 }); // Adiciona novo produto com quantidade 1
        }
    } else {
        // Remove do carrinho
        cart = cart.filter(item => item.product.name !== product.name);
    }

    // Atualiza o botão do carrinho
    document.getElementById('cart-button').textContent = `Ver Carrinho (${cart.length})`;

    // Salva o carrinho no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para abrir o modal do carrinho
function openCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = cart.map(item => {
        return `
        <div class="cart-item">
            <span>${item.product.name}</span>
            <span>R$ ${item.product.price.toFixed(2)}</span>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.product.name}', this.value)">
            <span>Subtotal: R$ ${(item.product.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart('${item.product.name}')">Remover</button>
        </div>
    `;
    }).join('');

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);

    document.getElementById('cart-modal').style.display = 'flex';
}

// Função para atualizar a quantidade de um produto
function updateQuantity(productName, quantity) {
    const item = cart.find(item => item.product.name === productName);
    item.quantity = parseInt(quantity);

    openCartModal(); // Atualiza o modal
    document.getElementById('cart-button').textContent = `Ver Carrinho (${cart.length})`;

    // Salva o carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para remover item do carrinho
function removeFromCart(productName) {
    cart = cart.filter(item => item.product.name !== productName);
    openCartModal(); // Reabre o modal para refletir as mudanças
    document.getElementById('cart-button').textContent = `Ver Carrinho (${cart.length})`;

    // Desmarca o checkbox correspondente
    const productIndex = allProducts.findIndex(product => product.name === productName);
    if (productIndex !== -1) {
        const checkbox = document.getElementById(`checkbox-${productIndex}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }

    // Salva o carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para fechar o modal do carrinho
function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Função para enviar o carrinho pelo WhatsApp
function sendCartToWhatsApp() {
    const phoneNumber = "5561996518333"; // Coloque o número do destinatário aqui com o código do país (sem espaços ou símbolos)
    let message = "Carrinho de Compras:\n\n";

    // Adiciona os itens do carrinho na mensagem
    cart.forEach(item => {
        message += `${item.product.name} - ${item.quantity} x R$ ${item.product.price.toFixed(2)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    message += `\nTotal: R$ ${total.toFixed(2)}`;

    // Codifica a mensagem para ser enviada via URL
    const encodedMessage = encodeURIComponent(message);

    // Gera o link do WhatsApp
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abre o WhatsApp com o link
    window.open(whatsappLink, "_blank");
}

// Função para exportar o carrinho para PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;
    doc.text("Carrinho de Compras", 10, y);
    y += 10;

    cart.forEach(item => {
        doc.text(`${item.product.name} - ${item.quantity} x R$ ${item.product.price.toFixed(2)}`, 10, y);
        y += 10;
    });

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    doc.text(`Total: R$ ${total.toFixed(2)}`, 10, y);

    // Salva o PDF
    doc.save("carrinho_de_compras.pdf");
}

// Inicialização
window.onload = function () {
    // Exibe os produtos e a paginação
    showProducts(currentPage);
    createPagination();

    // Exibe o número de itens no carrinho ao carregar a página
    document.getElementById('cart-button').textContent = `Ver Carrinho (${cart.length})`;
};