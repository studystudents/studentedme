'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { applicationsApi, documentsApi } from '@/lib/api';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Send,
  AlertCircle,
  Download,
  Upload,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const applicationId = params.id as string;

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsApi.getOne(applicationId),
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.getAll,
  });

  const submitMutation = useMutation({
    mutationFn: () => applicationsApi.submit(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
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

  if (!application) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application not found</h3>
            <p className="text-gray-500 mb-6">The application you're looking for doesn't exist</p>
            <Link href="/dashboard/applications">
              <Button>Back to Applications</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; description: string }> = {
      DRAFT: {
        icon: FileText,
        color: 'text-gray-600 bg-gray-50 border-gray-200',
        label: 'Draft',
        description: 'Complete your application and submit when ready',
      },
      IN_PROGRESS: {
        icon: Clock,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        label: 'In Progress',
        description: 'Your counselor is reviewing your application',
      },
      DOCUMENTS_PENDING: {
        icon: AlertCircle,
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        label: 'Documents Pending',
        description: 'Upload required documents to continue',
      },
      READY_FOR_REVIEW: {
        icon: Clock,
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        label: 'Ready for Review',
        description: 'All documents uploaded, waiting for final review',
      },
      SUBMITTED: {
        icon: CheckCircle2,
        color: 'text-green-600 bg-green-50 border-green-200',
        label: 'Submitted',
        description: 'Application submitted to university',
      },
      ACCEPTED: {
        icon: CheckCircle2,
        color: 'text-green-700 bg-green-100 border-green-300',
        label: 'Accepted',
        description: "Congratulations! You've been accepted",
      },
    };
    return configs[status] || configs.DRAFT;
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  // MVP: Relax submission requirements to allow testing the submit flow
  const canSubmit = !['SUBMITTED', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'ENROLLED', 'DECLINED'].includes(application.status);

  const requiredDocuments = [
    { type: 'PASSPORT', label: 'Passport', required: true },
    { type: 'TRANSCRIPT', label: 'Academic Transcript', required: true },
    { type: 'RECOMMENDATION_LETTER', label: 'Recommendation Letter', required: true },
    { type: 'PERSONAL_STATEMENT', label: 'Personal Statement', required: true },
    { type: 'ENGLISH_TEST', label: 'English Test (TOEFL/IELTS)', required: false },
  ];

  const getDocumentStatus = (type: string) => {
    const doc = documents.find(d => d.documentType === type);
    if (!doc) return { status: 'missing', icon: AlertCircle, color: 'text-gray-400' };
    if (doc.reviewStatus === 'APPROVED') return { status: 'approved', icon: CheckCircle2, color: 'text-green-600' };
    if (doc.reviewStatus === 'REJECTED') return { status: 'rejected', icon: AlertCircle, color: 'text-red-600' };
    return { status: 'pending', icon: Clock, color: 'text-yellow-600' };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/applications">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Status Banner */}
        <Card className={`border-2 ${statusConfig.color}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full">
                  <StatusIcon className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{statusConfig.label}</h2>
                  <p className="text-gray-600 mt-1">{statusConfig.description}</p>
                </div>
              </div>
              {canSubmit && (
                <Button size="lg" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
                  <Send className="h-5 w-5 mr-2" />
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Program Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {application.opportunity.institution?.name?.[0] || 'U'}
                </div>
                <div>
                  <CardTitle className="text-2xl">{application.opportunity.name}</CardTitle>
                  {application.opportunity.institution && (
                    <CardDescription className="flex items-center gap-3 mt-2 text-base">
                      <span className="font-medium">{application.opportunity.institution.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {application.opportunity.institution.city}, {application.opportunity.institution.country}
                      </span>
                      {application.opportunity.institution.ranking && (
                        <>
                          <span>•</span>
                          <span className="text-primary font-medium">
                            Ranked #{application.opportunity.institution.ranking}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Application Number</div>
                <div className="font-semibold">{application.applicationNumber}</div>
              </div>
              {application.opportunity.degreeLevel && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Degree Level</div>
                  <div className="font-semibold">{application.opportunity.degreeLevel}</div>
                </div>
              )}
              {application.opportunity.duration && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Duration</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {application.opportunity.duration} months
                  </div>
                </div>
              )}
              {application.opportunity.tuitionFee && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Tuition Fee</div>
                  <div className="font-semibold flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(application.opportunity.tuitionFee, application.opportunity.currency)}
                  </div>
                </div>
              )}
              {application.opportunity.deadline && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Deadline</div>
                  <div className="font-semibold text-orange-600">
                    {formatDate(application.opportunity.deadline)}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-500 mb-1">Created</div>
                <div className="font-semibold">{formatDate(application.createdAt)}</div>
              </div>
              {application.submittedAt && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Submitted</div>
                  <div className="font-semibold">{formatDate(application.submittedAt)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Required Documents Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>Upload and get approval for all required documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requiredDocuments.map((doc) => {
                const status = getDocumentStatus(doc.type);
                const DocIcon = status.icon;

                return (
                  <div
                    key={doc.type}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <DocIcon className={`h-5 w-5 ${status.color}`} />
                      <div>
                        <div className="font-medium">{doc.label}</div>
                        <div className="text-sm text-gray-500">
                          {doc.required ? 'Required' : 'Optional'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium capitalize ${status.color}`}
                      >
                        {status.status}
                      </span>
                      {status.status === 'missing' && (
                        <Link href="/dashboard/documents">
                          <Button size="sm" variant="outline" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Upload
                          </Button>
                        </Link>
                      )}
                      {status.status === 'approved' && (
                        <Button size="sm" variant="ghost" className="gap-2">
                          <Download className="h-4 w-4" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progress Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
            <CardDescription>Track your application progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  label: 'Application Created',
                  date: application.createdAt,
                  completed: true,
                },
                {
                  label: 'Documents Uploaded',
                  date: null,
                  completed: documents.length > 0,
                },
                {
                  label: 'Documents Approved',
                  date: null,
                  completed: documents.filter(d => d.reviewStatus === 'APPROVED').length >= 2,
                },
                {
                  label: 'Application Submitted',
                  date: application.submittedAt,
                  completed: application.status === 'SUBMITTED' || application.status === 'ACCEPTED',
                },
                {
                  label: 'University Decision',
                  date: null,
                  completed: application.status === 'ACCEPTED',
                },
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center ${step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                      }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.label}</div>
                    {step.date && (
                      <div className="text-sm text-gray-500">{formatDate(step.date)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
