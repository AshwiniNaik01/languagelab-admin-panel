"use client";

export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">

      {/* Welcome Banner */}
      <div className="rounded-3xl bg-white border border-orange-100 p-8 shadow-sm">
        <div className="h-8 w-72 rounded-lg bg-orange-100 mb-4"></div>
        <div className="h-4 w-96 rounded-lg bg-orange-50"></div>

        <div className="flex gap-4 mt-8">
          <div className="h-11 w-36 rounded-xl bg-orange-100"></div>
          <div className="h-11 w-32 rounded-xl bg-orange-50"></div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-3xl bg-white border border-orange-100 p-6 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="h-4 w-24 rounded bg-orange-100 mb-4"></div>
                <div className="h-8 w-20 rounded bg-orange-200 mb-3"></div>
                <div className="h-3 w-28 rounded bg-orange-50"></div>
              </div>

              <div className="h-16 w-16 rounded-2xl bg-orange-100"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Chart */}
        <div className="xl:col-span-2 rounded-3xl bg-white border border-orange-100 p-6 shadow-sm">
          <div className="h-5 w-48 rounded bg-orange-100 mb-8"></div>

          <div className="flex items-end justify-between h-72">
            {[45, 80, 60, 120, 90, 150, 100].map((height, index) => (
              <div
                key={index}
                className="w-10 rounded-t-xl bg-orange-100"
                style={{ height }}
              ></div>
            ))}
          </div>
        </div>

        {/* Right Activity */}
        <div className="rounded-3xl bg-white border border-orange-100 p-6 shadow-sm">
          <div className="h-5 w-40 rounded bg-orange-100 mb-8"></div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div className="flex gap-4 items-center" key={item}>
                <div className="h-12 w-12 rounded-full bg-orange-100"></div>

                <div className="flex-1">
                  <div className="h-4 w-36 rounded bg-orange-100 mb-2"></div>
                  <div className="h-3 w-24 rounded bg-orange-50"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {[1, 2].map((item) => (
          <div
            key={item}
            className="rounded-3xl bg-white border border-orange-100 p-6 shadow-sm"
          >
            <div className="h-5 w-40 rounded bg-orange-100 mb-6"></div>

            <div className="space-y-5">
              {[1, 2, 3, 4].map((row) => (
                <div
                  key={row}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-100"></div>

                    <div>
                      <div className="h-4 w-32 rounded bg-orange-100 mb-2"></div>
                      <div className="h-3 w-20 rounded bg-orange-50"></div>
                    </div>
                  </div>

                  <div className="h-8 w-16 rounded-full bg-orange-100"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}