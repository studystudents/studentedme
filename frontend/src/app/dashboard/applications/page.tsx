'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { applicationsApi } from '@/lib/api';
import { useLanguage } from '@/lib/i18n';
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
  const { t } = useLanguage();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.getAll,
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string }> = {
      DRAFT: { icon: FileText, color: 'text-gray-600 bg-gray-50', label: t('dashboard.applications.statusDraft') },
      IN_PROGRESS: { icon: Clock, color: 'text-blue-600 bg-blue-50', label: t('dashboard.applications.statusInProgress') },
      DOCUMENTS_PENDING: {
        icon: AlertCircle,
        color: 'text-yellow-600 bg-yellow-50',
        label: t('dashboard.applications.statusDocsPending'),
      },
      READY_FOR_REVIEW: {
        icon: Clock,
        color: 'text-orange-600 bg-orange-50',
        label: t('dashboard.applications.statusReadyReview'),
      },
      SUBMITTED: {
        icon: CheckCircle2,
        color: 'text-green-600 bg-green-50',
        label: t('dashboard.applications.statusSubmitted'),
      },
      ACCEPTED: {
        icon: CheckCircle2,
        color: 'text-green-700 bg-green-100',
        label: t('dashboard.applications.statusAccepted'),
      },
      REJECTED: { icon: XCircle, color: 'text-red-600 bg-red-50', label: t('dashboard.applications.statusRejected') },
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
            <h1 className="text-3xl font-bold">{t('dashboard.applications.title')}</h1>
            <p className="text-gray-600 mt-2">{t('dashboard.applications.subtitle')}</p>
          </div>
          <Link href="/dashboard/programs">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('dashboard.applications.newBtn')}
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('dashboard.applications.active')}</p>
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
                  <p className="text-sm text-gray-600 mb-1">{t('dashboard.applications.submitted')}</p>
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
                  <p className="text-sm text-gray-600 mb-1">{t('dashboard.applications.completed')}</p>
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
              <p className="text-gray-500">{t('dashboard.applications.loading')}</p>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('dashboard.applications.noApps')}</h3>
              <p className="text-gray-500 mb-6">
                {t('dashboard.applications.noAppsDesc')}
              </p>
              <Link href="/dashboard/programs">
                <Button>{t('dashboard.applications.browseBtn')}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Active Applications */}
            {groupedApplications.active.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.applications.activeTitle')}</CardTitle>
                  <CardDescription>{t('dashboard.applications.activeDesc')}</CardDescription>
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
                                <div className="text-xs text-gray-400">{t('dashboard.applications.deadline')}</div>
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
                  <CardTitle>{t('dashboard.applications.submittedTitle')}</CardTitle>
                  <CardDescription>{t('dashboard.applications.submittedDesc')}</CardDescription>
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
                  <CardTitle>{t('dashboard.applications.completedTitle')}</CardTitle>
                  <CardDescription>{t('dashboard.applications.completedDesc')}</CardDescription>
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
