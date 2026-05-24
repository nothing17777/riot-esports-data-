'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Database, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

interface DbStatus {
  success: boolean
  message: string
  timestamp?: string
  tables?: string[]
  error?: string
}

export default function DbStatusPage() {
  const [status, setStatus] = useState<DbStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/db-test')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        success: false,
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Database className="w-8 h-8 text-foreground" />
          <h1 className="font-serif text-3xl text-foreground">Database Status</h1>
        </div>

        {/* Status Card */}
        <div className="border border-border rounded-lg bg-surface p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-foreground">Connection Test</h2>
            <button
              onClick={testConnection}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded hover:bg-background transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-foreground-secondary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Testing connection...</span>
            </div>
          ) : status ? (
            <div className="space-y-4">
              {/* Status indicator */}
              <div className="flex items-center gap-3">
                {status.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <span className={`text-lg font-medium ${status.success ? 'text-green-500' : 'text-red-500'}`}>
                  {status.success ? 'Connected' : 'Connection Failed'}
                </span>
              </div>

              {/* Details */}
              <div className="bg-background border border-border rounded p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Message:</span>
                  <span className="text-foreground">{status.message}</span>
                </div>
                {status.timestamp && (
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-secondary">Server Time:</span>
                    <span className="text-foreground font-mono">{status.timestamp}</span>
                  </div>
                )}
                {status.error && (
                  <div className="text-sm">
                    <span className="text-foreground-secondary">Error:</span>
                    <pre className="mt-1 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs overflow-auto">
                      {status.error}
                    </pre>
                  </div>
                )}
              </div>

              {/* Tables list */}
              {status.tables && status.tables.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">Database Tables:</h3>
                  <div className="flex flex-wrap gap-2">
                    {status.tables.map((table) => (
                      <span 
                        key={table}
                        className="px-3 py-1 text-xs font-mono bg-background border border-border rounded"
                      >
                        {table}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {status.tables && status.tables.length === 0 && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-foreground-secondary">
                    No tables found. The database is empty.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Connection Info */}
        <div className="border border-border rounded-lg bg-surface p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Connection Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Database Type:</span>
              <span className="text-foreground">Turso (libSQL)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Database URL:</span>
              <span className="text-foreground font-mono text-xs">
                libsql://esports-db-nothing17777.aws-us-west-2.turso.io
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Environment Variables:</span>
              <span className="text-foreground">TURSO_DATABASE_URL, TURSO_AUTH_TOKEN</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
