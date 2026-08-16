import React, { useState } from "react";
import { Bell, ShoppingBag, AlertTriangle, PackageX, RotateCcw, Check, Trash2 } from "lucide-react";
import { notifications as initialNotifications } from "../../data/notifications";

export default function Notifications() {
  const [list, setList] = useState(initialNotifications);

  const markAllRead = () => {
    setList(list.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setList([]);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading font-black text-2xl text-primary">Notifications Center</h2>
          <p className="text-slate-400 text-xs mt-0.5">Real-time store notifications for orders, stock alerts, and return requests.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="btn-ghost text-xs text-secondary font-semibold">Mark All Read</button>
          <button onClick={clearAll} className="btn-ghost text-xs text-danger font-semibold">Clear All</button>
        </div>
      </div>

      <div className="space-y-3">
        {list.map((n) => {
          const iconMap = {
            order: { icon: ShoppingBag, color: "bg-blue-50 text-secondary" },
            "low-stock": { icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
            "out-of-stock": { icon: PackageX, color: "bg-red-50 text-red-600" },
            return: { icon: RotateCcw, color: "bg-purple-50 text-purple-600" },
          };
          const cfg = iconMap[n.type] || iconMap.order;
          const Icon = cfg.icon;

          return (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-4 border transition-all flex items-start gap-4 shadow-card ${
                n.read ? "border-slate-100 opacity-75" : "border-secondary/30 bg-secondary/5"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center shrink-0`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-heading font-bold text-sm text-primary">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
