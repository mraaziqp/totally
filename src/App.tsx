/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeepCleaning from './pages/services/DeepCleaning';
import AdminDashboard from './pages/admin/Dashboard';
import TenantDashboard from './pages/admin/TenantDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeepCleaning />} />
        <Route path="/services/deep-cleaning" element={<DeepCleaning />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:storeSlug" element={<TenantDashboard />} />
      </Routes>
    </Router>
  );
}




