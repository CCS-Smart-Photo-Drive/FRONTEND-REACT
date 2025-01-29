import React from "react"
import { UserGroupIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline"

const CardContainer = ({ taskCount }) => {
  const cardData = [
    { title: "Total Users", value: "1,234", icon: UserGroupIcon },
    { title: "Events", value: `${taskCount}/50`, icon: ClipboardDocumentListIcon },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="bg-black rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <card.icon className="w-12 h-12 text-blue-900 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">{card.title}</h3>
          <p className="text-3xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  )
}

export default CardContainer

