import {
  findCustomer,
  getFilteredOrders,
  getOrderLines,
  getOrderTotal,
  getProductCategories,
  getRevenue,
  statusLabel
} from "./selectors.js";

/* ---------- Utilitaires ---------- */

function money(value) {
  return `${value.toLocaleString("fr-FR")} DH`;
}

const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
}

/* ---------- Rendu global ---------- */

export function render(state) {
  renderStats(state);
  renderProducts(state);
  renderCategories(state);
  renderOrders(state);
}

/* ---------- Statistiques ---------- */

function renderStats(state) {
  document.querySelector("#stat-customers").textContent = state.customers.length;
  document.querySelector("#stat-products").textContent = state.products.length;
  document.querySelector("#stat-orders").textContent = state.orders.length;
  document.querySelector("#stat-revenue").textContent = money(getRevenue(state));
}

/* ---------- Catégories ---------- */

function renderCategories(state) {
  const categories = getProductCategories(state);

  // Boutons de la carte
  const allButtonClass = state.activeProductCategory === "" ? "active" : "";

  const categoryButtons = categories
    .map(category => {
      const activeClass = state.activeProductCategory === category ? "active" : "";

      return `
        <button class="category-btn ${activeClass}"
                data-product-category="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </button>`;
    })
    .join("");

  document.querySelector("#categories").innerHTML = `
    <button class="category-btn ${allButtonClass}" data-product-category="">
      Tout le menu
    </button>
    ${categoryButtons}`;

  // Liste déroulante du filtre des commandes
  const filter = document.querySelector("#category-filter");
  const previous = state.selectedCategory;

  const options = categories
    .map(category => `
      <option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");

  filter.innerHTML = `
    <option value="">Toutes les catégories</option>
    ${options}`;

  filter.value = previous;
}

/* ---------- Produits ---------- */

function renderProducts(state) {
  const products = state.products.filter(product => {
    return !state.activeProductCategory
      || product.category === state.activeProductCategory;
  });

  document
    .querySelector("#product-empty")
    .classList.toggle("d-none", products.length > 0);

  document.querySelector("#products").innerHTML = products
    .map(product => `
      <div class="col-12 col-sm-6 col-lg-3">
        <article class="product-card">
          <img src="${escapeHtml(product.image)}"
               alt="${escapeHtml(product.name)}"
               loading="lazy">

          <div class="product-info">
            <p class="eyebrow">${escapeHtml(product.category)}</p>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description)}</p>

            <div class="product-bottom">
              <span class="product-price">${money(product.price)}</span>
            </div>
          </div>
        </article>
      </div>`)
    .join("");
}

/* ---------- Liste des commandes ---------- */

function renderOrders(state) {
  const orders = getFilteredOrders(state);
  const target = document.querySelector("#orders-list");

  if (!orders.length) {
    target.innerHTML = `
      <p class="empty-state">Aucune commande ne correspond à ces filtres.</p>`;
    return;
  }

  target.innerHTML = orders
    .map(order => {
      const customer = findCustomer(state, order.customerId);
      const name = customer?.name ?? "Client inconnu";
      const city = customer?.city ?? "Ville inconnue";

      return `
        <article class="order-card">
          <div>
            <h3>Commande #${order.id} · ${escapeHtml(name)}</h3>
            <p>${escapeHtml(city)} · ${escapeHtml(order.date)}</p>
            <p>
              ${order.items.length} ligne(s) de produits ·
              ${money(getOrderTotal(state, order))}
            </p>
          </div>

          <div class="order-actions">
            <span class="status-pill">${escapeHtml(statusLabel(order.status))}</span>
            <button class="detail-btn" data-order-detail="${order.id}">
              Voir le détail
            </button>
          </div>
        </article>`;
    })
    .join("");
}

/* ---------- Détail d'une commande (modal) ---------- */

export function showOrderDetail(state, orderId) {
  const order = state.orders.find(item => item.id === Number(orderId));
  if (!order) return;

  const customer = findCustomer(state, order.customerId);
  const lines = getOrderLines(state, order);

  const rows = lines
    .map(line => `
      <tr>
        <td>${escapeHtml(line.product?.name ?? "Produit inconnu")}</td>
        <td>${money(line.product?.price ?? 0)}</td>
        <td>${line.quantity}</td>
        <td>${money(line.lineTotal)}</td>
      </tr>`)
    .join("");

  document.querySelector("#modal-title").textContent = `Commande #${order.id}`;

  document.querySelector("#order-detail").innerHTML = `
    <p><strong>Client :</strong> ${escapeHtml(customer?.name ?? "Inconnu")}</p>
    <p><strong>Ville :</strong> ${escapeHtml(customer?.city ?? "Inconnue")}</p>
    <p>
      <strong>Date :</strong> ${escapeHtml(order.date)} ·
      <strong>Statut :</strong> ${escapeHtml(statusLabel(order.status))}
    </p>

    <div class="table-responsive">
      <table class="detail-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <h3 class="mt-4">Total : ${money(getOrderTotal(state, order))}</h3>`;

  const modalElement = document.querySelector("#order-modal");

  if (window.bootstrap?.Modal) {
    window.bootstrap.Modal.getOrCreateInstance(modalElement).show();
  } else {
    modalElement
      .querySelector(".modal-body")
      .scrollIntoView({ behavior: "smooth" });
  }
}