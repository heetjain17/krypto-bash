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

const CompareChart = ({ chartDataSets, days }) => {
  const processedData = React.useMemo(() => {
    if (!chartDataSets || chartDataSets.length === 0) return [];

    // 1. Normalize each coin's data to show percentage change
    const normalizedSets = chartDataSets.map((dataSet) => {
      if (!dataSet.prices || dataSet.prices.length === 0) return [];
      const basePrice = dataSet.prices[0][1];
      return dataSet.prices.map((priceEntry) => ({
        timestamp: priceEntry[0],
        value:
          basePrice > 0 ? ((priceEntry[1] - basePrice) / basePrice) * 100 : 0,
      }));
    });

    // --- CORRECTED MERGING LOGIC ---
    // 2. Merge all data points into a single timeline
    const mergedData = {};

    const allTimestamps = new Set();
    normalizedSets.forEach((normalizedSet) => {
      normalizedSet.forEach((point) => allTimestamps.add(point.timestamp));
    });

    // Convert set to sorted array of unique timestamps
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    // Fill mergedData with all timestamps and set all coin ids to null
    sortedTimestamps.forEach((timestamp) => {
      mergedData[timestamp] = { timestamp };
      chartDataSets.forEach((coin) => {
        mergedData[timestamp][coin.id] = null;
      });
    });

    // Fill actual values from each normalized set
    normalizedSets.forEach((normalizedSet, index) => {
      const coinId = chartDataSets[index].id;
      normalizedSet.forEach((point) => {
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
      let lastKnownIndex = -1;

      // Find the first valid value to start interpolation from
      const firstValidIndex = dataArray.findIndex(
        (point) => point[coinId] !== null
      );
      if (firstValidIndex === -1) return; // No data for this coin at all

      lastKnownIndex = firstValidIndex;

      for (let i = firstValidIndex + 1; i < dataArray.length; i++) {
        if (dataArray[i][coinId] !== null) {
          const gapLength = i - lastKnownIndex - 1;
          // If there is a gap between the last known point and the current one
          if (gapLength > 0) {
            const prevValue = dataArray[lastKnownIndex][coinId];
            const nextValue = dataArray[i][coinId];

            // Fill the gap with interpolated values
            for (let j = 1; j <= gapLength; j++) {
              const gapIndex = lastKnownIndex + j;
              const interpolatedValue =
                prevValue + (nextValue - prevValue) * (j / (gapLength + 1));
              dataArray[gapIndex][coinId] = interpolatedValue;
            }
          }
          lastKnownIndex = i;
        }
      }
    });

    // 3. Format the date and sort the final array
    return dataArray.map((dataPoint) => {
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
  }, [chartDataSets, days]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-2">{dataPoint.date}</p>
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

  return (
    <div tabIndex={-1} style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={processedData}
          margin={{ top: 10, right: 30, left: 25, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#666' }}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            tickFormatter={(tick) => `${tick.toFixed(0)}%`}
            tick={{ fontSize: 12, fill: '#666' }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

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
  );
};

export default CompareChart;
