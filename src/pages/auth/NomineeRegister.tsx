// src/pages/auth/NomineeRegister.tsx

import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { toast } from "sonner";
import { nominationApi } from "@/api/nomination";

const countries = [
  "Nigeria",
  "Kenya",
  "Ghana",
  "South Africa",
  "Ethiopia",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Senegal",
  "Cameroon",
  "Côte d'Ivoire",
  "Morocco",
  "Egypt",
  "Algeria",
  "Tunisia",
  "Zimbabwe",
  "Zambia",
  "Botswana",
  "Mozambique",
  "Angola",
  "Other",
];

// Nigerian states as an example (you can expand this for other countries)
const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

// Kenyan counties
const kenyaCounties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Machakos",
  "Uasin Gishu",
  "Kakamega",
  "Kilifi",
  "Kericho",
  "Garissa",
  "Meru",
  "Bungoma",
  "Mandera",
  "Kitui",
  "Migori",
  "Turkana",
  "Kwale",
  "Trans Nzoia",
  "Elgeyo Marakwet",
];

// Ghana regions
const ghanaRegions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Northern",
  "Central",
  "Upper East",
  "Upper West",
  "Volta",
  "Bono",
  "Ahafo",
  "Bono East",
  "North East",
  "Oti",
  "Savannah",
  "Western North",
];

// South Africa provinces
const southAfricaProvinces = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

export default function NomineeRegister() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const location = useLocation();

  const { from, token, nominationId } = location.state || {};

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Get states based on selected country
  const getStatesForCountry = () => {
    switch (country) {
      case "Nigeria":
        return nigeriaStates;
      case "Kenya":
        return kenyaCounties;
      case "Ghana":
        return ghanaRegions;
      case "South Africa":
        return southAfricaProvinces;
      default:
        return [];
    }
  };

  const statesList = getStatesForCountry();

  useEffect(() => {
    if (!token || !nominationId) {
      toast.error("Invalid nomination link");
      navigate("/");
      return;
    }

    const validate = async () => {
      setIsValidating(true);
      try {
        const res = await nominationApi.validateLink(nominationId, token);
        setFullName(res.nomineeName || "");
        setEmail(res.nomineeEmail || "");
        setPhone(res.nomineePhone || "");
        setCountry(res.nomineeCountry || "");
        setState(res.nomineeState || "");
      } catch (error) {
        toast.error("Invalid or expired link");
        navigate("/");
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [token, nominationId, navigate]);

  // Reset state when country changes
  useEffect(() => {
    setState("");
  }, [country]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate all required fields
    if (!fullName.trim()) {
      toast.error("Full name is required");
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      setLoading(false);
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      setLoading(false);
      return;
    }
    if (!country) {
      toast.error("Please select your country");
      setLoading(false);
      return;
    }
    if (!state) {
      toast.error("Please select your state/region");
      setLoading(false);
      return;
    }

    try {
      const [firstName, ...rest] = fullName.split(" ");
      const lastName = rest.join(" ");

      await signUp({
        email,
        password,
        firstName,
        lastName,
        phone,
        gender: "",
        dateOfBirth: "",
        accountType: "INDIVIDUAL",
        role: "NOMINEE",
        city: "",
        country,
        state,
        address: "",
        intents: ["JOIN_AS_NOMINEE"],
        organizationName: "",
        organizationNumber: null,
        organizationType: "",
        organizationFunctions: [],
        organizationWebsite: "",
        organizationSector: null,
      });

      // after that autologin
      await signIn(email, password);

      toast.success("Account created successfully!");

      navigate(
        `/nomination/accept?token=${token}&nominationId=${nominationId}`,
      );
    } catch (err) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-hero pattern-african py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                NESA Africa
              </span>
            </Link>
          </div>
          <Card className="border-0 shadow-2xl">
            <CardContent className="py-10 px-8 text-center">
              <div className="animate-pulse">
                <p className="text-gray-600">
                  Validating your nomination link...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pattern-african py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center">
              <Award className="h-6 w-6 text-secondary" />
            </div>
            <span className="font-display text-xl font-bold text-white">
              NESA Africa
            </span>
          </Link>

          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Complete Your Registration
          </h1>
          <p className="text-white/70">
            Create your account to accept your nomination.
          </p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardContent className="py-10 px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                  placeholder="Enter your full name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can edit this if needed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                  placeholder="Enter your email address"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can edit this if needed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                  minLength={6}
                  placeholder="Choose a password (min. 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                  placeholder="+2348012345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  State/Region <span className="text-red-500">*</span>
                </label>
                {statesList.length > 0 ? (
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  >
                    <option value="">Select your state/region</option>
                    {statesList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                    placeholder={
                      country
                        ? `Enter your state/region in ${country}`
                        : "Select a country first"
                    }
                    disabled={!country}
                  />
                )}
                {!country && (
                  <p className="text-sm text-gray-500 mt-1">
                    Please select a country first
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
