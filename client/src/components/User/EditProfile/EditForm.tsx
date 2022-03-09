import './editForm.scss';
import React, { useEffect, useState } from 'react';
import history from '../../../services/history';
import Loading from '../../ui/Loading/Loading';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
	fetchCurrentUser,
	editUser,
	logout,
} from '../../../store/actions/userActions';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';

type EditFormProps = {
	openModal?: Function;
};

const EditForm = ({ openModal }: EditFormProps) => {
	const [t] = useTranslation('common');
	const dispatch = useTypedDispatch();
	const { pathname } = useLocation();
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const [name, setName] = useState('');
	const [file, setFile] = useState<any>(null);
	const [previewFile, setPreviewFile] = useState('');
	const [surname, setSurname] = useState('');
	const [description, setDescription] = useState('');
	const [fileLoading, setFileLoading] = useState(false);
	const onSaveClicked = async () => {
		setFileLoading(true);
		const editedAcc = {
			first_name: name,
			bio: description,
			last_name: surname,
			profile_photo: null,
		};
		if (file) editedAcc.profile_photo = file;

		const formData = new FormData();
		Object.entries(editedAcc).forEach(([key, value]) => {
			if (value !== null) formData.append(key, value);
		});
		dispatch(editUser(formData))
			.then(() => {
				if (openModal) {
					openModal(false);
				} else {
					history.push('/profile');
				}
			})
			.finally(() => {
				setFileLoading(false);
			});
	};

	const onCancelClicked = () => {
		if (openModal) {
			openModal(false);
		} else {
			history.push('/profile');
		}
	};

	const onFileChange = (event: any) => {
		setFileLoading(true);
		const file = event.currentTarget.files[0];
		setFile(file);
		setPreviewFile(URL.createObjectURL(file));
		setFileLoading(false);
	};

	const isDisabled = () => fileLoading;

	useEffect(() => {
		if (!currentUser) {
			dispatch(fetchCurrentUser());
		}
	}, []);
	useEffect(() => {
		if (currentUser) {
			setDescription(currentUser.bio || '');
			setName(currentUser.first_name || '');
			setSurname(currentUser.last_name || '');
		}
	}, [currentUser]);

	if (!currentUser) {
		return <Loading />;
	}

	return (
		<div className={`edit-form  ${pathname === '/edit-post' ? 'page' : ''}`}>
			<div className='edit-form-header'>
				<h1>{t('editProfile.profileInfo')}</h1>
				<p onClick={() => dispatch(logout())}>{t('common.logout')}</p>
			</div>
			<div className='edit-form-item horizontal'>
				<div className='edit-form-item image'>
					<label htmlFor='#' className='edit-form-label'>
						{t('editProfile.avatar')}:
					</label>
					<div className='edit-form-item image-load'>
						{previewFile ? (
							<img
								src={previewFile}
								className='edit-form-default-image'
								alt='preview'
							/>
						) : (
							<img
								className='edit-form-default-image'
								src={
									currentUser?.profile_photo
										? currentUser?.profile_photo
										: '../../assets/default-image.svg'
								}
								alt='preview'
							/>
						)}
						<input
							id='file'
							className='edit-form-file-loader uppyForm'
							type='file'
							accept='image/*'
							onChange={onFileChange}
						/>
						<label htmlFor='file' className='edit-form-label'>
							{t('editProfile.choosePhoto')}
						</label>
					</div>
				</div>
				<div className='edit-form-item data'>
					<div className='edit-form-item'>
						<label htmlFor='name' className='edit-form-label'>
							{t('editProfile.fName')}
						</label>
						<input
							id='name'
							className='edit-form-text-input'
							type='text'
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>
					<div className='edit-form-item'>
						<label htmlFor='surname' className='edit-form-label'>
							{t('editProfile.sName')}
						</label>
						<input
							id='surname'
							className='edit-form-text-input'
							type='text'
							value={surname}
							onChange={e => setSurname(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<div className='edit-form-item description'>
				<label htmlFor='description' className='edit-form-label'>
					{t('editProfile.description')}
				</label>
				<textarea
					id='description'
					className='edit-form-textarea'
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
			</div>
			<div className='edit-form-action-item'>
				<button
					disabled={isDisabled()}
					onClick={onSaveClicked}
					className='edit-form-action-button'>
					{t('common.save')}
				</button>
				<button onClick={onCancelClicked} className='edit-form-action-button'>
					{t('common.cancel')}
				</button>
			</div>
		</div>
	);
};

export default EditForm;
