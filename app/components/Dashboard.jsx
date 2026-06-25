"use client";

import {
  FaUniversity,
  FaUserGraduate,
  FaKey,
  FaBookOpen,
  FaChartLine,
  FaPlus,
  FaUpload,
  FaClipboardList,
  FaUserPlus,
} from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FFF8F4] px-8 py-8 font-sans space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-orange-500/5 to-amber-500/5 p-6 rounded-3xl border border-orange-500/10 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#3C1E0A] leading-tight tracking-tight">
            Welcome back, Curator 👋
          </h1>
          <p className="text-xs md:text-sm text-orange-950/70 font-semibold mt-1">
            System overview and active statistics dashboard is live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-black text-[#3C1E0A] bg-white border border-orange-500/20 px-4 py-2.5 rounded-2xl shadow-sm">
            📅 Active Session: May 2026
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={<FaUniversity className="text-[#3C1E0A]" />}
          title="Total Institutes"
          value="25 Registered"
          sub="+3 institutes this month"
          color="from-orange-400 to-amber-400"
        />
        <StatCard
          icon={<FaUserGraduate className="text-[#3C1E0A]" />}
          title="Total Students"
          value="12,450 Users"
          sub="+850 enrolled this month"
          color="from-amber-400 to-yellow-400"
        />
        <StatCard
          icon={<FaKey className="text-[#3C1E0A]" />}
          title="Active Licenses"
          value="22 Assigned"
          sub="2 keys expiring shortly"
          color="from-orange-500 to-orange-400"
        />
        <StatCard
          icon={<FaBookOpen className="text-[#3C1E0A]" />}
          title="Published Courses"
          value="35 Materials"
          sub="+4 modules added this week"
          color="from-amber-500 to-orange-400"
        />
        <StatCard
          icon={<FaChartLine className="text-[#3C1E0A]" />}
          title="Assessments Taken"
          value="8,950 Tests"
          sub="+1,280 submitted recently"
          color="from-yellow-400 to-orange-400"
        />
      </div>

      {/* MAIN CONTENT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LICENSE MONITOR */}
        <div className="lg:col-span-4 bg-white border border-orange-500/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-black text-[#3C1E0A] uppercase tracking-wider">
                License Monitors
              </h2>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full font-black uppercase tracking-widest">
                Action Required
              </span>
            </div>

            <div className="space-y-4">
              <LicenseItem
                name="ABC Institute of Engineering"
                plan="Premium License Package"
                days="7 days left"
                date="Exp: May 08, 2026"
                urgency="high"
              />
              <LicenseItem
                name="XYZ Institute of Technology"
                plan="Standard License Package"
                days="12 days left"
                date="Exp: May 13, 2026"
                urgency="medium"
              />
              <LicenseItem
                name="PQR Group of Institutes"
                plan="Basic Academic Package"
                days="19 days left"
                date="Exp: May 20, 2026"
                urgency="low"
              />
            </div>
          </div>
          <button className="w-full text-center mt-6 py-2.5 rounded-xl border border-orange-500/10 text-xs font-black text-orange-700 hover:bg-orange-50 transition duration-300">
            View All License Ledgers
          </button>
        </div>

        {/* COLLEGE ACTIVITY LEDGER */}
        <div className="lg:col-span-4 bg-white border border-orange-500/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-black text-[#3C1E0A] uppercase tracking-wider">
                Institute Activity
              </h2>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-black uppercase tracking-widest">
                Live Feed
              </span>
            </div>

            <div className="space-y-4">
              <ActivityItem
                name="MMCOE, Pune"
                sub="120 new students onboarded"
                time="10:30 AM"
              />
              <ActivityItem
                name="PCCOE, Pune"
                sub="80 new students onboarded"
                time="11:15 AM"
              />
              <ActivityItem
                name="VIT, Mumbai"
                sub="60 new students onboarded"
                time="01:20 PM"
              />
              <ActivityItem
                name="DY Patil Institute"
                sub="45 new students onboarded"
                time="03:30 PM"
              />
            </div>
          </div>
          <button className="w-full text-center mt-6 py-2.5 rounded-xl border border-orange-500/10 text-xs font-black text-orange-700 hover:bg-orange-50 transition duration-300">
            Export Live Ledger Log
          </button>
        </div>

        {/* QUICK MANAGEMENT PANEL */}
        <div className="lg:col-span-4 bg-white border border-orange-500/20 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-black text-[#3C1E0A] uppercase tracking-wider mb-6">
            Quick Management
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <ActionCard icon={<FaPlus />} label="Add Institute" link="/institutes/new" />
            <ActionCard icon={<FaKey />} label="Issue License" link="/licenses/new" />
            <ActionCard icon={<FaUserPlus />} label="Register Editor" link="/editors/new" />
            <ActionCard icon={<FaUpload />} label="Upload Material" link="/content" />
            <ActionCard icon={<FaBookOpen />} label="Manage Curriculum" link="/content" />
            <ActionCard icon={<FaClipboardList />} label="Configure Testing" link="/sessions" />
          </div>
        </div>

      </div>

      {/* PLATFORM METRICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT AUDIT LOG */}
        <div className="lg:col-span-8 bg-white border border-orange-500/20 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-black text-[#3C1E0A] uppercase tracking-wider mb-6">
            Recent Audit Log
          </h2>

          <div className="space-y-4">
            <AuditItem
              type="add"
              title="New Institute Registered"
              desc="MMCOE, Pune was registered onto the platform database."
              time="1 hour ago"
            />
            <AuditItem
              type="renew"
              title="License Agreement Extended"
              desc="ABC Institute of Engineering license terms were renewed."
              time="3 hours ago"
            />
            <AuditItem
              type="publish"
              title="Curriculum Update Published"
              desc="'Business Communication Essentials' course modules are now live."
              time="5 hours ago"
            />
            <AuditItem
              type="staff"
              title="Instructor Access Created"
              desc="Instructor profile initialized for Prof. Rahul Sharma."
              time="1 day ago"
            />
          </div>
        </div>

        {/* PLATFORM ENGAGEMENT */}
        <div className="lg:col-span-4 bg-white border border-orange-500/20 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-black text-[#3C1E0A] uppercase tracking-wider mb-4">
            User Engagement
          </h2>

          <div className="mb-4">
            <div className="text-3xl font-black text-[#3C1E0A]">12,450</div>
            <p className="text-xs text-orange-950/60 font-bold">Total Platform Active Students</p>
          </div>

          {/* TRANSITIONAL MINI BAR CHART */}
          <div className="h-32 flex items-end gap-2.5 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 mb-4">
            <Bar h="35%" />
            <Bar h="55%" />
            <Bar h="45%" />
            <Bar h="70%" />
            <Bar h="85%" />
            <Bar h="60%" />
            <Bar h="78%" />
          </div>

          {/* KEY METRIC LABELS */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-orange-500/10">
            <div>
              <p className="font-black text-sm text-[#3C1E0A]">1.2k</p>
              <p className="text-[10px] text-orange-950/60 font-bold uppercase tracking-tight">Units</p>
            </div>
            <div>
              <p className="font-black text-sm text-[#3C1E0A]">48</p>
              <p className="text-[10px] text-orange-950/60 font-bold uppercase tracking-tight">Curators</p>
            </div>
            <div>
              <p className="font-black text-sm text-[#3C1E0A]">320</p>
              <p className="text-[10px] text-orange-950/60 font-bold uppercase tracking-tight">Tests</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- CHILD COMPONENTS ---------------- */

function StatCard({ icon, title, value, sub, color }) {
  return (
    <div className="bg-white border border-orange-500/20 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-orange-500/40 transition duration-300 h-32">
      {/* Decorative Gradient Tag */}
      <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${color}`} />
      
      <div className="flex justify-between items-start">
        <span className="text-xs font-black text-orange-950/60 uppercase tracking-widest">{title}</span>
        <div className="bg-orange-500/10 p-2 rounded-xl">
          {icon}
        </div>
      </div>

      <div className="mt-2">
        <p className="text-lg font-black text-[#3C1E0A] tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-green-600 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function LicenseItem({ name, plan, days, date, urgency }) {
  const badgeColor = 
    urgency === "high" ? "text-red-600 bg-red-50 border-red-200" :
    urgency === "medium" ? "text-orange-600 bg-orange-50 border-orange-200" :
    "text-amber-600 bg-amber-50 border-amber-200";

  return (
    <div className="flex justify-between items-center py-3 border-b border-orange-500/10">
      <div>
        <p className="text-xs font-black text-[#3C1E0A]">{name}</p>
        <p className="text-[10px] text-orange-950/60 font-bold mt-0.5">{plan}</p>
      </div>
      <div className="text-right">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${badgeColor}`}>
          {days}
        </span>
        <p className="text-[9px] font-bold text-orange-950/50 mt-1 uppercase tracking-wider">{date}</p>
      </div>
    </div>
  );
}

function ActivityItem({ name, sub, time }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-orange-500/10">
      <div>
        <p className="text-xs font-black text-[#3C1E0A]">{name}</p>
        <p className="text-[10px] text-orange-950/60 font-bold mt-0.5">{sub}</p>
      </div>
      <span className="text-[10px] font-black text-[#3C1E0A]/60 bg-orange-500/5 px-2 py-0.5 rounded-lg border border-orange-500/10">
        {time}
      </span>
    </div>
  );
}

