/* ---------- Recherche d'entités ---------- */

export function findCustomer(state, customerId) {
  return state.customers.find(customer => customer.id === customerId);
}

export function findProduct(state, productId) {
  return state.products.find(product => product.id === productId);
}

/* ---------- Calculs sur les commandes ---------- */

export function getOrderLines(state, order) {
  return order.items.map(item => {
    const product = findProduct(state, item.productId);

    return {
      product,
      quantity: item.quantity,
      lineTotal: product ? product.price * item.quantity : 0
    };
  });
}

export function getOrderTotal(state, order) {
  return getOrderLines(state, order).reduce(
    (sum, line) => sum + line.lineTotal,
    0
  );
}

export function getRevenue(state) {
  return state.orders
    .filter(order => order.status !== "Annulee")
    .reduce((sum, order) => sum + getOrderTotal(state, order), 0);
}

/* ---------- Filtres ---------- */

export function getFilteredOrders(state) {
  const term = state.search.trim().toLocaleLowerCase("fr");

  return state.orders.filter(order => {
    const customer = findCustomer(state, order.customerId);
    const customerName = (customer?.name ?? "").toLocaleLowerCase("fr");

    const matchesName = !term || customerName.includes(term);

    const matchesStatus =
      !state.selectedStatus || order.status === state.selectedStatus;

    const matchesCategory =
      !state.selectedCategory ||
      order.items.some(item => {
        const product = findProduct(state, item.productId);
        return product?.category === state.selectedCategory;
      });

    return matchesName && matchesStatus && matchesCategory;
  });
}

export function getProductCategories(state) {
  const categories = state.products.map(product => product.category);
  return [...new Set(categories)];
}

/* ---------- Affichage des statuts ---------- */

const STATUS_LABELS = {
  "Livree": "Livrée",
  "Annulee": "Annulée",
  "En attente": "En attente"
};

export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}