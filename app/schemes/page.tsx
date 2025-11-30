import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, Filter, Search, Users } from "lucide-react"

export default function SchemesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Government Schemes</h1>
            <p className="text-gray-500">Discover and apply for government schemes and benefits</p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search schemes..." className="pl-9 border-purple-200" />
            </div>
            <Button variant="outline" size="icon" className="border-purple-200">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-purple-100 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              All Schemes
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Education
            </TabsTrigger>
            <TabsTrigger
              value="employment"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Employment
            </TabsTrigger>
            <TabsTrigger value="welfare" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Welfare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Digital Literacy Program */}
              <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Digital Literacy Program</CardTitle>
                    <Badge className="bg-white text-blue-700">Education</Badge>
                  </div>
                  <CardDescription className="text-blue-100">Ministry of Electronics & IT</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Free training program to learn basic computer skills, internet usage, and accessing government
                    services online.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>5M+ beneficiaries</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Jan 2023</span>
                    </div>
                    <div className="flex items-center text-green-600 col-span-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Eligible based on your profile</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-blue-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: Open</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-0">New</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>

              {/* PM Kisan Samman Nidhi */}
              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">PM Kisan Samman Nidhi</CardTitle>
                    <Badge className="bg-white text-green-700">Welfare</Badge>
                  </div>
                  <CardDescription className="text-green-100">Ministry of Agriculture</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Direct income support of ₹6,000 per year to farmer families across the country in three equal
                    installments.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>120M+ beneficiaries</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Dec 2018</span>
                    </div>
                    <div className="flex items-center text-yellow-600 col-span-2">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Eligibility check required</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-green-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-green-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: June 30, 2023</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-0">Popular</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                    Check Eligibility
                  </Button>
                </CardFooter>
              </Card>

              {/* Skill India Initiative */}
              <Card className="border-purple-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Skill India Initiative</CardTitle>
                    <Badge className="bg-white text-purple-700">Employment</Badge>
                  </div>
                  <CardDescription className="text-purple-100">Ministry of Skill Development</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Vocational training program to enhance employability skills in various sectors including IT,
                    manufacturing, and services.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>10M+ beneficiaries</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Jul 2015</span>
                    </div>
                    <div className="flex items-center text-green-600 col-span-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Eligible based on your profile</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-purple-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-purple-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: July 15, 2023</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-0">New</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>

              {/* Startup India */}
              <Card className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Startup India</CardTitle>
                    <Badge className="bg-white text-orange-700">Employment</Badge>
                  </div>
                  <CardDescription className="text-orange-100">Ministry of Commerce & Industry</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Initiative to catalyze startup culture and build a strong ecosystem for innovation and
                    entrepreneurship in India.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>50K+ startups</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Jan 2016</span>
                    </div>
                    <div className="flex items-center text-yellow-600 col-span-2">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Eligibility check required</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-orange-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-orange-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: Open</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-0">Featured</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>

              {/* Ayushman Bharat */}
              <Card className="border-red-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Ayushman Bharat</CardTitle>
                    <Badge className="bg-white text-red-700">Welfare</Badge>
                  </div>
                  <CardDescription className="text-red-100">Ministry of Health & Family Welfare</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and
                    tertiary care hospitalization.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>500M+ beneficiaries</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Sep 2018</span>
                    </div>
                    <div className="flex items-center text-yellow-600 col-span-2">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Eligibility check required</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-red-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-red-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: Open</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-0">Popular</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                    Check Eligibility
                  </Button>
                </CardFooter>
              </Card>

              {/* Smart Cities Mission */}
              <Card className="border-cyan-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Smart Cities Mission</CardTitle>
                    <Badge className="bg-white text-cyan-700">Urban Development</Badge>
                  </div>
                  <CardDescription className="text-cyan-100">Ministry of Housing & Urban Affairs</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Urban renewal and retrofitting program to develop smart cities across India with a focus on
                    sustainable development.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>100 cities</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Jun 2015</span>
                    </div>
                    <div className="flex items-center text-blue-600 col-span-2">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Information only</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-cyan-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-cyan-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Ongoing Program</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-0">Featured</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Digital Literacy Program */}
              <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Digital Literacy Program</CardTitle>
                    <Badge className="bg-white text-blue-700">Education</Badge>
                  </div>
                  <CardDescription className="text-blue-100">Ministry of Electronics & IT</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Free training program to learn basic computer skills, internet usage, and accessing government
                    services online.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>5M+ beneficiaries</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Jan 2023</span>
                    </div>
                    <div className="flex items-center text-green-600 col-span-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Eligible based on your profile</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-blue-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: Open</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-0">New</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employment">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skill India Initiative */}
              <Card className="border-purple-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Skill India Initiative</CardTitle>
                    <Badge className="bg-white text-purple-700">Employment</Badge>
                  </div>
                  <CardDescription className="text-purple-100">Ministry of Skill Development</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Vocational training program to enhance employability skills in various sectors including IT,
                    manufacturing, and services.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>10M+ beneficiaries</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Jul 2015</span>
                    </div>
                    <div className="flex items-center text-green-600 col-span-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Eligible based on your profile</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-purple-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-purple-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: July 15, 2023</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-0">New</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>

              {/* Startup India */}
              <Card className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Startup India</CardTitle>
                    <Badge className="bg-white text-orange-700">Employment</Badge>
                  </div>
                  <CardDescription className="text-orange-100">Ministry of Commerce & Industry</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Initiative to catalyze startup culture and build a strong ecosystem for innovation and
                    entrepreneurship in India.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>50K+ startups</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Jan 2016</span>
                    </div>
                    <div className="flex items-center text-yellow-600 col-span-2">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Eligibility check required</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-orange-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-orange-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: Open</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-0">Featured</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="welfare">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* PM Kisan Samman Nidhi */}
              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">PM Kisan Samman Nidhi</CardTitle>
                    <Badge className="bg-white text-green-700">Welfare</Badge>
                  </div>
                  <CardDescription className="text-green-100">Ministry of Agriculture</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Direct income support of ₹6,000 per year to farmer families across the country in three equal
                    installments.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>120M+ beneficiaries</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Dec 2018</span>
                    </div>
                    <div className="flex items-center text-yellow-600 col-span-2">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Eligibility check required</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-green-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-green-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: June 30, 2023</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-0">Popular</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                    Check Eligibility
                  </Button>
                </CardFooter>
              </Card>

              {/* Ayushman Bharat */}
              <Card className="border-red-100 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Ayushman Bharat</CardTitle>
                    <Badge className="bg-white text-red-700">Welfare</Badge>
                  </div>
                  <CardDescription className="text-red-100">Ministry of Health & Family Welfare</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and
                    tertiary care hospitalization.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>500M+ beneficiaries</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Launched: Sep 2018</span>
                    </div>
                    <div className="flex items-center text-yellow-600 col-span-2">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Eligibility check required</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 bg-red-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-red-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Deadline: Open</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-0">Popular</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                    Check Eligibility
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
