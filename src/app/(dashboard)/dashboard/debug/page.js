"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Database, Check, X, Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DebugPage() {
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkDatabaseConnection()
  }, [])

  async function checkDatabaseConnection() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/debug")

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error("Error checking database connection:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">System Diagnostics</h1>
        <p className="text-muted-foreground">Check your system configuration and database connection</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection
          </CardTitle>
          <CardDescription>Check if your application can connect to the database</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : debugInfo ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${debugInfo.connected ? "bg-green-500" : "bg-red-500"}`}>
                  {debugInfo.connected ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <X className="h-4 w-4 text-white" />
                  )}
                </div>
                <span className="font-medium">
                  {debugInfo.connected ? "Connected to database" : "Failed to connect to database"}
                </span>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Connection Details</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Environment:</span> {debugInfo.environment}
                  </p>
                  <p>
                    <span className="font-medium">Database URL:</span> {debugInfo.databaseUrl}
                  </p>
                  <p>
                    <span className="font-medium">Direct URL:</span> {debugInfo.directUrl}
                  </p>
                  <p>
                    <span className="font-medium">Timestamp:</span> {debugInfo.timestamp}
                  </p>
                </div>
              </div>

              {!debugInfo.connected && debugInfo.error && (
                <div className="bg-destructive/10 p-4 rounded-md text-destructive">
                  <h3 className="text-sm font-medium mb-1">Error Details</h3>
                  <p className="text-sm">{debugInfo.error}</p>
                  {debugInfo.stack && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer">Stack Trace</summary>
                      <pre className="text-xs mt-2 whitespace-pre-wrap">{debugInfo.stack}</pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>No connection information available</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={checkDatabaseConnection} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