function ActionCard({ icon, label, link }) {
  return (
    <a
      href={link}
      className="border border-orange-500/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 bg-[#FFF8F4]/50 hover:bg-gradient-to-br hover:from-orange-500 hover:to-amber-500 hover:text-white text-orange-700 hover:border-transparent transition duration-300 shadow-sm hover:shadow-md hover:shadow-orange-500/10 group cursor-pointer h-24"
    >
      <div className="text-lg text-[#3C1E0A] group-hover:text-white transition duration-300">
        {icon}
      </div>
      <p className="text-[10px] font-black text-center text-[#3C1E0A] group-hover:text-white tracking-widest uppercase transition duration-300">
        {label}
      </p>
    </a>
  );
}

function AuditItem({ type, title, desc, time }) {
  const icon = 
    type === "add" ? "✨" :
    type === "renew" ? "🔄" :
    type === "publish" ? "📚" : "👤";

  return (
    <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-orange-500/5 border border-transparent hover:border-orange-500/10 transition duration-300">
      <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-sm">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black text-[#3C1E0A]">{title}</h4>
          <span className="text-[9px] font-bold text-orange-950/50 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-[11px] text-orange-950/70 font-semibold mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function Bar({ h }) {
  return (
    <div className="flex-1 bg-gradient-to-t from-orange-600 to-amber-500 rounded-lg shadow-sm hover:opacity-85 transition duration-300 cursor-pointer" style={{ height: h }} />
  );
}
