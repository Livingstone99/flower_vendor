/**
 * Dummy data for super admin dashboard
 */

export interface SystemMetrics {
  users: {
    total: number;
    by_role: {
      customer?: number;
      admin?: number;
      super_admin?: number;
    };
    growth_this_month: number;
  };
  orders: {
    total: number;
    total_revenue_cents: number;
    this_month: number;
    this_month_revenue_cents: number;
    by_status: {
      placed?: number;
      pending_payment?: number;
      confirmed?: number;
      cancelled?: number;
    };
  };
  products: {
    total: number;
    active: number;
    low_stock: number;
  };
  nurseries: {
    total: number;
    active: number;
  };
  revenue: {
    today_cents: number;
    this_week_cents: number;
    this_month_cents: number;
    growth_percentage: number;
  };
  recent_activity: {
    orders: Array<{
      id: number;
      status: string;
      total_cents: number;
      created_at: string;
      customer_name?: string;
    }>;
  };
  top_products: Array<{
    id: number;
    name: string;
    sales_count: number;
    revenue_cents: number;
  }>;
}

export interface UserDetail {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
  status: "active" | "inactive" | "suspended";
  last_login?: string;
  orders_count: number;
  total_spend_cents: number;
}

export interface AnalyticsData {
  revenue_history: Array<{ date: string; value: number }>;
  user_growth: Array<{ date: string; value: number }>;
  order_distribution: Array<{ name: string; value: number }>;
}

export interface SystemSettings {
  site_name: string;
  maintenance_mode: boolean;
  default_currency: string;
  email_notifications: boolean;
  order_auto_confirmation: boolean;
}

// Dummy system metrics
export const dummySystemMetrics: SystemMetrics = {
  users: {
    total: 156,
    by_role: {
      customer: 142,
      admin: 12,
      super_admin: 2,
    },
    growth_this_month: 12,
  },
  orders: {
    total: 342,
    total_revenue_cents: 45678900,
    this_month: 48,
    this_month_revenue_cents: 6789000,
    by_status: {
      placed: 15,
      pending_payment: 8,
      confirmed: 320,
      cancelled: 5,
    },
  },
  products: {
    total: 45,
    active: 42,
    low_stock: 7,
  },
  nurseries: {
    total: 3,
    active: 3,
  },
  revenue: {
    today_cents: 125000,
    this_week_cents: 890000,
    this_month_cents: 6789000,
    growth_percentage: 15.5,
  },
  recent_activity: {
    orders: [
      {
        id: 6,
        status: "placed",
        total_cents: 9288,
        created_at: "2024-01-20T08:20:00Z",
        customer_name: "Diana Prince",
      },
      {
        id: 5,
        status: "pending_payment",
        total_cents: 4319,
        created_at: "2024-01-19T16:30:00Z",
        customer_name: "Charlie Brown",
      },
      {
        id: 4,
        status: "confirmed",
        total_cents: 14848,
        created_at: "2024-01-18T11:45:00Z",
        customer_name: "Alice Williams",
      },
    ],
  },
  top_products: [
    {
      id: 1,
      name: "Peace Lily",
      sales_count: 45,
      revenue_cents: 134955,
    },
    {
      id: 5,
      name: "Red Rose Bouquet",
      sales_count: 32,
      revenue_cents: 191968,
    },
    {
      id: 6,
      name: "Snake Plant",
      sales_count: 28,
      revenue_cents: 69972,
    },
  ],
};

// Dummy users
export const dummyUsers: UserDetail[] = [
  {
    id: 1,
    email: "admin@greenthumb.com",
    name: "Admin User",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
    status: "active",
    last_login: "2024-01-20T10:00:00Z",
    orders_count: 0,
    total_spend_cents: 0,
  },
  {
    id: 2,
    email: "superadmin@greenthumb.com",
    name: "Super Admin",
    role: "super_admin",
    created_at: "2024-01-01T00:00:00Z",
    status: "active",
    last_login: "2024-01-21T09:00:00Z",
    orders_count: 0,
    total_spend_cents: 0,
  },
  {
    id: 3,
    email: "john.doe@example.com",
    name: "John Doe",
    role: "customer",
    created_at: "2024-01-05T10:00:00Z",
    status: "active",
    last_login: "2024-01-15T14:30:00Z",
    orders_count: 5,
    total_spend_cents: 25000,
  },
  {
    id: 4,
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: "customer",
    created_at: "2024-01-06T14:30:00Z",
    status: "inactive",
    last_login: "2024-01-10T09:15:00Z",
    orders_count: 2,
    total_spend_cents: 12000,
  },
  {
    id: 5,
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    role: "customer",
    created_at: "2024-01-07T09:15:00Z",
    status: "active",
    orders_count: 1,
    total_spend_cents: 5000,
  },
];

// Dummy Analytics Data
export const dummyAnalytics: AnalyticsData = {
  revenue_history: [
    { date: "Jan 1", value: 1200 },
    { date: "Jan 3", value: 1500 },
    { date: "Jan 5", value: 3500 },
    { date: "Jan 8", value: 2100 },
    { date: "Jan 10", value: 2800 },
    { date: "Jan 12", value: 3100 },
    { date: "Jan 15", value: 5000 },
    { date: "Jan 18", value: 4200 },
    { date: "Jan 20", value: 4500 },
    { date: "Jan 22", value: 5100 },
    { date: "Jan 25", value: 6800 },
    { date: "Jan 28", value: 6400 },
    { date: "Jan 30", value: 7200 },
  ],
  user_growth: [
    { date: "Jan 1", value: 100 },
    { date: "Jan 4", value: 105 },
    { date: "Jan 8", value: 115 },
    { date: "Jan 12", value: 122 },
    { date: "Jan 15", value: 132 },
    { date: "Jan 19", value: 141 },
    { date: "Jan 22", value: 148 },
    { date: "Jan 26", value: 152 },
    { date: "Jan 29", value: 156 },
  ],
  order_distribution: [
    { name: "Confirmed", value: 320 },
    { name: "Placed", value: 15 },
    { name: "Pending", value: 8 },
    { name: "Cancelled", value: 5 },
  ],
};

export const defaultSettings: SystemSettings = {
  site_name: "GreenThumb Store",
  maintenance_mode: false,
  default_currency: "USD",
  email_notifications: true,
  order_auto_confirmation: false,
};

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  await delay(300);
  return { ...dummySystemMetrics };
};

export const getAllUsers = async (skip?: number, limit?: number): Promise<UserDetail[]> => {
  await delay(300);
  let users = [...dummyUsers];
  if (skip !== undefined) {
    users = users.slice(skip);
  }
  if (limit !== undefined) {
    users = users.slice(0, limit);
  }
  return users;
};

export const getUserById = async (userId: number): Promise<UserDetail | null> => {
  await delay(200);
  return dummyUsers.find((u) => u.id === Number(userId)) || null;
};

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  await delay(400);
  return dummyAnalytics;
};

export const getSystemSettings = async (): Promise<SystemSettings> => {
  await delay(200);
  return defaultSettings;
};

export const updateSystemSettings = async (settings: SystemSettings): Promise<SystemSettings> => {
  await delay(300);
  return settings;
};


