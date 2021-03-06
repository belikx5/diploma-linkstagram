import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./services/history";
import Navbar from "./components/Navbar/Navbar";
import IndexPage from "./components/MainPage/IndexPage";
import Profile from "./components/User/UserProfile/Profile";
import EditForm from "./components/User/EditProfile/EditForm";
import CreatePostForm from "./components/Post/CreatePost/CreatePostForm";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import RequireAuth from "./components/RequireAuth";
import PostDetailsPage from "./components/Post/PostDetailsPage/PostDetailsPage";
import { SearchPage } from "./components/SearchPage";
import { Chats } from "./components/ChatsPage";

function RouterComponent() {
  return (
    <Router history={history}>
      <Navbar />
      <Switch>
        <Route path='/' exact>
          <IndexPage />
        </Route>
        <Route path='/search' exact>
          <SearchPage />
        </Route>
        <Route path='/#:postId'>
          <IndexPage />
        </Route>
        <Route path='/postDetails/:postId'>
          <PostDetailsPage />
        </Route>
        <Route path='/profile/:id'>
          <RequireAuth>
            <Profile isCurrentUser={false} />
          </RequireAuth>
        </Route>
        <Route path='/profile' exact>
          <RequireAuth>
            <Profile isCurrentUser />
          </RequireAuth>
        </Route>
        <Route path='/edit-post'>
          <RequireAuth>
            <EditForm />
          </RequireAuth>
        </Route>
        <Route path='/create-post'>
          <RequireAuth>
            <CreatePostForm />
          </RequireAuth>
        </Route>
        <Route path='/create-memory'>
          <RequireAuth>
            <CreatePostForm isMemory />
          </RequireAuth>
        </Route>
        <Route path='/chats'>
          <RequireAuth>
            <Chats />
          </RequireAuth>
        </Route>
        <Route path='/signin'>
          <Signin />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
      </Switch>
    </Router>
  );
}

export default RouterComponent;
