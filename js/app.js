import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import { render, showOrderDetail } from "./view.js";

/* ---------- Gestion des erreurs ---------- */

function showError(message) {
  const zone = document.querySelector("#error-zone");
  if (!zone) return;

  zone.classList.remove("d-none");
  zone.textContent = `Une erreur est survenue : ${message}`;
}

/* ---------- Événements ---------- */

function bindEvents() {
  // Catégories de la carte
  const categories = document.querySelector("#categories");

  categories?.addEventListener("click", event => {
    const button = event.target.closest("[data-product-category]");
    if (!button) return;

    state.activeProductCategory = button.dataset.productCategory;
    render(state);
  });

  // Recherche par nom de client
  const search = document.querySelector("#search-input");

  search?.addEventListener("input", event => {
    state.search = event.target.value;
    render(state);
  });

  // Filtre par statut
  const status = document.querySelector("#status-filter");

  status?.addEventListener("change", event => {
    state.selectedStatus = event.target.value;
    render(state);
  });

  // Filtre par catégorie
  const category = document.querySelector("#category-filter");

  category?.addEventListener("change", event => {
    state.selectedCategory = event.target.value;
    render(state);
  });

  // Détail d'une commande
  const orders = document.querySelector("#orders-list");

  orders?.addEventListener("click", event => {
    const button = event.target.closest("[data-order-detail]");

    if (button) {
      showOrderDetail(state, button.dataset.orderDetail);
    }
  });
}

/* ---------- Initialisation ---------- */

async function init() {
  try {
    const data = await loadAllData();

    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;

    bindEvents();
    render(state);
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
}

init();