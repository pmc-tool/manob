import { configureStore } from "@reduxjs/toolkit";
import { HomeApiService } from "./services/home-service/home.service";
import authSlice from "./slices/auth.slice";
import checkoutStoreSlice from "./slices/checkout.slice";
import productCartSlice from "./slices/productCart.slice";
// import productSlice from "./slices/products.slice";
import { AuthApiService } from "./services/auth.service";
import { UserApiService } from "./services/user.service";
import { JobListApiService } from "./services/job-list.service";
import jobSlice from "./slices/job.slice";
import { SellerCategoryApiService } from "./services/seller-service/category.service";
import { SellerProductApiService } from "./services/seller-service/product.service";
import draftProductSlice from "./slices/draftProduct.slice";
import liveJobsSlice from "./slices/liveJob.slice";
import forumSlice from "./slices/forum.slice";
import financeSlice from "./slices/finance.slice";
import draftServiceSlice from "./slices/draftService.slice";
import filteringStore from "./slices/filtering.slice";
import stepSlice from "./slices/step.slice";
import { MediaService } from "./services/media.service";
import { SellerProfileApiService } from "./services/seller-service/profile-namage";
import { ChatUserApiService } from "./services/chat-service/chat-user-service";
import chatSlice from "./slices/chat.slice";
import viewState from "./slices/view-control.slice";
import supportSlice from "./slices/support.slice";
import notificationSlice from "./slices/notification.slice";
import { publicProductService } from "./services/home-service/public-product.service";
import { SellerServiceApiService } from "./services/seller-service/service.service";
import { publicServiceApi } from "./services/home-service/public-service.service";
import { SearchApiService } from "./services/search-service/search.service";
import { TaxInfoApiService } from "./services/seller-service/tax-info.service";
// import { UserJobsApiService } from "./services/user-service/jobs.service";
import { UserSkillsApiService } from "./services/user-service/skills.service";
import { UserJobsApiService } from "./services/user-service/jobs.service";
import { publicJobServiceApi } from "./services/home-service/public-job.service";
import { publicSubscriptionApi } from "./services/subscription-service/public-api.service";
import { CheckoutApiService } from "./services/checkout-service/checkout.service";
import { ProductCartApiService } from "./services/checkout-service/product-cart.service";
// import { CheckoutApiService } from "./services/checkout-service/checkout.service";
import { userProfileApi } from "./services/home-service/public-user.service";
import { logoutAndClear } from "./middleware/logoutAndClear";
import { ProductOrderApiService } from "./services/user-service/product-order.service";
import { PurchaseItemsApiService } from "./services/user-service/purchase-items.service";
import { FinanceApiService } from "./services/seller-service/finance.service";
import { LoggedUserApiService } from "./services/home-service/loggedUser.service";
import { blogApiService } from "./services/home-service/public-blog.service";
import { userSupportApiService } from "./services/support-service/user-support.service";
import { UserRefundApiService } from "./services/user-service/refund.service";
import { SellerRefundApiService } from "./services/seller-service/refund.service";
import { SupportApiService } from "./services/support-service/support.service";
import { PublicReviewsApiService } from "./services/reviews/public-reviews.service";
import { ReviewsApiService } from "./services/reviews/reviews.service";
import { SellerLoginActivityService } from "./services/seller-service/login-activity.service";
import { ServiceOrderApiService } from "./services/user-service/service-order.service";
import { FavoriteApiService } from "./services/favorites/favorite.service";
import { ProductWithTokenService } from "./public-token/product.service";
import { ServiceWithTokenService } from "./public-token/service.service";
import { ShareService } from "./public-token/share.service";
import { SellerServiceOrderApiService } from "./services/seller-service/service-order.service";
import { ForumApiService } from "./services/forum/forum.service";
import { BlogApiService } from "./services/blog/blog.service";
import { QueriesApiService } from "./services/queries/queries.service";
import { NotificationApiService } from "./services/notifications/notification.service";
import { DashboardApiService } from "./services/seller-service/dashboard.service";
import { EventApiService } from "./services/event/event.service";
import { ChatCustomOrderApi } from "./services/chat-service/chat-custom-order.service";
import { PayApiService } from "./services/pay/pay.service";
import { ServiceApiService } from "./services/services/service.service";
import { UserBecomeSellerService } from "./services/user-service/become-seller.service";
import { ChatPixiService } from "./services/chat-service/chat-pixi.service";

