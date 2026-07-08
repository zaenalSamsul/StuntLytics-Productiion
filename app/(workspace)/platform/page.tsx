'use client'

import Link from 'next/link'
import { ArrowLeft, TrendingUp, BarChart3, Map, Zap, Lock, Cloud } from 'lucide-react'

export default function PlatformPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        
        {/* What is StuntLytics */}
        <section className="py-12">
          <h2 className="text-4xl font-bold text-foreground mb-8 text-center">What is StuntLytics?</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                StuntLytics is a comprehensive health analytics platform built specifically for preventing stunting and improving child nutrition outcomes. It combines real-time data monitoring, predictive intelligence, and geographic analysis to empower healthcare organizations with the tools they need to make informed decisions quickly.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Stunting affects millions of children worldwide, limiting their physical and cognitive development. Our platform helps identify at-risk populations, track intervention effectiveness, and drive resource allocation to where it's needed most.
              </p>
              <Link href="/dashboard" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium">
                Access the Platform
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 border border-primary/20">
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-24 h-24 text-primary/40 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Health Analytics Intelligence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-12">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Core Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            
            {[
              {
                icon: TrendingUp,
                title: 'Executive Dashboard',
                description: 'Real-time KPI monitoring including stunting prevalence, healthcare workforce capacity, immunization coverage, and water/sanitation access metrics.',
                features: ['Live metrics', 'Trend analysis', 'Performance tracking']
              },
              {
                icon: Map,
                title: 'Regional Risk Maps',
                description: 'Interactive geographic visualization showing district-level stunting prevalence with heat mapping, filtering, and drill-down capabilities.',
                features: ['Heat maps', 'Regional filtering', 'Risk zones']
              },
              {
                icon: BarChart3,
                title: 'Data Explorer',
                description: 'Comprehensive data analysis tool with advanced filtering, custom reports, and data export capabilities for detailed investigations.',
                features: ['Custom queries', 'Export tools', 'Data filtering']
              },
              {
                icon: Zap,
                title: 'Predictive Insights',
                description: 'AI-powered analysis that identifies high-risk families and populations, predicting intervention needs before they become critical.',
                features: ['ML predictions', 'Risk scores', 'Recommendations']
              },
              {
                icon: Cloud,
                title: 'Correlation Analysis',
                description: 'Advanced statistical analysis revealing relationships between nutrition, immunization, environmental factors, and health outcomes.',
                features: ['Factor analysis', 'Trend correlation', 'Causality testing']
              },
              {
                icon: Lock,
                title: 'Security & Compliance',
                description: 'Enterprise-grade security with role-based access control, encryption, audit logging, and HIPAA-compliant data handling.',
                features: ['Role-based access', 'Encryption', 'Audit logs']
              }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="p-8 border border-border rounded-xl hover:border-primary/30 transition">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-primary text-xs font-medium rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Data Source Section */}
        <section className="py-12 bg-muted rounded-2xl px-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Data Integration & Sources</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-3">15K+</div>
              <h3 className="font-semibold text-foreground mb-2">Children Tracked</h3>
              <p className="text-muted-foreground">Comprehensive health profiles with longitudinal data tracking</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-3">25+</div>
              <h3 className="font-semibold text-foreground mb-2">Health Indicators</h3>
              <p className="text-muted-foreground">Nutrition, immunization, environmental, and socioeconomic factors</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-tertiary mb-3">Real-Time</div>
              <h3 className="font-semibold text-foreground mb-2">Data Sync</h3>
              <p className="text-muted-foreground">Live updates from healthcare facilities and field workers</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Common Use Cases</h2>
          <div className="space-y-6">
            
            {[
              {
                title: 'Regional Health Departments',
                description: 'Monitor stunting across districts, identify hotspots, and allocate nutrition programs where they&apos;ll have maximum impact.'
              },
              {
                title: 'Healthcare Clinics',
                description: 'Track individual cases, identify at-risk children early, and coordinate interventions across patient population.'
              },
              {
                title: 'Government Programs',
                description: 'Evaluate program effectiveness, measure KPIs, and demonstrate impact to stakeholders and funding agencies.'
              },
              {
                title: 'Research Organizations',
                description: 'Analyze correlations between interventions and outcomes, test hypotheses, and publish findings.'
              },
              {
                title: 'NGOs & International Organizations',
                description: 'Compare regional approaches, identify best practices, and scale successful interventions across geographies.'
              },
              {
                title: 'Nutrition Specialists',
                description: 'Deep-dive analysis of nutritional factors, correlations with health outcomes, and personalized intervention recommendations.'
              }
            ].map((useCase, idx) => (
              <div key={idx} className="p-6 border border-border rounded-xl hover:border-primary/30 transition">
                <h3 className="font-semibold text-foreground mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-12 bg-primary/5 rounded-2xl px-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Technology & Security</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-foreground mb-6">Enterprise Architecture</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> Cloud-native infrastructure with auto-scaling
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> Real-time data processing and indexing
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> Advanced ML algorithms for predictions
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> Geographic information system integration
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-6">Security & Compliance</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> HIPAA compliant data handling
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> End-to-end encryption for data at rest and transit
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> Role-based access control with audit logging
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> Regular security audits and penetration testing
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the StuntLytics platform and discover how you can transform health outcomes in your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium">
              Access Platform
            </Link>
            <Link href="/" className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition font-medium">
              Back to Home
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 StuntLytics. Health Intelligence Platform.</p>
        </div>
      </footer>
    </div>
  )
}
