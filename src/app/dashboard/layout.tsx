import Aside from "@/components/dashboard/Aside";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex'>
      <Aside />
      {children}
    </div>
  );
};

export default Layout;
