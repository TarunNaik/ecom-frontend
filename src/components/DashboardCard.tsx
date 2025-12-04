"use client";

import Link from "next/link";

interface DashboardCardProps {
  title: string;
  description: string;
  link: string;
  icon: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, link, icon }) => (
  <Link href={link}>
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-indigo-600 hover:text-indigo-700 font-medium">
        Go to {title} →
      </div>
    </div>
  </Link>
);

export default DashboardCard;