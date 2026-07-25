import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  HeartHandshake, 
  Truck, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight 
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { registerUser, loginUser, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState('donor');
  const [isSignup, setIsSignup] = useState(false);
  const [fssaiFile, setFssaiFile] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    donorType: 'Household / Individual',
    fssaiNumber: '',
    businessName: '',
    ownerName: ''
  });

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFssaiFile(e.target.files[0]);
    }
  };

  const handleSendOtp = () => {
    if (!formData.phone) {
      showToast("Please enter a phone number first", "warning");
      return;
    }
    setOtpSent(true);
    showToast(`Simulated OTP sent to ${formData.phone}`, "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      if (selectedRole === 'donor' && formData.donorType === 'Household / Individual') {
        if (!otpSent || otp !== '1234') { // Simulated OTP check
          showToast("Please verify OTP (use 1234 for simulation)", "error");
          return;
        }
      }

      let certificateUrl = null;
      if (selectedRole === 'donor' && formData.donorType !== 'Household / Individual' && fssaiFile) {
         // Placeholder for actual file upload, we'll implement it properly later or assume it's handled in AppContext
         certificateUrl = URL.createObjectURL(fssaiFile); 
      }

      const success = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        phone: formData.phone,
        address: formData.address,
        donorType: selectedRole === 'donor' ? formData.donorType : undefined,
        fssaiNumber: formData.fssaiNumber,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        fssaiCertificate: certificateUrl
      });

      if (success) {
        setIsSignup(false);
        setOtpSent(false);
        setOtp('');
      }
    } else {
      const success = await loginUser(formData.email, formData.password, selectedRole);
      if (success) {
        onClose();
        setFormData({ name: '', email: '', password: '', phone: '', address: '', donorType: 'Household / Individual', fssaiNumber: '', businessName: '', ownerName: '' });
      }
    }
  };

  const capitalizeRole = (role) => {
    if (role === 'ngo') return 'NGO';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-900/40 text-slate-300 hover:text-white hover:bg-emerald-800/60 border border-emerald-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isSignup ? 'Create Your Account' : 'Welcome to FoodBridge AI'}
          </h2>
          <p className="text-xs text-slate-300">
            Select your role to access customized food rescue tools.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-2 bg-emerald-950/80 p-1.5 rounded-2xl border border-emerald-500/30">
          <button
            type="button"
            onClick={() => setSelectedRole('donor')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-bold transition-all ${
              selectedRole === 'donor'
                ? 'bg-emerald-500 text-emerald-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-emerald-800/30'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Donor</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('volunteer')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-bold transition-all ${
              selectedRole === 'volunteer'
                ? 'bg-emerald-500 text-emerald-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-emerald-800/30'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Volunteer</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('ngo')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-bold transition-all ${
              selectedRole === 'ngo'
                ? 'bg-emerald-500 text-emerald-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-emerald-800/30'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>NGO</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-bold transition-all ${
              selectedRole === 'admin'
                ? 'bg-emerald-500 text-emerald-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-emerald-800/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          
          {isSignup && (
            <>
              {selectedRole === 'donor' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Donor Type</label>
                  <select
                    value={formData.donorType}
                    onChange={(e) => setFormData({...formData, donorType: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Household / Individual">Household / Individual</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Catering Service">Catering Service</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Food Business">Other Food Business</option>
                  </select>
                </div>
              )}

              {selectedRole === 'donor' && formData.donorType !== 'Household / Individual' && (
                <div className="space-y-4 p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">FSSAI Verification Details</h4>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">FSSAI License Number *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="14-digit FSSAI Number"
                      value={formData.fssaiNumber}
                      onChange={(e) => setFormData({...formData, fssaiNumber: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Business Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Registered Business Name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Owner / Manager Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contact Person Name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Upload FSSAI Certificate *</label>
                    <input 
                      type="file" 
                      required
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name / Org Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Royal Horizon Hotel or Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. +1 (555) 234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                  />
                  {selectedRole === 'donor' && formData.donorType === 'Household / Individual' && (
                    <button 
                      type="button" 
                      onClick={handleSendOtp}
                      className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-colors border border-amber-500/30"
                    >
                      {otpSent ? 'Sent' : 'Send OTP'}
                    </button>
                  )}
                </div>
              </div>

              {selectedRole === 'donor' && formData.donorType === 'Household / Individual' && otpSent && (
                <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30">
                  <label className="block text-xs font-medium text-amber-300 mb-1">Enter OTP (Simulated: 1234)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="4-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-emerald-950/90 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Address / Operating Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Sector 4"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="user@foodbridge.ai"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            {isSignup ? `Register as ${capitalizeRole(selectedRole)}` : `Log In as ${capitalizeRole(selectedRole)}`}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs text-slate-400 hover:text-emerald-300 transition-colors"
          >
            {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
};
