const Logout = ({ handleLogout }: { handleLogout: () => void }) => {
  
  return (
    <div className="py-2">
      <button
        type="button"
        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={handleLogout}
      >
        Sign out
      </button>
    </div>
  );
};

export default Logout;
