export const validate = (fieldName: string, value: string) => {
  switch (fieldName) {
    case "email": {
      const emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      return emailValid ? "" : "Email is invalid. Please check it";
    }
    case "password":
      const passwordValid = value.length >= 6;
      return passwordValid ? "" : "Password is too short";
    case "username":
      const nicknameValid = value.match(/^[0-9a-zA-Z\.\-_]+$/);
      return nicknameValid ? "" : "Username includes only number and letters";
    case "name":
    case "surname":
      const dataValid = value.match(/^[a-zA-Z ]{2,80}$/);
      return dataValid ? "" : "User personal data includes only letters";
    default:
      break;
  }
};
