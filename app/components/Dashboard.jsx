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
    <div className="min-h-screen bg-[#fff7f3] px-6 py-6 font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1f2937] leading-tight">
            Welcome back 👋
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Here’s the complete overview of your platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[12px] bg-white border border-[#ffe4d6] px-3 py-2 rounded-xl shadow-sm text-gray-600">
            May 01, 2024 - May 31, 2024
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-5 gap-4 mb-5">
        <StatCard
          icon={<FaUniversity />}
          title="Total Colleges"
          value="25"
          sub="+3 this month"
        />
        <StatCard
          icon={<FaUserGraduate />}
          title="Total Students"
          value="12,450"
          sub="+850 this month"
        />
        <StatCard
          icon={<FaKey />}
          title="Active Licenses"
          value="22"
          sub="2 expiring soon"
        />
        <StatCard
          icon={<FaBookOpen />}
          title="Published Courses"
          value="35"
          sub="+4 this month"
        />
        <StatCard
          icon={<FaChartLine />}
          title="Assessments Taken"
          value="8,950"
          sub="+1,280 this month"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-5">
        {/* LICENSE EXPIRING */}
        <div className="col-span-3 bg-white border border-[#ffe4d6] rounded-2xl p-5 shadow-sm">
          <h2 className="text-[14px] font-semibold mb-4">
            License Expiring Soon
          </h2>
          <button className="text-xs text-[#f97316] hover:text-[#ea580c] hover:underline flex items-center gap-1 transition-all duration-200 font-medium">
            View All <i className="fas fa-arrow-right text-[10px]"></i>
          </button>

          <LicenseItem
            name="ABC College of Engineering"
            plan="Premium Plan"
            days="7 days left"
            date="May 08, 2024"
          />
          <LicenseItem
            name="XYZ Institute of Technology"
            plan="Standard Plan"
            days="12 days left"
            date="May 13, 2024"
          />
          <LicenseItem
            name="PQR Group of Colleges"
            plan="Basic Plan"
            days="19 days left"
            date="May 20, 2024"
          />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="col-span-5 bg-white border border-[#ffe4d6] rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-semibold text-gray-700">
              Recent College Activity
            </h2>
            <button className="text-xs text-[#f97316] hover:text-[#ea580c] hover:underline flex items-center gap-1 transition-all duration-200 font-medium">
              View All <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>

          <ActivityItem
            name="MMCOE, Pune"
            sub="120 new students added"
            time="10:30 AM"
          />
          <ActivityItem
            name="PCCOE, Pune"
            sub="80 new students added"
            time="11:15 AM"
          />
          <ActivityItem
            name="VIT, Mumbai"
            sub="60 new students added"
            time="01:20 PM"
          />
          <ActivityItem
            name="DY Patil College"
            sub="45 new students added"
            time="03:30 PM"
          />
          <ActivityItem
            name="LNCT Group, Bhopal"
            sub="30 new students added"
            time="04:45 PM"
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="col-span-4 bg-white border border-[#ffe4d6] rounded-2xl p-5 shadow-sm">
          <h2 className="text-[14px] font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4">
            <ActionCard icon={<FaPlus />} label="Add College" />
            <ActionCard icon={<FaKey />} label="Create License" />
            <ActionCard icon={<FaUserPlus />} label="Add Staff" />
            <ActionCard icon={<FaUpload />} label="Upload Content" />
            <ActionCard icon={<FaBookOpen />} label="Create Course" />
            <ActionCard icon={<FaClipboardList />} label="Create Assessment" />
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-12 gap-5 mt-5">
        {/* RECENT ACTIVITIES */}
        <div className="col-span-7 bg-white border border-[#ffe4d6] rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-semibold">Recent Activities</h2>
            <button className="text-xs text-[#f97316] hover:text-[#ea580c] hover:underline flex items-center gap-1 transition-all duration-200 font-medium">
              View All Activities{" "}
              <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between items-center py-2 border-b border-[#f0f4fa]">
              <div className="flex items-center gap-2">
                <i className="fas fa-plus-circle text-[#10b981] text-sm"></i>
                <span>
                  <strong>New College Added</strong> - MMCOE, Pune has been
                  added to the platform
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[#f0f4fa]">
              <div className="flex items-center gap-2">
                <i className="fas fa-sync-alt text-[#f59e0b] text-sm"></i>
                <span>
                  <strong>License Renewed</strong> - ABC College of Engineering
                  license renewed
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[#f0f4fa]">
              <div className="flex items-center gap-2">
                <i className="fas fa-graduation-cap text-[#8b5cf6] text-sm"></i>
                <span>
                  <strong>New Course Published</strong> - Business English
                  Communication course published
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[#f0f4fa]">
              <div className="flex items-center gap-2">
                <i className="fas fa-user-plus text-[#3b82f6] text-sm"></i>
                <span>
                  <strong>New Staff Added</strong> - Rahul Sharma joined as
                  College Staff
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[#f0f4fa]">
              <div className="flex items-center gap-2">
                <i className="fas fa-trophy text-[#ef4444] text-sm"></i>
                <span>
                  <strong>1000 Students Completed Course</strong> - Business
                  English Communication course completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PLATFORM OVERVIEW */}
        <div className="col-span-5 bg-white border border-[#ffe4d6] rounded-2xl p-5 shadow-sm">
          <h2 className="text-[14px] font-semibold mb-3">Platform Overview</h2>

          <div className="text-[28px] font-bold text-gray-800">12,450</div>
          <p className="text-[12px] text-gray-500 mb-4">Total Students</p>

          {/* CHART (MATCHED HEIGHT STYLE FROM IMAGE) */}
          <div className="h-36 flex items-end gap-2 p-3 rounded-xl bg-gradient-to-r from-orange-100 to-orange-50">
            <Bar h="35%" />
            <Bar h="55%" />
            <Bar h="45%" />
            <Bar h="70%" />
            <Bar h="85%" />
            <Bar h="60%" />
            <Bar h="78%" />
          </div>

          {/* MINI STATS */}
          <div className="grid grid-cols-3 gap-3 mt-4 text-[12px]">
            <MiniStat label="Total Content" value="1,250" />
            <MiniStat label="Total Staff" value="48" />
            <MiniStat label="Assessments" value="320" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ icon, title, value, sub }) {
  return (
    <div className="bg-white border border-[#ffe4d6] rounded-xl p-4 flex items-center gap-3 shadow-sm h-24">
      <div className="text-orange-500 text-[18px] bg-orange-50 p-2 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-[12px] text-gray-500">{title}</p>
        <p className="text-[18px] font-semibold text-gray-800">{value}</p>
        <p className="text-[11px] text-green-600">{sub}</p>
      </div>
    </div>
  );
}

function LicenseItem({ name, plan, days, date }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#f3e0d6]">
      <div>
        <p className="text-[13px] font-medium">{name}</p>
        <p className="text-[11px] text-gray-500">{plan}</p>
      </div>
      <div className="text-right">
        <p className="text-[11px] text-orange-500 font-semibold">{days}</p>
        <p className="text-[11px] text-gray-400">{date}</p>
      </div>
    </div>
  );
}

function ActivityItem({ name, sub, time }) {
  return (
    <div className="flex justify-between py-3 border-b border-[#f3e0d6] text-[13px]">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-[11px] text-gray-500">{sub}</p>
      </div>
      <p className="text-[11px] text-gray-400">{time}</p>
    </div>
  );
}

function Row({ text, time }) {
  return (
    <div className="flex justify-between border-b border-[#f3e0d6] pb-2">
      <p className="text-gray-600">{text}</p>
      <p className="text-gray-400 text-[11px]">{time}</p>
    </div>
  );
}

function ActionCard({ icon, label }) {
  return (
    <div className="border border-[#ffe4d6] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition h-20">
      <div className="text-orange-500">{icon}</div>
      <p className="text-[11px] text-center">{label}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <p className="font-semibold text-[13px]">{value}</p>
      <p className="text-gray-500 text-[11px]">{label}</p>
    </div>
  );
}

function Bar({ h }) {
  return <div className="w-3 bg-orange-400 rounded-md" style={{ height: h }} />;
}
