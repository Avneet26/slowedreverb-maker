export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer" role="contentinfo">
            <p className="footer__text">
                Made with <span className="footer__heart" aria-label="love">♥</span> by{' '}
                <a
                    href="https://github.com/Avneet26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__author"
                    onClick={() => {
                        if (window.la?.track) {
                            window.la.track('click', 'author_github')
                        }
                    }}
                >
                    Avneet Virdi
                </a>
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
