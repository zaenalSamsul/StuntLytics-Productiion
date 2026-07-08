'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Heart, Zap, Users, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">About StuntLytics</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        
        {/* Mission Section */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To empower healthcare organizations and government agencies with intelligent data analytics tools that prevent stunting, improve child nutrition, and save lives through informed decision-making.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that every child deserves optimal health outcomes. By combining cutting-edge technology with deep healthcare expertise, StuntLytics transforms raw health data into actionable insights that drive real-world impact.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 border border-primary/20">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Health First</h3>
                    <p className="text-sm text-muted-foreground">Every decision is guided by child health outcomes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Real Impact</h3>
                    <p className="text-sm text-muted-foreground">Measurable improvements in stunting prevention</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-tertiary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Empowering Teams</h3>
                    <p className="text-sm text-muted-foreground">Tools for healthcare workers at every level</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-12 bg-muted rounded-2xl px-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">The Challenge We Solve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-3">149M</div>
              <p className="text-muted-foreground">Children under 5 suffering from stunting globally, impacting their development and future potential</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-3">Data Gap</div>
              <p className="text-muted-foreground">Healthcare organizations lack real-time analytics to make informed decisions about interventions</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-3">Speed</div>
              <p className="text-muted-foreground">Manual data analysis delays action, allowing preventable cases to worsen</p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Solution</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Real-Time Monitoring</h3>
                  <p className="text-muted-foreground">Track stunting prevalence and health metrics as they happen with live dashboards</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Predictive Analytics</h3>
                  <p className="text-muted-foreground">AI identifies high-risk families early for targeted nutrition interventions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Geographic Intelligence</h3>
                  <p className="text-muted-foreground">Interactive maps show regional risk patterns for resource allocation</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Actionable Insights</h3>
                  <p className="text-muted-foreground">Turn complex health data into clear recommendations for decision makers</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-12 flex items-center justify-center min-h-96">
              <div className="text-center">
                <Globe className="w-24 h-24 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Healthcare Intelligence at Scale</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-12 bg-primary text-white rounded-2xl px-12">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-3">15K+</div>
              <p className="text-primary-light">Children monitored and protected</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-3">342</div>
              <p className="text-primary-light">Healthcare workers empowered</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-3">27%</div>
              <p className="text-primary-light">Improvement in early detection</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-3">98%</div>
              <p className="text-primary-light">Data accuracy verified</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Built by Healthcare Experts</h2>
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our team combines deep healthcare domain expertise with cutting-edge data science and product design to create solutions that truly matter.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: 'Pediatric Nutrition', name: 'Health Specialists' },
              { role: 'Data Science', name: 'ML Engineers' },
              { role: 'Product Design', name: 'UX Experts' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 rounded-xl border border-border hover:border-primary/30 transition">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4"></div>
                <h3 className="font-semibold text-foreground text-lg mb-1">{item.name}</h3>
                <p className="text-muted-foreground">{item.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 border border-border rounded-xl hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground mb-3">Integrity</h3>
              <p className="text-muted-foreground">We handle sensitive health data with utmost responsibility and transparency, maintaining highest privacy and security standards.</p>
            </div>
            <div className="p-8 border border-border rounded-xl hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground mb-3">Innovation</h3>
              <p className="text-muted-foreground">We continuously improve our technology to deliver cutting-edge solutions that advance health outcomes.</p>
            </div>
            <div className="p-8 border border-border rounded-xl hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground mb-3">Accessibility</h3>
              <p className="text-muted-foreground">Our tools are designed for healthcare workers at all technical levels, from field workers to policy makers.</p>
            </div>
            <div className="p-8 border border-border rounded-xl hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground mb-3">Impact</h3>
              <p className="text-muted-foreground">Every feature we build is measured by its real-world impact on child health prevention and outcomes.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Join Us in Transforming Health</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a healthcare provider, government agency, or nonprofit, StuntLytics is here to support your mission of improving child health outcomes.
          </p>
          <Link href="/dashboard" className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium">
            Explore the Platform
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 StuntLytics. Empowering health through intelligent data.</p>
        </div>
      </footer>
    </div>
  )
}
