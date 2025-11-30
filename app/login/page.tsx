import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <Link href="/" className="absolute top-4 left-4 flex items-center text-purple-700 hover:text-purple-900">
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold text-xl">CC</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            CivicConnect
          </h1>
          <p className="text-gray-500 mt-1">Connect with your community</p>
        </div>

        <Tabs defaultValue="citizen" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger
              value="citizen"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Citizen
            </TabsTrigger>
            <TabsTrigger
              value="official"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Government Official
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citizen">
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle>Citizen Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Mobile Number</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or mobile number"
                    className="border-purple-200"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-purple-700 hover:text-purple-900">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="border-purple-200"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me for 30 days
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Login
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-purple-700 hover:text-purple-900 font-medium">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="official">
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle>Government Official Login</CardTitle>
                <CardDescription>Secure login for verified government officials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="official-id">Official ID</Label>
                  <Input
                    id="official-id"
                    type="text"
                    placeholder="Enter your official ID"
                    className="border-purple-200"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="official-password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-purple-700 hover:text-purple-900">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="official-password"
                    type="password"
                    placeholder="Enter your password"
                    className="border-purple-200"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="official-remember" />
                  <Label htmlFor="official-remember" className="text-sm font-normal">
                    Remember me for 30 days
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Login with DigiLocker
                </Button>
                <div className="text-center text-sm">
                  Need verification?{" "}
                  <Link href="/official-verification" className="text-purple-700 hover:text-purple-900 font-medium">
                    Get verified
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
