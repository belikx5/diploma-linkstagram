import React from 'react';
import styles from './chat.module.scss';
import clx from 'classnames';

type Props = {
	isMyMessage: boolean;
	text: string;
};

const Message = ({ isMyMessage, text }: Props) => {
	return (
		<div className={clx(styles.message, isMyMessage && styles.isMyMessage)}>
			{text}
		</div>
	);
};

export default Message;
