import "./editForm.scss";
import React, { useCallback, useEffect } from "react";
import Select from "@material-ui/core/Select";
import {
  Profile,
  ProfileBrief,
} from "../../../store/actionTypes/userActionTypes";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { useTypedDispatch } from "../../../hooks/useTypedDispatch";
import { fetchDeadProfile } from "../../../store/actions/deadProfileActions";
import { fetchUserFollowing } from "../../../store/actions/userActions";

type Props = {
  user: Profile;
  onCheckToggle: (bal: boolean) => void;
  onUsersSelect: (users: number[]) => void;
};

const DeadProfileForm = ({ user, onCheckToggle, onUsersSelect }: Props) => {
  const dispatch = useTypedDispatch();
  const deadProfile = useTypedSelector(
    (state) => state.deadProfileState.deadProfile
  );
  const followings = useTypedSelector((state) => state.userState.following);

  const [checked, setChecked] = React.useState(user.is_dead_profile);
  const [deadProfileFetched, setCheckedDeadProfileFetched] =
    React.useState(false);
  const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setChecked(value);
    onCheckToggle(value);
  };
  const handleChangeMultiple = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { options } = event.target;
      const value = [];
      for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
          value.push(+options[i].value);
        }
      }
      setSelectedUserIds(value);
      onUsersSelect(value);
    },
    [onUsersSelect]
  );

  useEffect(() => {
    if (checked && !deadProfileFetched) {
      dispatch(fetchDeadProfile(user.id));
      setCheckedDeadProfileFetched(true);
    }
  }, [checked, deadProfileFetched, user]);

  useEffect(() => {
    if (deadProfile) {
      const ids = deadProfile.trusted_users.map((u) => u.id);
      setSelectedUserIds(ids);
      onUsersSelect(ids);
    } else {
      setSelectedUserIds([]);
      onUsersSelect([]);
    }
  }, [deadProfile]);

  useEffect(() => {
    dispatch(fetchUserFollowing(user.id, true));
  }, []);

  return (
    <div className='dead-profile-form'>
      <div className='edit-form-item is-dead-checkbox'>
        <label htmlFor='isDead'>Mark as dead</label>
        <input
          checked={checked}
          onChange={handleCheckboxClick}
          id='isDead'
          type='checkbox'
        />
      </div>
      {checked && (
        <div className='edit-form-item'>
          <label>Trusted users</label>
          <Select
            multiple
            native
            value={selectedUserIds}
            // @ts-ignore Typings are not considering `native`
            onChange={handleChangeMultiple}
            label='Native'
            inputProps={{
              id: "select-multiple-native",
            }}>
            {followings.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default DeadProfileForm;
