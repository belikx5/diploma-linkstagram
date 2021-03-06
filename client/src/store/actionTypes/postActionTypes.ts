import { Profile, ProfileBrief } from "./userActionTypes";

export const FETCH_ALL_POSTS = "FETCH_ALL_POSTS";
export const FETCH_POST_BY_ID = "FETCH_POST_BY_ID";
export const RESET_CURRENT_POST = "RESET_CURRENT_POST";
export const FETCH_POSTS_BY_USER = "FETCH_POSTS_BY_USER";
export const SET_IS_POSTS_FETCHED = "SET_IS_POSTS_FETCHED";

export const CREATE_POST = "CREATE_POST";
export const CREATE_POST_MODAL_OPENED = "CREATE_POST_MODAL_OPENED";
export const POST_DETAILS_MODAL_OPENED = "POST_DETAILS_MODAL_OPENED";
export const EDIT_POST_VALUES = "EDIT_POST_VALUES";
export const DELETE_POST = "DELETE_POST";

export const SET_LIKE = "SET_LIKE";
export const REMOVE_LIKE = "REMOVE_LIKE";

export const FETCH_COMMENTS = "FETCH_COMMENTS";
export const ADD_COMMENT = "ADD_COMMENT";

export const POST_ACTION_ERROR = "POST_ACTION_ERROR";
export const CLEAR_POST_ACTION_ERROR = "CLEAR_POST_ACTION_ERROR";

export type Image = {
  id: number;
  image: string;
};
export type Video = {
  id: number;
  video: string;
};
export type PhotoAttribute = {
  image: {
    id: string;
    storage: string;
    metadata: {
      size: number;
      mime_type: string;
      filename: string;
    };
  };
};

export type Post = {
  id: number;
  author: ProfileBrief;
  memory_created_by_user: ProfileBrief | null;
  created_at: string;
  description: string;
  is_liked: boolean;
  likes_count: number;
  images: Image[];
  videos: Video[];
  tags: string[];
  comments: Comment[];
};

export type PostToCreate = {
  post: {
    description: string;
    photos_attributes: PhotoAttribute[];
  };
};

export type Comment = {
  id: number;
  user: {
    id: number;
    username: string;
    profile_photo: string;
  };
  created_at: string;
  message: string;
};

export interface FetchAllPosts {
  type: typeof FETCH_ALL_POSTS;
  payload: Post[];
}

export interface FetchPostById {
  type: typeof FETCH_POST_BY_ID;
  payload: Post;
}
export interface ResetCurrentPost {
  type: typeof RESET_CURRENT_POST;
  payload: null;
}

export interface FetchPostsByUser {
  type: typeof FETCH_POSTS_BY_USER;
  payload: Post[];
}

export interface SetIsPostsFetched {
  type: typeof SET_IS_POSTS_FETCHED;
  payload: boolean;
}

export interface CreatePost {
  type: typeof CREATE_POST;
  payload: Post;
}

export interface CreatePostModalOpened {
  type: typeof CREATE_POST_MODAL_OPENED;
  payload: boolean;
}
export interface PostDetailsModalOpened {
  type: typeof POST_DETAILS_MODAL_OPENED;
  payload: {
    postId: number;
    value: boolean;
  };
}

export interface EditPostDescription {
  type: typeof EDIT_POST_VALUES;
  payload: {
    postId: number;
    newDescription: string;
    tags: string[];
  };
}

export interface DeletePost {
  type: typeof DELETE_POST;
  payload: {
    postId: number;
  };
}

export interface SetLike {
  type: typeof SET_LIKE;
  payload: {
    postId: number;
  };
}
export interface RemoveLike {
  type: typeof REMOVE_LIKE;
  payload: {
    postId: number;
  };
}

export interface FetchComments {
  type: typeof FETCH_COMMENTS;
  payload: {
    comments: Comment[];
    postId: number;
  };
}

export interface AddComment {
  type: typeof ADD_COMMENT;
  payload: {
    postId: number;
    comment: Comment;
  };
}

export interface PostActionError {
  type: typeof POST_ACTION_ERROR;
  payload: {
    error: string;
  };
}

export interface ClearPostActionError {
  type: typeof CLEAR_POST_ACTION_ERROR;
}

export type PostDispatchTypes =
  | FetchAllPosts
  | FetchPostById
  | ResetCurrentPost
  | FetchPostsByUser
  | SetIsPostsFetched
  | CreatePost
  | CreatePostModalOpened
  | PostDetailsModalOpened
  | DeletePost
  | EditPostDescription
  | SetLike
  | RemoveLike
  | FetchComments
  | AddComment
  | PostActionError
  | ClearPostActionError;
