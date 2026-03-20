'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { applicationsApi, opportunitiesApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  Building,
  Globe2,
  Check
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

function ApplicationWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const opportunityId = searchParams.get('opportunityId');

  const [step, setStep] = useState(1);

  const { data: opportunity, isLoading: isOppLoading } = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: () => opportunitiesApi.getOne(opportunityId as string),
    enabled: !!opportunityId,
  });

  const createMutation = useMutation({
    mutationFn: (data: { opportunityId: string }) => applicationsApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      router.push(`/dashboard/applications/${data.id}?created=true`);
    },
  });

  if (!opportunityId) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Program Selected</h3>
            <p className="text-gray-500 mb-6">Please select a program or scholarship to apply for.</p>
            <Link href="/dashboard/programs">
              <Button>Browse Programs</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (isOppLoading || !opportunity) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  
  const handleConfirmApply = () => {
    createMutation.mutate({ opportunityId });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex-1">Start Application</h1>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center w-full max-w-sm">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold border-2 z-10 ${step >= 1 ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold border-2 z-10 ${step >= 2 ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
              2
            </div>
          </div>
        </div>

        <div className="flex justify-between max-w-sm mx-auto mt-[-24px] mb-8 text-sm font-medium text-gray-500">
          <span className={step >= 1 ? 'text-primary' : ''}>Program Review</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Confirmation</span>
        </div>

        {/* Step 1: Program Details Review */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <Card className="border-2 border-primary/10 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                 <div className="h-24 w-24 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary font-bold text-4xl flex-shrink-0 border">
                    {opportunity.institution?.name?.[0] || 'U'}
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.name}</h2>
                    {opportunity.institution && (
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {opportunity.institution.name}
                      </div>
                    )}
                 </div>
              </div>
              <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-gray-400" />
                    Location & Type
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Country</p>
                      <p className="font-medium flex items-center gap-2">
                         <MapPin className="h-4 w-4 text-gray-400" />
                         {opportunity.institution?.country || (opportunity as any).country}
                      </p>
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 mb-1">Opportunity Type</p>
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {opportunity.opportunityType.replace('_', ' ')}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileCheck2 className="h-5 w-5 text-gray-400" />
                    Requirements & Dates
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Degree Level</p>
                      <p className="font-medium">{opportunity.degreeLevel || 'Not specified'}</p>
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 mb-1">Deadline</p>
                       <p className="font-medium text-orange-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {opportunity.deadline ? formatDate(opportunity.deadline) : 'Rolling'}
                       </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-6 flex justify-end">
                 <Button size="lg" onClick={handleNext} className="gap-2">
                    Continue to Confirmation
                    <ArrowRight className="h-4 w-4" />
                 </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Step 2: Confirmation & Profile Readiness */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Ready to Apply?</CardTitle>
                <CardDescription className="text-base mt-2">
                  You are about to create an application file for <strong>{opportunity.name}</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                  <h4 className="font-semibold text-blue-900 mb-4 text-lg">What happens next?</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 bg-blue-100 p-1 rounded-full"><Check className="h-4 w-4 text-blue-600" /></div>
                      <div>
                        <p className="font-medium text-blue-900">Application File Created</p>
                        <p className="text-sm text-blue-700">A secure space will be created to manage all your documents for this specific program.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 bg-blue-100 p-1 rounded-full"><Check className="h-4 w-4 text-blue-600" /></div>
                      <div>
                        <p className="font-medium text-blue-900">Document Upload</p>
                        <p className="text-sm text-blue-700">You will be guided to upload required documents (Passport, Transcript, etc.).</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 bg-blue-100 p-1 rounded-full"><Check className="h-4 w-4 text-blue-600" /></div>
                      <div>
                        <p className="font-medium text-blue-900">Counselor Review</p>
                        <p className="text-sm text-blue-700">Our team will review your documents before officially submitting them to the institution.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button variant="outline" size="lg" onClick={handleBack} className="w-full sm:w-auto">
                    Back to Review
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={handleConfirmApply} 
                    disabled={createMutation.isPending}
                    className="w-full sm:w-auto gap-2 text-lg px-8"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Application'}
                    {!createMutation.isPending && <CheckCircle2 className="h-5 w-5" />}
                  </Button>
                </div>
                
                {createMutation.isError && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-200">
                    {createMutation.error.message || 'Failed to create application. You might have already applied to this program.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ApplicationWizardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading wizard...</div>}>
      <ApplicationWizardContent />
    </Suspense>
  );
}
