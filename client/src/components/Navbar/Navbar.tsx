import "./navbar.scss";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import history from "../../services/history";
import { logout } from "../../store/actions/userActions";
import { UserIconSize } from "../../ts/enums";
import { Link, useLocation } from "react-router-dom";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useHandleClickOutside } from "../../hooks/useHandleClickOutside";
import UserIcon from "../User/UserIcon/UserIcon";
import Search from "./Search";

type LanguagesMenuProps = {
  i18n: any;
};

const LanguagesMenu = ({ i18n }: LanguagesMenuProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [containerRef] = useHandleClickOutside(setIsOpened);
  const getOppositeLanguage = () => (i18next.language === "en" ? "ua" : "en");
  const toggleLanguage = () => {
    i18n.changeLanguage(getOppositeLanguage());
    setIsOpened(false);
  };
  return (
    <div className='header-lang' ref={containerRef}>
      <button onClick={() => setIsOpened(!isOpened)} className='lang-button'>
        {i18next.language}
      </button>
      {isOpened && (
        <div className='header-lang-list'>
          <button onClick={toggleLanguage} className='lang-button'>
            {getOppositeLanguage()}
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [t, i18n] = useTranslation("common");
  const dispatch = useDispatch();
  const currentUser = useTypedSelector((state) => state.userState.currentUser);
  const location = useLocation();
  const { pathname } = location;
  const renderNavOptions = () => {
    if (pathname === "/edit-post" || pathname === "/create-post")
      return (
        <button
          onClick={() => dispatch(logout())}
          className='some-button white red'>
          {t("common.logout")}
        </button>
      );
    if (
      pathname === "/" ||
      pathname === "/search" ||
      pathname.includes("/chat")
    )
      return (
        <>
          <Search />
          <Link to='/chats' className='header-title-chats'>
            <img src='/assets/chats.svg' alt='chats' />
          </Link>
          <LanguagesMenu i18n={i18n} />
          <Link to='/profile' className='header-title-user-profile-pic'>
            <UserIcon
              icon={currentUser?.profile_photo}
              size={UserIconSize.Small}
            />
          </Link>
        </>
      );
    if (pathname.includes("/profile"))
      return (
        <>
          <Link to='/chats' className='header-title-chats'>
            <img src='/assets/chats.svg' alt='chats' />
          </Link>
          <LanguagesMenu i18n={i18n} />
          <button
            onClick={() => dispatch(logout())}
            className='some-button white red'>
            {t("common.logout")}
          </button>
        </>
      );
    if (pathname === "/signup" || pathname === "/signin")
      return <LanguagesMenu i18n={i18n} />;
  };
  return (
    <div className='header'>
      <div className='nav-options'>
        {pathname.includes("/postDetails") ? (
          <>
            <p onClick={history.goBack} className='header-title'>
              <img src='../../assets/arrow-left.svg' alt='left' />
            </p>
            <Link to='/profile' className='header-title-user-profile-pic'>
              <UserIcon
                icon={currentUser?.profile_photo}
                size={UserIconSize.Small}
              />
            </Link>
          </>
        ) : (
          <>
            <p onClick={() => history.push("/")} className='header-title'>
              LinkMe
            </p>
            <div className='nav-options-main'>{renderNavOptions()}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
