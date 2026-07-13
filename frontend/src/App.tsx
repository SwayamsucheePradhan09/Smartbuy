import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./Components/SearchBar";
import ProductCard from "./Components/ProductCard";
import Loader from "./Components/Loader";
import CategoryNav from "./Components/CategoryNav";
import { 
  FiZap, 
  FiShield, 
  FiMessageSquare, 
  FiMail, 
  FiLock, 
  FiUser, 
  FiLogOut, 
  FiShoppingBag, 
  FiStar, 
  FiChevronRight 
} from "react-icons/fi";
import BlinkingEye from "./Components/BlinkingEye";

interface Product {
  platform: string;
  price: number;
  name?: string;
  image?: string;
  url?: string;
  rating?: string;
  is_global?: boolean;
  trend?: number[];
}

interface RecommendationProduct {
  name: string;
  platform: string;
  price: number;
  rating: string;
  image: string;
  url: string;
  category: string;
}

const MALE_RECOMMENDATIONS: RecommendationProduct[] = [
  {
    name: "OnePlus Nord Buds 3 Pro ANC Earbuds",
    platform: "Amazon",
    price: 2799,
    rating: "4.4",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80",
    url: "https://www.amazon.in/s?k=OnePlus+Nord+Buds+3+Pro",
    category: "Electronics"
  },
  {
    name: "Puma Men's Redon Fashion Sneakers",
    platform: "Flipkart",
    price: 1899,
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
    url: "https://www.flipkart.com/search?q=Puma+Mens+Shoes",
    category: "Fashion"
  },
  {
    name: "Philips OneBlade Hybrid Trimmer QP2520",
    platform: "Meesho",
    price: 1499,
    rating: "4.3",
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&q=80",
    url: "https://www.meesho.com/search?q=Philips+OneBlade",
    category: "Fashion"
  },
  {
    name: "Boat Storm Call 3 Smartwatch (Bluetooth)",
    platform: "Myntra",
    price: 1299,
    rating: "4.1",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&q=80",
    url: "https://www.myntra.com/boat-storm-call",
    category: "Fashion"
  }
];

const FEMALE_RECOMMENDATIONS: RecommendationProduct[] = [
  {
    name: "Lavie Women's Belleza Handbag",
    platform: "Amazon",
    price: 1499,
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
    url: "https://www.amazon.in/s?k=Lavie+Womens+Handbag",
    category: "Fashion"
  },
  {
    name: "Biba Women's Printed A-Line Kurta Set",
    platform: "Myntra",
    price: 1899,
    rating: "4.4",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80",
    url: "https://www.myntra.com/biba-kurta",
    category: "Fashion"
  },
  {
    name: "Maybelline New York Fit Me Foundation",
    platform: "Flipkart",
    price: 499,
    rating: "4.3",
    image: "https://images.unsplash.com/photo-1631730359575-38e4755d772b?w=300&q=80",
    url: "https://www.flipkart.com/search?q=Maybelline+Foundation",
    category: "Fashion"
  },
  {
    name: "Meesho Silver Plated Jewelry Gift Set",
    platform: "Meesho",
    price: 299,
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80",
    url: "https://www.meesho.com/search?q=Jewelry+Set",
    category: "Fashion"
  }
];

const GENERAL_RECOMMENDATIONS: RecommendationProduct[] = [
  {
    name: "Sony WH-1000XM4 Noise Canceling Headphones",
    platform: "Amazon",
    price: 19999,
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    url: "https://www.amazon.in/s?k=Sony+WH-1000XM4",
    category: "Electronics"
  },
  {
    name: "Adidas Stan Smith Leather Sneakers",
    platform: "Myntra",
    price: 4999,
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80",
    url: "https://www.myntra.com/adidas-stan-smith",
    category: "Fashion"
  },
  {
    name: "Wildcraft Unisex Outdoor Travel Backpack",
    platform: "Flipkart",
    price: 1299,
    rating: "4.3",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
    url: "https://www.flipkart.com/search?q=Wildcraft+Backpack",
    category: "General"
  },
  {
    name: "Portronics Ruffpad 15M LCD Writing Pad",
    platform: "Meesho",
    price: 599,
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=80",
    url: "https://www.meesho.com/search?q=LCD+Writing+Pad",
    category: "General"
  }
];

