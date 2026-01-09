import { Dispatch, FC, Fragment, SetStateAction, useEffect, useState, lazy, Suspense } from 'react';
import { getStorageString } from '../../../utilities/storage-utils';
import { useSidebarSwipe } from '../../../utilities/hooks/useSidebarSwipe';

const Header = lazy(() => import('../header/header'));
const Sidebar = lazy(() => import('../sidebar/sidebar'));
const Footer = lazy(() => import('../footer/footer'));
const Content = lazy(() => import('../content/content'));

interface LayoutProps {
  setMyClass: Dispatch<SetStateAction<string>>;
}

const AccountSettingsLayout: FC<LayoutProps> = ({setMyClass}) => {
  // Enable swipe gestures for sidebar on mobile
  useSidebarSwipe();
  const Bodyclickk = async() => {
    let isCheck = await getStorageString("ynexverticalstyles")
    if (isCheck== "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute('icon-overlay') === 'open') {
          html.setAttribute('icon-overlay' ,"");
      }
    }
  }
  return (
    <>
    <Header />
            <Sidebar type='account-settings'/>
            <div className='content main-index'>
              <div className='main-content p-4'
                onClick={Bodyclickk}
              >
                <Content />
              </div>
            </div>
            {/* <Footer /> */}
    </>
  );
}
export default AccountSettingsLayout;

