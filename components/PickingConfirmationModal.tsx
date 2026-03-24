
import React from 'react';
import { X, Info, CheckCircle2, LayoutGrid, Layers, Box, Check, Plus, ArrowRight, Settings2, ShieldCheck } from 'lucide-react';
import { GenerationSummary } from '../types';

interface PickingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  summary: GenerationSummary;
}

const PickingConfirmationModal: React.FC<PickingConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  summary 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all flex flex-col max-h-[90vh] border border-white/20">
        
        {/* Header with gradient subtle background */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Settings2 size={18} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">策略生成集合拣货单确认</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto space-y-8 scroll-smooth">
          
          {/* Summary Alert - Highlighted as top priority */}
          <div className="flex items-start gap-4 p-5 bg-blue-50/60 rounded-2xl border border-blue-100 shadow-sm">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shrink-0 shadow-lg shadow-blue-200/50">
              <Info size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-blue-900">生成预览摘要</h4>
              <p className="text-slate-600 leading-relaxed text-[13px]">
                当前有 <span className="font-bold text-blue-600 text-base">{summary.eligibleOrders}</span> 个待发货单。系统将根据以下预览策略，自动分流并汇总生成 <span className="font-bold text-blue-600 text-base">{summary.expectedTasks}</span> 个集合拣货单。
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">即将应用的策略预览</h5>
            
            {/* Strategy Grid - Clean Card Based Layout */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Section 1: Dimensions & Mode */}
              <div className="group border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:bg-blue-50/10 transition-all duration-300 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <LayoutGrid size={16} className="text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">集单维度 & 模式</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">已开启规则编辑</span>
                </div>
                <div className="flex gap-12 pl-6">
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-400">拆分维度</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-sm font-bold text-slate-800">不拆分</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-400">拣货模式</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-sm font-bold text-slate-800">拆分集单</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Logic & Constraints */}
              <div className="border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-700">拣货逻辑与上限</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pl-6">
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-400">集单类型</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg shadow-md shadow-blue-100">电商仓单行</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-400">单任务单量上限</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-800">200</span>
                      <span className="text-xs font-bold text-slate-400 italic">单/任务</span>
                    </div>
                  </div>
                </div>

                {/* Explosive Rule - Inline Card */}
                <div className="mx-2 bg-amber-50/40 border border-amber-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-700">
                    <ShieldCheck size={14} className="text-amber-500" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">爆品逻辑 (已激活)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-[13px]">
                      <span>同商品 & 同盒数</span>
                      <ArrowRight size={14} className="text-amber-400" />
                      <span className="text-amber-700">单次集合 ≥ 10单</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                      <span>独立分拣任务</span>
                      <div className="w-6 h-3 bg-orange-500 rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Visualization Style */}
              <div className="border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Box size={16} className="text-purple-500" />
                    <span className="text-sm font-bold text-slate-700">拣货展示样式</span>
                  </div>
                </div>
                
                <div className="ml-6 border-2 border-purple-500/30 bg-purple-50/10 rounded-xl p-4 relative overflow-hidden">
                  {/* Decorative background circle */}
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-purple-500/10 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <span className="text-[13px] font-bold text-purple-900 block">按量汇总展示</span>
                      <p className="text-[10px] text-purple-400 font-medium">公式：批号 x 总数量</p>
                    </div>
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ring-4 ring-blue-50">
                       <Check size={12} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="bg-white/80 border border-purple-100/50 rounded-lg py-3 px-6 shadow-inner text-center">
                    <span className="text-sm font-mono font-black text-slate-800 tracking-widest">SKU_BATCH_ID * 24</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 italic text-center">效果：汇总所有订单商品数量，单行统一打印展示</p>
                </div>
              </div>

              {/* Section 4: Automation Status */}
              <div className="bg-emerald-500 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl text-white">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-white">包装复核自动化已就绪</h5>
                    <p className="text-[10px] text-white/80">系统将自动校验商品与包装匹配，无需手动确认</p>
                  </div>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  <Check size={16} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Solid & Action Oriented */}
        <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-4 bg-white rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
          >
            返回修改
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-10 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] transition-all group"
          >
            <Check size={18} className="group-hover:scale-110 transition-transform" />
            确认并生成拣货任务
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickingConfirmationModal;
