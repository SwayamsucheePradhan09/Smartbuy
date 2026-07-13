import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./Components/SearchBar";
import ProductCard from "./Components/ProductCard";
import Loader from "./Components/Loader";
import CategoryNav from "./Components/CategoryNav";
import { FiTrendingUp, FiZap, FiGithub, FiMessageSquare, FiShield } from "react-icons/fi";

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

const App = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const calculateSmartScore = (price: number) => {
    if (products.length === 0) return 0;
    const items = products.map(p => p.price);
    const minPrice = Math.min(...items);
    if (price === minPrice) return 98;
    const score = 100 - ((price - minPrice) / minPrice) * 100;
    return Math.max(Math.round(score), 45);
  };

  const cheapestPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;

  const searchProduct = async (cat = selectedCategory) => {
    if (!query) return;
    setLoading(true);
    setAdvice(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, category: cat }),
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
      const response = await fetch("http://127.0.0.1:5000/api/upload", {
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
          display: 'flex', justifyContent: 'center', alignItems: 'center',
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
              <FiTrendingUp style={{ color: '#fff', width: 20, height: 20 }} />
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                maxWidth: '800px', margin: '0 auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '80px 0',
              }}
            >
              <div className="float">
                <FiTrendingUp style={{ width: 120, height: 120, color: 'rgba(99,102,241,0.15)', marginBottom: '24px' }} />
              </div>
              <p style={{
                fontWeight: 900, fontSize: '22px', color: 'rgba(255,255,255,0.15)',
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}>
                Start Sniping Prices Now.
              </p>
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
                  display: 'flex', alignItems: 'center', justifycontent: 'center',
                }}>
                  <FiTrendingUp style={{ color: '#fff', width: 16, height: 16 }} />
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