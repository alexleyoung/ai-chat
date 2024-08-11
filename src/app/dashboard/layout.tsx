import Aside from "@/components/dashboard/Aside";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex'>
      <Aside />
      <main className='ml-96 w-full'>{children}</main>
    </div>
  );
};

export default Layout;
