
export interface PickingRule {
  id: string;
  name: string;
  description: string;
}

export interface OrderItem {
  id: string;
  itemCode: string;
  itemName: string;
  manufacturer: string;
  specification: string;
  purchaseQty: number;
  batchNo: string;
  shippingQty: number;
  preAllocQty: number;
}

export interface Order {
  id: string;
  rowNumber: number;
  warehouse: string;
  orderNo: string;
  createdAt: string; // 配货单创建时间
  paidTimeFull: string; // 顾客支付时间 (YYYY-MM-DD HH:mm:ss)
  paidHourMinute: string; // 支付时间 (HH:mm)
  logistics: string;
  status: '已创建' | '请货中';
  preAllocStatus: string;
  collectionType: '电商仓单行' | '总仓单行' | '混合';
  platform: string;
  shop: string;
  shippingOrigin: string;
  items?: OrderItem[];
}

export interface FilterState {
  warehouse: string;
  collectionType: string;
  preAllocStatus: string;
  shippingOrigin: string;
  createdAt: string;
  logistics: string;
  platform: string;
  shop: string;
  paidTimeStart: string;
  paidTimeEnd: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  conditions: FilterState;
}

export interface GenerationSummary {
  eligibleOrders: number;
  expectedTasks: number;
  rules: PickingRule[];
}
