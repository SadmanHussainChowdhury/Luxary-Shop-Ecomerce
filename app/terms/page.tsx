import Link from 'next/link'
import { Shield, FileText, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions - Luxury Shop',
  description: 'Terms and conditions for using Luxury Shop.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Shield size={48} className="text-premium-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-ocean-darkGray mb-4">
            Terms & Conditions
          </h1>
          <p className="text-ocean-gray">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white border border-ocean-border rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">1. Agreement to Terms</h2>
            <p className="text-ocean-gray leading-relaxed">
              By accessing and using Luxury Shop, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">2. Use License</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials on Luxury Shop's 
              website for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-ocean-gray leading-relaxed">
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-ocean-gray space-y-2 mt-4 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section id="refund">
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">3. Refund Policy</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">
              We offer a 30-day return policy on all items. To be eligible for a return:
            </p>
            <ul className="list-disc list-inside text-ocean-gray space-y-2 ml-4">
              <li>Items must be unused and in original packaging</li>
              <li>Items must have all tags attached</li>
              <li>Returns must be initiated within 30 days of delivery</li>
            </ul>
            <p className="text-ocean-gray leading-relaxed mt-4">
              Refunds will be processed within 5-10 business days after we receive your returned item.
            </p>
          </section>

          <section id="warranty">
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">4. Warranty</h2>
            <p className="text-ocean-gray leading-relaxed">
              All products come with a manufacturer's warranty. Warranty terms vary by product 
              and manufacturer. Please refer to individual product pages for specific warranty 
              information. Luxury Shop will facilitate warranty claims on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">5. Disclaimer</h2>
            <p className="text-ocean-gray leading-relaxed">
              The materials on Luxury Shop's website are provided on an 'as is' basis. Luxury Shop 
              makes no warranties, expressed or implied, and hereby disclaims and negates all other 
              warranties including, without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property or other 
              violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">6. Limitations</h2>
            <p className="text-ocean-gray leading-relaxed">
              In no event shall Luxury Shop or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on Luxury Shop's website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">7. Contact Information</h2>
            <p className="text-ocean-gray leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-ocean-lightest rounded-lg">
              <p className="text-ocean-darkGray font-semibold">Luxury Shop</p>
              <p className="text-ocean-gray">Email: legal@luxuryshop.com</p>
              <p className="text-ocean-gray">Phone: +1 (555) 123-4567</p>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-premium-gold hover:text-premium-amber font-semibold"
          >
            <AlertCircle size={20} />
            Have Questions? Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

