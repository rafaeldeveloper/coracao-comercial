import BottomNav from './BottomNav';

export default function Layout({ children, noBottomNav = false }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className={`flex-1 ${noBottomNav ? '' : 'pb-24'} page-enter`}>
        {children}
      </main>
      {!noBottomNav && <BottomNav />}
    </div>
  );
}
