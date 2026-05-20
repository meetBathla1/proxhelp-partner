import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const mainEl = document.querySelector('.app-main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
