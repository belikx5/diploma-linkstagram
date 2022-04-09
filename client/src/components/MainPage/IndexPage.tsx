import "./indexPage.scss";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import {
  fetchAllPosts,
  openPostDetailsModal,
  setIsPostsFetched,
} from "../../store/actions/postActions";
import Recs from "../Recommendations";
import Posts from "../Post/PostList/Posts";
import UserCard from "../User/UserCard/UserCard";

const IndexPage = () => {
  const dispatch = useDispatch();
  const currentUser = useTypedSelector((state) => state.userState.currentUser);
  const { posts, isPostsFetched } = useTypedSelector(
    (state) => state.postsState
  );
  const loca = useLocation();
  useEffect(() => {
    dispatch(fetchAllPosts());
    if (loca.hash.includes("#")) {
      dispatch(openPostDetailsModal(+loca.hash.split("#")[1], true));
    }
    return () => {
      dispatch(setIsPostsFetched(false));
    };
  }, []);
  return currentUser ? (
    <div className='main-container'>
      <div className='main-container-posts'>
        <Recs />
        <Posts feed={posts} isPostsFetched={isPostsFetched} />
      </div>
      <div className='aside-user-card'>
        <UserCard isProfilePage={false} isCurrentUser={true} />
      </div>
    </div>
  ) : (
    <div className='main-container unauthorized'>
      <div className='main-container-posts'>
        <Recs />
        <Posts feed={posts} isPostsFetched={isPostsFetched} />
      </div>
    </div>
  );
};

export default IndexPage;
