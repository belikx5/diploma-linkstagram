import './dropdown.scss';
import React, { useState } from 'react';
import { useHandleClickOutside } from '../../../hooks/useHandleClickOutside';

type DropdownMenuProps = {
	deletePost: () => void;
	isBright?: boolean;
};

const DropdownMenu = ({ deletePost, isBright = false }: DropdownMenuProps) => {
	const [open, setOpen] = useState(false);

	const handleClick = () => setOpen(!open);
	const [containerRef] = useHandleClickOutside(setOpen);
	return (
		<div className='dropdown-container' ref={containerRef}>
			<button className='dropdown-button' onClick={handleClick}>
				<img
					className='post-header-menu'
					src={`../../assets/menu${isBright ? '-bright' : ''}.svg`}
					alt='menu'
				/>
			</button>
			{open && (
				<div className='dropdown'>
					<ul>
						<li
							onClick={() => {
								deletePost();
								setOpen(false);
							}}>
							Delete
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
