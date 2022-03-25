import './editForm.scss';
import React, { useCallback } from 'react';
import Select from '@material-ui/core/Select';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';

const names = [
	'Oliver Hansen',
	'Van Henry',
	'April Tucker',
	'Ralph Hubbard',
	'Omar Alexander',
	'Carlos Abbott',
	'Miriam Wagner',
	'Bradley Wilkerson',
	'Virginia Andrews',
	'Kelly Snyder',
];

type Props = {
	isChecked: boolean;
	users: ProfileBrief[];
	onCheckToggle: (bal: boolean) => void;
	onUsersSelect: (users: number[]) => void;
};

const DeadProfileForm = ({
	isChecked,
	users,
	onCheckToggle,
	onUsersSelect,
}: Props) => {
	const [checked, setChecked] = React.useState(isChecked);
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
							id: 'select-multiple-native',
						}}>
						{users.map(u => (
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
