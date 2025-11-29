import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">EmailAI</div>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Generate Personalized<br />Cold Emails in Seconds
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop spending 15 minutes researching each lead. Our AI does deep research 
          and writes manual-quality emails that get 8-12% reply rates.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial - 10 Emails Free
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline" className="text-lg px-8">
              See How It Works
            </Button>
          </Link>
        </div>
        
        {/* Social Proof */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Trusted by sales teams at growing companies</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">15 min</div>
            <div className="text-gray-600">Saved per lead</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">8-12%</div>
            <div className="text-gray-600">Reply rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">60 sec</div>
            <div className="text-gray-600">Processing time</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-white">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mx-auto mb-4">1</div>
            <h3 className="font-semibold mb-2">Upload CSV</h3>
            <p className="text-sm text-gray-600">Import leads from Apollo, LinkedIn, or any source</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mx-auto mb-4">2</div>
            <h3 className="font-semibold mb-2">AI Research</h3>
            <p className="text-sm text-gray-600">We scrape LinkedIn, company sites, and news</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mx-auto mb-4">3</div>
            <h3 className="font-semibold mb-2">Review Emails</h3>
            <p className="text-sm text-gray-600">Edit, regenerate, or approve each email</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mx-auto mb-4">4</div>
            <h3 className="font-semibold mb-2">Export & Send</h3>
            <p className="text-sm text-gray-600">Download CSV for Instantly, Smartlead, etc.</p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Free Trial</h3>
            <div className="text-3xl font-bold mb-4">$0</div>
            <p className="text-gray-600 mb-6">10 emails to test quality</p>
            <ul className="space-y-2 text-sm mb-6">
              <li>✓ Full AI research</li>
              <li>✓ All features included</li>
              <li>✓ No credit card required</li>
            </ul>
            <Link href="/sign-up">
              <Button className="w-full">Start Free</Button>
            </Link>
          </div>
          <div className="border-2 border-blue-600 rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <div className="text-3xl font-bold mb-4">$99<span className="text-sm text-gray-600">/mo</span></div>
            <p className="text-gray-600 mb-6">300 emails/month</p>
            <ul className="space-y-2 text-sm mb-6">
              <li>✓ $0.33 per email</li>
              <li>✓ Priority processing</li>
              <li>✓ Email support</li>
            </ul>
            <Link href="/sign-up">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Growth</h3>
            <div className="text-3xl font-bold mb-4">$299<span className="text-sm text-gray-600">/mo</span></div>
            <p className="text-gray-600 mb-6">1,000 emails/month</p>
            <ul className="space-y-2 text-sm mb-6">
              <li>✓ $0.30 per email</li>
              <li>✓ Fastest processing</li>
              <li>✓ Priority support</li>
            </ul>
            <Link href="/sign-up">
              <Button className="w-full" variant="outline">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to 10x Your Outbound?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Start with 10 free emails. No credit card required.
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="text-lg px-8">
            Get Started Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 EmailAI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

