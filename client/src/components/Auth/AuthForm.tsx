import "./authFormStyles.scss";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { validate } from "../../services/validation";
import { useDispatch } from "react-redux";
import {
  clearAuthError,
  signin,
  signup,
} from "../../store/actions/userActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useTranslation } from "react-i18next";

type InputProps = {
  fieldName: string;
  value: string;
  onChange: (val: string) => void;
  onBlur: (fieldName: string, val: string) => void;
  label: string;
  validationError: string | null;
  type?: string;
};

const InputField = (props: InputProps) => {
  const { fieldName, value, onChange, onBlur, label, validationError, type } =
    props;
  return (
    <div className='auth-form-item'>
      <label htmlFor={fieldName} className='auth-form-item-label'>
        {label}
      </label>
      <div className='auth-form-item-with-validation'>
        <input
          id={fieldName}
          type={type ?? "text"}
          className='form-item-text-input'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onBlur(fieldName, value)}
        />
        {validationError !== null && (
          <img
            className={`form-item-validation-image `}
            src={`../../assets/validation-${
              validationError ? "error" : "success"
            }.svg`}
            alt='validation'
          />
        )}
      </div>
    </div>
  );
};

type AuthFormprops = {
  action: string;
  isSignup: boolean;
  linkTo: string;
  linkHeader: string;
  linkName: string;
};

const AuthForm = (props: AuthFormprops) => {
  const [t] = useTranslation("common");
  const { action, isSignup = false, linkTo, linkHeader, linkName } = props;
  const authError = useTypedSelector((state) => state.userState.authError);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    username: null,
    password: null,
    name: null,
    surname: null,
  });

  const handleSubmit = () => {
    isSignup
      ? dispatch(signup(username, name, surname, password))
      : dispatch(signin(username, password));
  };
  const showValidationError = (field: string) => {
    switch (field) {
      case "username":
        return validationErrors.username ? validationErrors.username : null;
      case "password":
        return validationErrors.password ? validationErrors.password : null;
      case "name":
        return validationErrors.name ? validationErrors.name : null;
      case "surname":
        return validationErrors.surname ? validationErrors.surname : null;
      default:
        return null;
    }
  };
  const onBlur = (fieldName: string, value: string) => {
    const res = validate(fieldName, value);
    if (res) setValidationErrors({ ...validationErrors, [fieldName]: res });
    else setValidationErrors({ ...validationErrors, [fieldName]: "" });
  };
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, []);
  return (
    <>
      <form className='auth-form' onSubmit={(e) => e.preventDefault()}>
        <h1>{action}</h1>
        {isSignup && (
          <>
            <InputField
              value={name}
              fieldName='name'
              validationError={validationErrors.name}
              label={t("auth.name")}
              onChange={setName}
              onBlur={onBlur}
            />
            <InputField
              value={surname}
              fieldName='surname'
              validationError={validationErrors.surname}
              label={t("auth.surname")}
              onChange={setSurname}
              onBlur={onBlur}
            />
          </>
        )}
        <InputField
          value={username}
          fieldName='username'
          validationError={validationErrors.username}
          label={t("auth.username")}
          onChange={setUsername}
          onBlur={onBlur}
        />
        <InputField
          value={password}
          fieldName='password'
          type='password'
          validationError={validationErrors.password}
          label={t("auth.password")}
          onChange={setPassword}
          onBlur={onBlur}
        />
        <div className='auth-form-actions'>
          {authError.error && (
            <p className='auth-form-actions-error-message'>
              {authError.error}{" "}
              {authError.fieldError[1] ? "- " + authError.fieldError[1] : ""}
            </p>
          )}
          <p className='auth-form-actions-error-message'>
            {showValidationError("email")}
          </p>
          <p className='auth-form-actions-error-message'>
            {showValidationError("password")}
          </p>
          <p className='auth-form-actions-error-message'>
            {validationErrors.name
              ? showValidationError("name")
              : showValidationError("surname")}
          </p>
          <button
            onClick={handleSubmit}
            disabled={
              !!validationErrors.username ||
              !!validationErrors.password ||
              !!validationErrors.name ||
              !!validationErrors.surname
            }>
            {action}
          </button>
          <p>
            {linkHeader}&nbsp;
            <Link to={linkTo}>{linkName}</Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default AuthForm;
