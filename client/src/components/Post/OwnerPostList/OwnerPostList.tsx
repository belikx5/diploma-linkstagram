import "./ownerPostList.scss";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Post } from "../../../store/actionTypes/postActionTypes";
import { useTranslation } from "react-i18next";
import { sortPostsDesc } from "../../../services/sorting";
import Modal from "../../ui/Modal/Modal";
import PostDetails from "../PostDetails/PostDetails";
import { useDispatch } from "react-redux";
import { deletePost, fetchComments } from "../../../store/actions/postActions";
import { useHistory, useLocation } from "react-router-dom";
import DropdownMenu from "../PostDropdown/DropdownMenu";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { useTypedDispatch } from "../../../hooks/useTypedDispatch";
import { fetchDeadProfile } from "../../../store/actions/deadProfileActions";
import UserIcon from "../../User/UserIcon/UserIcon";
import { UserIconSize } from "../../../ts/enums";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import history from "../../../services/history";
import { Profile } from "../../../store/actionTypes/userActionTypes";

type OwnerPostListProps = {
  posts: Post[];
  isCurrentUser: boolean;
};

const OwnerPostList = ({ posts, isCurrentUser }: OwnerPostListProps) => {
  const dispatch = useTypedDispatch();
  const [t] = useTranslation("common");
  const user = useTypedSelector(
    (state) =>
      state.userState[isCurrentUser ? "currentUser" : "anotherUserProfile"]
  );
  const currentAuthUser = useTypedSelector(
    (state) => state.userState.currentUser
  );
  const deadProfile = useTypedSelector(
    (state) => state.deadProfileState.deadProfile
  );

  const trustedUsers = useMemo(
    () => (deadProfile ? deadProfile.trusted_users : []),
    [deadProfile]
  );
  const isTrustedUsersNotEmpty = useMemo(
    () => !!trustedUsers.length,
    [trustedUsers]
  );
  const handleCreateMemory = useCallback(() => {
    history.push("/create-memory");
  }, []);

  const handleNavigateToTrusted = useCallback((uid: number) => {
    history.push("/profile/" + uid);
  }, []);

  const noPostsComponent = useCallback(
    () =>
      isCurrentUser ? (
        <>
          <h2 className='empty-info'>{t("profile.noCurrUserPosts")} </h2>
          <h3 className='empty-info'>{t("profile.tryToAdd")}</h3>
        </>
      ) : (
        <h2 className='empty-info'>{t("profile.noPosts")} </h2>
      ),
    [isCurrentUser]
  );

  useEffect(() => {
    if (user && user.is_dead_profile) dispatch(fetchDeadProfile(user.id));
  }, [user]);

  if (user && !user.is_dead_profile)
    return !posts.length ? (
      noPostsComponent()
    ) : (
      <div className='owner-posts'>
        {sortPostsDesc(posts).map((post, index) => {
          return (
            <ListItem
              currentUser={currentAuthUser}
              key={index}
              postData={post}
            />
          );
        })}
      </div>
    );

  return (
    <div>
      <section className='deceased-section'>
        <div className='info-action-block'>
          <h3 className='info'>{t("dead.deceasedSectionInfo")}</h3>
          <button onClick={handleCreateMemory}>{t("dead.createMemory")}</button>
        </div>
        {isTrustedUsersNotEmpty && (
          <>
            <h3 className='trusted-users-title'>{t("dead.trustedUsers")}</h3>
            <div className='trusted-users'>
              {deadProfile?.trusted_users.map((tu) => (
                <Tooltip
                  key={tu.id}
                  title={tu.username}
                  arrow
                  TransitionComponent={Fade}>
                  <div
                    className='user-item'
                    onClick={() => handleNavigateToTrusted(tu.id)}>
                    <UserIcon
                      icon={tu.profile_photo}
                      size={UserIconSize.Medium}
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
          </>
        )}
      </section>
      {!posts.length ? (
        noPostsComponent()
      ) : (
        <div className='owner-posts'>
          {sortPostsDesc(posts).map((post, index) => {
            return (
              <ListItem
                currentUser={currentAuthUser}
                key={index}
                postData={post}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

type PostImageProps = {
  postData: Post;
  onImageClick: () => void;
  onDeletePost: () => void;
  currentUser: Profile | null;
};

const PostImage = ({
  postData,
  onImageClick,
  onDeletePost,
  currentUser,
}: PostImageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const showDropdownMenu = useMemo(
    () =>
      isHovered &&
      currentUser &&
      (currentUser.id === postData.author.id ||
        currentUser.id === postData.memory_created_by_user?.id),
    [currentUser, postData, isHovered]
  );
  return (
    <div
      className='owner-posts-image-wrapper'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <img
        className={`owner-posts-image ${isHovered ? "hovered" : ""}`}
        src={postData?.images[0]?.image}
        onClick={onImageClick}
        alt='post-owner'
      />
      {showDropdownMenu && <DropdownMenu deletePost={onDeletePost} isBright />}
    </div>
  );
};

type ListItemProps = {
  postData: Post;
  currentUser: Profile | null;
};

const ListItem = ({ postData, currentUser }: ListItemProps) => {
  const [modalOpened, setModalOpened] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();
  const navigateToPostView = () => {
    history.push(`/postDetails/${postData.id}`);
  };
  const validateLocationForAction = (action: () => void) => {
    !pathname.includes("/postDetails") && action();
  };
  const postDetailsProps = {
    openModal: setModalOpened,
    postData,
    isPostDetails: true,
  };
  useEffect(() => {
    dispatch(fetchComments(postData.id));
  }, []);

  return (
    <>
      {modalOpened && (
        <Modal modalMarginTop={20} openModal={setModalOpened}>
          <PostDetails {...postDetailsProps} />
        </Modal>
      )}
      <div className='owner-posts-item mobile'>
        <PostImage
          currentUser={currentUser}
          postData={postData}
          onImageClick={navigateToPostView}
          onDeletePost={() => dispatch(deletePost(postData.id))}
        />
      </div>
      <div className='owner-posts-item desktop'>
        <PostImage
          currentUser={currentUser}
          postData={postData}
          onImageClick={() => setModalOpened(true)}
          onDeletePost={() => dispatch(deletePost(postData.id))}
        />
      </div>
    </>
  );
};
export default OwnerPostList;
