import React, { useState } from 'react';

const Heatmap = ({ data = [] }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Convert stats array to a map for quick access
  const dataMap = new Map();
  data.forEach((item) => {
    dataMap.set(item.date, item.count);
  });

  // Generate calendar grid dates (53 weeks, Sunday to Saturday)
  const generateGrid = () => {
    const grid = [];
    const today = new Date();
    
    // Find the Sunday of the week 52 weeks ago
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek); // Adjust to start on Sunday

    let tempDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    const todayMidnight = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // Generate 53 weeks
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = tempDate.toISOString().split('T')[0];
        
        // Count entries for this date
        const count = dataMap.get(dateStr) || 0;
        
        week.push({
          date: new Date(tempDate),
          dateStr,
          count,
          isFuture: tempDate > todayMidnight
        });
        
        // Increment by 1 day
        tempDate.setUTCDate(tempDate.getUTCDate() + 1);
      }
      grid.push(week);
    }
    return grid;
  };

  const grid = generateGrid();

  // Determine SVG cell color based on count
  const getCellColorClass = (count, isFuture) => {
    if (isFuture) return 'fill-slate-100 dark:fill-slate-900 opacity-20';
    if (count === 0) return 'heatmap-empty';
    if (count === 1) return 'fill-indigo-300 dark:fill-indigo-900/60';
    if (count === 2) return 'fill-indigo-400 dark:fill-indigo-700/80';
    if (count === 3) return 'fill-indigo-500 dark:fill-indigo-500';
    return 'fill-indigo-600 dark:fill-indigo-400'; // 4+ logs
  };

  // Generate month headings along the top
  const getMonthLabels = () => {
    const labels = [];
    let prevMonth = -1;

    grid.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0].date;
      const month = firstDayOfWeek.getMonth();
      
      if (month !== prevMonth && weekIndex % 4 === 0) {
        const monthName = firstDayOfWeek.toLocaleDateString(undefined, { month: 'short' });
        labels.push({
          text: monthName,
          x: weekIndex * 14 + 30 // adjust offset for padding
        });
        prevMonth = month;
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-base">
          Consistency Heatmap
        </h3>
        {/* Color Legend */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <span>Less</span>
          <span className="h-3 w-3 rounded-sm heatmap-empty"></span>
          <span className="h-3 w-3 rounded-sm fill-indigo-300 dark:fill-indigo-900/60 bg-indigo-300 dark:bg-indigo-900/60"></span>
          <span className="h-3 w-3 rounded-sm fill-indigo-400 dark:fill-indigo-700/80 bg-indigo-400 dark:bg-indigo-700/80"></span>
          <span className="h-3 w-3 rounded-sm fill-indigo-500 dark:fill-indigo-500 bg-indigo-500 dark:bg-indigo-500"></span>
          <span className="h-3 w-3 rounded-sm fill-indigo-600 dark:fill-indigo-400 bg-indigo-600 dark:bg-indigo-400"></span>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid Wrapper */}
      <div className="relative overflow-x-auto pb-2 scrollbar-thin">
        <svg width="780" height="135" className="mx-auto select-none">
          {/* Month labels */}
          {monthLabels.map((lbl, idx) => (
            <text
              key={idx}
              x={lbl.x}
              y="15"
              className="text-[10px] fill-slate-400 font-semibold"
            >
              {lbl.text}
            </text>
          ))}

          {/* Weekday labels */}
          {dayNames.map((day, idx) => {
            // Show Mon, Wed, Fri labels
            if (idx % 2 === 0) return null;
            return (
              <text
                key={day}
                x="5"
                y={idx * 14 + 36}
                className="text-[9px] fill-slate-400 font-medium"
              >
                {day}
              </text>
            );
          })}

          {/* Grid Cells */}
          {grid.map((week, weekIndex) => (
            <g key={weekIndex} transform={`translate(${weekIndex * 14 + 30}, 24)`}>
              {week.map((day, dayIndex) => (
                <rect
                  key={dayIndex}
                  y={dayIndex * 14}
                  width="11"
                  height="11"
                  rx="2"
                  className={`cursor-pointer transition-all duration-200 ${getCellColorClass(day.count, day.isFuture)}`}
                   onMouseEnter={(e) => {
                     if (!day.isFuture) {
                       const isTopHalf = dayIndex < 3;
                       setHoveredCell({
                         dateStr: day.date.toLocaleDateString(undefined, {
                           year: 'numeric',
                           month: 'short',
                           day: 'numeric',
                           timeZone: 'UTC'
                         }),
                         count: day.count,
                         x: weekIndex * 14 + 35,
                         y: isTopHalf ? dayIndex * 14 + 24 + 11 + 4 : dayIndex * 14 + 24 - 4,
                         position: isTopHalf ? 'below' : 'above'
                       });
                     }
                   }}
                   onMouseLeave={() => setHoveredCell(null)}
                 />
               ))}
             </g>
           ))}
         </svg>
 
         {/* Hover Tooltip */}
         {hoveredCell && (
           <div
             className="absolute z-10 rounded bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow border border-slate-700/50 pointer-events-none transition-all duration-100 whitespace-nowrap"
             style={{
               left: `${hoveredCell.x}px`,
               top: `${hoveredCell.y}px`,
               transform: hoveredCell.position === 'below' ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
             }}
           >
             {hoveredCell.count === 0 ? 'No logs' : `${hoveredCell.count} log${hoveredCell.count !== 1 ? 's' : ''}`}{' '}
             on {hoveredCell.dateStr}
           </div>
         )}
      </div>
    </div>
  );
};

export default Heatmap;
