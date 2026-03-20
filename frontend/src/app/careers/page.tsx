'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Briefcase,
  MapPin,
  Clock,
  Heart,
  Users,
  Zap,
  TrendingUp,
  Globe2,
  Home,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareersPage() {
  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs',
    },
    {
      icon: Home,
      title: 'Remote-Friendly',
      description: 'Flexible work arrangements with options for remote and hybrid work',
    },
    {
      icon: TrendingUp,
      title: 'Growth Opportunities',
      description: 'Career development programs, mentorship, and learning budgets',
    },
    {
      icon: Globe2,
      title: 'Global Impact',
      description: 'Help students worldwide achieve their education dreams',
    },
    {
      icon: Users,
      title: 'Inclusive Culture',
      description: 'Diverse, supportive team with strong values and collaboration',
    },
    {
      icon: Zap,
      title: 'Competitive Pay',
      description: 'Market-leading salaries, equity options, and performance bonuses',
    },
  ];

  const openPositions = [
    {
      title: 'Senior Education Counselor',
      department: 'Counseling',
      location: 'Boston, MA',
      type: 'Full-time',
      description:
        'Guide students through the international application process and help them achieve their academic goals.',
      requirements: ['5+ years counseling experience', 'International education expertise', 'Strong communication skills'],
    },
    {
      title: 'Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description:
        'Build and maintain our platform using Next.js, Node.js, and PostgreSQL to serve thousands of students.',
      requirements: ['3+ years full-stack experience', 'Next.js/React expertise', 'Strong system design skills'],
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote / Boston',
      type: 'Full-time',
      description:
        'Design beautiful, intuitive experiences that make international education accessible to everyone.',
      requirements: ['4+ years product design', 'Figma expertise', 'User research experience'],
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Singapore',
      type: 'Full-time',
      description:
        'Lead marketing campaigns across Asia-Pacific to reach and support students in the region.',
      requirements: ['5+ years marketing experience', 'EdTech background preferred', 'Data-driven approach'],
    },
    {
      title: 'Visa Specialist',
      department: 'Operations',
      location: 'London, UK',
      type: 'Full-time',
      description:
        'Support students through visa application processes for UK, EU, and global destinations.',
      requirements: ['Immigration law knowledge', 'Attention to detail', '3+ years relevant experience'],
    },
    {
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Remote',
      type: 'Full-time',
      description:
        'Analyze student data to improve outcomes and optimize our matching algorithms.',
      requirements: ['SQL/Python proficiency', 'Data visualization skills', 'Statistical analysis experience'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Studented.me
              </span>
            </Link>
            <div className="flex gap-4">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost">Contact</Button>
              </Link>
              <Link href="/careers">
                <Button variant="ghost">Careers</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Join Our
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {' '}Mission
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Help us democratize access to global education. Build technology and provide services
            that transform lives for thousands of students worldwide.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">View Open Positions</Button>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact HR
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Why Join Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Join Studented.me?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <benefit.icon className="h-10 w-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
          <p className="text-lg text-gray-600">
            Join our growing team and make a global impact
          </p>
        </div>

        <div className="space-y-6">
          {openPositions.map((position, index) => (
            <motion.div
              key={position.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Briefcase className="h-6 w-6 text-purple-600 mt-1" />
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{position.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary">{position.department}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {position.location}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {position.type}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{position.description}</p>

                      <div>
                        <h4 className="font-semibold mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {position.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button size="lg">Apply Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Culture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="pt-12 pb-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
              <p className="text-lg text-purple-100 mb-8">
                We're a diverse team of educators, engineers, designers, and dreamers united by
                a common mission: making international education accessible to everyone. We value
                collaboration, innovation, and making a real difference in students' lives.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <div className="text-purple-100">Team Members</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <div className="text-purple-100">Countries Represented</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">4.8/5</div>
                  <div className="text-purple-100">Glassdoor Rating</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-xl text-gray-600 mb-8">
              We're always looking for talented people who share our mission. Send us your resume
              and let's talk about how you can contribute.
            </p>
            <Link href="/contact">
              <Button size="lg">Get in Touch</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
