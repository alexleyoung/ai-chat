import ThemeToggle from "@/components/ThemeToggle";

const Aside = () => {
  return (
    <aside className='fixed w-96 h-screen bg-accent p-8'>
      <ThemeToggle />
    </aside>
  );
};

export default Aside;
