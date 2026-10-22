import { Dna } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const links = ['Explore', 'Examples', 'Sources', 'About']

export default function Navbar() {
    return (
        <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                <a href="#" className="group flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-ink transition duration-300 group-hover:rotate-12">
                        <Dna size={20} />
                    </span>
                    <span className="text-lg font-extrabold tracking-tight">MutationLens</span>
                </a>

                <nav className="hidden items-center gap-1 md:flex">
                    {links.map((l) => (
                        <a
                            key={l}
                            href="#"
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition duration-200 hover:bg-soft hover:text-ink"
                        >
                            {l}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-bg transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                        Export report
                    </button>
                </div>
            </div>
        </header>
    )
}