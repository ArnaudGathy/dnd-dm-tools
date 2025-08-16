export default function page() {
  return (
    <div>
      <div>Breakpoint :</div>
      <div className="sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </div>
      <div className="sm:hidden md:block lg:hidden xl:hidden 2xl:hidden">
        md
      </div>
      <div className="sm:hidden md:hidden lg:block xl:hidden 2xl:hidden">
        lg
      </div>
      <div className="sm:hidden md:hidden lg:hidden xl:block 2xl:hidden">
        xl
      </div>
      <div className="sm:hidden md:hidden lg:hidden xl:hidden 2xl:block">
        2xl
      </div>
    </div>
  );
}
