// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   Legend,
// } from 'recharts';
// import { FiClock, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
// import {
//   WEEKLY_STUDY_HOURS,
//   SUBJECT_DISTRIBUTION,
//   PRODUCTIVITY_TREND,
//   ANALYTICS_SUMMARY,
// } from '../data/analyticsData';
// import '../styles/analytics.css';

// function SummaryCard({ icon: Icon, label, value, suffix }) {
//   return (
//     <div className="analytics-summary-card">
//       <div className="analytics-summary-icon">
//         <Icon className="analytics-summary-icon-svg" />
//       </div>
//       <div className="analytics-summary-content">
//         <span className="analytics-summary-value">{value}{suffix}</span>
//         <span className="analytics-summary-label">{label}</span>
//       </div>
//     </div>
//   );
// }

// function Analytics() {
//   return (
//     <div className="analytics-page">
//       <div className="analytics-container">
//         <h1 className="analytics-heading">Study Performance Analytics</h1>
//         <p className="analytics-subheading">
//           Track your study patterns and productivity over time.
//         </p>

//         {/* Top: Summary Cards */}
//         <div className="analytics-summary-grid">
//           <SummaryCard
//             icon={FiClock}
//             label="Total Study Hours"
//             value={ANALYTICS_SUMMARY.totalStudyHours}
//             suffix=" hrs"
//           />
//           <SummaryCard
//             icon={FiCheckCircle}
//             label="Completed Tasks"
//             value={ANALYTICS_SUMMARY.completedTasks}
//           />
//           <SummaryCard
//             icon={FiTrendingUp}
//             label="Study Consistency"
//             value={ANALYTICS_SUMMARY.studyConsistency}
//             suffix="%"
//           />
//         </div>

//         {/* Middle: Weekly Study Hours Bar Chart */}
//         <div className="analytics-chart-card">
//           <h2 className="analytics-chart-title">Weekly Study Hours</h2>
//           <div className="analytics-chart-wrapper">
//             <ResponsiveContainer width="100%" height={280}>
//               <BarChart data={WEEKLY_STUDY_HOURS} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 50, 92, 0.08)" />
//                 <XAxis
//                   dataKey="day"
//                   tick={{ fill: '#22325c', fontSize: 12, fontWeight: 600 }}
//                   axisLine={{ stroke: 'rgba(34, 50, 92, 0.15)' }}
//                   tickLine={false}
//                 />
//                 <YAxis
//                   tick={{ fill: '#22325c', fontSize: 12 }}
//                   axisLine={false}
//                   tickLine={false}
//                   tickFormatter={(v) => `${v} hrs`}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     background: 'rgba(255,255,255,0.96)',
//                     border: '1px solid rgba(34,50,92,0.12)',
//                     borderRadius: '12px',
//                     boxShadow: '0 10px 30px rgba(34,64,114,0.12)',
//                   }}
//                   formatter={(value) => [`${value} hrs`, 'Study Hours']}
//                   labelFormatter={(label) => label}
//                 />
//                 <Bar
//                   dataKey="hours"
//                   fill="url(#barGradient)"
//                   radius={[8, 8, 0, 0]}
//                   maxBarSize={56}
//                 />
//                 <defs>
//                   <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#4682dc" />
//                     <stop offset="100%" stopColor="#5b9cf5" />
//                   </linearGradient>
//                 </defs>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Bottom: Pie Chart + Line Chart */}
//         <div className="analytics-charts-row">
//           <div className="analytics-chart-card analytics-chart-card--half">
//             <h2 className="analytics-chart-title">Subject-wise Study Distribution</h2>
//             <div className="analytics-chart-wrapper analytics-chart-wrapper--pie">
//               <ResponsiveContainer width="100%" height={280}>
//                 <PieChart>
//                   <Pie
//                     data={SUBJECT_DISTRIBUTION}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     paddingAngle={2}
//                     dataKey="value"
//                     nameKey="name"
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     labelLine={false}
//                   >
//                     {SUBJECT_DISTRIBUTION.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{
//                       background: 'rgba(255,255,255,0.96)',
//                       border: '1px solid rgba(34,50,92,0.12)',
//                       borderRadius: '12px',
//                       boxShadow: '0 10px 30px rgba(34,64,114,0.12)',
//                     }}
//                     formatter={(value, name) => [`${value}%`, name]}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="analytics-chart-card analytics-chart-card--half">
//             <h2 className="analytics-chart-title">Productivity Trend</h2>
//             <div className="analytics-chart-wrapper">
//               <ResponsiveContainer width="100%" height={280}>
//                 <LineChart data={PRODUCTIVITY_TREND} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 50, 92, 0.08)" />
//                   <XAxis
//                     dataKey="week"
//                     tick={{ fill: '#22325c', fontSize: 12, fontWeight: 600 }}
//                     axisLine={{ stroke: 'rgba(34, 50, 92, 0.15)' }}
//                     tickLine={false}
//                   />
//                   <YAxis
//                     tick={{ fill: '#22325c', fontSize: 12 }}
//                     axisLine={false}
//                     tickLine={false}
//                     tickFormatter={(v) => `${v}h`}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       background: 'rgba(255,255,255,0.96)',
//                       border: '1px solid rgba(34,50,92,0.12)',
//                       borderRadius: '12px',
//                       boxShadow: '0 10px 30px rgba(34,64,114,0.12)',
//                     }}
//                     formatter={(value) => [`${value} hrs`, 'Study Hours']}
//                   />
//                   <Legend
//                     wrapperStyle={{ fontSize: 12 }}
//                     formatter={() => 'Study Hours'}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="hours"
//                     stroke="url(#lineGradient)"
//                     strokeWidth={3}
//                     dot={{ fill: '#4682dc', strokeWidth: 0, r: 5 }}
//                     activeDot={{ r: 7, fill: '#4682dc', stroke: '#fff', strokeWidth: 2 }}
//                   />
//                   <defs>
//                     <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
//                       <stop offset="0%" stopColor="#4682dc" />
//                       <stop offset="100%" stopColor="#8b5cf6" />
//                     </linearGradient>
//                   </defs>
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Analytics;


// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   Legend,
// } from "recharts";

// import { FiClock, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
// import "../styles/analytics.css";

// import {
//   getWeeklyStudyHours,
//   getSubjectDistribution,
//   getSummary,
//   getProductivityTrend,
// } from "../data/analyticsData";

// function SummaryCard({ icon: Icon, label, value, suffix }) {
//   return (
//     <div className="analytics-summary-card">
//       <div className="analytics-summary-icon">
//         <Icon />
//       </div>
//       <div>
//         <div className="analytics-summary-value">
//           {value}{suffix}
//         </div>
//         <div className="analytics-summary-label">{label}</div>
//       </div>
//     </div>
//   );
// }

// function Analytics() {
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [subjectData, setSubjectData] = useState([]);
//   const [summary, setSummary] = useState({});
//   const [productivityData, setProductivityData] = useState([]);

//   const loadData = () => {
//     setWeeklyData(getWeeklyStudyHours());
//     setSubjectData(getSubjectDistribution());
//     setSummary(getSummary());
//     setProductivityData(getProductivityTrend());
//   };

//   useEffect(() => {
//     loadData();

//     window.addEventListener("planner-tasks-updated", loadData);

//     return () =>
//       window.removeEventListener("planner-tasks-updated", loadData);
//   }, []);

//   return (
//     <div className="analytics-page">
//       <h1>Study Performance Analytics</h1>

//       {/* 🔹 Summary */}
//       <div className="analytics-summary-grid">
//         <SummaryCard
//           icon={FiClock}
//           label="Total Study Hours"
//           value={summary.totalStudyHours || 0}
//           suffix=" hrs"
//         />
//         <SummaryCard
//           icon={FiCheckCircle}
//           label="Completed Tasks"
//           value={summary.completedTasks || 0}
//         />
//         <SummaryCard
//           icon={FiTrendingUp}
//           label="Consistency"
//           value={summary.studyConsistency || 0}
//           suffix="%"
//         />
//       </div>

//       {/* 🔹 BAR */}
//       <div className="analytics-chart-card">
//         <h2>Weekly Study Hours</h2>

//         <ResponsiveContainer width="100%" height={280}>
//           <BarChart data={weeklyData}>
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//             <XAxis dataKey="day" />
//             <YAxis tickFormatter={(v) => `${v} hrs`} />
//             <Tooltip formatter={(v) => `${v} hrs`} />

