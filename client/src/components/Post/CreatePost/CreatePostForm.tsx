import "./createPost.scss";
import React, { useState } from "react";
import history from "../../../services/history";
import Slider from "../../Slider";
import { useTranslation } from "react-i18next";
import {
  createMemory,
  createPost,
  setPostActionError,
} from "../../../store/actions/postActions";
import { useLocation } from "react-router";
import { useTypedDispatch } from "../../../hooks/useTypedDispatch";

type CreateFormProps = {
  setModalOpen?: Function;
  isMemory?: boolean;
};

const CreatePostForm = ({
  setModalOpen,
  isMemory = false,
}: CreateFormProps) => {
  const [t] = useTranslation("common");
  const dispatch = useTypedDispatch();
  const { pathname } = useLocation();
  const [files, setFiles] = useState<any[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const onFileChange = (event: any) => {
    setFileLoading(true);
    const files: any[] = [];
    const previews: string[] = [];
    for (const file of event.currentTarget.files) {
      previews.push(URL.createObjectURL(file));
      files.push(file);
    }
    setFiles(files);
    setPreviewImages(previews);
    setFileLoading(false);
  };

  const onPostClick = () => {
    if (files.length) {
      const formData = new FormData();
      setFileLoading(true);
      formData.append("description", description);
      files.forEach((file) => {
        if (file.type.includes("video")) formData.append("videos", file);
        else formData.append("images", file);
      });
      dispatch(isMemory ? createMemory(formData) : createPost(formData))
        .then(() => {
          history.location.pathname !== "/" && history.goBack();
        })
        .finally(() => {
          setFileLoading(false);
        });
    } else dispatch(setPostActionError("Add at least one photo to post"));
  };
  const onCancelClick = () => {
    if (setModalOpen) setModalOpen(false);
    else history.push("/profile");
  };

  return (
    <div
      className={`create-post-form  ${
        pathname === "/create-post" || pathname === "/create-memory"
          ? "page"
          : ""
      }`}>
      {!previewImages.length ? (
        <>
          <input
            id='file'
            className='create-post-file-loader'
            type='file'
            required
            multiple
            accept='image/*, video/*'
            onChange={onFileChange}
          />
          <label htmlFor='file' className='file-loader-label'>
            <div
              className={`file-loader-label-inner ${
                previewImages.length ? "max-size" : ""
              }`}>
              <img src='../../assets/default-image.svg' alt='default' />
              {t("createPost.upload")}
            </div>
          </label>
        </>
      ) : (
        <Slider
          currentPost={{
            images: previewImages.map((img, ind) => ({ id: ind, image: img })),
            videos: [],
          }}
        />
      )}
      <div className='create-form-item'>
        <label htmlFor='description' className='create-post-form-label'>
          {t("createPost.description")}
        </label>
        <textarea
          id='description'
          className='create-post-form-textarea'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className='create-form-actions'>
        <button onClick={onCancelClick} className='create-form-action-button'>
          {t("common.cancel")}
        </button>
        <button
          disabled={fileLoading}
          onClick={onPostClick}
          className='create-form-action-button'>
          {t("common.post")}
        </button>
      </div>
    </div>
  );
};

export default CreatePostForm;
