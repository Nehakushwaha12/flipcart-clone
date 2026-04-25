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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-[1000px] mx-auto px-4 flex flex-col md:flex-row gap-6">
         {/* Sidebar */}
         <div className="w-full md:w-1/4">
             <div className="bg-white shadow-sm p-4 mb-4 flex items-center gap-4">
                 <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" className="w-12 h-12" alt="Profile"/>
                 <div>
                     <div className="text-xs text-gray-600">Hello,</div>
                     <div className="font-bold text-gray-900">{user?.name || 'Guest User'}</div>
                 </div>
             </div>
             <div className="bg-white shadow-sm">
                 <Link to="/orders" className="block p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-blue-600 font-medium text-sm">
                    MY ORDERS
                 </Link>
                 <div 
                    onClick={() => setActiveTab('settings')}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer font-medium text-sm ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                 >
                    ACCOUNT SETTINGS
                 </div>
                 <div 
                    onClick={() => setActiveTab('addresses')}
                    className={`p-4 hover:bg-gray-50 cursor-pointer font-medium text-sm ${activeTab === 'addresses' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                 >
                    My Addresses
                 </div>
             </div>
         </div>

         {/* Main Content */}
         <div className="flex-1 bg-white shadow-sm p-6">
           {activeTab === 'settings' ? (
             <>
             <div className="flex justify-between items-center mb-6">
                 <h1 className="text-lg font-bold text-gray-900">Personal Information</h1>
                 <button 
                    className="text-blue-600 font-medium text-sm" 
                    onClick={() => {
                        if (isEditing && user) {
                            // Cancel edit: revert form data to original
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
                    {isEditing ? 'Cancel' : 'Edit'}
                 </button>
             </div>
             
             <div className="flex flex-col md:flex-row gap-6 mb-6">
                 <div className="w-full md:w-1/2">
                     <label className="text-xs text-gray-600 block mb-2 font-medium">First Name</label>
                     <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName} 
                        onChange={handleChange}
                        disabled={!isEditing} 
                        className="w-full p-2.5 border border-gray-300 rounded-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                     />
                 </div>
                 <div className="w-full md:w-1/2">
                     <label className="text-xs text-gray-600 block mb-2 font-medium">Last Name</label>
                     <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName} 
                        onChange={handleChange}
                        disabled={!isEditing} 
                        className="w-full p-2.5 border border-gray-300 rounded-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                     />
                 </div>
             </div>
             
             <div className="mb-6">
                 <label className="text-xs text-gray-600 block mb-2 font-medium">Email Address</label>
                 <div className="flex items-center gap-4">
                     <input 
                        type="text" 
                        name="email"
                        value={formData.email} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full md:w-1/2 p-2.5 border border-gray-300 rounded-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                 </div>
             </div>

             <div className="mb-6">
                 <label className="text-xs text-gray-600 block mb-2 font-medium">Gender</label>
                 <div className="flex items-center gap-6">
                     <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                            type="radio" 
                            name="gender" 
                            value="Male"
                            checked={formData.gender === 'Male'}
                            onChange={handleChange}
                            disabled={!isEditing} 
                            className="text-blue-600" 
                        /> 
                         <span className="text-sm text-gray-800">Male</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                            type="radio" 
                            name="gender" 
                            value="Female"
                            checked={formData.gender === 'Female'}
                            onChange={handleChange}
                            disabled={!isEditing} 
                            className="text-blue-600"
                        /> 
                         <span className="text-sm text-gray-800">Female</span>
                     </label>
                 </div>
             </div>

             <div className="mb-6 p-4 border rounded-md bg-blue-50/50">
                 <div className="flex items-center justify-between">
                     <div>
                         <h3 className="font-bold text-gray-900 flex items-center gap-2">🎓 Student Verification</h3>
                         <p className="text-xs text-gray-600 mt-1">Verify your student status to get a flat 10% discount on all electronics and books!</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                         <input 
                            type="checkbox" 
                            name="isStudent" 
                            className="sr-only peer" 
                            checked={formData.isStudent}
                            onChange={handleChange}
                            disabled={!isEditing}
                         />
                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     </label>
                 </div>
             </div>
             
             {isEditing && (
                 <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded-sm font-medium text-sm shadow hover:bg-blue-700 transition"
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
                     Save
                 </button>
             )}

             <h2 className="text-lg font-bold mb-4 mt-8 text-gray-900">FAQs</h2>
             <div className="text-sm space-y-4">
                 <div>
                     <h4 className="font-medium text-gray-800 mb-1">What happens when I update my email address (or mobile number)?</h4>
                     <p className="text-xs text-gray-600 leading-relaxed">Your login email id (or mobile number) changes, likewise. You'll receive all the account related communication on your updated email address (or mobile number).</p>
                 </div>
                 <div>
                     <h4 className="font-medium text-gray-800 mb-1">When will my Flipkart account be updated with the new email address (or mobile number)?</h4>
                     <p className="text-xs text-gray-600 leading-relaxed">It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
                 </div>
             </div>
             </>
           ) : (
             <div>
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-lg font-bold text-gray-900">Manage Addresses</h1>
                    <button className="flex items-center gap-1 text-blue-600 font-medium text-sm uppercase px-4 py-2 hover:bg-blue-50 rounded">
                        <span>+</span> ADD A NEW ADDRESS
                    </button>
                </div>
                <div className="border border-gray-200 rounded p-4 text-center text-gray-500 py-16 mt-4">
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myaddresses-empty_3b40af.png" className="w-[130px] mx-auto mb-6" alt="no addresses"/>
                    <p className="text-lg font-medium text-gray-900 mb-2">No Addresses found in your account!</p>
                    <p className="text-sm text-gray-500">Add a delivery address.</p>
                </div>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

export default Profile;