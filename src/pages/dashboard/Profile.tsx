import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  User,
  Mail,
  Save,
  Loader2,
  Phone,
  X,
  Calendar,
  MapPin,
  Home,
  MapPinned,
  HomeIcon,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/api/user";
import { uploadApi, type fileType } from "@/api/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  path: string;
}

// All African countries
const countries = [
  // Africa
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo",
  "Côte d'Ivoire",
  "Djibouti",
  "DRC",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
  // Rest of the world
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "India",
  "UAE",
  "Australia",
  "New Zealand",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Belgium",
  "Portugal",
  "Austria",
  "Ireland",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Greece",
  "Turkey",
  "Israel",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Jordan",
  "Lebanon",
  "China",
  "Japan",
  "South Korea",
  "Singapore",
  "Malaysia",
  "Indonesia",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
  "Venezuela",
];

const genders = ["Male", "Female", "Other", "Prefer not to say"];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate years from 1900 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
  (currentYear - i).toString(),
);

const formInput =
  "mt-1 bg-black/60 border-amber-500/30 text-white placeholder:text-amber-400/40 focus:border-amber-400 focus:ring-amber-400/30";

function ProfileContent() {
  const { user, roles, accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);

  // Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  // Date of Birth - split into day, month, year
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");

  const [profileImage, setProfileImage] = useState<UploadedFile | null>(null);

  // Location Information
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  // Generate days based on selected month and year
  const getDaysInMonth = () => {
    if (!dobMonth || !dobYear) return 31;
    return new Date(parseInt(dobYear), parseInt(dobMonth) + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth() }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const userDetails = await userApi.fetchUserDetails(accessToken);

      // Personal Information
      setFirstName(userDetails.firstName || "");
      setLastName(userDetails.lastName || "");
      setPhone(userDetails.phone || "");
      setGender(userDetails.gender || "");

      // Parse date of birth if it exists
      if (userDetails.dateOfBirth) {
        const date = new Date(userDetails.dateOfBirth);
        if (!isNaN(date.getTime())) {
          setDobYear(date.getFullYear().toString());
          setDobMonth(date.getMonth().toString());
          setDobDay(date.getDate().toString().padStart(2, "0"));
        }
      }

      // Location Information
      setCountry(userDetails.country || "");
      setState(userDetails.state || "");
      setCity(userDetails.city || "");
      setAddress(userDetails.address || "");

      if (userDetails.profilePic) {
        setProfileImage({
          name: "",
          url: userDetails.profilePic,
          type: "image/jpeg",
          path: "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!accessToken) return;

    if (!firstName.trim()) return toast.error("First name required");
    if (!phone.trim()) return toast.error("Phone required");
    if (!country) return toast.error("Country required");

    // Construct date of birth from day, month, year
    let dateOfBirth = null;
    if (dobDay && dobMonth && dobYear) {
      // Create date in UTC to avoid timezone issues
      const date = new Date(
        Date.UTC(parseInt(dobYear), parseInt(dobMonth), parseInt(dobDay)),
      );
      dateOfBirth = date.toISOString();
    }

    try {
      setSaving(true);

      await userApi.updateUserProfile(accessToken, {
        firstName: firstName.trim(),
        lastName: lastName.trim() || null,
        phone: phone.trim(),
        gender: gender || null,
        dateOfBirth: dateOfBirth,
        profilePic: profileImage?.url || null,
        country,
        state: state.trim() || null,
        city: city.trim() || null,
        address: address.trim() || null,
      });

      toast.success("Profile updated");
      loadUserProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || !files.length || !accessToken) return;

    const file = files[0];

    try {
      setProfileUploading(true);

      const file_type: fileType = file.type.startsWith("image/")
        ? "IMAGE"
        : "DOCUMENT";

      const uploadUrl = await uploadApi.getPresignedUrl(
        accessToken,
        file.name,
        file.type,
        file.size.toString(),
        file_type,
      );

      await uploadApi.uploadFile(file, uploadUrl.signedUrl);

      const url = await uploadApi.getPublicUrl(accessToken, uploadUrl.path);

      setProfileImage({
        name: file.name,
        url,
        type: file.type,
        path: uploadUrl.path,
      });

      toast.success("Photo uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setProfileUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = () => {
    setProfileImage(null);
    toast.success("Photo removed");
  };

  // Reset day when month/year changes to avoid invalid dates
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const maxDays = getDaysInMonth();
      if (parseInt(dobDay) > maxDays) {
        setDobDay(maxDays.toString().padStart(2, "0"));
      }
    }
  }, [dobMonth, dobYear]);

  if (loading) {
    return (
      <InstitutionalDashboardLayout
        title="Profile"
        breadcrumbs={[{ label: "Profile" }]}
      >
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      </InstitutionalDashboardLayout>
    );
  }

  return (
    <InstitutionalDashboardLayout
      title="Profile"
      breadcrumbs={[{ label: "Profile" }]}
    >
      <Helmet>
        <title>My Profile | NESA Africa</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Header */}
        <Card className="border border-amber-500/20 bg-neutral-950/80 backdrop-blur-md shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <label
                className={cn(
                  "cursor-pointer block group",
                  profileUploading && "opacity-50 pointer-events-none",
                )}
              >
                {profileImage ? (
                  <img
                    src={profileImage.url}
                    alt="Profile"
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-amber-500/40 hover:border-amber-400 transition"
                  />
                ) : (
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center">
                    <User className="text-amber-400" />
                  </div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                />
              </label>

              {profileImage && (
                <button
                  onClick={removePhoto}
                  className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1.5 text-white hover:bg-rose-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {firstName} {lastName}
              </h2>

              <p className="text-xs sm:text-sm text-amber-300 flex items-center justify-center sm:justify-start gap-2 mt-1 break-all">
                <Mail className="h-4 w-4" /> {user?.email}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                {roles.map((role) => (
                  <Badge
                    key={role}
                    className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs"
                  >
                    {role.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border border-amber-500/20 bg-neutral-950/80 backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <User className="h-5 w-5 text-amber-400" />
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-amber-200 font-medium">
                  First Name *
                </Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`${formInput} w-full`}
                />
              </div>

              <div>
                <Label className="text-amber-200 font-medium">Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`${formInput} w-full`}
                />
              </div>
            </div>

            {/* Phone + Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-amber-200 font-medium">Phone *</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${formInput} w-full`}
                />
              </div>

              <div>
                <Label className="text-amber-200 font-medium">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-1 w-full bg-black/60 border-amber-500/30 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border border-amber-500/30 text-white">
                    {genders.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* DOB */}
            <div>
              <Label className="text-amber-200 font-medium mb-2 block">
                Date of Birth
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={dobMonth} onValueChange={setDobMonth}>
                  <SelectTrigger className="w-full bg-black/60 border-amber-500/30 text-white">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {months.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dobDay} onValueChange={setDobDay}>
                  <SelectTrigger className="w-full bg-black/60 border-amber-500/30 text-white">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dobYear} onValueChange={setDobYear}>
                  <SelectTrigger className="w-full bg-black/60 border-amber-500/30 text-white">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Country */}
            <div>
              <Label className="text-amber-200 font-medium">Country *</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="mt-1 w-full bg-black/60 border-amber-500/30 text-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-amber-500/20" />

            {/* Location */}
            <div>
              <h3 className="text-amber-200 font-medium mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                Location Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`${formInput} w-full`}
                  placeholder="State"
                />

                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`${formInput} w-full`}
                  placeholder="City"
                />
              </div>

              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${formInput} w-full`}
                placeholder="Address"
              />
            </div>

            {/* Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving || profileUploading}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-semibold px-6"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </InstitutionalDashboardLayout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
