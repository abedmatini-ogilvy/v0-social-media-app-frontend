import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  HelpCircle,
  Info,
  Phone,
  Share2,
  User,
  Users,
  Globe,
} from "lucide-react"
import MobileHeader from "@/components/mobile-header"
import MobileFooterNav from "@/components/mobile-footer-nav"

// This would normally come from a database or API
const getSchemeDetails = (id: string) => {
  return {
    id,
    title: "PM Kisan Samman Nidhi",
    description:
      "Income support of ₹6,000 per year in three equal installments to all land holding farmer families, subject to certain exclusions.",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    eligibility: [
      "All landholding farmers' families, which have cultivable landholding in their names.",
      "Small and Marginal Farmers (SMF) with combined landholding up to 2 hectares.",
      "Farmers with proper land records as per land revenue records of the concerned State/UT.",
    ],
    ineligibility: [
      "Institutional landholders",
      "Farmer families with one or more members holding constitutional posts",
      "Serving or retired officers and employees of State/Central government",
      "Professionals like doctors, engineers, lawyers, chartered accountants, etc.",
    ],
    funding:
      "₹6,000 per year in three equal installments of ₹2,000 each, directly transferred to beneficiary's bank account.",
    timeline: [
      { date: "June 30, 2023", event: "Application Deadline" },
      { date: "July 15, 2023", event: "Document Verification" },
      { date: "August 1, 2023", event: "First Installment Release" },
      { date: "December 1, 2023", event: "Second Installment Release" },
      { date: "April 1, 2024", event: "Third Installment Release" },
    ],
    documents: [
      { name: "Aadhaar Card", required: true },
      { name: "Land Records", required: true },
      { name: "Bank Account Details", required: true },
      { name: "Passport Size Photograph", required: true },
      { name: "Income Certificate", required: false },
      { name: "Caste Certificate (if applicable)", required: false },
    ],
    faqs: [
      {
        question: "How do I check my application status?",
        answer:
          "You can check your application status on the PM-KISAN portal (pmkisan.gov.in) using your Aadhaar number or by visiting your nearest Common Service Centre (CSC).",
      },
      {
        question: "What if I don't have land records in my name?",
        answer:
          "You need to have land records in your name to be eligible for this scheme. Please contact your local revenue department to update your land records.",
      },
      {
        question: "Can I apply if I have land in multiple states?",
        answer:
          "Yes, but you need to apply separately in each state where you own land. However, the total benefit will still be capped at ₹6,000 per year.",
      },
      {
        question: "What happens if my bank account details are incorrect?",
        answer:
          "If your bank account details are incorrect, the payment will fail. You can update your bank details on the PM-KISAN portal or at your nearest CSC.",
      },
      {
        question: "Is there an age limit for applying?",
        answer: "No, there is no age limit for applying to the PM-KISAN scheme.",
      },
    ],
    contactInfo: {
      helpline: "1800-11-0001",
      email: "pmkisan-ict@gov.in",
      website: "pmkisan.gov.in",
    },
    applicationStatus: {
      status: "Under Review",
      progress: 40,
      nextStep: "Document Verification",
      lastUpdated: "June 15, 2023",
    },
  }
}

export default function SchemeDetailsPage({ params }: { params: { id: string } }) {
  const scheme = getSchemeDetails(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Desktop Navigation */}
        <div className="hidden md:block mb-6">
          <Link href="/schemes" className="flex items-center text-purple-700 hover:text-purple-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Schemes</span>
          </Link>
        </div>

        {/* Scheme Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{scheme.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className="bg-purple-100 text-purple-800 border-0">{scheme.category}</Badge>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{scheme.ministry}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href={`/schemes/${params.id}/apply`}>Apply Now</Link>
              </Button>
            </div>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{scheme.description}</p>
        </div>

        {/* Mobile Back Link */}
        <div className="md:hidden mb-6">
          <Link href="/schemes" className="flex items-center text-purple-700 hover:text-purple-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Schemes</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6 bg-purple-100 p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="eligibility"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  Eligibility
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="faqs"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  FAQs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="border-purple-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Scheme Overview</CardTitle>
                    <CardDescription>Key details about the {scheme.title} scheme</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2 text-purple-600" />
                        About the Scheme
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{scheme.description}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-purple-600" />
                        Implementing Ministry
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{scheme.ministry}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-purple-600" />
                        Funding Details
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{scheme.funding}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                        Important Dates
                      </h3>
                      <div className="space-y-2">
                        {scheme.timeline.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{item.event}</span>
                            <span className="text-gray-600 dark:text-gray-400">{item.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="eligibility">
                <Card className="border-purple-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Eligibility Criteria</CardTitle>
                    <CardDescription>Who can apply for this scheme</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Eligible Candidates
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {scheme.eligibility.map((item, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2 text-red-600" />
                        Not Eligible
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {scheme.ineligibility.map((item, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card className="border-purple-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Required Documents</CardTitle>
                    <CardDescription>Documents needed for application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scheme.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              doc.required
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {doc.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Document Checklist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="faqs">
                <Card className="border-purple-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                    <CardDescription>Common questions about this scheme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {scheme.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger className="text-sm font-medium">
                            <div className="flex items-center">
                              <HelpCircle className="h-4 w-4 mr-2 text-purple-600 flex-shrink-0" />
                              <span className="text-left">{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-gray-700 dark:text-gray-300 pl-6">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Application Status & Contact */}
          <div className="space-y-6">
            {/* Application Status */}
            <Card className="border-purple-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      className={
                        scheme.applicationStatus.status === "Approved"
                          ? "bg-green-100 text-green-800 border-0"
                          : scheme.applicationStatus.status === "Rejected"
                            ? "bg-red-100 text-red-800 border-0"
                            : "bg-amber-100 text-amber-800 border-0"
                      }
                    >
                      {scheme.applicationStatus.status}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{scheme.applicationStatus.progress}%</span>
                    </div>
                    <Progress value={scheme.applicationStatus.progress} className="h-2" />
                  </div>

                  <div className="text-sm">
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Next step: <span className="font-medium">{scheme.applicationStatus.nextStep}</span>
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Last updated: {scheme.applicationStatus.lastUpdated}</p>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="sm"
                  >
                    <Link href={`/schemes/${params.id}/apply`}>Continue Application</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-purple-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Helpline</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{scheme.contactInfo.helpline}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{scheme.contactInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{scheme.contactInfo.website}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Footer Navigation */}
      <div className="md:hidden">
        <MobileFooterNav />
      </div>
    </div>
  )
}
