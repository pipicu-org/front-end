import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCurrentTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex items-center justify-between p-2 relative">
      <Link href="/reception">
        <Image
          src={`/resources/Pipi_Cucu_Texto.webp`}
          alt="Pipí Cucú"
          width={20}
          height={20}
          className="w-[8rem] sm:w-[10rem]"
          loading="lazy"
        />
      </Link>
      <div className="flex items-center gap-4">
        {/* Desktop menu */}
        <ul className="hidden md:flex gap-4 text-[12px] sm:text-sm">
          <li><Link href="/reception" className={pathname === '/reception' ? 'underline' : ''}>Recepción</Link></li>
          <li><Link href="/kitchen" className={pathname === '/kitchen' ? 'underline' : ''}>Cocina</Link></li>
          <li><Link href="/delivery" className={pathname === '/delivery' ? 'underline' : ''}>Entrega</Link></li>
          <li><Link href="/products" className={pathname === '/products' ? 'underline' : ''}>Productos</Link></li>
          <li><Link href="/metrics" className={pathname === '/metrics' ? 'underline' : ''}>Métricas</Link></li>
        </ul>
        <span className="font-poppins text-brand font-black text-lg sm:text-xl">{currentTime}</span>
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <ul className="flex flex-col gap-2 p-4 text-sm">
            <li><Link href="/reception" onClick={() => setIsMenuOpen(false)} className={pathname === '/reception' ? 'underline' : ''}>Recepción</Link></li>
            <li><Link href="/kitchen" onClick={() => setIsMenuOpen(false)} className={pathname === '/kitchen' ? 'underline' : ''}>Cocina</Link></li>
            <li><Link href="/delivery" onClick={() => setIsMenuOpen(false)} className={pathname === '/delivery' ? 'underline' : ''}>Entrega</Link></li>
            <li><Link href="/products" onClick={() => setIsMenuOpen(false)} className={pathname === '/products' ? 'underline' : ''}>Productos</Link></li>
            <li><Link href="/metrics" onClick={() => setIsMenuOpen(false)} className={pathname === '/metrics' ? 'underline' : ''}>Métricas</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
