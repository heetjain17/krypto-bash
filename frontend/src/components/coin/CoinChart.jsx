import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// A simple hook to get the window width, useful for responsiveness
const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};

const CoinChart = ({ chartData, days }) => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768; // md breakpoint

  // Memoize the formatted data to avoid recalculating on every render
  const formattedData = React.useMemo(() => {
    if (!chartData?.prices) return [];

    return chartData.prices.map((priceEntry) => {
      const dateObject = new Date(priceEntry[0]);
      let formattedDate;

      if (days === 1) {
        formattedDate = dateObject.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } else if (days === 7) {
        formattedDate = dateObject.toLocaleDateString('en-US', {
          weekday: 'short',
        });
      } else {
        formattedDate = dateObject.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }

      return {
        fullDate: dateObject.toLocaleString(),
        date: formattedDate,
        price: priceEntry[1],
      };
    });
  }, [chartData, days]);

  // Formatter for Y-axis ticks
  const yAxisTickFormatter = (number) => {
    if (number >= 1000000) return `$${(number / 1000000).toFixed(2)}M`;
    if (number >= 1000) return `$${(number / 1000).toFixed(2)}k`;
    if (number >= 1) return `$${number.toFixed(2)}`;
    if (number > 0.001) return `$${number.toFixed(4)}`;
    return `$${number.toPrecision(2)}`;
  };

  // Custom Tooltip component for a cleaner look
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-300 rounded-lg shadow-lg">
          <p className="text-sm text-neutral-600">
            {payload[0].payload.fullDate}
          </p>
          <p className="text-base font-semibold text-indigo-600">
            {`Price: ${payload[0].value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (formattedData.length === 0) {
    return (
      <div
        style={{ height: isMobile ? 300 : 400 }}
        className="flex items-center justify-center text-neutral-500"
      >
        <p>Loading chart data...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: isMobile ? 300 : 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={formattedData}
          margin={{
            top: 10,
            right: isMobile ? 15 : 30,
            left: isMobile ? 5 : 25,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#666' }}
            // --- CHANGED: Switched to a more robust, automatic way of handling ticks ---
            interval="preserveStartEnd" // Always show the first and last label
            minTickGap={isMobile ? 30 : 50} // Ensure minimum space between labels
          />

          <YAxis
            tickFormatter={yAxisTickFormatter}
            tick={{ fontSize: 12, fill: '#666' }}
            domain={['dataMin', 'dataMax']}
            orientation={isMobile ? 'right' : 'left'}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#4F46E5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoinChart;