//             <Bar
//               dataKey="hours"
//               fill="#4f8dfd"
//               radius={[10, 10, 0, 0]}
//               barSize={35}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 🔹 50-50 Layout */}
//       <div className="analytics-row">

//         {/* PIE */}
//         <div className="analytics-chart-card half">
//           <h3>Subject Distribution</h3>

//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie data={subjectData} dataKey="value">
//                 {subjectData.map((e, i) => (
//                   <Cell key={i} fill={e.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* LINE */}
//         <div className="analytics-chart-card half">
//           <h3>Productivity Trend</h3>

//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={productivityData}>
//               <XAxis dataKey="week" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="hours"
//                 stroke="#8b5cf6"
//                 strokeWidth={3}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Analytics;

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

import { FiClock, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import "../styles/analytics.css";

import {
  getWeeklyStudyHours,
  getSubjectDistribution,
  getSummary,
  getProductivityTrend,
} from "../data/analyticsData";

// 🔹 Summary Card
function SummaryCard({ icon: Icon, label, value, suffix }) {
  return (
    <div className="analytics-summary-card">
      <div className="analytics-summary-icon">
        <Icon />
      </div>
      <div>
        <div className="analytics-summary-value">
          {value}{suffix}
        </div>
        <div className="analytics-summary-label">{label}</div>
      </div>
    </div>
  );
}

function Analytics() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [summary, setSummary] = useState({});
  const [productivityData, setProductivityData] = useState([]);

  // 🔥 LOAD DATA
  const loadData = () => {
    setWeeklyData(getWeeklyStudyHours());
    setSubjectData(getSubjectDistribution());
    setSummary(getSummary());
    setProductivityData(getProductivityTrend());
  };

  useEffect(() => {
    loadData();

    window.addEventListener("planner-tasks-updated", loadData);

    return () =>
      window.removeEventListener("planner-tasks-updated", loadData);
  }, []);

  const hasData = weeklyData.some((d) => d.hours > 0);

  return (
    <div className="analytics-page">

      <h1 className="analytics-heading">
        Study Performance Analytics
      </h1>

      <p className="analytics-subheading">
        Track your study hours, consistency, and progress 📊
      </p>

      {/* 🔹 Summary */}
      <div className="analytics-summary-grid">
        <SummaryCard
          icon={FiClock}
          label="Total Study Hours"
          value={summary.totalStudyHours || 0}
          suffix=" hrs"
        />
        <SummaryCard
          icon={FiCheckCircle}
          label="Completed Tasks"
          value={summary.completedTasks || 0}
        />
        <SummaryCard
          icon={FiTrendingUp}
          label="Consistency"
          value={summary.studyConsistency || 0}
          suffix="%"
        />
      </div>

      {/* 🔹 BAR CHART */}
      <div className="analytics-chart-card">
        <h2 className="analytics-chart-title">Weekly Study Hours</h2>

        {!hasData ? (
          <p className="analytics-empty">
            No study data yet. Add tasks in planner 📅
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={weeklyData}
              margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f8dfd" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(34, 50, 92, 0.1)" />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
              />

              <YAxis
                tickFormatter={(v) => `${v}h`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 13 }}
              />

              <Tooltip
                formatter={(v) => [`${v} hrs`, "Study Hours"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
                cursor={{ fill: "rgba(79, 141, 253, 0.05)" }}
              />

              <Bar
                dataKey="hours"
                fill="url(#colorHours)"
                radius={[8, 8, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 🔹 50-50 Layout */}
      <div className="analytics-row">

        {/* PIE */}
        <div className="analytics-chart-card half">
          <h3 className="analytics-chart-title">
            Subject Distribution
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={subjectData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {subjectData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="analytics-chart-card half">
          <h3 className="analytics-chart-title">
            Productivity Trend
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={productivityData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(34, 50, 92, 0.1)" />

              <XAxis 
                dataKey="week" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 13 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}h`}
                tick={{ fill: '#64748b', fontSize: 13 }}
              />

              <Tooltip 
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              />
              <Legend verticalAlign="top" height={36}/>

              <Area
                type="monotone"
                dataKey="hours"
                stroke="#8b5cf6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorProd)"
                name="Study Hours"
                activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Analytics;