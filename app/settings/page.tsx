"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Eye,
  Globe,
  Lock,
  Moon,
  Sun,
  User,
  Volume2,
  Loader2,
} from "lucide-react";
import { useAccessibility } from "@/components/accessibility-provider";
import { useTheme } from "next-themes";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/components/auth-provider";
import { getToken } from "@/lib/auth-service";
import {
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
  changePassword,
  uploadAvatar,
} from "@/lib/api-service";
import { toast } from "sonner";
import type { User as UserType, UserSettings } from "@/lib/types";

export default function SettingsPage() {
  const {
    highContrast,
    toggleHighContrast,
    largeText,
    toggleLargeText,
    screenReader,
    toggleScreenReader,
  } = useAccessibility();
  const { theme, setTheme } = useTheme();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  // Profile state
  const [profile, setProfile] = useState<Partial<UserType>>({});
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Form state for account
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [schemeUpdates, setSchemeUpdates] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(true);
  const [fontSizeValue, setFontSizeValue] = useState([100]);

  // Fetch profile and settings
  const fetchData = useCallback(async () => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const [profileData, settingsData] = await Promise.all([
        getUserProfile(token),
        getUserSettings(token),
      ]);

      setProfile(profileData);
      setSettings(settingsData);

      // Parse name into first/last
      const nameParts = (profileData.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(profileData.email || "");
      setPhone(profileData.phone || "");
      setAddress(profileData.address || "");
      setCity(profileData.city || "");
      setState(profileData.state || "");
      setPincode(profileData.pincode || "");

      // Set notification preferences
      setEmailNotifications(settingsData.emailNotifications ?? true);
      setSmsNotifications(settingsData.smsNotifications ?? true);
      setPushNotifications(settingsData.pushNotifications ?? true);
      setEmergencyAlerts(settingsData.emergencyAlerts ?? true);
      setSchemeUpdates(settingsData.schemeUpdates ?? true);
      setCommunityUpdates(settingsData.communityUpdates ?? true);
      setFontSizeValue([settingsData.fontSize ?? 100]);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveAccount = async () => {
    const token = getToken();
    if (!token) return;

    setIsSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await updateUserProfile(token, {
        name: fullName,
        phone,
        address,
        city,
        state,
        pincode,
      });
      toast.success("Account information saved!");
    } catch (error) {
      console.error("Failed to save account:", error);
      toast.error("Failed to save account information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const token = getToken();
    if (!token) return;

    setIsChangingPassword(true);
    try {
      await changePassword(token, currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password. Check your current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = getToken();
    if (!token) return;

    setIsUploadingAvatar(true);
    try {
      const result = await uploadAvatar(file, token);
      setProfile((prev) => ({ ...prev, avatar: result.url }));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveNotifications = async () => {
    const token = getToken();
    if (!token) return;

    setIsSaving(true);
    try {
      await updateUserSettings(token, {
        emailNotifications,
        smsNotifications,
        pushNotifications,
        emergencyAlerts,
        schemeUpdates,
        communityUpdates,
      });
      toast.success("Notification preferences saved!");
    } catch (error) {
      console.error("Failed to save notifications:", error);
      toast.error("Failed to save notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

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
                    <AvatarImage
                      src={
                        profile.avatar || "/placeholder.svg?height=80&width=80"
                      }
                      alt={profile.name || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xl">
                      {(profile.name || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-bold text-lg">
                    {profile.name || "User"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @
                    {(profile.name || "user").toLowerCase().replace(/\s+/g, "")}
                  </p>
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
                {/* Hidden tabs - uncomment when ready
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
                */}
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
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="border-purple-200 dark:border-purple-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="border-purple-200 dark:border-purple-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="border-purple-200 dark:border-purple-900 bg-gray-50 dark:bg-gray-800"
                      />
                      <p className="text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="border-purple-200 dark:border-purple-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={state} onValueChange={setState}>
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select state" />
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">ZIP Code</Label>
                      <Input
                        id="pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <Button
                      onClick={handleSaveAccount}
                      disabled={isSaving}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                      Update your profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={
                            profile.avatar ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt={profile.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-2xl">
                          {(profile.name || "U")[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col gap-2">
                        <label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            disabled={isUploadingAvatar}
                          />
                          <Button
                            variant="outline"
                            className="border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-400"
                            disabled={isUploadingAvatar}
                            asChild
                          >
                            <span>
                              {isUploadingAvatar ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                "Upload New Picture"
                              )}
                            </span>
                          </Button>
                        </label>
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
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={
                        isChangingPassword ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                      }
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Notification Channels
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">
                            SMS Notifications
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive notifications via SMS
                          </p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">
                            Push Notifications
                          </Label>
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
                      <h3 className="text-lg font-medium">
                        Notification Types
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emergency-alerts">
                            Emergency Alerts
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notifications for emergency situations
                          </p>
                        </div>
                        <Switch
                          id="emergency-alerts"
                          checked={emergencyAlerts}
                          onCheckedChange={setEmergencyAlerts}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="scheme-updates">Scheme Updates</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Updates about government schemes
                          </p>
                        </div>
                        <Switch
                          id="scheme-updates"
                          checked={schemeUpdates}
                          onCheckedChange={setSchemeUpdates}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="community-updates">
                            Community Updates
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Updates from your community
                          </p>
                        </div>
                        <Switch
                          id="community-updates"
                          checked={communityUpdates}
                          onCheckedChange={setCommunityUpdates}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize how More & More Network looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Theme</h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          className={`flex flex-col items-center justify-center h-24 border-2 ${
                            theme === "light"
                              ? "border-purple-500"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                          onClick={() => setTheme("light")}
                        >
                          <Sun className="h-8 w-8 mb-2 text-yellow-500" />
                          <span>Light</span>
                        </Button>

                        <Button
                          variant="outline"
                          className={`flex flex-col items-center justify-center h-24 border-2 ${
                            theme === "dark"
                              ? "border-purple-500"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                          onClick={() => setTheme("dark")}
                        >
                          <Moon className="h-8 w-8 mb-2 text-blue-700 dark:text-blue-400" />
                          <span>Dark</span>
                        </Button>

                        <Button
                          variant="outline"
                          className={`flex flex-col items-center justify-center h-24 border-2 ${
                            theme === "system"
                              ? "border-purple-500"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
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
                    <CardDescription>
                      Make More & More Network more accessible for your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="high-contrast">
                            High Contrast Mode
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Increase contrast for better visibility
                          </p>
                        </div>
                        <Switch
                          id="high-contrast"
                          checked={highContrast}
                          onCheckedChange={toggleHighContrast}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="large-text">Large Text Mode</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Increase text size throughout the app
                          </p>
                        </div>
                        <Switch
                          id="large-text"
                          checked={largeText}
                          onCheckedChange={toggleLargeText}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="screen-reader">
                            Screen Reader Support
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enable compatibility with screen readers
                          </p>
                        </div>
                        <Switch
                          id="screen-reader"
                          checked={screenReader}
                          onCheckedChange={toggleScreenReader}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                      <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                        Voice Assistant
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mb-4">
                        Our voice assistant can help you navigate the app using
                        voice commands. Enable screen reader support to use this
                        feature.
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
                    <CardDescription>
                      Choose your preferred language
                    </CardDescription>
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
                            <SelectItem value="gu">
                              ગુજરાતી (Gujarati)
                            </SelectItem>
                            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                            <SelectItem value="ml">
                              മലയാളം (Malayalam)
                            </SelectItem>
                            <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondary-language">
                          Secondary Language
                        </Label>
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
                            <SelectItem value="gu">
                              ગુજરાતી (Gujarati)
                            </SelectItem>
                            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                            <SelectItem value="ml">
                              മലയാളം (Malayalam)
                            </SelectItem>
                            <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-translate">
                          Auto-Translate Content
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically translate content to your primary
                          language
                        </p>
                      </div>
                      <Switch id="auto-translate" defaultChecked />
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-md">
                      <h3 className="font-medium text-purple-700 dark:text-purple-400 mb-2">
                        AI Translation
                      </h3>
                      <p className="text-sm text-purple-600 dark:text-purple-300 mb-4">
                        More & More Network uses AI to provide high-quality
                        translations across multiple languages. Translation
                        quality may vary by language.
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
                    <CardDescription>
                      Manage your privacy preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Profile Visibility
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="profile-visibility">
                          Who can see your profile
                        </Label>
                        <Select defaultValue="everyone">
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="connections">
                              Connections Only
                            </SelectItem>
                            <SelectItem value="officials">
                              Government Officials Only
                            </SelectItem>
                            <SelectItem value="none">
                              No One (Private)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-visibility">
                          Who can see your posts
                        </Label>
                        <Select defaultValue="everyone">
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="connections">
                              Connections Only
                            </SelectItem>
                            <SelectItem value="officials">
                              Government Officials Only
                            </SelectItem>
                            <SelectItem value="none">
                              No One (Private)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data Sharing</h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="location-sharing">
                            Location Sharing
                          </Label>
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
                            Allow anonymous usage data collection to improve
                            services
                          </p>
                        </div>
                        <Switch id="data-analytics" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="personalized-ads">
                            Personalized Advertisements
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Show ads based on your interests
                          </p>
                        </div>
                        <Switch id="personalized-ads" defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security</h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">
                            Two-Factor Authentication
                          </Label>
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
                      <h3 className="font-medium text-red-700 dark:text-red-400 mb-2">
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
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
  );
}
