"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth-provider";

// State code to full name mapping
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "Washington D.C.",
};

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  // Citizen form state
  const [citizenFirstName, setCitizenFirstName] = useState("");
  const [citizenLastName, setCitizenLastName] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [citizenMobile, setCitizenMobile] = useState("");
  const [citizenState, setCitizenState] = useState("");
  const [citizenPassword, setCitizenPassword] = useState("");
  const [citizenTerms, setCitizenTerms] = useState(false);
  const [citizenError, setCitizenError] = useState("");

  // Official form state
  const [officialFirstName, setOfficialFirstName] = useState("");
  const [officialLastName, setOfficialLastName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officialDepartment, setOfficialDepartment] = useState("");
  const [officialEmployeeId, setOfficialEmployeeId] = useState("");
  const [officialPassword, setOfficialPassword] = useState("");
  const [officialTerms, setOfficialTerms] = useState(false);
  const [officialError, setOfficialError] = useState("");

  const handleCitizenSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCitizenError("");

    if (
      !citizenFirstName.trim() ||
      !citizenLastName.trim() ||
      !citizenEmail.trim() ||
      !citizenPassword.trim()
    ) {
      setCitizenError("Please fill in all required fields");
      return;
    }

    if (!citizenTerms) {
      setCitizenError("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    if (citizenPassword.length < 8) {
      setCitizenError("Password must be at least 8 characters");
      return;
    }

    // Basic password strength check
    const hasUpperCase = /[A-Z]/.test(citizenPassword);
    const hasLowerCase = /[a-z]/.test(citizenPassword);
    const hasNumbers = /\d/.test(citizenPassword);
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setCitizenError(
        "Password must contain uppercase, lowercase, and numbers"
      );
      return;
    }

    const success = await register({
      name: `${citizenFirstName.trim()} ${citizenLastName.trim()}`,
      email: citizenEmail.trim(),
      password: citizenPassword,
      role: "citizen",
      location: citizenState ? STATE_NAMES[citizenState] || "" : "",
      phone: citizenMobile.trim() || undefined,
    });

    if (success) {
      router.push("/");
    }
  };

  const handleOfficialSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfficialError("");

    if (
      !officialFirstName.trim() ||
      !officialLastName.trim() ||
      !officialEmail.trim() ||
      !officialPassword.trim()
    ) {
      setOfficialError("Please fill in all required fields");
      return;
    }

    if (!officialTerms) {
      setOfficialError("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    if (officialPassword.length < 8) {
      setOfficialError("Password must be at least 8 characters");
      return;
    }

    // Basic password strength check
    const hasUpperCase = /[A-Z]/.test(officialPassword);
    const hasLowerCase = /[a-z]/.test(officialPassword);
    const hasNumbers = /\d/.test(officialPassword);
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setOfficialError(
        "Password must contain uppercase, lowercase, and numbers"
      );
      return;
    }

    const success = await register({
      name: `${officialFirstName.trim()} ${officialLastName.trim()}`,
      email: officialEmail.trim(),
      password: officialPassword,
      role: "official",
    });

    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center text-purple-700 hover:text-purple-900"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={50}
              className="h-12 w-auto mx-auto"
              priority
            />
          </Link>
          <p className="text-gray-500 mt-2">Create your account</p>
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
              <form onSubmit={handleCitizenSignup}>
                <CardHeader>
                  <CardTitle>Create Citizen Account</CardTitle>
                  <CardDescription>
                    Enter your details to create your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {citizenError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                      {citizenError}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="First name"
                        className="border-purple-200"
                        value={citizenFirstName}
                        onChange={(e) => setCitizenFirstName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Last name"
                        className="border-purple-200"
                        value={citizenLastName}
                        onChange={(e) => setCitizenLastName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="border-purple-200"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter your mobile number"
                      className="border-purple-200"
                      value={citizenMobile}
                      onChange={(e) => setCitizenMobile(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={citizenState}
                      onValueChange={setCitizenState}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="border-purple-200">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="AR">Arkansas</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                        <SelectItem value="DE">Delaware</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="HI">Hawaii</SelectItem>
                        <SelectItem value="ID">Idaho</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="IN">Indiana</SelectItem>
                        <SelectItem value="IA">Iowa</SelectItem>
                        <SelectItem value="KS">Kansas</SelectItem>
                        <SelectItem value="KY">Kentucky</SelectItem>
                        <SelectItem value="LA">Louisiana</SelectItem>
                        <SelectItem value="ME">Maine</SelectItem>
                        <SelectItem value="MD">Maryland</SelectItem>
                        <SelectItem value="MA">Massachusetts</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                        <SelectItem value="MN">Minnesota</SelectItem>
                        <SelectItem value="MS">Mississippi</SelectItem>
                        <SelectItem value="MO">Missouri</SelectItem>
                        <SelectItem value="MT">Montana</SelectItem>
                        <SelectItem value="NE">Nebraska</SelectItem>
                        <SelectItem value="NV">Nevada</SelectItem>
                        <SelectItem value="NH">New Hampshire</SelectItem>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                        <SelectItem value="NM">New Mexico</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="ND">North Dakota</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="OK">Oklahoma</SelectItem>
                        <SelectItem value="OR">Oregon</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="RI">Rhode Island</SelectItem>
                        <SelectItem value="SC">South Carolina</SelectItem>
                        <SelectItem value="SD">South Dakota</SelectItem>
                        <SelectItem value="TN">Tennessee</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="UT">Utah</SelectItem>
                        <SelectItem value="VT">Vermont</SelectItem>
                        <SelectItem value="VA">Virginia</SelectItem>
                        <SelectItem value="WA">Washington</SelectItem>
                        <SelectItem value="WV">West Virginia</SelectItem>
                        <SelectItem value="WI">Wisconsin</SelectItem>
                        <SelectItem value="WY">Wyoming</SelectItem>
                        <SelectItem value="DC">Washington D.C.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      className="border-purple-200"
                      value={citizenPassword}
                      onChange={(e) => setCitizenPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={citizenTerms}
                      onCheckedChange={(checked) =>
                        setCitizenTerms(checked === true)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-xs font-normal">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-purple-700 hover:text-purple-900"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-purple-700 hover:text-purple-900"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-purple-700 hover:text-purple-900 font-medium"
                    >
                      Log in
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="official">
            <Card className="border-purple-100 shadow-lg">
              <form onSubmit={handleOfficialSignup}>
                <CardHeader>
                  <CardTitle>Government Official Registration</CardTitle>
                  <CardDescription>
                    Create an account with official verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {officialError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                      {officialError}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="official-first-name">First Name</Label>
                      <Input
                        id="official-first-name"
                        placeholder="First name"
                        className="border-purple-200"
                        value={officialFirstName}
                        onChange={(e) => setOfficialFirstName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="official-last-name">Last Name</Label>
                      <Input
                        id="official-last-name"
                        placeholder="Last name"
                        className="border-purple-200"
                        value={officialLastName}
                        onChange={(e) => setOfficialLastName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="official-email">Official Email</Label>
                    <Input
                      id="official-email"
                      type="email"
                      placeholder="Enter your official email"
                      className="border-purple-200"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={officialDepartment}
                      onValueChange={setOfficialDepartment}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="border-purple-200">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="home-affairs">
                          Home Affairs
                        </SelectItem>
                        <SelectItem value="municipal">
                          Municipal Corporation
                        </SelectItem>
                        <SelectItem value="police">Police</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="rural-development">
                          Rural Development
                        </SelectItem>
                        <SelectItem value="urban-development">
                          Urban Development
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-id">Employee ID</Label>
                    <Input
                      id="employee-id"
                      placeholder="Enter your employee ID"
                      className="border-purple-200"
                      value={officialEmployeeId}
                      onChange={(e) => setOfficialEmployeeId(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="official-password">Password</Label>
                    <Input
                      id="official-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      className="border-purple-200"
                      value={officialPassword}
                      onChange={(e) => setOfficialPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="official-terms"
                      checked={officialTerms}
                      onCheckedChange={(checked) =>
                        setOfficialTerms(checked === true)
                      }
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="official-terms"
                      className="text-xs font-normal"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-purple-700 hover:text-purple-900"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-purple-700 hover:text-purple-900"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-xs text-blue-700">
                      <strong>Note:</strong> Official accounts require
                      verification through DigiLocker or Aadhaar. You will be
                      prompted to complete verification after registration.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register & Proceed to Verification"
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-purple-700 hover:text-purple-900 font-medium"
                    >
                      Log in
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
