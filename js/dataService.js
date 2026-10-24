async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(
      `Impossible de charger ${path} (HTTP ${response.status}). Vérifiez le chemin du fichier.`
    );
  }

  return response.json();
}

export async function loadAllData() {
  try {
    const [customers, products, orders] = await Promise.all([
      loadJson("./data/customers.json"),
      loadJson("./data/products.json"),
      loadJson("./data/orders.json")
    ]);

    if (!Array.isArray(customers) || !Array.isArray(products) || !Array.isArray(orders)) {
      throw new Error("Les fichiers JSON doivent contenir des tableaux.");
    }

    return { customers, products, orders };
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    throw error;
  }
}