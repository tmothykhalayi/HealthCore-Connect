import { API_BASE_URL } from './BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

export const getPharmacyOrdersFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<any>
  total: number
}> => {
  console.log('[DEBUG] getPharmacyOrdersFn called with:', { page, limit, search });
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/orders?${params.toString()}`
  const token = getAccessTokenHelper()

  console.log(`[DEBUG] Fetching orders from: ${fullUrl}`);
  console.log(`[DEBUG] Token:`, token);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(`[DEBUG] Response status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DEBUG] Error response: ${errorText}`);
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json()
    console.log('[DEBUG] Raw backend response:', result);
    
    // Map backend response to frontend expected format
    const mappedData = (result.data || []).map((order: any) => ({
      pharmacy_order_id: order.id,
      patient_id: order.patientId || 0,
      doctor_id: order.pharmacyId || 0, // Use pharmacyId as doctor_id for table compatibility
      medicine_id: order.medicineId || 0, // Map medicineId from backend
      patient_name: order.patient ? `${order.patient.user?.firstName || ''} ${order.patient.user?.lastName || ''}`.trim() : '',
      doctor_name: order.pharmacy ? `${order.pharmacy.user?.firstName || ''} ${order.pharmacy.user?.lastName || ''}`.trim() : '', // Use pharmacy name as doctor_name
      quantity: order.quantity || order.totalAmount || 0, // Use quantity or totalAmount
      status: order.status || 'pending',
      created_at: order.createdAt || order.orderDate,
      order_id: order.OrderId || '', // Map OrderId from backend
    }))

    console.log('[getPharmacyOrdersFn] Mapped data for frontend:', mappedData);
    return {
      data: mappedData,
      total: result.total || 0,
    };
  } catch (error) {
    console.error('[getPharmacyOrdersFn] Exception:', error);
    throw error;
  }
}

export const createPharmacyOrderFn = async (orderData: {
  patientId: number;
  pharmacyId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  OrderId: string;
}): Promise<any> => {
  const fullUrl = `${API_BASE_URL}/orders`
  const token = getAccessTokenHelper()

  console.log(`[createPharmacyOrderFn] Creating order:`, orderData);

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })

    console.log(`[createPharmacyOrderFn] Response status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[createPharmacyOrderFn] Error response: ${errorText}`);
      throw new Error(`Failed to create order: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json()
    console.log('[createPharmacyOrderFn] Created order:', result);
    return result;
  } catch (error) {
    console.error('[createPharmacyOrderFn] Exception:', error);
    throw error;
  }
}

export const updatePharmacyOrderFn = async (
  orderId: number, 
  orderData: {
    patientId?: number;
    pharmacyId?: number;
    orderDate?: string;
    status?: string;
    totalAmount?: number;
    OrderId?: string;
  }
): Promise<any> => {
  const fullUrl = `${API_BASE_URL}/orders/${orderId}`
  const token = getAccessTokenHelper()

  console.log(`[updatePharmacyOrderFn] Updating order ${orderId}:`, orderData);

  try {
    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })

    console.log(`[updatePharmacyOrderFn] Response status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[updatePharmacyOrderFn] Error response: ${errorText}`);
      throw new Error(`Failed to update order: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json()
    console.log('[updatePharmacyOrderFn] Updated order:', result);
    return result;
  } catch (error) {
    console.error('[updatePharmacyOrderFn] Exception:', error);
    throw error;
  }
}

export const deletePharmacyOrderFn = async (orderId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/orders/${orderId}`
  const token = getAccessTokenHelper()

  console.log(`[deletePharmacyOrderFn] Deleting order ${orderId}`);

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete order error response:', errorText);
    throw new Error(`Failed to delete order: ${errorText}`);
  }

  console.log(`[deletePharmacyOrderFn] Successfully deleted order ${orderId}`);
}
