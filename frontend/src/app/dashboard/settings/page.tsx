'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth';
import { usersApi } from '@/lib/api';
import { User, Mail, Phone, Globe, Calendar, Save, CheckCircle2, FileText, CreditCard } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const studentData = (user as any)?.student || {};

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toISOString().split('T')[0] : '',
    nationality: studentData.nationality || '',
    countryOfResidence: studentData.countryOfResidence || '',
    passportNumber: studentData.passportNumber || '',
    passportExpiry: studentData.passportExpiry ? new Date(studentData.passportExpiry).toISOString().split('T')[0] : '',
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => usersApi.updateProfile(data),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.settings.title')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.settings.subtitle')}</p>
        </div>

        {saved && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{t('dashboard.settings.savedMsg')}</span>
          </div>
        )}

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.settings.profileTitle')}</CardTitle>
            <CardDescription>{t('dashboard.settings.profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('dashboard.settings.firstName')}
                    </div>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Айдар"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('dashboard.settings.lastName')}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Сейткали"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('dashboard.settings.email')}
                  </div>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  placeholder="you@example.com"
                  disabled
                />
                <p className="text-sm text-gray-500">{t('dashboard.settings.emailNote')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t('dashboard.settings.phone')}
                  </div>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 777 777 77 77"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('dashboard.settings.dob')}
                    </div>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t('dashboard.settings.nationality')}
                    </div>
                  </Label>
                  <Input
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="Kazakhstan"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryOfResidence">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {t('dashboard.settings.residence')}
                  </div>
                </Label>
                <Input
                  id="countryOfResidence"
                  name="countryOfResidence"
                  value={formData.countryOfResidence}
                  onChange={handleChange}
                  placeholder="Kazakhstan"
                />
              </div>

              {/* Passport Details */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {t('dashboard.settings.passport')}
                    </div>
                  </Label>
                  <Input
                    id="passportNumber"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    placeholder="e.g. N1234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passportExpiry">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('dashboard.settings.passportExpiry')}
                    </div>
                  </Label>
                  <Input
                    id="passportExpiry"
                    name="passportExpiry"
                    type="date"
                    value={formData.passportExpiry}
                    onChange={handleChange}
                  />
                </div>
              </div>


              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {t('dashboard.settings.saveBtn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.settings.securityTitle')}</CardTitle>
            <CardDescription>{t('dashboard.settings.securityDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{t('dashboard.settings.passwordLabel')}</h4>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.settings.passwordNote')}
              </p>
              <Button variant="outline">{t('dashboard.settings.changePassword')}</Button>
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">{t('dashboard.settings.twoFaTitle')}</h4>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.settings.twoFaDesc')}
              </p>
              <Button variant="outline">{t('dashboard.settings.enable2fa')}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.settings.notificationsTitle')}</CardTitle>
            <CardDescription>{t('dashboard.settings.notificationsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{t('dashboard.settings.emailNotif')}</h4>
                <p className="text-sm text-gray-600">
                  {t('dashboard.settings.emailNotifDesc')}
                </p>
              </div>
              <input type="checkbox" className="h-5 w-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{t('dashboard.settings.appUpdates')}</h4>
                <p className="text-sm text-gray-600">
                  {t('dashboard.settings.appUpdatesDesc')}
                </p>
              </div>
              <input type="checkbox" className="h-5 w-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{t('dashboard.settings.docReminders')}</h4>
                <p className="text-sm text-gray-600">
                  {t('dashboard.settings.docRemindersDesc')}
                </p>
              </div>
              <input type="checkbox" className="h-5 w-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{t('dashboard.settings.marketing')}</h4>
                <p className="text-sm text-gray-600">
                  {t('dashboard.settings.marketingDesc')}
                </p>
              </div>
              <input type="checkbox" className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">{t('dashboard.settings.dangerTitle')}</CardTitle>
            <CardDescription>{t('dashboard.settings.dangerDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{t('dashboard.settings.deleteTitle')}</h4>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.settings.deleteDesc')}
              </p>
              <Button variant="destructive">{t('dashboard.settings.deleteBtn')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
