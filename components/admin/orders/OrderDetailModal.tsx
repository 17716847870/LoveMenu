import { Order } from '@/types';
import { X, Clock, AlertCircle, CheckCircle2, XCircle, Heart, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/utils/format';

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (newStatus: Order['status']) => void;
}

const statusConfig = {
  pending: { label: "待处理", color: "text-orange-500 bg-orange-50 border-orange-100", icon: Clock },
  preparing: { label: "制作中", color: "text-blue-500 bg-blue-50 border-blue-100", icon: AlertCircle },
  completed: { label: "已完成", color: "text-green-500 bg-green-50 border-green-100", icon: CheckCircle2 },
  cancelled: { label: "已取消", color: "text-gray-500 bg-gray-50 border-gray-100", icon: XCircle },
};

export default function OrderDetailModal({ order, isOpen, onClose, onUpdateStatus }: OrderDetailModalProps) {
  if (!isOpen) return null;

  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-pink-50 flex flex-col max-h-[90vh] md:max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-pink-50/30 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">订单详情</h2>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", 
              statusConfig[order.status as keyof typeof statusConfig]?.color
            )}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig[order.status as keyof typeof statusConfig]?.label}
            </div>
            {order.isEmergency && (
              <span className="px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded-full border border-red-100 font-bold">
                ⚡ 紧急
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block mb-1">订单编号</span>
              <span className="font-medium text-gray-800">{order.id}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">下单时间</span>
              <span className="font-medium text-gray-800">{formatDateTime(order.createdAt)}</span>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-pink-400 rounded-full"></span>
              菜品内容
            </h3>
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col gap-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="font-medium text-gray-800">{item.dish.name}</div>
                  <div className="text-gray-500 font-medium">x {item.quantity}</div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between items-center">
                <span className="text-gray-500 font-medium">合计支付</span>
                <div className="flex items-center gap-3 font-bold">
                  <span className="text-pink-500 flex items-center gap-1"><Heart className="w-4 h-4" /> {order.totalKiss}</span>
                  <span className="text-blue-500 flex items-center gap-1"><Smile className="w-4 h-4" /> {order.totalHug}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reason */}
          {order.reason && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-400 rounded-full"></span>
                订单备注
              </h3>
              <div className="bg-orange-50/50 text-orange-800 p-4 rounded-2xl border border-orange-100/50 text-sm leading-relaxed">
                {order.reason}
              </div>
            </div>
          )}

          {/* Memory (If completed and recorded) */}
          {order.memory && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                美味回忆
              </h3>
              <div className="bg-purple-50/30 p-4 rounded-2xl border border-purple-100/50 flex flex-col gap-3">
                {order.memory.image && (
                  <div className={cn(
                    Array.isArray(order.memory.image) && order.memory.image.length > 1
                      ? "grid grid-cols-2 gap-2"
                      : ""
                  )}>
                    {Array.isArray(order.memory.image) ? (
                      order.memory.image.map((img, idx) => (
                        <div key={idx} className={cn(
                          "rounded-xl overflow-hidden relative border border-gray-100",
                          order.memory!.image!.length === 1 ? "w-full h-40" : "w-full aspect-square"
                        )}>
                          <img src={img} alt={`回忆 ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-40 rounded-xl overflow-hidden relative border border-gray-100">
                        <img src={order.memory.image} alt="回忆" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
                {order.memory.text && (
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{order.memory.text}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between gap-3 shrink-0 rounded-b-3xl">
          <div>
            {order.status === 'pending' && (
              <button 
                onClick={() => {
                  onUpdateStatus?.('cancelled');
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
              >
                取消订单
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              关闭
            </button>
            
            {order.status === 'pending' && (
              <button 
                onClick={() => {
                  onUpdateStatus?.('preparing');
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-colors font-medium text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" /> 开始制作
              </button>
            )}
            
            {order.status === 'preparing' && (
              <button 
                onClick={() => {
                  onUpdateStatus?.('completed');
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-sm transition-colors font-medium text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> 标记已完成
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
