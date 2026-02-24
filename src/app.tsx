import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "./layout/main-layout"
import { DashboardPage } from "./pages/dashboard"
import { QrCodesPage } from "./pages/qr-codes"
import { Toaster } from "sonner";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/qr-codes" element={<QrCodesPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toaster position="top-right" richColors />
        </Router>
    )
}