export const store = configureStore({
  reducer: {
    [HomeApiService.reducerPath]: HomeApiService.reducer,
    [AuthApiService.reducerPath]: AuthApiService.reducer,
    [UserApiService.reducerPath]: UserApiService.reducer,
    [JobListApiService.reducerPath]: JobListApiService.reducer,
    [SellerCategoryApiService.reducerPath]: SellerCategoryApiService.reducer,
    [SellerProductApiService.reducerPath]: SellerProductApiService.reducer,
    [MediaService.reducerPath]: MediaService.reducer,
    [SellerProfileApiService.reducerPath]: SellerProfileApiService.reducer,
    [ChatUserApiService.reducerPath]: ChatUserApiService.reducer,
    [publicProductService.reducerPath]: publicProductService.reducer,
    [SellerServiceApiService.reducerPath]: SellerServiceApiService.reducer,
    [publicServiceApi.reducerPath]: publicServiceApi.reducer,
    [SearchApiService.reducerPath]: SearchApiService.reducer,
    [TaxInfoApiService.reducerPath]: TaxInfoApiService.reducer,
    [UserSkillsApiService.reducerPath]: UserSkillsApiService.reducer,
    [UserJobsApiService.reducerPath]: UserJobsApiService.reducer,
    [publicJobServiceApi.reducerPath]: publicJobServiceApi.reducer,
    [publicSubscriptionApi.reducerPath]: publicSubscriptionApi.reducer,
    [CheckoutApiService.reducerPath]: CheckoutApiService.reducer,
    [ProductCartApiService.reducerPath]: ProductCartApiService.reducer,
    [userProfileApi.reducerPath]: userProfileApi.reducer,
    [ProductOrderApiService.reducerPath]: ProductOrderApiService.reducer,
    [PurchaseItemsApiService.reducerPath]: PurchaseItemsApiService.reducer,
    [FinanceApiService.reducerPath]: FinanceApiService.reducer,
    [LoggedUserApiService.reducerPath]: LoggedUserApiService.reducer,
    [blogApiService.reducerPath]: blogApiService.reducer,
    [userSupportApiService.reducerPath]: userSupportApiService.reducer,
    [UserRefundApiService.reducerPath]: UserRefundApiService.reducer,
    [SellerRefundApiService.reducerPath]: SellerRefundApiService.reducer,
    [SupportApiService.reducerPath]: SupportApiService.reducer,
    [PublicReviewsApiService.reducerPath]: PublicReviewsApiService.reducer,
    [ReviewsApiService.reducerPath]: ReviewsApiService.reducer,
    [SellerLoginActivityService.reducerPath]:
      SellerLoginActivityService.reducer,
    [ServiceOrderApiService.reducerPath]: ServiceOrderApiService.reducer,
    [FavoriteApiService.reducerPath]: FavoriteApiService.reducer,
    [ProductWithTokenService.reducerPath]: ProductWithTokenService.reducer,
    [ServiceWithTokenService.reducerPath]: ServiceWithTokenService.reducer,
    [ShareService.reducerPath]: ShareService.reducer,
    [SellerServiceOrderApiService.reducerPath]:
      SellerServiceOrderApiService.reducer,
    [ForumApiService.reducerPath]: ForumApiService.reducer,
    [BlogApiService.reducerPath]: BlogApiService.reducer,
    [QueriesApiService.reducerPath]: QueriesApiService.reducer,
    [NotificationApiService.reducerPath]: NotificationApiService.reducer,
    [DashboardApiService.reducerPath]: DashboardApiService.reducer,
    [EventApiService.reducerPath]: EventApiService.reducer,
    [ChatCustomOrderApi.reducerPath]: ChatCustomOrderApi.reducer,
    [PayApiService.reducerPath]: PayApiService.reducer,
    [ServiceApiService.reducerPath]: ServiceApiService.reducer,
    [UserBecomeSellerService.reducerPath]: UserBecomeSellerService.reducer,
    [ChatPixiService.reducerPath]: ChatPixiService.reducer,

    auth: authSlice,
    jobStore: jobSlice,
    draftProductStore: draftProductSlice,
    draftServiceStore: draftServiceSlice,
    stepStore: stepSlice,
    chatStore: chatSlice,
    viewStore: viewState,
    checkoutStore: checkoutStoreSlice,
    productCartStore: productCartSlice,
    filteringStore: filteringStore,
    financeStore: financeSlice,
    liveJobsStore: liveJobsSlice,
    forums: forumSlice,
    support: supportSlice,
    notificationStore: notificationSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      HomeApiService.middleware,
      AuthApiService.middleware,
      UserApiService.middleware,
      JobListApiService.middleware,
      SellerCategoryApiService.middleware,
      SellerProductApiService.middleware,
      MediaService.middleware,
      SellerProfileApiService.middleware,
      ChatUserApiService.middleware,
      publicProductService.middleware,
      SellerServiceApiService.middleware,
      publicServiceApi.middleware,
      SearchApiService.middleware,
      TaxInfoApiService.middleware,
      UserSkillsApiService.middleware,
      UserJobsApiService.middleware,
      publicJobServiceApi.middleware,
      publicSubscriptionApi.middleware,
      CheckoutApiService.middleware,
      ProductCartApiService.middleware,
      userProfileApi.middleware,
      ProductOrderApiService.middleware,
      PurchaseItemsApiService.middleware,
      FinanceApiService.middleware,
      LoggedUserApiService.middleware,
      blogApiService.middleware,
      userSupportApiService.middleware,
      UserRefundApiService.middleware,
      SellerRefundApiService.middleware,
      SupportApiService.middleware,
      PublicReviewsApiService.middleware,
      ReviewsApiService.middleware,
      SellerLoginActivityService.middleware,
      ServiceOrderApiService.middleware,
      FavoriteApiService.middleware,
      ProductWithTokenService.middleware,
      ServiceWithTokenService.middleware,
      ShareService.middleware,
      SellerServiceOrderApiService.middleware,
      ForumApiService.middleware,
      BlogApiService.middleware,
      QueriesApiService.middleware,
      NotificationApiService.middleware,
      DashboardApiService.middleware,
      EventApiService.middleware,
      ChatCustomOrderApi.middleware,
      PayApiService.middleware,
      ServiceApiService.middleware,
      UserBecomeSellerService.middleware,
      ChatPixiService.middleware
      // logoutAndClear,
      // authApi.middleware,
    ), // Add API middleware
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>; // Type for the entire state
export type AppDispatch = typeof store.dispatch; // Type for dispatch

export default store;
