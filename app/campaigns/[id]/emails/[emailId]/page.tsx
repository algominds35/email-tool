'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EmailDetailPage({ 
  params 
}: { 
  params: { id: string; emailId: string } 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [email, setEmail] = useState<any>(null);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const fetchEmail = useCallback(async () => {
    try {
      const response = await fetch(`/api/emails/${params.emailId}`);
      const data = await response.json();
      setEmail(data.email);
      setEditedSubject(data.email.subject);
      setEditedBody(data.email.body);
    } catch (error) {
      console.error('Error fetching email:', error);
    } finally {
      setLoading(false);
    }
  }, [params.emailId]);

  useEffect(() => {
    fetchEmail();
  }, [fetchEmail]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/emails/${params.emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: editedSubject,
          body: editedBody,
          status: 'edited',
        }),
      });

      if (response.ok) {
        setEditing(false);
        fetchEmail();
      }
    } catch (error) {
      console.error('Error saving email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/emails/${params.emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        fetchEmail();
      }
    } catch (error) {
      console.error('Error approving email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm('Regenerate this email? The current version will be replaced.')) {
      return;
    }

    setRegenerating(true);
    try {
      const response = await fetch(`/api/emails/${params.emailId}/regenerate`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchEmail();
      }
    } catch (error) {
      console.error('Error regenerating email:', error);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!email) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Email not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            EmailAI
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href={`/campaigns/${params.id}`}>
              <Button variant="ghost" size="sm">← Back to Campaign</Button>
            </Link>
          </div>

          {/* Lead Info */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {email.lead.firstName} {email.lead.lastName}
                  </CardTitle>
                  <CardDescription>
                    {email.lead.title && `${email.lead.title} • `}
                    {email.lead.company && `${email.lead.company} • `}
                    {email.lead.email}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    email.confidenceScore >= 80
                      ? 'default'
                      : email.confidenceScore >= 60
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  Score: {email.confidenceScore}/100
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Email Content */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Content</CardTitle>
                <div className="flex gap-2">
                  {!editing && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRegenerate}
                        disabled={regenerating}
                      >
                        {regenerating ? 'Regenerating...' : 'Regenerate'}
                      </Button>
                      {email.status !== 'approved' && (
                        <Button size="sm" onClick={handleApprove}>
                          Approve
                        </Button>
                      )}
                    </>
                  )}
                  {editing && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!editing ? (
                <>
                  <div className="mb-4">
                    <Label className="text-xs text-gray-600">SUBJECT LINE</Label>
                    <div className="font-medium mt-1">{email.subject}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">EMAIL BODY</Label>
                    <div className="mt-1 whitespace-pre-wrap">{email.body}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="body">Email Body</Label>
                    <textarea
                      id="body"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[300px]"
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Research Summary */}
          {email.researchSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Research Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{email.researchSummary}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

