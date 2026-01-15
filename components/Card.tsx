
import React from 'react';

interface ContentCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  badge?: string;
  price?: number;
  footer?: React.ReactNode;
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  subtitle, 
  description, 
  imageUrl, 
  badge,
  price,
  footer 
}) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 group">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute top-3 right-3 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-purple-400 transition-colors">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500 font-medium uppercase tracking-tighter">{subtitle}</p>}
          </div>
          {price !== undefined && (
            <span className="text-lg font-bold text-emerald-400">${price.toFixed(2)}</span>
          )}
        </div>
        {description && <p className="text-sm text-zinc-400 line-clamp-2 mt-2 leading-relaxed">{description}</p>}
        {footer && <div className="mt-4 pt-4 border-t border-zinc-800">{footer}</div>}
      </div>
    </div>
  );
};

export const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; trend?: string }> = ({ label, value, icon, trend }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-800 rounded-lg text-purple-400">{icon}</div>
      {trend && <span className="text-xs font-bold text-emerald-500">{trend}</span>}
    </div>
    <p className="text-zinc-500 text-sm font-medium">{label}</p>
    <h4 className="text-2xl font-bold text-zinc-100 mt-1">{value}</h4>
  </div>
);
