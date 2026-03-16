import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
  Shield,
  Bell,
  HelpCircle,
  Key,
  Mail,
  Smartphone,
  ChevronRight,
} from "lucide-react";

export function WalletSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Wallet Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" />
            Security
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-gold/60" />
                <div>
                  <p className="text-sm text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-ivory/40">
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>

            <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold/60" />
                <div>
                  <p className="text-sm text-white">Email Notifications</p>
                  <p className="text-xs text-ivory/40">
                    Get transaction alerts via email
                  </p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-gold/60" />
                <div>
                  <p className="text-sm text-white">Push Notifications</p>
                  <p className="text-xs text-ivory/40">
                    Real-time transaction alerts
                  </p>
                </div>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </div>
        </div>

        {/* Spending Limits */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" />
            Spending Limits
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-ivory/60 text-xs">Daily Limit (AGC)</Label>
              <Input
                type="number"
                placeholder="1000"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-ivory/60 text-xs">
                Monthly Limit (AGC)
              </Label>
              <Input
                type="number"
                placeholder="10000"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-gold" />
            Help & Support
          </h3>

          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between text-ivory/80 hover:text-white hover:bg-white/5"
            >
              <span>Transaction History</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between text-ivory/80 hover:text-white hover:bg-white/5"
            >
              <span>FAQ</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between text-ivory/80 hover:text-white hover:bg-white/5"
            >
              <span>Contact Support</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveSettings}
          className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}
