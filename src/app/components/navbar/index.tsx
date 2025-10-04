import Link from "next/link";

const Navbar = () => {
  return (
<div className="flex items-center justify-between p-2">
  <h1>Pipí Cucú</h1>
  <div className="flex items-center gap-4">
    <ul className="flex gap-4 text-[12px] sm:text-sm">
      <li><Link href="/reception">Recepción</Link></li>
      <li><Link href="/kitchen">Cocina</Link></li>
      <li><Link href="/delivery">Entrega</Link></li>
      <li><Link href="/products">Productos</Link></li>
    </ul> 
    <span className="font-poppins text-brand font-black text-xl">19:32</span>
  </div>
</div>
  );
}

export default Navbar;
