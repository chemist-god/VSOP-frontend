export function Footer() {
  const footerLinks = {
    Product: ["Editor", "Integrations", "Templates", "Pricing", "Changelog"],
    Resources: ["Docs", "API reference", "Status", "Community", "Security"],
    Company: ["About", "Customers", "Careers", "Contact", "Brand"],
    Connect: ["Contact us", "Community", "X (Twitter)", "GitHub", "YouTube"],
  }

  return (
    <footer className="border-t border-border py-16 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-1">
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" className="text-foreground">
              <path d="M20 30 L50 10 L80 30 L80 70 L50 90 L20 70 Z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
              <path d="M50 10 L50 50 L20 30" fill="#09090B" />
              <path d="M50 50 L80 70 L50 90" fill="#09090B" />
            </svg>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-foreground font-medium text-sm mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}><a href="#" className="text-muted-foreground hover:text-card-foreground transition-colors text-sm">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
