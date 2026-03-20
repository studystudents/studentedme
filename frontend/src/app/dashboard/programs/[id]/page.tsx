'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { opportunitiesApi, applicationsApi } from '@/lib/api';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  GraduationCap,
  BookOpen,
  Globe,
  Star,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const programId = params.id as string;
  const [applying, setApplying] = useState(false);

  const { data: program, isLoading } = useQuery({
    queryKey: ['opportunity', programId],
    queryFn: () => opportunitiesApi.getOne(programId),
  });

  const applyMutation = useMutation({
    mutationFn: () => applicationsApi.create({ opportunityId: programId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      router.push(`/dashboard/applications/${data.id}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create application');
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!program) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Program not found</h3>
            <p className="text-gray-500 mb-6">The program you're looking for doesn't exist</p>
            <Link href="/dashboard/programs">
              <Button>Back to Programs</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'UNIVERSITY_PROGRAM':
        return 'bg-blue-100 text-blue-700';
      case 'SCHOLARSHIP':
        return 'bg-green-100 text-green-700';
      case 'LANGUAGE_COURSE':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'UNIVERSITY_PROGRAM':
        return 'University Program';
      case 'SCHOLARSHIP':
        return 'Scholarship';
      case 'LANGUAGE_COURSE':
        return 'Language Course';
      default:
        return type;
    }
  };

  const handleApply = () => {
    if (confirm('Are you ready to start your application for this program?')) {
      applyMutation.mutate();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/programs">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Programs
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-6 flex-1">
                {/* University Logo */}
                <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                  {program.institution?.name?.[0] || 'U'}
                </div>

                {/* Program Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <h1 className="text-3xl font-bold flex-1">{program.name}</h1>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(
                        program.opportunityType
                      )}`}
                    >
                      {getTypeLabel(program.opportunityType)}
                    </span>
                  </div>

                  {program.institution && (
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        <span className="font-semibold text-lg">{program.institution.name}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>
                          {program.institution.city}, {program.institution.country}
                        </span>
                      </div>
                      {program.institution.ranking && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <Star className="h-5 w-5 fill-current" />
                            <span>Ranked #{program.institution.ranking}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-6 text-base">
                    {program.degreeLevel && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                        <span>{program.degreeLevel}</span>
                      </div>
                    )}
                    {program.duration && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>{program.duration} months</span>
                      </div>
                    )}
                    {program.tuitionFee !== undefined && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold">
                          {formatCurrency(program.tuitionFee, program.currency)}
                        </span>
                      </div>
                    )}
                    {program.deadline && (
                      <div className="flex items-center gap-2 text-orange-600 font-medium">
                        <Calendar className="h-5 w-5" />
                        <span>Deadline: {formatDate(program.deadline)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full md:w-auto text-lg gap-2"
              onClick={handleApply}
              disabled={applyMutation.isPending}
            >
              <Send className="h-5 w-5" />
              {applyMutation.isPending ? 'Creating Application...' : 'Apply Now'}
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Program Description */}
            <Card>
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                {program.description ? (
                  <p className="text-gray-700 leading-relaxed">{program.description}</p>
                ) : (
                  <>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      This {program.degreeLevel?.toLowerCase()} program offers an exceptional opportunity to
                      study at {program.institution?.name}, a prestigious institution ranked{' '}
                      {program.institution?.ranking ? `#${program.institution.ranking}` : 'among the top universities'}{' '}
                      globally.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The program is designed to provide students with comprehensive knowledge and practical
                      skills in their field of study, preparing them for successful careers and further
                      academic pursuits.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Students will benefit from world-class faculty, state-of-the-art facilities, and a
                      vibrant international community.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Program Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'World-class faculty with industry experience',
                    'State-of-the-art research facilities',
                    'International student community from 100+ countries',
                    'Career support and placement assistance',
                    'Opportunities for research and internships',
                    'Flexible course structure and electives',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Academic Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Bachelor's degree (or equivalent) for Master's programs</li>
                      <li>Minimum GPA of 3.0/4.0 or equivalent</li>
                      <li>Relevant academic background in the field</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">English Proficiency</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>TOEFL iBT: 90+ or IELTS: 6.5+</li>
                      <li>Other equivalent English tests accepted</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Required Documents</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Completed application form</li>
                      <li>Academic transcripts and certificates</li>
                      <li>Letters of recommendation (2-3)</li>
                      <li>Statement of purpose</li>
                      <li>CV/Resume</li>
                      <li>Valid passport</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {program.institution && (
                  <>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Location</div>
                      <div className="font-semibold flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {program.institution.city}, {program.institution.country}
                      </div>
                    </div>
                    {program.institution.ranking && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">World Ranking</div>
                        <div className="font-semibold flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          #{program.institution.ranking}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {program.degreeLevel && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Degree Level</div>
                    <div className="font-semibold">{program.degreeLevel}</div>
                  </div>
                )}
                {program.duration && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Duration</div>
                    <div className="font-semibold">{program.duration} months</div>
                  </div>
                )}
                {program.deadline && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Application Deadline</div>
                    <div className="font-semibold text-orange-600">
                      {formatDate(program.deadline)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Costs */}
            {program.tuitionFee !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle>Costs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Tuition Fee</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(program.tuitionFee, program.currency)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Additional costs may include application fees, health insurance, and living expenses.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-gradient-to-br from-purple-500 to-blue-500 text-white border-0">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
                <p className="mb-4 opacity-90">
                  Start your application today and take the first step towards your dream education.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full gap-2"
                  onClick={handleApply}
                  disabled={applyMutation.isPending}
                >
                  <Send className="h-5 w-5" />
                  {applyMutation.isPending ? 'Creating...' : 'Apply Now'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
