import Link from 'next/link'
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - Luxury Shop',
  description: 'Privacy policy for Luxury Shop.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest via-white to-ocean-lighter">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Lock size={48} className="text-premium-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-ocean-darkGray mb-4">
            Privacy Policy
          </h1>
          <p className="text-ocean-gray">Last updated: January 1, 2025</p>
        </div>

        <div className="bg-white border border-ocean-border rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">1. Introduction</h2>
            <p className="text-ocean-gray leading-relaxed">
              At Luxury Shop, we respect your privacy and are committed to protecting your personal 
              data. This privacy policy explains how we collect, use, and safeguard your information 
              when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">2. Information We Collect</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-ocean-gray space-y-2 ml-4">
              <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
              <li><strong>Payment Information:</strong> Credit card details (processed securely through third-party providers)</li>
              <li><strong>Usage Data:</strong> How you interact with our website, pages visited, products viewed</li>
              <li><strong>Device Information:</strong> IP address, browser type, device type</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">3. How We Use Your Information</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-ocean-gray space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and shipping updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">4. Cookies Policy</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">
              We use cookies to enhance your browsing experience. Cookies are small text files stored 
              on your device that help us:
            </p>
            <ul className="list-disc list-inside text-ocean-gray space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and recommendations</li>
              <li>Improve website functionality</li>
            </ul>
            <p className="text-ocean-gray leading-relaxed mt-4">
              You can control cookies through your browser settings. However, disabling cookies may 
              affect website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">5. Data Security</h2>
            <p className="text-ocean-gray leading-relaxed">
              We implement industry-standard security measures to protect your personal information, 
              including SSL encryption, secure payment processing, and regular security audits. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">6. Third-Party Services</h2>
            <p className="text-ocean-gray leading-relaxed">
              We may share your information with trusted third-party service providers who assist us 
              in operating our website, processing payments, shipping orders, and analyzing website 
              usage. These providers are contractually obligated to protect your information.
            </p>
          </section>

          <section id="donotsell">
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">7. Do Not Sell My Information</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">
              We do not sell your personal information to third parties. However, if you wish to 
              opt-out of data sharing for marketing purposes, you can:
            </p>
            <ul className="list-disc list-inside text-ocean-gray space-y-2 ml-4">
              <li>Unsubscribe from our marketing emails</li>
              <li>Contact us at privacy@luxuryshop.com</li>
              <li>Update your preferences in your account settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">8. Your Rights</h2>
            <p className="text-ocean-gray leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-ocean-gray space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ocean-darkGray mb-4">9. Contact Us</h2>
            <p className="text-ocean-gray leading-relaxed">
              If you have questions about this privacy policy, please contact us:
            </p>
            <div className="mt-4 p-4 bg-ocean-lightest rounded-lg">
              <p className="text-ocean-darkGray font-semibold">Privacy Officer</p>
              <p className="text-ocean-gray">Email: privacy@luxuryshop.com</p>
              <p className="text-ocean-gray">Phone: +1 (555) 123-4567</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

