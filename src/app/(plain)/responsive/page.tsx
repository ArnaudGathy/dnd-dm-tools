export default function page() {
  return (
    <div>
      <div>Breakpoint :</div>
      <div className="sm:block lg:hidden xl:hidden md:hidden 2xl:hidden">sm</div>
      <div className="sm:hidden lg:hidden xl:hidden md:block 2xl:hidden">md</div>
      <div className="sm:hidden lg:block xl:hidden md:hidden 2xl:hidden">lg</div>
      <div className="sm:hidden lg:hidden xl:block md:hidden 2xl:hidden">xl</div>
      <div className="sm:hidden lg:hidden xl:hidden md:hidden 2xl:block">2xl</div>
    </div>
  );
}
