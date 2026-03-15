import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'HDFC Retirement Planner',
  description: 'An interactive, educational retirement corpus calculator by HDFC Mutual Fund.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {/* WCAG 2.1 AA Skip Navigation Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#224c87] text-white px-4 py-2 rounded shadow-lg z-50 font-bold"
        >
          Skip to main content
        </a>
        <main id="main-content" className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
