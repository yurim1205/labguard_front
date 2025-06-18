function MenuCardList({ title, children }) {
  return (
    <div className="bg-white text-neutral-900 rounded-xl shadow-md p-6 my-4 min-w-[200px]">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

export default MenuCardList; 