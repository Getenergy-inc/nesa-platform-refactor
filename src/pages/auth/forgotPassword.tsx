// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import nesaStamp from "@/assets/nesa-stamp.jpeg";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sent, setSent] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/reset-password`,
//       });

//       if (error) throw error;

//       setSent(true);
//       toast.success("Password reset link sent!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to send reset link");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Forgot Password | NESA-Africa</title>
//       </Helmet>
//       <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6"
//         >
//           <Link to="/">
//             <img src={nesaStamp} alt="NESA Africa" className="h-14 w-14 rounded-full object-contain" />
//           </Link>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.1 }}
//           className="w-full max-w-md"
//         >
//           <Card className="border-white/10 bg-charcoal-light shadow-2xl">
//             <CardHeader className="text-center pb-4">
//               <CardTitle className="font-display text-2xl text-white">
//                 {sent ? "Check Your Email" : "Forgot Password"}
//               </CardTitle>
//               <CardDescription className="text-white/60">
//                 {sent
//                   ? "We've sent a password reset link to your email."
//                   : "Enter your email and we'll send you a link to reset your password."}
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-5">
//               {sent ? (
//                 <div className="text-center space-y-4">
//                   <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
//                     <CheckCircle className="h-8 w-8 text-green-400" />
//                   </div>
//                   <p className="text-white/70 text-sm">
//                     A reset link has been sent to <span className="text-gold font-medium">{email}</span>.
//                     Please check your inbox and spam folder.
//                   </p>
//                   <Button
//                     variant="ghost"
//                     onClick={() => setSent(false)}
//                     className="text-gold hover:text-gold-dark hover:bg-gold/10"
//                   >
//                     Send again
//                   </Button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-white/80">Email Address</Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="you@example.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold/50"
//                       />
//                     </div>
//                   </div>
//                   <Button
//                     type="submit"
//                     className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold h-11"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
//                     ) : (
//                       "Send Reset Link"
//                     )}
//                   </Button>
//                 </form>
//               )}

//               <Link
//                 to="/login"
//                 className="flex items-center justify-center gap-2 text-sm text-white/50 hover:text-gold transition-colors"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Sign In
//               </Link>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </>
//   );
// }
