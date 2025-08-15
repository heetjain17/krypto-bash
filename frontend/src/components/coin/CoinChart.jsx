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
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

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
  const { formattedData, ticks } = React.useMemo(() => {
    if (!chartData?.prices) return { formattedData: [], ticks: [] };

    const data = chartData.prices.map((priceEntry) => {
      const dateObject = new Date(priceEntry[0]);
      let formattedDate;

      // Determine date format based on the time range
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
        fullDate: dateObject.toLocaleString(), // Keep full date for tooltip
        date: formattedDate,
        price: priceEntry[1],
      };
    });

    // --- Logic to create a clean set of X-axis ticks ---
    const desiredTickCount = isMobile ? 6 : 8; // CHANGED: 7 to 8 for desktop, 5 to 6 for mobile
    const uniqueDates = [
      ...new Map(data.map((item) => [item.date, item])).values(),
    ];

    // Ensure we don't try to create more ticks than available unique dates
    const effectiveTickCount = Math.min(uniqueDates.length, desiredTickCount);

    const tickInterval = Math.max(
      1,
      Math.floor(uniqueDates.length / effectiveTickCount)
    );
    const generatedTicks = uniqueDates
      .filter((_, index) => index % tickInterval === 0)
      .map((item) => item.date);

    return { formattedData: data, ticks: generatedTicks };
  }, [chartData, days, isMobile]);

  // Formatter for Y-axis ticks
  const yAxisTickFormatter = (number) => {
    if (number >= 1000000) return `$${(number / 1000000).toFixed(2)}M`;
    if (number >= 1000) return `$${(number / 1000).toFixed(2)}k`;
    if (number >= 1) return `$${number.toFixed(2)}`;
    if (number > 0.001) return `$${number.toFixed(4)}`;
    return `$${number.toPrecision(2)}`;
  };

  // Custom Tooltip component for a cleaner look
  const CustomTooltip = ({ active, payload, label }) => {
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

  // If there's no data, don't render the chart
  if (formattedData.length === 0) {
    return (
      <div style={{ height: 400 }} className="flex items-center justify-center">
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
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 25,
            bottom: 0,
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
            ticks={ticks} // Use our generated ticks
            tick={{ fontSize: 12, fill: '#666' }}
            interval={0} // Let the `ticks` prop control the display
          />

          <YAxis
            tickFormatter={yAxisTickFormatter}
            tick={{ fontSize: 12, fill: '#666' }}
            domain={['dataMin', 'dataMax']}
            orientation={isMobile ? 'right' : 'left'} // Move Y-axis on mobile
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
