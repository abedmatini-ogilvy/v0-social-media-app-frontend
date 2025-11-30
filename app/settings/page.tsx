"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Bell, Eye, Globe, Lock, Moon, Sun, User, Volume2 } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"
import { useTheme } from "next-themes"
import { Slider } from "@/components/ui/slider"

export default function SettingsPage() {
  const { highContrast, toggleHighContrast, largeText, toggleLargeText, screenReader, toggleScreenReader } =
    useAccessibility()
  const { theme, setTheme } = useTheme()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emergencyAlerts, setEmergencyAlerts] = useState(true)
  const [schemeUpdates, setSchemeUpdates] = useState(true)
  const [communityUpdates, setCommunityUpdates] = useState(true)
  const [fontSizeValue, setFontSizeValue] = useState([100])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="flex items-center text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xl">
                      RK
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-bold text-lg">Ravi Kumar</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@ravikumar</p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-1 h-auto bg-purple-100 dark:bg-gray-800 p-1">
                <TabsTrigger
                  value="account"
                  className="justify-start py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="justify-start py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="justify-start py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="accessibility"
                  className="justify-start py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Accessibility
                </TabsTrigger>
                <TabsTrigger
                  value="language"
                  className="justify-start py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Language
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="justify-start py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Privacy & Security
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="account" className="w-full">
              <TabsContent value="account" className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          defaultValue="Ravi"
                          className="border-purple-200 dark:border-purple-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          defaultValue="Kumar"
                          className="border-purple-200 dark:border-purple-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="ravi.kumar@example.com"
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="+91 9876543210"
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        defaultValue="123 Main Street, Mumbai"
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" defaultValue="Mumbai" className="border-purple-200 dark:border-purple-900" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select defaultValue="maharashtra">
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input id="pincode" defaultValue="400001" className="border-purple-200 dark:border-purple-900" />
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your profile picture</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-2xl">
                          RK
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-400"
                        >
                          Upload New Picture
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove Picture
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" className="border-purple-200 dark:border-purple-900" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Update Password
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Channels</h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive push notifications on your device
                          </p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Types</h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notifications for emergency situations
                          </p>
                        </div>
                        <Switch id="emergency-alerts" checked={emergencyAlerts} onCheckedChange={setEmergencyAlerts} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="scheme-updates">Scheme Updates</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Updates about government schemes</p>
                        </div>
                        <Switch id="scheme-updates" checked={schemeUpdates} onCheckedChange={setSchemeUpdates} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="community-updates">Community Updates</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Updates from your community</p>
                        </div>
                        <Switch
                          id="community-updates"
                          checked={communityUpdates}
                          onCheckedChange={setCommunityUpdates}
                        />
                      </div>
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize how CivicConnect looks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Theme</h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          className={`flex flex-col items-center justify-center h-24 border-2 ${theme === "light" ? "border-purple-500" : "border-gray-200 dark:border-gray-700"}`}
                          onClick={() => setTheme("light")}
                        >
                          <Sun className="h-8 w-8 mb-2 text-yellow-500" />
                          <span>Light</span>
                        </Button>

                        <Button
                          variant="outline"
                          className={`flex flex-col items-center justify-center h-24 border-2 ${theme === "dark" ? "border-purple-500" : "border-gray-200 dark:border-gray-700"}`}
                          onClick={() => setTheme("dark")}
                        >
                          <Moon className="h-8 w-8 mb-2 text-blue-700 dark:text-blue-400" />
                          <span>Dark</span>
                        </Button>

                        <Button
                          variant="outline"
                          className={`flex flex-col items-center justify-center h-24 border-2 ${theme === "system" ? "border-purple-500" : "border-gray-200 dark:border-gray-700"}`}
                          onClick={() => setTheme("system")}
                        >
                          <div className="flex mb-2">
                            <Sun className="h-8 w-8 text-yellow-500" />
                            <Moon className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                          </div>
                          <span>System</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Font Size</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Small</span>
                          <span className="text-sm">Large</span>
                        </div>
                        <Slider
                          defaultValue={[100]}
                          max={150}
                          min={80}
                          step={10}
                          value={fontSizeValue}
                          onValueChange={setFontSizeValue}
                        />
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                          Current: {fontSizeValue}%
                        </div>
                      </div>
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Accessibility Settings</CardTitle>
                    <CardDescription>Make CivicConnect more accessible for your needs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="high-contrast">High Contrast Mode</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Increase contrast for better visibility
                          </p>
                        </div>
                        <Switch id="high-contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="large-text">Large Text Mode</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Increase text size throughout the app
                          </p>
                        </div>
                        <Switch id="large-text" checked={largeText} onCheckedChange={toggleLargeText} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="screen-reader">Screen Reader Support</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enable compatibility with screen readers
                          </p>
                        </div>
                        <Switch id="screen-reader" checked={screenReader} onCheckedChange={toggleScreenReader} />
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                      <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Voice Assistant</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mb-4">
                        Our voice assistant can help you navigate the app using voice commands. Enable screen reader
                        support to use this feature.
                      </p>
                      <Button
                        variant="outline"
                        className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400"
                        disabled={!screenReader}
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        Test Voice Assistant
                      </Button>
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="language" className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Language Settings</CardTitle>
                    <CardDescription>Choose your preferred language</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Primary Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                            <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                            <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                            <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                            <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                            <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondary-language">Secondary Language</Label>
                        <Select defaultValue="hi">
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select secondary language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                            <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                            <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                            <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                            <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                            <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-translate">Auto-Translate Content</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically translate content to your primary language
                        </p>
                      </div>
                      <Switch id="auto-translate" defaultChecked />
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-md">
                      <h3 className="font-medium text-purple-700 dark:text-purple-400 mb-2">AI Translation</h3>
                      <p className="text-sm text-purple-600 dark:text-purple-300 mb-4">
                        CivicConnect uses AI to provide high-quality translations across all Indian languages.
                        Translation quality may vary by language.
                      </p>
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Save Language Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Manage your privacy preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Profile Visibility</h3>

                      <div className="space-y-2">
                        <Label htmlFor="profile-visibility">Who can see your profile</Label>
                        <Select defaultValue="everyone">
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="officials">Government Officials Only</SelectItem>
                            <SelectItem value="none">No One (Private)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-visibility">Who can see your posts</Label>
                        <Select defaultValue="everyone">
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="officials">Government Officials Only</SelectItem>
                            <SelectItem value="none">No One (Private)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data Sharing</h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="location-sharing">Location Sharing</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Share your location for local services
                          </p>
                        </div>
                        <Switch id="location-sharing" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="data-analytics">Data Analytics</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Allow anonymous usage data collection to improve services
                          </p>
                        </div>
                        <Switch id="data-analytics" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="personalized-ads">Personalized Advertisements</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Show ads based on your interests</p>
                        </div>
                        <Switch id="personalized-ads" defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security</h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch id="two-factor" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="login-alerts">Login Alerts</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get notified of new logins to your account
                          </p>
                        </div>
                        <Switch id="login-alerts" defaultChecked />
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-md">
                      <h3 className="font-medium text-red-700 dark:text-red-400 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Save Privacy Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
