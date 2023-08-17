import React, { useRef, useEffect, useState } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { useTheme } from '../../contexts/theme/ThemeContext';
Chart.register(...registerables);


interface WpmChartProps {
  data: number[];
}

const WpmChart: React.FC<WpmChartProps> = ({ data }) => {
  const {theme} = useTheme()
  const chartRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (chartRef && chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
  
      const legendLabelColor = theme === 'light' ? 'black' : 'white';

      const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
            labels: Array.from({ length: data.length }, (_, i) => (i + 1).toString()),
            datasets: [{
                label: 'Words Per Minute',
                data: data,
                fill: false,
            }]
        },
            options: {
              
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                      color: legendLabelColor,  // Apply the color extracted from the CSS variable
                      font: {
                        size: 16,
                      },
                      boxWidth: 0  // Remove the box next to the label
                  }
              }
            },
            scales: {
              x: {  
                ticks: {
                    maxRotation: 0, 
                    minRotation: 0  
                  }
                },
                y: {  // y-axis configuration
                    beginAtZero: true,  // starts the scale at 0
                    ticks: {
                        // You can add more configuration for the ticks here if needed
                    }
                }
                
            },
            
        }
    };
    
  
      // Store the chart instance in the ref
      chartInstance.current = new Chart(chartRef.current, chartConfig);
    }
  }, [data, theme]);
  
  // Also, add this outside your useEffect hook:
  const chartInstance = useRef<Chart | null>(null);
  

  return (
    <canvas ref={chartRef} className='chart'></canvas>
  );
}

export default WpmChart;
