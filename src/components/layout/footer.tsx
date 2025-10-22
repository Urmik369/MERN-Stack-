import Link from 'next/link';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';

const footerLinks = [
  { title: 'Company', links: ['About Us', 'Careers', 'Press'] },
  { title: 'Support', links: ['Contact Us', 'FAQ', 'Shipping & Returns'] },
  { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
];

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
        {children}
    </Button>
);

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs">
              Modern clothing for the modern individual.
            </p>
            <div className="flex space-x-2">
                <SocialIcon>
                    <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </SocialIcon>
                <SocialIcon>
                    <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.936 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.314.936 20.647.525 19.86.22c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.06 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.381-.42.419-.819.679-1.38.896-.423.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.85-.074c-1.17-.06-1.805-.249-2.227-.413-.562-.217-.96-.477-1.381-.896-.419-.42-.679-.819-.896-1.38-.164-.423-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.074-4.85c.06-1.17.249-1.805.413-2.227.217-.562.477.96.896-1.381.42-.419.819-.679 1.38-.896.423-.164 1.057-.36 2.227-.413C8.415 2.175 8.797 2.16 12 2.16zm0 9.004c-2.42 0-4.385 1.965-4.385 4.385s1.965 4.385 4.385 4.385 4.385-1.965 4.385-4.385S14.42 11.164 12 11.164zm0 7.126c-1.506 0-2.729-1.223-2.729-2.729s1.223-2.729 2.729-2.729 2.729 1.223 2.729 2.729-1.223 2.729-2.729 2.729zm6.336-9.15c-.808 0-1.46-.652-1.46-1.46s.652-1.46 1.46-1.46 1.46.652 1.46 1.46-.652 1.46-1.46 1.46z"/></svg>
                </SocialIcon>
                 <SocialIcon>
                    <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </SocialIcon>
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold font-headline text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StyleSpace. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
