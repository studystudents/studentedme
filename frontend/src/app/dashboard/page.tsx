'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { applicationsApi, documentsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import {
  FileText,
  FolderOpen,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.getAll,
  });

  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.getAll,
  });

  const stats = [
    {
      title: t('dashboard.home.activeApps'),
      value: applications.filter((app) =>
        ['DRAFT', 'IN_PROGRESS', 'DOCUMENTS_PENDING'].includes(app.status)
      ).length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('dashboard.home.documents'),
      value: documents.length,
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t('dashboard.home.submittedApps'),
      value: applications.filter((app) => app.status === 'SUBMITTED').length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('dashboard.home.approvedDocs'),
      value: documents.filter((doc) => doc.reviewStatus === 'APPROVED').length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'SUBMITTED' || status === 'APPROVED') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (status === 'REJECTED') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'SUBMITTED' || status === 'APPROVED') return 'text-green-700 bg-green-50';
    if (status === 'REJECTED') return 'text-red-700 bg-red-50';
    return 'text-yellow-700 bg-yellow-50';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            {t('dashboard.home.greeting')}, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {t('dashboard.home.subtitle')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.home.quickActions')}</CardTitle>
            <CardDescription>{t('dashboard.home.quickActionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/dashboard/programs">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('dashboard.home.browsePrograms')}
              </Button>
            </Link>
            <Link href="/dashboard/applications">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                {t('dashboard.home.viewApplications')}
              </Button>
            </Link>
            <Link href="/dashboard/documents">
              <Button variant="outline" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                {t('dashboard.home.uploadDocuments')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.home.recentTitle')}</CardTitle>
            <CardDescription>{t('dashboard.home.recentDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="text-center py-8 text-gray-500">{t('dashboard.home.loading')}</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">{t('dashboard.home.noApps')}</p>
                <Link href="/dashboard/programs">
                  <Button>{t('dashboard.home.browsePrograms')}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <Link
                    key={app.id}
                    href={`/dashboard/applications/${app.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {app.opportunity.institution?.name?.[0] || 'U'}
                        </div>
                        <div>
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
                          <div className="text-sm text-gray-500">
                            {t('dashboard.home.dueLabel')} {formatDate(app.opportunity.deadline)}
                          </div>
                        )}
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          <span className="capitalize">
                            {app.status.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.home.docStatus')}</CardTitle>
            <CardDescription>{t('dashboard.home.docStatusDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {docsLoading ? (
              <div className="text-center py-8 text-gray-500">{t('dashboard.home.loading')}</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">{t('dashboard.home.noDocsYet')}</p>
                <Link href="/dashboard/documents">
                  <Button>{t('dashboard.home.uploadDocsBtn')}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.slice(0, 5).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">{doc.fileName}</div>
                        <div className="text-xs text-gray-500">
                          {doc.documentType} • Uploaded {formatDate(doc.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(
                        doc.reviewStatus
                      )}`}
                    >
                      {getStatusIcon(doc.reviewStatus)}
                      <span className="capitalize">{doc.reviewStatus.toLowerCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
