"use client";

import Link from "next/link";

interface DashboardCardProps {
  title: string;
  description?: string;
  link?: string;
  icon: string;
  value?: string | number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  link,
  icon,
  value,
}) => {
  const cardContent = (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      {value !== undefined ? (
        <div className="mt-4">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mt-2 mb-4">{description}</p>
          <div className="text-indigo-600 hover:text-indigo-700 font-medium">
            Go to {title} →
          </div>
        </>
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{cardContent}</Link>;
  }

  return cardContent;
};

export default DashboardCard;