/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DeepCleaning from './pages/services/DeepCleaning';
import PressureCleaning from './pages/services/PressureCleaning';
import Gifting from './pages/services/Gifting';
import AdminDashboard from './pages/admin/Dashboard';
import TenantDashboard from './pages/admin/TenantDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/deep-cleaning" element={<DeepCleaning />} />
        <Route path="/services/pressure-cleaning" element={<PressureCleaning />} />
        <Route path="/services/gifting" element={<Gifting />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:storeSlug" element={<TenantDashboard />} />
      </Routes>
    </Router>
  );
}




