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
    showToast(`OTP sent to ${formData.phone}`, "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      if (selectedRole === 'donor' && formData.donorType === 'Household / Individual') {
        if (!otpSent || otp.length !== 4) {
          showToast("Please enter the 4-digit OTP sent to your phone", "error");
          return;
        }
      }

      let certificateUrl = null;
      if (selectedRole === 'donor' && formData.donorType !== 'Household / Individual' && fssaiFile) {
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
        onClose();
        setFormData({ name: '', email: '', password: '', phone: '', address: '', donorType: 'Household / Individual', fssaiNumber: '', businessName: '', ownerName: '' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EBF1FE] text-[#1D52F2] mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {isSignup ? 'Create Your Account' : 'Welcome to FoodBridge AI'}
          </h2>
          <p className="text-xs text-slate-500">
            Select your role to access customized food rescue tools.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-2 bg-[#F8FAFC] p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedRole('donor')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              selectedRole === 'donor'
                ? 'bg-[#1D52F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Donor</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('volunteer')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              selectedRole === 'volunteer'
                ? 'bg-[#F26B1D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Volunteer</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('ngo')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              selectedRole === 'ngo'
                ? 'bg-[#63A644] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>NGO</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Donor Type</label>
                  <select
                    value={formData.donorType}
                    onChange={(e) => setFormData({...formData, donorType: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white cursor-pointer"
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
                <div className="space-y-4 p-4 rounded-2xl bg-[#FEF3EB] border border-[#F26B1D]/30">
                  <h4 className="text-xs font-black text-[#F26B1D] uppercase tracking-wider">FSSAI Verification Details</h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">FSSAI License Number *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="14-digit FSSAI Number"
                      value={formData.fssaiNumber}
                      onChange={(e) => setFormData({...formData, fssaiNumber: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#F26B1D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Business Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Registered Business Name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#F26B1D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Owner / Manager Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contact Person Name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#F26B1D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload FSSAI Certificate *</label>
                    <input 
                      type="file" 
                      required
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white file:text-slate-800 hover:file:bg-slate-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Org Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dhruv or Community Kitchen"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. +1 (555) 234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white"
                  />
                  {selectedRole === 'donor' && formData.donorType === 'Household / Individual' && (
                    <button 
                      type="button" 
                      onClick={handleSendOtp}
                      className="px-4 py-2 bg-[#FEF3EB] hover:bg-[#F26B1D]/15 text-[#F26B1D] rounded-xl text-xs font-bold transition-colors border border-[#F26B1D]/30 cursor-pointer"
                    >
                      {otpSent ? 'Sent' : 'Send OTP'}
                    </button>
                  )}
                </div>
              </div>

              {selectedRole === 'donor' && formData.donorType === 'Household / Individual' && otpSent && (
                <div className="p-3 bg-[#FEF3EB] rounded-xl border border-[#F26B1D]/30">
                  <label className="block text-xs font-bold text-[#F26B1D] mb-1">Enter OTP</label>
                  <input 
                    type="text" 
                    required
                    placeholder="4-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#F26B1D]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address / Operating Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Sector 4"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="user@foodbridge.ai"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1D52F2] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#1D52F2] hover:bg-[#133BB5] text-white font-black text-xs shadow-md shadow-[#1D52F2]/25 transition-all hover:scale-[1.01] cursor-pointer"
          >
            {isSignup ? `Register as ${capitalizeRole(selectedRole)}` : `Log In as ${capitalizeRole(selectedRole)}`}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs text-slate-500 hover:text-[#1D52F2] font-semibold transition-colors cursor-pointer"
          >
            {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
};
