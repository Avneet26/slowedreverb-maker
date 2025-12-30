export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer" role="contentinfo">
            <p className="footer__text">
                Made with <span className="footer__heart" aria-label="love">♥</span> for music lovers
            </p>
            <p className="footer__sub">
                All processing happens in your browser • No files uploaded to servers
            </p>
            <p className="footer__copyright">
                © {currentYear} Slowed Reverb Maker. Free to use.
            </p>
        </footer>
    )
}
