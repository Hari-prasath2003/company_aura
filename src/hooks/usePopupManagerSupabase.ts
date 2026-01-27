import { useState, useEffect, useRef, useCallback } from "react";
import type { PopupFormData } from "../components/PopupForm";
import { sendEmailViaEmailJS } from "../services/emailService";
import { storeInSupabase, storeLocally } from "../services/supabaseService";

const COOKIE_NAME = "yip_popup_shown";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 1;

function hasShownInitialPopup(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some(row => row.startsWith(`${COOKIE_NAME}=`));
}

function markInitialPopupAsShown(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=true; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Strict`;
}

export function usePopupManager(isPageReady: boolean = true) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [animationType, setAnimationType] = useState(0);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const hasShownPopup = useRef(false);

  useEffect(() => {
    if (!isPageReady) {
      return;
    }

    const alreadyShown = hasShownInitialPopup();
    
    if (alreadyShown) {
      setShowFloatingButton(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!hasShownPopup.current) {
        setIsPopupOpen(true);
        setAnimationType(0);
        markInitialPopupAsShown();
        hasShownPopup.current = true;
        setShowFloatingButton(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPageReady]);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleOpenPopup = useCallback(() => {
    setIsPopupOpen(true);
    setAnimationType(Math.floor(Math.random() * 8));
  }, []);

  const handleSubmitForm = useCallback(async (data: PopupFormData) => {
    try {
      await storeInSupabase(data);
    } catch (dbError) {
      // Silent fail
    }

    try {
      await sendEmailViaEmailJS(data);
    } catch (emailError) {
      // Silent fail
    }

    storeLocally(data);
  }, []);

  return {
    isPopupOpen,
    animationType,
    showFloatingButton,
    handleClosePopup,
    handleOpenPopup,
    handleSubmitForm,
  };
}
