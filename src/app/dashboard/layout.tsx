import Aside from "@/components/dashboard/Aside";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex overflow-hidden'>
      <Aside className='' />
      <main className='w-full'>{children}</main>
    </div>
  );
};

export default Layout;
