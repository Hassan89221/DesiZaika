'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  FolderTree,
  Users,
  Plus,
  Trash2,
  Edit,
  Upload,
  CheckCircle2,
  Clock,
  Euro,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Search,
  MapPin,
  Flame,
  Check,
  Phone,
  Mail,
  Truck,
  Store,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VegIndicator } from '@/components/menu/dietary-badges';

export default function AdminPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats state
  const [stats, setStats] = useState({ todayOrderCount: 0, todayRevenue: 0, pendingOrderCount: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Menu items state
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Form states for menu item modal
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    image_url: '',
    is_veg: false,
    spice_level: '0',
    is_available: true,
    allergens: [] as string[],
    allergen_high_risk: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state for category modal
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', sort_order: '0' });

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetch('/api/admin/dashboard-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const url = orderStatusFilter !== 'all' 
        ? `/api/admin/orders?status=${orderStatusFilter}`
        : '/api/admin/orders';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [orderStatusFilter]);

  // Fetch Menu Items and Categories
  const fetchMenuData = useCallback(async () => {
    try {
      setMenuLoading(true);
      const [itemsRes, catsRes] = await Promise.all([
        fetch('/api/admin/menu-items'),
        fetch('/api/admin/categories'),
      ]);
      if (itemsRes.ok && catsRes.ok) {
        const itemsData = await itemsRes.json();
        const catsData = await catsRes.json();
        setMenuItems(itemsData.items || []);
        setCategories(catsData.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch menu data:', err);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && ['owner', 'manager'].includes(user.role)) {
      fetchStats();
      fetchOrders();
      fetchMenuData();
    }
  }, [user, fetchStats, fetchOrders, fetchMenuData]);

  // Refresh All Data
  const refreshAllData = () => {
    fetchStats();
    fetchOrders();
    fetchMenuData();
    toast.success('Dashboard refreshed');
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Order #${orderId.substring(0, 8).toUpperCase()} updated to '${newStatus}'`);
        fetchOrders();
        fetchStats();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating order status');
    }
  };

  // Upload Menu Item Image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'menu-images');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setItemForm((prev) => ({ ...prev, image_url: data.url }));
        toast.success('Image uploaded to Supabase storage');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error uploading file');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Menu Item
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...itemForm,
      price: parseFloat(itemForm.price),
      spice_level: parseInt(itemForm.spice_level, 10),
    };

    try {
      const url = editingItem ? `/api/admin/menu-items/${editingItem.id}` : '/api/admin/menu-items';
      const method = editingItem ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingItem ? 'Menu item updated' : 'Menu item created');
        setItemDialogOpen(false);
        setEditingItem(null);
        fetchMenuData();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Operation failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving menu item');
    }
  };

  // Toggle Availability
  const handleToggleAvailability = async (item: any) => {
    try {
      const res = await fetch(`/api/admin/menu-items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !item.is_available }),
      });
      if (res.ok) {
        toast.success(`"${item.name}" is now ${!item.is_available ? 'In Stock' : 'Sold Out'}`);
        fetchMenuData();
      }
    } catch (err) {
      toast.error('Failed to toggle availability');
    }
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      const res = await fetch(`/api/admin/menu-items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Menu item deleted');
        fetchMenuData();
      }
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: categoryForm.name,
      sort_order: parseInt(categoryForm.sort_order, 10) || 0,
    };

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
      const method = editingCategory ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingCategory ? 'Category updated' : 'Category created');
        setCategoryDialogOpen(false);
        setEditingCategory(null);
        fetchMenuData();
      }
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Category deleted');
        fetchMenuData();
      }
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20"><Clock className="h-3 w-3 animate-pulse" /> Received</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 border border-sky-500/20"><CheckCircle2 className="h-3 w-3" /> Confirmed</span>;
      case 'preparing':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20"><Flame className="h-3 w-3 animate-bounce" /> Preparing</span>;
      case 'ready':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20"><UtensilsCrossed className="h-3 w-3" /> Ready</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><Check className="h-3 w-3" /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20"><AlertCircle className="h-3 w-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{status}</span>;
    }
  };

  // Auth gate
  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !['owner', 'manager'].includes(user.role)) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h1 className="font-display text-2xl font-bold">Access Restricted</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          You must be logged in as an Owner or Manager to access the Admin Dashboard.
        </p>
        <Button onClick={openAuthModal} className="mt-6">
          Log In as Admin
        </Button>
      </div>
    );
  }

  // Filtered lists
  const filteredOrders = orders.filter((o) => {
    if (!orderSearchQuery) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_phone?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q)
    );
  });

  const filteredMenuItems = menuItems.filter((i) => {
    if (!menuSearchQuery) return true;
    const q = menuSearchQuery.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q);
  });

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Dynamic Ambient Background Blur Lights & Patterns */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute top-1/2 right-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />
      </div>

      {/* Dashboard Top Header Bar */}
      <div className="relative z-10 border-b border-border/80 bg-card/70 backdrop-blur-xl sticky top-0 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-amber-500/20 text-primary border border-primary/30 shadow-md">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-extrabold tracking-tight">DesiZaika Dashboard</h1>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Live Operations
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> 30 Crumlin Rd, Dublin, D12 HXW0
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={refreshAllData} className="gap-1.5 rounded-xl border-border bg-card/50 shadow-sm hover:bg-muted">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh Live Data
              </Button>
              <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs backdrop-blur-md">
                <UserCheck className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <span className="font-bold block leading-none text-foreground">{user.name || user.email}</span>
                  <span className="text-[10px] text-primary uppercase font-extrabold tracking-wider">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 sm:inline-flex sm:w-auto p-1.5 bg-card/80 border border-border/80 rounded-2xl gap-1.5 shadow-sm backdrop-blur-md">
            <TabsTrigger value="overview" className="rounded-xl gap-2 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl gap-2 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all relative">
              <ShoppingBag className="h-4 w-4" /> Orders
              {stats.pendingOrderCount > 0 && (
                <span className="ml-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.2 animate-pulse shadow-sm">
                  {stats.pendingOrderCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="menu" className="rounded-xl gap-2 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
              <UtensilsCrossed className="h-4 w-4" /> Menu Items
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-xl gap-2 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
              <FolderTree className="h-4 w-4" /> Categories
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Today's Revenue Card */}
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/40 group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Today&apos;s Revenue</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-md transition-transform group-hover:scale-110">
                    <Euro className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">€{stats.todayRevenue.toFixed(2)}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <TrendingUp className="h-3 w-3" /> Live
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground font-medium">Total settled sales today in Dublin</p>
              </div>

              {/* Total Orders Today */}
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary/40 group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-amber-500" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Orders Today</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/30 shadow-md transition-transform group-hover:scale-110">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">{stats.todayOrderCount}</span>
                  <span className="text-xs font-bold text-muted-foreground">orders total</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground font-medium">Incoming pickup &amp; delivery orders</p>
              </div>

              {/* Pending Action Orders */}
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-amber-500/40 group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Kitchen Action Needed</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-md transition-transform group-hover:scale-110">
                    <Clock className="h-5 w-5 animate-pulse" />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight text-amber-600 dark:text-amber-400">{stats.pendingOrderCount}</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Pending
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground font-medium">Received or currently preparing</p>
              </div>
            </div>

            {/* Recent Incoming Orders Glass Card */}
            <div className="rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-extrabold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Live Orders Queue
                  </h2>
                  <p className="text-xs text-muted-foreground pt-0.5">Latest live orders requiring Kitchen &amp; Status updates</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')} className="rounded-xl border-border bg-card/50">
                  View All Orders
                </Button>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground font-medium">
                  No orders recorded yet today.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-border/80 bg-background/50">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase text-muted-foreground">
                      <tr>
                        <th className="p-4">Ref</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-4 font-mono font-extrabold text-primary">#{order.id.substring(0, 8).toUpperCase()}</td>
                          <td className="p-4">
                            <div className="font-bold">{order.customer_name}</div>
                            <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                          </td>
                          <td className="p-4 capitalize font-semibold">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs text-primary border border-primary/20">
                              {order.order_type === 'delivery' ? <Truck className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
                              {order.order_type}
                            </span>
                          </td>
                          <td className="p-4 font-black text-base">€{Number(order.total_price).toFixed(2)}</td>
                          <td className="p-4">{getStatusBadge(order.status)}</td>
                          <td className="p-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs font-bold focus:ring-2 focus:ring-primary shadow-sm"
                            >
                              {['received', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((s) => (
                                <option key={s} value={s}>
                                  Set: {s}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-extrabold">All Orders Management</h2>
                <p className="text-xs text-muted-foreground">Filter, inspect items, and update order fulfillment</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search order ID, name..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="h-10 w-64 pl-9 text-xs rounded-xl bg-card/60"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-card/60 px-3 text-xs font-bold focus:ring-2 focus:ring-primary shadow-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="received">Received</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-12 text-center text-muted-foreground font-medium">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 shadow-xl space-y-4 hover:border-primary/40 transition-all">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xl font-black text-primary">#{order.id.substring(0, 8).toUpperCase()}</span>
                          {getStatusBadge(order.status)}
                          <span className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-extrabold capitalize flex items-center gap-1.5 text-primary">
                            {order.order_type === 'delivery' ? <Truck className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
                            {order.order_type}
                          </span>
                        </div>

                        <div className="pt-1 flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                          <span className="flex items-center gap-1 text-foreground"><Users className="h-3.5 w-3.5 text-primary" /> {order.customer_name}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-primary" /> {order.customer_phone}</span>
                          <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-primary" /> {order.customer_email}</span>
                        </div>

                        {order.customer_address && (
                          <p className="text-xs text-muted-foreground font-medium pt-0.5 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" /> {order.customer_address}
                          </p>
                        )}

                        {order.notes && (
                          <div className="mt-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300 font-medium">
                            <strong className="font-bold">Note / Payment:</strong> {order.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-3">
                        <span className="text-3xl font-black text-primary">€{Number(order.total_price).toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-bold">Update Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-bold focus:ring-2 focus:ring-primary shadow-sm"
                          >
                            {['received', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((s) => (
                              <option key={s} value={s}>
                                {s.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Order items expansion */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="border-t border-border/80 pt-4">
                        <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Ordered Items ({order.order_items.length})</p>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                          {order.order_items.map((oi: any) => (
                            <div key={oi.id} className="flex justify-between items-center rounded-2xl bg-muted/40 p-3 text-xs border border-border/60 shadow-sm">
                              <span className="font-bold">{oi.quantity} × {oi.item_name}</span>
                              <span className="font-extrabold text-primary">€{Number(oi.line_total).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* MENU ITEMS TAB */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Menu Items Catalog</h2>
                <p className="text-xs text-muted-foreground">Add new dishes, upload photos to Supabase Storage, update prices or toggle stock</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search dishes..."
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    className="h-10 w-56 pl-9 text-xs rounded-xl bg-card/60"
                  />
                </div>

                <Button onClick={() => {
                  setEditingItem(null);
                  setItemForm({
                    name: '',
                    category_id: categories[0]?.id || '',
                    description: '',
                    price: '',
                    image_url: '',
                    is_veg: false,
                    spice_level: '0',
                    is_available: true,
                    allergens: [],
                    allergen_high_risk: false,
                  });
                  setItemDialogOpen(true);
                }} size="sm" className="btn-shimmer rounded-xl gap-1.5 font-bold shadow-md">
                  <Plus className="h-4 w-4" /> Add New Dish
                </Button>
              </div>
            </div>

            {menuLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase text-muted-foreground">
                    <tr>
                      <th className="p-4">Photo</th>
                      <th className="p-4">Dish Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-sm">
                            {item.image_url && item.image_url.startsWith('http') ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground font-bold">No Photo</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <VegIndicator isVeg={item.is_veg} />
                            <span className="font-bold text-base">{item.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs pt-0.5">{item.description}</p>
                        </td>
                        <td className="p-4 font-semibold text-muted-foreground">{item.category?.name || 'Uncategorized'}</td>
                        <td className="p-4 font-black text-primary text-lg">€{Number(item.price).toFixed(2)}</td>
                        <td className="p-4">
                          <Button
                            variant={item.is_available ? 'outline' : 'secondary'}
                            size="sm"
                            className={cn(
                              'h-8 text-xs font-extrabold rounded-full px-3.5 shadow-sm',
                              item.is_available ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/40'
                            )}
                            onClick={() => handleToggleAvailability(item)}
                          >
                            {item.is_available ? '✓ In Stock' : 'Sold Out'}
                          </Button>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl"
                            onClick={() => {
                              setEditingItem(item);
                              setItemForm({
                                name: item.name,
                                category_id: item.category_id || '',
                                description: item.description || '',
                                price: item.price.toString(),
                                image_url: item.image_url || '',
                                is_veg: item.is_veg,
                                spice_level: item.spice_level.toString(),
                                is_available: item.is_available,
                                allergens: item.allergens || [],
                                allergen_high_risk: item.allergen_high_risk || false,
                              });
                              setItemDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => handleDeleteMenuItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* CATEGORIES TAB */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Categories Catalog</h2>
                <p className="text-xs text-muted-foreground">Manage category sorting and menu section titles</p>
              </div>

              <Button onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', sort_order: '0' });
                setCategoryDialogOpen(true);
              }} size="sm" className="rounded-xl gap-1.5 font-bold shadow-md">
                <Plus className="h-4 w-4" /> Add Category
              </Button>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-xl">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase text-muted-foreground">
                  <tr>
                    <th className="p-4">Sort Order</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono font-black text-primary text-base">{cat.sort_order}</td>
                      <td className="p-4 font-extrabold text-base">{cat.name}</td>
                      <td className="p-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl"
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryForm({ name: cat.name, sort_order: cat.sort_order.toString() });
                            setCategoryDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => handleDeleteCategory(cat.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* DIALOG: Add / Edit Menu Item */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px] border-border/80 bg-card/95 backdrop-blur-2xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 bg-gradient-to-r from-primary/10 via-amber-500/5 to-transparent border-b border-border/80">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="font-display text-xl font-bold">
                    {editingItem ? 'Edit Dish Details' : 'Create New Menu Item'}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground pt-0.5">
                    {editingItem ? 'Update pricing, availability or photo' : 'Add a new dish to the live customer menu'}
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>

          <form onSubmit={handleSaveMenuItem} className="p-6 space-y-5">
            {/* Dish Name */}
            <div>
              <Label htmlFor="item-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Dish Name *
              </Label>
              <Input
                id="item-name"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                placeholder="e.g. Special Chicken Karahi"
                className="mt-1 rounded-xl bg-background/50 font-medium"
                required
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="item-category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category *
                </Label>
                <select
                  id="item-category"
                  value={itemForm.category_id}
                  onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary shadow-sm"
                  required
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="item-price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Price (€ EUR) *
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-primary">€</span>
                  <Input
                    id="item-price"
                    type="number"
                    step="0.01"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    placeholder="14.50"
                    className="pl-8 rounded-xl bg-background/50 font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="item-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </Label>
              <textarea
                id="item-desc"
                rows={3}
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Traditional wok-cooked dish with fresh garlic, ginger, green chilies, and special spices..."
                className="mt-1 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Photo Upload & Preview Container */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Dish Photo (Supabase Storage)
              </Label>
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border p-3.5 bg-muted/20">
                {itemForm.image_url && itemForm.image_url.startsWith('http') ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-border shadow-md flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={itemForm.image_url} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground flex-shrink-0">
                    <Upload className="h-6 w-6" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <Input 
                    id="item-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploadingImage}
                    className="text-xs rounded-lg file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-primary-foreground" 
                  />
                  {uploadingImage && <p className="text-xs text-amber-500 font-semibold flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Uploading to bucket...</p>}
                  {itemForm.image_url && !uploadingImage && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓ Storage photo connected</p>}
                </div>
              </div>
            </div>

            {/* Spice Level Selector */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Spice Level
              </Label>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {[
                  { level: '0', label: 'No Spice' },
                  { level: '1', label: 'Mild 🔥' },
                  { level: '2', label: 'Medium 🔥🔥' },
                  { level: '3', label: 'Hot 🔥🔥🔥' },
                ].map((s) => (
                  <button
                    key={s.level}
                    type="button"
                    onClick={() => setItemForm({ ...itemForm, spice_level: s.level })}
                    className={cn(
                      'rounded-xl border p-2 text-xs font-bold transition-all',
                      itemForm.spice_level === s.level
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border bg-background/50 hover:bg-muted/50 text-muted-foreground'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status & Options Switches */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-muted/30 p-3.5">
              <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={itemForm.is_veg}
                  onChange={(e) => setItemForm({ ...itemForm, is_veg: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
                <span className="flex items-center gap-1.5">
                  <VegIndicator isVeg={true} /> Vegetarian Dish
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={itemForm.is_available}
                  onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
                <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-extrabold', itemForm.is_available ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400')}>
                  {itemForm.is_available ? 'In Stock' : 'Sold Out'}
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <Button type="submit" size="lg" className="w-full btn-shimmer font-bold rounded-xl text-base shadow-md">
              {editingItem ? 'Save Changes' : 'Create Menu Dish'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Add / Edit Category */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-border/80 bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="cat-name">Category Name</Label>
              <Input
                id="cat-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g. Starters"
                required
              />
            </div>

            <div>
              <Label htmlFor="cat-sort">Sort Order (Number)</Label>
              <Input
                id="cat-sort"
                type="number"
                value={categoryForm.sort_order}
                onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full font-semibold">
              {editingCategory ? 'Save Category' : 'Create Category'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
