'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { opportunitiesApi, type Opportunity } from '@/lib/api';
import { Search, MapPin, Calendar, DollarSign, GraduationCap, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    degreeLevel: '',
    opportunityType: '',
  });

  const { data: rawPrograms = [], isLoading } = useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => opportunitiesApi.search(filters),
  });

  // Handle case where API wraps response in deeply nested { data: { data: [...] } } object
  const programsList = Array.isArray(rawPrograms) 
    ? rawPrograms 
    : Array.isArray((rawPrograms as any)?.data?.data)
      ? (rawPrograms as any).data.data
      : Array.isArray((rawPrograms as any)?.data)
        ? (rawPrograms as any).data
        : [];

  const filteredPrograms = programsList.filter(
    (program: any) =>
      program.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.institution?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.institution?.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Browse Programs</h1>
          <p className="text-gray-600 mt-2">
            Discover programs, universities, and scholarships worldwide
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by program, university, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="px-4 py-2 border rounded-md bg-white"
            value={filters.opportunityType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, opportunityType: e.target.value }))
            }
          >
            <option value="">All Types</option>
            <option value="UNIVERSITY_PROGRAM">University Programs</option>
            <option value="SCHOLARSHIP">Scholarships</option>
            <option value="LANGUAGE_COURSE">Language Courses</option>
          </select>

          <select
            className="px-4 py-2 border rounded-md bg-white"
            value={filters.degreeLevel}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, degreeLevel: e.target.value }))
            }
          >
            <option value="">All Degrees</option>
            <option value="Bachelor">Bachelor&apos;s</option>
            <option value="Master">Master&apos;s</option>
            <option value="PhD">PhD</option>
          </select>

          <select
            className="px-4 py-2 border rounded-md bg-white"
            value={filters.country}
            onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
          >
            <option value="">All Countries</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading programs...</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No programs found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Showing {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''}
            </p>

            {filteredPrograms.map((program: Opportunity) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {/* University Logo */}
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {program.institution?.name?.[0] || 'U'}
                      </div>

                      {/* Program Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="text-xl font-semibold flex-1">{program.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              program.opportunityType
                            )}`}
                          >
                            {getTypeLabel(program.opportunityType)}
                          </span>
                        </div>

                        {program.institution && (
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <GraduationCap className="h-4 w-4" />
                            <span className="font-medium">{program.institution.name}</span>
                            <span>•</span>
                            <MapPin className="h-4 w-4" />
                            <span>
                              {program.institution.city}, {program.institution.country}
                            </span>
                            {program.institution.ranking && (
                              <>
                                <span>•</span>
                                <span className="text-primary font-medium">
                                  #{program.institution.ranking}
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          {program.degreeLevel && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              {program.degreeLevel}
                            </span>
                          )}
                          {program.duration && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {program.duration} months
                            </span>
                          )}
                          {program.tuitionFee && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrency(program.tuitionFee, program.currency)}
                            </span>
                          )}
                          {program.deadline && (
                            <span className="flex items-center gap-1 text-orange-600 font-medium">
                              <Calendar className="h-4 w-4" />
                              Deadline: {formatDate(program.deadline)}
                            </span>
                          )}
                        </div>

                        {program.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {program.description}
                          </p>
                        )}

                        <div className="flex gap-3">
                          <Link href={`/dashboard/programs/${program.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/dashboard/applications/new?opportunityId=${program.id}`}>
                            <Button size="sm">Apply Now</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
