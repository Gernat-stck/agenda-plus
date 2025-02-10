import Image from "next/image";
import React from "react";
export default function Header({
  title,
  subtitle,
  userName,
  userRole,
}: {
  title: string;
  subtitle: string;
  userName: string;
  userRole: string;
}) {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <span className="text-2xl text-purple-600">- {subtitle}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium text-gray-800">{userName}</p>
          <p className="text-sm text-gray-500">{userRole}</p>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
          <Image
            src="/usericon.svg"
            alt="Profile"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
