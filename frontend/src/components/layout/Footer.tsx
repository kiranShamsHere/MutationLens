import Container from './Container'
import Logo from './Logo'

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-line">
            <Container className="flex flex-col items-center gap-3 py-10 text-center">
                <Logo size={30} />
                <p className="max-w-md text-sm text-muted">Educational and research tool. Not for medical use.</p>
                <p className="text-xs text-muted">© {new Date().getFullYear()} MutationLens. All rights reserved.</p>
            </Container>
        </footer>
    )
}