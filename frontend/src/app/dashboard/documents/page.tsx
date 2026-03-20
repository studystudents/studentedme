'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { documentsApi } from '@/lib/api';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import axios from 'axios';

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.getAll,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploading(true);
      setUploadProgress(0);

      // Request upload URL
      const { uploadUrl, documentId, fileKey, versionId } = await documentsApi.requestUploadUrl({
        documentType: 'PASSPORT', // In a real app, user would select this
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });

      // Upload file directly to storage
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      // Confirm upload
      await documentsApi.confirmUpload(documentId, { fileKey, versionId });

      return documentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setUploading(false);
      setUploadProgress(0);
    },
    onError: () => {
      setUploading(false);
      setUploadProgress(0);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        uploadMutation.mutate(file);
      });
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc', '.docx'],
    },
    disabled: uploading,
  });

  const downloadMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { downloadUrl } = await documentsApi.getDownloadUrl(documentId);
      window.open(downloadUrl, '_blank');
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'REJECTED':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const groupedDocuments = {
    approved: documents.filter((doc) => doc.reviewStatus === 'APPROVED'),
    pending: documents.filter((doc) => doc.reviewStatus === 'PENDING'),
    rejected: documents.filter((doc) => doc.reviewStatus === 'REJECTED'),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-gray-600 mt-2">
            Upload and manage your application documents securely
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold">{groupedDocuments.approved.length}</p>
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
                  <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold">{groupedDocuments.pending.length}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-50">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Needs Reupload</p>
                  <p className="text-3xl font-bold">{groupedDocuments.rejected.length}</p>
                </div>
                <div className="p-3 rounded-full bg-red-50">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Drag and drop files or click to browse. Supported formats: PDF, JPG, PNG, DOC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary hover:bg-gray-50'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {uploading ? (
                <>
                  <p className="text-lg font-medium mb-2">Uploading...</p>
                  <div className="max-w-xs mx-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-sm text-gray-500">or click to select files</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading documents...</p>
            </CardContent>
          </Card>
        ) : documents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p className="text-gray-500">Upload your first document to get started</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Pending Documents */}
            {groupedDocuments.pending.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Pending Review
                  </CardTitle>
                  <CardDescription>
                    These documents are being reviewed by your counselor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {groupedDocuments.pending.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-gray-50 rounded">
                          <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{doc.fileName}</div>
                          <div className="text-sm text-gray-500">
                            {doc.documentType} • {(doc.fileSize / 1024).toFixed(0)} KB
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Uploaded {formatDate(doc.uploadedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${getStatusColor(
                            doc.reviewStatus
                          )}`}
                        >
                          {getStatusIcon(doc.reviewStatus)}
                          <span>Pending</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadMutation.mutate(doc.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Approved Documents */}
            {groupedDocuments.approved.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Approved Documents
                  </CardTitle>
                  <CardDescription>These documents have been verified and approved</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {groupedDocuments.approved.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-green-200 bg-green-50/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-white rounded">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{doc.fileName}</div>
                          <div className="text-sm text-gray-600">
                            {doc.documentType} • {(doc.fileSize / 1024).toFixed(0)} KB
                          </div>
                          {doc.expiresAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              Expires: {formatDate(doc.expiresAt)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-green-700 bg-green-100 border border-green-200">
                          {getStatusIcon(doc.reviewStatus)}
                          <span>Approved</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadMutation.mutate(doc.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Rejected Documents */}
            {groupedDocuments.rejected.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Needs Reupload
                  </CardTitle>
                  <CardDescription>
                    These documents were rejected. Please upload corrected versions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {groupedDocuments.rejected.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-red-200 bg-red-50/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-white rounded">
                          <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{doc.fileName}</div>
                          <div className="text-sm text-gray-600">
                            {doc.documentType} • {(doc.fileSize / 1024).toFixed(0)} KB
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-red-700 bg-red-100 border border-red-200">
                          {getStatusIcon(doc.reviewStatus)}
                          <span>Rejected</span>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Reupload
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
