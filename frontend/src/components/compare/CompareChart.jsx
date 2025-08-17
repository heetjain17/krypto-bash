import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const COLORS = ['#8884d8', '#ffc658', '#82ca9d', '#ff7300', '#00C49F'];

// Hook for responsiveness
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

const CompareChart = ({ chartDataSets, days }) => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  const processedData = React.useMemo(() => {
    if (!chartDataSets || chartDataSets.length === 0) return [];

    const normalizedSets = chartDataSets.map((dataSet) => {
      if (!dataSet.prices || dataSet.prices.length === 0) return [];
      const basePrice = dataSet.prices[0][1];
      return dataSet.prices.map((priceEntry) => ({
        timestamp: priceEntry[0],
        value:
          basePrice > 0 ? ((priceEntry[1] - basePrice) / basePrice) * 100 : 0,
      }));
    });

    const mergedData = {};
    const allTimestamps = new Set();
    normalizedSets.forEach((set) =>
      set.forEach((point) => allTimestamps.add(point.timestamp))
    );
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    sortedTimestamps.forEach((timestamp) => {
      mergedData[timestamp] = { timestamp };
      chartDataSets.forEach((coin) => {
        mergedData[timestamp][coin.id] = null;
      });
    });

    normalizedSets.forEach((set, index) => {
      const coinId = chartDataSets[index].id;
      set.forEach((point) => {
        if (mergedData[point.timestamp]) {
          mergedData[point.timestamp][coinId] = point.value;
        }
      });
    });

    let dataArray = Object.values(mergedData).sort(
      (a, b) => a.timestamp - b.timestamp
    );
    const coinIds = chartDataSets.map((coin) => coin.id);

    coinIds.forEach((coinId) => {
      const firstValidIndex = dataArray.findIndex(
        (point) => point[coinId] !== null
      );
      if (firstValidIndex === -1) return;
      let lastKnownIndex = firstValidIndex;
      for (let i = firstValidIndex + 1; i < dataArray.length; i++) {
        if (dataArray[i][coinId] !== null) {
          const gapLength = i - lastKnownIndex - 1;
          if (gapLength > 0) {
            const prevValue = dataArray[lastKnownIndex][coinId];
            const nextValue = dataArray[i][coinId];
            for (let j = 1; j <= gapLength; j++) {
              const gapIndex = lastKnownIndex + j;
              dataArray[gapIndex][coinId] =
                prevValue + (nextValue - prevValue) * (j / (gapLength + 1));
            }
          }
          lastKnownIndex = i;
        }
      }
    });

    const formattedData = dataArray.map((dataPoint) => {
      const dateObject = new Date(dataPoint.timestamp);
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
      return { ...dataPoint, date: formattedDate };
    });

    return formattedData;
  }, [chartDataSets, days]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-2">
            {new Date(dataPoint.timestamp).toLocaleString()}
          </p>
          {chartDataSets.map((coin, index) => {
            const value = dataPoint[coin.id];
            return (
              <p
                key={coin.id}
                className="text-base font-semibold"
                style={{ color: COLORS[index % COLORS.length] }}
              >
                {`${coin.name}: ${
                  value != null ? value.toFixed(2) + '%' : 'N/A'
                }`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (processedData.length === 0) {
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
    // CHANGED: Added a wrapper div for negative margins on mobile
    <div className="-mx-4 md:mx-0">
      <div style={{ width: '100%', height: isMobile ? 300 : 400 }}>
        <ResponsiveContainer>
          <AreaChart
            data={processedData}
            margin={{
              // CHANGED: Tightened margins for mobile
              top: isMobile ? 20 : 10,
              right: isMobile ? 5 : 30,
              left: isMobile ? -10 : 25,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#666' }}
              interval="preserveStartEnd"
              minTickGap={isMobile ? 20 : 40}
            />
            <YAxis
              tickFormatter={(tick) => `${tick.toFixed(0)}%`}
              tick={{ fontSize: 12, fill: '#666' }}
              domain={['auto', 'auto']}
              orientation={isMobile ? 'right' : 'left'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign={isMobile ? 'top' : 'bottom'}
              wrapperStyle={{
                // CHANGED: Compact legend style for mobile
                [isMobile ? 'top' : 'bottom']: isMobile ? -10 : 0,
                fontSize: isMobile ? '11px' : '12px',
              }}
            />
            {chartDataSets.map((coin, index) => (
              <Area
                key={coin.id}
                type="monotone"
                dataKey={coin.id}
                name={coin.name}
                stroke={COLORS[index % COLORS.length]}
                fillOpacity={0.1}
                fill={COLORS[index % COLORS.length]}
                strokeWidth={2}
                connectNulls
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompareChart;
