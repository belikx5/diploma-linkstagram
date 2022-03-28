import "./ownerPostList.scss";
import React, { useEffect, useState } from "react";
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
  const deadProfile = useTypedSelector(
    (state) => state.deadProfileState.deadProfile
  );

  useEffect(() => {
    if (user && user.is_dead_profile) dispatch(fetchDeadProfile(user.id));
  }, []);

  if (!posts.length) {
    return isCurrentUser ? (
      <>
        <h2>{t("profile.noCurrUserPosts")} </h2>
        <h3>{t("profile.tryToAdd")}</h3>
      </>
    ) : (
      <h2>{t("profile.noPosts")} </h2>
    );
  }
  if (user && !user.is_dead_profile)
    return (
      <div className='owner-posts'>
        {sortPostsDesc(posts).map((post, index) => {
          return <ListItem key={index} postData={post} />;
        })}
      </div>
    );

  return (
    <div>
      <div>
        <h3>
          This page belongs to dead user. Here you can create a new Memory
          related to page owner, communicate with frends, relatives and other
          trusted users of deceased.
        </h3>
        <div>
          {deadProfile?.trusted_users.map((tu) => (
            <UserIcon icon={tu.profile_photo} size={UserIconSize.Medium} />
          ))}
        </div>
        <button>Create Memory</button>
      </div>
      <div className='owner-posts'>
        {sortPostsDesc(posts).map((post, index) => {
          return <ListItem key={index} postData={post} />;
        })}
      </div>
    </div>
  );
};

type PostImageProps = {
  postData: Post;
  onImageClick: () => void;
  onDeletePost: () => void;
};

const PostImage = ({
  postData,
  onImageClick,
  onDeletePost,
}: PostImageProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
      {isHovered && <DropdownMenu deletePost={onDeletePost} isBright />}
    </div>
  );
};

type ListItemProps = {
  postData: Post;
};

const ListItem = ({ postData }: ListItemProps) => {
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
          postData={postData}
          onImageClick={navigateToPostView}
          onDeletePost={() => dispatch(deletePost(postData.id))}
        />
      </div>
      <div className='owner-posts-item desktop'>
        <PostImage
          postData={postData}
          onImageClick={() => setModalOpened(true)}
          onDeletePost={() => dispatch(deletePost(postData.id))}
        />
      </div>
    </>
  );
};
export default OwnerPostList;
