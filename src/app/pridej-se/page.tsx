import type { Metadata } from 'next'
import PridejSeForm from './PridejSeForm'

export const metadata: Metadata = {
  title: 'Chci hrát za Baník',
  description: 'Přidej se k TJ Baník Švermov — vyplň krátkou přihlášku a my se ti ozveme.',
}

export default function PridejSePage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Nábor nových hráčů
          </span>
          <h1 className="mt-3 font-[Anton] text-foreground uppercase leading-none text-4xl sm:text-5xl">
            Chci hrát za Baník
            <span className="ml-1 inline-block h-[0.16em] w-[0.16em] align-baseline bg-primary" />
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Od nejmenších přípravek až po A-mužstvo. Vyplň krátkou přihlášku a my se ti ozveme.
          </p>
        </div>
        <PridejSeForm />
      </div>
    </div>
  )
}
