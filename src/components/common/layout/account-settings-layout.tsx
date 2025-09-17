import { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from 'react';
import Header from '../header/header';
import Sidebar from '../sidebar/sidebar';
import Footer from '../footer/footer';
import Content from '../content/content';
import { getStorageString } from '../../../utilities/storage-utils';

interface LayoutProps { 
  setMyClass: Dispatch<SetStateAction<string>>;
}

const AccountSettingsLayout: FC<LayoutProps> = ({setMyClass}) => {
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
            <Footer />
    </>
  );
}
export default AccountSettingsLayout;

