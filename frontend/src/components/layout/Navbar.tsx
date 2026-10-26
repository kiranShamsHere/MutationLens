import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowLeftRight, Database, GraduationCap, House, Info, LayoutGrid, Menu, Microscope, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Container from './Container'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const links: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
    { to: '/', label: 'Home', icon: House, end: true },
    { to: '/explore', label: 'Explore', icon: Microscope },
    { to: '/examples', label: 'Examples', icon: LayoutGrid },
    { to: '/compare', label: 'Compare', icon: ArrowLeftRight },
    { to: '/learn', label: 'Learn', icon: GraduationCap },
    { to: '/sources', label: 'Sources', icon: Database },
    { to: '/about', label: 'About', icon: Info },
]

const underline =
    'after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-brand after:transition-transform after:duration-300'

export default function Navbar() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [open])

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-md">
                <Container className="flex items-center justify-between py-3">
                    <Link to="/" aria-label="MutationLens home">
                        <Logo />
                    </Link>

                    <nav className="hidden items-center gap-7 md:flex">
                        {links.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.end}
                                className={({ isActive }) =>
                                    `relative py-2 text-sm font-semibold transition-colors duration-200 ${underline} ${isActive ? 'text-ink after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100'
                                    }`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link
                            to="/explore"
                            className="hidden rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-bg transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:block"
                        >
                            Try it
                        </Link>
                        <button
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface transition duration-200 hover:border-brand active:scale-95 md:hidden"
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </Container>
            </header>

            {/* mobile menu, outside the header so it can cover the whole screen */}
            <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
                <button
                    aria-label="Close menu"
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'
                        }`}
                />
                <aside
                    className={`absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col overflow-y-auto bg-surface p-6 text-ink shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="mb-6 flex items-center justify-between">
                        <Logo size={30} />
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                            tabIndex={open ? 0 : -1}
                            className="grid h-9 w-9 place-items-center rounded-lg transition hover:bg-soft"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1">
                        {links.map(({ to, label, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                tabIndex={open ? 0 : -1}
                                onClick={() => setOpen(false)}
                                className="group flex items-center gap-3 px-1 py-3 text-base font-semibold"
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={18} className={isActive ? 'text-link' : 'text-muted'} />
                                        <span
                                            className={`relative ${underline} ${isActive ? 'text-link after:scale-x-100' : 'after:scale-x-0 group-hover:after:scale-x-100'
                                                }`}
                                        >
                                            {label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <Link
                        to="/explore"
                        tabIndex={open ? 0 : -1}
                        onClick={() => setOpen(false)}
                        className="mt-auto rounded-xl bg-brand px-4 py-3.5 text-center font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        Try your own variant
                    </Link>
                </aside>
            </div>
        </>
    )
}