import { Home, Menu } from 'lucide-react';

export function Header() {
  return (
    <header 
      className="px-6 py-5 border-b shadow-sm"
      style={{ 
        backgroundColor: '#ffffff',
        borderBottomColor: '#e5e5e5'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl shadow-lg" 
              style={{ 
                backgroundColor: '#035bfd',
                background: 'linear-gradient(135deg, #035bfd 0%, #0246c7 100%)'
              }}
            >
              <Home className="w-7 h-7" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl" style={{ color: '#212529' }}>🍌 SmartLand</h1>
              </div>
              <p className="text-sm mt-1" style={{ color: '#6c757d' }}>
                Sistem Analisis Multirisiko Kelayakan Lokasi Hunian Berbasis AI-GIS
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#035bfd' }}>
              Beranda
            </a>
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#6c757d' }}>
              Panduan
            </a>
            <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#6c757d' }}>
              Tentang
            </a>
            <button 
              className="px-5 py-2.5 rounded-full text-sm transition-all hover:shadow-lg"
              style={{ 
                backgroundColor: '#035bfd',
                color: '#ffffff'
              }}
            >
              Mulai Analisis
            </button>
          </nav>

          {/* Mobile Menu */}
          <button className="lg:hidden p-2">
            <Menu className="w-6 h-6" style={{ color: '#212529' }} />
          </button>
        </div>
      </div>
    </header>
  );
}