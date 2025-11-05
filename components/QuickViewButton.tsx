'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import QuickViewModal from './QuickViewModal'

export default function QuickViewButton({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
        }}
        className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-ocean-darkGray rounded-lg text-xs font-semibold hover:bg-white transition shadow-sm opacity-0 group-hover:opacity-100"
      >
        <div className="flex items-center gap-1">
          <Eye size={14} />
          <span>Quick View</span>
        </div>
      </button>
      <QuickViewModal product={product} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

