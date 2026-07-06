import React, { useState } from 'react';

export default function WebsiteCustomizer() {
  const [theme, setTheme] = useState('pastel');

  return (
    <div className="p-4">
      <h2 className="mb-4"><i className="bi bi-palette me-2"></i>Website Customizer</h2>
      
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-4">
            <h5 className="mb-3">Theme Settings</h5>
            <div className="mb-3">
              <label className="form-label">Color Theme</label>
              <select className="form-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="pastel">Pastel (Current)</option>
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Primary Color</label>
              <input type="color" className="form-control" value="#B4D6D3" />
            </div>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h5 className="mb-3">Feature Toggles</h5>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="aiChat" defaultChecked />
              <label className="form-check-label" htmlFor="aiChat">AI Mentor Chat</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="peerTwins" defaultChecked />
              <label className="form-check-label" htmlFor="peerTwins">Peer Twin Matching</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="quiz" defaultChecked />
              <label className="form-check-label" htmlFor="quiz">Confidence Quiz</label>
            </div>
            <button className="btn btn-primary">Update Features</button>
          </div>
        </div>
      </div>
    </div>
  );
}
