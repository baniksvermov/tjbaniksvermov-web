import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ order?: string }>
}

export default async function UspechPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center gap-6">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <div>
        <h1 className="font-[Anton] text-3xl uppercase tracking-wide">Objednávka přijata!</h1>
        {order && (
          <p className="mt-2 text-gray-500 text-sm">
            Číslo objednávky: <span className="font-semibold text-gray-800">{order}</span>
          </p>
        )}
      </div>
      <p className="max-w-md text-gray-600 text-sm leading-relaxed">
        Děkujeme za vaši objednávku. Brzy vás budeme kontaktovat s informacemi o platbě a
        termínu vyzvednutí nebo doručení.
      </p>
      <Link
        href="/eshop"
        className="rounded bg-[#c8102e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a00e26]"
      >
        Zpět do e-shopu
      </Link>
    </div>
  )
}
