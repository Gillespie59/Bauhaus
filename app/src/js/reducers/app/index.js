import * as A from 'js/actions/constants';
import { Stores } from 'bauhaus-utilities';
export default function(state = {}, action) {
	const { type, payload } = action;
	if (/FAILURE$/.test(type)) {
		return {
			...state,
			error: true,
		};
	}
	switch (type) {
		case Stores.SecondLang.SAVE_SECOND_LANG: {
			return {
				...state,
				secondLang: payload,
			};
		}
		case A.SAVE_USER_PROPS: {
			return {
				...state,
				auth: { ...state.auth, user: payload },
			};
		}
		case A.CHECK_AUTH: {
			return {
				...state,
				auth: { ...state.auth, user: payload },
			};
		}
		default:
			return state;
	}
}