const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:5001/api"
  : "/api";

const App = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Authentication State
  const [user, setUser] = useState<{ name: string; gender: string; email: string } | null>(() => {
    const saved = localStorage.getItem("smartbuy_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smartbuy_token"));
  
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [regName, setRegName] = useState("");
  const [regGender, setRegGender] = useState("Male");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError("Email and password are required.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("smartbuy_user", JSON.stringify(data.user));
      localStorage.setItem("smartbuy_token", data.token);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regGender || !regEmail || !regPassword || !regConfirmPassword) {
      setAuthError("All fields are required.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          gender: regGender,
          email: regEmail,
          password: regPassword,
          confirm_password: regConfirmPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }
      // Successful registration: auto login
      const loginRes = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      });
      const loginData = await loginRes.json();
      setUser(loginData.user);
      setToken(loginData.token);
      localStorage.setItem("smartbuy_user", JSON.stringify(loginData.user));
      localStorage.setItem("smartbuy_token", loginData.token);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setProducts([]);
    setQuery("");
    setAdvice(null);
    localStorage.removeItem("smartbuy_user");
    localStorage.removeItem("smartbuy_token");
  };

  const calculateSmartScore = (price: number) => {
    if (products.length === 0) return 0;
    const items = products.map(p => p.price);
    const minPrice = Math.min(...items);
    if (price === minPrice) return 98;
    const score = 100 - ((price - minPrice) / minPrice) * 100;
    return Math.max(Math.round(score), 45);
  };

  const cheapestPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;

  const searchProduct = async (cat = selectedCategory, queryOverride?: string) => {
    const activeQuery = queryOverride !== undefined ? queryOverride : query;
    if (!activeQuery) return;
    setLoading(true);
    setAdvice(null);
    try {
      const response = await fetch(`${BACKEND_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery, category: cat }),
      });
      const data = await response.json();
      setProducts(data.results);
      setAdvice(data.advice);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCategorySelect = (name: string) => {
    setSelectedCategory(name);
    if (query) searchProduct(name);
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setProducts([]);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setQuery(data.detected_product);
      setProducts(data.results);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (!user || !token) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d24 40%, #0a0a1a 100%)',
          fontFamily: "'Inter', system-ui, sans-serif",
          color: '#f1f5f9',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        {/* ══ Ambient Glow Orbs ══ */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute', top: '-15%', left: '-5%',
              width: '50%', height: '50%', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute', bottom: '-10%', right: '-5%',
              width: '45%', height: '45%', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'rgba(22, 22, 51, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '28px',
            width: '100%',
            maxWidth: '450px',
            padding: '40px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(99, 102, 241, 0.05)',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                padding: '10px', borderRadius: '14px',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img src="/logo.png" alt="Smartbuy Logo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.04em', fontFamily: "'Outfit', sans-serif" }}>
                SMARTBUY<span style={{ color: '#6366f1' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
              {authView === 'login' ? 'Welcome back! Log in to snipe best prices.' : 'Create an account to start tracking deals.'}
            </p>
          </div>

          {/* Switch Tab */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '28px',
          }}>
            <button
              onClick={() => { setAuthView('login'); setAuthError(null); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: authView === 'login' ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : 'transparent',
                color: authView === 'login' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setAuthView('register'); setAuthError(null); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: authView === 'register' ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : 'transparent',
                color: authView === 'register' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Register
            </button>
          </div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>⚠️</span>
              {authError}
            </motion.div>
          )}

          {authView === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <FiMail style={{ width: 18, height: 18 }} />
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <FiLock style={{ width: 18, height: 18 }} />
                </span>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 48px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  required
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                  <BlinkingEye isVisible={showLoginPassword} onToggle={() => setShowLoginPassword(!showLoginPassword)} />
                </span>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)';
                }}
              >
                {authLoading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <FiUser style={{ width: 18, height: 18 }} />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  required
                />
              </div>

              {/* Gender Select */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>⚧</span>
                </span>
                <select
                  value={regGender}
                  onChange={e => setRegGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  required
                >
                  <option value="Male" style={{ background: '#0f0f23', color: '#fff' }}>Male</option>
                  <option value="Female" style={{ background: '#0f0f23', color: '#fff' }}>Female</option>
                  <option value="Other" style={{ background: '#0f0f23', color: '#fff' }}>Other</option>
                </select>
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none', fontSize: '10px' }}>
                  ▼
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <FiMail style={{ width: 18, height: 18 }} />
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <FiLock style={{ width: 18, height: 18 }} />
                </span>
                <input
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 48px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  required
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                  <BlinkingEye isVisible={showRegPassword} onToggle={() => setShowRegPassword(!showRegPassword)} />
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <FiLock style={{ width: 18, height: 18 }} />
                </span>
                <input
                  type={showRegConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 48px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  required
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                  <BlinkingEye isVisible={showRegConfirmPassword} onToggle={() => setShowRegConfirmPassword(!showRegConfirmPassword)} />
                </span>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)';
                }}
              >
                {authLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d24 40%, #0a0a1a 100%)',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#f1f5f9',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ══ Ambient Glow Orbs ══ */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '-15%', left: '-5%',
            width: '50%', height: '50%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', bottom: '-10%', right: '-5%',
            width: '45%', height: '45%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '30%', right: '15%',
            width: '25%', height: '25%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* ══ Navbar ══ */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          padding: '16px 24px',
          background: 'rgba(10,10,26,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                padding: '10px', borderRadius: '14px',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <img src="/logo.png" alt="Smartbuy Logo" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            </div>
            <span
              style={{
                fontSize: '22px', fontWeight: 900, letterSpacing: '-0.04em',
                fontFamily: "'Outfit', system-ui, sans-serif",
                color: '#fff',
              }}
            >
              SMARTBUY<span style={{ color: '#6366f1' }}>.</span>
            </span>
          </div>

          {/* User profile and logout */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: user.gender.toLowerCase() === 'female' ? '#ff3f6c' : user.gender.toLowerCase() === 'male' ? '#60a5fa' : '#a78bfa',
                  boxShadow: `0 0 8px ${user.gender.toLowerCase() === 'female' ? '#ff3f6c' : user.gender.toLowerCase() === 'male' ? '#60a5fa' : '#a78bfa'}`,
                }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  padding: '8px 16px', borderRadius: '12px',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
              >
                <FiLogOut style={{ width: 14, height: 14 }} />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ══ Hero ══ */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px', paddingTop: '32px', paddingBottom: '100px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <CategoryNav selectedCategory={selectedCategory} onSelect={handleCategorySelect} />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontWeight: 900, letterSpacing: '-0.04em',
              lineHeight: 1.1, marginBottom: '16px',
              fontSize: 'clamp(48px, 8vw, 96px)',
            }}
          >
            <span className="gradient-text">Smartbuy.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '15px',
              color: '#94a3b8',
              maxWidth: '540px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
              fontWeight: 500,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Compare real-time prices across major online retail stores instantly.
          </motion.p>

          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={() => searchProduct()}
            onImageUpload={handleImageUpload}
            isLoading={loading}
          />
        </div>

        {/* ══ Results ══ */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader"><Loader /></motion.div>
          ) : products.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: '1100px', margin: '0 auto' }}
            >


              {/* Results Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '28px', padding: '0 4px',
              }}>
                <div>
                  <h2 style={{
                    fontSize: '24px', fontWeight: 900,
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    color: '#fff',
                  }}>
                    Found {products.length} Best Matches
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#10b981', display: 'inline-block',
                      boxShadow: '0 0 8px rgba(16,185,129,0.5)',
                    }} />
                    <span style={{
                      fontSize: '10px', fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.15em',
                    }}>
                      Live Scan Complete
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: '10px', background: 'rgba(99,102,241,0.1)',
                  borderRadius: '12px', border: '1px solid rgba(99,102,241,0.15)',
                }}>
                  <FiZap style={{ color: '#6366f1', width: 18, height: 18 }} />
                </div>
              </div>

              {/* Smart Shopping Advice Banner */}
              {advice && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    marginBottom: '28px',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    padding: '10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(99,102,241,0.2)',
                    flexShrink: 0,
                  }}>
                    <FiMessageSquare style={{ color: '#fff', width: 20, height: 20 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#a78bfa',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      marginBottom: '4px',
                    }}>
                      Smart AI Shopping Advice
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#cbd5e1',
                      lineHeight: 1.5,
                    }}>
                      {advice}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Product Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
              }}>
                {products.map((p, idx) => (
                  <ProductCard
                    key={`${p.platform}-${idx}`}
                    product={p}
                    cheapestPrice={cheapestPrice}
                    smartScore={calculateSmartScore(p.price)}
                    index={idx}
                  />
                ))}
              </div>

              {/* Savings Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  marginTop: '60px', padding: '40px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(22,22,51,0.8), rgba(30,30,60,0.6))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px',
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 800, color: '#6366f1',
                    textTransform: 'uppercase', letterSpacing: '0.25em',
                    display: 'block', marginBottom: '12px',
                  }}>
                    Savings Dashboard
                  </span>
                  <h3 style={{
                    fontSize: '32px', fontWeight: 900, marginBottom: '12px',
                    fontFamily: "'Outfit', system-ui, sans-serif", color: '#fff',
                  }}>
                    You just saved{' '}
                    <span className="gradient-text">
                      ₹{(products[products.length - 1].price - cheapestPrice).toLocaleString()}
                    </span>
                  </h3>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', maxWidth: '380px', lineHeight: 1.7 }}>
                    Our sniping engine scanned across Global and Premium markets in 1.4 seconds.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <div style={{
                      padding: '16px 24px', borderRadius: '16px', textAlign: 'center',
                      background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)',
                      flex: 1,
                    }}>
                      <div className="gradient-text" style={{ fontSize: '22px', fontWeight: 900 }}>98.4%</div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Success Rate</div>
                    </div>
                    <div style={{
                      padding: '16px 24px', borderRadius: '16px', textAlign: 'center',
                      background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.12)',
                      flex: 1,
                    }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: '#10b981' }}>15</div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Stores</div>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                      color: '#fff', padding: '18px 40px', borderRadius: '16px',
                      fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer',
                      boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
                      transition: 'all 0.3s ease',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.3)'; }}
                  >
                    <FiShield style={{ width: 18, height: 18 }} />
                    Create Price Alert
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '40px 0',
              }}
            >
              {/* Personalized Greeting */}
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 900,
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  marginBottom: '12px',
                  color: '#fff'
                }}>
                  Welcome back, <span className="gradient-text">{user?.name}</span>!
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: '#94a3b8',
                  maxWidth: '600px',
                  margin: '0 auto 24px',
                  lineHeight: 1.6,
                  fontWeight: 500
                }}>
                  {user?.gender?.toLowerCase() === 'female'
                    ? "Let's discover the best fashion, beauty, and accessory deals in India!"
                    : user?.gender?.toLowerCase() === 'male'
                      ? "Ready to snipe the best gear and apparel deals in India?"
                      : "Welcome back! Let's find your perfect deal today."}
                </p>

                {/* Quick Tags */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}>
                  {(user?.gender?.toLowerCase() === 'female'
                    ? ["Kurtas", "Handbags", "Lipstick", "Heels", "Earrings", "Dresses"]
                    : user?.gender?.toLowerCase() === 'male'
                      ? ["Trimmers", "Running Shoes", "T-Shirts", "Smartwatches", "Earbuds", "Jeans"]
                      : ["Headphones", "Sneakers", "Backpacks", "Smart Home", "Watches"]
                  ).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        searchProduct(selectedCategory, tag);
                      }}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.color = '#cbd5e1';
                      }}
                    >
                      # {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Recommendations Grid */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  color: '#fff',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FiShoppingBag style={{ color: '#6366f1' }} />
                  Curated Deals for You
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '24px'
                }}>
                  {(user?.gender?.toLowerCase() === 'female' 
                    ? FEMALE_RECOMMENDATIONS 
                    : user?.gender?.toLowerCase() === 'male' 
                      ? MALE_RECOMMENDATIONS 
                      : GENERAL_RECOMMENDATIONS
                  ).map((item, idx) => (
                    <motion.div
                      key={`${item.name}-${idx}`}
                      whileHover={{ y: -6 }}
                      style={{
                        background: 'linear-gradient(160deg, rgba(30,30,60,0.7) 0%, rgba(22,22,51,0.85) 100%)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '20px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div>
                        {/* Platform Badge */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '14px'
                        }}>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 800,
                            padding: '4px 8px',
                            borderRadius: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: item.platform.toLowerCase() === 'amazon' ? 'rgba(255,153,0,0.15)' :
                                        item.platform.toLowerCase() === 'flipkart' ? 'rgba(40,116,240,0.15)' :
                                        item.platform.toLowerCase() === 'meesho' ? 'rgba(233,30,99,0.15)' :
                                        item.platform.toLowerCase() === 'myntra' ? 'rgba(255,63,108,0.15)' : 'rgba(99,102,241,0.15)',
                            color: item.platform.toLowerCase() === 'amazon' ? '#FF9900' :
                                   item.platform.toLowerCase() === 'flipkart' ? '#60a5fa' :
                                   item.platform.toLowerCase() === 'meesho' ? '#f472b6' :
                                   item.platform.toLowerCase() === 'myntra' ? '#ff3f6c' : '#a78bfa',
                            border: `1px solid ${
                              item.platform.toLowerCase() === 'amazon' ? 'rgba(255,153,0,0.2)' :
                              item.platform.toLowerCase() === 'flipkart' ? 'rgba(40,116,240,0.2)' :
                              item.platform.toLowerCase() === 'meesho' ? 'rgba(233,30,99,0.2)' :
                              item.platform.toLowerCase() === 'myntra' ? 'rgba(255,63,108,0.2)' : 'rgba(99,102,241,0.2)'
                            }`
                          }}>
                            {item.platform}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>
                            <FiStar style={{ fill: '#f59e0b', stroke: '#f59e0b', width: 12, height: 12 }} />
                            {item.rating}
                          </div>
                        </div>

                        {/* Image Container */}
                        <div style={{
                          width: '100%',
                          height: '140px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          marginBottom: '12px',
                          background: 'rgba(0,0,0,0.2)'
                        }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.src = `https://via.placeholder.com/300x150/1e1b4b/a78bfa?text=${encodeURIComponent(item.name.slice(0, 15))}`;
                            }}
                          />
                        </div>

                        <h4 style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#fff',
                          lineHeight: 1.4,
                          margin: '0 0 12px 0',
                          minHeight: '36px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.name}
                        </h4>
                      </div>

                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '4px',
                          marginBottom: '12px'
                        }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Starting at</span>
                          <span style={{ fontSize: '16px', fontWeight: 900, color: '#10b981' }}>₹{item.price.toLocaleString()}</span>
                        </div>

                        <button
                          onClick={() => {
                            setQuery(item.name);
                            searchProduct(selectedCategory, item.name);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(99,102,241,0.1)',
                            border: '1px solid rgba(99,102,241,0.15)',
                            borderRadius: '12px',
                            color: '#a78bfa',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #7c3aed)';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.borderColor = 'transparent';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                            e.currentTarget.style.color = '#a78bfa';
                            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)';
                          }}
                        >
                          Check Live Prices
                          <FiChevronRight style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ══ Footer ══ */}
      <footer style={{
        position: 'relative', zIndex: 10,
        padding: '64px 32px 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,26,0.9)',
        marginTop: '80px',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
        }}>
          {/* Main Footer Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '48px',
            paddingBottom: '40px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            {/* Column 1: Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  padding: '8px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src="/logo.png" alt="Smartbuy Logo" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 900, fontFamily: "'Outfit', system-ui, sans-serif", color: '#fff' }}>
                  SMARTBUY<span style={{ color: '#6366f1' }}>.</span>
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, fontWeight: 500 }}>
                SMARTBUY is a premium smart commerce aggregator engineered to compare real-time prices across major online shopping platforms and help you find the best deals.
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{
                fontSize: '11px', fontWeight: 800, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.15em',
              }}>
                Navigation
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
                <li>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setProducts([]); setQuery(""); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <span
                    onClick={() => setShowPrivacy(true)}
                    style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                  >
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => setShowTerms(true)}
                    style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                  >
                    Terms of Use
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Founder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{
                fontSize: '11px', fontWeight: 800, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.15em',
              }}>
                Founder
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <a
                  href="https://www.swayamsuchee.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '14px', fontWeight: 700, color: '#fff',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                  onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                >
                  Swayamsuchee Pradhan
                </a>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                  Founder & Creator
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
            alignItems: 'center', gap: '16px', paddingTop: '32px',
          }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              &copy; 2026 SMARTBUY. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: '24px' }}>
              <span
                onClick={() => setShowPrivacy(true)}
                style={{ fontSize: '12px', color: '#64748b', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >
                Privacy Policy
              </span>
              <span
                onClick={() => setShowTerms(true)}
                style={{ fontSize: '12px', color: '#64748b', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >
                Terms of Use
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(5,5,15,0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setShowPrivacy(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                background: 'rgba(22,22,51,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '640px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                color: '#cbd5e1',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{
                fontSize: '28px', fontWeight: 900, marginBottom: '20px',
                fontFamily: "'Outfit', system-ui, sans-serif", color: '#fff',
              }}>
                Privacy Policy
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', lineHeight: 1.7 }}>
                <p><strong>Effective Date:</strong> January 1, 2026</p>
                <p>At SmartBuy, we value your privacy. This Privacy Policy describes how we handle information when you use our platform.</p>
                <p><strong>1. Information Collection:</strong> SmartBuy does not require user accounts. We do not collect or store personal details. When you search for products, the queries are processed live to fetch prices and are not saved or associated with your identity.</p>
                <p><strong>2. Uploaded Images:</strong> Any images uploaded for visual product search are stored temporarily in a secure directory to extract query names and are deleted immediately after the search completes.</p>
                <p><strong>3. Third-Party Links:</strong> Our service displays redirect links to third-party retail platforms. We are not responsible for the privacy practices or contents of those external websites.</p>
                <p><strong>4. Updates:</strong> We may revise this Privacy Policy periodically. Continued use of our service signifies your agreement to these terms.</p>
              </div>
              <button
                onClick={() => setShowPrivacy(false)}
                style={{
                  marginTop: '32px', padding: '12px 28px', borderRadius: '12px',
                  border: 'none', background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  color: '#fff', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.25)', width: '100%',
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {showTerms && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(5,5,15,0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setShowTerms(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                background: 'rgba(22,22,51,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '640px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                color: '#cbd5e1',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{
                fontSize: '28px', fontWeight: 900, marginBottom: '20px',
                fontFamily: "'Outfit', system-ui, sans-serif", color: '#fff',
              }}>
                Terms of Use
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', lineHeight: 1.7 }}>
                <p><strong>Effective Date:</strong> January 1, 2026</p>
                <p>Welcome to SmartBuy. By accessing or using our platform, you agree to comply with and be bound by the following terms.</p>
                <p><strong>1. Intellectual Property & Aggregation:</strong> SmartBuy provides search results by compiling publicly available pricing data. All trademarked brand names, logos, and product information displayed are properties of their respective online stores.</p>
                <p><strong>2. Fair Use:</strong> You agree to use the service only for personal, non-commercial price comparison purposes. Automated scraping, crawling, or abuse of our search engines is strictly prohibited.</p>
                <p><strong>3. Disclaimer of Liability:</strong> SmartBuy does not sell products directly. We make no guarantees regarding price accuracy, inventory availability, shipping speeds, or product quality on external platforms.</p>
                <p><strong>4. Governing Law:</strong> These terms shall be governed by and construed in accordance with the laws of your local jurisdiction.</p>
              </div>
              <button
                onClick={() => setShowTerms(false)}
                style={{
                  marginTop: '32px', padding: '12px 28px', borderRadius: '12px',
                  border: 'none', background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  color: '#fff', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.25)', width: '100%',
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;