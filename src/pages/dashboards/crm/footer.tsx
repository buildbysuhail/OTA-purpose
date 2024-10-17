// import Link from 'next/link'
// import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="flex justify-around items-center h-16">

        <a href="/" className="flex flex-col items-center text-gray-600">
          <i className="ti ti-home w-6 h-6 text-[23px]"></i>
          <span className="text-xs mt-1">HOME</span>
        </a>
        <a href="/settings/_/system/counters" className="flex flex-col items-center text-gray-600">
          <i className="ti ti-chart-bar  w-6 h-6 text-[23px]"></i>
          <span className="text-xs mt-1">DASHBOARD</span>
        </a>
        <a href="/settings/_/system/notification-settings" className="flex flex-col items-center text-gray-600">
          <i className="ti ti-package  w-6 h-6 text-[23px]"></i>
          <span className="text-xs mt-1">ITEMS</span>
        </a>
        <button className="flex flex-col items-center text-gray-600">
          <i className="ti ti-menu-2  w-6 h-6 text-[23px]"></i>
          <span className="text-xs mt-1">MENU</span>
        </button>
      </nav>
    </footer>
  )
}