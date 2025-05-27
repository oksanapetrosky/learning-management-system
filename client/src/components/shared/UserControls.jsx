// components/shared/UserControls.jsx
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { assets } from "../../assets/assets";

// eslint-disable-next-line react/prop-types
const UserControls = ({ isMobile = false }) => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  if (user) {
    return <UserButton />;
  }

  return isMobile ? (
    <button onClick={() => openSignIn()}>
      <img src={assets.user_icon} alt="user icon" />
    </button>
  ) : (
    <button
      onClick={() => openSignIn()}
      className="bg-blue-600 text-white px-5 py-2 rounded-full"
    >
      Create Account
    </button>
  );
};

export default UserControls;
