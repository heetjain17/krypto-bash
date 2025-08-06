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

const CoinChart = ({ chartData, days }) => {
  const formattedData = chartData.prices.map((priceEntry) => {
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
      date: formattedDate,
      price: priceEntry[1],
    };
  });

  const yAxisTickFormatter = (number) => {
    if (number > 1000000) {
      return `$${(number / 1000000).toFixed(1)}M`;
    }
    if (number > 1000) {
      return `$${(number / 1000).toFixed(1)}k`;
    }
    return `$${number}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">{`${label}`}</p>
          <p className="text-base font-semibold" style={{ color: '#8884d8' }}>
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

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#666' }}
            interval="preserveEnd"
          />

          <YAxis
            tickFormatter={yAxisTickFormatter}
            tick={{ fontSize: 12, fill: '#666' }}
            domain={['dataMin', 'dataMax']}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
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
