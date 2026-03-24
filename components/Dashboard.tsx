
import React, { useState } from 'react';
import { 
  Package, 
  Settings, 
  Play, 
  ClipboardList, 
  LayoutDashboard, 
  Users, 
  Truck,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Layers,
  FileSpreadsheet,
  Clock,
  Store,
  Globe,
  MapPin,
  Plus,
  Trash2,
  Save,
  Bookmark
} from 'lucide-react';
import PickingConfirmationModal from './PickingConfirmationModal';
import { GenerationSummary, Order, SavedFilter, FilterState } from '../types';

const INITIAL_FILTERS: FilterState = {
  warehouse: '全部仓库',
  collectionType: '全部',
  preAllocStatus: '全部',
  shippingOrigin: '',
  createdAt: '',
  logistics: '',
  platform: '',
  shop: '',
  paidTimeStart: '',
  paidTimeEnd: '',
};

const MOCK_ORDERS: Order[] = [
  { 
    id: '1', 
    rowNumber: 1,
    warehouse: '华东一号仓',
    orderNo: 'PH202310240001',
    createdAt: '2023-10-24 09:00:12',
    paidTimeFull: '2023-10-24 09:05:45',
    paidHourMinute: '09:05',
    logistics: '顺丰速运',
    status: '已创建',
    preAllocStatus: '部分分配',
    collectionType: '电商仓单行',
    platform: '天猫',
    shop: '品牌旗舰店',
    shippingOrigin: '上海市',
    items: [
      { id: 'i1', itemCode: 'SKU001', itemName: '智能扫地机器人 X1', manufacturer: '科技生活有限公司', specification: '白色/旗舰版', purchaseQty: 2, batchNo: 'B20230901', shippingQty: 2, preAllocQty: 2 },
      { id: 'i2', itemCode: 'SKU005', itemName: '无线蓝牙耳机 Pro', manufacturer: '声学技术厂', specification: '黑色', purchaseQty: 1, batchNo: 'B20230815', shippingQty: 1, preAllocQty: 1 }
    ]
  },
  { 
    id: '2', 
    rowNumber: 2,
    warehouse: '华东一号仓',
    orderNo: 'PH202310240002',
    createdAt: '2023-10-24 10:30:45',
    paidTimeFull: '2023-10-24 10:35:12',
    paidHourMinute: '10:35',
    logistics: '中通快递',
    status: '请货中',
    preAllocStatus: '未分配',
    collectionType: '总仓单行',
    platform: '抖音',
    shop: '品牌直播间',
    shippingOrigin: '杭州市',
    items: [
      { id: 'i3', itemCode: 'SKU012', itemName: '多功能空气炸锅', manufacturer: '厨电制造大厂', specification: '5L/触控版', purchaseQty: 1, batchNo: 'B20231010', shippingQty: 0, preAllocQty: 0 }
    ]
  },
  { 
    id: '3', 
    rowNumber: 3,
    warehouse: '华南分拣中心',
    orderNo: 'PH202310240003',
    createdAt: '2023-10-24 11:15:20',
    paidTimeFull: '2023-10-24 11:20:01',
    paidHourMinute: '11:20',
    logistics: '顺丰速运',
    status: '已创建',
    preAllocStatus: '未分配',
    collectionType: '混合',
    platform: '京东',
    shop: '自营旗舰店',
    shippingOrigin: '广州市',
    items: [
      { id: 'i4', itemCode: 'SKU088', itemName: '人体工学办公椅', manufacturer: '家居设计工作室', specification: '灰色/网面', purchaseQty: 1, batchNo: 'B20230720', shippingQty: 1, preAllocQty: 1 },
      { id: 'i5', itemCode: 'SKU099', itemName: '护眼LED台灯', manufacturer: '照明科技公司', specification: '三色调光', purchaseQty: 3, batchNo: 'B20230912', shippingQty: 3, preAllocQty: 3 }
    ]
  }
];

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    { 
      id: 'f1', 
      name: '华东仓-电商单', 
      conditions: { ...INITIAL_FILTERS, warehouse: '华东一号仓', collectionType: '电商仓单行' } 
    },
    { 
      id: 'f2', 
      name: '顺丰-已分配', 
      conditions: { ...INITIAL_FILTERS, logistics: '顺丰速运', preAllocStatus: '已分配' } 
    }
  ]);
  const [newFilterName, setNewFilterName] = useState('');
  const [isSavingFilter, setIsSavingFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (filters.warehouse !== '全部仓库' && order.warehouse !== filters.warehouse) return false;
    if (filters.collectionType !== '全部' && order.collectionType !== filters.collectionType) return false;
    if (filters.preAllocStatus !== '全部' && order.preAllocStatus !== filters.preAllocStatus) return false;
    if (filters.shippingOrigin && !order.shippingOrigin.includes(filters.shippingOrigin)) return false;
    if (filters.createdAt && !order.createdAt.includes(filters.createdAt)) return false;
    if (filters.logistics && !order.logistics.includes(filters.logistics)) return false;
    if (filters.platform && !order.platform.includes(filters.platform)) return false;
    if (filters.shop && !order.shop.includes(filters.shop)) return false;
    // Paid time range filtering could be added here if needed
    return true;
  });

  const strategySummary: GenerationSummary = {
    eligibleOrders: 42,
    expectedTasks: 8,
    rules: [
      { 
        id: 'r1', 
        name: '集单维度', 
        description: '拆分维度（快递）：混合快递\n集单模式：全部合并集单' 
      },
      { 
        id: 'r2', 
        name: '分拣类型', 
        description: '爆品单品集单/爆品多品集单\n同商品&同盒数≥10单' 
      },
      {
        id: 'r3',
        name: '任务上限',
        description: '波次任务上限50单'
      }
    ]
  };

  const handleGenerateClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmGeneration = () => {
    setIsModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleExpandRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const toggleAllDetails = () => {
    if (expandedRows.size === filteredOrders.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return;
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: newFilterName,
      conditions: { ...filters }
    };
    setSavedFilters([...savedFilters, newFilter]);
    setNewFilterName('');
    setIsSavingFilter(false);
  };

  const handleApplyFilter = (filter: SavedFilter) => {
    setFilters(filter.conditions);
  };

  const handleDeleteFilter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFilters(savedFilters.filter(f => f.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">W</div>
          <span className="text-xl font-bold text-white tracking-tight">WMS Pro</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="仪表盘" />
          <SidebarItem icon={<Package size={20}/>} label="库存查询" />
          <SidebarItem icon={<ClipboardList size={20}/>} label="入库单管理" />
          <SidebarItem icon={<Truck size={20}/>} label="待发货管理" active />
          <SidebarItem icon={<Users size={20}/>} label="客户档案" />
          <div className="pt-6 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">设置</div>
          <SidebarItem icon={<Settings size={20}/>} label="策略配置" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>出库管理</span>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium">策略生成拣货</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
              <Users size={16} />
            </div>
            <span className="text-sm font-medium text-slate-700">系统管理员</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          
          {/* Action & Filter Bar */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl font-bold text-slate-800 shrink-0">待发货管理</h1>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <Filter size={16} />
                  <span>筛选器</span>
                  {isFilterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button 
                  onClick={toggleAllDetails}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <ClipboardList size={16} />
                  <span>{expandedRows.size === filteredOrders.length ? '折叠全部明细' : '展开全部明细'}</span>
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold rounded-lg hover:bg-indigo-100 transition-all text-sm"
                >
                  <Layers size={16} />
                  <span>生成集合拣货单</span>
                </button>
                <button 
                  onClick={handleGenerateClick}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-100 text-sm"
                >
                  <Play size={16} fill="currentColor" />
                  <span>策略生成拣货单</span>
                </button>
              </div>
            </div>

            {/* Filter Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">仓库</label>
                <select 
                  value={filters.warehouse}
                  onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option>全部仓库</option>
                  <option>华东一号仓</option>
                  <option>华南分拣中心</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">集单类型</label>
                <select 
                  value={filters.collectionType}
                  onChange={(e) => setFilters({ ...filters, collectionType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option>全部</option>
                  <option>电商仓单行</option>
                  <option>总仓单行</option>
                  <option>混合</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">预分配状态</label>
                <select 
                  value={filters.preAllocStatus}
                  onChange={(e) => setFilters({ ...filters, preAllocStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option>全部</option>
                  <option>未分配</option>
                  <option>部分分配</option>
                  <option>已分配</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">配货单创建时间</label>
                <input 
                  type="date" 
                  value={filters.createdAt}
                  onChange={(e) => setFilters({ ...filters, createdAt: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" 
                />
              </div>

              {isFilterExpanded && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">发运地</label>
                    <input 
                      type="text" 
                      placeholder="请输入发运地" 
                      value={filters.shippingOrigin}
                      onChange={(e) => setFilters({ ...filters, shippingOrigin: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">物流公司</label>
                    <input 
                      type="text" 
                      placeholder="请输入物流公司" 
                      value={filters.logistics}
                      onChange={(e) => setFilters({ ...filters, logistics: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">来源平台</label>
                    <input 
                      type="text" 
                      placeholder="天猫/京东/抖音" 
                      value={filters.platform}
                      onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">店铺名称</label>
                    <input 
                      type="text" 
                      placeholder="请输入店铺名称" 
                      value={filters.shop}
                      onChange={(e) => setFilters({ ...filters, shop: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">顾客支付时间范围</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="datetime-local" 
                        value={filters.paidTimeStart}
                        onChange={(e) => setFilters({ ...filters, paidTimeStart: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[11px] focus:ring-2 focus:ring-blue-500/20 outline-none" 
                      />
                      <span className="text-slate-300">-</span>
                      <input 
                        type="datetime-local" 
                        value={filters.paidTimeEnd}
                        onChange={(e) => setFilters({ ...filters, paidTimeEnd: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[11px] focus:ring-2 focus:ring-blue-500/20 outline-none" 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Save Filter & Quick Queries */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">快捷查询:</span>
                {savedFilters.map((filter) => (
                  <div 
                    key={filter.id}
                    onClick={() => handleApplyFilter(filter)}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer border border-transparent hover:border-blue-200"
                  >
                    <Bookmark size={12} className="text-slate-400 group-hover:text-blue-400" />
                    <span className="text-xs font-medium">{filter.name}</span>
                    <button 
                      onClick={(e) => handleDeleteFilter(filter.id, e)}
                      className="p-0.5 hover:bg-red-100 hover:text-red-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {savedFilters.length === 0 && (
                  <span className="text-xs text-slate-400 italic">暂无保存的条件</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isSavingFilter ? (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                    <input 
                      type="text" 
                      value={newFilterName}
                      onChange={(e) => setNewFilterName(e.target.value)}
                      placeholder="输入条件名称"
                      className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 outline-none w-40"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveFilter()}
                    />
                    <button 
                      onClick={handleSaveFilter}
                      disabled={!newFilterName.trim()}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      确认保存
                    </button>
                    <button 
                      onClick={() => { setIsSavingFilter(false); setNewFilterName(''); }}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsSavingFilter(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-all text-xs font-bold"
                  >
                    <Save size={14} />
                    <span>保存当前筛选条件</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Optimized Table with Sticky Columns and Consolidated Source Info */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative group">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0 min-w-[1500px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    {/* Fixed Selection Column */}
                    <th className="px-4 py-3 w-12 text-center sticky left-0 bg-slate-50 border-b border-r border-slate-200 z-20 shadow-[1px_0_0_0_rgba(226,232,240,1)]">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
                        checked={selectedIds.size === MOCK_ORDERS.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    {/* Fixed Toggle Column */}
                    <th className="px-2 py-3 w-8 text-center sticky left-12 bg-slate-50 border-b border-r border-slate-200 z-20 shadow-[1px_0_0_0_rgba(226,232,240,1)]"></th>
                    {/* Fixed ID Column */}
                    <th className="px-4 py-3 w-16 text-center sticky left-20 bg-slate-50 border-b border-r border-slate-200 z-20 shadow-[1px_0_0_0_rgba(226,232,240,1)]">行号</th>
                    {/* Fixed Order No Column */}
                    <th className="px-4 py-3 w-40 sticky left-36 bg-slate-50 border-b border-r border-slate-200 z-20 shadow-[1px_0_0_0_rgba(226,232,240,1)]">配货单号</th>
                    
                    {/* Scrollable Columns */}
                    <th className="px-4 py-3 border-b border-slate-200">仓库</th>
                    <th className="px-4 py-3 border-b border-slate-200">状态 / 集单</th>
                    <th className="px-4 py-3 border-b border-slate-200">预分配</th>
                    <th className="px-4 py-3 border-b border-slate-200">配货单创建时间</th>
                    <th className="px-4 py-3 border-b border-slate-200">顾客支付时间</th>
                    <th className="px-4 py-3 border-b border-slate-200 text-blue-600">支付时间(时:分)</th>
                    
                    {/* Consolidated Column for Logistics, Platform, Shop */}
                    <th className="px-4 py-3 border-b border-slate-200 bg-blue-50/30 text-blue-800">渠道 / 店铺 / 物流 / 发运地</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[12px]">
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr 
                        className={`transition-colors group ${selectedIds.has(order.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'} ${expandedRows.has(order.id) ? 'bg-slate-50/50' : ''}`}
                      >
                        {/* Fixed Selection */}
                        <td className="px-4 py-3 text-center sticky left-0 bg-inherit border-r border-slate-100 group-hover:bg-slate-50 z-10 shadow-[1px_0_0_0_rgba(241,245,249,1)]">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
                            checked={selectedIds.has(order.id)}
                            onChange={() => toggleSelectRow(order.id)}
                          />
                        </td>
                        {/* Fixed Toggle */}
                        <td className="px-2 py-3 text-center sticky left-12 bg-inherit border-r border-slate-100 group-hover:bg-slate-50 z-10 shadow-[1px_0_0_0_rgba(241,245,249,1)]">
                          <button 
                            onClick={() => toggleExpandRow(order.id)}
                            className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-slate-600"
                          >
                            {expandedRows.has(order.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        </td>
                        {/* Fixed ID */}
                        <td className="px-4 py-3 text-center text-slate-400 font-mono sticky left-20 bg-inherit border-r border-slate-100 group-hover:bg-slate-50 z-10 shadow-[1px_0_0_0_rgba(241,245,249,1)]">{order.rowNumber}</td>
                        {/* Fixed Order No */}
                        <td className="px-4 py-3 sticky left-36 bg-inherit border-r border-slate-100 group-hover:bg-slate-50 z-10 font-bold text-blue-600 shadow-[1px_0_0_0_rgba(241,245,249,1)]">
                          {order.orderNo}
                        </td>

                        {/* Scrollable Data */}
                        <td className="px-4 py-3 text-slate-700">{order.warehouse}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              order.status === '已创建' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                            }`}>
                              {order.status}
                            </span>
                            <span className={`inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              order.collectionType === '电商仓单行' ? 'bg-emerald-50 text-emerald-700' : 
                              order.collectionType === '总仓单行' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {order.collectionType}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                            order.preAllocStatus === '已分配' ? 'bg-green-50 text-green-700 border-green-200' :
                            order.preAllocStatus === '部分分配' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {order.preAllocStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono">{order.createdAt}</td>
                        <td className="px-4 py-3 text-slate-600 font-mono">{order.paidTimeFull}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Clock size={12} className="text-slate-400" />
                            {order.paidHourMinute}
                          </span>
                        </td>

                        {/* Consolidated Display: Logistics / Platform / Shop */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                                <Globe size={10} />
                                {order.platform}
                              </span>
                              <span className="font-medium text-slate-700 truncate max-w-[140px]" title={order.shop}>
                                {order.shop}
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px] flex items-center flex-wrap gap-x-3 gap-y-1 px-1">
                              <div className="flex items-center gap-1">
                                <Truck size={12} className="text-slate-400" />
                                <span>{order.logistics}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400">
                                <MapPin size={12} />
                                <span>{order.shippingOrigin}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row Content */}
                      {expandedRows.has(order.id) && (
                        <tr className="bg-slate-50/30">
                          <td colSpan={11} className="px-4 py-0">
                            <div className="py-4 pl-[304px] pr-8 animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                      <th className="px-4 py-2">商品信息 (编码 / 名称)</th>
                                      <th className="px-4 py-2">规格 / 生产厂家</th>
                                      <th className="px-4 py-2">批号</th>
                                      <th className="px-4 py-2">预分配数</th>
                                      <th className="px-4 py-2 text-right">数量 (购买 / 需发货)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-[11px]">
                                    {order.items?.map((item) => (
                                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-2.5">
                                          <div className="flex flex-col">
                                            <span className="font-mono text-blue-600 font-semibold">{item.itemCode}</span>
                                            <span className="text-slate-700">{item.itemName}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-2.5">
                                          <div className="flex flex-col">
                                            <span className="text-slate-600">{item.specification}</span>
                                            <span className="text-slate-400 text-[10px]">{item.manufacturer}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-2.5">
                                          <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{item.batchNo}</span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                          <span className="font-medium text-slate-600">
                                            {(order.collectionType === '电商仓单行' || order.collectionType === '混合') ? '-' : item.preAllocQty}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                          <div className="flex items-center justify-end gap-2">
                                            <span className="text-slate-400">{item.purchaseQty}</span>
                                            <span className="text-slate-300">/</span>
                                            <span className="font-bold text-indigo-600">{item.shippingQty}</span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                    {(!order.items || order.items.length === 0) && (
                                      <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                                          暂无商品明细数据
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer / Pagination */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">已选择 <b className="text-blue-600">{selectedIds.size}</b> / 共 {filteredOrders.length} 项</span>
                <div className="h-4 w-px bg-slate-300" />
                <button className="text-[11px] text-blue-600 font-bold hover:underline">导出选中项</button>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50">上一页</button>
                <div className="flex items-center px-4 text-xs font-medium text-slate-600">1 / 12</div>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-600 hover:bg-slate-50">下一页</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <PickingConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmGeneration}
        summary={strategySummary}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 transition-all z-[100]">
          <CheckCircle2 className="text-emerald-400" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">操作成功</span>
            <span className="text-xs text-slate-400">拣货单及任务已按策略分流生成</span>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a 
    href="#" 
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
      active 
      ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
      : 'hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span className={active ? 'text-blue-500' : 'text-slate-400 group-hover:text-white'}>{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </a>
);

export default Dashboard;
