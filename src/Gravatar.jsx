import React from 'react';
import md5 from 'blueimp-md5';

const Gravatar = ( props ) => {
	const email        = props.email;
	const size         = props.size || 96;
	const defaultImage = props.defaultImage || 'mm';

	const gravatar_url = 'https://www.gravatar.com/avatar/';
	const md5_hash = md5( email.trim().toLowerCase() );
	const query = '?s=' + size + '&d=' + defaultImage;
	const className = 'avatar avatar-' + size;

	const img_url = gravatar_url + md5_hash + query;
	return (
		<img className={className}
			 src      ={ img_url }
			 width    ={ size }
			 height   ={ size }
		/>
	);
};

export default Gravatar;
