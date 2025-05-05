"use client"

import { useState, useEffect } from "react"
import { login } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, Mail, Loader2, Car, AlertCircle, CheckCircle2, KeyRound } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [logo, setLogo] = useState(null)
  const [logoLoading, setLogoLoading] = useState(true)

  // Fetch logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLogoLoading(true)
        const response = await fetch("/api/supabasPrisma/logo")

        if (!response.ok) {
          throw new Error("Failed to fetch logo")
        }

        const data = await response.json()
        setLogo(data)
      } catch (error) {
        console.error("Error fetching logo:", error)
      } finally {
        setLogoLoading(false)
      }
    }

    fetchLogo()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(event.target)
      const result = await login(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess("Login successful! Redirecting to dashboard...")
        // Redirect happens in the server action
      }
    } catch (err) {
      setError(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Full page background image with extreme blur */}
      <div className="absolute inset-0 z-0">
        <Image src="/placeholder.svg?key=kqg0s" alt="Car Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl"></div>
      </div>

      {/* Content container - fixed size to prevent scrolling */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          {/* Left side - Car branding (simplified for smaller screens) */}
          <div className="md:w-5/12 bg-gradient-to-br from-brand-primary to-brand-primary/80 p-6 text-white relative overflow-hidden hidden md:block">
            <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-md"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 h-full flex flex-col"
            >
              <div className="mb-6">
                {logoLoading ? (
                  <div className="h-12 w-32 animate-pulse rounded bg-white/20"></div>
                ) : logo && logo[0]?.imageUrl ? (
                  <div className="h-12">
                    <img
                      src={logo[0]?.imageUrl || "/placeholder.svg"}
                      alt={logo[0]?.title || "Company Logo"}
                      className="h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Car className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold">CarAdmin</span>
                  </div>
                )}
              </div>

              <div className="flex-grow flex flex-col justify-center">
                <h1 className="text-3xl font-bold mb-4">Premium Car Dashboard</h1>
                <p className="text-lg opacity-90 mb-6">The complete solution for car dealerships and enthusiasts.</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center mb-2">
                      <Car className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Car Management</h3>
                    <p className="text-xs opacity-80">Complete inventory control</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-sm mb-1">Inventory</h3>
                    <p className="text-xs opacity-80">Real-time monitoring</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex items-center space-x-3 text-xs">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs font-medium">
                    J
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs font-medium">
                    M
                  </div>
                  <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white flex items-center justify-center text-xs font-medium">
                    T
                  </div>
                </div>
                <span>Join 2,500+ dealers</span>
              </div>
            </motion.div>
          </div>

          {/* Right side - Login Form (optimized to fit without scrolling) */}
          <div className="md:w-7/12 p-6 backdrop-blur-md bg-white/80">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              {/* Mobile logo (only shown on small screens) */}
              <div className="md:hidden text-center mb-6">
                {logoLoading ? (
                  <div className="h-12 w-32 mx-auto animate-pulse rounded bg-gray-200"></div>
                ) : logo && logo[0]?.imageUrl ? (
                  <div className="h-12 flex justify-center">
                    <img
                      src={logo[0]?.imageUrl || "/placeholder.svg"}
                      alt={logo[0]?.title || "Company Logo"}
                      className="h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="p-2 bg-brand-primary/20 rounded-xl">
                      <Car className="h-6 w-6 text-brand-primary" />
                    </div>
                    <span className="text-xl font-bold text-brand-primary">CarAdmin</span>
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <div className="inline-block p-3 bg-brand-primary/10 rounded-full mb-3">
                  <KeyRound className="h-6 w-6 text-brand-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">Sign in to your account</h2>
                <p className="text-sm text-gray-600">Enter your credentials to continue</p>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="mb-4 py-2 animate-in fade-in-50 slide-in-from-top-5 duration-300"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm">Error</AlertTitle>
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 py-2 bg-green-50 text-green-800 border-green-200 animate-in fade-in-50 slide-in-from-top-5 duration-300">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-sm">Success</AlertTitle>
                  <AlertDescription className="text-xs">{success}</AlertDescription>
                </Alert>
              )}

              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <CardContent className="p-5">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-2.5 p-1 bg-brand-primary/10 rounded-md">
                          <Mail className="text-brand-primary" size={14} />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          required
                          className="pl-11 h-10 rounded-lg border-gray-200 focus:border-brand-primary focus:ring focus:ring-brand-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        {/* <Link
                          href="/forgot-password"
                          className="text-xs text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                          Forgot?
                        </Link> */}
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-2.5 p-1 bg-brand-primary/10 rounded-md">
                          <Lock className="text-brand-primary" size={14} />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="pl-11 h-10 rounded-lg border-gray-200 focus:border-brand-primary focus:ring focus:ring-brand-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" name="remember" />
                      <Label htmlFor="remember" className="text-xs text-gray-600">
                        Remember me for 30 days
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/40"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
{/* 
                  <div className="mt-4 text-center text-xs text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-brand-primary hover:text-brand-primary/80 font-medium">
                      Create one
                    </Link>
                  </div> */}
                </CardContent>
              </Card>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Car Admin Dashboard</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
