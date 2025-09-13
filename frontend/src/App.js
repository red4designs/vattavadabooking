import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { PropertiesPage } from "./pages/PropertiesPage";
import { PropertyDetailsPage } from "./pages/PropertyDetailsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { ExperiencesPage } from "./pages/ExperiencesPage";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/property/:id" element={<PropertyDetailsPage />} />
                <Route path="/experiences" element={<ExperiencesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;