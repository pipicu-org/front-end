import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h1>Navbar</h1>
        <ul className="flex gap-[16px] text-[20px] sm:text-[24px]">
            <li><Link href="/reception">Recepción</Link></li>
            <li><Link href="/kitchen">Cocina</Link></li>
            <li><Link href="/delivery">Entrega</Link></li>
        </ul>
    </div>
  );
}

export default Navbar;
