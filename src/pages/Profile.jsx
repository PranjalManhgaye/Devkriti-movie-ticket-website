import React from "react";

function Profile() {
  const email = localStorage.getItem('email') || '';
  const role = localStorage.getItem('role') || '';
  return (
    <div>
      <h2>Your Profile</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Email:</strong> {email} <br />
        <strong>Role:</strong> {role === 'admin' ? <span style={{color: '#f72585', fontWeight: 'bold'}}>Admin</span> : 'User'}
      </div>
      <p>View your personal details and booking history.</p>
      <a href="/edit-profile" style={{display:'inline-block',marginTop:16,background:'#f72585',color:'#fff',padding:'8px 16px',borderRadius:6,textDecoration:'none'}}>Edit Profile</a>
    </div>
  );
}

export default Profile;
