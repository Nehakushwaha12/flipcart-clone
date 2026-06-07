import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateProfile } from '../redux/authSlice';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'addresses'>('settings');

  // Initialize state with user data or defaults
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'Male',
    isStudent: false
  });

  useEffect(() => {
    if (user) {
      const names = user.name.split(' ');
      setFormData({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email,
        gender: 'Male',
        isStudent: user.isStudent || false
      });
    } else {
      setFormData({
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@example.com',
        gender: 'Male',
        isStudent: false
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-[#fffbeb] min-h-screen py-12 transition-colors duration-500 text-black">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-amber-200/20 p-8 mb-6 flex items-center gap-6 border border-amber-50">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center shadow-inner">
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" className="w-12 h-12" alt="Profile" />
            </div>
            <div>
              <div className="text-[10px] font-black text-black/40 uppercase tracking-widest">Elite Member</div>
              <div className="font-black text-black text-xl tracking-tighter leading-tight">{user?.name || 'Guest User'}</div>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-amber-200/20 overflow-hidden border border-amber-50">
            <Link to="/orders" className="block p-6 border-b border-amber-50 hover:bg-amber-50/50 cursor-pointer text-black font-black text-xs uppercase tracking-widest transition-colors">
              <div className="flex items-center justify-between">
                <span>My Orders History</span>
                <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">→</div>
              </div>
            </Link>
            <div
              onClick={() => setActiveTab('settings')}
              className={`p-6 border-b border-amber-50 cursor-pointer font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'text-white bg-black' : 'text-black/60 hover:bg-amber-50'}`}
            >
              Account Settings
            </div>
            <div
              onClick={() => setActiveTab('addresses')}
              className={`p-6 cursor-pointer font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'addresses' ? 'text-white bg-black' : 'text-black/60 hover:bg-amber-50'}`}
            >
              Delivery Addresses
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-[3rem] shadow-2xl shadow-amber-200/30 p-10 border border-amber-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/30 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          {activeTab === 'settings' ? (
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Profile Details</h1>
                <button
                  className="bg-amber-50 text-amber-600 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-100 transition-all border border-amber-100"
                  onClick={() => {
                    if (isEditing && user) {
                      const names = user.name.split(' ');
                      setFormData({
                        firstName: names[0] || '',
                        lastName: names.slice(1).join(' ') || '',
                        email: user.email,
                        gender: formData.gender,
                        isStudent: user.isStudent || false
                      });
                    }
                    setIsEditing(!isEditing);
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="w-full md:w-1/2">
                  <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] block mb-3">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-4 bg-amber-50/30 border border-amber-100 rounded-2xl text-black font-black tracking-tight focus:outline-none focus:border-amber-500 focus:bg-white disabled:opacity-50 transition-all shadow-inner"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] block mb-3">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-4 bg-amber-50/30 border border-amber-100 rounded-2xl text-black font-black tracking-tight focus:outline-none focus:border-amber-500 focus:bg-white disabled:opacity-50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] block mb-3">Email Address</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full lg:w-2/3 p-4 bg-amber-50/30 border border-amber-100 rounded-2xl text-black font-black tracking-tight focus:outline-none focus:border-amber-500 focus:bg-white disabled:opacity-50 transition-all shadow-inner"
                />
              </div>

              <div className="mb-10">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] block mb-4">Gender</label>
                <div className="flex items-center gap-10">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-5 h-5 border-2 border-amber-200 text-black focus:ring-black rounded-full"
                    />
                    <span className="text-sm font-black text-black/60 uppercase tracking-widest group-hover:text-black transition-colors">Male</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-5 h-5 border-2 border-amber-200 text-black focus:ring-black rounded-full"
                    />
                    <span className="text-sm font-black text-black/60 uppercase tracking-widest group-hover:text-black transition-colors">Female</span>
                  </label>
                </div>
              </div>



              {isEditing && (
                <button
                  className="bg-black text-white px-12 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all w-full lg:w-auto"
                  onClick={() => {
                    dispatch(updateProfile({
                      name: `${formData.firstName} ${formData.lastName}`.trim(),
                      email: formData.email,
                      isStudent: formData.isStudent
                    }));
                    setIsEditing(false);
                    alert('Profile updated successfully!');
                  }}
                >
                  Save Changes
                </button>
              )}

              <div className="mt-16 border-t border-amber-50 pt-10">
                <h2 className="text-xl font-black mb-8 text-black uppercase tracking-tighter">Frequently Asked Questions</h2>
                <div className="grid gap-8">
                  <div className="bg-amber-50/30 p-6 rounded-2xl border border-amber-50">
                    <h4 className="font-black text-sm text-black mb-2 uppercase tracking-tighter">Updating Account Credentials</h4>
                    <p className="text-[11px] text-black/50 leading-relaxed font-bold">Your login email and mobile number are linked to your security profile. Updating these will trigger a verification cycle to ensure your account remains safe.</p>
                  </div>
                  <div className="bg-amber-50/30 p-6 rounded-2xl border border-amber-50">
                    <h4 className="font-black text-sm text-black mb-2 uppercase tracking-tighter">Verification Processing Time</h4>
                    <p className="text-[11px] text-black/50 leading-relaxed font-bold">Changes reflect instantly once you confirm the 6-digit verification code sent to your updated contact point.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-amber-50">
                <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Manage Addresses</h1>
                <button className="flex items-center gap-3 bg-black text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl">
                  <span className="text-lg">+</span> Add New Address
                </button>
              </div>
              <div className="bg-[#fffdf5] rounded-[3rem] p-20 text-center border-2 border-dashed border-amber-200 mt-8">
                <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myaddresses-empty_3b40af.png" className="w-16" alt="no addresses" />
                </div>
                <p className="text-2xl font-black text-black mb-3 uppercase tracking-tighter">No Addresses Saved</p>
                <p className="text-[10px] text-black/40 font-black uppercase tracking-widest">Your delivery destinations will appear here once added.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;