import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState('');

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
    <div className="flex items-center justify-between p-2">
      <Link href="/reception"><Image src={`/resources/Pipi_Cucu_Texto.webp`} alt="Pipí Cucú" width={20} height={20} className="w-[12rem] " /></Link>
      <div className="flex items-center gap-4">
        <ul className="flex gap-4 text-[12px] sm:text-sm">
          <li><Link href="/reception">Recepción</Link></li>
          <li><Link href="/kitchen">Cocina</Link></li>
          <li><Link href="/delivery">Entrega</Link></li>
          <li><Link href="/products">Productos</Link></li>
        </ul>
        <span className="font-poppins text-brand font-black text-xl">{currentTime}</span>
      </div>
    </div>
  );
}

export default Navbar;
