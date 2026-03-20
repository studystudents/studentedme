'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { applicationsApi } from '@/lib/api';
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ApplicationsPage() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.getAll,
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string }> = {
      DRAFT: { icon: FileText, color: 'text-gray-600 bg-gray-50', label: 'Draft' },
      IN_PROGRESS: { icon: Clock, color: 'text-blue-600 bg-blue-50', label: 'In Progress' },
      DOCUMENTS_PENDING: {
        icon: AlertCircle,
        color: 'text-yellow-600 bg-yellow-50',
        label: 'Documents Pending',
      },
      READY_FOR_REVIEW: {
        icon: Clock,
        color: 'text-orange-600 bg-orange-50',
        label: 'Ready for Review',
      },
      SUBMITTED: {
        icon: CheckCircle2,
        color: 'text-green-600 bg-green-50',
        label: 'Submitted',
      },
      ACCEPTED: {
        icon: CheckCircle2,
        color: 'text-green-700 bg-green-100',
        label: 'Accepted',
      },
      REJECTED: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Rejected' },
    };
    return (
      configs[status] || {
        icon: FileText,
        color: 'text-gray-600 bg-gray-50',
        label: status,
      }
    );
  };

  const groupedApplications = {
    active: applications.filter((app) =>
      ['DRAFT', 'IN_PROGRESS', 'DOCUMENTS_PENDING', 'READY_FOR_REVIEW'].includes(app.status)
    ),
    submitted: applications.filter((app) => app.status === 'SUBMITTED'),
    completed: applications.filter((app) => ['ACCEPTED', 'REJECTED'].includes(app.status)),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-gray-600 mt-2">Track and manage your university applications</p>
          </div>
          <Link href="/dashboard/programs">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold">{groupedApplications.active.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Submitted</p>
                  <p className="text-3xl font-bold">{groupedApplications.submitted.length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold">{groupedApplications.completed.length}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-50">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading applications...</p>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-gray-500 mb-6">
                Start your journey by browsing programs and creating your first application
              </p>
              <Link href="/dashboard/programs">
                <Button>Browse Programs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Active Applications */}
            {groupedApplications.active.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Applications</CardTitle>
                  <CardDescription>Applications in progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupedApplications.active.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Link key={app.id} href={`/dashboard/applications/${app.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                              {app.opportunity.institution?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{app.opportunity.name}</div>
                              <div className="text-sm text-gray-500">
                                {app.opportunity.institution?.name} •{' '}
                                {app.opportunity.institution?.country}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {app.applicationNumber}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {app.opportunity.deadline && (
                              <div className="text-sm text-gray-500 text-right">
                                <div className="text-xs text-gray-400">Deadline</div>
                                <div className="font-medium">
                                  {formatDate(app.opportunity.deadline)}
                                </div>
                              </div>
                            )}
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusConfig.color}`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              <span>{statusConfig.label}</span>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Submitted Applications */}
            {groupedApplications.submitted.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Applications</CardTitle>
                  <CardDescription>Waiting for university response</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupedApplications.submitted.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Link key={app.id} href={`/dashboard/applications/${app.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                              {app.opportunity.institution?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{app.opportunity.name}</div>
                              <div className="text-sm text-gray-500">
                                {app.opportunity.institution?.name} •{' '}
                                {app.opportunity.institution?.country}
                              </div>
                              {app.submittedAt && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Submitted {formatDate(app.submittedAt)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusConfig.color}`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              <span>{statusConfig.label}</span>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Completed Applications */}
            {groupedApplications.completed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Completed Applications</CardTitle>
                  <CardDescription>Final decisions received</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupedApplications.completed.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Link key={app.id} href={`/dashboard/applications/${app.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                              {app.opportunity.institution?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{app.opportunity.name}</div>
                              <div className="text-sm text-gray-500">
                                {app.opportunity.institution?.name} •{' '}
                                {app.opportunity.institution?.country}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusConfig.color}`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              <span>{statusConfig.label}</span>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
