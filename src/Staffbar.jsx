import React from 'react';
import * as _ from 'underscore';

import message from './utils/messages';
import Gravatar from './Gravatar';

const createGravatar = ( props ) => {
	if ( null == props ) {
		return null;
	}

	const { email, size, defaultImage } = props;

	return (
		<Gravatar
			email={ email }
			size={ size }
			defaultImage={ defaultImage }
		/>
	);
};

const Staffbar = ( props ) => {
	const { me, staffs } = props;

	return (
		<div className='rbc-staffbar'>
			<span className='rbc-staffbar-me'>
				{ createGravatar( me ) }
			</span>
			<span className='rbc-staffbar-staffs'>
				{ _.map( staffs, createGravatar ) }
			</span>
			<span className='rbc-staffbar-buttons'>
				<p> 'Show me' </p>
			</span>
		</div>
	);
};

export default Staffbar;
