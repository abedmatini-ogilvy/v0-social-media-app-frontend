import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
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
          <p className="text-gray-500 mt-1">Join your community today</p>
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
                <CardTitle>Create Citizen Account</CardTitle>
                <CardDescription>Enter your details to create your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="First name" className="border-purple-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Last name" className="border-purple-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" className="border-purple-200" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" type="tel" placeholder="Enter your mobile number" className="border-purple-200" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="assam">Assam</SelectItem>
                      <SelectItem value="bihar">Bihar</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="kerala">Kerala</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" className="border-purple-200" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-xs font-normal">
                    I agree to the{" "}
                    <Link href="/terms" className="text-purple-700 hover:text-purple-900">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-purple-700 hover:text-purple-900">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Create Account
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-700 hover:text-purple-900 font-medium">
                    Log in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="official">
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle>Government Official Registration</CardTitle>
                <CardDescription>Create an account with official verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="official-first-name">First Name</Label>
                    <Input id="official-first-name" placeholder="First name" className="border-purple-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="official-last-name">Last Name</Label>
                    <Input id="official-last-name" placeholder="Last name" className="border-purple-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="official-email">Official Email</Label>
                  <Input
                    id="official-email"
                    type="email"
                    placeholder="Enter your official email"
                    className="border-purple-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="home-affairs">Home Affairs</SelectItem>
                      <SelectItem value="municipal">Municipal Corporation</SelectItem>
                      <SelectItem value="police">Police</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="rural-development">Rural Development</SelectItem>
                      <SelectItem value="urban-development">Urban Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee-id">Employee ID</Label>
                  <Input id="employee-id" placeholder="Enter your employee ID" className="border-purple-200" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="official-password">Password</Label>
                  <Input
                    id="official-password"
                    type="password"
                    placeholder="Create a password"
                    className="border-purple-200"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="official-terms" />
                  <Label htmlFor="official-terms" className="text-xs font-normal">
                    I agree to the{" "}
                    <Link href="/terms" className="text-purple-700 hover:text-purple-900">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-purple-700 hover:text-purple-900">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Official accounts require verification through DigiLocker or Aadhaar. You
                    will be prompted to complete verification after registration.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Register & Proceed to Verification
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-700 hover:text-purple-900 font-medium">
                    Log in
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
