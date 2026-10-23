import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <main className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
            <p className="font-mono text-6xl font-bold text-hot">404</p>
            <h1 className="mt-4 text-2xl font-extrabold">That page does not exist</h1>
            <Link to="/" className="mt-6 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                Back to home
            </Link>
        </main>
    )
}