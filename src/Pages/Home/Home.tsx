import React from 'react'
import Sidebar from '../../shared/Sidebar'

const Home = () => {
  return (
    <main className="bg-[#f5f7fa] min-w-full font-sans text-[13px] text-[#1f2937]">
      <div className="flex min-h-screen">
        <main className="flex-grow p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-home text-[#374151]"></i>
              <h1 className="font-semibold text-[#111827] text-[14px]">Welcome!</h1>
              <p className="text-[#6b7280] text-[12px]">The sky is blue everywhere.</p>
            </div>
            <div className="flex items-center space-x-4 text-[12px] text-[#6b7280] select-none">
              <button className="flex items-center space-x-1 hover:text-[#374151]">
                <i className="fas fa-sliders-h"></i>
                <span>Customize</span>
              </button>
              <button className="bg-[#2563eb] hover:bg-[#1e40af] text-white rounded px-3 py-1 text-[12px] font-semibold">
                Manage System
              </button>
              <button className="bg-[#4b9440] hover:bg-[#3a6d30] text-white rounded px-3 py-1 text-[12px] font-semibold flex items-center space-x-1">
                <i className="fas fa-plus"></i>
                <span>Add Project</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            <section className="bg-white rounded shadow w-full md:w-1/2">
              <header className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb]">
                <div className="flex items-center space-x-2 text-[13px] font-semibold text-[#111827]">
                  <span>Work</span>
                  <button aria-label="Full Recap" className="flex items-center space-x-1 text-[#6b7280] hover:text-[#374151]">
                    <i className="fas fa-clock text-[12px]"></i>
                    <span className="text-[12px]">Full Recap</span>
                  </button>
                </div>
                <div className="flex items-center space-x-3 text-[#6b7280] text-[12px] select-none">
                  <button aria-label="Add" className="hover:text-[#374151]">
                    <i className="fas fa-plus"></i>
                  </button>
                  <button aria-label="Filter" className="hover:text-[#374151]">
                    <i className="fas fa-filter"></i>
                  </button>
                </div>
              </header>
              <ul className="divide-y divide-[#e5e7eb]">
                <li className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2 text-[13px] text-[#374151]">
                    <i className="far fa-calendar-alt text-[#9ca3af]"></i>
                    <span>meeting with senior devops</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[12px]">
                    <span className="inline-block w-4 h-4 rounded-full bg-[#fbbf24] text-[#92400e] text-center text-xs font-bold leading-none">A</span>
                    <span className="text-[#3b82f6] hover:underline cursor-pointer">Due Jun 3</span>
                  </div>
                </li>
                <li className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2 text-[13px] text-[#374151]">
                    <i className="far fa-calendar-alt text-[#fbbf24]"></i>
                    <span>onboarding ceremony</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[12px]">
                    <span className="inline-block w-4 h-4 rounded-full bg-[#fbbf24] text-[#92400e] text-center text-xs font-bold leading-none">A</span>
                    <span className="text-[#3b82f6] hover:underline cursor-pointer">Due Jun 5</span>
                  </div>
                </li>
                <li className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2 text-[13px] text-[#374151]">
                    <i className="far fa-calendar-alt text-[#fbbf24]"></i>
                    <span>inviteing memebers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[12px]">
                    <span className="inline-block w-4 h-4 rounded-full bg-[#fbbf24] text-[#92400e] text-center text-xs font-bold leading-none">A</span>
                  </div>
                </li>
              </ul>
            </section>

            <section className="bg-white rounded shadow w-full md:w-1/2">
              <header className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb] text-[13px] font-semibold text-[#111827] select-none">
                <div className="flex items-center space-x-2">
                  <button aria-label="Previous Week" className="hover:text-[#374151]">
                    <i className="fas fa-angle-double-left"></i>
                  </button>
                  <button aria-label="Previous Day" className="hover:text-[#374151]">
                    <i className="fas fa-angle-left"></i>
                  </button>
                  <span>June</span>
                  <button aria-label="Next Day" className="hover:text-[#374151]">
                    <i className="fas fa-angle-right"></i>
                  </button>
                  <button aria-label="Next Week" className="hover:text-[#374151]">
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </div>
                <div className="flex items-center space-x-4 text-[#6b7280] text-[12px]">
                  <button className="hover:text-[#374151]">Day</button>
                  <button className="hover:text-[#374151]">Week</button>
                  <button aria-label="Filter" className="hover:text-[#374151]">
                    <i className="fas fa-filter"></i>
                  </button>
                  <button aria-label="More options" className="hover:text-[#374151]">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </header>
              <div className="grid grid-cols-7 text-[10px] text-[#6b7280] border-b border-[#e5e7eb] select-none">
                <div className="py-1 px-2 border-r border-[#e5e7eb]">SUN</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">MON</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">TUE</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">WED</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">THU</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">FRI</div>
                <div className="py-1 px-2">SAT</div>
              </div>
              <div className="grid grid-cols-7 text-[10px] text-[#6b7280] border-b border-[#e5e7eb] select-none">
                <div className="py-1 px-2 border-r border-[#e5e7eb] bg-[#f9fafb]">1</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb] bg-[#f9fafb] relative">
                  <span className="inline-block w-5 h-5 rounded-full bg-[#3b82f6] text-white text-[10px] font-semibold leading-none text-center absolute -top-1 -left-1 select-none">2</span>
                </div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">3</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">4</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">5</div>
                <div className="py-1 px-2 border-r border-[#e5e7eb]">6</div>
                <div className="py-1 px-2">7</div>
              </div>
              <ul className="divide-y divide-[#e5e7eb] text-[13px] text-[#374151]">
                <li className="flex items-center space-x-2 px-4 py-2">
                  <i className="far fa-calendar-alt text-[#9ca3af]"></i>
                  <span>meeting with senior devops</span>
                  <span className="inline-block w-4 h-4 rounded-full bg-[#fbbf24] text-[#92400e] text-center text-xs font-bold leading-none">A</span>
                  <span className="text-[#3b82f6] hover:underline cursor-pointer text-[12px]">Due Jun 3</span>
                </li>
                <li className="flex items-center space-x-2 px-4 py-2">
                  <i className="far fa-calendar-alt text-[#fbbf24]"></i>
                  <span>onboarding ceremony</span>
                  <span className="inline-block w-4 h-4 rounded-full bg-[#fbbf24] text-[#92400e] text-center text-xs font-bold leading-none">A</span>
                  <span className="text-[#3b82f6] hover:underline cursor-pointer text-[12px]">Due Jun 5</span>
                </li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </main>
  )
}

export default Home