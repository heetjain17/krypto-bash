import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const StatCard = ({
  icon,
  title,
  value,
  footer,
  chartData,
  valueClass,
  chartColor = '#3b82f6',
}) => (
  <motion.div
    className="relative bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col h-full overflow-hidden"
    whileHover={{ scale: 1.02, boxShadow: '0 8px 15px -5px rgba(0,0,0,0.08)' }}
    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
  >
    {/* Background Chart */}
    {chartData && chartData.length > 0 && (
      <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#006DFF" // green
              strokeWidth={2}
              dot={false} // removes dots
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}

    {/* Content */}
    <div className="relative z-10 flex flex-col gap-1">
      {/* Title + Icon */}
      <div className="flex items-center gap-2 text-neutral-600">
        {icon}
        <h3 className="font-medium text-sm">{title}</h3>
      </div>

      {/* Number directly under title */}
      <motion.p
        className={`text-2xl lg:text-3xl font-semibold text-neutral-800 ${valueClass}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {value}
      </motion.p>

      {/* Footer badge — small, inline, no border */}
      {footer && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
          {footer}
        </div>
      )}
    </div>
  </motion.div>
);

export default StatCard;
