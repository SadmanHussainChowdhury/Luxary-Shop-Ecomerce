'use client'

import { Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SocialShareProps {
  title: string
  url: string
  description?: string
}

export default function SocialShare({ title, url, description }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition shadow-sm"
        title="Share product"
      >
        <Share2 size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-0 top-10 bg-white rounded-lg shadow-xl p-3 z-50 min-w-[200px]"
            >
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded hover:bg-ocean-lightest transition"
                >
                  <Facebook size={20} className="text-blue-600" />
                  <span className="text-xs">Facebook</span>
                </a>
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded hover:bg-ocean-lightest transition"
                >
                  <Twitter size={20} className="text-sky-500" />
                  <span className="text-xs">Twitter</span>
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded hover:bg-ocean-lightest transition"
                >
                  <Linkedin size={20} className="text-blue-700" />
                  <span className="text-xs">LinkedIn</span>
                </a>
                <a
                  href={shareLinks.email}
                  className="flex flex-col items-center gap-2 p-3 rounded hover:bg-ocean-lightest transition"
                >
                  <Mail size={20} className="text-ocean-gray" />
                  <span className="text-xs">Email</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

