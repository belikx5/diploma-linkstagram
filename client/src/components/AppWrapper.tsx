import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { SnackbarProvider } from "notistack";
import useNotifier from "../hooks/useNotifier";
import {
  enqueueSnackbar as enqueueSnackbarAction,
  errorSnackbarConfig,
} from "../store/actions/uiActions";
import { Notification } from "../store/actionTypes/uiActionTypes";
import { useTranslation } from "react-i18next";
import { setUILanguage } from "../services/i18n";

type AppWrapperProps = {
  children: JSX.Element;
};

function AppWrapper({ children }: AppWrapperProps) {
  useNotifier();
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation("common");
  const enqueueSnackbar = (notif: Notification) =>
    dispatch(enqueueSnackbarAction(notif));

  const postActionError = useTypedSelector(
    (state) => state.postsState.actionError
  );
  const userActionError = useTypedSelector(
    (state) => state.userState.actionError
  );

  useEffect(() => {
    postActionError &&
      enqueueSnackbar({
        text: postActionError,
        ...errorSnackbarConfig,
      });
  }, [postActionError]);

  useEffect(() => {
    userActionError &&
      enqueueSnackbar({
        text: userActionError,
        ...errorSnackbarConfig,
      });
  }, [userActionError]);

  useEffect(() => {
    setUILanguage(i18n.language);
  }, [i18n.language]);

  return <SnackbarProvider maxSnack={10}>{children}</SnackbarProvider>;
}

export default AppWrapper;
