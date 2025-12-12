// CONTRACT: All types match PMC API shapes exactly
// MIGRATION: Centralized type definitions for API layer

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'seller' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  session: AuthSession;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface SignupResponse {
  message: string;
  userId: string;
  requiresOTP: boolean;
}

export interface OTPVerifyRequest {
  userId: string;
  code: string;
}

export interface OTPVerifyResponse {
  session: AuthSession;
}

export interface OTPResendRequest {
  userId: string;
}

export interface OTPResendResponse {
  message: string;
  expiresAt: string;
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordRecoveryResponse {
  message: string;
}

export interface PasswordResetRequest {
  token: string;
  password: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  session: AuthSession;
}

// ============================================
// Product Types
// ============================================

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  categoryId: string;
  images: string[];
  thumbnail: string;
  stock: number;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  images: string[];
  stock: number;
  tags?: string[];
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string;
}

// ============================================
// Service Types
// ============================================

export interface Service {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  priceType: 'fixed' | 'hourly' | 'project';
  category: Category;
  categoryId: string;
  images: string[];
  thumbnail: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  rating: number;
  reviewCount: number;
  deliveryTime: number; // in days
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceListResponse {
  services: Service[];
  pagination: Pagination;
}

// ============================================
// Job Types
// ============================================

export interface Job {
  id: string;
  posterId: string;
  title: string;
  description: string;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  currency: string;
  category: Category;
  categoryId: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  skills: string[];
  deadline?: string;
  applicantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  jobs: Job[];
  pagination: Pagination;
}

// ============================================
// Category Types
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  productCount: number;
  serviceCount: number;
  jobCount: number;
  children?: Category[];
}

export interface CategoryListResponse {
  categories: Category[];
}

// ============================================
// Order Types
// ============================================

export interface Order {
  id: string;
  userId: string;
  sellerId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface OrderCreateRequest {
  items: { productId: string; quantity: number }[];
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: string;
}

// ============================================
// Cart Types
// ============================================

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface CartAddRequest {
  productId: string;
  quantity: number;
}

export interface CartUpdateRequest {
  itemId: string;
  quantity: number;
}

export interface CartRemoveRequest {
  itemId: string;
}

// ============================================
// Address Types
// ============================================

export interface Address {
  id: string;
  userId: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface AddressListResponse {
  addresses: Address[];
}

// ============================================
// Forum & Discussion Types
// ============================================

export interface ForumTopic {
  id: string;
  title: string;
  slug: string;
  description?: string;
  postCount: number;
  lastPostAt?: string;
}

export interface ForumTopicListResponse {
  topics: ForumTopic[];
}

export interface ForumPost {
  id: string;
  topicId: string;
  topic: ForumTopic;
  authorId: string;
  author: User;
  title: string;
  content: string;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPostListResponse {
  posts: ForumPost[];
  pagination: Pagination;
}

export interface ForumPostCreateRequest {
  topicId: string;
  title: string;
  content: string;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReplyListResponse {
  replies: ForumReply[];
  pagination: Pagination;
}

export interface Discussion {
  id: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  category: string;
  tags: string[];
  replyCount: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionListResponse {
  discussions: Discussion[];
  pagination: Pagination;
}

// ============================================
// Support Types
// ============================================

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  sender: User;
  content: string;
  attachments?: string[];
  createdAt: string;
}

export interface SupportTicketListResponse {
  tickets: SupportTicket[];
  pagination: Pagination;
}

export interface SupportTicketCreateRequest {
  subject: string;
  description: string;
  category: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SupportMessageCreateRequest {
  ticketId: string;
  content: string;
  attachments?: string[];
}

// ============================================
// Seller Types
// ============================================

export interface SellerProfile {
  id: string;
  userId: string;
  user: User;
  businessName: string;
  description: string;
  logo?: string;
  banner?: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  serviceCount: number;
  orderCount: number;
  status: 'active' | 'suspended' | 'pending';
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerApplication {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface SellerApplicationRequest {
  businessName: string;
  businessType: string;
  description: string;
  documents: string[];
}

export interface SellerAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalViews: number;
  periodRevenue: number;
  periodOrders: number;
  revenueByDay: { date: string; amount: number }[];
  ordersByDay: { date: string; count: number }[];
  topProducts: { product: Product; revenue: number; orders: number }[];
}

export interface SellerDashboardStats {
  pendingOrders: number;
  activeProducts: number;
  lowStockProducts: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentReviews: Review[];
}

// ============================================
// Review Types
// ============================================

export interface Review {
  id: string;
  userId: string;
  user: User;
  productId?: string;
  product?: Product;
  serviceId?: string;
  service?: Service;
  sellerId: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  pagination: Pagination;
}

// ============================================
// Search Types
// ============================================

export interface SearchRequest {
  query: string;
  type?: 'products' | 'services' | 'jobs' | 'all';
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  products?: Product[];
  services?: Service[];
  jobs?: Job[];
  pagination: Pagination;
  totalResults: number;
}

// ============================================
// Pagination Types
// ============================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
}

// ============================================
// Error Types
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================
// Common Response Types
// ============================================

export interface SuccessResponse {
  message: string;
}

export interface DeleteResponse {
  message: string;
  id: string;
}
