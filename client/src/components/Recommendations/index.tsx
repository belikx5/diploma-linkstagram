import "./recommendations.scss";
import React, { useCallback, useEffect } from "react";
import { CircularProgress, Tooltip } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import { useTranslation } from "react-i18next";
import UserIcon from "../User/UserIcon/UserIcon";
import { UserIconSize } from "../../ts/enums";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { fetchRecommendations } from "../../store/actions/userActions";
import history from "../../services/history";

const Recommendations = () => {
  const [t] = useTranslation("common");
  const dispatch = useTypedDispatch();
  const recommendations = useTypedSelector(
    (state) => state.userState.recommendations
  );
  const recommendationsLoading = useTypedSelector(
    (state) => state.userState.recommendationsLoading
  );

  const navigateToProfile = useCallback((uid: number) => {
    history.push("/profile/" + uid);
  }, []);
  useEffect(() => {
    dispatch(fetchRecommendations());
  }, []);
  return (
    <div className='recs'>
      {recommendations.length > 0 && (
        <h3>{t("recommendations.recommendedUsers")}</h3>
      )}
      {recommendationsLoading ? (
        <CircularProgress size={30} />
      ) : (
        <div className='recs-container'>
          {recommendations.map((u, i) => {
            return (
              <Tooltip
                key={u.id}
                title={u.username}
                arrow
                TransitionComponent={Fade}>
                <div
                  key={i}
                  className='rec'
                  onClick={() => navigateToProfile(u.id)}>
                  <UserIcon icon={u.profile_photo} size={UserIconSize.Medium} />
                </div>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
