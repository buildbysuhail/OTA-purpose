import { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from 'react';
import Header from '../header/header';
import Sidebar from '../sidebar/sidebar';
import Footer from '../footer/footer';
import Content from '../content/content';
import RPosContent from '../content/rpos-content';
import RPosHeader from '../header/rpos-header';

interface RPosProps { 
  setMyClass: Dispatch<SetStateAction<string>>;
}

const RPosLayout: FC<RPosProps> = ({setMyClass}) => {
  const Bodyclickk = () => {
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
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
    <RPosHeader />
            <div className='content content-rpos main-index'>
              <div className=''
                onClick={Bodyclickk}
              >
                <RPosContent />
              </div>
            </div>
            
    </>
  );
}
export default RPosLayout;

