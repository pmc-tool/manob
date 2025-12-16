// import { HomeApiService } from './apiSlice'; // Adjust the import path accordingly

/**
 * Utility function to update the product favorite status dynamically in cache.
 * @param {string} queryKey - The query key for the endpoint you want to update.
 * @param {string} productId - The product ID to toggle the `is_liked` flag.
 */
export const updateProductFavoriteStatus = (service, queryKey, productId) => {
  return service.util.updateQueryData(
    queryKey, // Query key (e.g., "getHomeRecommendedProducts")
    undefined, // Query argument (if any, you can pass the necessary argument)
    (draft) => {
      if (!draft || !Array.isArray(draft.items)) return;

      // Find the product and toggle the `is_liked` status
      const productToUpdate = draft.items.find(
        (product) => product.id === productId
      );
      if (productToUpdate) {
        productToUpdate.is_liked = !productToUpdate.is_liked; // Toggle `is_liked`
      }
    }
  );
};

export const updateServiceFavoriteStatus = (service, queryKey, productId) => {
  return service.util.updateQueryData(
    queryKey, // Query key (e.g., "getHomeRecommendedProducts")
    undefined, // Query argument (if any, you can pass the necessary argument)
    (draft) => {
      if (!draft || !Array.isArray(draft.items)) return;

      // Find the product and toggle the `is_liked` status
      const serviceToUpdate = draft.items.find(
        (product) => product.id === productId
      );
      if (serviceToUpdate) {
        serviceToUpdate.is_liked = !serviceToUpdate.is_liked; // Toggle `is_liked`
      }
    }
  );
};
