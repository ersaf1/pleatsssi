'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  ShoppingBag,
  Search,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Truck,
  DollarSign,
  PackageCheck,
  MapPin,
  Clock,
  Send,
  Eye,
} from 'lucide-react';
import {
  getAdminOrders,
  updateOrderFulfillment,
  type AdminOrder,
} from '@/lib/services/orderService';
import { isSupabaseConfigured } from '@/lib/services/serviceUtils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminOrder['status']>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | AdminOrder['payment_status']>('all');
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Order Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [saving, setSaving] = useState(false);

  // Fulfillment Form State for selected order
  const [fulfillmentData, setFulfillmentData] = useState<{
    status: AdminOrder['status'];
    payment_status: AdminOrder['payment_status'];
    courier: string;
    tracking_number: string;
    notes: string;
  }>({
    status: 'pending',
    payment_status: 'pending',
    courier: '',
    tracking_number: '',
    notes: '',
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const isConfigured = isSupabaseConfigured();
      setIsLiveDb(isConfigured);
      const data = await getAdminOrders();
      setOrders(data);
    } catch {
      showNotification('error', 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenDetailModal = (order: AdminOrder) => {
    setSelectedOrder(order);
    setFulfillmentData({
      status: order.status,
      payment_status: order.payment_status,
      courier: order.courier || '',
      tracking_number: order.tracking_number || '',
      notes: order.notes || '',
    });
  };

  const handleSaveOrderChanges = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedOrder) return;

    setSaving(true);

    const payload = {
      status: fulfillmentData.status,
      payment_status: fulfillmentData.payment_status,
      courier: fulfillmentData.courier.trim() ? fulfillmentData.courier.trim() : null,
      tracking_number: fulfillmentData.tracking_number.trim() ? fulfillmentData.tracking_number.trim() : null,
      notes: fulfillmentData.notes.trim() ? fulfillmentData.notes.trim() : null,
    };

    const { data, error } = await updateOrderFulfillment(selectedOrder.id, payload);
    setSaving(false);

    if (error) {
      showNotification('error', error);
      return;
    }

    const updatedOrder = data || {
      ...selectedOrder,
      ...payload,
      updated_at: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)));
    setSelectedOrder(updatedOrder);
    showNotification('success', `Order ${selectedOrder.order_number} updated successfully!`);
  };

  const handleQuickShipWithResi = async () => {
    if (!selectedOrder) return;
    if (!fulfillmentData.tracking_number.trim()) {
      showNotification('error', 'Please enter a shipping tracking number (resi).');
      return;
    }

    const courier = fulfillmentData.courier.trim() || 'JNE Reguler';

    setFulfillmentData((prev) => ({
      ...prev,
      status: 'shipped',
      courier,
    }));

    setSaving(true);

    const payload = {
      status: 'shipped' as const,
      payment_status: fulfillmentData.payment_status,
      courier,
      tracking_number: fulfillmentData.tracking_number.trim(),
      notes: fulfillmentData.notes.trim() ? fulfillmentData.notes.trim() : `Shipped via ${courier} (${fulfillmentData.tracking_number.trim()})`,
    };

    const { data, error } = await updateOrderFulfillment(selectedOrder.id, payload);
    setSaving(false);

    if (error) {
      showNotification('error', error);
      return;
    }

    const updatedOrder = data || {
      ...selectedOrder,
      ...payload,
      updated_at: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)));
    setSelectedOrder(updatedOrder);
    showNotification('success', `Order ${selectedOrder.order_number} marked as Shipped!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeClass = (status: AdminOrder['status']) => {
    switch (status) {
      case 'completed':
      case 'shipped':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full';
      case 'pending':
      case 'processing':
        return 'bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold px-2.5 py-1 rounded-full';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full';
    }
  };

  const getPaymentStatusBadgeClass = (pStatus: AdminOrder['payment_status']) => {
    switch (pStatus) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full';
      case 'pending':
        return 'bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full';
      case 'failed':
      case 'expired':
      case 'refunded':
        return 'bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold px-2.5 py-1 rounded-full';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full';
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      order.order_number.toLowerCase().includes(q) ||
      (order.shipping_address?.recipient_name && order.shipping_address.recipient_name.toLowerCase().includes(q)) ||
      (order.shipping_address?.phone_number && order.shipping_address.phone_number.includes(q)) ||
      (order.tracking_number && order.tracking_number.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;

    return matchesQuery && matchesStatus && matchesPayment;
  });

  // Calculate Metrics
  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);
  const processingCount = orders.filter((o) => o.status === 'processing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-bold text-2xl sm:text-3xl text-[#0F172A]">
              Order Fulfillment & Management
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                isLiveDb
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {isLiveDb ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Live Database
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Static Fallback
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Track customer orders, verify Midtrans payments, update resi tracking numbers, and manage fulfillment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm font-semibold text-[#334155] bg-white border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Total Orders</span>
            <p className="font-bold text-2xl text-[#0F172A] mt-1">{totalOrdersCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B4F3A] border border-emerald-200/60 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Total Revenue</span>
            <p className="font-bold text-xl text-[#0B4F3A] mt-1">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Processing</span>
            <p className="font-bold text-2xl text-amber-700 mt-1">{processingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Shipped</span>
            <p className="font-bold text-2xl text-emerald-700 mt-1">{shippedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by order #, customer name, resi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-xl text-sm placeholder-[#94A3B8] text-[#0F172A] focus:ring-2 focus:ring-[#0B4F3A] bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Fulfillment Status Filter */}
          <div className="flex items-center space-x-1.5 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#E2E8F0]">
            <span className="font-bold text-[#475569] px-1 uppercase text-[10px]">Fulfillment:</span>
            {(['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#0B4F3A] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0B4F3A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center space-x-1.5 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#E2E8F0]">
            <span className="font-bold text-[#475569] px-1 uppercase text-[10px]">Payment:</span>
            {(['all', 'paid', 'pending', 'failed', 'refunded'] as const).map((pst) => (
              <button
                key={pst}
                onClick={() => setPaymentFilter(pst as AdminOrder['payment_status'] | 'all')}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                  paymentFilter === pst
                    ? 'bg-[#0B4F3A] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0B4F3A]'
                }`}
              >
                {pst}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#64748B]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B4F3A] mb-3" />
            <p className="text-sm font-medium">Loading customer orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#64748B]">
            <ShoppingBag className="w-12 h-12 mx-auto text-[#CBD5E1] mb-3" />
            <p className="text-base font-bold text-[#0F172A]">No Orders Found</p>
            <p className="text-xs mt-1">Try adjusting search parameters or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0F172A]">
              <thead className="bg-[#F8FAFC] text-[#475569] uppercase text-[11px] tracking-wider font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-4">Order # & Date</th>
                  <th className="py-3.5 px-4">Customer Recipient</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Payment Status</th>
                  <th className="py-3.5 px-4 text-center">Fulfillment</th>
                  <th className="py-3.5 px-4">Courier & Resi</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredOrders.map((order) => {
                  const recipient = order.shipping_address?.recipient_name || 'Guest Customer';
                  const phone = order.shipping_address?.phone_number || '-';
                  const itemsCount = order.order_items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

                  return (
                    <tr key={order.id} className="hover:bg-[#F8FAFC]/70 transition-colors border-b border-[#F1F5F9]">
                      {/* Order # & Date */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#0F172A] block">{order.order_number}</span>
                        <span className="text-[11px] text-[#64748B] flex items-center mt-0.5">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer Recipient */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#0F172A]">{recipient}</p>
                        <p className="text-xs text-[#64748B]">{phone}</p>
                      </td>

                      {/* Total & Items */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#0B4F3A]">{formatCurrency(order.total)}</p>
                        <p className="text-[11px] text-[#64748B]">{itemsCount} items</p>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={getPaymentStatusBadgeClass(order.payment_status)}>
                          {order.payment_status}
                        </span>
                      </td>

                      {/* Fulfillment Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={getStatusBadgeClass(order.status)}>
                          {order.status}
                        </span>
                      </td>

                      {/* Courier & Resi */}
                      <td className="py-3.5 px-4 text-xs">
                        {order.tracking_number ? (
                          <div>
                            <span className="font-semibold text-[#0F172A] block">
                              {order.courier || 'Courier'}
                            </span>
                            <span className="font-mono text-[#0B4F3A] block truncate max-w-[120px] font-bold">
                              {order.tracking_number}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#94A3B8] italic">No Resi Yet</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetailModal(order)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#0B4F3A]/10 text-[#0B4F3A] hover:bg-[#0B4F3A] hover:text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail & Fulfillment Manager Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-xl border border-[#E2E8F0] overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="font-bold text-xl text-[#0F172A]">
                    Order #{selectedOrder.order_number}
                  </h2>
                  <span className={getStatusBadgeClass(selectedOrder.status)}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Placed on{' '}
                  {new Date(selectedOrder.created_at).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-sm overflow-y-auto flex-1">
              {/* Customer & Shipping Information Box */}
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center space-x-2 text-[#0B4F3A] font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Shipping Address & Customer Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[#64748B]">Recipient:</span>
                    <p className="font-bold text-[#0F172A]">
                      {selectedOrder.shipping_address?.recipient_name || 'Guest'}
                    </p>
                    <p className="text-[#64748B]">
                      {selectedOrder.shipping_address?.phone_number || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Delivery Address:</span>
                    <p className="text-[#0F172A]">
                      {selectedOrder.shipping_address?.address_line1 || 'Address details N/A'}
                    </p>
                    <p className="text-[#64748B]">
                      {[
                        selectedOrder.shipping_address?.city,
                        selectedOrder.shipping_address?.province,
                        selectedOrder.shipping_address?.postal_code,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-[#475569] tracking-wider block">
                  Ordered Items ({selectedOrder.order_items?.length || 0})
                </span>
                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-[#0F172A]">
                    <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-bold border-b border-[#E2E8F0]">
                      <tr>
                        <th className="py-2.5 px-3">Product Item</th>
                        <th className="py-2.5 px-3">Variant</th>
                        <th className="py-2.5 px-3 text-right">Price</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {selectedOrder.order_items?.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2.5 px-3 font-semibold text-[#0F172A]">
                            {item.product_name}
                          </td>
                          <td className="py-2.5 px-3 text-[#64748B]">{item.variant_label}</td>
                          <td className="py-2.5 px-3 text-right">{formatCurrency(item.price)}</td>
                          <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-[#0B4F3A]">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="flex justify-end pt-2">
                  <div className="w-full sm:w-64 space-y-1 text-xs">
                    <div className="flex justify-between text-[#64748B]">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-[#0B4F3A]">
                        <span>Discount:</span>
                        <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#64748B]">
                      <span>Shipping Cost:</span>
                      <span>{formatCurrency(selectedOrder.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#0F172A] border-t border-[#E2E8F0] pt-1.5 mt-1">
                      <span>Total Amount:</span>
                      <span className="text-[#0B4F3A]">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier & Resi Tracker Box */}
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <div className="flex items-center space-x-2 text-[#0B4F3A] font-bold text-xs uppercase tracking-wider">
                    <Truck className="w-4 h-4" />
                    <span>Shipping Tracker & Resi Number</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickShipWithResi}
                    disabled={saving}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#0B4F3A] text-white rounded-lg text-xs font-semibold hover:bg-[#083C2C] transition-colors shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>Save & Mark Shipped</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                      Shipping Courier / Expedition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JNE Reguler / SiCepat BEST"
                      value={fulfillmentData.courier}
                      onChange={(e) => setFulfillmentData({ ...fulfillmentData, courier: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl text-xs placeholder-[#94A3B8] text-[#0F172A] focus:ring-2 focus:ring-[#0B4F3A] bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                      Tracking Number (Resi Number)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JNE9928104812"
                      value={fulfillmentData.tracking_number}
                      onChange={(e) => setFulfillmentData({ ...fulfillmentData, tracking_number: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold placeholder-[#94A3B8] text-[#0F172A] focus:ring-2 focus:ring-[#0B4F3A] bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                    Fulfillment Status *
                  </label>
                  <select
                    value={fulfillmentData.status}
                    onChange={(e) =>
                      setFulfillmentData({
                        ...fulfillmentData,
                        status: e.target.value as AdminOrder['status'],
                      })
                    }
                    className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#0B4F3A] bg-white focus:outline-hidden"
                  >
                    <option value="pending">Pending (Awaiting Payment)</option>
                    <option value="processing">Processing (Paid & Packing)</option>
                    <option value="shipped">Shipped (In Transit with Courier)</option>
                    <option value="completed">Completed (Delivered to Customer)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                    Payment Status *
                  </label>
                  <select
                    value={fulfillmentData.payment_status}
                    onChange={(e) =>
                      setFulfillmentData({
                        ...fulfillmentData,
                        payment_status: e.target.value as AdminOrder['payment_status'],
                      })
                    }
                    className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#0B4F3A] bg-white focus:outline-hidden"
                  >
                    <option value="pending">Payment Pending</option>
                    <option value="paid">Paid (Verified)</option>
                    <option value="failed">Payment Failed</option>
                    <option value="expired">Transaction Expired</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Admin Processing Notes / Logs */}
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                  Admin Processing Notes & Fulfillment Logs (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Verified via Midtrans dashboard. Packed and handed over to courier."
                  value={fulfillmentData.notes}
                  onChange={(e) => setFulfillmentData({ ...fulfillmentData, notes: e.target.value })}
                  className="w-full p-3 border border-[#CBD5E1] rounded-xl text-xs placeholder-[#94A3B8] text-[#0F172A] focus:ring-2 focus:ring-[#0B4F3A] bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] bg-white border border-[#CBD5E1] rounded-xl hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleSaveOrderChanges()}
                disabled={saving}
                className="bg-[#0B4F3A] hover:bg-[#083C2C] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save All Order Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
